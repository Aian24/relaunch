import type { GenerateSceneParams, GenerationResult } from './types.ts';

/**
 * ReLaunch Studio — Node 5.4: ByteDance Seedance 2.0 (Product Image-to-Video) Client
 * Animates static client product still photos into dynamic 3D camera sweeps and lighting passes.
 */

export async function generateSeedanceVideo(
  params: GenerateSceneParams
): Promise<GenerationResult> {
  const falKey = process.env.FAL_KEY;
  const duration = params.durationSeconds || 4;
  const aspectRatio = params.aspectRatio || '9:16';

  if (!falKey) {
    // Deterministic mock fallback
    return {
      assetId: `seedance-${Date.now()}`,
      url: `https://storage.relaunch.us/mock-assets/seedance-product-spin.mp4`,
      durationSeconds: duration,
      modelUsed: 'seedance-2',
      provider: 'mock-studio',
      isMock: true,
      metadata: {
        prompt: params.prompt,
        imagePromptUrl: params.imagePromptUrl || 'https://storage.relaunch.us/mock-assets/product-hero.png',
        aspectRatio,
        durationSeconds: duration,
        engine: 'ByteDance Seedance 2.0 Product Motion',
      },
    };
  }

  // Live fal.ai Seedance Image-to-Video dispatch
  const response = await fetch('https://queue.fal.run/fal-ai/bytedance/seedance-2', {
    method: 'POST',
    headers: {
      Authorization: `Key ${falKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: params.prompt,
      image_url: params.imagePromptUrl,
      duration: duration,
      aspect_ratio: aspectRatio,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Seedance 2.0 error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return {
    assetId: `seedance-${Date.now()}`,
    url: result.video?.url || result.output?.[0] || '',
    durationSeconds: duration,
    modelUsed: 'seedance-2',
    provider: 'fal.ai',
    isMock: false,
    metadata: result,
  };
}
