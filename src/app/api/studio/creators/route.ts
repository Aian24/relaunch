import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CREATOR_ROSTER, CreatorProfile } from "@/data/creatorRoster";
import { CREATOR_ASSETS, CreatorClipAsset } from "@/data/creatorAssets";

export const dynamic = "force-dynamic";

const STORAGE_DIR = path.join(process.cwd(), "public", "storage");
const CUSTOM_ROSTER_PATH = path.join(STORAGE_DIR, "custom-creators.json");
const CUSTOM_ASSETS_PATH = path.join(STORAGE_DIR, "custom-creator-assets.json");

function ensureStorage(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function getCustomCreators(): CreatorProfile[] {
  try {
    if (fs.existsSync(CUSTOM_ROSTER_PATH)) {
      return JSON.parse(fs.readFileSync(CUSTOM_ROSTER_PATH, "utf8"));
    }
  } catch (err) {
    console.warn("Could not read custom creators roster", err);
  }
  return [];
}

function saveCustomCreators(creators: CreatorProfile[]): void {
  ensureStorage();
  fs.writeFileSync(CUSTOM_ROSTER_PATH, JSON.stringify(creators, null, 2), "utf8");
}

function getCustomAssets(): CreatorClipAsset[] {
  try {
    if (fs.existsSync(CUSTOM_ASSETS_PATH)) {
      return JSON.parse(fs.readFileSync(CUSTOM_ASSETS_PATH, "utf8"));
    }
  } catch (err) {
    console.warn("Could not read custom creator assets", err);
  }
  return [];
}

function saveCustomAssets(assets: CreatorClipAsset[]): void {
  ensureStorage();
  fs.writeFileSync(CUSTOM_ASSETS_PATH, JSON.stringify(assets, null, 2), "utf8");
}

/**
 * Scan physical folders under public/creators to detect takes and update take status
 */
function scanCreatorPhysicalTakes(slug: string): { hookCount: number; brollCount: number; hasTakes: boolean } {
  const hooksDir = path.join(process.cwd(), "public", "creators", slug, "hooks");
  const brollDir = path.join(process.cwd(), "public", "creators", slug, "broll");

  let hookCount = 0;
  let brollCount = 0;

  try {
    if (fs.existsSync(hooksDir)) {
      hookCount = fs.readdirSync(hooksDir).filter((f) => f.endsWith(".mp4") || f.endsWith(".mov")).length;
    }
    if (fs.existsSync(brollDir)) {
      brollCount = fs.readdirSync(brollDir).filter((f) => f.endsWith(".mp4") || f.endsWith(".mov")).length;
    }
  } catch (e) {
    console.warn(`Error scanning physical takes for ${slug}`, e);
  }

  return {
    hookCount,
    brollCount,
    hasTakes: hookCount + brollCount > 0,
  };
}

export async function GET() {
  const customCreators = getCustomCreators();
  const customAssets = getCustomAssets();

  // 1. Build combined roster
  const creatorMap = new Map<string, CreatorProfile>();
  for (const cr of CREATOR_ROSTER) {
    const scan = scanCreatorPhysicalTakes(cr.actorPresetId);
    creatorMap.set(cr.actorPresetId, {
      ...cr,
      hasVideoTakes: cr.hasVideoTakes || scan.hasTakes,
    });
  }
  for (const cr of customCreators) {
    const scan = scanCreatorPhysicalTakes(cr.actorPresetId);
    creatorMap.set(cr.actorPresetId, {
      ...cr,
      hasVideoTakes: scan.hasTakes || cr.hasVideoTakes || false,
    });
  }

  // 2. Build combined assets
  const assetMap = new Map<string, CreatorClipAsset>();
  for (const asset of CREATOR_ASSETS) {
    assetMap.set(asset.id, asset);
  }
  for (const asset of customAssets) {
    assetMap.set(asset.id, asset);
  }

  const allRoster = Array.from(creatorMap.values());
  const allAssets = Array.from(assetMap.values());

  return NextResponse.json({
    roster: allRoster,
    assets: allAssets,
    totalCreators: allRoster.length,
    totalAssets: allAssets.length,
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // A. Handle Multipart Form Data (Direct File Upload for New Creator / Video Take)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const action = (formData.get("action") as string) || "upload_take";
      const creatorName = ((formData.get("creatorName") as string) || "").trim();
      const rawSlug = ((formData.get("creatorSlug") as string) || creatorName).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      const creatorSlug = rawSlug || "creator";
      const handle = (formData.get("handle") as string) || `@${creatorSlug}creative`;
      const niche = (formData.get("niche") as string) || "General Lifestyle & Tech";
      const type = (formData.get("type") as string) === "broll" ? "broll" : "hook";
      const angle = (formData.get("angle") as string) || "general";
      const spokenText = (formData.get("spokenText") as string) || "";
      const label = (formData.get("label") as string) || `Hook: ${spokenText ? spokenText.slice(0, 30) : "Take"}`;
      const startTrim = Number(formData.get("startTrim")) || 0;
      const endTrim = Number(formData.get("endTrim")) || 3.8;

      // 1. Ensure physical directories exist on disk
      const creatorBaseDir = path.join(process.cwd(), "public", "creators", creatorSlug);
      const hooksDir = path.join(creatorBaseDir, "hooks");
      const brollDir = path.join(creatorBaseDir, "broll");

      if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });
      if (!fs.existsSync(brollDir)) fs.mkdirSync(brollDir, { recursive: true });

      // 2. Register/update Creator Profile in custom roster
      const customCreators = getCustomCreators();
      let existingCreator = customCreators.find((c) => c.actorPresetId === creatorSlug);
      if (!existingCreator) {
        existingCreator = {
          id: `cr-${creatorSlug}`,
          name: creatorName || creatorSlug.charAt(0).toUpperCase() + creatorSlug.slice(1),
          handle,
          niche,
          actorPresetId: creatorSlug,
          platforms: ["Meta", "TikTok", "YouTube"],
          sparkAdCodeReady: true,
          metaPartnershipEnabled: true,
          consentAgreementOnFile: true,
          agreementId: `AGR-2026-${creatorSlug.toUpperCase()}-001`,
          verifiedDate: new Date().toISOString().split("T")[0],
          followersCount: (formData.get("followersCount") as string) || "120K",
          avgEngagement: (formData.get("avgEngagement") as string) || "5.2%",
          hasVideoTakes: false,
        };
        customCreators.unshift(existingCreator);
      } else {
        existingCreator.name = creatorName || existingCreator.name;
        existingCreator.handle = handle || existingCreator.handle;
        existingCreator.niche = niche || existingCreator.niche;
      }

      // 3. Process video file if uploaded
      const videoFile = formData.get("videoFile") as File | null;
      let assetRecord: CreatorClipAsset | null = null;

      if (videoFile && videoFile.size > 0) {
        const fileBytes = Buffer.from(await videoFile.arrayBuffer());
        const ext = path.extname(videoFile.name) || ".mp4";
        const targetSubdir = type === "broll" ? brollDir : hooksDir;
        
        // Count existing files in folder to generate friendly numbering (e.g. jeo-hook-01.mp4)
        const existingCount = fs.readdirSync(targetSubdir).filter((f) => f.endsWith(".mp4") || f.endsWith(".mov")).length;
        const nextIndex = String(existingCount + 1).padStart(2, "0");
        const baseFilename = `${creatorSlug}-${type}-${nextIndex}`;
        const finalVideoPath = path.join(targetSubdir, `${baseFilename}${ext}`);
        
        fs.writeFileSync(finalVideoPath, fileBytes);

        // Also create a default thumbnail JPG placeholder from existing assets if available
        const thumbPath = path.join(targetSubdir, `${baseFilename}.jpg`);
        const fallbackThumb = path.join(process.cwd(), "public", "creators", "haley", "hooks", "haley-hook-01.jpg");
        if (!fs.existsSync(thumbPath) && fs.existsSync(fallbackThumb)) {
          try {
            fs.copyFileSync(fallbackThumb, thumbPath);
          } catch {}
        }

        existingCreator.hasVideoTakes = true;

        // Register Asset
        assetRecord = {
          id: baseFilename,
          creatorId: creatorSlug,
          creatorName: existingCreator.name,
          handle: existingCreator.handle,
          type,
          angle: angle as any,
          label: label || `Hook ${nextIndex}: ${spokenText ? spokenText.slice(0, 30) : "Take"}`,
          spokenText,
          src: `/creators/${creatorSlug}/${type === "broll" ? "broll" : "hooks"}/${baseFilename}${ext}`,
          thumbnail: `/creators/${creatorSlug}/${type === "broll" ? "broll" : "hooks"}/${baseFilename}.jpg`,
          durationSeconds: endTrim > startTrim ? +(endTrim - startTrim + 2).toFixed(1) : 10,
          recommendedTrim: {
            start: startTrim,
            end: endTrim,
          },
          resolution: "1080x1920",
          fps: 30,
          version: 1,
          status: "active",
        };

        const customAssets = getCustomAssets();
        customAssets.unshift(assetRecord);
        saveCustomAssets(customAssets);
      }

      saveCustomCreators(customCreators);

      return NextResponse.json({
        ok: true,
        message: `Creator ${existingCreator.name} and folder public/creators/${creatorSlug} configured successfully`,
        creator: existingCreator,
        asset: assetRecord,
        foldersCreated: {
          hooks: `/creators/${creatorSlug}/hooks/`,
          broll: `/creators/${creatorSlug}/broll/`,
        },
      });
    }

    // B. Handle Standard JSON Payload (register asset or creator)
    const body = await request.json();

    // 1. Create Creator Action
    if (body.action === "create_creator") {
      const { name, handle, niche, slug, followersCount, avgEngagement } = body;
      const creatorSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
      
      // Create folder structure on disk
      const hooksDir = path.join(process.cwd(), "public", "creators", creatorSlug, "hooks");
      const brollDir = path.join(process.cwd(), "public", "creators", creatorSlug, "broll");
      if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });
      if (!fs.existsSync(brollDir)) fs.mkdirSync(brollDir, { recursive: true });

      const newCreator: CreatorProfile = {
        id: `cr-${creatorSlug}`,
        name: name || creatorSlug.charAt(0).toUpperCase() + creatorSlug.slice(1),
        handle: handle || `@${creatorSlug}creative`,
        niche: niche || "E-commerce & Local Business",
        actorPresetId: creatorSlug,
        platforms: ["Meta", "TikTok", "YouTube"],
        sparkAdCodeReady: true,
        metaPartnershipEnabled: true,
        consentAgreementOnFile: true,
        agreementId: `AGR-2026-${creatorSlug.toUpperCase()}-001`,
        verifiedDate: new Date().toISOString().split("T")[0],
        followersCount: followersCount || "140K",
        avgEngagement: avgEngagement || "5.4%",
        hasVideoTakes: false,
      };

      const currentCreators = getCustomCreators();
      const existingIdx = currentCreators.findIndex((c) => c.actorPresetId === creatorSlug);
      if (existingIdx >= 0) {
        currentCreators[existingIdx] = newCreator;
      } else {
        currentCreators.unshift(newCreator);
      }
      saveCustomCreators(currentCreators);

      return NextResponse.json({
        ok: true,
        creator: newCreator,
        message: `Created creator ${newCreator.name} with folders /creators/${creatorSlug}/hooks and /broll`,
      });
    }

    // 3. Delete or Restore Clip Action
    if (body.action === "delete_clip") {
      const { id, permanent = false } = body;
      const currentCustom = getCustomAssets();
      const assetIdx = currentCustom.findIndex((a) => a.id === id);

      if (assetIdx >= 0) {
        const target = currentCustom[assetIdx];
        if (permanent) {
          if (target.src.startsWith("/creators/") || target.src.startsWith("/storage/")) {
            const diskPath = path.join(process.cwd(), "public", target.src.replace(/^\//, ""));
            try {
              if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
            } catch (e) {
              console.warn("Could not remove creator video from disk:", diskPath, e);
            }
          }
          currentCustom.splice(assetIdx, 1);
        } else {
          target.status = "deleted";
        }
        saveCustomAssets(currentCustom);
        return NextResponse.json({ ok: true, message: `Creator take ${permanent ? "permanently deleted" : "moved to trash"}` });
      }
      return NextResponse.json({ ok: true, message: "Take removed" });
    }

    if (body.action === "restore_clip") {
      const { id } = body;
      const currentCustom = getCustomAssets();
      const target = currentCustom.find((a) => a.id === id);
      if (target) {
        target.status = "active";
        saveCustomAssets(currentCustom);
        return NextResponse.json({ ok: true, message: "Creator take restored" });
      }
      return NextResponse.json({ error: "Clip not found" }, { status: 404 });
    }

    // 2. Register Clip Asset Action
    const {
      creatorId,
      creatorName,
      handle,
      type = "hook",
      angle = "general",
      label,
      spokenText,
      src,
      thumbnail,
      startTrim = 0,
      endTrim = 3.5,
      durationSeconds = 10,
    } = body;

    if (!creatorId || !src) {
      return NextResponse.json({ error: "creatorId and video src are required" }, { status: 400 });
    }

    const safeId = `${creatorId}-${type}-${Date.now().toString().slice(-4)}`;
    const newAsset: CreatorClipAsset = {
      id: body.id || safeId,
      creatorId,
      creatorName: creatorName || creatorId.charAt(0).toUpperCase() + creatorId.slice(1),
      handle: handle || `@${creatorId}creative`,
      type: type === "broll" ? "broll" : "hook",
      angle: angle || "general",
      label: label || `Hook: ${spokenText ? spokenText.slice(0, 30) + "..." : "New Take"}`,
      spokenText: spokenText || "",
      src,
      thumbnail: thumbnail || src.replace(/\.mp4$/, ".jpg"),
      durationSeconds: Number(durationSeconds) || 10,
      recommendedTrim: {
        start: Number(startTrim) || 0,
        end: Number(endTrim) || 3.5,
      },
      resolution: "1080x1920",
      fps: 30,
      version: 1,
      status: "active",
    };

    const currentCustom = getCustomAssets();
    const existingIndex = currentCustom.findIndex((a) => a.id === newAsset.id);
    if (existingIndex >= 0) {
      currentCustom[existingIndex] = newAsset;
    } else {
      currentCustom.unshift(newAsset);
    }
    saveCustomAssets(currentCustom);

    return NextResponse.json({
      ok: true,
      asset: newAsset,
      message: "Creator take saved and registered successfully",
    });
  } catch (err: any) {
    console.error("Failed to process creator request", err);
    return NextResponse.json({ error: "Failed to process creator request", details: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const permanent = searchParams.get("permanent") === "true";

    if (!id) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
    }

    const currentCustom = getCustomAssets();
    const assetIdx = currentCustom.findIndex((a) => a.id === id);

    if (assetIdx >= 0) {
      const target = currentCustom[assetIdx];
      if (permanent) {
        if (target.src.startsWith("/creators/") || target.src.startsWith("/storage/")) {
          const diskPath = path.join(process.cwd(), "public", target.src.replace(/^\//, ""));
          try {
            if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
          } catch (e) {
            console.warn("Could not remove creator video from disk:", diskPath, e);
          }
        }
        currentCustom.splice(assetIdx, 1);
      } else {
        target.status = "deleted";
      }
      saveCustomAssets(currentCustom);
      return NextResponse.json({ ok: true, message: `Creator take ${permanent ? "permanently deleted" : "moved to trash"}` });
    }

    return NextResponse.json({ ok: true, message: "Take removed" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete creator take" }, { status: 500 });
  }
}
