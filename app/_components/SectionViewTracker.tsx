"use client";

import { useEffect, useRef } from "react";
import { trackSectionView } from "@/lib/actions/analytics";

const SESSION_KEY = "vo_session_id";
const SECTION_IDS = ["home", "work", "about", "help", "journal", "contact"];

// Watches each homepage section and fires one "this section was seen"
// event the first time it's meaningfully scrolled into view (40%
// visible), deduped per page load via the ref Set. Only mounted on
// the homepage, since these section ids only exist there.
export function SectionViewTracker() {
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.current.has(entry.target.id)) {
            seen.current.add(entry.target.id);
            trackSectionView({ section: entry.target.id, sessionId: sessionId! });
          }
        });
      },
      { threshold: 0.4 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
