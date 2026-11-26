import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { requireStudioAdmin } from "@/lib/studioAuth";
import {
  createRawFootage,
  deleteRawFootage,
  getClientById,
  getRawFootageById,
  listClientRawFootage,
} from "@/lib/clientStore";
import {
  BUCKET_RAW,
  deleteStudioObject,
  getLocalStoragePath,
  uploadStudioObject,
} from "@/lib/r2Storage";
import { processRawFootageIngest } from "@/lib/rawFootageIngest";

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

  const rawFootage = await listClientRawFootage(client.id);
  return NextResponse.json({ ok: true, rawFootage });
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
    const contentType = request.headers.get("content-type") || "";

    // Option A: JSON registration after presigned R2 direct upload
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      const storageUrl = String(body.storageUrl || "").trim();
      const filename = String(body.filename || "raw-video.mp4").trim();
      const mime = String(body.mime || "video/mp4").trim();
      const fileSizeBytes = typeof body.fileSizeBytes === "number" ? body.fileSizeBytes : undefined;
      const rawId = String(body.rawId || crypto.randomUUID());

      if (!storageUrl) {
        return NextResponse.json({ ok: false, error: "storageUrl is required" }, { status: 400 });
      }

      const record = await createRawFootage({
        id: rawId,
        clientId: client.id,
        storageUrl,
        filename,
        mime,
        fileSizeBytes,
        status: "raw",
      });

      // Kick off non-blocking transcode + sprite generation
      void processRawFootageIngest(record.id, client.slug);

      return NextResponse.json({ ok: true, rawFootage: [record] }, { status: 201 });
    }

    // Option B: Multipart upload (supports multiple raw MP4/MOV/HEVC files at once)
    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    const singleFile = formData.get("file");
    if (singleFile instanceof File && files.length === 0) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ ok: false, error: "At least one video file is required" }, { status: 400 });
    }

    const createdRecords = [];

    for (const file of files) {
      const rawId = crypto.randomUUID();
      const safeName = (file.name || "raw-footage.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = path.extname(safeName).toLowerCase() || ".mp4";
      const relKey = `clients/${client.slug}/raw/${rawId}${ext}`;
      const { diskPath } = getLocalStoragePath(relKey);

      const buf = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(diskPath, buf);

      const storageUrl = await uploadStudioObject(
        diskPath,
        relKey,
        file.type || "video/mp4",
        BUCKET_RAW
      );

      const record = await createRawFootage({
        id: rawId,
        clientId: client.id,
        storageUrl,
        filename: file.name || safeName,
        mime: file.type || (ext === ".mov" ? "video/quicktime" : "video/mp4"),
        fileSizeBytes: buf.length,
        status: "raw",
      });

      createdRecords.push(record);
      // Kick off async transcode-on-ingest
      void processRawFootageIngest(record.id, client.slug, diskPath);
    }

    return NextResponse.json({ ok: true, rawFootage: createdRecords }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/studio/clients/[id]/footage/raw]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Raw upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const rawId = (searchParams.get("rawId") || "").trim();
  if (!rawId) {
    return NextResponse.json({ ok: false, error: "rawId is required" }, { status: 400 });
  }

  const existing = await getRawFootageById(rawId);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Raw footage not found" }, { status: 404 });
  }

  await deleteRawFootage(rawId);
  await Promise.all([
    deleteStudioObject(existing.storageUrl),
    existing.playableUrl ? deleteStudioObject(existing.playableUrl) : Promise.resolve(),
    existing.spriteUrl ? deleteStudioObject(existing.spriteUrl) : Promise.resolve(),
    existing.thumbnailUrl ? deleteStudioObject(existing.thumbnailUrl) : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true, deleted: true });
}

