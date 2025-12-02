import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ロールベースアクセス制御の定義
const protectedRoutes = {
  customer: ["/inquiry", "/profile"],
  vendor: ["/vendor/dashboard", "/vendor/profile", "/vendor/services", "/vendor/inquiries"],
  admin: ["/admin"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証APIルートはスキップ
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 公開ルートはスキップ
  const publicRoutes = ["/", "/login", "/register", "/vendors", "/about", "/contact"];
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // トークン取得
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 未認証の場合、ログインページにリダイレクト
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // アクティブでないユーザーは拒否
  if (!token.isActive) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "inactive");
    return NextResponse.redirect(url);
  }

  const userRole = token.role as string;

  // ロール別のアクセス制御
  // 顧客専用ルート
  if (protectedRoutes.customer.some((route) => pathname.startsWith(route))) {
    if (userRole !== "customer") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 業者専用ルート
  if (protectedRoutes.vendor.some((route) => pathname.startsWith(route))) {
    if (userRole !== "vendor") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 管理者専用ルート
  if (protectedRoutes.admin.some((route) => pathname.startsWith(route))) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
