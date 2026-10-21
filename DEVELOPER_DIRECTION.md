# ReLaunch — Developer Direction & Handoff

**Owner:** Robert Clark (robert@relaunch.us) · ReLaunch Marketing & Advertising, Phoenix AZ
**Date:** 2026-10-20

You're taking over development of ReLaunch's systems. This document is your map: the
goal, the stack, each system's status, and what to build next. Everything we've built so
far is in this package (see **What's in this package** at the end).

---

## 1. The overarching goal
**Get completely off Base44.** Every piece of software ReLaunch runs should be
self-hosted on the **IONOS VPS (85.215.33.152)** — built in plain HTML/CSS/JS or Node,
owned by ReLaunch end to end. No WordPress/Elementor/Divi, no Base44 backend.

## 2. Stack & conventions (apply to everything)
- **Host:** IONOS VPS. Node apps run under **PM2**, fronted by **Nginx**, TLS via **Certbot**.
- **Email:** **Resend API** (resend.com) for ALL transactional email — leads, bookings,
  notifications. No SMTP. Verify the **relaunch.us** domain in Resend (DKIM/SPF) so mail
  sends from `no-reply@relaunch.us`.
- **Booking:** **No calendar embeds anywhere.** "Book a Strategy Call" = a form that POSTs
  to the server and **emails Robert (robert@relaunch.us) via Resend**. Robert replies to set a time.
- **Front end:** the public site is already a Next.js app (live at relaunch.us). Keep new
  marketing pages consistent with it. Design language: Poppins, orange (#FF6700) + teal,
  editorial/lots of whitespace, light base with sparing dark sections.
- **Secrets:** never commit `.env`, `leads.csv`, `bookings.csv`. Keep API keys on the VPS only.

## 3. Systems — status & what's needed

### A. Public site — relaunch.us  *(LIVE, Next.js)*
Working: home, services, ai-recommendations, social, studio, custom-software, pricing,
work (+ case studies), about, audit. Loose ends to fix:
- **Products** nav is a dropdown button — confirm it opens and links correctly.
- **Pricing** "Build your own bundle" and the footer **Client Portal** link — confirm
  targets. Client Portal still points to Base44 (see E).
- Make sure every **"Book a Strategy Call"** button uses the Resend email flow (section 2),
  not a calendar.
- Keep founding year **2008** consistent (already correct).

### B. Free Audit tool  *(LIVE — update in this package, `audit-tool/`)*
Node service (the Narrative Intelligence Score engine) serving `/audit` + `/api/audit`.
Already deployed and working in production. **Deploy the v1.1 update in this package**, which:
- Switches all email to **Resend**.
- Adds a **booking form** on the report → `POST /api/book` → emails Robert.
Then: set `.env` (RESEND_API_KEY, MAIL_FROM, LEAD_EMAIL), `pm2 restart audit`, and verify a
lead row lands in `leads.csv`, a booking row in `bookings.csv`, and both emails arrive.
Full steps in `audit-tool/README.md`.

### C. Email / DNS  *(open)*
- **Resend:** verify relaunch.us (adds DNS records) — unblocks all app email above.
- **Google Workspace** inbox for care@/robert@: MX was fixed; **SPF record update** and
  **Workspace Admin user confirmation** still open. Coordinate the Resend SPF include with
  the existing SPF so they don't conflict (one merged SPF record, not two).

### D. VPS foundation  *(recommended, do once)*
Standardize so every app deploys the same way: Node + PM2 + Nginx reverse-proxy per
app/port + Certbot wildcard/host certs. The audit tool is the working template — mirror its
Nginx/PM2 pattern for each new service.

### E. ReLaunch Social portal — THE BIG ONE  *(still on Base44)*
`relaunch-social-orbit.base44.app` currently powers client sign-up/login/billing/approvals.
This is what keeps Base44 alive. To retire it, build self-hosted:
- **Auth** (client accounts, login, password reset).
- **Billing / subscriptions** — tiers Ignite $597 / Amplify $997 / Command $1,497 (see the
  live /social page). Stripe recommended.
- **Client dashboard** — monthly content approval (one-click approve), brand profile,
  connected-account status.
- **Publishing** — scheduled posting across IG/FB/LinkedIn/TikTok/Google Business
  (Metricool was the prior publishing layer; confirm with Robert whether to keep it or
  replace).
Until this is rebuilt, leave the Base44 portal running; cut over when ready.

### F. Client site migrations  *(queued, separate projects)*
Off WordPress/Base44, onto the VPS:
- **PureBenefitsWellness** (Scottsdale med spa) — full webapp: booking, client portal,
  loyalty, AI consultation quiz, before/after gallery, e-commerce, email/SMS capture.
- **McKenna Blades** (mckennablades.com) — e-commerce storefront; payments Helcim (primary)
  + Stripe (Apple/Google Pay); subscription/auto-refill is a core revenue pillar.

## 4. Suggested sequence
1. **Now (fast, unblocks revenue):** deploy audit v1.1, verify Resend domain, finish SPF /
   Workspace, fix the site loose ends (A). Lead + booking flow fully live.
2. **Next:** VPS foundation (D) so later apps are turnkey.
3. **Then (the real work):** ReLaunch Social portal (E) — this is what finally kills Base44.
4. **Ongoing:** client migrations (F).

## 5. What's in this package
- `DEVELOPER_DIRECTION.md` — this file.
- `audit-tool/` — the live audit + booking service (v1.1, Resend). Source + `README.md` deploy guide. **Current.**
- `reference-legacy-static-site/` — earlier standalone HTML pages + `submit.php` + the About
  component, from before the Next.js site. **Superseded by the live site — keep for copy/structure
  reference only, do not deploy.**

## 6. Access Robert needs to provision for you
VPS SSH, the domain registrar/DNS (IONOS), the Resend account, Google Workspace admin,
Stripe (for E/F), and the existing Base44 app (read-only, to port the portal's logic).
