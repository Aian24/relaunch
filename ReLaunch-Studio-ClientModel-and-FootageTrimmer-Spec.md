# ReLaunch Studio — Dev Spec: Client/Project Model + Client Footage Trimmer
### Nov 25, 2026 · For the developer

These two changes reorient the Studio from a **brand-preset generator** into a **client-first production system** that matches the real agency workflow: client onboards with raw footage → we strategize → we produce multiple ad assets → we deliver. Build on the existing routes and the 4-scene composition model; don't rebuild what works (generator, review gate, vault, creator trimmer, exports).

---

# Feature 1 — Client / Project Model

## Goal
Make a **client** the top-level container. Each client owns their footage, brand profile, strategy, ads, deliverables, and review links. Replace the current brand-preset-centric organization, where real and fictional brands are mixed in flat lists.

## Data model (Postgres)
New `clients` table:
```
clients
  id (uuid)
  name
  slug
  status            # prospect | active | paused | archived
  contact_name, contact_email, contact_phone
  brand_profile_json  # offer/promo, target audience, brand voice,
                      # do-not-say list, approved claims, trust badges
  logo_url, brand_assets_ref
  created_at, updated_at
```
Add `client_id` (FK → clients.id) to the existing entities:
- footage / brand media assets → `client_id`
- ad jobs / generations → `client_id`
- approved deliverables → `client_id`
- review links → `client_id` (+ ad_id)

**Creators stay a shared global library** (not per-client) — but record which creators are used/approved per client so the generator can suggest them.

## Screens
1. **Clients dashboard** — new Studio landing (e.g. `/studio/clients`): card/table of clients with status, # footage assets, # ads (draft / in-review / approved), last activity, and an **Add Client** button. This becomes the home screen after login instead of the generator.
2. **Client workspace** (`/studio/clients/[id]`): the hub for one client, with sections/tabs:
   - **Brand Profile** — name, offer/promo, target audience, brand voice, logo, do-not-say list, approved claims/trust badges (feeds the compliance + trust-badge checks)
   - **Footage** — this client's raw + trimmed clips (Feature 2)
   - **Ads** — jobs list: draft → generating → in-review → approved → delivered
   - **Deliverables** — approved ads with download kits + Drive
   - **Review Links** — client-facing white-label links
3. **Generator** — reoriented to **start from a client**, not a preset. Entering the generator from a client workspace pre-loads that client's brand/offer/footage/approved-creators. The old "Preset" selector becomes "Client." (A quick-create path for a brand-new client is fine.)

## Behavior
- Every ad job is created inside a client context (no orphan generations).
- Every footage upload attaches to a client.
- Review queue and Approved Vault filter and group by client.
- Deliverables and review links are scoped to their client.

## Migration
- Convert the **real** existing brands to clients (AI Recommendations, TurfLife, plus any real clients).
- Move **fictional sample brands** (Carmen Hotel, Dewpoint, Frank & Patty, etc.) into a separate **"Samples / Concept"** space — not mixed with real clients, and never shown as "Approved" client deliverables.

---

# Feature 2 — Client Raw-Footage Trimmer

## Goal
Clients hand over **raw, unedited** video. Let the team ingest it, review it, and cut the usable moments into **scene-ready clips** inside the tool — mirroring the existing creator hook trimmer. Today the assets page assumes footage is already scene-ready; this fills that gap.

## Data model
```
client_raw_footage
  id, client_id
  storage_url            # raw file in R2
  filename, duration, mime
  status                 # raw | processed
  uploaded_at

client_clips
  id, client_id
  source_raw_id          # FK → client_raw_footage
  in_point, out_point    # seconds, 0.1s precision
  scene_role             # hook_alt | product | broll | detail | cta
  label, notes
  preview_url            # lightweight preview
  created_at
```
**Recommendation: virtual clips.** Store in/out points and resolve them at final render (FFmpeg `-ss`/`-to`) rather than rendering a physical subclip per trim — saves storage and compute. Generate only a lightweight preview for the library.

## Screens / UX
- **Raw upload** (in the client's Footage section): drag-drop **multiple, possibly long** raw files (MP4/MOV). Transcode HEVC/.mov on ingest (client phone footage is often HEVC).
- **Trimmer** — reuse the creator hook trimmer component for consistency: play raw video, scrub, set in/out at **0.1s precision**, looping preview, then **Save Clip**. Each saved clip is tagged with a **scene role** (product / b-roll / detail / alt-hook) + label. Multiple clips can be pulled from one raw file.
- **Client clip library** — the extracted clips, filterable by scene role, ready to drop into generator scenes.

## Integration with the 4-scene composition
- Scene 1 (opening hook): creator hook (existing creator library)
- Scenes 2–3 (product / b-roll): **pull from this client clip library first**; AI gap-fill (Kling/Grok) only when no suitable client clip exists
- Scene 4 (CTA): branded end-card template
- The generator's scene slots should show the client's available clips for that scene role as the default source.

## Technical notes
- FFmpeg already in the pipeline — use it for transcode-on-ingest and render-time subclip extraction.
- Generate thumbnails/sprite for scrubbing in the trimmer.
- Respect the virtual-clip in/out at final assembly so trims are lossless and re-editable.

---

# Build sequence
1. `clients` table + `client_id` on footage, jobs, deliverables, review links. Migration script (real brands → clients; fictional → Samples space).
2. Clients dashboard + client workspace shell.
3. Reorient the generator to start from a client (preset → client).
4. Client raw-footage upload + transcode-on-ingest.
5. Client footage trimmer (reuse creator trimmer) + client clip library.
6. Wire generator scene slots (2–3) to pull from the client clip library, AI gap-fill as fallback.
7. Filter/group review queue + vault by client.

# Out of scope (don't change)
Creator library + hook trimmer, the 5-gate review + CD sign-off, 4K/XML/ZIP exports, Meta/TikTok kits, Drive delivery, login/route protection. These stay as-is — the client model wraps around them.
