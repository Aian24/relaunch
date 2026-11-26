-- ==============================================================================
-- ReLaunch Studio — Migration 002: Client/Project Model + Raw-Footage Trimmer
-- Idempotent PostgreSQL 16 migration
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Evolve `clients` table into top-level agency container
-- ------------------------------------------------------------------------------
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS slug VARCHAR(120),
  ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS brand_profile_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS brand_assets_ref TEXT,
  ADD COLUMN IF NOT EXISTS is_sample BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE clients ALTER COLUMN website DROP NOT NULL;
ALTER TABLE clients ALTER COLUMN contact_email DROP NOT NULL;

ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_status_check;
ALTER TABLE clients
  ADD CONSTRAINT clients_status_check
  CHECK (status IN ('prospect', 'active', 'paused', 'archived'));

CREATE UNIQUE INDEX IF NOT EXISTS uq_clients_slug ON clients(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_is_sample ON clients(is_sample);
CREATE INDEX IF NOT EXISTS idx_clients_last_activity ON clients(last_activity_at DESC);

-- ------------------------------------------------------------------------------
-- 2. Global Creator <-> Client approval and usage tracking
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_approved_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  creator_slug VARCHAR(100) NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  times_used INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (client_id, creator_slug)
);

CREATE INDEX IF NOT EXISTS idx_client_creators_client ON client_approved_creators(client_id);

-- ------------------------------------------------------------------------------
-- 3. Feature 2: Client Raw Footage
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_raw_footage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  storage_url TEXT NOT NULL,
  playable_url TEXT,
  sprite_url TEXT,
  thumbnail_url TEXT,
  filename VARCHAR(255) NOT NULL,
  duration NUMERIC(8,2) DEFAULT 0,
  mime VARCHAR(100) NOT NULL DEFAULT 'video/mp4',
  codec VARCHAR(60),
  width INTEGER,
  height INTEGER,
  file_size_bytes BIGINT,
  status VARCHAR(30) NOT NULL DEFAULT 'raw' CHECK (status IN ('raw', 'processing', 'processed', 'failed')),
  error_message TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_raw_footage_client ON client_raw_footage(client_id);
CREATE INDEX IF NOT EXISTS idx_raw_footage_status ON client_raw_footage(status);

-- ------------------------------------------------------------------------------
-- 4. Feature 2: Client Virtual Clips
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  source_raw_id UUID NOT NULL REFERENCES client_raw_footage(id) ON DELETE CASCADE,
  in_point NUMERIC(8,1) NOT NULL CHECK (in_point >= 0),
  out_point NUMERIC(8,1) NOT NULL CHECK (out_point > in_point),
  scene_role VARCHAR(30) NOT NULL CHECK (scene_role IN ('hook_alt', 'product', 'broll', 'detail', 'cta')),
  label VARCHAR(255) NOT NULL,
  notes TEXT DEFAULT '',
  preview_url TEXT,
  thumbnail_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_client_clips_client_role ON client_clips(client_id, scene_role) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_client_clips_raw ON client_clips(source_raw_id);

-- ------------------------------------------------------------------------------
-- 5. Client-Scoped Pre-Cut Media Assets (migrated baseline + scene-ready uploads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_media_assets (
  id VARCHAR(120) PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  target_scene SMALLINT NOT NULL CHECK (target_scene IN (2, 3)),
  src TEXT NOT NULL,
  duration_seconds NUMERIC(8,2),
  file_size_mb NUMERIC(8,2),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_client_media_assets_client ON client_media_assets(client_id);

-- ------------------------------------------------------------------------------
-- 6. Scope `ad_jobs`, `review_links`, and `approved_deliverables` to `clients`
-- ------------------------------------------------------------------------------
ALTER TABLE ad_jobs
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS is_sample BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS scene_clips_json JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS ad_kit_draft_json JSONB,
  ADD COLUMN IF NOT EXISTS is_real_footage_dominant BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS has_synthetic_scenes BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_ad_jobs_client ON ad_jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_ad_jobs_status ON ad_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ad_jobs_sample ON ad_jobs(is_sample);

CREATE TABLE IF NOT EXISTS review_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  ad_id VARCHAR(100) NOT NULL REFERENCES ad_jobs(id) ON DELETE CASCADE,
  label VARCHAR(255) DEFAULT '',
  share_token TEXT NOT NULL,
  created_by VARCHAR(255) DEFAULT 'Studio Admin',
  expires_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_links_client ON review_links(client_id);
CREATE INDEX IF NOT EXISTS idx_review_links_ad ON review_links(ad_id);

CREATE TABLE IF NOT EXISTS approved_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  ad_job_id VARCHAR(100) NOT NULL UNIQUE REFERENCES ad_jobs(id) ON DELETE CASCADE,
  is_sample BOOLEAN NOT NULL DEFAULT FALSE,
  variants_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  drive_folder_id VARCHAR(255),
  drive_file_ids_json JSONB DEFAULT '{}'::jsonb,
  zip_package_url TEXT,
  approved_by VARCHAR(255) NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_approved_deliverables_client ON approved_deliverables(client_id) WHERE is_sample = FALSE;

-- Trigger for client_clips.updated_at
DROP TRIGGER IF EXISTS trg_client_clips_updated_at ON client_clips;
CREATE TRIGGER trg_client_clips_updated_at
BEFORE UPDATE ON client_clips
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

