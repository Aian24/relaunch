import { NextRequest, NextResponse } from "next/server";
import { scoreHtml } from "@/lib/nis";
import fs from "fs";
import path from "path";
import dns from "dns";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function isPrivateIp(ip: string): boolean {
  if (ip === "::1" || ip === "localhost") return true;
  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    if (parts[0] === 127) return true; // 127.0.0.0/8 Loopback
    if (parts[0] === 10) return true;  // 10.0.0.0/8 Private
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12 Private
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16 Private
    if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16 Cloud Metadata / Link-local
    if (parts[0] === 0) return true;   // 0.0.0.0/8
  }
  return false;
}

function normalizeUrl(u: string): string | null {
  u = (u || "").trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const url = new URL(u);
    if (!/^https?:$/.test(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function validatePublicUrl(u: string): Promise<string | null> {
  const normalized = normalizeUrl(u);
  if (!normalized) return null;
  try {
    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      isPrivateIp(hostname)
    ) {
      return null;
    }

    // Resolve DNS to verify resolved IP is strictly public
    const lookup = await dns.promises.lookup(hostname);
    if (isPrivateIp(lookup.address)) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

function escapeHtml(val: unknown): string {
  return String(val || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function saveLead(row: (string | number)[]) {
  try {
    const leadsPath = path.join(process.cwd(), "relaunch-audit", "leads.csv");
    const header = "timestamp,name,email,business,website,score,band,weakest\n";
    if (!fs.existsSync(leadsPath)) {
      const dir = path.dirname(leadsPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(leadsPath, header);
    }
    const esc = (s: string | number) => '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"';
    fs.appendFileSync(leadsPath, row.map(esc).join(",") + "\n");
  } catch {
    // In serverless / read-only filesystem environments, fail silently
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit check: max 5 audits per 10 minutes per IP
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`audit_${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many audit requests. Please wait a few minutes before auditing another site." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name = "", email = "", business = "", website = "" } = body;

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const url = await validatePublicUrl(website);
    if (!url) {
      return NextResponse.json(
        { error: "Enter a valid public website URL. Internal, private, or local network addresses cannot be audited." },
        { status: 400 }
      );
    }

    let html = "";
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "ReLaunchAudit/1.1 (+https://relaunch.us)",
        },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      html = (await res.text()).slice(0, 600000);
    } catch {
      return NextResponse.json(
        { error: "Couldn't load that site. Check the URL is public and try again." },
        { status: 422 }
      );
    }

    let report;
    try {
      report = scoreHtml(html);
    } catch {
      return NextResponse.json({ error: "Scoring failed. Please try again." }, { status: 500 });
    }

    // 1. Attempt to log lead locally
    await saveLead([
      new Date().toISOString(),
      name,
      email,
      business,
      url,
      report.overall,
      report.band,
      report.weakest.area,
    ]);

    // 2. Dispatch Resend notification email to Robert
    const apiKey = process.env.RESEND_API_KEY;
    const TO = process.env.CONTACT_TO_EMAIL || "robert@relaunch.us";
    const FROM = process.env.CONTACT_FROM_EMAIL || "ReLaunch Website <website@relaunch.us>";

    if (apiKey) {
      const subject = `New Audit Lead — ${business || name || "Website"} (${report.overall}/100 · ${report.band})`;
      const text = `New Audit Lead Received\n`
        + `-----------------------\n`
        + `Name: ${name || "Not given"}\n`
        + `Email: ${email}\n`
        + `Business: ${business || "Not given"}\n`
        + `Website: ${url}\n\n`
        + `Score: ${report.overall}/100 (${report.band})\n`
        + `Band Note: ${report.bandNote}\n`
        + `Weakest: ${report.weakest.area} (${report.weakest.score}/100)\n`
        + `Fix: ${report.weakest.fix}\n\n`
        + `Layers:\n`
        + `• StoryBrand: ${report.layers.storybrand}/100\n`
        + `• Hero's Journey: ${report.layers.herosJourney}/100\n`
        + `• Draper: ${report.layers.draper}/100\n`
        + `• Archetype: ${report.layers.archetype}/100\n\n`
        + `Sales Hook: ${report.salesHook}\n`;

      const htmlBody = `
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:600px;line-height:1.6">
          <h2 style="color:#FF6700;margin-bottom:6px">New Audit Lead Received</h2>
          <p style="margin-top:0;color:#666">Captured on relaunch.us/audit</p>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:16px">
            <tr style="background:#f8f9fa"><td style="font-weight:bold;width:120px">Name:</td><td>${escapeHtml(name || "Not given")}</td></tr>
            <tr><td style="font-weight:bold">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr style="background:#f8f9fa"><td style="font-weight:bold">Business:</td><td>${escapeHtml(business || "Not given")}</td></tr>
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

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [TO],
          reply_to: email,
          subject,
          text,
          html: htmlBody,
        }),
      }).catch((e) => console.error("Resend audit lead dispatch failed:", e));
    }

    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function GET() {
  return new Response("ok", { status: 200 });
}
