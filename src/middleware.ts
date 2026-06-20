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

  console.log("[Middleware] 🔍 --------------------------");
  console.log("[Middleware] Path:", pathname);
  console.log("[Middleware] Cookies:", request.cookies.getAll());
  console.log("[Middleware] Access Token:", request.cookies.get("accessToken"));
  console.log("[Middleware] Refresh Token:", request.cookies.get("refreshToken"));
  
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isDashboardPath = pathname.startsWith(DASHBOARD_PREFIX);
  
  // Check for our specific cookie names
  const hasAccessToken = request.cookies.has("accessToken");
  const hasRefreshToken = request.cookies.has("refreshToken");
  const hasSession = hasAccessToken || hasRefreshToken;
  
  console.log("[Middleware] isPublicPath:", isPublicPath);
  console.log("[Middleware] isDashboardPath:", isDashboardPath);
  console.log("[Middleware] hasAccessToken:", hasAccessToken);
  console.log("[Middleware] hasRefreshToken:", hasRefreshToken);
  console.log("[Middleware] hasSession:", hasSession);
  
  let redirectReason = "";

  // Unauthenticated user trying to access dashboard → redirect to login
  if (isDashboardPath && !hasSession) {
    redirectReason = "No accessToken or refreshToken cookie found for dashboard path";
    console.log("[Middleware] Redirect Reason:", redirectReason);
    console.log("[Middleware] 🔄 Redirecting to login");
    console.log("[Middleware] --------------------------");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth pages → redirect to dashboard
  if (isPublicPath && hasSession) {
    redirectReason = "User already has session, redirecting away from public path";
    console.log("[Middleware] Redirect Reason:", redirectReason);
    console.log("[Middleware] 🔄 Redirecting to dashboard");
    console.log("[Middleware] --------------------------");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log("[Middleware] ✅ Allowing request to proceed");
  console.log("[Middleware] --------------------------");
  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
