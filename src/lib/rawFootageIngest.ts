import fs from "fs";
import path from "path";
import { getRawFootageById, updateRawFootage } from "@/lib/clientStore";
import {
  generateScrubbingSprite,
  probeVideoMetadata,
  transcodeToPlayableMp4,
} from "@/lib/ffmpegUtils";
import {
  BUCKET_RAW,
  BUCKET_THUMBNAILS,
  getLocalStoragePath,
  resolveStorageToLocalFile,
  uploadStudioObject,
} from "@/lib/r2Storage";

/**
 * Processes a newly uploaded raw video file:
 * 1. Marks status = 'processing'
 * 2. Probes metadata (duration, codec, resolution)
 * 3. Transcodes HEVC / .mov to web-playable H.264/AAC faststart MP4
 * 4. Generates thumbnail + 10-frame scrubbing sprite sheet
 * 5. Uploads derived assets to R2 (or local storage fallback) and sets status = 'processed'
 */
export async function processRawFootageIngest(
  rawId: string,
  clientSlug: string,
  localInputPath?: string
): Promise<void> {
  const record = await getRawFootageById(rawId);
  if (!record) return;

  await updateRawFootage(rawId, { status: "processing", errorMessage: undefined });

  const tempWorkDir = path.resolve(process.cwd(), "public", "storage", "tmp", rawId);
  if (!fs.existsSync(tempWorkDir)) fs.mkdirSync(tempWorkDir, { recursive: true });

  try {
    const sourcePath =
      localInputPath && fs.existsSync(localInputPath)
        ? localInputPath
        : await resolveStorageToLocalFile(
            record.storageUrl,
            path.join(tempWorkDir, `raw-${record.filename}`)
          );

    if (!sourcePath || !fs.existsSync(sourcePath)) {
      throw new Error("Could not locate uploaded raw video file for transcode.");
    }

    const probe = await probeVideoMetadata(sourcePath);

    const playableRelKey = `clients/${clientSlug}/playable/${rawId}.mp4`;
    const spriteRelKey = `clients/${clientSlug}/sprites/${rawId}-sprite.jpg`;
    const thumbRelKey = `clients/${clientSlug}/thumbs/${rawId}-thumb.jpg`;

    const playableLocal = getLocalStoragePath(playableRelKey).diskPath;
    const spriteLocal = getLocalStoragePath(spriteRelKey).diskPath;
    const thumbLocal = getLocalStoragePath(thumbRelKey).diskPath;

    await transcodeToPlayableMp4(sourcePath, playableLocal, probe);

    const finalProbe = probe.duration > 0 ? probe : await probeVideoMetadata(playableLocal);
    await generateScrubbingSprite(playableLocal, spriteLocal, thumbLocal, finalProbe.duration);

    const [playableUrl, spriteUrl, thumbnailUrl] = await Promise.all([
      uploadStudioObject(playableLocal, playableRelKey, "video/mp4", BUCKET_RAW),
      uploadStudioObject(spriteLocal, spriteRelKey, "image/jpeg", BUCKET_THUMBNAILS),
      uploadStudioObject(thumbLocal, thumbRelKey, "image/jpeg", BUCKET_THUMBNAILS),
    ]);

    await updateRawFootage(rawId, {
      playableUrl,
      spriteUrl,
      thumbnailUrl,
      duration: finalProbe.duration || 10,
      codec: probe.codec || "h264",
      width: probe.width,
      height: probe.height,
      status: "processed",
    });
  } catch (err: any) {
    console.error(`[RawIngest] Failed processing ${rawId}:`, err);
    await updateRawFootage(rawId, {
      status: "failed",
      errorMessage: err?.message || "Transcode failed",
    });
  } finally {
    try {
      if (fs.existsSync(tempWorkDir)) {
        fs.rmSync(tempWorkDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

