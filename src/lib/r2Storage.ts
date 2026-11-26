import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT?.trim() || "";
const region = process.env.S3_REGION?.trim() || "auto";
const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim() || "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim() || "";

export const BUCKET_RAW = process.env.S3_BUCKET_RAW?.trim() || "relaunch-raw-assets";
export const BUCKET_VARIANTS = process.env.S3_BUCKET_VARIANTS?.trim() || "relaunch-rendered-variants";
export const BUCKET_THUMBNAILS = process.env.S3_BUCKET_THUMBNAILS?.trim() || "relaunch-thumbnails";
export const S3_PUBLIC_DOMAIN = process.env.S3_PUBLIC_DOMAIN?.trim() || "";

export function isR2Configured(): boolean {
  return Boolean(endpoint && accessKeyId && secretAccessKey);
}

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client | null {
  if (!isR2Configured()) return null;
  if (!cachedClient) {
    cachedClient = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }
  return cachedClient;
}

/**
 * Ensure a local fallback storage path under public/storage/ and return the public URL path.
 */
export function getLocalStoragePath(relPath: string): { diskPath: string; publicUrl: string } {
  const clean = relPath.replace(/^\/+/, "");
  const diskPath = path.resolve(process.cwd(), "public", "storage", clean);
  const dir = path.dirname(diskPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return {
    diskPath,
    publicUrl: `/storage/${clean.replace(/\\/g, "/")}`,
  };
}

/**
 * Upload a local file to Cloudflare R2 (if configured and reachable), else copy/persist to public/storage/.
 */
export async function uploadStudioObject(
  localPath: string,
  key: string,
  contentType = "video/mp4",
  bucket = BUCKET_RAW
): Promise<string> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");

  if (client) {
    try {
      const fileStream = fs.createReadStream(localPath);
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: cleanKey,
          Body: fileStream,
          ContentType: contentType,
        })
      );
      if (S3_PUBLIC_DOMAIN) {
        return `${S3_PUBLIC_DOMAIN.replace(/\/+$/, "")}/${cleanKey}`;
      }
      return `s3://${bucket}/${cleanKey}`;
    } catch (err: any) {
      console.warn(`[R2Storage] Upload to ${bucket}/${cleanKey} failed (${err?.message}). Using local fallback.`);
    }
  }

  const { diskPath, publicUrl } = getLocalStoragePath(cleanKey);
  if (path.resolve(localPath) !== path.resolve(diskPath)) {
    fs.copyFileSync(localPath, diskPath);
  }
  return publicUrl;
}

/**
 * Upload a Buffer directly to Cloudflare R2 or local fallback.
 */
export async function uploadStudioBuffer(
  buffer: Buffer,
  key: string,
  contentType: string,
  bucket = BUCKET_RAW
): Promise<string> {
  const client = getR2Client();
  const cleanKey = key.replace(/^\/+/, "");

  if (client) {
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: cleanKey,
          Body: buffer,
          ContentType: contentType,
        })
      );
      if (S3_PUBLIC_DOMAIN) {
        return `${S3_PUBLIC_DOMAIN.replace(/\/+$/, "")}/${cleanKey}`;
      }
      return `s3://${bucket}/${cleanKey}`;
    } catch (err: any) {
      console.warn(`[R2Storage] Buffer upload failed (${err?.message}). Using local fallback.`);
    }
  }

  const { diskPath, publicUrl } = getLocalStoragePath(cleanKey);
  fs.writeFileSync(diskPath, buffer);
  return publicUrl;
}

/**
 * Resolve any studio storage reference (`/storage/...`, `/videos/...`, `s3://bucket/key`, or `https://...`)
 * to a local file path on disk (downloading from R2/HTTP if needed).
 */
export async function resolveStorageToLocalFile(
  storageUrl: string,
  localTempDest?: string
): Promise<string | null> {
  if (!storageUrl) return null;

  if (storageUrl.startsWith("/")) {
    const disk = path.resolve(process.cwd(), "public", storageUrl.replace(/^\/+/, ""));
    return fs.existsSync(disk) ? disk : null;
  }

  if (storageUrl.startsWith("s3://")) {
    const withoutScheme = storageUrl.slice(5);
    const slashIdx = withoutScheme.indexOf("/");
    if (slashIdx === -1) return null;
    const bucket = withoutScheme.slice(0, slashIdx);
    const key = withoutScheme.slice(slashIdx + 1);

    // First check local mirror if present
    const localMirror = path.resolve(process.cwd(), "public", "storage", key);
    if (fs.existsSync(localMirror)) return localMirror;

    const client = getR2Client();
    if (!client) return null;

    const dest = localTempDest || localMirror;
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!res.Body) return null;
    await pipeline(res.Body as any, fs.createWriteStream(dest));
    return dest;
  }

  if (storageUrl.startsWith("http://") || storageUrl.startsWith("https://")) {
    if (S3_PUBLIC_DOMAIN && storageUrl.startsWith(S3_PUBLIC_DOMAIN.replace(/\/+$/, ""))) {
      const relKey = storageUrl.slice(S3_PUBLIC_DOMAIN.replace(/\/+$/, "").length).replace(/^\/+/, "");
      const localMirror = path.resolve(process.cwd(), "public", "storage", relKey);
      if (fs.existsSync(localMirror)) return localMirror;
    }

    const dest =
      localTempDest ||
      path.resolve(process.cwd(), "public", "storage", "tmp", `dl-${Date.now()}-${path.basename(new URL(storageUrl).pathname)}`);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const resp = await fetch(storageUrl);
    if (!resp.ok) return null;
    const buf = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return dest;
  }

  return null;
}

/**
 * Create a presigned PUT URL for direct browser-to-R2 raw upload.
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  bucket = BUCKET_RAW,
  expiresInSeconds = 900
): Promise<{ uploadUrl: string; storageUrl: string } | null> {
  const client = getR2Client();
  if (!client) return null;
  const cleanKey = key.replace(/^\/+/, "");
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: cleanKey, ContentType: contentType }),
    { expiresIn: expiresInSeconds }
  );
  const storageUrl = S3_PUBLIC_DOMAIN
    ? `${S3_PUBLIC_DOMAIN.replace(/\/+$/, "")}/${cleanKey}`
    : `s3://${bucket}/${cleanKey}`;
  return { uploadUrl, storageUrl };
}

/**
 * Best-effort delete of an object in R2 or local storage.
 */
export async function deleteStudioObject(storageUrl: string): Promise<void> {
  if (!storageUrl) return;
  if (storageUrl.startsWith("/storage/")) {
    const disk = path.resolve(process.cwd(), "public", storageUrl.replace(/^\/+/, ""));
    if (fs.existsSync(disk)) {
      try {
        fs.unlinkSync(disk);
      } catch {}
    }
    return;
  }
  if (storageUrl.startsWith("s3://")) {
    const client = getR2Client();
    if (!client) return;
    const withoutScheme = storageUrl.slice(5);
    const slashIdx = withoutScheme.indexOf("/");
    if (slashIdx === -1) return;
    const bucket = withoutScheme.slice(0, slashIdx);
    const key = withoutScheme.slice(slashIdx + 1);
    try {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    } catch {}
  }
}

