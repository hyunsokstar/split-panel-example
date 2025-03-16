// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const authToken = req.cookies.get("auth_token");
    console.log("authToken:", authToken);

    // 로그인 페이지 및 공개 페이지 목록
    const publicRoutes = ["/login", "/register", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

    // 정적 파일 경로 체크 (이미 matcher에서 제외했지만 추가 안전장치)
    const isStaticFile =
        req.nextUrl.pathname.startsWith("/_next") ||
        req.nextUrl.pathname.includes("/favicon.ico");

    // ✅ 로그인하지 않았고, 공개 페이지가 아니면 로그인 페이지로 리디렉트
    if (!authToken && !isPublicRoute && !isStaticFile) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ 로그인한 상태에서 로그인 페이지 접근하면 `/app`으로 이동
    if (authToken && isPublicRoute) {
        return NextResponse.redirect(new URL("/app", req.url));
    }

    return NextResponse.next();
}

// 적용할 경로 설정
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
