import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface VideoProbeInfo {
  duration: number;
  width?: number;
  height?: number;
  codec?: string;
  hasAudio: boolean;
  isHevc: boolean;
}

export function findFfmpegBinary(): string {
  const localFfmpeg = path.join(
    process.cwd(),
    "node_modules",
    "ffmpeg-static",
    process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
  );
  if (fs.existsSync(localFfmpeg)) return localFfmpeg;

  try {
    // eslint-disable-next-line no-eval
    const dynamicReq = eval("require");
    const staticPath = dynamicReq("ffmpeg-static");
    if (staticPath && fs.existsSync(staticPath)) return staticPath;
  } catch {}

  for (const sysPath of ["/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/bin/ffmpeg"]) {
    if (fs.existsSync(sysPath)) return sysPath;
  }
  return "ffmpeg";
}

export async function probeVideoMetadata(inputPath: string): Promise<VideoProbeInfo> {
  const ffmpeg = findFfmpegBinary();
  let stderr = "";
  try {
    await execFileAsync(ffmpeg, ["-i", inputPath], { timeout: 15000 });
  } catch (err: any) {
    // ffmpeg -i without output exits with code 1 and prints stream info to stderr
    stderr = String(err?.stderr || err?.message || "");
  }

  let duration = 0;
  const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (durMatch) {
    duration =
      Number(durMatch[1]) * 3600 +
      Number(durMatch[2]) * 60 +
      Number(durMatch[3]);
  }

  let codec: string | undefined;
  let width: number | undefined;
  let height: number | undefined;
  const videoMatch = stderr.match(/Video:\s*([a-zA-Z0-9_]+)[^\n]*?,\s*(\d{2,5})x(\d{2,5})/);
  if (videoMatch) {
    codec = videoMatch[1].toLowerCase();
    width = Number(videoMatch[2]);
    height = Number(videoMatch[3]);
  }

  const hasAudio = /Audio:/i.test(stderr);
  const isHevc = Boolean(codec && (codec.includes("hevc") || codec.includes("h265") || codec.includes("hvc1")));

  return {
    duration: Number(duration.toFixed(2)),
    width,
    height,
    codec,
    hasAudio,
    isHevc,
  };
}

/**
 * Transcodes raw client footage (especially HEVC / .mov phone recordings)
 * into browser-playable H.264 / AAC MP4 with faststart metadata.
 */
export async function transcodeToPlayableMp4(
  inputPath: string,
  outputPath: string,
  probe?: VideoProbeInfo
): Promise<void> {
  const ffmpeg = findFfmpegBinary();
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const info = probe || (await probeVideoMetadata(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  const canStreamCopy = ext === ".mp4" && info.codec === "h264";

  if (canStreamCopy) {
    try {
      await execFileAsync(
        ffmpeg,
        ["-y", "-i", inputPath, "-c", "copy", "-movflags", "+faststart", outputPath],
        { timeout: 180000 }
      );
      return;
    } catch {
      // Fall through to full re-encode if stream copy fails
    }
  }

  const args = [
    "-y",
    "-i",
    inputPath,
    "-vf",
    "scale='min(1920,iw)':-2",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "21",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
  ];
  if (info.hasAudio) {
    args.push("-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-ac", "2");
  } else {
    args.push("-an");
  }
  args.push(outputPath);

  await execFileAsync(ffmpeg, args, { timeout: 300000, maxBuffer: 10 * 1024 * 1024 });
}

/**
 * Generates a poster thumbnail and a horizontal 10-frame scrubbing sprite sheet.
 */
export async function generateScrubbingSprite(
  videoPath: string,
  outSpritePath: string,
  outThumbPath: string,
  durationSec: number
): Promise<void> {
  const ffmpeg = findFfmpegBinary();
  for (const p of [outSpritePath, outThumbPath]) {
    const d = path.dirname(p);
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  const posterTime = Math.max(0, Math.min(0.5, durationSec > 0 ? durationSec / 2 : 0));
  await execFileAsync(
    ffmpeg,
    ["-y", "-ss", posterTime.toFixed(2), "-i", videoPath, "-vframes", "1", "-q:v", "3", outThumbPath],
    { timeout: 30000 }
  );

  const safeDur = Math.max(1, durationSec || 5);
  const fpsVal = (10 / safeDur).toFixed(4);
  try {
    await execFileAsync(
      ffmpeg,
      [
        "-y",
        "-i",
        videoPath,
        "-vf",
        `fps=${fpsVal},scale=160:-2,tile=10x1`,
        "-frames:v",
        "1",
        "-q:v",
        "4",
        outSpritePath,
      ],
      { timeout: 60000 }
    );
  } catch (err) {
    console.warn("[ffmpegUtils] Sprite generation fallback to single frame:", err);
    if (fs.existsSync(outThumbPath) && !fs.existsSync(outSpritePath)) {
      fs.copyFileSync(outThumbPath, outSpritePath);
    }
  }
}

/**
 * Generates a lightweight 480p preview MP4 + thumbnail for a virtual clip.
 */
export async function renderClipPreview(
  sourcePath: string,
  inPoint: number,
  outPoint: number,
  outPreviewPath: string,
  outThumbPath?: string
): Promise<void> {
  const ffmpeg = findFfmpegBinary();
  const dir = path.dirname(outPreviewPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const dur = Math.max(0.2, outPoint - inPoint);
  await execFileAsync(
    ffmpeg,
    [
      "-y",
      "-ss",
      inPoint.toFixed(1),
      "-i",
      sourcePath,
      "-t",
      dur.toFixed(1),
      "-vf",
      "scale='min(640,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "26",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "+faststart",
      outPreviewPath,
    ],
    { timeout: 60000 }
  );

  if (outThumbPath) {
    const tDir = path.dirname(outThumbPath);
    if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
    await execFileAsync(
      ffmpeg,
      ["-y", "-ss", inPoint.toFixed(1), "-i", sourcePath, "-vframes", "1", "-q:v", "3", outThumbPath],
      { timeout: 30000 }
    );
  }
}

