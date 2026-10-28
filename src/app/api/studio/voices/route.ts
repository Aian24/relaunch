import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface StudioVoice {
  id: string;
  name: string;
  category: "cloned" | "premade" | "generated" | "custom";
  description: string;
  previewUrl?: string | null;
}

// Fallback curated voices with official ElevenLabs voice IDs
const FALLBACK_VOICES: StudioVoice[] = [
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam (Direct & Commercial)",
    category: "premade",
    description: "Deep, confident, high-converting commercial tone",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel (Conversational & Warm)",
    category: "premade",
    description: "Natural, calm, friendly lifestyle narration",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi (Energetic & Hype)",
    category: "premade",
    description: "Fast-paced, vibrant, modern social media",
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella (Expressive & Soft)",
    category: "premade",
    description: "Gentle, authentic beauty & wellness",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni (Engaging & Polished)",
    category: "premade",
    description: "Clear, trustworthy, corporate and retail",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh (Relatable & Casual)",
    category: "premade",
    description: "Everyday friend, casual UGC review vibe",
  },
];

/**
 * GET /api/studio/voices
 * Fetches all live voices directly from the client's ElevenLabs account.
 * Cloned creator voices appear at the top automatically.
 */
export async function GET() {
  const elevenKey =
    process.env.ELEVENLABS_API_KEY ||
    "sk_0428106a3d5da07753d0467e2e6eb7efec4e55b3ec140ffc";

  if (!elevenKey) {
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
      // Cache for 60 seconds to avoid spamming the API on every keystroke
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Studio Voices] ElevenLabs API returned status ${res.status}. Using fallback voices.`);
      return NextResponse.json({
        success: true,
        source: "fallback",
        voices: FALLBACK_VOICES,
      });
    }

    const data = await res.json();
    const rawVoices: any[] = data.voices || [];

    if (rawVoices.length === 0) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        voices: FALLBACK_VOICES,
      });
    }

    // Map into clean StudioVoice objects
    const formattedVoices: StudioVoice[] = rawVoices.map((v) => {
      const isCloned = v.category === "cloned" || v.category === "generated";
      const descParts = [
        v.labels?.description,
        v.labels?.accent,
        v.labels?.gender,
      ].filter(Boolean);

      return {
        id: v.voice_id,
        name: v.name,
        category: isCloned ? "cloned" : "premade",
        description: descParts.length > 0 ? descParts.join(" · ") : (isCloned ? "Custom Cloned Voice" : "Premade Library Voice"),
        previewUrl: v.preview_url || null,
      };
    });

    // Sort: Cloned voices first, then alphabetical by name
    formattedVoices.sort((a, b) => {
      if (a.category === "cloned" && b.category !== "cloned") return -1;
      if (a.category !== "cloned" && b.category === "cloned") return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      source: "elevenlabs_live",
      count: formattedVoices.length,
      voices: formattedVoices,
    });
  } catch (err: any) {
    console.error("[Studio Voices] Failed to fetch ElevenLabs voices:", err.message);
    return NextResponse.json({
      success: true,
      source: "fallback",
      voices: FALLBACK_VOICES,
    });
  }
}
