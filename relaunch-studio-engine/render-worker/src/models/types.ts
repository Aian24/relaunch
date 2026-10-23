/**
 * ReLaunch Studio — Phase 5: Video Gen Router & Asset Generation APIs
 * Type Definitions & Parameter Contracts
 */

export type VideoModel = 'grok-1.5' | 'veo-3.1' | 'seedance-2' | 'kling-3';
export type AspectRatioOption = '9:16' | '16:9' | '1:1' | '4:5';

export interface GenerateSceneParams {
  prompt: string;
  imagePromptUrl?: string;
  durationSeconds?: number; // Standard: 3 to 6s
  aspectRatio?: AspectRatioOption;
  model?: VideoModel;
  seed?: number;
  negativePrompt?: string;
}

export interface GenerateActorParams {
  scriptText: string;
  actorGender?: 'female' | 'male' | 'any';
  actorAgeGroup?: 'young_adult' | 'adult' | 'mature';
  actorStyle?: 'relatable_ugc' | 'expert_spokesperson' | 'casual_creator';
  aspectRatio?: AspectRatioOption;
  voiceStyle?: string;
}

export interface GenerateVoiceoverParams {
  text: string;
  voiceId?: string;
  pace?: number; // 0.8 to 1.2
  stability?: number; // 0.0 to 1.0
  similarityBoost?: number;
  outputFormat?: 'mp3_44100_128' | 'pcm_44100';
}

export interface GenerationResult {
  assetId: string;
  url: string;
  durationSeconds: number;
  modelUsed: string;
  provider: 'fal.ai' | 'vertex-ai' | 'elevenlabs' | 'arcads' | 'mock-studio';
  isMock: boolean;
  metadata?: Record<string, unknown>;
}

export interface VoiceoverResult extends GenerationResult {
  words?: Array<{
    word: string;
    start: number;
    end: number;
  }>;
}
