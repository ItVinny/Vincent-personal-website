import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { MAX_OTP_ATTEMPTS } from "@/lib/auth-constants";

// This is the full auth setup, used by the API route and by Server
// Components/Actions that call auth(). middleware.ts does NOT import
// this file -- see lib/auth.config.ts.
//
// Login is two steps now (see lib/actions/two-factor.ts for step 1,
// the password check + emailed code). This provider's authorize() is
// step 2: it takes {email, code} and checks the CODE, not the
// password -- actually issuing the session only once that's right.
// This is the only account the app supports: one admin, the site owner.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.code) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;

        const now = new Date();

        if (
          !user.twoFactorCodeHash ||
          !user.twoFactorExpiresAt ||
          user.twoFactorExpiresAt < now
        ) {
          // No pending code, or it expired -- reject. The login page
          // sends the admin back to request a fresh one in this case.
          return null;
        }

        if (user.twoFactorAttempts >= MAX_OTP_ATTEMPTS) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.code as string,
          user.twoFactorCodeHash
        );

        if (!isValid) {
          await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorAttempts: user.twoFactorAttempts + 1 },
          });
          return null;
        }

        // Code correct -- consume it (single-use) and sign in.
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorCodeHash: null,
            twoFactorExpiresAt: null,
            twoFactorAttempts: 0,
          },
        });

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
});
