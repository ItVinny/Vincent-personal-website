"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

// Public-facing, like lib/actions/analytics.ts -- no auth check, since
// any visitor is meant to call this. Unlike analytics, a failure here
// DOES need to surface to the visitor (they're trying to reach you),
// so this one does not fail silently.

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message should be at least 10 characters.").max(5000),
  // Honeypot: a field real visitors never see or fill in (hidden via
  // CSS in the form), but basic spam bots fill every field blindly.
  // If this has anything in it, silently pretend success and do
  // nothing further -- no need to tip off the bot.
  website: z.string().max(0).optional().or(z.literal("")),
});

type ActionResult = { success: true } | { success: false; error: string };

export async function sendInquiry(data: unknown): Promise<ActionResult> {
  let parsed;
  try {
    parsed = inquirySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? "Invalid input." };
    }
    return { success: false, error: "Invalid input." };
  }

  // Honeypot tripped -- report success without sending anything.
  if (parsed.website) {
    return { success: true };
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    return {
      success: false,
      error: "The inquiry form isn't fully set up yet. Please email directly instead.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    await transporter.sendMail({
      from: `"Portfolio Inquiry" <${gmailUser}>`,
      to: gmailUser,
      replyTo: parsed.email,
      subject: `New inquiry from ${parsed.name}`,
      text: `From: ${parsed.name} <${parsed.email}>\n\n${parsed.message}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(parsed.name)} (${escapeHtml(parsed.email)})</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(parsed.message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong sending your message. Please try emailing directly instead.",
    };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
