"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfileNavLink() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("accessToken")));
  }, []);

  if (!loggedIn) return null;

  return (
    <Link
      href="/profile"
      aria-label="My Profile"
      title="My Profile"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-surface-soft"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
    </Link>
  );
}
