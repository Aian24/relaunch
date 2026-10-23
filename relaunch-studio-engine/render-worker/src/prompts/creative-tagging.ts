import {
  CreativeAttributesSchema,
  type CreativeAttributesData,
  type ScriptItemData,
} from "./schemas.ts";
import { callClaudeStructured } from "./claude-client.ts";

/**
 * ReLaunch Studio — Node 4.5: Creative Attribute Tagging Engine
 * Machine-tags creative assets with granular performance attributes.
 * Feeds Flow H (Winner Analysis loop) to identify why winning ads convert.
 */

export interface CreativeTaggingInput {
  script: ScriptItemData;
  activeHookText: string;
  musicGenre?: string;
  avatarProfile?: string;
}

export async function tagCreativeAttributes(
  input: CreativeTaggingInput
): Promise<CreativeAttributesData> {
  const systemPrompt = `You are the Lead Data Scientist & Performance Analyst at ReLaunch Studio.
Your task is to classify creative video ad variants with standardized machine-readable tags for multi-variable regression analysis.

Tag categories:
- hook_type: challenge, curiosity, warning, problem_statement, social_proof, price_anchor, bold_claim.
- target_persona_age: Gen-Z (18-24), Millennial (25-40), Gen-X (41-55), Boomer (55+), All-Adults.
- music_tempo: energetic_120bpm, chill_90bpm, cinematic_build, lo_fi_subtle, trending_pop.
- video_pacing: rapid_fire_1s, dynamic_3s, relaxed_5s.
- call_to_action_urgency: high_urgency_countdown, direct_action, discovery_soft.
- angle_family: problem_solution, ugc_proof, educational_listicle, competitor_teardown.`;

  const userPrompt = `Classify this video ad variant:

ANGLE: ${input.script.angle}
FRAMEWORK: ${input.script.framework}
ACTIVE HOOK: "${input.activeHookText}"
BODY SCRIPT: "${input.script.body}"
TARGET PERSONA: "${input.script.target_persona}"
MUSIC GENRE: ${input.musicGenre || "Upbeat modern pop / electronic"}
AVATAR PROFILE: ${input.avatarProfile || "Relatable everyday creator"}

Return the structured CreativeAttributes JSON now:`;

  const fallback: CreativeAttributesData = {
    hook_type: input.activeHookText.toLowerCase().includes("stop")
      ? "warning"
      : input.activeHookText.toLowerCase().includes("?")
      ? "curiosity"
      : "challenge",
    target_persona_age: "Millennial (25-40)",
    music_tempo: "energetic_120bpm",
    video_pacing: "dynamic_3s",
    call_to_action_urgency: "direct_action",
    angle_family: input.script.framework.toLowerCase().includes("ugc")
      ? "ugc_proof"
      : input.script.framework.toLowerCase().includes("listicle")
      ? "educational_listicle"
      : "problem_solution",
  };

  return callClaudeStructured({
    systemPrompt,
    userPrompt,
    schema: CreativeAttributesSchema,
    mockFallback: fallback,
    temperature: 0.1,
  });
}
