import type { GenerateVoiceoverParams, VoiceoverResult } from './types.ts';

/**
 * ReLaunch Studio — Node 5.6: ElevenLabs Branded Voiceover Client
 * Generates custom voiceover tracks with conversational cadence, speech-to-speech emotion, and word timestamps.
 */

export async function generateVoiceover(
  params: GenerateVoiceoverParams
): Promise<VoiceoverResult> {
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = params.voiceId || process.env.DEFAULT_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam (verified premade)

  if (!elevenKey) {
    // Generate clean word timing mock for development & local captions verification
    const words = params.text.split(/\s+/).filter(Boolean);
    let currentTime = 0.2;
    const wordTimestamps = words.map((w) => {
      const duration = Math.max(0.2, (w.length / 5) * 0.35);
      const start = Math.round(currentTime * 100) / 100;
      currentTime += duration;
      const end = Math.round(currentTime * 100) / 100;
      return { word: w, start, end };
    });

    return {
      assetId: `vo-${Date.now()}`,
      url: 'https://storage.relaunch.us/mock-assets/voiceover-clean.mp3',
      durationSeconds: Math.ceil(currentTime + 0.5),
      modelUsed: 'eleven_turbo_v2_5',
      provider: 'mock-studio',
      isMock: true,
      words: wordTimestamps,
      metadata: {
        text: params.text,
        voiceId,
        wordCount: words.length,
        engine: 'ElevenLabs Conversational Engine (Mock)',
      },
    };
  }

  // Live ElevenLabs with timestamps API
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': elevenKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: params.text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: params.stability ?? 0.5,
          similarity_boost: params.similarityBoost ?? 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const audioBase64 = result.audio_base64;
  const alignment = result.alignment;

  // Map alignment to word timestamps
  const words: Array<{ word: string; start: number; end: number }> = [];
  if (alignment?.characters && alignment?.character_start_times_seconds) {
    let currentWord = '';
    let wordStart = 0;
    for (let i = 0; i < alignment.characters.length; i++) {
      const char = alignment.characters[i];
      const start = alignment.character_start_times_seconds[i];
      const end = alignment.character_end_times_seconds[i];
      if (char === ' ') {
        if (currentWord) {
          words.push({ word: currentWord, start: wordStart, end });
          currentWord = '';
        }
      } else {
        if (!currentWord) wordStart = start;
        currentWord += char;
      }
    }
    if (currentWord) {
      words.push({
        word: currentWord,
        start: wordStart,
        end: alignment.character_end_times_seconds[alignment.characters.length - 1],
      });
    }
  }

  return {
    assetId: `vo-${Date.now()}`,
    url: `data:audio/mp3;base64,${audioBase64}`,
    durationSeconds: words[words.length - 1]?.end || 15,
    modelUsed: 'eleven_turbo_v2_5',
    provider: 'elevenlabs',
    isMock: false,
    words,
    metadata: {
      voiceId,
      alignmentStats: words.length,
    },
  };
}
