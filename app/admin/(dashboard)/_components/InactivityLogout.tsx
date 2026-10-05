"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useToast } from "./Toast";

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const WARNING_MS = 9 * 60 * 1000; // warn at 9 minutes, 1 minute before logout

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

// Mounted once in the admin layout. Tracks real user activity and
// signs out automatically after a period of inactivity -- a security
// measure for a publicly-reachable admin panel someone might walk
// away from without manually logging out.
export function InactivityLogout() {
  const { showToast } = useToast();
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasWarned = useRef(false);

  useEffect(() => {
    function clearTimers() {
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    }

    function resetTimers() {
      clearTimers();
      hasWarned.current = false;

      warningTimer.current = setTimeout(() => {
        hasWarned.current = true;
        showToast("You'll be signed out in 1 minute due to inactivity.", "error");
      }, WARNING_MS);

      logoutTimer.current = setTimeout(() => {
        signOut({ callbackUrl: "/admin/login" });
      }, TIMEOUT_MS);
    }

    function handleActivity() {
      // Once the warning has fired, any activity still resets the
      // clock -- the warning isn't a point of no return, just a heads
      // up. This also means merely leaving the toast on screen
      // without touching anything still leads to logout as expected.
      resetTimers();
    }

    resetTimers();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
