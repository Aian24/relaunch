import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  DEFAULT_SESSION_TTL_SECONDS,
  REMEMBER_SESSION_TTL_SECONDS,
  STUDIO_SESSION_COOKIE,
  signStudioSession,
  verifyAdminCredentials,
} from "@/lib/studioAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  // Brute-force protection: max 5 attempts per 15 minutes per IP
  const rateCheck = checkRateLimit(`studio_auth_login_${clientIp}`, 5, 15 * 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many sign-in attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        retryAfter: rateCheck.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfterSeconds),
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "");
    const password = String(body.password || "");
    const rememberMe = Boolean(body.rememberMe);

    if (!email.trim() || !password) {
      return NextResponse.json(
        { ok: false, error: "Please enter both your admin email and password." },
        { status: 400 }
      );
    }

    const authResult = await verifyAdminCredentials(email, password);
    if (!authResult.valid) {
      return NextResponse.json({ ok: false, error: authResult.reason }, { status: 401 });
    }

    const ttl = rememberMe ? REMEMBER_SESSION_TTL_SECONDS : DEFAULT_SESSION_TTL_SECONDS;
    const token = await signStudioSession(authResult.email, authResult.name, ttl);

    const response = NextResponse.json({
      ok: true,
      user: {
        email: authResult.email,
        name: authResult.name,
        role: "admin",
      },
    });

    response.cookies.set(STUDIO_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ttl,
    });

    return response;
  } catch (err: any) {
    console.error("[Studio Auth] Login error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to sign in." },
      { status: 500 }
    );
  }
}
