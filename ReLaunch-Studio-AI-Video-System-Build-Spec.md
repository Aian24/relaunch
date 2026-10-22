# ReLaunch Studio — AI Video Ad System
### Developer Build Specification

**Owner:** Robert Clark, ReLaunch (relaunch.us/studio)
**Version:** 1.0 · 2026-10-21
**Purpose:** Technical spec to build the AI-operated video ad production system. Hand this to the developer as the implementation brief.

> **Note to the developer:** Model names, endpoints, and pricing in §9 move fast — treat them as current-as-of-October-2026 and verify against each provider's live docs before wiring. Everything architectural (§3–§8, §10–§16) is stable.

---

## 1. What we're building

A **self-hosted, AI-operated** system that turns a brand brief into dozens of compliant, test-ready short-form video ad variants per week. AI agents do the production work (strategy, scripting, asset generation, editing); **a human verifies every output before it reaches the client.** Approved creative is delivered for client review, optionally published to Meta/TikTok, and winners feed the next cycle automatically.

The operating model is **AI-operated, human-supervised** — one operator + a reviewer running what used to take a full creative team.

---

## 2. Hard constraints (non-negotiable)

1. **Everything self-hosted in Plesk on a VPS.** No Base44. No lock-in SaaS for core infrastructure (orchestration, database, rendering).
2. **Frontier video/voice models are API-only** (they can't be self-hosted) and must be accessed through a **model-agnostic router** so any model can be swapped with a config change. *Reason: OpenAI shut down Sora's API on 2026-09-24 — anything hard-wired to one model is a liability.*
3. **AI is the editing brain; the render executes on our VPS** (FFmpeg + Remotion + Whisper). No black-box auto-editor.
4. **Human QA gate is mandatory.** No AI-generated asset reaches a client without a human approval.
5. **Compliance labeling is baked into the render template**, not bolted on. Every synthetic-actor / AI-voice asset ships with an AI-disclosure label, and we keep a compliance log.

---

## 3. System architecture

```
                         ┌─────────────────────────────────────────────┐
                         │           VPS (Plesk, Dockerized)            │
                         │                                              │
  Client intake ───────▶ │  n8n (orchestration / agent hub)             │
                         │     │                                        │
                         │     ├─▶ Postgres (state: clients, scripts,    │
                         │     │        assets, renders, reviews, perf)  │
                         │     ├─▶ Redis + worker queue (render jobs)    │
                         │     ├─▶ Render workers:                       │
                         │     │     • FFmpeg (stitch/trim/mix/export)   │
                         │     │     • Remotion (templated edit + caps)  │
                         │     │     • Whisper (self-hosted transcribe)  │
                         │     └─▶ Internal review app (QA queue)        │
                         │                                              │
                         │  Object storage: MinIO (self-host) or R2     │
                         └───────────────┬──────────────────────────────┘
                                         │  (API calls out)
        ┌────────────────────────────────┼─────────────────────────────────────┐
        ▼                 ▼               ▼                ▼                     ▼
  Claude API        Video gen router   Actor tools     ElevenLabs          Frame.io API
 (agent brain)   (fal.ai/Replicate/   (Arcads /        (voice)          (client review) +
                  Vercel AI Gateway)    Creatify /                       Meta/TikTok APIs
                  → Grok / Veo /        HeyGen APIs)                      (publishing, Ph2)
                    Seedance / Kling
```

**Runs on the VPS:** n8n, Postgres, Redis, render workers (FFmpeg/Remotion/Whisper), the internal review app, object storage (if MinIO).
**External APIs:** Claude (agent reasoning), the video-gen router + models, actor tools, ElevenLabs, Frame.io, Meta/TikTok (phase 2).

---

## 4. Infrastructure & environment

- **VPS sizing (start):** 8–16 vCPU, 32 GB RAM, fast NVMe (video files are large), generous egress. Generation is offloaded to APIs, so the box is mainly n8n + DB + rendering. **Add a GPU worker later** only if Whisper transcription or Remotion render throughput becomes the bottleneck (or fall back to a transcription API — see §10).
- **Plesk:** run services as **Docker containers** (Plesk Docker extension or Docker Compose on the VPS). One compose stack: `n8n`, `postgres`, `redis`, `render-worker` (Node + FFmpeg + Remotion + faster-whisper), `review-app`, optional `minio`.
- **Object storage:** **MinIO** (fully self-hosted, S3-compatible) for the pure self-host path, **or Cloudflare R2** if you want cheap storage + low egress pain. Pick one; the code uses the S3 SDK either way.
- **Domains:** put the internal tools behind auth on subdomains, e.g. `ops.relaunch.us` (n8n), `review.relaunch.us` (QA app). Client-facing review stays in Frame.io.
- **Secrets:** all API keys in a `.env` loaded by the compose stack (or Docker secrets / Vault). Never commit keys. Keys needed: `ANTHROPIC_API_KEY`, video-gen router key(s), `ELEVENLABS_API_KEY`, actor-tool key(s), `FRAMEIO_TOKEN`, (Phase 2) `META_*`, `TIKTOK_*`, storage creds, `DATABASE_URL`, `REDIS_URL`.
- **Repo:** monorepo — `/n8n` (exported workflows as JSON, version-controlled), `/render` (Remotion project + FFmpeg scripts + worker), `/review-app`, `/db` (migrations), `/docs`.

---

## 5. Service inventory

| Component | Role | Hosting | Access |
|---|---|---|---|
| **n8n** | Orchestration + agent hub; runs all pipeline flows | Self-host (Docker) | Web UI + webhooks |
| **Postgres** | System of record (all state) | Self-host (Docker) | SQL |
| **Redis + queue** | Render job queue (BullMQ) | Self-host (Docker) | — |
| **FFmpeg** | Stitch, trim, overlay, audio mix, multi-ratio export | Self-host (in worker) | CLI from worker |
| **Remotion** | Reusable ad **templates** (captions, end-cards, animated text) in React | Self-host (in worker) | `@remotion/renderer` |
| **Whisper** (faster-whisper) | Transcribe VO/actor audio → caption timing | Self-host (in worker) | Python/HTTP |
| **MinIO** or **R2** | Media object storage | Self-host / external | S3 SDK |
| **Review app** | Human QA queue (approve/reject/recut) | Self-host | Web UI |
| **Claude API** | Agent brain: brand synth, scripting, edit-spec, compliance, perf tagging | External API | REST |
| **Video-gen router** (fal.ai / Replicate / Vercel AI Gateway) | Model-agnostic access to scene models | External API | REST |
| **Grok Imagine / Veo 3.1 / Seedance / Kling** | Scene & b-roll generation | External (via router) | REST |
| **Arcads / Creatify / HeyGen** | Talking-head UGC actors | External API | REST |
| **ElevenLabs** | Custom/branded voiceover | External API | REST |
| **Frame.io** | Client review + revision comments | External API | REST |
| **Meta / TikTok Marketing API** (Phase 2) | Push creative to ad accounts | External API | REST |
| **Motion** (or Meta/TikTok reporting APIs) | Creative performance data | External API | REST |

---

## 6. Data model (Postgres — schema sketch)

```
clients            (id, name, website, status, created_at)
brand_profiles     (id, client_id, voice_json, personas_json, benefits_json,
                    objections_json, do_not_say[], assets_ref, updated_at)
batches            (id, client_id, week_of, status)                 -- weekly cycle
scripts            (id, batch_id, angle, framework, hook_variants_json,
                    body, cta, persona, status,                      -- draft|approved|rejected
                    compliance_flags_json)
assets             (id, script_id, type, source_model, storage_url,  -- actor_clip|broll|
                    duration, status, meta_json)                     --  voiceover|music|product_still
variants           (id, script_id, aspect_ratio, storage_url,        -- 9x16|1x1|4x5
                    render_spec_json, status,                        -- rendering|needs_review|
                    disclosure_applied bool)                         --  approved|rejected|delivered
reviews            (id, variant_id, reviewer, decision, notes,       -- approve|reject|recut
                    created_at)
deliveries         (id, variant_id, frameio_asset_id, delivered_at,
                    client_decision, revision_notes)
performance        (id, variant_id, platform, date, spend, impressions,
                    ctr, cpa, roas, hook_rate, hold_rate, attributes_json)
compliance_log     (id, variant_id, ai_elements[], label_applied,
                    license_refs_json, created_at)
```

`status` columns drive the whole state machine; n8n flows transition them.

---

## 7. The pipeline (components → n8n flows)

Each stage is an n8n workflow. Inputs/outputs are Postgres rows + storage objects.

**Flow A — Onboarding** (`trigger: intake form webhook`)
→ scrape client site + ad library + reviews → **Claude: brand synthesis** → write `brand_profiles` row → notify operator to sanity-check.

**Flow B — Weekly batch** (`trigger: cron, weekly`)
→ pull winning-angle research (ad-research API) + winner profile from §14 → **Claude: generate N scripts** (angles, hooks, body, CTA) → **Claude: compliance pre-check** (flag banned claims) → write `scripts` (status `draft`).

**Flow C — Asset generation** (`trigger: script ready`)
For each script, fan out in parallel:
- **Actor clip:** POST script → Arcads/Creatify → `assets (actor_clip)`
- **Voiceover:** POST script → ElevenLabs → `assets (voiceover)` *(or use actor tool's built-in VO)*
- **B-roll/scenes:** POST shot prompts → video-gen router (Grok default) → `assets (broll)`
- **Product stills → motion:** client photo → Seedance (image-to-video) → `assets (broll)`
- **Music:** select licensed track → `assets (music)`
Mark assets `ready`.

**Flow D — Render** (`trigger: all assets ready`) → §10. Produces `variants` (status `needs_review`) in 9:16 / 1:1 / 4:5, disclosure label applied.

**Flow E — QA gate** (`trigger: variant needs_review`) → §11. Human approves → status `approved`.

**Flow F — Delivery** (`trigger: variant approved`) → push to client's Frame.io room → `deliveries`. Revision comments route back as recut jobs into Flow D.

**Flow G — Publishing** (Phase 2, `trigger: client-approved`) → Meta/TikTok API, AI-disclosure toggle on. → §13.

**Flow H — Performance & iteration** (`trigger: nightly`) → §14.

---

## 8. AI agent layer (Claude API)

Claude is called at specific decision nodes. Use structured output (JSON) so n8n can act on results.

| Agent node | Input | Output | Used in |
|---|---|---|---|
| **Brand synthesis** | scraped site, reviews, existing ads | `brand_profile` JSON (voice, personas, benefits, objections, do-not-say) | Flow A |
| **Script generation** | brand_profile, research, winner profile | N scripts tagged by angle/framework/persona, each with 3–5 hook variants | Flow B |
| **Compliance pre-check** | each script | pass/flag + reasons (before/after, health, income claims) | Flow B |
| **Edit-spec generation** | script + available assets (durations, urls) | **render-spec JSON** (clip order, caption timing, cutaways, music, CTA, exports) → feeds Remotion/FFmpeg | Flow D |
| **Performance tagging + winner analysis** | performance rows | per-creative attribute tags + "winner profile" (which angles/hooks/actors/formats win) | Flow H |

Model: use the current strongest Claude model for reasoning nodes; a faster/cheaper tier is fine for tagging. The **edit-spec node is the heart of "AI edits the video"** — Claude decides the cut; Remotion/FFmpeg execute it.

---

## 9. Video generation integration (model-agnostic)

**Route everything through one abstraction** (`fal.ai`, `Replicate`, or `Vercel AI Gateway`) so swapping a model is a config change. Build a thin internal `generateScene(prompt, opts)` that maps to the chosen provider.

**Scene / b-roll models** (verify identifiers in live docs):

| Model | Use | Notes (Oct 2026) |
|---|---|---|
| **Grok Imagine (Video 1.5)** — default workhorse | High-volume cheap variants, fast social b-roll | ~$0.08/sec, audio included; 1–15s, up to 1080p; 6s/720p in ~25s. Edit endpoint `grok-imagine-video-edit` (~$0.06/sec). Identifiers: `xai/grok-imagine-video` (Vercel AI Gateway), `grok-imagine-video-1.5-preview` (xAI). |
| **Google Veo 3.1** — hero shots | Premium shots where realism+audio carry the ad | Best all-round; native audio, native 9:16, up to 60s, 4K. Access via Vertex AI. ~$0.40/sec (≈$0.05/sec silent Lite). |
| **Seedance 2.0 (ByteDance)** — product stills | Animate a real product photo into motion | Top image-to-video; favored for UGC ads. |
| **Kling 3.0 (Kuaishou)** — value | High-volume product/social clips | Cheapest tier; strong motion + lip-sync face stability. |

**Do NOT build on Sora** — API retired 2026-09-24.

**Talking-head actor tools** (separate layer — the scene models above do NOT replace these):
- **Arcads** (best actor realism) and/or **Creatify** (volume, URL-to-video); **HeyGen** for spokesperson/multilingual. Use their APIs; store the returned clip as an `actor_clip` asset. Match actor demographics to the script's persona.

**Voice:** **ElevenLabs** API for a consistent branded voice (or speech-to-speech to carry a real emotional read). Scene models generate their own audio for b-roll.

---

## 10. Render pipeline (FFmpeg + Remotion + Whisper)

This is the self-hosted "editor." Runs in the `render-worker` container, pulling jobs off the Redis/BullMQ queue so renders don't overwhelm the box.

**Steps per variant:**
1. **Transcribe** actor clip / VO with **faster-whisper** → word-level timestamps. *(If CPU transcription is too slow at volume, fall back to a transcription API; keep the interface identical.)*
2. **Assemble** via **Remotion** template: the render-spec JSON (from Claude, §8) populates placeholders — hook clip → body (actor + b-roll cutaways) → **word-highlight captions** (from Whisper timings) → CTA end-card. Remotion renders the composition.
3. **FFmpeg** for anything Remotion shouldn't: concatenation, audio ducking/mix (VO over music), loudness normalization (target ~ -14 LUFS), and exporting **all three aspect ratios** (9:16, 1:1, 4:5).
4. **Burn in the AI-disclosure label** as a template layer (see §15). Write `variants` row, status `needs_review`.

**Remotion templates:** build a small library of 4–6 parameterized ad templates (testimonial, listicle "3 reasons," problem-solution, unboxing, comparison). Each is a React composition with typed props. Templates are version-controlled in `/render`.

**Sample render-spec JSON** (what Claude emits, what the template consumes):
```json
{
  "template": "testimonial_v1",
  "aspect_ratios": ["9x16", "1x1", "4x5"],
  "tracks": {
    "hook": { "asset_id": "a_hook_03", "in": 0.0, "out": 2.4 },
    "body": [
      { "asset_id": "a_actor_main", "in": 0.0, "out": 11.0 },
      { "type": "cutaway", "asset_id": "a_broll_pourshot", "at": 4.2, "dur": 1.8 },
      { "type": "cutaway", "asset_id": "a_broll_product", "at": 8.0, "dur": 1.5 }
    ],
    "voiceover": { "asset_id": "a_vo_main" },
    "music": { "asset_id": "a_music_upbeat", "gain_db": -18 }
  },
  "captions": { "style": "word_highlight", "max_chars": 14, "position": "lower_third" },
  "cta": { "text": "Get 20% off today", "end_card": "brand_default" },
  "disclosure": { "label": "AI-generated", "position": "bottom", "full_duration": true }
}
```

---

## 11. Human QA gate (the review app)

A lightweight internal web app reading `variants where status = needs_review`.

- **Per variant the reviewer sees:** the rendered video (all ratios), the source script, and a checklist.
- **Actions:** **Approve** (→ `approved`, proceeds to delivery), **Reject** (→ `rejected`, drops), **Recut** (→ back to Flow D with notes).
- **Checklist (keep it a ~60-second gate, not a re-edit):** matches the brief ✓ · claims compliant ✓ · **AI-disclosure label present** ✓ · lip-sync / caption sync clean ✓ · no visual artifacts ✓ · audio levels fine ✓.
- **Nothing with status other than `approved` can enter Flow F.** Enforce at the query level.

This is the single checkpoint that protects against banned ad accounts, compliance misses, and embarrassing glitches. The AI did the work; the human is the safety valve.

---

## 12. Client delivery

On `approved`, Flow F pushes the variant to the client's **Frame.io** review room via API, with a short auto-generated note ("what's in this batch and why," per angle). Client leaves timestamped comments → n8n parses them → creates recut jobs (Flow D) → re-render → re-deliver. Track `client_decision` in `deliveries`.

---

## 13. Publishing (Phase 2+)

Once a variant is client-approved, push to the client's ad accounts via **Meta Marketing API** + **TikTok Marketing API**, with the **AI-generated-content disclosure toggle ON** at upload. Distribution runs as standard in-feed ads from the brand's own page/handle (we are **not** faking creator whitelisting — see the master plan). A real-creator hybrid for whitelisting is a separate, optional track.

---

## 14. Performance & iteration loop (Flow H)

Nightly: pull creative performance (Motion, or Meta/TikTok reporting APIs) → **Claude tags each creative's attributes** (angle, hook type, actor, format, edit style) → compute a **winner profile** (which attributes correlate with low CPA / high ROAS / high hook-rate) → write it back so **Flow B's next script batch is seeded by the winner profile.** This closes the loop: the factory gets smarter each week. Auto-generate a weekly client report from the same data.

---

## 15. Compliance hooks (build these in, don't defer)

- **Disclosure label:** a mandatory Remotion template layer on every synthetic-actor/AI-voice variant (`disclosure` block in the render-spec). Also set the platform AI-content toggle at publish (§13).
- **Claims pre-check:** the Claude compliance node (§8) blocks before/after, health, and income claims at the script stage.
- **compliance_log table:** record, per variant, which AI elements it contains, that the label was applied, and asset/music licensing refs. This is the audit trail.
- **Licensing:** only use licensed AI-actor libraries and licensed music; never clone a real person's face/voice without documented consent. Store license refs in the log.

*(Context for the dev: TikTok mandates AI labels on synthetic faces/voices with automated, escalating enforcement; Meta's AI-disclosure requirements are expanding; the FTC treats an AI actor posing as a real customer testimonial as deceptive; NY's Synthetic Performer Law and the EU AI Act add disclosure duties. The hooks above cover these.)*

---

## 16. Build milestones

**Phase 0 — Infra (week 1):** Provision VPS. Stand up the Docker stack in Plesk (n8n, Postgres, Redis, render-worker, review-app, storage). Load secrets. Confirm API access to Claude, the video-gen router, one actor tool, ElevenLabs, Frame.io.

**Phase 1 — Core production spine (weeks 2–4):** Build Flows C→D→E→F for ONE client, manually triggered. Ship the Remotion template library (start with 2 templates), the Whisper caption pipeline, multi-ratio export, the disclosure layer, and the review app. **Goal: a script in → approved, compliant variants out → delivered to Frame.io, with a human gate.** Prove creative quality before automating anything.

**Phase 2 — Automate the factory (weeks 5–7):** Add Flow B (weekly script generation) + Flow A (onboarding). Wire the model-agnostic router with Grok (default) + Veo (hero) + Seedance (stills). Add the render queue for volume (30–50 variants/batch).

**Phase 3 — Close the loop (weeks 8–10):** Build Flow H (performance → winner profile → seed next batch) and Flow G (publishing). Systematize.

---

## 17. Open items to confirm before/at kickoff

- API access + keys for: Claude, the chosen **video-gen router** (fal.ai vs Replicate vs Vercel AI Gateway), **Grok Imagine** (X Premium / xAI API), **Veo** (Vertex AI), the chosen **actor tool** (Arcads vs Creatify — recommend starting with one), ElevenLabs, Frame.io.
- **Storage choice:** MinIO (pure self-host) vs Cloudflare R2 (convenience).
- **GPU or CPU-only** VPS to start (CPU is fine; GPU only if render/transcription throughput demands it).
- **Transcription:** self-hosted faster-whisper vs API fallback at volume.
- Confirm the **ad-research** source for Flow B (Foreplay / GetHookd / Meta Ad Library API).
- Confirm **performance data** source for Flow H (Motion vs native platform reporting APIs).

---

*This spec is the video-production system. Business model, compliance detail, and go-to-market live in the separate master build plan.*
