import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  STUDIO_SESSION_COOKIE,
  verifyClientShareToken,
  verifyStudioSession,
} from "@/lib/studioAuth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Public Studio marketing page & auth endpoints
  if (
    pathname === "/studio" ||
    pathname === "/studio/" ||
    pathname === "/api/studio/auth/login" ||
    pathname === "/api/studio/auth/logout"
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(STUDIO_SESSION_COOKIE)?.value;
  const session = await verifyStudioSession(sessionToken);

  // 2. If user visits /studio/login while already authenticated, send them into the Generator
  if (pathname === "/studio/login") {
    if (session) {
      const target = searchParams.get("callbackUrl");
      const safeTarget =
        target && target.startsWith("/studio/") && target !== "/studio/login"
          ? target
          : "/studio/generate";
      return NextResponse.redirect(new URL(safeTarget, request.url));
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // 3. Support cryptographically signed single-variant Client Review links (?clientView=true&variantId=...&shareToken=...)
  const shareToken =
    searchParams.get("shareToken") || request.headers.get("x-studio-share-token");
  const variantIdParam =
    searchParams.get("variantId") || request.headers.get("x-studio-variant-id");

  if (
    pathname === "/studio/review" &&
    searchParams.get("clientView") === "true" &&
    variantIdParam &&
    shareToken
  ) {
    const validShare = await verifyClientShareToken(variantIdParam, shareToken);
    if (validShare) {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
  }

  if (
    (pathname === "/api/studio/review" ||
      (pathname.startsWith("/api/studio/deliveries/") && pathname.endsWith("/zip"))) &&
    variantIdParam &&
    shareToken
  ) {
    const validShare = await verifyClientShareToken(variantIdParam, shareToken);
    if (validShare) {
      return NextResponse.next();
    }
  }

  // 4. Enforce Studio Portal Session across all protected API routes
  if (pathname.startsWith("/api/studio/")) {
    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized. Please sign in to ReLaunch Studio Portal.",
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 5. Enforce Admin Session across all internal /studio/* admin pages
  if (pathname.startsWith("/studio/")) {
    if (!session) {
      const loginUrl = new URL("/studio/login", request.url);
      const callback = `${pathname}${request.nextUrl.search}`;
      loginUrl.searchParams.set("callbackUrl", callback);
      return NextResponse.redirect(loginUrl);
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*"],
};
