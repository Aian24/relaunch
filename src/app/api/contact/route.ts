import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

/**
 * Emails every contact / strategy-call request to ReLaunch.
 *
 * Uses Resend (https://resend.com) over its HTTP API, so no extra package is needed.
 * Environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      required. API key from resend.com.
 *   CONTACT_TO_EMAIL    optional. Defaults to robert@relaunch.us.
 *   CONTACT_FROM_EMAIL  optional. Defaults to "ReLaunch Website <website@relaunch.us>".
 *                       The domain (relaunch.us) must be verified in Resend.
 */

// Dynamic evaluation inside POST handler ensures runtime environment variables are read fresh
const DEFAULT_TO = "robert@relaunch.us";
const DEFAULT_FROM = "ReLaunch Website <website@relaunch.us>";

const MAX = 2000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  // Rate limit: 5 submissions per 5 minutes per IP
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`contact_${clientIp}`, 5, 5 * 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many messages sent. Please wait a few minutes before submitting again." },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, send nothing.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    type: clean(body.type) === "strategy-call" ? "Strategy call request" : "Website message",
    name: clean(body.name),
    email: clean(body.email),
    phone: clean(body.phone),
    business: clean(body.business),
    interest: clean(body.interest),
    preferredDate: clean(body.preferredDate),
    preferredTime: clean(body.preferredTime),
    message: clean(body.message),
    page: clean(body.page),
  };

  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!data.name || (!hasValidEmail && !data.phone)) {
    return NextResponse.json(
      { error: "Name and either a valid email or phone number are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("Contact form [DEV / LOCALHOST]: RESEND_API_KEY not configured. Lead logged successfully:", data);
    return NextResponse.json({
      ok: true,
      devMode: true,
      message: "Lead received and logged (RESEND_API_KEY not configured locally)",
    });
  }

  const rows: [string, string][] = [
    ["Request", data.type],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "Not given"],
    ["Business", data.business || "Not given"],
    ["Interested in", data.interest || "Not given"],
    ...(data.type === "Strategy call request"
      ? ([
          ["Preferred date", data.preferredDate || "Not chosen"],
          ["Preferred time", data.preferredTime ? `${data.preferredTime} (Arizona)` : "Not chosen"],
        ] as [string, string][])
      : []),
    ["Message", data.message || "None"],
    ["Sent from page", data.page || "Unknown"],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
      <h2 style="margin:0 0 12px">${escapeHtml(data.type)} from relaunch.us</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`
          )
          .join("")}
      </table>
      <p style="color:#666;margin-top:16px">Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const TO = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const FROM = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      ...(hasValidEmail ? { reply_to: data.email } : {}),
      subject: `${data.type}: ${data.name}${data.business ? ` (${data.business})` : ""}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Contact form: Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
