import { NextResponse } from "next/server";
import {
  getDeletedAdJobs,
  restoreAdJobs,
  restoreAllAdJobs,
  permanentlyDeleteAdJobs,
  clearAllDeletedAdJobs,
} from "@/lib/adJob";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/**
 * ReLaunch Studio — Deleted Ads Recovery & Purge API
 * Endpoint: /api/studio/deleted
 *
 * GET: Lists all deleted / trashed ads awaiting recovery or purge
 * POST: Restores selected or all deleted ads back to the active QA Review Queue
 * DELETE: Permanently erases selected ads or empties the entire trash queue
 */

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_deleted_get_${clientIp}`, 60, 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const deletedJobs = getDeletedAdJobs();

  const variants = deletedJobs.map((job) => ({
    id: job.id,
    clientName: job.brandName,
    batchName: "Trash Queue",
    angle: job.creativeAngle,
    framework: `${job.hookType ? job.hookType.toUpperCase() : "AD"} Hook`,
    targetPersona: "Target Consumer",
    hookText: job.hookText,
    video9x16: job.variants?.v9x16 || "",
    video1x1: job.variants?.v1x1 || "",
    video4x5: job.variants?.v4x5 || "",
    thumbnail: job.variants?.thumbnail || "/images/howitworksstudio.jpg",
    status: "deleted",
    scriptBody: job.script?.body || "",
    ctaText: job.script?.ctaText || "",
    createdAt: job.createdAt,
    deletedAt: job.deletedAt || job.updatedAt,
    clientFootageSource: job.clientFootageUrl,
    creatorActor: job.creator ? `${job.creator.name} (${job.creator.handle || "@creator"})` : "Creator Partner",
    creatorHookClip: job.creator?.hookClipUrl || "",
    voiceoverUrl: job.script?.voiceoverUrl || "",
    wordTimestamps: job.script?.wordTimestamps || [],
    aiSceneUrl: job.aiScene?.clipUrl || job.variants?.v9x16,
    complianceChecks: job.complianceChecks,
  }));

  return NextResponse.json({
    ok: true,
    count: variants.length,
    variants,
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_deleted_post_${clientIp}`, 30, 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const action = String(body.action || "restore").toLowerCase();

    if (action === "restore_all") {
      restoreAllAdJobs();
      return NextResponse.json({ ok: true, message: "All deleted ads restored to Review Queue" });
    }

    const ids = Array.isArray(body.ids)
      ? body.ids
      : (typeof body.id === "string" && body.id.trim() ? [body.id.trim()] : []);

    if (ids.length === 0) {
      return NextResponse.json({ error: "No ad IDs specified for restoration" }, { status: 400 });
    }

    restoreAdJobs(ids);
    return NextResponse.json({
      ok: true,
      message: `Restored ${ids.length} ad(s) to Review Queue`,
      restoredIds: ids,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process restore action" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit(`studio_deleted_del_${clientIp}`, 30, 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      // Empty body -> empty entire trash
    }

    if (body && Array.isArray(body.ids) && body.ids.length > 0) {
      permanentlyDeleteAdJobs(body.ids);
      return NextResponse.json({
        ok: true,
        message: `Permanently purged ${body.ids.length} ad(s)`,
        purgedIds: body.ids,
      });
    } else if (body && typeof body.id === "string" && body.id.trim()) {
      permanentlyDeleteAdJobs([body.id.trim()]);
      return NextResponse.json({
        ok: true,
        message: "Permanently purged ad",
        purgedIds: [body.id.trim()],
      });
    } else {
      clearAllDeletedAdJobs();
      return NextResponse.json({ ok: true, message: "Trash emptied permanently" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to purge trash" }, { status: 500 });
  }
}

