import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { ToastProvider } from "./_components/Toast";
import { AdminShell } from "./_components/AdminShell";

// Server-side belt-and-braces check alongside middleware.ts. Middleware
// blocks the request before it renders; this catches the edge case of
// a session expiring mid-visit. This layout lives in the (dashboard)
// route group, so /admin/login (a sibling, outside the group) is never
// wrapped by it — that's what avoids a redirect loop on the login page.
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/content", label: "Content" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/settings", label: "Settings" },
  ];

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <ToastProvider>
      <AdminShell
        navItems={navItems}
        email={session.user?.email ?? ""}
        onSignOut={handleSignOut}
      >
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
