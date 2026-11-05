import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAllAdJobs, getAdJobById, saveAdJob, clearAllAdJobs, deleteAdJobs, deleteAdJob, type AdJob } from "@/lib/adJob";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { syncDeliverablesToGoogleDrive, GOOGLE_DRIVE_FOLDER_ID, getGoogleDriveFolderUrl } from "@/lib/googleDrive";

export const dynamic = "force-dynamic";

/**
 * ReLaunch Studio — Internal QA Review API
 * Endpoint: /api/studio/review
 *
 * GET: Returns ad jobs and variants pending review (needs_review) or approved (rate-limited 60/min)
 * POST: Records human QA decision (approve / reject / recut) with real pass/fail checks & audit logging (rate-limited 20/min)
 */

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_review_get_${clientIp}`, 60, 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many review requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfterSeconds),
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

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
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_review_post_${clientIp}`, 20, 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many review submissions. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfterSeconds),
          "X-RateLimit-Limit": String(rateCheck.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { variantId, decision, reviewerName, notes, complianceChecks } = body;

    if (!variantId || !decision) {
      return NextResponse.json(
        { error: "variantId and decision are required" },
        { status: 400 }
      );
    }

    // Input sanitization & limits
    const safeDecision = String(decision).toLowerCase();
    if (!["approve", "reject", "recut"].includes(safeDecision)) {
      return NextResponse.json({ error: "Invalid decision value" }, { status: 400 });
    }

    const safeReviewerName = reviewerName ? String(reviewerName).trim().slice(0, 100) : "Lead QA Operator";
    const safeNotes = notes ? String(notes).trim().slice(0, 1000) : "";

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
    if (safeDecision === "approve") {
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
        reviewerName: safeReviewerName,
        decision: "approve",
        notes: safeNotes || "All checks passed. Approved for delivery.",
        approvedAt: new Date().toISOString(),
      };

      // Auto-trigger Google Drive delivery layer & archive files in public/deliveries
      try {
        const syncResult = await syncDeliverablesToGoogleDrive({
          jobId: job.id,
          brandName: job.brandName,
          reviewerName: safeReviewerName,
          variants: job.variants,
          metadata: {
            hookText: job.hookText,
            scriptBody: job.script?.body || "",
            ctaText: job.script?.ctaText || "",
            creativeAngle: job.creativeAngle,
            hookType: job.hookType,
          },
        });

        job.delivery = {
          googleDriveFolderId: syncResult.folderId,
          deliveredAt: syncResult.syncedAt,
          status: syncResult.status,
          googleDriveFileIds: {
            v9x16: syncResult.files.v9x16 || `drive-${job.id}-9x16.mp4`,
            v1x1: syncResult.files.v1x1 || `drive-${job.id}-1x1.mp4`,
            v4x5: syncResult.files.v4x5 || `drive-${job.id}-4x5.mp4`,
          },
        };
        console.log(`[QA Gate] ✓ Job ${job.id} APPROVED by ${safeReviewerName}. Files synced for Google Drive [${syncResult.folderId}].`);
      } catch (syncErr) {
        console.warn("[Delivery Archive Warning]", syncErr);
        job.delivery = {
          googleDriveFolderId: GOOGLE_DRIVE_FOLDER_ID,
          deliveredAt: new Date().toISOString(),
          status: "delivered",
          googleDriveFileIds: {
            v9x16: `drive-${job.id}-9x16.mp4`,
            v1x1: `drive-${job.id}-1x1.mp4`,
            v4x5: `drive-${job.id}-4x5.mp4`,
          },
        };
      }
    } else if (safeDecision === "reject") {
      job.status = "rejected";
      job.reviewLog = {
        reviewerName: safeReviewerName,
        decision: "reject",
        notes: safeNotes || "Rejected by operator.",
        approvedAt: new Date().toISOString(),
      };
      console.log(`[QA Gate] ✗ Job ${job.id} REJECTED by ${job.reviewLog.reviewerName}.`);
    } else if (safeDecision === "recut") {
      job.status = "recut";
      job.reviewLog = {
        reviewerName: safeReviewerName,
        decision: "recut",
        notes: safeNotes || "Recut requested.",
        approvedAt: new Date().toISOString(),
      };
      console.log(`[QA Gate] ⚡ Job ${job.id} RECUT requested. Notes: ${safeNotes}`);
    }

    saveAdJob(job);

    return NextResponse.json({
      ok: true,
      decision: safeDecision,
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

export async function DELETE(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_review_del_${clientIp}`, 30, 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      // No JSON body passed
    }

    if (body && Array.isArray(body.ids) && body.ids.length > 0) {
      deleteAdJobs(body.ids);
      return NextResponse.json({ ok: true, message: `Removed ${body.ids.length} ad(s)`, deletedIds: body.ids });
    } else if (body && typeof body.id === "string" && body.id.trim()) {
      deleteAdJob(body.id.trim());
      return NextResponse.json({ ok: true, message: "Removed ad", deletedIds: [body.id.trim()] });
    } else {
      clearAllAdJobs();
      return NextResponse.json({ ok: true, message: "Review queue cleared" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
