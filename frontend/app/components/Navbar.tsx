import Link from "next/link";
import NavLinks from "./NavLinks";
import ProfileNavLink from "./ProfileNavLink";

export default function Navbar() {
  return (
    <div className="relative border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
        <Link
          href="/"
          aria-label="Read With Me"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Read With Me
        </Link>

        <div className="flex items-center gap-4">
          <NavLinks />
          <ProfileNavLink />
        </div>
      </div>
    </div>
  );
}
