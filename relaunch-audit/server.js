// server.js — ReLaunch free NIS audit. Node 18+ (global fetch). Self-hosted on IONOS VPS.
const express = require('express');
const fs = require('fs');
const path = require('path');
const { scoreHtml } = require('./nis');

// Load .env if present (zero-dependency fallback)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.trim().match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  });
}

const app = express();
const PORT = process.env.PORT || 3001;
const LEADS = path.join(__dirname, 'leads.csv');
const TO = process.env.LEAD_EMAIL || 'care@relaunch.us';

app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// simple in-memory rate limit (per IP)
const hits = new Map();
function limited(ip) {
  const now = Date.now(), w = hits.get(ip) || [];
  const recent = w.filter(t => now - t < 60000);
  recent.push(now); hits.set(ip, recent);
  return recent.length > 8; // 8 audits / min / IP
}

function normalizeUrl(u) {
  u = (u || '').trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try { const url = new URL(u); if (!/^https?:$/.test(url.protocol)) return null; return url.toString(); }
  catch { return null; }
}

async function saveLead(row) {
  const header = 'timestamp,name,email,business,website,score,band,weakest\n';
  if (!fs.existsSync(LEADS)) fs.writeFileSync(LEADS, header);
  const esc = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  fs.appendFileSync(LEADS, row.map(esc).join(',') + '\n');
}

// Optional email via nodemailer if SMTP_* env vars are set (never blocks the response)
async function emailLead(lead, report) {
  if (!process.env.SMTP_HOST) return;
  try {
    const nodemailer = require('nodemailer');
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: +(process.env.SMTP_PORT || 587),
      secure: +(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await t.sendMail({
      from: process.env.SMTP_FROM || 'ReLaunch Audit <no-reply@relaunch.us>',
      to: TO, replyTo: lead.email,
      subject: `New Audit Lead — ${lead.business || lead.name} (${report.overall}/100 · ${report.band})`,
      text: `Name: ${lead.name}\nEmail: ${lead.email}\nBusiness: ${lead.business}\nWebsite: ${lead.website}\n\n`
          + `Score: ${report.overall}/100 (${report.band})\nWeakest: ${report.weakest.area} (${report.weakest.score})\n`
          + `Layers: SB7 ${report.layers.storybrand} · Hero ${report.layers.herosJourney} · Draper ${report.layers.draper} · Archetype ${report.layers.archetype}\n`
    });
  } catch (e) { console.error('email failed:', e.message); }
}

app.post('/api/audit', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'na';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const { name = '', email = '', business = '', website = '' } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'A valid email is required.' });
  const url = normalizeUrl(website);
  if (!url) return res.status(400).json({ error: 'Enter a valid website URL.' });

  let html;
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': 'ReLaunchAudit/1.0 (+https://relaunch.us)' } });
    clearTimeout(to);
    if (!r.ok) throw new Error('status ' + r.status);
    html = (await r.text()).slice(0, 600000);
  } catch (e) {
    return res.status(422).json({ error: "Couldn't load that site. Check the URL is public and try again." });
  }

  let report;
  try { report = scoreHtml(html); }
  catch (e) { return res.status(500).json({ error: 'Scoring failed. Please try again.' }); }

  const lead = { name, email, business, website: url };
  try { await saveLead([new Date().toISOString(), name, email, business, url, report.overall, report.band, report.weakest.area]); } catch {}
  emailLead(lead, report); // fire-and-forget

  res.json(report);
});

app.get('/healthz', (_, res) => res.send('ok'));
app.listen(PORT, () => console.log('ReLaunch audit on :' + PORT));
