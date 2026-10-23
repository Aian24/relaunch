import { z } from "zod";

/**
 * ReLaunch Studio — Phase 4 AI Agent Brain
 * Strict Zod Schemas for Claude 3.5 Sonnet Structured Outputs
 */

// 4.1 Brand Synthesis Schemas
export const PersonaSchema = z.object({
  name: z.string().min(1),
  pain_points: z.array(z.string().min(1)).min(1),
  desires: z.array(z.string().min(1)).min(1),
  demographics: z.string().optional(),
});

export const BrandProfileSchema = z.object({
  brand_name: z.string().min(1),
  voice_tone: z.array(z.string()).min(1),
  pace: z.string().default("energetic"),
  primary_personas: z.array(PersonaSchema).min(1),
  core_benefits: z.array(z.string().min(1)).min(1),
  objections: z.array(z.string().min(1)).min(1),
  do_not_say: z.array(z.string()),
});

export type BrandProfileData = z.infer<typeof BrandProfileSchema>;
export type PersonaData = z.infer<typeof PersonaSchema>;

// 4.2 Script Generation Schemas
export const HookVariantSchema = z.object({
  id: z.string(),
  text: z.string().min(3),
  type: z.enum([
    "problem",
    "question",
    "testimonial",
    "curiosity",
    "warning",
    "challenge",
    "transformation",
  ]),
});

export const ScriptItemSchema = z.object({
  angle: z.string().min(2),
  framework: z.string().min(2),
  target_persona: z.string().min(2),
  hook_variants: z.array(HookVariantSchema).min(2),
  body: z.string().min(10),
  cta: z.string().min(3),
  estimated_duration_seconds: z.number().default(20),
});

export const WeeklyScriptsBatchSchema = z.object({
  batch_id: z.string().optional(),
  product_name: z.string(),
  target_goal: z.string().optional(),
  scripts: z.array(ScriptItemSchema).min(1),
});

export type HookVariantData = z.infer<typeof HookVariantSchema>;
export type ScriptItemData = z.infer<typeof ScriptItemSchema>;
export type WeeklyScriptsBatchData = z.infer<typeof WeeklyScriptsBatchSchema>;

// 4.3 Compliance Pre-Check Schemas
export const ComplianceFlagSchema = z.object({
  claim: z.string(),
  rule: z.string(),
  category: z.enum([
    "health_cure",
    "financial_guarantee",
    "deceptive_testimonial",
    "unrealistic_claim",
    "superlative",
  ]),
  status: z.enum(["pass", "rewritten", "flagged"]),
  suggested_rewrite: z.string().optional(),
});

export const ComplianceReportSchema = z.object({
  passed: z.boolean(),
  flags: z.array(ComplianceFlagSchema),
  original_script: z.string(),
  compliant_script: z.string(),
});

export type ComplianceFlagData = z.infer<typeof ComplianceFlagSchema>;
export type ComplianceReportData = z.infer<typeof ComplianceReportSchema>;

// 4.4 Edit-Spec Schemas
export const RenderTrackBodyItemSchema = z.object({
  asset_id: z.string(),
  in: z.number().optional(),
  out: z.number().optional(),
  type: z.enum(["actor", "cutaway"]).optional(),
  at: z.number().optional(),
  dur: z.number().optional(),
});

export const EditSpecSchema = z.object({
  template: z.enum([
    "ProblemSolution",
    "TestimonialUGC",
    "ListicleReasons",
    "ComparisonUsVsThem",
  ]),
  aspect_ratios: z.array(z.enum(["9x16", "1x1", "4x5"])),
  tracks: z.object({
    hook: z.object({
      asset_id: z.string(),
      in: z.number(),
      out: z.number(),
    }),
    body: z.array(RenderTrackBodyItemSchema),
    voiceover: z.object({ asset_id: z.string() }).optional(),
    music: z
      .object({
        asset_id: z.string(),
        gain_db: z.number().default(-18),
      })
      .optional(),
  }),
  captions: z.object({
    style: z.literal("word_highlight"),
    max_chars: z.number().default(16),
    position: z.enum(["lower_third", "center"]).default("lower_third"),
  }),
  cta: z.object({
    text: z.string(),
    end_card: z.string().default("brand_default"),
  }),
  disclosure: z.object({
    label: z.string().default(""),
    position: z.enum(["bottom_left", "bottom_right"]).default("bottom_left"),
  }),
});

export type EditSpecData = z.infer<typeof EditSpecSchema>;

// 4.5 Creative Attribute Tagging Schemas
export const CreativeAttributesSchema = z.object({
  hook_type: z.string(),
  target_persona_age: z.string(),
  music_tempo: z.string(),
  video_pacing: z.string(),
  call_to_action_urgency: z.string(),
  angle_family: z.string(),
});

export type CreativeAttributesData = z.infer<typeof CreativeAttributesSchema>;
