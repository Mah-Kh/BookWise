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
        className="md:hidden cursor-pointer"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {`${isMobileMenuOpen ? "×" : "☰"}`}
      </button>
      <nav>
        <ul
          className={`md:flex md:flex-row gap-6 ${!isMobileMenuOpen ? "hidden" : "flex flex-col"}`}
        >
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-zinc-950"
                      : "text-zinc-600 hover:text-zinc-950"
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
