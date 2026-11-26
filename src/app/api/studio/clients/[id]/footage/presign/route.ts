import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { requireStudioAdmin } from "@/lib/studioAuth";
import { getClientById } from "@/lib/clientStore";
import { BUCKET_RAW, createPresignedUploadUrl } from "@/lib/r2Storage";

export const dynamic = "force-dynamic";

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

  const body = await request.json().catch(() => ({}));
  const filename = String(body.filename || "raw-footage.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
  const contentType = String(body.contentType || "video/mp4");
  const rawId = crypto.randomUUID();
  const ext = path.extname(filename) || ".mp4";
  const key = `clients/${client.slug}/raw/${rawId}${ext}`;

  const presigned = await createPresignedUploadUrl(key, contentType, BUCKET_RAW);
  if (!presigned) {
    return NextResponse.json({
      ok: true,
      rawId,
      directUploadSupported: false,
    });
  }

  return NextResponse.json({
    ok: true,
    rawId,
    directUploadSupported: true,
    uploadUrl: presigned.uploadUrl,
    storageUrl: presigned.storageUrl,
    key,
  });
}

