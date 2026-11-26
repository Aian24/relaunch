import { NextResponse } from "next/server";
import { requireStudioAdmin, signClientShareToken } from "@/lib/studioAuth";
import {
  createReviewLinkRecord,
  getClientById,
  listReviewLinks,
  revokeReviewLinkRecord,
} from "@/lib/clientStore";
import { getAdJobById } from "@/lib/adJob";

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

  const links = await listReviewLinks(client.id);
  return NextResponse.json({ ok: true, links });
}

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

    const body = await request.json().catch(() => ({}));
    const adId = String(body.adId || "").trim();
    const label = String(body.label || "").trim();

    if (!adId) {
      return NextResponse.json({ ok: false, error: "adId is required" }, { status: 400 });
    }

    const job = getAdJobById(adId);
    if (!job) {
      return NextResponse.json({ ok: false, error: "Ad job not found" }, { status: 404 });
    }

    const shareToken = await signClientShareToken(adId);
    const link = await createReviewLinkRecord({
      clientId: client.id,
      adId,
      label: label || `${client.name} — ${job.creativeAngle}`,
      shareToken,
      createdBy: auth.session.sub,
    });

    return NextResponse.json({ ok: true, link }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/studio/clients/[id]/review-links]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create review link" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const linkId = (searchParams.get("linkId") || "").trim();
  if (!linkId) {
    return NextResponse.json({ ok: false, error: "linkId is required" }, { status: 400 });
  }

  const revoked = await revokeReviewLinkRecord(linkId);
  if (!revoked) {
    return NextResponse.json({ ok: false, error: "Review link not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, revoked: true });
}
