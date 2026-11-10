import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdJobById } from "@/lib/adJob";
import { buildZipArchive, ZipFileInput } from "@/lib/zipBuilder";
import { generateMetaCampaignCsv, generateTikTokAdKitText } from "@/lib/googleDrive";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  if (!jobId) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  const job = getAdJobById(jobId);
  const deliveryDir = path.join(process.cwd(), "public", "deliveries", jobId);

  const filesToZip: ZipFileInput[] = [];

  // Check if archived files exist in public/deliveries/[jobId]
  if (fs.existsSync(deliveryDir)) {
    const dirEntries = fs.readdirSync(deliveryDir);
    for (const entry of dirEntries) {
      const fullPath = path.join(deliveryDir, entry);
      if (fs.statSync(fullPath).isFile()) {
        filesToZip.push({
          name: entry,
          content: fs.readFileSync(fullPath),
        });
      }
    }
  }

  // Fallback: If not yet archived in deliveries folder, read from public variants
  if (filesToZip.length === 0 && job) {
    const brandPrefix = job.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    for (const [key, relPath] of Object.entries(job.variants)) {
      if (typeof relPath === "string" && relPath) {
        const cleanRel = relPath.replace(/^\//, "");
        const srcPath = path.join(process.cwd(), "public", cleanRel);
        if (fs.existsSync(srcPath)) {
          const ext = path.extname(srcPath);
          filesToZip.push({
            name: `${brandPrefix}-${job.id}-${key}${ext}`,
            content: fs.readFileSync(srcPath),
          });
        }
      }
    }

    // Add ad copy
    const copyContent = [
      `=====================================================`,
      `RELAUNCH STUDIO — CAMPAIGN DELIVERABLE KIT`,
      `Job ID: ${job.id}`,
      `Brand: ${job.brandName}`,
      `Generated: ${new Date().toUTCString()}`,
      `=====================================================`,
      ``,
      `HOOK HEADLINE:`,
      `"${job.hookText || ""}"`,
      ``,
      `BODY SCRIPT:`,
      `"${job.script?.body || ""}"`,
      ``,
      `CALL TO ACTION: "${job.script?.ctaText || "Learn More"}"`,
      `=====================================================`,
    ].join("\n");

    filesToZip.push({
      name: `ad-copy-meta.txt`,
      content: copyContent,
    });

    // Add Meta Ads Manager import CSV
    try {
      const metaCsv = generateMetaCampaignCsv(job.brandName, job.id, {
        hookText: job.hookText,
        scriptBody: job.script?.body,
        ctaText: job.script?.ctaText,
      });
      filesToZip.push({
        name: `meta-campaign-import.csv`,
        content: Buffer.from(metaCsv, "utf8"),
      });
    } catch (e) {
      console.warn("Could not generate meta-campaign-import.csv for ZIP", e);
    }

    // Add TikTok Spark Ad Kit
    try {
      const tiktokKit = generateTikTokAdKitText(job.brandName, job.id, {
        hookText: job.hookText,
        scriptBody: job.script?.body,
        ctaText: job.script?.ctaText,
      });
      filesToZip.push({
        name: `tiktok-ad-kit.txt`,
        content: Buffer.from(tiktokKit, "utf8"),
      });
    } catch (e) {
      console.warn("Could not generate tiktok-ad-kit.txt for ZIP", e);
    }
  }

  if (filesToZip.length === 0) {
    return NextResponse.json(
      { error: "No media files found for this deliverable job." },
      { status: 404 }
    );
  }

  const zipBuffer = buildZipArchive(filesToZip);
  const safeBrand = (job?.brandName || "relaunch").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const filename = `${safeBrand}-${jobId}-campaign-kit.zip`;

  return new NextResponse(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(zipBuffer.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
