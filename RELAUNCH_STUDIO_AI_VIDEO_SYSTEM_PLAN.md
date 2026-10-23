# ReLaunch Studio — AI Video Ad System
## Full Master Implementation & Engineering Build Plan

> **Document Status:** Complete Developer Build & Execution Plan (Aligned with ReLaunch System Architecture)  
> **System Owner:** Robert Clark, ReLaunch ([relaunch.us/studio](https://relaunch.us/studio))  
> **Repository Location:** Root `RELAUNCH_STUDIO_AI_VIDEO_SYSTEM_PLAN.md` (Version controlled for multi-machine synchronization via `git pull` / `git push`)  
> **Build Specification Reference:** [`ReLaunch-Studio-AI-Video-System-Build-Spec.md`](file:///c:/xampp/htdocs/ReLaunch/ReLaunch-Studio-AI-Video-System-Build-Spec.md)  
> **Host Infrastructure:** IONOS VPS running Plesk Obsidian, Docker Engine, and Nginx Reverse Proxy  
> **Integration Architecture:** Hybrid VPS configuration running existing Next.js Public Site (Port 3000), Audit Engine (Port 3001), Studio QA Review App (Port 3002), n8n Orchestrator (Port 5678), PostgreSQL 16 (Port 5432), and Redis 7 (Port 6379).

---

## 1. Executive Summary & Core Architectural Principles

ReLaunch Studio is a self-hosted, AI-operated short-form video advertising factory. It turns a client brand brief into dozens of compliant, test-ready vertical video ad variants per week across multiple angles, hooks, and aspect ratios (9:16, 1:1, 4:5).

The operating model is **AI-operated, human-supervised**: AI agents handle brand synthesis, scripting, asset generation, and editing decisions, but **a human operator validates every single creative asset through a 60-second QA gate before it ever reaches a client or ad platform.**

### 5 Non-Negotiable Hard Constraints

1. **Self-Hosted Core on Plesk VPS:** Core orchestration (n8n), state management (PostgreSQL), render job queue (Redis/BullMQ), rendering engine (Node/Remotion/FFmpeg/Whisper), and internal QA app (`review.relaunch.us`) are 100% self-hosted in Docker on the VPS. Zero closed SaaS lock-in or Base44 dependencies.
2. **Model-Agnostic Frontier Video Router:** Frontier video and voice generation models (Grok Imagine, Veo 3.1, Seedance, Kling, ElevenLabs, Arcads) are external API services accessed via a unified abstraction (`/render-worker/src/router.ts`). Any model can be swapped via environment configuration without code refactoring.
3. **AI Decides the Edit; Local VPS Executes the Render:** Claude 3.5 Sonnet acts as the creative brain, outputting a typed `render-spec.json`. Remotion, FFmpeg, and faster-whisper execute the composition, caption animation, audio ducking, and multi-ratio exports locally on the VPS.
4. **Mandatory Human QA Gatekeeper:** No video variant can transition to `approved` or reach Frame.io without an explicit record in the `reviews` database table created by a human reviewer.
5. **Baked-In Compliance & AI Disclosure:** Every synthetic actor and AI voice asset has a visible `AI-Generated Media` disclosure badge burned directly into the Remotion composition layer, full provenance logged in `compliance_log`, and the AI-generated toggle enabled on platform publishing.

---

## 2. ReLaunch System Alignment & Port Topology

The ReLaunch server environment on the IONOS VPS currently hosts multiple services. To ensure complete alignment and prevent port collisions:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                IONOS VPS (Plesk Obsidian)                              │
│                                                                                        │
│  [PUBLIC INTERNET]                                                                     │
│         │                                                                              │
│         ▼                                                                              │
│  Plesk Nginx Reverse Proxy (SSL / Let's Encrypt Wildcard *.relaunch.us)               │
│    ├── relaunch.us                ──▶ Proxy http://127.0.0.1:3000 (Next.js Public App) │
│    ├── relaunch.us/audit          ──▶ Proxy http://127.0.0.1:3001 (Audit Engine)       │
│    ├── review.relaunch.us         ──▶ Proxy http://127.0.0.1:3002 (Studio QA App)      │
│    └── ops.relaunch.us            ──▶ Proxy http://127.0.0.1:5678 (n8n Automation Hub) │
│                                                                                        │
│  [DOCKER COMPOSE ENGINE: relaunch-studio-engine]                                       │
│    ├── postgres:16-alpine         ──▶ Port 5432 (Internal Docker Network)              │
│    ├── redis:7-alpine             ──▶ Port 6379 (Internal Docker Network)              │
│    ├── render-worker (Node/FFmpeg)──▶ BullMQ Consumer (Reads from Redis)               │
│    ├── review-app (Next.js 14)    ──▶ Port 3002 (Proxied to review.relaunch.us)        │
│    └── n8n (Workflow Engine)      ──▶ Port 5678 (Proxied to ops.relaunch.us)           │
│                                                                                        │
│  [EXTERNAL CLOUD APIS]                                                                 │
│    ├── Resend (HTTP API)          ──▶ Alerts to robert@relaunch.us                     │
│    ├── Anthropic Claude 3.5       ──▶ Brand Synthesis, Scripting, Edit-Specs           │
│    ├── Video Router (fal.ai)      ──▶ Grok Imagine 1.5, Veo 3.1, Seedance 2.0, Kling   │
│    ├── Arcads / Creatify          ──▶ UGC Talking-Head Creator Clips                   │
│    ├── ElevenLabs                 ──▶ High-Emotion Voiceover Generation                │
│    ├── Cloudflare R2 / MinIO      ──▶ S3 Storage (Raw Assets & Rendered Variants)      │
│    ├── Frame.io API v2            ──▶ Client Review & Approval Room                    │
│    └── Meta / TikTok APIs         ──▶ Phase 2 Ad Publishing & Performance Loop         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Port Allocation Map:
- **Port 3000:** `relaunch-website` (Next.js 14 App Router public site, handles `/studio` landing page and `/api/studio/intake`).
- **Port 3001:** `relaunch-audit` (Autonomous Free Audit Engine running under PM2).
- **Port 3002:** `studio-review-app` (Internal QA Portal for `review.relaunch.us`).
- **Port 5678:** `studio-n8n` (n8n Workflow Hub for `ops.relaunch.us`).
- **Port 5432:** `studio-postgres` (PostgreSQL 16 relational state store).
- **Port 6379:** `studio-redis` (Redis 7 queue for BullMQ render tasks).

---

## 3. Monorepo Directory Architecture

The Studio engine is integrated directly into the root of `c:\xampp\htdocs\ReLaunch\` so that the entire system is contained in one repository:

```
c:\xampp\htdocs\ReLaunch\
├── src/
│   ├── app/
│   │   ├── studio/
│   │   │   ├── page.tsx               # Public landing page (Savannah Sanchez aesthetic)
│   │   │   └── layout.tsx
│   │   └── api/
│   │       └── studio/
│   │           └── intake/route.ts    # Lead intake -> Triggers n8n Flow A & Resend email
│   ├── components/
│   │   └── StudioAdCarousel.tsx       # Uncluttered 9:16 vertical reel showcases
│   └── data/
│       └── studioSubBrand.ts          # Studio copy, pricing tiers, showcase video data
├── relaunch-audit/                    # Existing Audit Engine (Port 3001)
├── relaunch-studio-engine/            # STUDIO BACKEND & RENDERING SUBSYSTEM
│   ├── docker-compose.yml             # Complete multi-container production stack
│   ├── .env.example                   # Environment variable template
│   ├── .env.production                # VPS production secrets (git-ignored)
│   ├── db/
│   │   └── init.sql                   # Complete PostgreSQL 16 schema & indexes
│   ├── render-worker/                 # Node.js + Remotion + FFmpeg + Whisper worker
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts               # BullMQ queue processor
│   │   │   ├── db.ts                  # Typed PostgreSQL query client
│   │   │   ├── storage.ts             # S3/R2 upload, download & signed URLs
│   │   │   ├── router.ts              # Model-agnostic video generation router
│   │   │   ├── ffmpeg.ts              # Loudnorm (-14 LUFS), ducking, multi-ratio
│   │   │   └── whisper.py             # faster-whisper word timestamp extractor
│   │   └── templates/                 # Remotion React ad compositions
│   │       ├── Root.tsx               # Remotion entry point
│   │       ├── ProblemSolution.tsx    # Hook -> Problem -> Creator -> CTA
│   │       ├── TestimonialUGC.tsx     # Split-screen creator + buyer review
│   │       ├── ListicleReasons.tsx    # "3 Reasons Why" animated badges
│   │       ├── ComparisonUsVsThem.tsx # Side-by-side competitor teardown
│   │       └── components/
│   │           ├── Captions.tsx       # Kinetic word-highlight captions
│   │           ├── Watermark.tsx      # Mandatory AI-Generated disclosure badge
│   │           └── EndCard.tsx        # Dynamic CTA screen
│   ├── review-app/                    # Next.js 14 QA Review Portal (Port 3002)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx           # QA Review Queue Dashboard
│   │       │   ├── review/[id]/page.tsx # Multi-ratio player & 60s checklist
│   │       │   └── api/action/route.ts  # Approve / Reject / Recut endpoints
│   │       └── components/
│   │           ├── VideoPlayer.tsx    # Synced 9:16, 1:1, 4:5 previewer
│   │           └── Checklist.tsx      # Mandatory QA items before approval
│   └── n8n-workflows/                 # Version-controlled n8n JSON exports
│       ├── flow-a-onboarding.json
│       ├── flow-b-weekly-batch.json
│       ├── flow-c-asset-generation.json
│       ├── flow-d-render-dispatch.json
│       ├── flow-e-qa-gate.json
│       ├── flow-f-frameio-delivery.json
│       ├── flow-g-publishing.json
│       └── flow-h-performance-loop.json
├── ecosystem.config.js                # PM2 process configuration for VPS
├── package.json
└── RELAUNCH_STUDIO_AI_VIDEO_SYSTEM_PLAN.md # Master plan (this file)
```

---

## 4. Master Milestones & Status Dashboard

Use these interactive checkboxes (`[ ]` / `[x]`) to track progress across development machines:

| Phase | Milestone Name | Focus Area | Status | Progress |
|---|---|---|---|---|
| **Phase 0** | **Environment & Infrastructure** | Plesk VPS, Docker Compose, Storage, Secrets, DNS | `[ ] In Progress` | 3 / 8 |
| **Phase 1** | **Database Core & State Machine** | Postgres schema, migrations, S3 buckets, DB client | `[x] Completed` | 5 / 6 |
| **Phase 2** | **Render Worker & Remotion Engine**| BullMQ, Remotion React, Whisper, FFmpeg multi-ratio | `[x] Completed` | 8 / 9 |
| **Phase 3** | **Internal QA Review Web App** | Next.js review interface at `review.relaunch.us` | `[x] Completed` | 7 / 7 |
| **Phase 4** | **AI Agent Brain & Prompts** | Claude structured outputs (Script, Compliance, Edit-Spec) | `[x] Completed` | 6 / 6 |
| **Phase 5** | **Video Router & Asset APIs** | fal.ai/Replicate (Grok/Veo/Seedance) + Arcads + ElevenLabs | `[x] Completed` | 6 / 6 |
| **Phase 6** | **n8n Orchestration Flows (A–F)** | Complete pipelines from Intake to Frame.io Delivery | `[x] Completed` | 8 / 8 |
| **Phase 7** | **Performance & Publishing (H & G)**| Meta/TikTok metrics, winner profile, automated publishing| `[ ] Pending (WIP)` | 0 / 6 |
| **Phase 8** | **Production Verification & Pilot** | End-to-end live testing, legal compliance audit, SLA proof| `[ ] Pending (WIP)` | 0 / 5 |

---

## 5. Detailed Step-by-Step Implementation Plan

### Phase 0: Environment, Plesk VPS & Docker Stack (Week 1)
**Objective:** Stand up the complete, secure self-hosted infrastructure on the IONOS VPS without conflicting with existing ReLaunch services.

- [ ] **0.1 VPS Hardware & OS Prerequisites Verification**
  - Verify VPS specs: 8–16 vCPUs, 32GB RAM, fast NVMe SSD storage.
  - OS: Debian 12 or Ubuntu 22.04 LTS running under Plesk Obsidian.
  - Install Docker Engine 25+ and Docker Compose v2:
    ```bash
    curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
    docker compose version
    ```
  - Configure Docker daemon log rotation in `/etc/docker/daemon.json` to prevent disk overflow:
    ```json
    {
      "log-driver": "json-file",
      "log-opts": { "max-size": "50m", "max-file": "3" }
    }
    ```

- [x] **0.2 Monorepo Directory Scaffold Creation**
  - Execute scaffolding commands in workspace root:
    ```bash
    mkdir -p relaunch-studio-engine/db
    mkdir -p relaunch-studio-engine/render-worker/src
    mkdir -p relaunch-studio-engine/render-worker/templates/components
    mkdir -p relaunch-studio-engine/review-app/src/app/review
    mkdir -p relaunch-studio-engine/review-app/src/components
    mkdir -p relaunch-studio-engine/n8n-workflows
    ```

- [x] **0.3 Complete Production `docker-compose.yml`**
  - Create `relaunch-studio-engine/docker-compose.yml`:
    ```yaml
    version: '3.8'

    services:
      postgres:
        image: postgres:16-alpine
        container_name: studio-postgres
        restart: unless-stopped
        environment:
          POSTGRES_DB: relaunch_studio
          POSTGRES_USER: studio_admin
          POSTGRES_PASSWORD: ${DB_PASSWORD}
        volumes:
          - postgres_data:/var/lib/postgresql/data
          - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
        networks:
          - studio-network

      redis:
        image: redis:7-alpine
        container_name: studio-redis
        restart: unless-stopped
        command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
        volumes:
          - redis_data:/data
        networks:
          - studio-network

      n8n:
        image: n8nio/n8n:latest
        container_name: studio-n8n
        restart: unless-stopped
        environment:
          - N8N_HOST=ops.relaunch.us
          - N8N_PORT=5678
          - N8N_PROTOCOL=https
          - NODE_ENV=production
          - WEBHOOK_URL=https://ops.relaunch.us/
          - DB_TYPE=postgresdb
          - DB_POSTGRESDB_HOST=postgres
          - DB_POSTGRESDB_PORT=5432
          - DB_POSTGRESDB_DATABASE=relaunch_studio
          - DB_POSTGRESDB_USER=studio_admin
          - DB_POSTGRESDB_PASSWORD=${DB_PASSWORD}
          - EXECUTIONS_DATA_PRUNE=true
          - EXECUTIONS_DATA_MAX_AGE=168
        ports:
          - "127.0.0.1:5678:5678"
        volumes:
          - n8n_data:/home/node/.n8n
        depends_on:
          - postgres
          - redis
        networks:
          - studio-network

      render-worker:
        build:
          context: ./render-worker
          dockerfile: Dockerfile
        container_name: studio-render-worker
        restart: unless-stopped
        environment:
          - DATABASE_URL=postgresql://studio_admin:${DB_PASSWORD}@postgres:5432/relaunch_studio
          - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
          - S3_ENDPOINT=${S3_ENDPOINT}
          - S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
          - S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
          - S3_BUCKET_RAW=${S3_BUCKET_RAW}
          - S3_BUCKET_VARIANTS=${S3_BUCKET_VARIANTS}
          - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
          - FAL_KEY=${FAL_KEY}
          - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
          - ARCADS_API_KEY=${ARCADS_API_KEY}
        depends_on:
          - postgres
          - redis
        networks:
          - studio-network

      review-app:
        build:
          context: ./review-app
          dockerfile: Dockerfile
        container_name: studio-review-app
        restart: unless-stopped
        environment:
          - DATABASE_URL=postgresql://studio_admin:${DB_PASSWORD}@postgres:5432/relaunch_studio
          - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
          - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
          - NEXTAUTH_URL=https://review.relaunch.us
          - REVIEW_ACCESS_PIN=${REVIEW_ACCESS_PIN}
          - RESEND_API_KEY=${RESEND_API_KEY}
          - FRAMEIO_TOKEN=${FRAMEIO_TOKEN}
        ports:
          - "127.0.0.1:3002:3000"
        depends_on:
          - postgres
        networks:
          - studio-network

    networks:
      studio-network:
        driver: bridge

    volumes:
      postgres_data:
      redis_data:
      n8n_data:
    ```

- [ ] **0.4 Cloudflare R2 / S3 Storage Provisioning**
  - Create buckets in Cloudflare R2 (or self-hosted MinIO):
    - `relaunch-raw-assets`: Raw actor clips, generated b-roll snippets, audio VO files, music.
    - `relaunch-rendered-variants`: Final rendered MP4s in 9:16, 1:1, 4:5 with burned disclosure.
    - `relaunch-thumbnails`: High-res JPG frame previews.
  - Configure CORS policy allowing `https://review.relaunch.us` and `https://relaunch.us`.

- [ ] **0.5 DNS Records & Plesk Nginx Reverse Proxy Setup**
  - Add DNS A records in DNS manager:
    - `ops.relaunch.us` → Pointing to VPS IP.
    - `review.relaunch.us` → Pointing to VPS IP.
  - Issue Let's Encrypt SSL certificates for subdomains in Plesk.
  - Add Nginx Directives in Plesk for `ops.relaunch.us`:
    ```nginx
    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 250M;
    }
    ```
  - Add Nginx Directives in Plesk for `review.relaunch.us`:
    ```nginx
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 100M;
    }
    ```

- [x] **0.6 Production Environment Template (`relaunch-studio-engine/.env.example`)**
  - Create `.env.example` with documented keys:
    ```bash
    # Database & Redis Credentials
    DB_PASSWORD=make_a_strong_postgres_password_here
    REDIS_PASSWORD=make_a_strong_redis_password_here
    NEXTAUTH_SECRET=make_a_32_character_random_hex_secret
    REVIEW_ACCESS_PIN=relaunch-studio-2026

    # AI Reasoning Brain
    ANTHROPIC_API_KEY=sk-ant-api03-...

    # Model-Agnostic Video Router (fal.ai / Replicate / xAI)
    FAL_KEY=...
    REPLICATE_API_TOKEN=...
    XAI_API_KEY=...

    # Talking-Head Actors & Branded Voiceover
    ARCADS_API_KEY=...
    CREATIFY_API_KEY=...
    ELEVENLABS_API_KEY=...

    # Delivery & Review
    FRAMEIO_TOKEN=fio-u-...

    # S3 Object Storage (Cloudflare R2 or MinIO)
    S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
    S3_ACCESS_KEY_ID=...
    S3_SECRET_ACCESS_KEY=...
    S3_BUCKET_RAW=relaunch-raw-assets
    S3_BUCKET_VARIANTS=relaunch-rendered-variants

    # Notification & Alerting
    RESEND_API_KEY=re_...
    OPERATOR_ALERT_EMAIL=robert@relaunch.us
    ```

- [ ] **0.7 API Connectivity Verification Script**
  - Run Node.js connectivity check (`scripts/verify-studio-apis.mjs`):
    - Verify Anthropic Claude API returns valid completion.
    - Verify fal.ai router credentials.
    - Verify ElevenLabs voice query.
    - Verify Cloudflare R2 bucket read/write permissions.

- [ ] **0.8 Phase 0 Sign-Off**
  - Run `docker compose -f relaunch-studio-engine/docker-compose.yml up -d`.
  - Confirm all 5 containers report `healthy` in `docker ps`.
  - Confirm `https://ops.relaunch.us` displays n8n setup wizard.

---

### Phase 1: Database Core & State Machine (Week 2)
**Objective:** Deploy the PostgreSQL 16 schema, migration scripts, and typed database access clients.

- [x] **1.1 Complete PostgreSQL DDL Schema (`relaunch-studio-engine/db/init.sql`)**
  - Create the complete production schema:
    ```sql
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Clients
    CREATE TABLE clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        website VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
        frameio_project_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Brand Profiles synthesized by Claude
    CREATE TABLE brand_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        voice_json JSONB NOT NULL DEFAULT '{}',
        personas_json JSONB NOT NULL DEFAULT '[]',
        benefits_json JSONB NOT NULL DEFAULT '[]',
        objections_json JSONB NOT NULL DEFAULT '[]',
        do_not_say TEXT[] DEFAULT '{}',
        winner_profile_json JSONB DEFAULT '{}',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Weekly Batches
    CREATE TABLE batches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        week_of DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'drafting' CHECK (status IN ('drafting', 'generating', 'rendering', 'review', 'delivered', 'completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Scripts with hook variations
    CREATE TABLE scripts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
        angle VARCHAR(255) NOT NULL,
        framework VARCHAR(100) NOT NULL,
        target_persona VARCHAR(255),
        hook_variants_json JSONB NOT NULL,
        body TEXT NOT NULL,
        cta TEXT NOT NULL,
        compliance_flags_json JSONB DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Media Assets (actor clips, b-roll, voiceover, music, product stills)
    CREATE TABLE assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('actor_clip', 'broll', 'voiceover', 'music', 'product_still')),
        source_model VARCHAR(100) NOT NULL,
        storage_url TEXT NOT NULL,
        duration_seconds NUMERIC(6,2),
        meta_json JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Rendered Variants (9:16, 1:1, 4:5)
    CREATE TABLE variants (
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

    -- Human QA Review Decisions (The Safety Gate)
    CREATE TABLE reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
        reviewer_name VARCHAR(255) NOT NULL,
        decision VARCHAR(50) NOT NULL CHECK (decision IN ('approve', 'reject', 'recut')),
        notes TEXT,
        checklist_verified JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Deliveries to Frame.io
    CREATE TABLE deliveries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
        frameio_asset_id VARCHAR(255) NOT NULL,
        delivered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        client_decision VARCHAR(50) DEFAULT 'pending' CHECK (client_decision IN ('pending', 'client_approved', 'revision_requested')),
        client_feedback TEXT
    );

    -- Paid Social Performance Metrics (Flow H)
    CREATE TABLE performance (
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
        attributes_json JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Immutable Compliance & Legal Audit Trail
    CREATE TABLE compliance_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
        ai_elements TEXT[] NOT NULL,
        label_applied TEXT NOT NULL,
        license_refs_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Performance Indexes
    CREATE INDEX idx_variants_status ON variants(status);
    CREATE INDEX idx_scripts_batch ON scripts(batch_id);
    CREATE INDEX idx_assets_script ON assets(script_id);
    CREATE INDEX idx_performance_variant ON performance(variant_id);
    CREATE INDEX idx_reviews_variant ON reviews(variant_id);
    ```

- [x] **1.2 Database Client Library (`relaunch-studio-engine/render-worker/src/db.ts`)**
  - Implement connection pool with `pg`:
    ```typescript
    import { Pool } from 'pg';

    export const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 15,
      idleTimeoutMillis: 30000,
    });

    export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
      const res = await pool.query(text, params);
      return res.rows;
    }
    ```

- [x] **1.3 Storage S3 Wrapper Class (`relaunch-studio-engine/render-worker/src/storage.ts`)**
  - Implement `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` functions:
    - `uploadFile(localPath: string, key: string, contentType: string): Promise<string>`
    - `downloadFile(key: string, localDestPath: string): Promise<string>`
    - `getSignedPreviewUrl(key: string, expiresInSeconds = 3600): Promise<string>`

- [x] **1.4 Integration of Studio Public Intake Route (`src/app/api/studio/intake/route.ts`)**
  - Connect the public landing page form on `relaunch.us/studio` to the database:
    - Accepts business name, website URL, contact name, email, target goals.
    - Sends transactional confirmation email to client and alert to `robert@relaunch.us` via Resend HTTP API.
    - Dispatches webhook to n8n Flow A on `https://ops.relaunch.us/webhook/studio-intake`.

- [ ] **1.5 Migration Verification & Schema Health Check**
  - Execute automated test inserting a mock client, brand profile, batch, script, and variant.
  - Verify relational foreign keys cascade cleanly.

---

### Phase 2: Render Worker & Remotion Engine (Weeks 2–3)
**Objective:** Build the self-hosted rendering engine on the VPS that compiles video assets, kinetic captions, AI disclosures, and exports in 3 aspect ratios.

- [x] **2.1 Render Worker Dockerfile (`relaunch-studio-engine/render-worker/Dockerfile`)**
  - Complete Dockerfile with Node 20, Python 3, FFmpeg, Chromium, and fonts:
    ```dockerfile
    FROM node:20-bookworm-slim

    RUN apt-get update && apt-get install -y \
        ffmpeg \
        python3 \
        python3-pip \
        python3-venv \
        libvpx-dev \
        libx264-dev \
        curl \
        chromium \
        fonts-freefont-ttf \
        fonts-montserrat \
        && rm -rf /var/lib/apt/lists/*

    ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
    ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

    WORKDIR /app

    RUN python3 -m venv /opt/venv
    ENV PATH="/opt/venv/bin:$PATH"
    RUN pip3 install --no-cache-dir faster-whisper

    COPY package*.json ./
    RUN npm ci

    COPY . .
    RUN npm run build

    CMD ["node", "dist/index.js"]
    ```

- [x] **2.2 faster-whisper Python Transcription Engine (`render-worker/src/whisper.py`)**
  - Implement word-level timing extractor:
    ```python
    import sys, json
    from faster_whisper import WhisperModel

    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio path provided"}))
        sys.exit(1)

    audio_path = sys.argv[1]
    model = WhisperModel("base.en", device="cpu", compute_type="int8")
    segments, info = model.transcribe(audio_path, word_timestamps=True)

    words = []
    for segment in segments:
        for word in segment.words:
            words.append({
                "word": word.word.strip(),
                "start": round(word.start, 2),
                "end": round(word.end, 2)
            })

    print(json.dumps(words))
    ```

- [x] **2.3 Remotion React Ad Template Library (`render-worker/templates/`)**
  - **Template 1: ProblemSolution (`ProblemSolution.tsx`)**
    - 0–3s: High-impact problem hook text with b-roll cutaway.
    - 3–15s: Creator talking head + animated cutaways of client's product.
    - 15–20s: Social proof review callout card + dynamic brand CTA button.
  - **Template 2: TestimonialUGC (`TestimonialUGC.tsx`)**
    - Split-screen format with creator in top/left and live product action in bottom/right.
    - Animated star rating and verified buyer badge.
  - **Template 3: ListicleReasons (`ListicleReasons.tsx`)**
    - High-velocity "3 Reasons Why" layout with bold numerical counter badges (`#1`, `#2`, `#3`).
  - **Template 4: ComparisonUsVsThem (`ComparisonUsVsThem.tsx`)**
    - Split-screen comparison contrasting competitor pain points vs client solution.

- [x] **2.4 Kinetic Word-Highlight Captions Component (`Captions.tsx`)**
  - Replicate viral TikTok / Meta Reels subtitle aesthetics:
    - Font: Montserrat or Outfit Black, uppercase, heavy drop-shadow.
    - Active word highlighted in bright yellow (`#FFE600`) or ReLaunch purple (`#7F48ED`).
    - Placed safely in the center lower-third to avoid mobile interface occlusion.

- [x] **2.5 Mandatory AI-Disclosure Overlay (`Watermark.tsx`)**
  - Hardcoded Remotion composition layer:
    - Text: `AI-Generated Media`
    - Aesthetic: Glassmorphic translucent pill badge with subtle sparkle icon.
    - Baked permanently into the video canvas so it can never be accidentally bypassed.

- [x] **2.6 FFmpeg Audio Mastering & Multi-Ratio Export Pipeline (`ffmpeg.ts`)**
  - Master export script:
    1. Render 9:16 master video from Remotion (1080x1920).
    2. Audio Ducking: Voiceover stays at 100%, background music ducks to -18dB when voice is active.
    3. Normalization: Apply `loudnorm` filter targeting integrated loudness of `-14 LUFS` (standard for Meta and TikTok).
    4. Multi-Ratio Crop: Export 1:1 (1080x1080) and 4:5 (1080x1350) with centered smart-crop and aesthetic pillarbox background.

- [x] **2.7 BullMQ Redis Queue Worker (`render-worker/src/index.ts`)**
  - Listen on queue `render-jobs`:
    - Download assets from S3.
    - Run `whisper.py` transcription on voiceover.
    - Invoke Remotion renderer.
    - Run FFmpeg audio mastering and multi-ratio exports.
    - Upload exports to S3 `relaunch-rendered-variants`.
    - Update `variants` status to `needs_review`.
    - Create audit entry in `compliance_log`.

- [ ] **2.8 Render Engine Test Suite & Benchmark**
  - Render test job on VPS: verify video compiles in under 120 seconds.
  - Verify audio loudness reads exactly -14 LUFS (±1 LUFS) via FFmpeg analysis.

---

### Phase 3: Internal QA Review Web App (Week 3)
**Objective:** Deploy the internal QA portal at `review.relaunch.us` (Port 3002) providing a 60-second review gate for the human operator.

- [x] **3.1 Next.js 14 Review Portal Setup (`relaunch-studio-engine/review-app`)**
  - Initialize Next.js 14 App Router application with Tailwind CSS matching ReLaunch design tokens.
  - Secure with PIN authentication (`REVIEW_ACCESS_PIN`) and session cookies.

- [x] **3.2 Review Queue Dashboard (`src/app/page.tsx`)**
  - Real-time dashboard querying `SELECT * FROM variants WHERE status = 'needs_review'`.
  - Filterable by client, batch, and date.
  - Visual count badge showing pending review items.

- [x] **3.3 Synchronized Multi-Ratio Video Player (`components/VideoPlayer.tsx`)**
  - Primary viewport: 9:16 vertical player.
  - Instant toggle tabs for 1:1 square and 4:5 portrait ratios.
  - Frame scrubbing, keyboard shortcuts (Space: Play/Pause, J/L: Step 1s, A: Approve, R: Reject).

- [x] **3.4 Brief & Script Context Sidebar**
  - Displays side-by-side: Client brief, target persona, angle, hook text, and forbidden claim rules.
  - Highlights forbidden claims so reviewer can verify compliance at a glance.

- [x] **3.5 60-Second Quality Checklist Component (`components/Checklist.tsx`)**
  - Enforce mandatory confirmation before "Approve" button unlocks:
    - [x] Message strictly matches client brief
    - [x] Captions and speech are accurately synchronized
    - [x] AI-Generated Media disclosure watermark is clearly visible
    - [x] Audio volume is normalized (-14 LUFS, no loud music spikes)
    - [x] No visual artifacts or anatomical hallucinations

- [x] **3.6 Decision Action Endpoints (`src/app/api/studio/review/route.ts`)**
  - **Approve:** Updates status to `approved`, creates row in `reviews`, notifies n8n Flow F to push to Frame.io.
  - **Reject:** Updates status to `rejected`, records reason code.
  - **Recut:** Opens note modal (e.g., "swap b-roll clip 2", "duck music 3dB more"), queues recut job back into Redis BullMQ.

- [x] **3.7 Database Level Safety Enforcement**
  - Database rule: No variant can ever transition to `delivered` without a matching record in `reviews` where `decision = 'approve'`.

---

### Phase 4: AI Agent Brain & Claude Prompt Engine (Week 4)
**Objective:** Configure Claude 3.5 Sonnet structured JSON outputs for brand synthesis, script generation, and render specs.

- [x] **4.1 Brand Synthesis Node (`brand-synth.ts`)**
  - Input: Scraped website text, customer reviews, product catalog.
  - Output Schema:
    ```json
    {
      "brand_name": "String",
      "voice_tone": ["Energetic", "Relatable", "Direct"],
      "primary_personas": [
        { "name": "Adult Beginner", "pain_points": ["Intimidated", "No rhythm"], "desires": ["Fun workout", "Social"] }
      ],
      "core_benefits": ["No judgment zone", "World-class instructors", "Great cardio"],
      "objections": ["I have two left feet", "Too expensive"],
      "do_not_say": ["Guaranteed professional dancer", "Lose 20lbs in 7 days"]
    }
    ```

- [x] **4.2 Weekly Script Generator (`script-gen.ts`)**
  - Generates 4 distinct creative angles per product with 3–5 hooks each:
    - Angle 1: Direct Problem / Agitation Hook.
    - Angle 2: Social Proof / UGC Testimonial.
    - Angle 3: 3 Reasons Why / Listicle.
    - Angle 4: Us vs. Them / Unboxing.
  - Output Schema:
    ```json
    {
      "scripts": [
        {
          "angle": "Direct Problem",
          "framework": "Problem-Agitation-Solution",
          "target_persona": "Adult Beginner",
          "hook_variants": [
            { "id": "h1", "text": "Think you have two left feet? Watch this.", "type": "challenge" },
            { "id": "h2", "text": "Stop scrolling if traditional gym workouts bore you to tears.", "type": "warning" }
          ],
          "body": "Dance Fusion is designed for total beginners. Zero judgment, pure energy, and instructors who actually teach.",
          "cta": "Claim your $10 intro class today."
        }
      ]
    }
    ```

- [x] **4.3 Automated Compliance Pre-Check Node (`compliance-check.ts`)**
  - Screens scripts against FTC, Meta, and TikTok advertising policies:
    - Flag medical/health cure claims.
    - Flag unrealistic financial/income claims.
    - Flag deceptive testimonial framing.
  - Automatically rewrites flagged claims to compliant phrasing before database insert.

- [x] **4.4 Edit-Spec JSON Generator Node (`edit-spec-gen.ts`)**
  - Converts script and S3 asset inventory into Remotion render instructions:
    ```json
    {
      "template": "ProblemSolution",
      "aspect_ratios": ["9x16", "1x1", "4x5"],
      "tracks": {
        "hook": { "asset_id": "a_hook_01", "in": 0.0, "out": 2.8 },
        "body": [
          { "asset_id": "a_actor_talking_head", "in": 0.0, "out": 12.0 },
          { "type": "cutaway", "asset_id": "a_broll_dance_class", "at": 3.5, "dur": 2.5 },
          { "type": "cutaway", "asset_id": "a_broll_studio_vibe", "at": 7.5, "dur": 2.0 }
        ],
        "voiceover": { "asset_id": "a_voice_clean" },
        "music": { "asset_id": "a_music_upbeat", "gain_db": -18 }
      },
      "captions": { "style": "word_highlight", "max_chars": 16, "position": "lower_third" },
      "cta": { "text": "Claim $10 Intro Class", "end_card": "brand_default" },
      "disclosure": { "label": "AI-Generated Media", "position": "bottom_left" }
    }
    ```

- [x] **4.5 Creative Attribute Tagging Node (for Winner Analysis)**
  - Machine tags each script with attributes: Hook Type, Persona Age, Music Tempo, Pacing, Avatar Gender.

- [x] **4.6 Zod Schema Validation Suite**
  - Implement Zod schema validation ensuring 100% JSON parse compliance from Claude API responses.

---

### Phase 5: Video Gen Router & Asset Generation APIs (Weeks 4–5)
**Objective:** Build the model-agnostic router and integrate talking-head actors, scene b-roll, and branded voiceover.

- [x] **5.1 Unified Video Generation Router (`render-worker/src/router.ts`)**
  - Build model-agnostic wrapper:
    ```typescript
    export interface GenerateSceneParams {
      prompt: string;
      imagePromptUrl?: string;
      durationSeconds: number;
      aspectRatio: '9:16' | '16:9' | '1:1';
      model: 'grok-1.5' | 'veo-3.1' | 'seedance-2' | 'kling-3';
    }

    export async function generateScene(params: GenerateSceneParams): Promise<string> {
      // Maps to fal.ai / Replicate / Vertex AI based on configuration
      // Returns direct S3 URL of generated clip
    }
    ```

- [x] **5.2 Grok Imagine (Video 1.5) Integration**
  - Primary workhorse for high-volume social b-roll (~$0.08/sec).
  - Fast 6s/720p output in ~25 seconds.

- [x] **5.3 Google Veo 3.1 Integration**
  - Hero shots where high dynamic range, native audio, and photorealism are required (~$0.40/sec).
  - Accessed via Vertex AI.

- [x] **5.4 Seedance 2.0 (Product Image-to-Video) Integration**
  - Animates static client product photos into dynamic camera sweeps and rotations.

- [x] **5.5 Arcads.ai / Creatify.ai Actor Integration**
  - Submits script to talking-head actor API:
    - Matches actor demographics to script persona.
    - Downloads returned high-res actor `.mp4` directly to S3 `relaunch-raw-assets`.

- [x] **5.6 ElevenLabs Voiceover Integration**
  - Generates custom voiceover track with natural conversational cadence.
  - Supports speech-to-speech transfer to carry real human emotion and timing.

---

### Phase 6: Orchestration Pipelines in n8n (Weeks 5–7)
**Objective:** Implement the automated workflows in n8n connecting intake to delivery.

- [x] **6.1 Flow A — Client Onboarding & Brand Synthesis**
  - Trigger: Webhook from `src/app/api/studio/intake/route.ts`.
  - Actions: Scrapes client site → calls Claude Brand Synth → writes `brand_profiles` row → emails alert to `robert@relaunch.us`.

- [x] **6.2 Flow B — Weekly Batch Script Generator**
  - Trigger: Cron every Monday at 6:00 AM.
  - Actions: Fetches active clients → pulls winner attributes from `performance` table → generates 4 angles × 4 hooks → runs Compliance Pre-Check → inserts into `scripts` with `status = 'draft'`.

- [x] **6.3 Flow C — Parallel Asset Generation Fan-Out**
  - Trigger: Script approved.
  - Actions: Fans out parallel API calls: Actor Clip (Arcads), Voiceover (ElevenLabs), Scene B-Roll (Router: Grok/Veo), Product Still Animation (Seedance) → stores in S3 → updates `assets` table.

- [x] **6.4 Flow D — Render Job Queue Dispatcher**
  - Trigger: All required assets for a script are in S3.
  - Actions: Calls Claude Edit-Spec Generator → enqueues job into Redis/BullMQ `render-jobs` → updates `variants` status to `rendering`.

- [x] **6.5 Flow E — QA Notification**
  - Trigger: Render worker marks variant `needs_review`.
  - Actions: Sends notification email via Resend to `robert@relaunch.us` with direct link to `review.relaunch.us/review/[id]`.

- [x] **6.6 Flow F — Frame.io Client Delivery**
  - Trigger: Human operator clicks "Approve" in review app.
  - Actions: Uploads 9:16 master, 1:1, and 4:5 ratios to client's Frame.io project room → posts angle explanation note → sets variant status to `delivered`.

- [x] **6.7 Client Revision Feedback Loop**
  - Trigger: Webhook from Frame.io on client timestamped comment.
  - Actions: Parses revision feedback → creates `recut` job payload → enqueues back into Flow D.

- [x] **6.8 n8n Workflow JSON Version Control**
  - Export all workflows and commit to `relaunch-studio-engine/n8n-workflows/`.

---

### Phase 7: Closed-Loop Performance & Publishing (Weeks 8–10)
**Objective:** Ingest paid social advertising performance data, generate winner profiles, and publish approved ads directly to ad accounts.

- [ ] **7.1 Flow H: Performance Metrics Ingestion**
  - Nightly cron pulling ad metrics via Meta Marketing API & TikTok Marketing API:
    - Spend, Impressions, Link Clicks, Conversions, CPA, ROAS.
    - **Thumbstop Rate:** 3-Second Video Views ÷ Impressions (measures hook efficacy).
    - **Hold Rate:** 50% Video Views ÷ 3-Second Views (measures body retention).
  - Inserts daily snapshots into `performance` table.

- [ ] **7.2 Creative Winner Profile Generation**
  - Claude weekly analysis node:
    - Cross-references performance metrics with script attributes.
    - Identifies statistical winners (e.g. "Question hooks with female 25–34 avatars produced 38% lower CPA").
    - Updates `brand_profiles.winner_profile_json`.
    - Automatically seeds the next Monday Flow B prompt with winning formulas.

- [ ] **7.3 Flow G: Automated Ad Account Publishing (Phase 2)**
  - Direct upload to client Meta & TikTok ad accounts:
    - Meta Marketing API: Creates ad creative with campaign/ad set assignment, automatically checks `is_ai_generated: true`.
    - TikTok Marketing API: Publishes Spark Ad code with synthetic media declaration.

- [ ] **7.4 Automated Weekly Client Performance Report**
  - Auto-generates clean Friday PDF/web summary:
    - Highlights top 3 winning ads of the week.
    - Shows CPA reduction trends.
    - Outlines next week's planned creative angles.

- [ ] **7.5 System Health & Disk Space Watchdog**
  - Monitors VPS NVMe disk usage, Postgres connection pools, and BullMQ queue latency.
  - Sends alert if disk capacity exceeds 80%.

---

### Phase 8: Compliance Verification, Legal Audit & Launch
**Objective:** Final legal, regulatory, and quality audit before commercial onboarding.

- [ ] **8.1 Mandatory AI-Disclosure Audit**
  - Verify 100% of rendered video files have visible, legible AI-disclosure watermarks.
  - Verify every ad uploaded to Meta or TikTok has the AI-content disclosure toggle turned ON.

- [ ] **8.2 Commercial Licensing Audit**
  - Confirm all background music tracks originate from commercial royalty-free libraries (e.g., Epidemic Sound, Artlist) with valid enterprise licenses.
  - Confirm all AI actor models originate from licensed platforms (Arcads, Creatify, HeyGen) with commercial rights cleared.

- [ ] **8.3 Audit Trail Verification (`compliance_log`)**
  - Confirm query `SELECT * FROM compliance_log WHERE variant_id = '...'` returns full provenance:
    - AI video model names, voice ID, license references, and label applied timestamp.

- [ ] **8.4 Single-Client Live Pilot Test**
  - Run full cycle for 1 live client:
    - Monday 6 AM: 4 angles generated.
    - Tuesday: Assets generated via APIs.
    - Wednesday: Render worker outputs 16 variants (4 angles × 4 hooks).
    - Thursday: Human operator reviews variants in `review.relaunch.us` (< 60s per ad).
    - Friday: Approved batch delivered to Frame.io.

- [ ] **8.5 Final System Acceptance Sign-Off**
  - Cost per variant verified: < $5.00 in combined AI API fees.
  - Turnaround SLA verified: < 48 hours from script to review-ready video.
  - Human review throughput verified: 1 operator can QA 50+ ads in under 1 hour.

---

## 6. Developer Quick Start & Multi-Machine Operational Runbook

When pulling this repository to a new computer or deploying to the VPS:

### Running Locally for Development:
```bash
# 1. Clone repository and navigate to engine directory
cd c:\xampp\htdocs\ReLaunch\relaunch-studio-engine

# 2. Copy and populate local environment
cp .env.example .env.local

# 3. Start local Postgres and Redis
docker compose up -d postgres redis

# 4. Install render worker dependencies
cd render-worker
npm install

# 5. Run render worker locally
npm run dev

# 6. Start QA Review App
cd ../review-app
npm install
npm run dev
# Accessible at http://localhost:3002
```

### Production Deployment to Plesk VPS:
```bash
# 1. SSH into VPS host
ssh root@YOUR_VPS_IP

# 2. Pull latest code from GitHub
cd /var/www/vhosts/relaunch.us/httpdocs
git pull origin main

# 3. Launch or restart Docker Compose stack
cd relaunch-studio-engine
docker compose -f docker-compose.yml up -d --build

# 4. Inspect container logs
docker compose logs -f render-worker
```

### Checking Off Completed Tasks:
When you finish a task, change `- [ ]` to `- [x]` in this document and commit:
```bash
git add RELAUNCH_STUDIO_AI_VIDEO_SYSTEM_PLAN.md
git commit -m "docs(plan): update progress on phase X.X"
git push origin main
```

---

*This document is the official implementation plan. Keep updated as development milestones are completed.*
