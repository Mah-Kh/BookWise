import Link from "next/link";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <div className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Read With Me"
          className="text-lg font-semibold tracking-tight"
        >
          Read With Me
        </Link>

        <NavLinks />
      </div>
    </div>
  );
}
