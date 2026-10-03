"use server";

import { prisma } from "@/lib/prisma";

// These actions are called from public pages, by anyone visiting the
// site -- unlike lib/actions/content.ts and media.ts, they deliberately
// have NO auth check, since that's the whole point. They also never
// throw back to the caller: a failed analytics write should never
// surface as a broken page for a visitor.

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
    // Swallow intentionally -- see note above.
  }
}

export async function trackSectionView(data: {
  section: string;
  sessionId: string;
}) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: "section_view",
        path: "/",
        section: clip(data.section, 50),
        sessionId: clip(data.sessionId, 100) ?? "unknown",
      },
    });
  } catch {
    // Swallow intentionally -- see note above.
  }
}
