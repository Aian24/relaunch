import type { GenerateSceneParams, GenerationResult } from './types.ts';

/**
 * ReLaunch Studio — Node 5.2: Grok Imagine (Video 1.5) Client
 * Primary high-volume social ad b-roll engine (~$0.08/sec).
 * Generates dynamic 6s/720p/1080p video clips with high physical realism.
 */

export async function generateGrokVideo(
  params: GenerateSceneParams
): Promise<GenerationResult> {
  const falKey = process.env.FAL_KEY;
  const duration = params.durationSeconds || 5;
  const aspectRatio = params.aspectRatio || '9:16';

  if (!falKey) {
    // Deterministic mock fallback for development & offline pipeline testing
    const seed = params.seed || Math.floor(Math.random() * 1000000);
    return {
      assetId: `grok-${Date.now()}-${seed}`,
      url: `https://storage.relaunch.us/mock-assets/grok-broll-${aspectRatio.replace(':', 'x')}.mp4`,
      durationSeconds: duration,
      modelUsed: 'grok-1.5',
      provider: 'mock-studio',
      isMock: true,
      metadata: {
        prompt: params.prompt,
        aspectRatio,
        durationSeconds: duration,
        seed,
        engine: 'xAI Grok Imagine Video 1.5',
      },
    };
  }

  // Live fal.ai API dispatch
  const response = await fetch('https://queue.fal.run/fal-ai/xai/grok-video-1.5', {
    method: 'POST',
    headers: {
      Authorization: `Key ${falKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: params.prompt,
      duration: duration,
      aspect_ratio: aspectRatio,
      seed: params.seed,
      negative_prompt: params.negativePrompt || 'low quality, blurry, distorted, anatomical defects',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai Grok Imagine error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const videoUrl = result.video?.url || result.output?.[0] || '';

  return {
    assetId: `grok-${Date.now()}`,
    url: videoUrl,
    durationSeconds: duration,
    modelUsed: 'grok-1.5',
    provider: 'fal.ai',
    isMock: false,
    metadata: result,
  };
}
