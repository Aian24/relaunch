import { BrandProfileSchema, type BrandProfileData } from "./schemas.ts";
import { callClaudeStructured } from "./claude-client.ts";

/**
 * ReLaunch Studio — Node 4.1: Brand Synthesis Engine
 * Analyzes client website content, customer reviews, and offerings to extract a structured Brand DNA profile.
 */

export interface BrandSynthesisInput {
  brandName: string;
  websiteUrl?: string;
  scrapedWebsiteText: string;
  customerReviews?: string[];
  productCatalogText?: string;
  existingNotes?: string;
}

export async function synthesizeBrandProfile(
  input: BrandSynthesisInput
): Promise<BrandProfileData> {
  const systemPrompt = `You are the Lead Brand Strategist at ReLaunch Studio, an elite direct-response paid social agency.
Your task is to analyze raw brand inputs (website copy, customer reviews, product catalogs) and synthesize a comprehensive, battle-tested Brand DNA profile.

You must extract:
1. brand_name: Clean official business name.
2. voice_tone: 3-5 distinct adjectives describing their video personality (e.g., "Authentic", "Energetic", "Punchy", "Warm").
3. primary_personas: 2-3 high-intent buyer personas with specific emotional pain points and burning desires.
4. core_benefits: 3-5 irresistible value propositions (benefits, not just features).
5. objections: 3-4 top hesitations keeping prospects from buying.
6. do_not_say: Strict guardrails on claims to avoid (e.g. false guarantees, unapproved medical claims, competitor insults).`;

  const userPrompt = `Synthesize the Brand DNA for this client:

BRAND NAME: ${input.brandName}
WEBSITE: ${input.websiteUrl || "N/A"}

SCRAPED WEBSITE CONTENT:
${input.scrapedWebsiteText.slice(0, 4000)}

CUSTOMER REVIEWS:
${(input.customerReviews || []).slice(0, 10).join("\n")}

PRODUCT CATALOG / USP:
${input.productCatalogText || "N/A"}

ADDITIONAL OPERATOR NOTES:
${input.existingNotes || "None"}

Generate the structured JSON profile now:`;

  const fallback: BrandProfileData = {
    brand_name: input.brandName,
    voice_tone: ["Relatable", "High-Energy", "Direct", "Authentic"],
    pace: "energetic",
    primary_personas: [
      {
        name: "Busy Value Seeker",
        pain_points: [
          "Wasting money on products that don't deliver",
          "Lack of clear, transparent alternatives",
          "Too busy for complicated setups",
        ],
        desires: [
          "Fast, measurable results",
          "Frictionless experience",
          "Peace of mind and social proof",
        ],
        demographics: "Ages 25–45, active digital consumer",
      },
      {
        name: "Quality Conscious Enthusiast",
        pain_points: [
          "Tired of generic, low-grade options",
          "Skeptical of over-hyped advertising",
        ],
        desires: [
          "Premium craftsmanship",
          "Clear ingredient/spec transparency",
          "Belonging to an authentic community",
        ],
        demographics: "Ages 30–55, higher disposable income",
      },
    ],
    core_benefits: [
      "Immediate noticeable improvement from day one",
      "Backed by hundreds of verified 5-star customer reviews",
      "Seamless onboarding with zero learning curve",
    ],
    objections: [
      "Is it really worth the price compared to cheap alternatives?",
      "Will this work for my specific situation?",
    ],
    do_not_say: [
      "No guaranteed medical cures or unrealistic physical claims",
      "No before/after timelines without scientific substantiation",
      "No misleading competitor disparagement",
    ],
  };

  return callClaudeStructured({
    systemPrompt,
    userPrompt,
    schema: BrandProfileSchema,
    mockFallback: fallback,
    temperature: 0.2,
  });
}
