import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLoginPage = url.pathname.startsWith("/admin/auth/login");
  const token = request.cookies.get("access_token")?.value;

  // ❌ Chưa đăng nhập → chặn vào admin
  if (!token && url.pathname.startsWith("/admin") && !isLoginPage) {
    url.pathname = "/admin/auth/login";
    return NextResponse.redirect(url);
  }

  // ❌ Đã đăng nhập → không cho vào trang login
  if (token && isLoginPage) {
    console.log(token);
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Áp dụng proxy cho tất cả route /admin/**
export const config = {
  matcher: ["/admin/:path*"],
};
