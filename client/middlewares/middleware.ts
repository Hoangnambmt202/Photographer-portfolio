import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Áp dụng middleware cho tất cả route /admin (trừ /admin/auth/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/auth/login")) {
    const token = req.cookies.get("access_token");

    // Nếu chưa có cookie => redirect về /admin/auth/login
    if (!token) {
      const loginUrl = new URL("/admin/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Áp dụng middleware cho tất cả route /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
