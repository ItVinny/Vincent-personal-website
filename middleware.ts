import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Deliberately builds its own lightweight NextAuth instance from the
// edge-safe config only -- see lib/auth.config.ts. Importing the full
// lib/auth.ts here (with its Prisma/bcrypt-based Credentials provider)
// is what silently broke route protection before: Vercel's Edge
// Runtime can't run those, and middleware failed open instead of
// throwing a visible error.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
