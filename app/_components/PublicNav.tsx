"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

// Per the MongoDB design system, the marketing top nav is a sticky
// WHITE bar (not dark) -- only the hero band and footer are the
// permanently dark-teal brand signature. Here it toggles white/dark
// along with the rest of the content sections, via Tailwind's
// class-based dark mode.
export function PublicNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#work", label: "Work" },
    { href: "/#about", label: "About" },
    { href: "/#journal", label: "Journal" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[#e1e5e8] bg-white font-mongo dark:border-[#1c2d38] dark:bg-[#001e2b]">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
        <Link
          href="/#home"
          className="text-[17px] font-semibold tracking-[-0.3px] text-[#001e2b] dark:text-white"
        >
          VO
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#5c6c7a] transition hover:text-[#001e2b] dark:text-[#a8b3bc] dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/#contact"
            className="rounded-full bg-[#00ed64] px-5 py-2 text-[14px] font-semibold text-[#001e2b] transition hover:bg-[#00b545]"
          >
            Let&apos;s Talk
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1"
          >
            <span
              className={`h-[1.5px] w-5 bg-[#001e2b] transition-transform dark:bg-white ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-[1.5px] w-5 bg-[#001e2b] transition-opacity dark:bg-white ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[1.5px] w-5 bg-[#001e2b] transition-transform dark:bg-white ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-[#e1e5e8] bg-white px-6 pb-4 dark:border-[#1c2d38] dark:bg-[#001e2b] md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-t border-[#eceff1] py-3 text-[14px] font-medium text-[#3d4f5b] dark:border-white/10 dark:text-[#a8b3bc]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
