import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ReLaunch Studio — S3-Compatible Object Storage Wrapper
 * Supports Cloudflare R2 (recommended for zero-egress video delivery) or self-hosted MinIO
 */

const endpoint = process.env.S3_ENDPOINT || 'https://af80435123d1da98caf7c1cc92a63d1a.r2.cloudflarestorage.com';
const region = process.env.S3_REGION || 'auto';
const accessKeyId = process.env.S3_ACCESS_KEY_ID || '335b0d6569bca6d02cac03c52c3fad8a';
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || '3f10240de7abbc2d4ec957cd1c98ea9fe0aee382b74cb73e19b925970b14e63a';

export const BUCKET_RAW = process.env.S3_BUCKET_RAW || 'relaunch-raw-assets';
export const BUCKET_VARIANTS = process.env.S3_BUCKET_VARIANTS || 'relaunch-rendered-variants';
export const BUCKET_THUMBNAILS = process.env.S3_BUCKET_THUMBNAILS || 'relaunch-thumbnails';

export const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true, // Needed for MinIO and R2 compatibility
});

/**
 * Upload a local file to S3/R2 storage
 */
export async function uploadFile(
  localPath: string,
  key: string,
  contentType = 'video/mp4',
  bucket = BUCKET_VARIANTS
): Promise<string> {
  try {
    const fileStream = fs.createReadStream(localPath);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
    });

    await s3.send(command);

    if (process.env.S3_PUBLIC_DOMAIN) {
      return `${process.env.S3_PUBLIC_DOMAIN}/${key}`;
    }
    return `s3://${bucket}/${key}`;
  } catch (err: any) {
    console.warn(`[Storage Warning] R2 bucket "${bucket}" upload failed (${err.name}: ${err.message}). Falling back to local storage.`);
    // Local fallback directory
    const fallbackDir = path.resolve(__dirname, '../../../../public/storage/variants');
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    const destPath = path.join(fallbackDir, path.basename(key));
    fs.copyFileSync(localPath, destPath);
    return `/storage/variants/${path.basename(key)}`;
  }
}

/**
 * Download a file from S3/R2 to local disk
 */
export async function downloadFile(
  key: string,
  localDestPath: string,
  bucket = BUCKET_RAW
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await s3.send(command);
    if (!response.Body) {
      throw new Error(`S3 object body is empty for key: ${key}`);
    }

    // Ensure destination directory exists
    const dir = path.dirname(localDestPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(localDestPath);
    await pipeline(response.Body as any, writeStream);

    return localDestPath;
  } catch (err: any) {
    // Check if file exists in public/
    const publicPath = path.resolve(__dirname, '../../../../public', key.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) {
      const dir = path.dirname(localDestPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(publicPath, localDestPath);
      return localDestPath;
    }
    throw err;
  }
}

/**
 * Generate a presigned streaming / preview URL (expires in seconds)
 */
export async function getSignedPreviewUrl(
  key: string,
  expiresInSeconds = 3600,
  bucket = BUCKET_VARIANTS
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

/**
 * Check if an object exists in storage
 */
export async function fileExists(key: string, bucket = BUCKET_VARIANTS): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (err: any) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw err;
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(key: string, bucket = BUCKET_VARIANTS): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await s3.send(command);
}
