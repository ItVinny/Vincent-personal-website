"use server";

import { prisma } from "@/lib/prisma";
import { MAX_FAILED_ATTEMPTS } from "@/lib/auth-constants";

// Called by the login page right after a failed sign-in, to show the
// admin a specific, helpful message -- "2 attempts remaining" or
// "locked for 12 more minutes" -- rather than a flat "wrong password"
// every time. Deliberately separate from NextAuth's own authorize()
// flow: Credentials provider errors don't reliably carry custom
// details back to the client across versions, so this reads the same
// lockout fields directly instead of trying to thread that detail
// through next-auth's error handling.
//
// This is a single-admin system (one email, set at seed time), so
// reporting attempt counts for a known email isn't the account-
// enumeration risk it would be on a multi-user system. For an
// unrecognized email, nothing specific is revealed either way.
export async function getLoginAttemptStatus(email: string): Promise<
  | { status: "unknown" }
  | { status: "locked"; minutesRemaining: number }
  | { status: "attempts_remaining"; remaining: number }
> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { status: "unknown" };
  }

  const now = new Date();
  if (user.lockedUntil && user.lockedUntil > now) {
    const minutesRemaining = Math.ceil(
      (user.lockedUntil.getTime() - now.getTime()) / 60000
    );
    return { status: "locked", minutesRemaining };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - user.failedLoginAttempts);
  return { status: "attempts_remaining", remaining };
}
