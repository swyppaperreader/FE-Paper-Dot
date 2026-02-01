// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // API 라우트, 정적 파일, 메인 페이지는 제외
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/" ||
    pathname.startsWith("/favicon") ||
    // 이미지 파일 확장자 제외
    /\.(svg|png|jpg|jpeg|gif|ico|webp|avif)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("oauth_refresh_token");
  const isLoginPage = pathname.startsWith("/login");

  // 로그인 안 했는데 보호 페이지 접근
  if (!refreshToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 로그인 했는데 로그인 페이지 접근
  if (refreshToken && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
