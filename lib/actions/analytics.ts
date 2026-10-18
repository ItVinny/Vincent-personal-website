"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

function clip(value: string | null | undefined, max: number) {
  if (!value) return null;
  return value.slice(0, max);
}

export async function trackPageview(data: {
  path: string;
  referrer: string | null;
  device: string;
  sessionId: string;
}) {
  try {
    // Generous limit -- real visitors trigger this once per page
    // load; this just stops a script from flooding the events table.
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    if (isRateLimited(`pageview:${ip}`, 60, 60 * 1000)) return;

    await prisma.analyticsEvent.create({
      data: {
        type: "pageview",
        path: clip(data.path, 200) ?? "/",
        referrer: clip(data.referrer, 300),
        device: clip(data.device, 20),
        sessionId: clip(data.sessionId, 100) ?? "unknown",
      },
    });
  } catch {
    // Analytics failures should never break the visitor's experience.
  }
}

export async function trackSectionView(data: {
  section: string;
  sessionId: string;
}) {
  try {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    if (isRateLimited(`section:${ip}`, 60, 60 * 1000)) return;

    await prisma.analyticsEvent.create({
      data: {
        type: "section_view",
        path: "/",
        section: clip(data.section, 50),
        sessionId: clip(data.sessionId, 100) ?? "unknown",
      },
    });
  } catch {
    // Analytics failures should never break the visitor's experience.
  }
}
