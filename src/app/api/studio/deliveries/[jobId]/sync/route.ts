import { NextResponse } from "next/server";
import { getAdJobById, saveAdJob } from "@/lib/adJob";
import { syncDeliverablesToGoogleDrive, getGoogleDriveFolderUrl } from "@/lib/googleDrive";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  if (!jobId) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  const job = getAdJobById(jobId);
  if (!job) {
    return NextResponse.json({ error: "Deliverable job not found" }, { status: 404 });
  }

  // Strict Creative Director Gate: Prevent sync if not approved
  if (job.status !== "approved") {
    return NextResponse.json(
      {
        error: "CD Gate Enforced: Deliverable cannot be synced to Google Drive until approved by Creative Director.",
        jobStatus: job.status,
        requiredSignOff: "Creative Director Approval",
      },
      { status: 403 }
    );
  }

  try {
    const result = await syncDeliverablesToGoogleDrive({
      jobId: job.id,
      brandName: job.brandName,
      reviewerName: job.reviewLog?.reviewerName || "Operator",
      variants: job.variants,
      metadata: {
        hookText: job.hookText,
        scriptBody: job.script?.body || "",
        ctaText: job.script?.ctaText || "",
        creativeAngle: job.creativeAngle,
        hookType: job.hookType,
        aspectRatios: ["9:16", "1:1", "4:5"],
      },
    });

    // Update job delivery record
    job.delivery = {
      googleDriveFolderId: result.folderId,
      deliveredAt: result.syncedAt,
      status: result.status,
      googleDriveFileIds: {
        v9x16: result.files.v9x16 || `drive-${job.id}-9x16.mp4`,
        v1x1: result.files.v1x1 || `drive-${job.id}-1x1.mp4`,
        v4x5: result.files.v4x5 || `drive-${job.id}-4x5.mp4`,
      },
    };
    saveAdJob(job);

    return NextResponse.json({
      ok: true,
      result,
      folderUrl: result.folderUrl,
      message: result.message,
    });
  } catch (err: any) {
    console.error("[Google Drive Sync Error]", err);
    return NextResponse.json(
      {
        error: "Failed to sync deliverables to Google Drive",
        details: err.message,
        folderUrl: getGoogleDriveFolderUrl(),
      },
      { status: 500 }
    );
  }
}
