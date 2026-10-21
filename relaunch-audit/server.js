// server.js — ReLaunch free NIS audit v1.1. Node 18+ (native fetch). Self-hosted on IONOS VPS.
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
const BOOKINGS = path.join(__dirname, 'bookings.csv');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const LEAD_EMAIL = process.env.LEAD_EMAIL || 'robert@relaunch.us';
const BOOKING_EMAIL = process.env.BOOKING_EMAIL || 'robert@relaunch.us';
const MAIL_FROM = process.env.MAIL_FROM || 'ReLaunch Audit <no-reply@relaunch.us>';

app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory rate limit (per IP)
const hits = new Map();
function limited(ip) {
  const now = Date.now(), w = hits.get(ip) || [];
  const recent = w.filter(t => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12; // 12 requests / min / IP
}

function normalizeUrl(u) {
  u = (u || '').trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try {
    const url = new URL(u);
    if (!/^https?:$/.test(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function escapeHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function saveLead(row) {
  const header = 'timestamp,name,email,business,website,score,band,weakest\n';
  if (!fs.existsSync(LEADS)) fs.writeFileSync(LEADS, header);
  const esc = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  fs.appendFileSync(LEADS, row.map(esc).join(',') + '\n');
}

async function saveBooking(row) {
  const header = 'timestamp,name,email,phone,business,website,preferredDate,preferredTime,notes\n';
  if (!fs.existsSync(BOOKINGS)) fs.writeFileSync(BOOKINGS, header);
  const esc = s => '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"';
  fs.appendFileSync(BOOKINGS, row.map(esc).join(',') + '\n');
}

// Resend HTTP API integration (Zero external email dependencies)
async function sendResendEmail({ to, replyTo, subject, text, html }) {
  const key = process.env.RESEND_API_KEY || RESEND_API_KEY;
  if (!key) {
    console.warn('Resend email skipped: RESEND_API_KEY is not configured');
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        reply_to: replyTo,
        subject,
        text,
        html
      })
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('Resend API error:', res.status, err);
    }
  } catch (e) {
    console.error('Resend dispatch failed:', e.message);
  }
}

// 1. Audit Endpoint: Scrapes site, runs NIS engine, logs lead, emails Robert via Resend
app.post('/api/audit', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'na';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const { name = '', email = '', business = '', website = '' } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  const url = normalizeUrl(website);
  if (!url) {
    return res.status(400).json({ error: 'Enter a valid website URL.' });
  }

  let html;
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'ReLaunchAudit/1.1 (+https://relaunch.us)' }
    });
    clearTimeout(to);
    if (!r.ok) throw new Error('status ' + r.status);
    html = (await r.text()).slice(0, 600000);
  } catch (e) {
    return res.status(422).json({ error: "Couldn't load that site. Check the URL is public and try again." });
  }

  let report;
  try {
    report = scoreHtml(html);
  } catch (e) {
    return res.status(500).json({ error: 'Scoring failed. Please try again.' });
  }

  const lead = { name, email, business, website: url };
  try {
    await saveLead([
      new Date().toISOString(),
      name,
      email,
      business,
      url,
      report.overall,
      report.band,
      report.weakest.area
    ]);
  } catch (e) {
    console.error('Failed to append to leads.csv:', e.message);
  }

  // Send lead alert to Robert via Resend
  const subject = `New Audit Lead — ${business || name || 'Website'} (${report.overall}/100 · ${report.band})`;
  const text = `New Audit Lead Received\n`
    + `-----------------------\n`
    + `Name: ${name || 'Not given'}\n`
    + `Email: ${email}\n`
    + `Business: ${business || 'Not given'}\n`
    + `Website: ${url}\n\n`
    + `Score: ${report.overall}/100 (${report.band})\n`
    + `Band Note: ${report.bandNote}\n`
    + `Weakest Area: ${report.weakest.area} (${report.weakest.score}/100)\n`
    + `Fix: ${report.weakest.fix}\n\n`
    + `Layers:\n`
    + `• StoryBrand Clarity: ${report.layers.storybrand}/100\n`
    + `• Transformation Story: ${report.layers.herosJourney}/100\n`
    + `• Emotional Pull: ${report.layers.draper}/100\n`
    + `• Brand Voice: ${report.layers.archetype}/100\n\n`
    + `Sales Hook: ${report.salesHook}\n`;

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:600px;line-height:1.6">
      <h2 style="color:#FF6700;margin-bottom:6px">New Audit Lead Received</h2>
      <p style="margin-top:0;color:#666">Generated by the ReLaunch Narrative Intelligence Score Engine</p>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <tr style="background:#f8f9fa"><td style="font-weight:bold;width:120px">Name:</td><td>${escapeHtml(name || 'Not given')}</td></tr>
        <tr><td style="font-weight:bold">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr style="background:#f8f9fa"><td style="font-weight:bold">Business:</td><td>${escapeHtml(business || 'Not given')}</td></tr>
        <tr><td style="font-weight:bold">Website:</td><td><a href="${escapeHtml(url)}" target="_blank">${escapeHtml(url)}</a></td></tr>
      </table>

      <div style="padding:16px;background:#090D16;color:#fff;border-radius:12px;margin-bottom:16px">
        <div style="font-size:12px;text-transform:uppercase;color:#FF6700;font-weight:bold;letter-spacing:1px">Score Summary</div>
        <div style="font-size:32px;font-weight:900;margin:6px 0">${report.overall} <span style="font-size:16px;font-weight:normal;color:#94a3b8">/ 100 (${escapeHtml(report.band)})</span></div>
        <p style="margin:0;font-size:13px;color:#cbd5e1">${escapeHtml(report.bandNote)}</p>
      </div>

      <h3 style="margin-bottom:8px">Dimension Breakdown</h3>
      <ul>
        <li><strong>StoryBrand Clarity:</strong> ${report.layers.storybrand}/100</li>
        <li><strong>Transformation Story:</strong> ${report.layers.herosJourney}/100</li>
        <li><strong>Emotional Pull:</strong> ${report.layers.draper}/100</li>
        <li><strong>Brand Voice:</strong> ${report.layers.archetype}/100</li>
      </ul>

      <p style="background:#fff3ed;border-left:4px solid #FF6700;padding:12px;margin:16px 0">
        <strong>Weakest Area:</strong> ${escapeHtml(report.weakest.area)} (${report.weakest.score}/100)<br>
        <span>${escapeHtml(report.weakest.fix)}</span>
      </p>

      <p style="color:#666;font-size:12px">Reply directly to this email to contact ${escapeHtml(name || email)}.</p>
    </div>
  `;

  // Fire-and-forget email dispatch
  sendResendEmail({
    to: LEAD_EMAIL,
    replyTo: email,
    subject,
    text,
    html: htmlBody
  });

  res.json(report);
});

// 2. Booking Endpoint: Captures strategy call request, saves to bookings.csv, emails Robert via Resend
app.post('/api/book', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'na';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const {
    name = '',
    email = '',
    phone = '',
    business = '',
    website = '',
    preferredDate = '',
    preferredTime = '',
    notes = ''
  } = req.body || {};

  if (!name.trim()) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const bookingRow = [
    new Date().toISOString(),
    name.trim(),
    email.trim(),
    phone.trim(),
    business.trim(),
    website.trim(),
    preferredDate.trim(),
    preferredTime.trim(),
    notes.trim()
  ];

  try {
    await saveBooking(bookingRow);
  } catch (e) {
    console.error('Failed to append to bookings.csv:', e.message);
  }

  const subject = `Strategy Call Request — ${name}${business ? ` (${business})` : ''}`;
  const text = `New Strategy Call Request\n`
    + `--------------------------\n`
    + `Name: ${name}\n`
    + `Email: ${email}\n`
    + `Phone: ${phone || 'Not given'}\n`
    + `Business: ${business || 'Not given'}\n`
    + `Website: ${website || 'Not given'}\n`
    + `Preferred Date: ${preferredDate || 'Not selected'}\n`
    + `Preferred Time: ${preferredTime || 'Not selected'}\n`
    + `Notes / Context: ${notes || 'None'}\n`;

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:600px;line-height:1.6">
      <h2 style="color:#7F48ED;margin-bottom:6px">New Strategy Call Request</h2>
      <p style="margin-top:0;color:#666">Submitted via ReLaunch Audit booking form</p>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:16px">
        <tr style="background:#f8f9fa"><td style="font-weight:bold;width:130px">Name:</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="font-weight:bold">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr style="background:#f8f9fa"><td style="font-weight:bold">Phone:</td><td>${escapeHtml(phone || 'Not given')}</td></tr>
        <tr><td style="font-weight:bold">Business:</td><td>${escapeHtml(business || 'Not given')}</td></tr>
        <tr style="background:#f8f9fa"><td style="font-weight:bold">Website:</td><td>${website ? `<a href="${escapeHtml(normalizeUrl(website) || website)}" target="_blank">${escapeHtml(website)}</a>` : 'Not given'}</td></tr>
        <tr><td style="font-weight:bold">Preferred Date:</td><td><strong>${escapeHtml(preferredDate || 'Not selected')}</strong></td></tr>
        <tr style="background:#f8f9fa"><td style="font-weight:bold">Preferred Time:</td><td><strong>${escapeHtml(preferredTime || 'Not selected')} (Arizona MST)</strong></td></tr>
        <tr><td style="font-weight:bold">Notes / Score:</td><td>${escapeHtml(notes || 'None')}</td></tr>
      </table>
      <p style="color:#666;font-size:12px">Reply directly to this email to confirm the session with ${escapeHtml(name)}.</p>
    </div>
  `;

  // Send booking alert to Robert via Resend
  await sendResendEmail({
    to: BOOKING_EMAIL,
    replyTo: email,
    subject,
    text,
    html
  });

  res.json({
    ok: true,
    message: 'Strategy call request received! Robert will email you within one business day to confirm the time.'
  });
});

app.get('/healthz', (_, res) => res.send('ok'));

app.listen(PORT, () => {
  console.log(`ReLaunch audit v1.1 listening on :${PORT}`);
});
