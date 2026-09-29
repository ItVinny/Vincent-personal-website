import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminNavLink } from "./_components/AdminNavLink";
import { ToastProvider } from "./_components/Toast";

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

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#f5f5f7]">
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-[#e5e5ea] bg-white px-4 py-6">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1f] text-[11px] font-semibold text-white">
            VO
          </div>
          <span className="text-[14px] font-medium text-[#1d1d1f]">
            Site Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href}>
              {item.label}
            </AdminNavLink>
          ))}
        </nav>

        <div className="border-t border-[#e5e5ea] pt-4">
          <p className="mb-2 truncate px-2 text-[12px] text-[#86868b]">
            {session.user?.email}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg px-2 py-1.5 text-left text-[13px] text-[#86868b] transition hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <main className="mx-auto max-w-5xl px-8 py-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
