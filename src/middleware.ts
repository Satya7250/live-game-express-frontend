import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// Protected path prefix
const DASHBOARD_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const isDashboardPath = pathname.startsWith(DASHBOARD_PREFIX);

  // The backend sets an httpOnly refresh-token cookie on login.
  // We use its presence as a lightweight session indicator.
  // Actual token validation still happens on the Express backend per-request.
  // Adjust "refreshToken" to match the exact cookie name your backend sets.
  const hasSession =
    request.cookies.has("refreshToken") ||
    request.cookies.has("refresh_token");

  // Unauthenticated user trying to access dashboard → redirect to login
  if (isDashboardPath && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth pages → redirect to dashboard
  if (isPublicPath && hasSession) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};