import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  LICENSED_MUSIC_LIBRARY,
  BRANDED_CTA_TEMPLATES,
  CAPTION_STYLES,
  MusicTrack,
  CtaTemplate,
} from "@/data/timelineAssets";

interface CustomAssetsStorage {
  musicTracks: MusicTrack[];
  ctaTemplates: CtaTemplate[];
}

const STORAGE_FILE = path.join(process.cwd(), "src", "data", "customTimelineAssets.json");
const AUDIO_UPLOAD_DIR = path.join(process.cwd(), "public", "audio", "music");

function getStoredCustomAssets(): CustomAssetsStorage {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read customTimelineAssets.json:", err);
  }
  return { musicTracks: [], ctaTemplates: [] };
}

function saveCustomAssets(data: CustomAssetsStorage): void {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write customTimelineAssets.json:", err);
  }
}

export async function GET() {
  const custom = getStoredCustomAssets();

  const combinedMusic = [...custom.musicTracks, ...LICENSED_MUSIC_LIBRARY];
  const combinedCtas = [...custom.ctaTemplates, ...BRANDED_CTA_TEMPLATES];

  return NextResponse.json({
    success: true,
    musicTracks: combinedMusic,
    ctaTemplates: combinedCtas,
    captionStyles: CAPTION_STYLES,
    customCount: {
      musicTracks: custom.musicTracks.length,
      ctaTemplates: custom.ctaTemplates.length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (Audio File Upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const type = formData.get("type") as string; // "music" | "cta"

      if (type === "music") {
        const title = (formData.get("title") as string) || "Custom Studio Track";
        const genre = (formData.get("genre") as string) || "Custom Commercial Beat";
        const bpm = parseInt(formData.get("bpm") as string, 10) || 120;
        const vibe = (formData.get("vibe") as string) || "Dynamic Commercial Cut";
        const provider = (formData.get("provider") as string) || "Custom Upload";
        const audioFile = formData.get("audioFile") as File | null;

        let src = "";

        if (audioFile && audioFile.size > 0) {
          if (!fs.existsSync(AUDIO_UPLOAD_DIR)) {
            fs.mkdirSync(AUDIO_UPLOAD_DIR, { recursive: true });
          }

          const fileExt = path.extname(audioFile.name) || ".mp3";
          const safeSlug = title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
          const fileName = `custom-${Date.now()}-${safeSlug}${fileExt}`;
          const filePath = path.join(AUDIO_UPLOAD_DIR, fileName);

          const bytes = await audioFile.arrayBuffer();
          fs.writeFileSync(filePath, Buffer.from(bytes));
          src = `/audio/music/${fileName}`;
        } else {
          // If URL provided
          src = (formData.get("src") as string) || "/audio/music/tech-driving-beat.mp3";
        }

        const id = `custom-track-${Date.now()}`;
        const newTrack: MusicTrack = {
          id,
          title,
          genre,
          bpm,
          vibe,
          src,
          provider: provider as any,
          licenseNote: "Custom Client License · Uploaded in Studio",
          isCustom: true,
        };

        const custom = getStoredCustomAssets();
        custom.musicTracks.unshift(newTrack);
        saveCustomAssets(custom);

        return NextResponse.json({
          success: true,
          created: newTrack,
          allTracks: [...custom.musicTracks, ...LICENSED_MUSIC_LIBRARY],
        });
      }
    }

    // 2. JSON Body (Direct payload for Track or CTA)
    const body = await req.json();

    if (body.type === "music") {
      const id = body.id || `custom-track-${Date.now()}`;
      const newTrack: MusicTrack = {
        id,
        title: body.title || "Custom Track",
        genre: body.genre || "Commercial Upbeat",
        bpm: body.bpm || 120,
        vibe: body.vibe || "High Energy",
        src: body.src || "/audio/music/energy-direct-response.mp3",
        provider: body.provider || "Custom Upload",
        licenseNote: body.licenseNote || "Client Approved Commercial Track",
        isCustom: true,
      };

      const custom = getStoredCustomAssets();
      custom.musicTracks.unshift(newTrack);
      saveCustomAssets(custom);

      return NextResponse.json({
        success: true,
        created: newTrack,
        allTracks: [...custom.musicTracks, ...LICENSED_MUSIC_LIBRARY],
      });
    }

    if (body.type === "cta") {
      const id = body.id || `custom-cta-${Date.now()}`;
      const newCta: CtaTemplate = {
        id,
        name: body.name || "Custom Branded CTA",
        badge: body.badge || "Special Offer",
        description: body.description || "Custom client CTA template with animated button",
        headline: body.headline,
        buttonText: body.buttonText,
        styleVariant: body.styleVariant || "promo-stamp",
        isCustom: true,
      };

      const custom = getStoredCustomAssets();
      custom.ctaTemplates.unshift(newCta);
      saveCustomAssets(custom);

      return NextResponse.json({
        success: true,
        created: newCta,
        allCtas: [...custom.ctaTemplates, ...BRANDED_CTA_TEMPLATES],
      });
    }

    return NextResponse.json({ error: "Invalid asset type" }, { status: 400 });
  } catch (err: any) {
    console.error("Failed to process timeline asset:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

