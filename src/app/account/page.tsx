import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, ChevronRight, FileText, LogOut, Store, Tag } from "lucide-react";
import { logout } from "@/app/actions";
import { getSessionUser } from "@/lib/auth";
import { initials } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account" };

const links = [
  { href: "/account/businesses", label: "My Businesses", desc: "Manage listings, photos and details", icon: Store },
  { href: "/account/jobs", label: "My Jobs", desc: "Jobs you've posted", icon: Briefcase },
  { href: "/account/applied", label: "Applied Jobs", desc: "Applications you've submitted", icon: FileText },
  { href: "/account/offers", label: "My Offers", desc: "Offers running on your businesses", icon: Tag },
];

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/account/login");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-brand">
          {initials(user.fullName || user.email)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-ink">{user.fullName || "N-ME User"}</h1>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {links.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-ink">{label}</span>
              <span className="block truncate text-xs text-gray-500">{desc}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
          </Link>
        ))}
      </div>

      <form action={logout} className="mt-8">
        <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-50">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </form>
    </main>
  );
}
