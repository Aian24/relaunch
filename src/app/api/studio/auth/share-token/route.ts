import { NextResponse } from "next/server";
import { requireStudioAdmin, signClientShareToken } from "@/lib/studioAuth";

export const dynamic = "force-dynamic";

/**
 * Generates an HMAC-signed, variant-scoped token so admins can share a single
 * read-only Client Review link without exposing the Admin portal or other jobs.
 */
export async function GET(request: Request) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const variantId = (searchParams.get("variantId") || "").trim();
  if (!variantId) {
    return NextResponse.json({ ok: false, error: "variantId is required" }, { status: 400 });
  }

  const shareToken = await signClientShareToken(variantId);
  return NextResponse.json({ ok: true, variantId, shareToken });
}
