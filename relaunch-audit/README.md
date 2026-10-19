# ReLaunch Free Audit — deploy on IONOS VPS

Self-hosted. No Base44. Node 18+.

## What it does
`public/audit.html` → form (name, business, email, website) → POST `/api/audit` →
server fetches the URL, runs the **Narrative Intelligence Score** (`nis.js`), returns a
report (overall score, 4 layer scores, weakest area, prioritized fixes, sales hook).
Leads append to `leads.csv` and email to care@relaunch.us (if SMTP set).

NIS layers & weights: StoryBrand SB7 **35%** · Hero's Journey **30%** · Draper **25%** · Archetype **10%**.

## One-time setup on the VPS
```bash
# 1. Node 18+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. App
cd /var/www && git clone <repo> relaunch-audit   # or scp the folder up
cd relaunch-audit
npm install
cp .env.example .env && nano .env                 # fill SMTP + LEAD_EMAIL

# 3. Keep it running
sudo npm i -g pm2
pm2 start server.js --name audit
pm2 save && pm2 startup
```

## 2 things to edit before launch
1. `public/audit.html` → `BOOKING_URL` = your Google Calendar appointment link.
2. `.env` → SMTP creds (or leave blank; leads still save to `leads.csv`).

## Nginx (serve at relaunch.us/audit)
```nginx
location /audit            { proxy_pass http://127.0.0.1:3001/audit.html; }
location = /audit/         { return 301 /audit; }
location /api/audit        { proxy_pass http://127.0.0.1:3001/api/audit; }
```
Then `sudo certbot --nginx` for SSL. Point the site's "Get my free review" button to `/audit`.

## Leads
`leads.csv` in the app folder: timestamp, name, email, business, website, score, band, weakest area.
`pm2 logs audit` for runtime logs. `GET /healthz` for uptime checks.

## Later upgrades (optional)
- Swap `leads.csv` for SQLite/Postgres.
- Add a "full audit $497" tier that calls the Claude API for a written narrative diagnosis.
- Add Meta / Google Business Profile API pulls for offline-channel scoring.
