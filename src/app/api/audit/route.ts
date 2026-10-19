import { NextRequest, NextResponse } from "next/server";
import { scoreHtml } from "@/lib/nis";
import fs from "fs";
import path from "path";

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
    // In serverless / read-only filesystem environments (like Vercel), fail silently
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name = "", email = "", business = "", website = "" } = body;

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const url = normalizeUrl(website);
    if (!url) {
      return NextResponse.json({ error: "Enter a valid website URL." }, { status: 400 });
    }

    let html = "";
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        redirect: "follow",
        headers: {
          "User-Agent": "ReLaunchAudit/1.0 (+https://relaunch.us)",
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

    // Attempt to log lead
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

    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function GET() {
  return new Response("ok", { status: 200 });
}
