import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLoginPage = url.pathname.startsWith("/admin/auth");
  const accessToken = request.cookies.get("access_token")?.value;

  // Nếu chưa đăng nhập, redirect về trang login
  if (!accessToken && url.pathname.startsWith("/admin") && !isLoginPage) {
    url.pathname = "/admin/auth/login";
    return NextResponse.redirect(url);
  }

  // Nếu đã đăng nhập, không cho vào trang login
  if (accessToken && isLoginPage) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
