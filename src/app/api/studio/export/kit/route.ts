import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdJobById } from "@/lib/adJob";
import { buildZipArchive, ZipFileInput } from "@/lib/zipBuilder";
import { generateTimelineXml } from "@/lib/timelineXmlGenerator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  const job = getAdJobById(jobId);
  const filesToZip: ZipFileInput[] = [];
  const safeBrand = (job?.brandName || "relaunch").toLowerCase().replace(/[^a-z0-9]/g, "-");

  // 1. Video Masters
  const publicDir = path.join(process.cwd(), "public");

  // Check 4K Master
  const v4kPath = path.join(publicDir, "storage", "variants", `${jobId}-4k.mp4`);
  if (fs.existsSync(v4kPath)) {
    filesToZip.push({
      name: `01_Video_Masters/${safeBrand}-${jobId}-4k-master.mp4`,
      content: fs.readFileSync(v4kPath),
    });
  }

  // Check 9:16 Reel
  const v916Rel = job?.variants?.v9x16 ? job.variants.v9x16.replace(/^\//, "") : `storage/variants/${jobId}-9x16.mp4`;
  const v916Path = path.join(publicDir, v916Rel);
  if (fs.existsSync(v916Path)) {
    filesToZip.push({
      name: `01_Video_Masters/${safeBrand}-${jobId}-9x16-hd.mp4`,
      content: fs.readFileSync(v916Path),
    });
  }

  // Check Clean Video (no text)
  const vCleanPath = path.join(publicDir, "storage", "variants", `${jobId}-clean.mp4`);
  if (fs.existsSync(vCleanPath)) {
    filesToZip.push({
      name: `01_Video_Masters/${safeBrand}-${jobId}-clean-no-text.mp4`,
      content: fs.readFileSync(vCleanPath),
    });
  }

  // 2. Audio Stems
  const voStemPath = path.join(publicDir, "storage", "variants", `${jobId}-stem-vo.wav`);
  if (fs.existsSync(voStemPath)) {
    filesToZip.push({
      name: `02_Audio_Stems/${safeBrand}-${jobId}-stem-voiceover.wav`,
      content: fs.readFileSync(voStemPath),
    });
  }

  const musicStemPath = path.join(publicDir, "storage", "variants", `${jobId}-stem-music.wav`);
  if (fs.existsSync(musicStemPath)) {
    filesToZip.push({
      name: `02_Audio_Stems/${safeBrand}-${jobId}-stem-music.wav`,
      content: fs.readFileSync(musicStemPath),
    });
  }

  // 3. Timeline Project (Premiere & DaVinci XML)
  const defaultCuts = [
    {
      sceneId: 1,
      name: "Scene 1: UGC Opening Hook",
      sourceFile: `01_Video_Masters/${safeBrand}-${jobId}-9x16-hd.mp4`,
      startSec: 0,
      durationSec: 3.5,
      inPointSec: 0,
      outPointSec: 3.5,
      isAiGapFill: false,
    },
    {
      sceneId: 2,
      name: "Scene 2: Product Feature Demonstration",
      sourceFile: `01_Video_Masters/${safeBrand}-${jobId}-9x16-hd.mp4`,
      startSec: 3.5,
      durationSec: 6.0,
      inPointSec: 3.5,
      outPointSec: 9.5,
      isAiGapFill: false,
    },
    {
      sceneId: 3,
      name: "Scene 3: Dynamic B-Roll Action",
      sourceFile: `01_Video_Masters/${safeBrand}-${jobId}-9x16-hd.mp4`,
      startSec: 9.5,
      durationSec: 6.0,
      inPointSec: 9.5,
      outPointSec: 15.5,
      isAiGapFill: false,
    },
    {
      sceneId: 4,
      name: "Scene 4: Branded CTA Template",
      sourceFile: `01_Video_Masters/${safeBrand}-${jobId}-9x16-hd.mp4`,
      startSec: 15.5,
      durationSec: 6.5,
      inPointSec: 15.5,
      outPointSec: 22.0,
      isAiGapFill: false,
    },
  ];

  const xmlContent = generateTimelineXml({
    jobId,
    brandName: job?.brandName || "ReLaunch Studio",
    cuts: defaultCuts,
    audioVoiceoverPath: `02_Audio_Stems/${safeBrand}-${jobId}-stem-voiceover.wav`,
    audioMusicPath: `02_Audio_Stems/${safeBrand}-${jobId}-stem-music.wav`,
  });

  filesToZip.push({
    name: `03_Timeline_Project/${safeBrand}-${jobId}-timeline-premiere-davinci.xml`,
    content: Buffer.from(xmlContent, "utf8"),
  });

  // 4. Creative Brief & Script Documentation
  const briefText = [
    `========================================================================`,
    `RELAUNCH STUDIO — EDITOR FINISHING KIT (80% ASSEMBLED / 20% POLISH)`,
    `Job ID: ${jobId}`,
    `Brand: ${job?.brandName || "ReLaunch Studio"}`,
    `Generated: ${new Date().toUTCString()}`,
    `========================================================================`,
    ``,
    `WORKFLOW SPECIFICATIONS:`,
    `- Sequence Resolution: 2160x3840 (4K Vertical 9:16) / 1080x1920 (HD)`,
    `- Frame Rate: 30 fps (Broadcast Standard)`,
    `- Audio Standard: -14 LUFS Normalized Voiceover, -18dB Ducked Background Music`,
    `- Timeline Format: Final Cut Pro 7 XML (Compatible with DaVinci Resolve & Premiere Pro)`,
    ``,
    `CREATIVE SCRIPT BREAKDOWN:`,
    `------------------------------------------------------------------------`,
    `HOOK HEADLINE (0–3.5s):`,
    `"${job?.hookText || "Real creator opening hook"}"`,
    ``,
    `VOICEOVER SCRIPT (3.5–22s):`,
    `"${job?.script?.body || "Broadcast product voiceover script"}"`,
    ``,
    `CALL TO ACTION (Scene 4):`,
    `"${job?.script?.ctaText || "Claim Offer"}"`,
    `------------------------------------------------------------------------`,
    ``,
    `HOW TO IMPORT INTO DAVINCI RESOLVE / PREMIERE PRO:`,
    `1. Extract this ZIP archive to your local video projects folder.`,
    `2. Open DaVinci Resolve or Adobe Premiere Pro.`,
    `3. File > Import > Timeline (Select 03_Timeline_Project/*.xml).`,
    `4. In the dialog, link the media files to the extracted folders.`,
    `5. All 4 cuts and both audio stem tracks (VO and Music) are now in sync on your timeline!`,
    `========================================================================`,
  ].join("\n");

  filesToZip.push({
    name: `04_Documentation/ad-creative-brief-and-script.txt`,
    content: Buffer.from(briefText, "utf8"),
  });

  // Fallback: If no local variants exist on disk yet, provide timeline XML & brief
  const zipBuffer = buildZipArchive(filesToZip);
  const filename = `${safeBrand}-${jobId}-editor-kit.zip`;

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
