import type { GenerateActorParams, GenerationResult } from './types.ts';

/**
 * ReLaunch Studio — Node 5.5: Arcads.ai / Creatify.ai Actor Integration Client
 * Generates photorealistic talking-head creator actors reciting ad hooks and testimonial scripts.
 */

export async function generateActorClip(
  params: GenerateActorParams
): Promise<GenerationResult> {
  const arcadsKey = process.env.ARCADS_API_KEY;
  const aspectRatio = params.aspectRatio || '9:16';
  const gender = params.actorGender || 'female';
  const ageGroup = params.actorAgeGroup || 'young_adult';

  if (!arcadsKey) {
    // Deterministic mock fallback
    return {
      assetId: `actor-${Date.now()}`,
      url: `https://storage.relaunch.us/mock-assets/ugc-actor-${gender}-${aspectRatio.replace(':', 'x')}.mp4`,
      durationSeconds: 15,
      modelUsed: 'arcads-v2',
      provider: 'mock-studio',
      isMock: true,
      metadata: {
        scriptText: params.scriptText,
        gender,
        ageGroup,
        style: params.actorStyle || 'relatable_ugc',
        aspectRatio,
        engine: 'Arcads.ai UGC Video Engine',
      },
    };
  }

  // Live Arcads API dispatch
  const response = await fetch('https://api.arcads.ai/v1/videos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${arcadsKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: params.scriptText,
      gender,
      age: ageGroup,
      aspect_ratio: aspectRatio,
      voice_id: params.voiceStyle || 'default',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Arcads API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return {
    assetId: result.id || `actor-${Date.now()}`,
    url: result.video_url || '',
    durationSeconds: result.duration || 15,
    modelUsed: 'arcads-v2',
    provider: 'arcads',
    isMock: false,
    metadata: result,
  };
}
