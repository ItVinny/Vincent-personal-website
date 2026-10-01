import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

// This is the full auth setup, including the Credentials provider --
// which needs Prisma and bcrypt, both Node-only. This file is used
// by the API route (app/api/auth/[...nextauth]/route.ts) and by
// Server Components/Actions that call auth() -- all Node runtime.
//
// middleware.ts does NOT import this file. It uses lib/auth.config.ts
// directly, which has no Node-only dependencies and can run on the
// Edge Runtime. See auth.config.ts for why that split matters.
//
// This is the only account the app supports: one admin, the site owner.
// There is no sign-up flow, and none should be added — the seed script
// is the only way a user row gets created.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
});
