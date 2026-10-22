import { NextResponse } from "next/server";

/**
 * ReLaunch Studio — AI Video Ad Intake API Route
 * Endpoint: POST /api/studio/intake
 *
 * Handles:
 * 1. Sanitization & Honeypot validation
 * 2. Form submission from /studio ("Request Weekly Drop" / Pricing Tiers)
 * 3. Email notification via Resend HTTP API to robert@relaunch.us
 * 4. Webhook dispatch to n8n Flow A (Client Onboarding & Brand Synthesis)
 */

const DEFAULT_TO = "robert@relaunch.us";
const DEFAULT_FROM = "ReLaunch Studio <studio@relaunch.us>";
const MAX_LENGTH = 3000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_LENGTH) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Honeypot bot protection: bots automatically populate hidden inputs
  if (clean(body.hp_website) || clean(body.honeypot)) {
    return NextResponse.json({ ok: true, message: "Request received" });
  }

  const intakeData = {
    brandName: clean(body.brandName) || clean(body.business),
    websiteUrl: clean(body.websiteUrl) || clean(body.website),
    contactName: clean(body.contactName) || clean(body.name),
    email: clean(body.email),
    phone: clean(body.phone),
    planTier: clean(body.planTier) || clean(body.tier) || "Starter Drop ($2,500/mo)",
    primaryGoal: clean(body.primaryGoal) || clean(body.goal) || "Lower CAC / Scale Paid Social",
    targetPlatforms: clean(body.targetPlatforms) || "Meta Reels & TikTok",
    notes: clean(body.notes) || clean(body.message),
    submittedAt: new Date().toISOString(),
  };

  // Validation
  if (!intakeData.contactName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intakeData.email)) {
    return NextResponse.json(
      { error: "Contact name and a valid email address are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;

  // Format table rows for notification email
  const rows: [string, string][] = [
    ["Brand Name", intakeData.brandName || "Not provided"],
    ["Website URL", intakeData.websiteUrl || "Not provided"],
    ["Contact Person", intakeData.contactName],
    ["Email Address", intakeData.email],
    ["Phone Number", intakeData.phone || "Not provided"],
    ["Selected Tier", intakeData.planTier],
    ["Primary Goal", intakeData.primaryGoal],
    ["Target Platforms", intakeData.targetPlatforms],
    ["Brand Notes / Brief", intakeData.notes || "None provided"],
    ["Timestamp", intakeData.submittedAt],
  ];

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #7F48ED, #00F0FF); padding: 20px; color: #fff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">🎬 New ReLaunch Studio Intake</h2>
        <p style="margin: 4px 0 0; opacity: 0.9; font-size: 13px;">AI Video Ad Production Request</p>
      </div>
      <div style="padding: 20px;">
        <table cellpadding="8" style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${rows
            .map(
              ([k, v]) => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="font-weight: 600; color: #4b5563; width: 35%; vertical-align: top;">${escapeHtml(k)}</td>
                <td style="color: #111827; vertical-align: top;">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
              </tr>`
            )
            .join("")}
        </table>
        <div style="margin-top: 24px; padding: 12px; background: #f9fafb; border-radius: 6px; font-size: 12px; color: #6b7280;">
          💡 Reply directly to this email to contact <strong>${escapeHtml(intakeData.contactName)}</strong>.
        </div>
      </div>
    </div>
  `;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  // 1. Send Email Notification via Resend
  let emailSent = false;
  if (apiKey) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: intakeData.email,
          subject: `🎬 Studio Intake: ${intakeData.brandName || intakeData.contactName} (${intakeData.planTier})`,
          html,
          text,
        }),
      });
      emailSent = emailRes.ok;
      if (!emailRes.ok) {
        console.error("Studio intake: Resend error", emailRes.status, await emailRes.text().catch(() => ""));
      }
    } catch (err) {
      console.error("Studio intake: Failed to send Resend email", err);
    }
  }

  // 2. Dispatch Webhook to n8n Flow A (Client Onboarding & Brand Synthesis)
  const n8nWebhookUrl = process.env.N8N_STUDIO_INTAKE_WEBHOOK || "https://ops.relaunch.us/webhook/studio-intake";
  try {
    // Non-blocking fire-and-forget webhook to avoid delaying user response
    fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intakeData),
    }).catch(() => {
      // n8n might not be running in local dev yet; suppress error
    });
  } catch {
    // Ignore webhook connection errors during dev
  }

  return NextResponse.json({
    ok: true,
    message: "Studio brief successfully received. We will review your brand and prepare your creative angles.",
    emailNotified: emailSent,
  });
}
