import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Client-side auth check handles route protection via (app)/layout.tsx
// This middleware handles basic redirects only
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root redirects to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
