# ReLaunch Studio — n8n Production Workflow Directory

This directory stores version-controlled JSON exports of all n8n workflows powering the AI Video Ad System.

### Flow Inventory:
1. `flow-a-onboarding.json` — Trigger: Intake Webhook from `/studio` -> Scrapes site -> Claude Brand Synthesis -> Writes `brand_profiles` -> Alerts Robert.
2. `flow-b-weekly-batch.json` — Trigger: Monday 6 AM Cron -> Pulls winner profiles -> Claude generates 4 angles x 4 hooks -> Compliance Pre-Check -> Writes `scripts` (`status = draft`).
3. `flow-c-asset-generation.json` — Trigger: Script approved -> Fans out parallel API calls (Arcads, ElevenLabs, Grok/Veo, Seedance) -> Stores in S3.
4. `flow-d-render.json` — Trigger: Assets ready in S3 -> Claude Edit-Spec -> Enqueues BullMQ job in Redis.
5. `flow-e-qa-gate.json` — Trigger: Variant `status = needs_review` -> Alerts operator with direct link to `review.relaunch.us`.
6. `flow-f-delivery.json` — Trigger: Human approval -> Uploads multi-ratio MP4s to client Frame.io project room.
7. `flow-f-revisions.json` — Trigger: Frame.io comment webhook -> Parses timestamped client feedback -> Re-enqueues recut into Flow D.
8. `flow-g-publishing.json` — Trigger: Client approved -> Publishes to Meta & TikTok ad accounts with AI-disclosure toggle ON.
9. `flow-h-performance-loop.json` — Trigger: Nightly cron -> Ingests ad performance metrics (CPA, ROAS, Thumbstop Rate) -> Computes Winner Profile -> Feeds next Monday's Flow B.
