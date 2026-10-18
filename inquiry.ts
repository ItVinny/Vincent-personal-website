"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message should be at least 10 characters.").max(5000),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

type ActionResult = { success: true } | { success: false; error: string };

export async function sendInquiry(data: unknown): Promise<ActionResult> {
  // 5 submissions per 10 minutes per visitor -- generous for a real
  // person filling out a contact form, tight against a script.
  const reqHeaders = await headers();
  const ip = getClientIp(reqHeaders);
  if (isRateLimited(`inquiry:${ip}`, 5, 10 * 60 * 1000)) {
    return {
      success: false,
      error: "Too many messages sent recently. Please try again in a few minutes.",
    };
  }

  let parsed;
  try {
    parsed = inquirySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? "Invalid input." };
    }
    return { success: false, error: "Invalid input." };
  }

  if (parsed.website) {
    // Honeypot tripped -- report success without sending anything.
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
