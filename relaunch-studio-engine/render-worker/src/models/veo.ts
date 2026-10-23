import type { GenerateSceneParams, GenerationResult } from './types.ts';

/**
 * ReLaunch Studio — Node 5.3: Google Veo 3.1 Client
 * Premium cinematic hero shots with high visual fidelity, photorealism, and native audio.
 * Accessed via Vertex AI or fal.ai Veo gateway.
 */

export async function generateVeoVideo(
  params: GenerateSceneParams
): Promise<GenerationResult> {
  const falKey = process.env.FAL_KEY;
  const vertexToken = process.env.GOOGLE_VERTEX_ACCESS_TOKEN;
  const duration = params.durationSeconds || 5;
  const aspectRatio = params.aspectRatio || '9:16';

  if (!falKey && !vertexToken) {
    // Deterministic mock fallback
    const seed = params.seed || Math.floor(Math.random() * 1000000);
    return {
      assetId: `veo-${Date.now()}-${seed}`,
      url: `https://storage.relaunch.us/mock-assets/veo-hero-${aspectRatio.replace(':', 'x')}.mp4`,
      durationSeconds: duration,
      modelUsed: 'veo-3.1',
      provider: 'mock-studio',
      isMock: true,
      metadata: {
        prompt: params.prompt,
        aspectRatio,
        durationSeconds: duration,
        engine: 'Google Veo 3.1 Cinematic Engine',
      },
    };
  }

  // Live fal.ai Veo 3 gateway
  const response = await fetch('https://queue.fal.run/fal-ai/google/veo-3', {
    method: 'POST',
    headers: {
      Authorization: `Key ${falKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: params.prompt,
      duration: duration,
      aspect_ratio: aspectRatio,
      generate_audio: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Veo error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return {
    assetId: `veo-${Date.now()}`,
    url: result.video?.url || result.output?.[0] || '',
    durationSeconds: duration,
    modelUsed: 'veo-3.1',
    provider: 'fal.ai',
    isMock: false,
    metadata: result,
  };
}
