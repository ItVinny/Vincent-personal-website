"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-[14px] transition ${
        isActive
          ? "bg-[#f0f0f2] font-medium text-[#1d1d1f]"
          : "text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
      }`}
    >
      {children}
    </Link>
  );
}
