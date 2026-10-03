"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminNavLink } from "./AdminNavLink";

type NavItem = { href: string; label: string };

export function AdminShell({
  navItems,
  email,
  onSignOut,
  children,
}: {
  navItems: NavItem[];
  email: string;
  onSignOut: () => Promise<void>;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer automatically whenever navigation happens,
  // so tapping a link doesn't leave the overlay sitting open behind it.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
      {/* Mobile top bar -- hidden on desktop */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e5e5ea] bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1f] text-[11px] font-semibold text-white">
            VO
          </div>
          <span className="text-[14px] font-medium text-[#1d1d1f]">
            Site Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f5f5f7]"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1d1d1f" strokeWidth="1.8">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: fixed on desktop, slide-in drawer on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 transform flex-col border-r border-[#e5e5ea] bg-white px-4 py-6 transition-transform duration-200 md:static md:z-auto md:w-60 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1f] text-[11px] font-semibold text-white">
              VO
            </div>
            <span className="text-[14px] font-medium text-[#1d1d1f]">
              Site Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#f5f5f7] md:hidden"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1d1d1f" strokeWidth="1.8">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
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
            {email}
          </p>
          <form action={onSignOut}>
            <button
              type="submit"
              className="w-full rounded-lg px-2 py-1.5 text-left text-[13px] text-[#86868b] transition hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <main className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
