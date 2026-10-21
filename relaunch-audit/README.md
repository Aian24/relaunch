# ReLaunch Free Audit (v1.1) — Deploy on IONOS VPS

Self-hosted. No Base44. Node 18+. Transactional emails powered by **Resend**.

## What it does
1. **Audit Engine:** `public/audit.html` → visitor submits URL → `POST /api/audit` → server fetches site, runs the Narrative Intelligence Score engine (`nis.js`), returns the report, appends lead to `leads.csv`, and emails full lead + score details to Robert via the Resend API.
2. **Strategy Call Booking:** Directly on the report screen, visitors can submit their preferred date and time → `POST /api/book` → appends to `bookings.csv` and emails Robert via Resend. Robert replies directly to schedule.

NIS layers & weights: StoryBrand SB7 **35%** · Hero's Journey **30%** · Draper **25%** · Archetype **10%**.

## VPS Setup & Deploy
```bash
# 1. Ensure Node 18+ is installed
node -v

# 2. In your app directory
cd /var/www/relaunch-audit   # or your VPS path
npm install
cp .env.example .env
nano .env                    # set RESEND_API_KEY, LEAD_EMAIL, BOOKING_EMAIL, MAIL_FROM

# 3. Start / Restart under PM2
pm2 restart audit || pm2 start server.js --name audit
pm2 save
```

## Environment Variables (`.env`)
```env
PORT=3001
RESEND_API_KEY=re_your_api_key_here
LEAD_EMAIL=robert@relaunch.us
BOOKING_EMAIL=robert@relaunch.us
MAIL_FROM=ReLaunch Audit <no-reply@relaunch.us>
```

## Nginx Configuration (Serve at relaunch.us/audit)
```nginx
location /audit            { proxy_pass http://127.0.0.1:3001/audit.html; }
location = /audit/         { return 301 /audit; }
location /api/audit        { proxy_pass http://127.0.0.1:3001/api/audit; }
location /api/book         { proxy_pass http://127.0.0.1:3001/api/book; }
```

## Logs & Leads
- `leads.csv`: timestamp, name, email, business, website, score, band, weakest
- `bookings.csv`: timestamp, name, email, phone, business, website, preferredDate, preferredTime, notes
- Uptime check: `GET /healthz` returns `ok`
