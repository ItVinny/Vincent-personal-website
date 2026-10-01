import type { NextAuthConfig } from "next-auth";

// This file must stay free of Node-only imports (Prisma, bcrypt) --
// middleware.ts runs on Vercel's Edge Runtime, which can't execute
// those. It imports ONLY this file, never lib/auth.ts directly.
//
// lib/auth.ts (the full config, with the Credentials provider and
// database lookups) extends this same object for use in Server
// Components, Server Actions, and the API route -- all of which run
// in the regular Node.js runtime where Prisma works fine.
export const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  providers: [], // the real provider lives in lib/auth.ts only
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
