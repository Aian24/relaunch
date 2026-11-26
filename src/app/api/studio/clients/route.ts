import { NextResponse } from "next/server";
import { requireStudioAdmin } from "@/lib/studioAuth";
import { createClientRecord, listClients, setClientApprovedCreators } from "@/lib/clientStore";
import { ClientCreateSchema } from "@/types/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const space = searchParams.get("space"); // "clients" | "samples" | "all"
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";
  const includeSamples = space === "all" || searchParams.get("includeSamples") === "true";
  const onlySamples = space === "samples";

  try {
    const clients = await listClients({
      includeSamples,
      onlySamples,
      status,
      search,
    });
    return NextResponse.json({
      ok: true,
      clients,
      count: clients.length,
    });
  } catch (err: any) {
    console.error("[GET /api/studio/clients]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parsed = ClientCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid client payload" },
        { status: 400 }
      );
    }

    const client = await createClientRecord(parsed.data);

    if (Array.isArray(rawBody.approvedCreatorSlugs) && rawBody.approvedCreatorSlugs.length > 0) {
      await setClientApprovedCreators(client.id, rawBody.approvedCreatorSlugs);
    }

    return NextResponse.json({ ok: true, client }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/studio/clients]", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create client" },
      { status: 500 }
    );
  }
}

