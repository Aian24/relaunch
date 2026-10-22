/**
 * ReLaunch Studio — AI Video Ad System
 * Core Data Models & TypeScript Interfaces
 * Aligned with PostgreSQL 16 schema in relaunch-studio-engine/db/init.sql
 */

export type ClientStatus = 'active' | 'paused' | 'archived';
export type BatchStatus = 'drafting' | 'generating' | 'rendering' | 'review' | 'delivered' | 'completed';
export type ScriptStatus = 'draft' | 'approved' | 'rejected';
export type AssetType = 'actor_clip' | 'broll' | 'voiceover' | 'music' | 'product_still';
export type AspectRatio = '9x16' | '1x1' | '4x5';
export type VariantStatus = 'rendering' | 'needs_review' | 'approved' | 'rejected' | 'delivered';
export type ReviewDecision = 'approve' | 'reject' | 'recut';
export type ClientDecision = 'pending' | 'client_approved' | 'revision_requested';
export type Platform = 'meta' | 'tiktok';

export interface Client {
  id: string;
  name: string;
  website: string;
  contact_email: string;
  contact_phone?: string;
  status: ClientStatus;
  frameio_project_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandProfile {
  id: string;
  client_id: string;
  voice_json: {
    tone: string[];
    pace: string;
    vocabulary: string[];
  };
  personas_json: Array<{
    name: string;
    pain_points: string[];
    desires: string[];
    demographics?: string;
  }>;
  benefits_json: string[];
  objections_json: string[];
  do_not_say: string[];
  winner_profile_json: Record<string, unknown>;
  updated_at: string;
}

export interface Batch {
  id: string;
  client_id: string;
  week_of: string;
  status: BatchStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HookVariant {
  id: string;
  text: string;
  type: 'problem' | 'question' | 'testimonial' | 'curiosity' | 'warning';
}

export interface Script {
  id: string;
  batch_id: string;
  angle: string;
  framework: string;
  target_persona?: string;
  hook_variants_json: HookVariant[];
  body: string;
  cta: string;
  compliance_flags_json: Array<{
    claim: string;
    rule: string;
    status: 'pass' | 'rewritten' | 'flagged';
  }>;
  status: ScriptStatus;
  created_at: string;
}

export interface Asset {
  id: string;
  script_id: string;
  type: AssetType;
  source_model: string;
  storage_url: string;
  duration_seconds?: number;
  meta_json: Record<string, unknown>;
  created_at: string;
}

export interface RenderSpecTrack {
  hook: { asset_id: string; in: number; out: number };
  body: Array<{
    asset_id: string;
    in?: number;
    out?: number;
    type?: 'actor' | 'cutaway';
    at?: number;
    dur?: number;
  }>;
  voiceover?: { asset_id: string };
  music?: { asset_id: string; gain_db?: number };
}

export interface RenderSpec {
  template: 'ProblemSolution' | 'TestimonialUGC' | 'ListicleReasons' | 'ComparisonUsVsThem';
  aspect_ratios: AspectRatio[];
  tracks: RenderSpecTrack;
  captions: {
    style: 'word_highlight';
    max_chars: number;
    position: 'lower_third' | 'center';
  };
  cta: {
    text: string;
    end_card?: string;
    url?: string;
  };
  disclosure: {
    label: string;
    position: 'bottom_left' | 'bottom_right';
    full_duration?: boolean;
  };
}

export interface Variant {
  id: string;
  script_id: string;
  aspect_ratio: AspectRatio;
  storage_url: string;
  thumbnail_url?: string;
  render_spec_json: RenderSpec;
  disclosure_applied: boolean;
  status: VariantStatus;
  created_at: string;
}

export interface Review {
  id: string;
  variant_id: string;
  reviewer_name: string;
  decision: ReviewDecision;
  notes?: string;
  checklist_verified: {
    brief_matches?: boolean;
    sync_clean?: boolean;
    disclosure_visible?: boolean;
    audio_normalized?: boolean;
    no_artifacts?: boolean;
  };
  created_at: string;
}

export interface ComplianceLog {
  id: string;
  variant_id: string;
  ai_elements: string[];
  label_applied: string;
  license_refs_json: {
    music_license_id?: string;
    actor_license_id?: string;
    generator_models: string[];
  };
  created_at: string;
}
