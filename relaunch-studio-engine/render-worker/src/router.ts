import {
  type GenerateSceneParams,
  type GenerateActorParams,
  type GenerateVoiceoverParams,
  type GenerationResult,
  type VoiceoverResult,
  type VideoModel,
  generateGrokVideo,
  generateVeoVideo,
  generateSeedanceVideo,
  generateActorClip,
  generateVoiceover,
} from './models/index.ts';

/**
 * ReLaunch Studio — Node 5.1: Unified Video Generation Router
 * Abstraction layer that decouples the rendering engine from individual AI model APIs.
 * Automatically routes scene generation to Grok, Veo, or Seedance with intelligent fallback.
 */

export class VideoRouter {
  private defaultSceneModel: VideoModel;

  constructor(defaultModel: VideoModel = 'grok-1.5') {
    this.defaultSceneModel = defaultModel;
  }

  /**
   * Model-agnostic scene generator
   */
  async generateScene(params: GenerateSceneParams): Promise<GenerationResult> {
    const chosenModel = params.model || this.defaultSceneModel;

    try {
      switch (chosenModel) {
        case 'grok-1.5':
          return await generateGrokVideo(params);

        case 'veo-3.1':
          return await generateVeoVideo(params);

        case 'seedance-2':
          if (!params.imagePromptUrl) {
            console.warn(
              '[VideoRouter] Seedance requested without imagePromptUrl, falling back to Grok 1.5'
            );
            return await generateGrokVideo(params);
          }
          return await generateSeedanceVideo(params);

        case 'kling-3':
        default:
          // Kling / default fallback routes through Grok 1.5
          return await generateGrokVideo(params);
      }
    } catch (primaryError) {
      console.error(
        `[VideoRouter] Primary model ${chosenModel} failed. Attempting failover...`,
        primaryError
      );

      // Automatic failover logic
      if (chosenModel !== 'grok-1.5') {
        try {
          console.log('[VideoRouter] Failing over to Grok 1.5...');
          return await generateGrokVideo({ ...params, model: 'grok-1.5' });
        } catch (failoverError) {
          console.error('[VideoRouter] Failover also failed:', failoverError);
        }
      }

      throw primaryError;
    }
  }

  /**
   * Talking-head UGC actor generator
   */
  async generateActor(params: GenerateActorParams): Promise<GenerationResult> {
    return generateActorClip(params);
  }

  /**
   * Branded voiceover generator
   */
  async generateVoiceover(params: GenerateVoiceoverParams): Promise<VoiceoverResult> {
    return generateVoiceover(params);
  }
}

// Export singleton router instance
export const videoRouter = new VideoRouter();

// Export helper wrapper functions for direct procedural usage
export async function generateScene(params: GenerateSceneParams): Promise<GenerationResult> {
  return videoRouter.generateScene(params);
}

export async function generateActor(params: GenerateActorParams): Promise<GenerationResult> {
  return videoRouter.generateActor(params);
}

export async function generateAudio(params: GenerateVoiceoverParams): Promise<VoiceoverResult> {
  return videoRouter.generateVoiceover(params);
}
