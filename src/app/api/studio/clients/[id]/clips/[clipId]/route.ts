import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireStudioAdmin } from "@/lib/studioAuth";
import {
  getClientById,
  getClientClipById,
  getRawFootageById,
  updateClientClip,
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; clipId: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const client = await getClientById(params.id);
  if (!client) {
    return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  }

  const existing = await getClientClipById(params.clipId);
  if (!existing || existing.clientId !== client.id) {
    return NextResponse.json({ ok: false, error: "Clip not found" }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const inPoint = body.inPoint !== undefined ? Number(Number(body.inPoint).toFixed(1)) : existing.inPoint;
    const outPoint = body.outPoint !== undefined ? Number(Number(body.outPoint).toFixed(1)) : existing.outPoint;
    const sceneRole = SCENE_ROLES.includes(body.sceneRole)
      ? (body.sceneRole as SceneRole)
      : existing.sceneRole;
    const label = body.label !== undefined ? String(body.label).trim() : existing.label;
    const notes = body.notes !== undefined ? String(body.notes).trim() : existing.notes;

    if (outPoint <= inPoint) {
      return NextResponse.json({ ok: false, error: "outPoint must be greater than inPoint" }, { status: 400 });
    }

    let previewUrl = existing.previewUrl;
    let thumbnailUrl = existing.thumbnailUrl;

    const boundsChanged = inPoint !== existing.inPoint || outPoint !== existing.outPoint;
    if (boundsChanged) {
      const raw = await getRawFootageById(existing.sourceRawId);
      if (raw) {
        const tempDir = path.resolve(process.cwd(), "public", "storage", "tmp", `retrim-${existing.id}`);
        try {
          const localSource = await resolveStorageToLocalFile(
            raw.playableUrl || raw.storageUrl,
            path.join(tempDir, "source.mp4")
          );
          if (localSource && fs.existsSync(localSource)) {
            const previewRel = `clients/${client.slug}/clip-previews/${existing.id}-v${Date.now()}.mp4`;
            const thumbRel = `clients/${client.slug}/clip-previews/${existing.id}-v${Date.now()}.jpg`;
            const previewLocal = getLocalStoragePath(previewRel).diskPath;
            const thumbLocal = getLocalStoragePath(thumbRel).diskPath;
            await renderClipPreview(localSource, inPoint, outPoint, previewLocal, thumbLocal);
            [previewUrl, thumbnailUrl] = await Promise.all([
              uploadStudioObject(previewLocal, previewRel, "video/mp4", BUCKET_RAW),
              uploadStudioObject(thumbLocal, thumbRel, "image/jpeg", BUCKET_THUMBNAILS),
            ]);
          }
        } catch (err) {
          console.warn("[PATCH /clips] Preview regen failed:", err);
        } finally {
          try {
            if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
          } catch {}
        }
      }
    }

    const updated = await updateClientClip(existing.id, {
      inPoint,
      outPoint,
      sceneRole,
      label,
      notes,
      previewUrl,
      thumbnailUrl,
    });

    return NextResponse.json({ ok: true, clip: updated });
  } catch (err: any) {
    console.error("[PATCH /api/studio/clients/[id]/clips/[clipId]]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update clip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; clipId: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const client = await getClientById(params.id);
  if (!client) {
    return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  }

  const existing = await getClientClipById(params.clipId);
  if (!existing || existing.clientId !== client.id) {
    return NextResponse.json({ ok: false, error: "Clip not found" }, { status: 404 });
  }

  await updateClientClip(existing.id, { status: "deleted" });
  return NextResponse.json({ ok: true, deleted: true });
}

