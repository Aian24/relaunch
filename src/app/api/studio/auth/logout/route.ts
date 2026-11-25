import { NextResponse } from "next/server";
import { STUDIO_SESSION_COOKIE } from "@/lib/studioAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true, signedOut: true });
  response.cookies.set(STUDIO_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
