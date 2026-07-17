import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { Bell, Briefcase, Home, Tag, User } from "lucide-react";
import Logo from "./Logo";
import HeaderSearch from "./HeaderSearch";
import LocationPicker from "./LocationPicker";
import type { SessionUser } from "@/lib/auth";
import { LOCATION_COOKIE, parseLocation } from "@/lib/location";
import { initials } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/offers", label: "Offers", icon: Tag },
];

export default async function Header({ user }: { user: SessionUser | null }) {
  const jar = await cookies();
  const location = parseLocation(jar.get(LOCATION_COOKIE)?.value);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 lg:px-6">
        <Logo />

        <LocationPicker initial={location} />

        <div className="hidden flex-1 md:block">
          <HeaderSearch />
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-brand"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Notifications"
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 sm:flex"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        <Link
          href="/account/businesses/add"
          className="hidden rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark lg:block"
        >
          Register your Business
        </Link>

        <Link
          href="/account"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold text-gray-600 ring-1 ring-gray-200"
        >
          {user?.userImage ? (
            <Image src={user.userImage} alt="" width={40} height={40} className="h-full w-full object-cover" />
          ) : user ? (
            initials(user.fullName || user.email)
          ) : (
            <User className="h-4.5 w-4.5" />
          )}
        </Link>
      </div>
    </header>
  );
}
