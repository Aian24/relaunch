import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function escapeHtml(val: unknown): string {
  return String(val || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function saveBooking(row: string[]) {
  try {
    const bookingsPath = path.join(process.cwd(), "relaunch-audit", "bookings.csv");
    const header = "timestamp,name,email,phone,business,website,preferredDate,preferredTime,notes\n";
    if (!fs.existsSync(bookingsPath)) {
      const dir = path.dirname(bookingsPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(bookingsPath, header);
    }
    const esc = (s: string) => '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"';
    fs.appendFileSync(bookingsPath, row.map(esc).join(",") + "\n");
  } catch {
    // Fail silently in serverless environments
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name = "",
      email = "",
      phone = "",
      business = "",
      website = "",
      preferredDate = "",
      preferredTime = "",
      notes = "",
    } = body;

    if (!name.trim()) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
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
      notes.trim(),
    ];

    await saveBooking(bookingRow);

    const apiKey = process.env.RESEND_API_KEY;
    const TO = process.env.CONTACT_TO_EMAIL || "robert@relaunch.us";
    const FROM = process.env.CONTACT_FROM_EMAIL || "ReLaunch Website <website@relaunch.us>";

    if (apiKey) {
      const subject = `Strategy Call Request — ${name}${business ? ` (${business})` : ""}`;
      const text = `New Strategy Call Request\n`
        + `--------------------------\n`
        + `Name: ${name}\n`
        + `Email: ${email}\n`
        + `Phone: ${phone || "Not given"}\n`
        + `Business: ${business || "Not given"}\n`
        + `Website: ${website || "Not given"}\n`
        + `Preferred Date: ${preferredDate || "Not selected"}\n`
        + `Preferred Time: ${preferredTime || "Not selected"}\n`
        + `Notes / Context: ${notes || "None"}\n`;

      const html = `
        <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:600px;line-height:1.6">
          <h2 style="color:#7F48ED;margin-bottom:6px">New Strategy Call Request</h2>
          <p style="margin-top:0;color:#666">Submitted via ReLaunch Audit booking flow</p>
          <table cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:16px">
            <tr style="background:#f8f9fa"><td style="font-weight:bold;width:130px">Name:</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="font-weight:bold">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr style="background:#f8f9fa"><td style="font-weight:bold">Phone:</td><td>${escapeHtml(phone || "Not given")}</td></tr>
            <tr><td style="font-weight:bold">Business:</td><td>${escapeHtml(business || "Not given")}</td></tr>
            <tr style="background:#f8f9fa"><td style="font-weight:bold">Website:</td><td>${escapeHtml(website || "Not given")}</td></tr>
            <tr><td style="font-weight:bold">Preferred Date:</td><td><strong>${escapeHtml(preferredDate || "Not selected")}</strong></td></tr>
            <tr style="background:#f8f9fa"><td style="font-weight:bold">Preferred Time:</td><td><strong>${escapeHtml(preferredTime || "Not selected")} (Arizona MST)</strong></td></tr>
            <tr><td style="font-weight:bold">Notes / Score:</td><td>${escapeHtml(notes || "None")}</td></tr>
          </table>
          <p style="color:#666;font-size:12px">Reply directly to this email to confirm the session with ${escapeHtml(name)}.</p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
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
          html,
        }),
      }).catch((e) => console.error("Resend booking dispatch failed:", e));
    }

    return NextResponse.json({
      ok: true,
      message: "Strategy call request received! Robert will email you within one business day to confirm the time.",
    });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
