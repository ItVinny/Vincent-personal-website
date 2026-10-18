import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// This is the full auth setup, including the Credentials provider --
// which needs Prisma and bcrypt, both Node-only. This file is used
// by the API route and by Server Components/Actions that call auth().
// middleware.ts does NOT import this file -- see lib/auth.config.ts.
//
// This is the only account the app supports: one admin, the site owner.
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

        // Locked out: reject without even checking the password, and
        // without revealing that the account is locked (vs. just a
        // wrong password) -- that distinction is exactly what an
        // attacker probing for valid emails would want to learn.
        const now = new Date();
        if (user.lockedUntil && user.lockedUntil > now) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          const attempts = user.failedLoginAttempts + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: attempts,
              lockedUntil:
                attempts >= MAX_FAILED_ATTEMPTS
                  ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000)
                  : null,
            },
          });
          return null;
        }

        // Successful login -- clear any prior failed-attempt count.
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
});
