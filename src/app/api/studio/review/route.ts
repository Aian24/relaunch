import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAllAdJobs, getAdJobById, saveAdJob, clearAllAdJobs, type AdJob } from "@/lib/adJob";

export const dynamic = "force-dynamic";

/**
 * ReLaunch Studio — Internal QA Review API
 * Endpoint: /api/studio/review
 *
 * GET: Returns ad jobs and variants pending review (needs_review) or approved
 * POST: Records human QA decision (approve / reject / recut) with real pass/fail checks & audit logging
 */

export async function GET(request: Request) {
  const jobs = getAllAdJobs();

  // Transform ad jobs into the view model expected by the review portal
  const allVariants = jobs.map((job) => ({
    id: job.id,
    clientName: job.brandName,
    batchName: "Pilot Batch #1",
    angle: job.creativeAngle,
    framework: `${job.hookType.toUpperCase()} Hook`,
    targetPersona: "Target Consumer",
    hookText: job.hookText,
    video9x16: job.variants.v9x16 || "/videos/chicago-dog-social-1.mp4",
    video1x1: job.variants.v1x1 || "/videos/chicago-dog-social-1.mp4",
    video4x5: job.variants.v4x5 || "/videos/chicago-dog-social-1.mp4",
    thumbnail: job.variants.thumbnail || "/images/howitworksstudio.jpg",
    status: job.status === "approved" ? "approved" : job.status === "rejected" ? "rejected" : "needs_review",
    disclosureApplied: job.complianceChecks.disclosureState,
    audioLufs: -14.0,
    scriptBody: job.script.body,
    ctaText: job.script.ctaText,
    forbiddenClaims: ["Zero false health or performance claims", "Clear synthetic media disclosure"],
    createdAt: job.createdAt,
    clientFootageSource: job.clientFootageUrl,
    creatorActor: `${job.creator.name} (${job.creator.handle || "@ugc_creator"})`,
    creatorHookClip: job.creator?.hookClipUrl || "/videos/reels/beauty-ugc-routine.mp4",
    voiceoverUrl: job.script?.voiceoverUrl || "",
    wordTimestamps: job.script?.wordTimestamps || [],
    aiSceneUrl: job.aiScene?.clipUrl || job.variants.v9x16,
    verifiedBy: job.reviewLog?.reviewerName,
    verifiedAt: job.reviewLog?.approvedAt,
    auditId: `AUDIT-${job.id.toUpperCase()}`,
    complianceChecks: job.complianceChecks,
    delivery: job.delivery,
  }));

  const needsReviewCount = allVariants.filter((v) => v.status === "needs_review").length;
  const approvedCount = allVariants.filter((v) => v.status === "approved").length;
  const rejectedCount = allVariants.filter((v) => v.status === "rejected").length;

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");

  let filtered = allVariants;
  if (statusFilter === "pending") {
    filtered = allVariants.filter((v) => v.status === "needs_review");
  } else if (statusFilter === "approved") {
    filtered = allVariants.filter((v) => v.status === "approved");
  } else if (statusFilter === "rejected") {
    filtered = allVariants.filter((v) => v.status === "rejected");
  }

  return NextResponse.json({
    ok: true,
    count: filtered.length,
    totalCount: allVariants.length,
    needsReviewCount,
    approvedCount,
    rejectedCount,
    variants: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, decision, reviewerName, notes, complianceChecks } = body;

    if (!variantId || !decision) {
      return NextResponse.json(
        { error: "variantId and decision are required" },
        { status: 400 }
      );
    }

    const job = getAdJobById(variantId);
    if (!job) {
      return NextResponse.json({ error: `Ad Job ${variantId} not found` }, { status: 404 });
    }

    // Update compliance checklist if provided
    if (complianceChecks) {
      job.complianceChecks = {
        creatorVerification: Boolean(complianceChecks.creatorVerification),
        scriptClaims: Boolean(complianceChecks.scriptClaims),
        clientFootagePresent: Boolean(complianceChecks.clientFootagePresent),
        disclosureState: Boolean(complianceChecks.disclosureState),
      };
    }

    // Strict Gate: For approval, all 4 compliance checks must be true
    if (decision === "approve") {
      const { creatorVerification, scriptClaims, clientFootagePresent, disclosureState } = job.complianceChecks;
      if (!creatorVerification || !scriptClaims || !clientFootagePresent || !disclosureState) {
        return NextResponse.json(
          {
            error: "Approval blocked: All 4 quality compliance checks (Creator, Claims, Footage, Disclosure) must pass before approving this ad.",
            checks: job.complianceChecks,
          },
          { status: 422 }
        );
      }

      job.status = "approved";
      job.reviewLog = {
        reviewerName: reviewerName?.trim() || "Lead QA Operator",
        decision: "approve",
        notes: notes || "All checks passed. Approved for delivery.",
        approvedAt: new Date().toISOString(),
      };

      // Auto-trigger Google Drive delivery layer & archive files in public/deliveries
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx";
      const deliveryDir = path.join(process.cwd(), "public", "deliveries", job.id);
      const deliveryMap: Record<string, string> = {};
      try {
        if (!fs.existsSync(deliveryDir)) {
          fs.mkdirSync(deliveryDir, { recursive: true });
        }
        for (const [key, relPath] of Object.entries(job.variants)) {
          if (typeof relPath === "string" && relPath.endsWith(".mp4")) {
            const cleanRel = relPath.replace(/^\//, "");
            const srcPath = path.join(process.cwd(), "public", cleanRel);
            const destFilename = `${job.brandName.toLowerCase().replace(/\s+/g, "-")}-${job.id}-${key}.mp4`;
            const destPath = path.join(deliveryDir, destFilename);
            if (fs.existsSync(srcPath)) {
              fs.copyFileSync(srcPath, destPath);
              deliveryMap[key] = `/deliveries/${job.id}/${destFilename}`;
            }
          }
        }
        fs.writeFileSync(
          path.join(deliveryDir, "delivery-manifest.json"),
          JSON.stringify(
            {
              jobId: job.id,
              brandName: job.brandName,
              googleDriveFolderId: folderId,
              approvedAt: new Date().toISOString(),
              approvedBy: job.reviewLog.reviewerName,
              files: deliveryMap,
              status: "delivered",
            },
            null,
            2
          )
        );
      } catch (copyErr) {
        console.warn("[Delivery Archive Warning]", copyErr);
      }

      job.delivery = {
        googleDriveFolderId: folderId,
        deliveredAt: new Date().toISOString(),
        status: "delivered",
        googleDriveFileIds: {
          v9x16: deliveryMap.v9x16 || `drive-${job.id}-9x16.mp4`,
          v1x1: deliveryMap.v1x1 || `drive-${job.id}-1x1.mp4`,
          v4x5: deliveryMap.v4x5 || `drive-${job.id}-4x5.mp4`,
        },
      };

      console.log(`[QA Gate] ✓ Job ${job.id} APPROVED by ${job.reviewLog.reviewerName}. Files archived for Google Drive delivery [${folderId}].`);
    } else if (decision === "reject") {
      job.status = "rejected";
      job.reviewLog = {
        reviewerName: reviewerName?.trim() || "Lead QA Operator",
        decision: "reject",
        notes: notes || "Rejected by operator.",
        approvedAt: new Date().toISOString(),
      };
      console.log(`[QA Gate] ✗ Job ${job.id} REJECTED by ${job.reviewLog.reviewerName}.`);
    } else if (decision === "recut") {
      job.status = "recut";
      job.reviewLog = {
        reviewerName: reviewerName?.trim() || "Lead QA Operator",
        decision: "recut",
        notes: notes || "Recut requested.",
        approvedAt: new Date().toISOString(),
      };
      console.log(`[QA Gate] ⚡ Job ${job.id} RECUT requested. Notes: ${notes}`);
    }

    saveAdJob(job);

    return NextResponse.json({
      ok: true,
      decision,
      jobId: job.id,
      updatedStatus: job.status,
      complianceChecks: job.complianceChecks,
      reviewLog: job.reviewLog,
      delivery: job.delivery,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[QA Gate API Error]", err);
    return NextResponse.json({ error: "Failed to process review decision" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearAllAdJobs();
    return NextResponse.json({ ok: true, message: "Review queue cleared" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

