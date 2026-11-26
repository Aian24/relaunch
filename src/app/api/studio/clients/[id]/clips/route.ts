import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { requireStudioAdmin } from "@/lib/studioAuth";
import {
  createClientClip,
  getClientById,
  getRawFootageById,
  listClientClips,
} from "@/lib/clientStore";
import { renderClipPreview } from "@/lib/ffmpegUtils";
import {
  BUCKET_RAW,
  BUCKET_THUMBNAILS,
  getLocalStoragePath,
  resolveStorageToLocalFile,
  uploadStudioObject,
} from "@/lib/r2Storage";
import { SCENE_ROLES, type SceneRole } from "@/types/client";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const client = await getClientById(params.id);
  if (!client) {
    return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get("sceneRole") as SceneRole | "all" | null;
  const clips = await listClientClips(client.id, roleParam || "all");
  return NextResponse.json({ ok: true, clips });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const client = await getClientById(params.id);
  if (!client) {
    return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const sourceRawId = String(body.sourceRawId || "").trim();
    const inPoint = Number(Number(body.inPoint ?? 0).toFixed(1));
    const outPoint = Number(Number(body.outPoint ?? 5).toFixed(1));
    const sceneRole = SCENE_ROLES.includes(body.sceneRole) ? (body.sceneRole as SceneRole) : "broll";
    const label = String(body.label || "").trim() || `${sceneRole.toUpperCase()} Clip`;
    const notes = String(body.notes || "").trim();

    if (!sourceRawId) {
      return NextResponse.json({ ok: false, error: "sourceRawId is required" }, { status: 400 });
    }
    if (outPoint <= inPoint) {
      return NextResponse.json({ ok: false, error: "outPoint must be greater than inPoint" }, { status: 400 });
    }

    const raw = await getRawFootageById(sourceRawId);
    if (!raw || raw.clientId !== client.id) {
      return NextResponse.json({ ok: false, error: "Raw footage not found for this client" }, { status: 404 });
    }

    const clipId = crypto.randomUUID();
    let previewUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    // Generate lightweight preview for the clip library (keeps raw file untouched; virtual bounds resolved at final render)
    const sourceUrl = raw.playableUrl || raw.storageUrl;
    const tempDir = path.resolve(process.cwd(), "public", "storage", "tmp", `clip-${clipId}`);
    try {
      const localSource = await resolveStorageToLocalFile(
        sourceUrl,
        path.join(tempDir, "source.mp4")
      );
      if (localSource && fs.existsSync(localSource)) {
        const previewRel = `clients/${client.slug}/clip-previews/${clipId}.mp4`;
        const thumbRel = `clients/${client.slug}/clip-previews/${clipId}.jpg`;
        const previewLocal = getLocalStoragePath(previewRel).diskPath;
        const thumbLocal = getLocalStoragePath(thumbRel).diskPath;

        await renderClipPreview(localSource, inPoint, outPoint, previewLocal, thumbLocal);
        [previewUrl, thumbnailUrl] = await Promise.all([
          uploadStudioObject(previewLocal, previewRel, "video/mp4", BUCKET_RAW),
          uploadStudioObject(thumbLocal, thumbRel, "image/jpeg", BUCKET_THUMBNAILS),
        ]);
      }
    } catch (previewErr) {
      console.warn("[POST /clips] Lightweight preview generation failed (virtual clip still saved):", previewErr);
    } finally {
      try {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }

    const clip = await createClientClip({
      id: clipId,
      clientId: client.id,
      sourceRawId: raw.id,
      inPoint,
      outPoint,
      sceneRole,
      label,
      notes,
      previewUrl: previewUrl || raw.playableUrl || raw.storageUrl,
      thumbnailUrl: thumbnailUrl || raw.thumbnailUrl,
    });

    return NextResponse.json({ ok: true, clip }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/studio/clients/[id]/clips]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to save virtual clip" },
      { status: 500 }
    );
  }
}

