/**
 * ReLaunch Studio — In-Memory Sliding Window Rate Limiter
 * 
 * Protects critical endpoints (/api/studio/generate, /api/contact, /api/audit, etc.)
 * from DoS attacks, API credit exhaustion (ElevenLabs & fal.ai), and spam.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Checks whether a client identifier (e.g. IP address + route) has exceeded its quota.
 * 
 * @param identifier Unique key (e.g., `studio_generate_${clientIp}`)
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime: newRecord.resetTime,
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= limit) {
    const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: existing.resetTime,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    resetTime: existing.resetTime,
    retryAfterSeconds: 0,
  };
}

/**
 * Extracts client IP from standard reverse-proxy headers (Cloudflare, Vercel, Nginx, X-Forwarded-For)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "127.0.0.1";
}
