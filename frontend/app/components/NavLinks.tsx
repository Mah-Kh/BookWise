"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/ai", label: "AI" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="cursor-pointer rounded-lg p-2 text-foreground transition-opacity hover:opacity-60 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        <span className="text-xl leading-none">
          {isMobileMenuOpen ? "×" : "☰"}
        </span>
      </button>

      <nav
        className={`absolute left-0 right-0 top-full border-b border-border bg-background md:static md:block md:border-0 ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4 sm:px-10 md:flex-row md:items-center md:gap-6 md:px-0 md:py-0">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
