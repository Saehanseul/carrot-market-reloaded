import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/create-account": true,
  "/sms": true,
  "/login": true,
  "/github/start": true,
  "/github/complete": true
};

export async function middleware(request: NextRequest) {
  console.log("middleware");
  // console.log("cookes", request.cookies.getAll());
  // console.log(cookies());
  const session = await getSession();
  const isPublicPath = publicOnlyUrls[request.nextUrl.pathname];

  if (!session.id) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }
}

export const config = {
  // matcher: ["/", "/profile", "/createa-account", "/user/:path*"]
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] // 왼쪽 파일만 제외하는 정규식
};
