import { NextResponse } from "next/server";
import path from "path";
import { requireStudioAdmin } from "@/lib/studioAuth";
import { getClientById, updateClientRecord } from "@/lib/clientStore";
import { BUCKET_THUMBNAILS, uploadStudioBuffer } from "@/lib/r2Storage";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const client = await getClientById(params.id);
    if (!client) {
      return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Logo file is required" }, { status: 400 });
    }

    const ext = path.extname(file.name || ".png").toLowerCase() || ".png";
    if (![".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(ext)) {
      return NextResponse.json(
        { ok: false, error: "Unsupported logo format. Use PNG, JPG, WEBP, or SVG." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `clients/${client.slug}/logo-${Date.now()}${ext}`;
    const logoUrl = await uploadStudioBuffer(buffer, key, file.type || "image/png", BUCKET_THUMBNAILS);

    const updated = await updateClientRecord(client.id, { logoUrl });
    return NextResponse.json({ ok: true, logoUrl, client: updated });
  } catch (err: any) {
    console.error("[POST /api/studio/clients/[id]/logo]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to upload logo" },
      { status: 500 }
    );
  }
}

