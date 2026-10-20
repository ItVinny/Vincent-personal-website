"use server";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import {
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_MINUTES,
  OTP_LENGTH,
  OTP_EXPIRY_MINUTES,
} from "@/lib/auth-constants";

// This is step 1 of login: check the password, and if it's right,
// email a one-time code instead of signing in directly. Step 2 --
// actually establishing the session -- happens in lib/auth.ts's
// Credentials authorize(), which checks the CODE this generates, not
// the password again. Splitting it this way keeps NextAuth's own
// session-issuing machinery in charge of step 2, while giving this
// action full control over step 1's messaging (attempts remaining,
// lockout) exactly as before 2FA existed.

type RequestResult =
  | { success: true }
  | { success: false; error: string };

function generateCode(): string {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

export async function requestLoginCode(
  email: string,
  password: string
): Promise<RequestResult> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Same generic failure as a wrong password -- never confirm or
    // deny whether an email exists.
    return { success: false, error: "Incorrect email or password." };
  }

  const now = new Date();
  if (user.lockedUntil && user.lockedUntil > now) {
    const minutesRemaining = Math.ceil(
      (user.lockedUntil.getTime() - now.getTime()) / 60000
    );
    return {
      success: false,
      error: `Too many failed attempts. Try again in ${minutesRemaining} minute${minutesRemaining === 1 ? "" : "s"}.`,
    };
  }

  const isValid = await bcrypt.compare(password, user.password);

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

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      return {
        success: false,
        error: `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
      };
    }
    const remaining = MAX_FAILED_ATTEMPTS - attempts;
    return {
      success: false,
      error: `Incorrect email or password. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before lockout.`,
    };
  }

  // Password correct -- generate, store, and email the code.
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      twoFactorCodeHash: codeHash,
      twoFactorExpiresAt: expiresAt,
      twoFactorAttempts: 0,
    },
  });

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    return {
      success: false,
      error: "Sign-in codes aren't configured yet. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${gmailUser}>`,
      to: user.email,
      subject: `Your sign-in code: ${code}`,
      text: `Your sign-in code is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.`,
      html: `
        <p>Your sign-in code is:</p>
        <p style="font-size: 28px; font-weight: 600; letter-spacing: 4px;">${code}</p>
        <p>It expires in ${OTP_EXPIRY_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
      `,
    });
  } catch {
    return {
      success: false,
      error: "Couldn't send the code email. Please try again.",
    };
  }

  return { success: true };
}
