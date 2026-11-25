import { NextResponse } from "next/server";

/**
 * Edge- & Node-compatible HMAC-SHA256 authentication utilities for ReLaunch Studio Admin.
 * Uses only Web Crypto APIs so `src/middleware.ts` (Edge) and `/api/studio/*` (Node)
 * share one verification implementation without database or external dependencies.
 */

export const STUDIO_SESSION_COOKIE = "relaunch_studio_session";
export const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours
export const REMEMBER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const CLIENT_SHARE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface StudioSessionPayload {
  sub: string;
  name: string;
  role: "admin";
  iat: number;
  exp: number;
}

interface ClientSharePayload {
  vid: string;
  scope: "client_review";
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(str: string): Uint8Array | null {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function getAuthSecret(): string {
  const secret = process.env.STUDIO_AUTH_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  const derived =
    process.env.FAL_KEY?.trim() ||
    process.env.ELEVENLABS_API_KEY?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    "";
  return `relaunch-studio-portal-hmac:${derived || "default-session-key-v1"}`;
}

async function importHmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

/**
 * Constant-time equality via SHA-256 digests so timing leaks don't expose credential length.
 */
async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

/**
 * Validates submitted credentials against configured STUDIO_ADMIN_EMAIL & STUDIO_ADMIN_PASSWORD.
 */
export async function verifyAdminCredentials(
  emailInput: string,
  passwordInput: string
): Promise<{ valid: true; email: string; name: string } | { valid: false; reason: string }> {
  const configuredEmail = (process.env.STUDIO_ADMIN_EMAIL || "admin@relaunch.us").trim().toLowerCase();
  const configuredPassword = process.env.STUDIO_ADMIN_PASSWORD || "robertadmin";

  const normalizedEmail = String(emailInput || "").trim().toLowerCase();
  const normalizedPassword = String(passwordInput || "");

  const [emailMatch, passwordMatch] = await Promise.all([
    constantTimeEqual(normalizedEmail, configuredEmail),
    constantTimeEqual(normalizedPassword, configuredPassword),
  ]);

  if (!emailMatch || !passwordMatch) {
    return { valid: false, reason: "Invalid email or password." };
  }

  return {
    valid: true,
    email: configuredEmail,
    name: process.env.STUDIO_ADMIN_NAME?.trim() || "Studio Portal",
  };
}

/**
 * Creates a signed HMAC session token for the Admin cookie.
 */
export async function signStudioSession(
  email: string,
  name: string,
  ttlSeconds: number = DEFAULT_SESSION_TTL_SECONDS
): Promise<string> {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("STUDIO_AUTH_SECRET is missing or too short (minimum 16 characters).");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: StudioSessionPayload = {
    sub: email,
    name,
    role: "admin",
    iat: now,
    exp: now + ttlSeconds,
  };

  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret, "sign");
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(sigBuf));
  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies an Admin session token and returns its payload if valid and unexpired.
 */
export async function verifyStudioSession(token?: string | null): Promise<StudioSessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const secret = getAuthSecret();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  const sigBytes = fromBase64Url(sigB64);
  const payloadBytes = fromBase64Url(payloadB64);
  if (!sigBytes || !payloadBytes) return null;

  try {
    const key = await importHmacKey(secret, "verify");
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, encoder.encode(payloadB64));
    if (!valid) return null;

    const payload = JSON.parse(decoder.decode(payloadBytes)) as StudioSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.sub || payload.role !== "admin" || typeof payload.exp !== "number" || payload.exp <= now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Generates an HMAC-signed token scoped strictly to a single variant for read-only Client Review links.
 */
export async function signClientShareToken(
  variantId: string,
  ttlSeconds: number = CLIENT_SHARE_TTL_SECONDS
): Promise<string> {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("STUDIO_AUTH_SECRET is missing or too short.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: ClientSharePayload = {
    vid: variantId,
    scope: "client_review",
    iat: now,
    exp: now + ttlSeconds,
  };
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret, "sign");
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(`share:${payloadB64}`));
  return `${payloadB64}.${toBase64Url(new Uint8Array(sigBuf))}`;
}

/**
 * Validates a client share token against the requested variantId.
 */
export async function verifyClientShareToken(
  variantId?: string | null,
  token?: string | null
): Promise<boolean> {
  if (!variantId || !token) return false;
  const secret = getAuthSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;

  const sigBytes = fromBase64Url(sigB64);
  const payloadBytes = fromBase64Url(payloadB64);
  if (!sigBytes || !payloadBytes) return false;

  try {
    const key = await importHmacKey(secret, "verify");
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as BufferSource,
      encoder.encode(`share:${payloadB64}`)
    );
    if (!valid) return false;

    const payload = JSON.parse(decoder.decode(payloadBytes)) as ClientSharePayload;
    const now = Math.floor(Date.now() / 1000);
    return (
      payload?.scope === "client_review" &&
      payload.vid === variantId &&
      typeof payload.exp === "number" &&
      payload.exp > now
    );
  } catch {
    return false;
  }
}

export function getCookieFromRequest(request: Request, cookieName: string = STUDIO_SESSION_COOKIE): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const name = pair.slice(0, idx).trim();
    if (name === cookieName) {
      const val = pair.slice(idx + 1).trim();
      try {
        return decodeURIComponent(val);
      } catch {
        return val;
      }
    }
  }
  return null;
}

export async function verifyStudioAdminRequest(request: Request): Promise<StudioSessionPayload | null> {
  const token = getCookieFromRequest(request, STUDIO_SESSION_COOKIE);
  return verifyStudioSession(token);
}

/**
 * Route-handler guard for `/api/studio/*`.
 * Returns `{ ok: true, session }` when authenticated, or `{ ok: false, response }` (401 JSON).
 */
export async function requireStudioAdmin(
  request: Request
): Promise<{ ok: true; session: StudioSessionPayload } | { ok: false; response: NextResponse }> {
  const session = await verifyStudioAdminRequest(request);
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Unauthorized. Studio Portal sign-in is required." },
        { status: 401 }
      ),
    };
  }
  return { ok: true, session };
}
