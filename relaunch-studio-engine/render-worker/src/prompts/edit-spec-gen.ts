import { EditSpecSchema, type EditSpecData, type ScriptItemData } from "./schemas.ts";
import { callClaudeStructured } from "./claude-client.ts";

/**
 * ReLaunch Studio — Node 4.4: Edit-Spec JSON Generator Node
 * Converts high-converting scripts and asset catalogs into deterministic Remotion render instructions.
 */

export interface AvailableAsset {
  id: string;
  type: "actor_clip" | "broll" | "voiceover" | "music" | "product_still";
  description: string;
  durationSeconds?: number;
}

export interface EditSpecInput {
  script: ScriptItemData;
  selectedHookId?: string;
  assets: AvailableAsset[];
  aspectRatios?: Array<"9x16" | "1x1" | "4x5">;
  applyAIDisclosure?: boolean;
}

export async function generateEditSpec(
  input: EditSpecInput
): Promise<EditSpecData> {
  const chosenHook =
    input.script.hook_variants.find((h) => h.id === input.selectedHookId) ||
    input.script.hook_variants[0];

  const systemPrompt = `You are the Lead Video Editor & Technical Director at ReLaunch Studio.
Your mission is to map a copy script and available media assets into an executable Remotion Edit-Spec JSON.

Available Templates:
- ProblemSolution (Ideal for direct problem / agitation frameworks)
- TestimonialUGC (Ideal for conversational creator stories and reviews)
- ListicleReasons (Ideal for 3 reasons why / bullet point scripts)
- ComparisonUsVsThem (Ideal for side-by-side product contrasts)

Pacing Rules:
- Hook duration: 2.2s to 3.0s maximum.
- B-roll cutaway frequency: Introduce cutaways every 2.5 to 3.5 seconds to maintain high viewer retention.
- Music ducking: Standard background music gain is -18dB while voiceover is active.
- Kinetic Captions: Word-highlight style, maximum 16 characters per chunk.`;

  const userPrompt = `Assemble the Remotion Edit-Spec for:

SCRIPT ANGLE: ${input.script.angle}
FRAMEWORK: ${input.script.framework}
CHOSEN HOOK: "${chosenHook.text}"
SCRIPT BODY: "${input.script.body}"
CTA: "${input.script.cta}"

AVAILABLE ASSETS:
${JSON.stringify(input.assets, null, 2)}

TARGET ASPECT RATIOS:
${JSON.stringify(input.aspectRatios || ["9x16", "1x1", "4x5"])}

Generate the complete EditSpec JSON now:`;

  // Select matching template based on framework
  let template: EditSpecData["template"] = "ProblemSolution";
  if (input.script.framework.toLowerCase().includes("social") || input.script.framework.toLowerCase().includes("ugc")) {
    template = "TestimonialUGC";
  } else if (input.script.framework.toLowerCase().includes("listicle") || input.script.framework.toLowerCase().includes("reasons")) {
    template = "ListicleReasons";
  } else if (input.script.framework.toLowerCase().includes("comparison") || input.script.framework.toLowerCase().includes("them")) {
    template = "ComparisonUsVsThem";
  }

  // Find assets or assign clean placeholders
  const hookAsset = input.assets.find((a) => a.type === "actor_clip") || { id: "asset-hook-01" };
  const brollAssets = input.assets.filter((a) => a.type === "broll");
  const voAsset = input.assets.find((a) => a.type === "voiceover") || { id: "asset-vo-clean" };
  const musicAsset = input.assets.find((a) => a.type === "music") || { id: "asset-music-upbeat" };

  const fallback: EditSpecData = {
    template,
    aspect_ratios: input.aspectRatios || ["9x16", "1x1", "4x5"],
    tracks: {
      hook: {
        asset_id: hookAsset.id,
        in: 0.0,
        out: 2.8,
      },
      body: [
        {
          asset_id: hookAsset.id,
          in: 0.0,
          out: 14.0,
          type: "actor",
        },
        {
          asset_id: brollAssets[0]?.id || "asset-broll-01",
          at: 3.2,
          dur: 2.6,
          type: "cutaway",
        },
        {
          asset_id: brollAssets[1]?.id || "asset-broll-02",
          at: 7.5,
          dur: 2.4,
          type: "cutaway",
        },
      ],
      voiceover: { asset_id: voAsset.id },
      music: { asset_id: musicAsset.id, gain_db: -18 },
    },
    captions: {
      style: "word_highlight",
      max_chars: 16,
      position: "lower_third",
    },
    cta: {
      text: input.script.cta,
      end_card: "brand_default",
    },
    disclosure: {
      label: input.applyAIDisclosure ? "AI-Generated Media" : "",
      position: "bottom_left",
    },
  };

  return callClaudeStructured({
    systemPrompt,
    userPrompt,
    schema: EditSpecSchema,
    mockFallback: fallback,
    temperature: 0.2,
  });
}
