import {
  WeeklyScriptsBatchSchema,
  type WeeklyScriptsBatchData,
  type BrandProfileData,
} from "./schemas.ts";
import { callClaudeStructured } from "./claude-client.ts";

/**
 * ReLaunch Studio — Node 4.2: Weekly Script Generator
 * Generates 4 high-converting creative angles with 3–5 hook variants per angle for weekly batch video production.
 */

export interface ScriptGenerationInput {
  brandProfile: BrandProfileData;
  productName: string;
  productOffer?: string;
  targetGoal?: string;
  currentWinnersContext?: string;
  batchId?: string;
}

export async function generateWeeklyScripts(
  input: ScriptGenerationInput
): Promise<WeeklyScriptsBatchData> {
  const systemPrompt = `You are the Lead Direct-Response Copywriter at ReLaunch Studio, specializing in high-ROAS TikTok, Meta Reels, and YouTube Shorts ad scripts.
Your mission is to generate a weekly creative batch consisting of 4 distinct, battle-tested advertising angles for short-form video (15-30 seconds each).

The 4 Mandatory Angles are:
1. ANGLE 1: DIRECT PROBLEM / AGITATION (Framework: Problem-Agitation-Solution)
   - Agitates a painful, annoying issue the prospect experiences every week, then introduces the product as the effortless breakthrough.
2. ANGLE 2: SOCIAL PROOF / UGC TESTIMONIAL (Framework: Social Proof Story)
   - Conversational talking-head creator sharing personal experience, skepticism turned into conviction, and tangible results.
3. ANGLE 3: 3 REASONS WHY / LISTICLE (Framework: Listicle Benefit)
   - Fast-paced 3-bullet breakdown highlighting unique differentiators with kinetic pacing.
4. ANGLE 4: US VS. THEM / COMPARISON (Framework: Comparison Teardown)
   - Side-by-side contrast against old, frustrating alternatives without deceptive claims.

For each script:
- Provide 3–4 high-impact opening hooks (0-3s retention drivers). Types: "problem", "question", "testimonial", "curiosity", "warning", "challenge", "transformation".
- Write a punchy body voiceover (between 35 and 65 words, natural human cadence, 130-150 words per minute).
- Include a clear, singular call to action (CTA).`;

  const userPrompt = `Generate a weekly 4-angle video ad batch for:

BRAND: ${input.brandProfile.brand_name}
VOICE / TONE: ${input.brandProfile.voice_tone.join(", ")} (Pace: ${input.brandProfile.pace})
PRODUCT: ${input.productName}
SPECIAL OFFER / CTA: ${input.productOffer || "Order online today"}
TARGET GOAL: ${input.targetGoal || "Drive profitable DTC customer acquisition"}

PRIMARY BUYER PERSONAS:
${JSON.stringify(input.brandProfile.primary_personas, null, 2)}

CORE BENEFITS:
- ${input.brandProfile.core_benefits.join("\n- ")}

KEY OBJECTIONS TO OVERCOME:
- ${input.brandProfile.objections.join("\n- ")}

DO NOT SAY (STRICT COMPLIANCE GUARDRAILS):
- ${input.brandProfile.do_not_say.join("\n- ")}

${input.currentWinnersContext ? `RECENT WINNER PERFORMANCE CONTEXT:\n${input.currentWinnersContext}` : ""}

Return the complete JSON batch with all 4 angles and hook variants now:`;

  const fallback: WeeklyScriptsBatchData = {
    batch_id: input.batchId || "batch-default",
    product_name: input.productName,
    target_goal: input.targetGoal || "Profitable Customer Acquisition",
    scripts: [
      {
        angle: "Direct Problem / Agitation",
        framework: "Problem-Agitation-Solution",
        target_persona: input.brandProfile.primary_personas[0]?.name || "Busy Value Seeker",
        hook_variants: [
          {
            id: "h1-1",
            text: "Stop settling for options that let you down every single time.",
            type: "warning",
          },
          {
            id: "h1-2",
            text: "If you're still dealing with this daily frustration, watch this.",
            type: "problem",
          },
          {
            id: "h1-3",
            text: "Why does nobody talk about the real reason most alternatives fail?",
            type: "curiosity",
          },
        ],
        body: `You know the feeling. You invest your hard-earned money expecting quality, and you end up disappointed. That's exactly why ${input.brandProfile.brand_name} was created. We engineered a smarter, uncompromising solution that delivers from day one.`,
        cta: `${input.productOffer || "Get yours today with special introductory pricing."}`,
        estimated_duration_seconds: 22,
      },
      {
        angle: "UGC Social Proof Testimonial",
        framework: "Social Proof Story",
        target_persona: input.brandProfile.primary_personas[0]?.name || "Everyday Customer",
        hook_variants: [
          {
            id: "h2-1",
            text: "I was super skeptical until I tried this myself for two weeks.",
            type: "testimonial",
          },
          {
            id: "h2-2",
            text: "This one change completely transformed my daily routine.",
            type: "transformation",
          },
          {
            id: "h2-3",
            text: "Here's what happened when I finally switched to something better.",
            type: "curiosity",
          },
        ],
        body: `Honestly, I thought it was just another hyped-up product on my feed. But after trying it once, I get it. The difference is night and day. It does exactly what it promises without any of the usual hassle.`,
        cta: `Tap the link below to experience the difference yourself.`,
        estimated_duration_seconds: 20,
      },
      {
        angle: "3 Reasons Why / Listicle",
        framework: "Listicle Benefit",
        target_persona: input.brandProfile.primary_personas[1]?.name || "Quality Conscious Enthusiast",
        hook_variants: [
          {
            id: "h3-1",
            text: "3 reasons everyone is quietly switching over to this right now.",
            type: "curiosity",
          },
          {
            id: "h3-2",
            text: "Number 3 is the main reason I will never go back to the old way.",
            type: "challenge",
          },
          {
            id: "h3-3",
            text: "Before you buy anything else, check these 3 facts first.",
            type: "warning",
          },
        ],
        body: `Reason one: Premium quality materials you can feel immediately. Reason two: Built specifically for real-world reliability. And reason three: Backed by hundreds of verified customer reviews who made the switch.`,
        cta: `Claim your welcome discount before this week's batch sells out.`,
        estimated_duration_seconds: 24,
      },
      {
        angle: "Us vs. Them / Direct Comparison",
        framework: "Comparison Teardown",
        target_persona: input.brandProfile.primary_personas[0]?.name || "Informed Consumer",
        hook_variants: [
          {
            id: "h4-1",
            text: "Old way versus the new way: let's break down the truth.",
            type: "question",
          },
          {
            id: "h4-2",
            text: "Don't make the mistake of choosing outdated alternatives in 2026.",
            type: "warning",
          },
          {
            id: "h4-3",
            text: "Side by side test: can you spot the massive difference?",
            type: "challenge",
          },
        ],
        body: `Traditional options cut corners on quality, charge hidden premiums, and leave you stuck. With ${input.brandProfile.brand_name}, you get full transparency, world-class craftsmanship, and guaranteed satisfaction.`,
        cta: `Switch today and see why thousands made the upgrade.`,
        estimated_duration_seconds: 21,
      },
    ],
  };

  return callClaudeStructured({
    systemPrompt,
    userPrompt,
    schema: WeeklyScriptsBatchSchema,
    mockFallback: fallback,
    temperature: 0.35,
  });
}
