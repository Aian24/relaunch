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
    title: "AI Search Recommendation Engine Dashboard",
    category: "product-demo",
    targetScene: 2,
    src: "/videos/relaunch-demo-clip.mp4",
    durationSeconds: 12.0,
    fileSizeMb: 8.5,
    uploadedAt: "2026-11-10T12:00:00Z",
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
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandSlug = searchParams.get("brandSlug");

  const stored = getStoredBrandAssets();
  const all = [...stored, ...BASELINE_BRAND_ASSETS];

  if (brandSlug) {
    const filtered = all.filter((a) => a.brandSlug.toLowerCase() === brandSlug.toLowerCase());
    return NextResponse.json({ assets: filtered });
  }

  return NextResponse.json({ assets: all });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const brandName = (formData.get("brandName") as string) || "Client Brand";
    const brandSlug = (formData.get("brandSlug") as string) ||
      brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const title = (formData.get("title") as string) || "Product Demo Footage";
    const category = ((formData.get("category") as string) || "product-demo") as BrandMediaAsset["category"];
    const targetScene = parseInt((formData.get("targetScene") as string) || "2", 10) as 2 | 3;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Video or image file required" }, { status: 400 });
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
      { error: error.message || "Failed to upload brand media asset" },
      { status: 500 }
    );
  }
}

