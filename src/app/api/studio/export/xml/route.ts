import { NextResponse } from "next/server";
import { generateTimelineXml, TimelineProjectOptions } from "@/lib/timelineXmlGenerator";
import { getAdJobById } from "@/lib/adJob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      jobId,
      brandName = "ReLaunch Brand",
      cuts = [],
      audioVoiceoverPath,
      audioMusicPath,
      audioMusicTitle,
      fps = 30,
      width = 2160,
      height = 3840,
    } = body;

    if (!cuts || cuts.length === 0) {
      // If cuts are not directly supplied, try to read from job store
      const job = jobId ? getAdJobById(jobId) : null;
      const defaultCuts = [
        {
          sceneId: 1,
          name: "Scene 1: UGC Opening Hook",
          sourceFile: job?.variants?.v9x16 || "/videos/sample-hook.mp4",
          startSec: 0,
          durationSec: 3.5,
          inPointSec: 0,
          outPointSec: 3.5,
          isAiGapFill: false,
        },
        {
          sceneId: 2,
          name: "Scene 2: Product Demonstration",
          sourceFile: "/videos/sample-product.mp4",
          startSec: 3.5,
          durationSec: 6.0,
          inPointSec: 0,
          outPointSec: 6.0,
          isAiGapFill: false,
        },
        {
          sceneId: 3,
          name: "Scene 3: Dynamic Feature B-Roll",
          sourceFile: "/videos/sample-broll.mp4",
          startSec: 9.5,
          durationSec: 6.0,
          inPointSec: 0,
          outPointSec: 6.0,
          isAiGapFill: false,
        },
        {
          sceneId: 4,
          name: "Scene 4: Branded CTA End Card",
          sourceFile: "/videos/sample-cta.mp4",
          startSec: 15.5,
          durationSec: 6.5,
          inPointSec: 0,
          outPointSec: 6.5,
          isAiGapFill: false,
        },
      ];

      const xml = generateTimelineXml({
        jobId: jobId || `job-${Date.now()}`,
        brandName: job?.brandName || brandName,
        fps,
        width,
        height,
        cuts: defaultCuts,
        audioVoiceoverPath: audioVoiceoverPath || (jobId ? `/storage/variants/${jobId}-stem-vo.wav` : undefined),
        audioMusicPath: audioMusicPath || (jobId ? `/storage/variants/${jobId}-stem-music.wav` : undefined),
        audioMusicTitle,
      });

      return new NextResponse(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="relaunch-${jobId || "timeline"}-premiere-davinci.xml"`,
        },
      });
    }

    const xml = generateTimelineXml({
      jobId: jobId || `job-${Date.now()}`,
      brandName,
      fps,
      width,
      height,
      cuts,
      audioVoiceoverPath,
      audioMusicPath,
      audioMusicTitle,
    });

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="relaunch-${jobId || "timeline"}-premiere-davinci.xml"`,
      },
    });
  } catch (error: any) {
    console.error("[Export XML API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to generate timeline XML" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId") || `export-${Date.now()}`;
  const brand = searchParams.get("brand") || "ReLaunch Studio";

  const job = getAdJobById(jobId);
  const defaultCuts = [
    {
      sceneId: 1,
      name: "Scene 1: UGC Opening Hook",
      sourceFile: job?.variants?.v9x16 || "/videos/sample-hook.mp4",
      startSec: 0,
      durationSec: 3.5,
      inPointSec: 0,
      outPointSec: 3.5,
      isAiGapFill: false,
    },
    {
      sceneId: 2,
      name: "Scene 2: Product Feature Demo",
      sourceFile: "/videos/sample-product.mp4",
      startSec: 3.5,
      durationSec: 6.0,
      inPointSec: 0,
      outPointSec: 6.0,
      isAiGapFill: false,
    },
    {
      sceneId: 3,
      name: "Scene 3: Dynamic B-Roll Action",
      sourceFile: "/videos/sample-broll.mp4",
      startSec: 9.5,
      durationSec: 6.0,
      inPointSec: 0,
      outPointSec: 6.0,
      isAiGapFill: false,
    },
    {
      sceneId: 4,
      name: "Scene 4: Branded CTA Template",
      sourceFile: "/videos/sample-cta.mp4",
      startSec: 15.5,
      durationSec: 6.5,
      inPointSec: 0,
      outPointSec: 6.5,
      isAiGapFill: false,
    },
  ];

  const xml = generateTimelineXml({
    jobId,
    brandName: job?.brandName || brand,
    cuts: defaultCuts,
    audioVoiceoverPath: `/storage/variants/${jobId}-stem-vo.wav`,
    audioMusicPath: `/storage/variants/${jobId}-stem-music.wav`,
  });

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="relaunch-${jobId}-premiere-davinci.xml"`,
    },
  });
}
