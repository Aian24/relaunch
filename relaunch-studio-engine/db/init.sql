-- ==============================================================================
-- ReLaunch Studio — AI Video Ad System
-- PostgreSQL 16 Database Initialization Schema
-- ==============================================================================

-- Enable UUID extension for cryptographic primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing schema if re-initializing in dev (comment out in production)
-- DROP TABLE IF EXISTS compliance_log CASCADE;
-- DROP TABLE IF EXISTS performance CASCADE;
-- DROP TABLE IF EXISTS deliveries CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS variants CASCADE;
-- DROP TABLE IF EXISTS assets CASCADE;
-- DROP TABLE IF EXISTS scripts CASCADE;
-- DROP TABLE IF EXISTS batches CASCADE;
-- DROP TABLE IF EXISTS brand_profiles CASCADE;
-- DROP TABLE IF EXISTS clients CASCADE;

-- ------------------------------------------------------------------------------
-- 1. Clients Table (System Tenant)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    frameio_project_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. Brand Profiles Table (Synthesized by Claude 3.5 Sonnet)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brand_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    voice_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    personas_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    benefits_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    objections_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    do_not_say TEXT[] DEFAULT '{}',
    winner_profile_json JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. Batches Table (Weekly Production Cycles)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    week_of DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'drafting' CHECK (status IN ('drafting', 'generating', 'rendering', 'review', 'delivered', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. Scripts Table (Creative Angles & Hook Variations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    angle VARCHAR(255) NOT NULL,
    framework VARCHAR(100) NOT NULL,
    target_persona VARCHAR(255),
    hook_variants_json JSONB NOT NULL,
    body TEXT NOT NULL,
    cta TEXT NOT NULL,
    compliance_flags_json JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. Media Assets Table (Actor clips, Scene B-roll, VO, Music, Product Stills)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('actor_clip', 'broll', 'voiceover', 'music', 'product_still')),
    source_model VARCHAR(100) NOT NULL,
    storage_url TEXT NOT NULL,
    duration_seconds NUMERIC(6,2),
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. Variants Table (Rendered Video Outputs: 9:16, 1:1, 4:5)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    aspect_ratio VARCHAR(20) NOT NULL CHECK (aspect_ratio IN ('9x16', '1x1', '4x5')),
    storage_url TEXT NOT NULL,
    thumbnail_url TEXT,
    render_spec_json JSONB NOT NULL,
    disclosure_applied BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'rendering' CHECK (status IN ('rendering', 'needs_review', 'approved', 'rejected', 'delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. Reviews Table (Mandatory Human Operator QA Gate)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(255) NOT NULL,
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('approve', 'reject', 'recut')),
    notes TEXT,
    checklist_verified JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. Deliveries Table (Frame.io Approvals & Client Revision Feedback)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    frameio_asset_id VARCHAR(255) NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    client_decision VARCHAR(50) DEFAULT 'pending' CHECK (client_decision IN ('pending', 'client_approved', 'revision_requested')),
    client_feedback TEXT
);

-- ------------------------------------------------------------------------------
-- 9. Performance Table (Nightly Meta & TikTok Social Ad Metrics)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('meta', 'tiktok')),
    date DATE NOT NULL,
    spend NUMERIC(10,2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cpa NUMERIC(10,2) DEFAULT 0,
    roas NUMERIC(6,2) DEFAULT 0,
    hook_rate NUMERIC(5,2) DEFAULT 0,
    hold_rate NUMERIC(5,2) DEFAULT 0,
    attributes_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 10. Compliance Log Table (Immutable Legal Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compliance_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    ai_elements TEXT[] NOT NULL,
    label_applied TEXT NOT NULL,
    license_refs_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 11. Unified Ad Jobs Table (Single Ad Pilot & Multi-Variant Coordinator)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ad_jobs (
    id VARCHAR(100) PRIMARY KEY,
    brand_id VARCHAR(100) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    creative_angle VARCHAR(255) NOT NULL,
    hook_type VARCHAR(50) NOT NULL,
    hook_text TEXT NOT NULL,
    creator_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_footage_url TEXT NOT NULL,
    ai_scene_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    script_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    variants_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    compliance_checks_json JSONB NOT NULL DEFAULT '{"creatorVerification":false,"scriptClaims":false,"clientFootagePresent":false,"disclosureState":false}'::jsonb,
    status VARCHAR(50) DEFAULT 'needs_review',
    review_log_json JSONB,
    delivery_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- High-Performance Indices
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_client ON brand_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_batches_client ON batches(client_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_scripts_batch ON scripts(batch_id);
CREATE INDEX IF NOT EXISTS idx_scripts_status ON scripts(status);
CREATE INDEX IF NOT EXISTS idx_assets_script ON assets(script_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_variants_script ON variants(script_id);
CREATE INDEX IF NOT EXISTS idx_variants_status ON variants(status);
CREATE INDEX IF NOT EXISTS idx_reviews_variant ON reviews(variant_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_variant ON deliveries(variant_id);
CREATE INDEX IF NOT EXISTS idx_performance_variant ON performance(variant_id);
CREATE INDEX IF NOT EXISTS idx_compliance_log_variant ON compliance_log(variant_id);

-- ------------------------------------------------------------------------------
-- Automatic timestamp update triggers
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_clients_updated_at ON clients;
CREATE TRIGGER trg_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_brand_profiles_updated_at ON brand_profiles;
CREATE TRIGGER trg_brand_profiles_updated_at
BEFORE UPDATE ON brand_profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_batches_updated_at ON batches;
CREATE TRIGGER trg_batches_updated_at
BEFORE UPDATE ON batches
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
