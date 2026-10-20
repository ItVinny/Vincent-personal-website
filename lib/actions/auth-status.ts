"use server";

import { prisma } from "@/lib/prisma";
import { MAX_OTP_ATTEMPTS } from "@/lib/auth-constants";

// Called by the login page after a failed code entry, to show a
// specific message ("2 attempts remaining" / "code expired, request a
// new one") instead of a flat "incorrect code" every time. Separate
// from NextAuth's own authorize() flow for the same reason noted in
// lib/auth.ts -- Credentials provider errors don't reliably carry
// custom details back to the client.
export async function getOtpStatus(email: string): Promise<
  | { status: "no_pending_code" }
  | { status: "expired" }
  | { status: "attempts_remaining"; remaining: number }
> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.twoFactorCodeHash || !user.twoFactorExpiresAt) {
    return { status: "no_pending_code" };
  }

  if (user.twoFactorExpiresAt < new Date()) {
    return { status: "expired" };
  }

  const remaining = Math.max(0, MAX_OTP_ATTEMPTS - user.twoFactorAttempts);
  return { status: "attempts_remaining", remaining };
}
