import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export interface StudioVoice {
  id: string;
  name: string;
  category: "cloned" | "premade" | "generated" | "custom";
  description: string;
  previewUrl?: string | null;
  tierRequired?: "free" | "paid";
  hasBalance?: boolean;
  gender?: "male" | "female" | "neutral";
}

// Fallback curated voices with official ElevenLabs voice IDs and tier classifications
const FALLBACK_VOICES: StudioVoice[] = [
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam (Direct & Commercial)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Deep, confident, high-converting commercial tone · Ready (Free & Active Balance)",
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella (Expressive & Soft)",
    category: "premade",
    gender: "female",
    tierRequired: "free",
    hasBalance: true,
    description: "Gentle, authentic beauty & wellness narration · Ready (Free & Active Balance)",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni (Engaging & Polished)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Clear, trustworthy corporate and retail narration · Ready (Free & Active Balance)",
  },
  {
    id: "pFZP5JQG7iQjIQuC4Bku",
    name: "Lily (Warm & Natural)",
    category: "premade",
    gender: "female",
    tierRequired: "free",
    hasBalance: true,
    description: "Authentic, relatable lifestyle UGC narration · Ready (Free & Active Balance)",
  },
  {
    id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold (Deep & Authoritative)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Powerful, epic cinematic commercial tone · Ready (Free & Active Balance)",
  },
  {
    id: "IKne3meq5aSn9XLyUdCD",
    name: "Charlie (Casual & Friendly)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Friendly everyday Australian conversational tone · Ready (Free & Active Balance)",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel (Conversational & Warm)",
    category: "premade",
    gender: "female",
    tierRequired: "paid",
    hasBalance: false,
    description: "Natural, calm lifestyle narration · Requires Paid Subscription / Balance",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi (Energetic & Hype)",
    category: "premade",
    gender: "female",
    tierRequired: "paid",
    hasBalance: false,
    description: "Fast-paced, vibrant modern social media · Requires Paid Subscription / Balance",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh (Relatable & Casual)",
    category: "premade",
    gender: "male",
    tierRequired: "paid",
    hasBalance: false,
    description: "Everyday friend, casual UGC review vibe · Requires Paid Subscription / Balance",
  },
];

// Server-side in-memory cache to prevent draining ElevenLabs API quota
let voiceCache: {
  voices: StudioVoice[];
  source: string;
  timestamp: number;
} | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/studio/voices
 * Protected by sliding window rate limiter + 5-minute in-memory server cache.
 * Cloned creator voices appear at the top automatically.
 */
export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_voices_${clientIp}`, 25, 60 * 1000);

  if (!rateCheck.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many voice requests. Please try again shortly.",
        source: "rate_limited",
        voices: FALLBACK_VOICES,
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

  // Return from in-memory cache if fresh
  const now = Date.now();
  if (voiceCache && now - voiceCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      source: voiceCache.source,
      cached: true,
      count: voiceCache.voices.length,
      voices: voiceCache.voices,
    });
  }

  const elevenKey =
    process.env.ELEVENLABS_API_KEY ||
    "sk_0428106a3d5da07753d0467e2e6eb7efec4e55b3ec140ffc";

  if (!elevenKey) {
    voiceCache = { voices: FALLBACK_VOICES, source: "fallback_no_key", timestamp: now };
    return NextResponse.json({
      success: true,
      source: "fallback",
      voices: FALLBACK_VOICES,
    });
  }

  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": elevenKey,
      },
    });

    if (!res.ok) {
      console.warn(`[Studio Voices] ElevenLabs API returned status ${res.status}. Using fallback voices (cached 5m).`);
      voiceCache = { voices: FALLBACK_VOICES, source: "fallback_api_status", timestamp: now };
      return NextResponse.json({
        success: true,
        source: "fallback",
        voices: FALLBACK_VOICES,
      });
    }

    const data = await res.json();
    const rawVoices: any[] = data.voices || [];

    if (rawVoices.length === 0) {
      voiceCache = { voices: FALLBACK_VOICES, source: "fallback_empty", timestamp: now };
      return NextResponse.json({
        success: true,
        source: "fallback",
        voices: FALLBACK_VOICES,
      });
    }

    const FREE_VOICE_IDS = new Set([
      "pNInz6obpgDQGcFmaJgB", // Adam
      "EXAVITQu4vr4xnSDxMaL", // Bella
      "ErXwobaYiN019PkySvjV", // Antoni
      "pFZP5JQG7iQjIQuC4Bku", // Lily
      "VR6AewLTigWG4xSOukaG", // Arnold
      "IKne3meq5aSn9XLyUdCD", // Charlie
      "N2lVS1w4EtoT3dr4eOWO", // Callum
      "SOYHLrjzK2X1ezoPC6cr", // Harry
    ]);

    // Map into clean StudioVoice objects
    const formattedVoices: StudioVoice[] = rawVoices.map((v) => {
      const isCloned = v.category === "cloned" || v.category === "generated";
      const isFree = isCloned || FREE_VOICE_IDS.has(v.voice_id);
      const descParts = [
        v.labels?.description,
        v.labels?.accent,
        v.labels?.gender,
      ].filter(Boolean);

      return {
        id: v.voice_id,
        name: v.name,
        category: isCloned ? "cloned" : "premade",
        gender: v.labels?.gender?.toLowerCase().includes("female") ? "female" : "male",
        tierRequired: isFree ? "free" : "paid",
        hasBalance: isFree,
        description: descParts.length > 0 
          ? `${descParts.join(" · ")} · ${isFree ? "Active Balance" : "Requires Paid Plan"}`
          : (isCloned ? "Custom Cloned Voice · Active Balance" : (isFree ? "Standard Library · Active Balance" : "Premade Library Voice · Requires Paid Plan")),
        previewUrl: v.preview_url || null,
      };
    });

    // Sort: Cloned voices first, then alphabetical by name
    formattedVoices.sort((a, b) => {
      if (a.category === "cloned" && b.category !== "cloned") return -1;
      if (a.category !== "cloned" && b.category === "cloned") return 1;
      return a.name.localeCompare(b.name);
    });

    voiceCache = { voices: formattedVoices, source: "elevenlabs_live", timestamp: now };

    return NextResponse.json({
      success: true,
      source: "elevenlabs_live",
      count: formattedVoices.length,
      voices: formattedVoices,
    });
  } catch (err: any) {
    console.error("[Studio Voices] Failed to fetch ElevenLabs voices:", err.message);
    voiceCache = { voices: FALLBACK_VOICES, source: "fallback_network_err", timestamp: now };
    return NextResponse.json({
      success: true,
      source: "fallback",
      voices: FALLBACK_VOICES,
    });
  }
}
