"use client";

import { useState } from "react";
import Link from "next/link";

export function PublicNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#journal", label: "Journal" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 h-11 bg-black">
      <div className="mx-auto flex h-11 max-w-[1120px] items-center justify-between px-6">
        <Link
          href="#home"
          className="font-display text-[15px] font-semibold tracking-[-0.01em] text-white"
        >
          VO
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[12px] text-white/85 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="#contact"
            className="rounded-full bg-[#0066cc] px-4 py-1.5 text-[12px] text-white transition hover:bg-[#0071e3]"
          >
            Availability
          </a>
        </div>

        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-7 w-7 flex-col justify-center gap-1 md:hidden"
        >
          <span
            className={`h-[1.5px] bg-white transition-transform ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
          />
          <span className={`h-[1.5px] bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-[1.5px] bg-white transition-transform ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col bg-black px-6 pb-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-t border-white/10 py-2.5 text-[14px] text-white/85"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
