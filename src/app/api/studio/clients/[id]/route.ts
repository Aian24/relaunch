import { NextResponse } from "next/server";
import { requireStudioAdmin } from "@/lib/studioAuth";
import {
  getClientById,
  listApprovedDeliverables,
  listClientApprovedCreators,
  listClientClips,
  listClientMediaAssets,
  listClientRawFootage,
  listReviewLinks,
  setClientApprovedCreators,
  updateClientRecord,
} from "@/lib/clientStore";
import { getAllAdJobs } from "@/lib/adJob";
import { ClientUpdateSchema, slugifyClientName } from "@/types/client";

export const dynamic = "force-dynamic";

export async function GET(
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

    const [approvedCreators, rawFootage, clips, mediaAssets, deliverables, reviewLinks] =
      await Promise.all([
        listClientApprovedCreators(client.id),
        listClientRawFootage(client.id),
        listClientClips(client.id),
        listClientMediaAssets({ clientId: client.id }),
        listApprovedDeliverables(client.id),
        listReviewLinks(client.id),
      ]);

    const allJobs = getAllAdJobs(false);
    const adJobs = allJobs
      .filter(
        (j) =>
          j.clientId === client.id ||
          (!j.clientId && slugifyClientName(j.brandName) === client.slug)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      ok: true,
      client,
      approvedCreators,
      rawFootage,
      clips,
      mediaAssets,
      adJobs,
      deliverables,
      reviewLinks,
    });
  } catch (err: any) {
    console.error("[GET /api/studio/clients/[id]]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load client workspace" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const existing = await getClientById(params.id);
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
    }

    const rawBody = await request.json().catch(() => ({}));
    const parsed = ClientUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid update payload" },
        { status: 400 }
      );
    }

    const updated = await updateClientRecord(existing.id, parsed.data);
    let approvedCreators = await listClientApprovedCreators(existing.id);

    if (Array.isArray(rawBody.approvedCreatorSlugs)) {
      approvedCreators = await setClientApprovedCreators(existing.id, rawBody.approvedCreatorSlugs);
    }

    return NextResponse.json({
      ok: true,
      client: updated,
      approvedCreators,
    });
  } catch (err: any) {
    console.error("[PATCH /api/studio/clients/[id]]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const existing = await getClientById(params.id);
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
    }

    const archived = await updateClientRecord(existing.id, { status: "archived" });
    return NextResponse.json({
      ok: true,
      client: archived,
      message: `${existing.name} archived`,
    });
  } catch (err: any) {
    console.error("[DELETE /api/studio/clients/[id]]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to archive client" },
      { status: 500 }
    );
  }
}

