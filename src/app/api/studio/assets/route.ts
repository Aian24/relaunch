import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface BrandMediaAsset {
  id: string;
  brandSlug: string;
  brandName: string;
  title: string;
  category: "product-demo" | "b-roll" | "unboxing" | "packaging" | "logo";
  targetScene: 2 | 3;
  src: string;
  durationSeconds?: number;
  fileSizeMb?: number;
  uploadedAt: string;
  status?: "active" | "deleted";
  deletedAt?: string;
}

const STORAGE_DIR = path.join(process.cwd(), "public", "storage", "brands");
const BRAND_ASSETS_FILE = path.join(STORAGE_DIR, "brand-assets.json");

function ensureStorage(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function getStoredBrandAssets(): BrandMediaAsset[] {
  try {
    if (fs.existsSync(BRAND_ASSETS_FILE)) {
      return JSON.parse(fs.readFileSync(BRAND_ASSETS_FILE, "utf8"));
    }
  } catch (err) {
    console.warn("Could not read brand-assets.json", err);
  }
  return [];
}

function saveStoredBrandAssets(assets: BrandMediaAsset[]): void {
  ensureStorage();
  fs.writeFileSync(BRAND_ASSETS_FILE, JSON.stringify(assets, null, 2), "utf8");
}

const BASELINE_BRAND_ASSETS: BrandMediaAsset[] = [
  {
    id: "relaunch-ai-dash-01",
    brandSlug: "relaunch",
    brandName: "ReLaunch",
    title: "AI Search Recommendation Engine Platform",
    category: "product-demo",
    targetScene: 2,
    src: "/videos/carmen-hotel-body.mp4",
    durationSeconds: 12.0,
    fileSizeMb: 8.5,
    uploadedAt: "2026-11-10T12:00:00Z",
    status: "active",
  },
  {
    id: "trailline-product-demo-01",
    brandSlug: "trailline-apparel",
    brandName: "TrailLine Apparel",
    title: "Mountain Ridge Technical Waterproof Fabric",
    category: "product-demo",
    targetScene: 2,
    src: "/videos/outdoor/trailline-mountain-ridge.mp4",
    durationSeconds: 15.0,
    fileSizeMb: 12.2,
    uploadedAt: "2026-11-10T12:00:00Z",
    status: "active",
  },
  {
    id: "chicago-dog-social-01",
    brandSlug: "frank-and-patty",
    brandName: "Frank & Patty Hot Dogs",
    title: "Authentic Chicago Style Poppy Seed Dog",
    category: "product-demo",
    targetScene: 2,
    src: "/videos/chicago-dog-social-1.mp4",
    durationSeconds: 9.0,
    fileSizeMb: 6.8,
    uploadedAt: "2026-11-10T12:00:00Z",
    status: "active",
  },
  {
    id: "turflife-demo-01",
    brandSlug: "turflife-golf",
    brandName: "TurfLife Golf Club",
    title: "Coastal Fairway Slow-Motion Driver Swing",
    category: "b-roll",
    targetScene: 3,
    src: "/videos/turflife-real-video.mp4",
    durationSeconds: 14.0,
    fileSizeMb: 11.4,
    uploadedAt: "2026-11-10T12:00:00Z",
    status: "active",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandSlug = searchParams.get("brandSlug");
  const view = searchParams.get("view"); // "active" | "trash" | "all"

  const stored = getStoredBrandAssets();
  const all = [...stored];

  // Merge baseline if not already stored
  for (const base of BASELINE_BRAND_ASSETS) {
    if (!all.some((a) => a.id === base.id)) {
      all.push(base);
    }
  }

  let filtered = all;
  if (brandSlug) {
    filtered = filtered.filter((a) => a.brandSlug.toLowerCase() === brandSlug.toLowerCase());
  }

  const activeAssets = filtered.filter((a) => a.status !== "deleted");
  const trashedAssets = filtered.filter((a) => a.status === "deleted");

  if (view === "trash") {
    return NextResponse.json({
      assets: trashedAssets,
      activeCount: activeAssets.length,
      trashCount: trashedAssets.length,
    });
  }

  if (view === "all") {
    return NextResponse.json({
      assets: filtered,
      activeCount: activeAssets.length,
      trashCount: trashedAssets.length,
    });
  }

  return NextResponse.json({
    assets: activeAssets,
    trashedAssets: trashedAssets,
    activeCount: activeAssets.length,
    trashCount: trashedAssets.length,
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. JSON Actions (Trash, Restore, Permanent Delete, Empty Trash)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const action = String(body.action || "").toLowerCase();
      const id = String(body.id || "").trim();

      const stored = getStoredBrandAssets();
      // Ensure baseline exists in stored before mutating
      const all = [...stored];
      for (const base of BASELINE_BRAND_ASSETS) {
        if (!all.some((a) => a.id === base.id)) {
          all.push({ ...base });
        }
      }

      if (action === "trash") {
        if (!id) return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
        const target = all.find((a) => a.id === id);
        if (!target) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

        target.status = "deleted";
        target.deletedAt = new Date().toISOString();
        saveStoredBrandAssets(all);

        return NextResponse.json({
          ok: true,
          message: `Moved "${target.title}" to Trash`,
          asset: target,
        });
      }

      if (action === "restore") {
        if (!id) return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
        const target = all.find((a) => a.id === id);
        if (!target) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

        target.status = "active";
        delete target.deletedAt;
        saveStoredBrandAssets(all);

        return NextResponse.json({
          ok: true,
          message: `Restored "${target.title}" to active library`,
          asset: target,
        });
      }

      if (action === "delete_permanent") {
        if (!id) return NextResponse.json({ error: "Asset ID required" }, { status: 400 });
        const target = all.find((a) => a.id === id);
        if (!target) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

        // If file exists in public/storage/brands/, safely unlink
        if (target.src.startsWith("/storage/brands/")) {
          const diskPath = path.join(process.cwd(), "public", target.src.replace(/^\//, ""));
          try {
            if (fs.existsSync(diskPath)) {
              fs.unlinkSync(diskPath);
            }
          } catch (e) {
            console.warn("Could not remove file on disk:", diskPath, e);
          }
        }

        const remaining = all.filter((a) => a.id !== id);
        saveStoredBrandAssets(remaining);

        return NextResponse.json({
          ok: true,
          message: `Permanently deleted "${target.title}"`,
          id,
        });
      }

      if (action === "empty_trash") {
        const toDelete = all.filter((a) => a.status === "deleted");
        for (const asset of toDelete) {
          if (asset.src.startsWith("/storage/brands/")) {
            const diskPath = path.join(process.cwd(), "public", asset.src.replace(/^\//, ""));
            try {
              if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
            } catch (e) {
              console.warn("Could not remove file on disk:", diskPath, e);
            }
          }
        }

        const remaining = all.filter((a) => a.status !== "deleted");
        saveStoredBrandAssets(remaining);

        return NextResponse.json({
          ok: true,
          message: `Emptied trash (${toDelete.length} clips permanently purged)`,
          count: toDelete.length,
        });
      }

      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    // 2. Multipart Form Upload (New Product Media File)
    const formData = await request.formData();
    const brandName = (formData.get("brandName") as string) || "Client Brand";
    const brandSlug = (formData.get("brandSlug") as string) ||
      brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const title = (formData.get("title") as string) || "Product Demo Footage";
    const category = ((formData.get("category") as string) || "product-demo") as BrandMediaAsset["category"];
    const targetScene = parseInt((formData.get("targetScene") as string) || "2", 10) as 2 | 3;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Video file required" }, { status: 400 });
    }

    const brandDir = path.join(STORAGE_DIR, brandSlug);
    if (!fs.existsSync(brandDir)) {
      fs.mkdirSync(brandDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".mp4";
    const filename = `${brandSlug}-${category}-${Date.now()}${ext}`;
    const filePath = path.join(brandDir, filename);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/storage/brands/${brandSlug}/${filename}`;
    const assetId = `brand-${brandSlug}-${Date.now()}`;

    const newAsset: BrandMediaAsset = {
      id: assetId,
      brandSlug,
      brandName,
      title,
      category,
      targetScene,
      src: relativeUrl,
      fileSizeMb: Number((buffer.length / (1024 * 1024)).toFixed(2)),
      uploadedAt: new Date().toISOString(),
      status: "active",
    };

    const currentAssets = getStoredBrandAssets();
    saveStoredBrandAssets([newAsset, ...currentAssets]);

    return NextResponse.json({
      success: true,
      asset: newAsset,
      message: `Successfully uploaded ${title} for ${brandName}`,
    });
  } catch (error: any) {
    console.error("[Brand Assets Upload Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process brand media asset" },
      { status: 500 }
    );
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

    const stored = getStoredBrandAssets();
    const all = [...stored];
    for (const base of BASELINE_BRAND_ASSETS) {
      if (!all.some((a) => a.id === base.id)) {
        all.push({ ...base });
      }
    }

    const target = all.find((a) => a.id === id);
    if (!target) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    if (permanent) {
      if (target.src.startsWith("/storage/brands/")) {
        const diskPath = path.join(process.cwd(), "public", target.src.replace(/^\//, ""));
        try {
          if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
        } catch (e) {
          console.warn("Could not remove file on disk:", diskPath, e);
        }
      }
      const remaining = all.filter((a) => a.id !== id);
      saveStoredBrandAssets(remaining);
      return NextResponse.json({ ok: true, message: `Permanently deleted "${target.title}"` });
    } else {
      target.status = "deleted";
      target.deletedAt = new Date().toISOString();
      saveStoredBrandAssets(all);
      return NextResponse.json({ ok: true, message: `Moved "${target.title}" to Trash` });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete asset" }, { status: 500 });
  }
}
