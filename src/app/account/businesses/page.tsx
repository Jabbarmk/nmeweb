import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Plus, Store } from "lucide-react";
import { getMyBusinesses } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "My Businesses" };

export default async function MyBusinessesPage() {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const res = await getMyBusinesses(token).catch(() => null);
  const businesses = res && ok(res) ? res.data ?? [] : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">My Businesses</h1>
        <Link
          href="/account/businesses/add"
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add Business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <Store className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-base font-semibold text-ink">No businesses yet</p>
          <p className="mt-1 text-sm text-gray-500">List your business and start reaching customers.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {businesses.map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
              <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                {b.logo_url ? (
                  <Image src={b.logo_url} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <Store className="m-auto h-6 w-6 text-gray-300" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/business/${b.id}`} className="block truncate text-base font-bold text-ink hover:text-brand">
                  {b.businessName}
                </Link>
                <p className="truncate text-xs text-gray-500">{b.location}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {Number(b.status) === 1 ? "Active" : "Pending approval"}
                </p>
              </div>
              <Link
                href={`/account/businesses/${b.id}/edit`}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
