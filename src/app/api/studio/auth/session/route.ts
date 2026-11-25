import { NextResponse } from "next/server";
import { requireStudioAdmin } from "@/lib/studioAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireStudioAdmin(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: {
      email: auth.session.sub,
      name: auth.session.name,
      role: auth.session.role,
      exp: auth.session.exp,
    },
  });
}
