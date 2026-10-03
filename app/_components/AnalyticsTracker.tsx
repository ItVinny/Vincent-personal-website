"use client";

import { useEffect } from "react";
import { trackPageview } from "@/lib/actions/analytics";

const SESSION_KEY = "vo_session_id";

function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function classifyDevice() {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

// Mounted once on every public page (homepage, journal articles).
// Renders nothing -- it's purely a side-effect component that fires
// one pageview event on mount. Never mounted inside /admin, so admin
// visits are never counted as site traffic.
export function AnalyticsTracker({ path }: { path: string }) {
  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    trackPageview({
      path,
      referrer: document.referrer || null,
      device: classifyDevice(),
      sessionId,
    });
    // Only re-fire if the path itself changes (e.g. client-side nav
    // between articles); mount-time values for device/referrer are
    // what matter, not a dependency on them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return null;
}
