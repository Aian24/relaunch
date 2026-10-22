import fs from 'fs';
import path from 'path';
import { Worker, Job } from 'bullmq';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { updateVariantStatus, logComplianceRecord } from './db';
import { uploadFile, downloadFile, BUCKET_VARIANTS } from './storage';
import { exportMultiRatio } from './ffmpeg';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * ReLaunch Studio — BullMQ Queue Worker
 * Pulls video render jobs off the Redis queue, compiles Remotion compositions,
 * normalizes audio, and stores compliant ad variants in S3/R2.
 */

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const scratchDir = path.resolve('/tmp/studio-render-scratch');

if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

let bundledTemplateCache: string | null = null;

async function getOrBuildBundle(): Promise<string> {
  if (bundledTemplateCache && fs.existsSync(bundledTemplateCache)) {
    return bundledTemplateCache;
  }
  const entryPoint = path.resolve(__dirname, '../templates/Root.tsx');
  console.log(`[Remotion] Bundling template entry point: ${entryPoint}...`);
  bundledTemplateCache = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log(`[Remotion] Template bundle ready at: ${bundledTemplateCache}`);
  return bundledTemplateCache;
}

/**
 * Transcribe voiceover via faster-whisper Python script
 */
async function extractWhisperTimings(audioPath: string): Promise<any[]> {
  const pythonScript = path.resolve(__dirname, 'whisper.py');
  try {
    const { stdout } = await execAsync(`python3 "${pythonScript}" "${audioPath}"`);
    const parsed = JSON.parse(stdout);
    return parsed.words || [];
  } catch (err: any) {
    console.warn(`[Whisper] Transcription fallback: ${err.message}`);
    return [];
  }
}

/**
 * Process a single video ad variant rendering job
 */
async function processRenderJob(job: Job) {
  const { variantId, scriptId, renderSpec, hookUrl, actorUrl, brollUrl, voiceoverUrl, musicUrl } = job.data;
  const jobDir = path.join(scratchDir, `job-${variantId}`);
  fs.mkdirSync(jobDir, { recursive: true });

  console.log(`\n========================================================`);
  console.log(`[Worker] Starting render job for Variant: ${variantId}`);
  console.log(`[Worker] Script ID: ${scriptId}`);
  console.log(`========================================================`);

  try {
    // 1. Download assets from S3 if URLs provided
    let localVoPath = '';
    if (voiceoverUrl && voiceoverUrl.startsWith('s3://')) {
      const key = voiceoverUrl.replace(/^s3:\/\/[^/]+\//, '');
      localVoPath = path.join(jobDir, 'voice.mp3');
      await downloadFile(key, localVoPath);
    }

    // 2. Extract kinetic captions via faster-whisper
    let words = [];
    if (localVoPath && fs.existsSync(localVoPath)) {
      console.log(`[Worker] Extracting word-level timestamps...`);
      words = await extractWhisperTimings(localVoPath);
    }

    // 3. Bundle Remotion templates
    const bundleLocation = await getOrBuildBundle();

    // 4. Select 9:16 vertical composition
    const compositionId = 'ProblemSolution-9x16';
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: {
        hookVideoUrl: hookUrl,
        actorVideoUrl: actorUrl,
        brollVideoUrl: brollUrl,
        voiceoverAudioUrl: voiceoverUrl,
        musicAudioUrl: musicUrl,
        hookText: renderSpec?.cta?.text || 'Stop scrolling if your CPA keeps climbing',
        ctaText: renderSpec?.cta?.text || 'Claim 20% Off Today',
        words,
        disclosureLabel: 'AI-Generated Media',
      },
    });

    // 5. Render 9:16 Master Video MP4
    const masterPath = path.join(jobDir, `${variantId}-9x16.mp4`);
    console.log(`[Remotion] Rendering ${composition.durationInFrames} frames to ${masterPath}...`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: masterPath,
      concurrency: 2,
    });

    // 6. Multi-Ratio Exports (1:1 Square, 4:5 Portrait, Thumbnail)
    console.log(`[FFmpeg] Exporting multi-ratio crops and thumbnail...`);
    const exports = await exportMultiRatio(masterPath, jobDir, variantId);

    // 7. Upload final outputs to S3 / Cloudflare R2
    console.log(`[S3] Uploading rendered variants to ${BUCKET_VARIANTS}...`);
    const key9x16 = `variants/${variantId}/master-9x16.mp4`;
    const key1x1 = `variants/${variantId}/feed-1x1.mp4`;
    const key4x5 = `variants/${variantId}/feed-4x5.mp4`;
    const keyThumb = `thumbnails/${variantId}.jpg`;

    const [url9x16, , , urlThumb] = await Promise.all([
      uploadFile(exports.path9x16, key9x16, 'video/mp4', BUCKET_VARIANTS),
      uploadFile(exports.path1x1, key1x1, 'video/mp4', BUCKET_VARIANTS),
      uploadFile(exports.path4x5, key4x5, 'video/mp4', BUCKET_VARIANTS),
      uploadFile(exports.thumbnailPath, keyThumb, 'image/jpeg', 'relaunch-thumbnails'),
    ]);

    // 8. Update database variant status to 'needs_review'
    await updateVariantStatus(variantId, 'needs_review', {
      storage_url: url9x16,
      thumbnail_url: urlThumb,
    });

    // 9. Append legal audit record
    await logComplianceRecord({
      variant_id: variantId,
      ai_elements: ['AI Actor Talking Head', 'AI Scene B-Roll', 'Synthetic Voiceover'],
      label_applied: 'AI-Generated Media (Burned in Remotion Layer)',
      license_refs_json: {
        actor_platform: 'Arcads.ai / Creatify Enterprise License',
        music_license_ref: 'Epidemic Sound Commercial License #ES-2026-STUDIO',
        generator_models: ['Grok Imagine 1.5', 'ElevenLabs Turbo v2.5'],
      },
    });

    console.log(`[Worker] Job complete! Variant ${variantId} transitioned to 'needs_review' ✓`);
    return { success: true, variantId, url: url9x16 };
  } catch (err: any) {
    console.error(`[Worker] Render job failed:`, err);
    throw err;
  } finally {
    // Cleanup scratch folder
    try {
      fs.rmSync(jobDir, { recursive: true, force: true });
    } catch {}
  }
}

/**
 * Initialize BullMQ Worker instance
 */
export function startWorker() {
  console.log(`[Worker] Connecting to Redis queue at ${redisUrl}...`);
  const worker = new Worker('render-jobs', processRenderJob, {
    connection: {
      url: redisUrl,
    },
    concurrency: 1, // 1 render at a time to prevent CPU starvation on VPS
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}

if (require.main === module) {
  startWorker();
}
