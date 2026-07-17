import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { getCategories } from "@/lib/api";
import { serviceCategoryIds } from "@/lib/static-content";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "All Categories" };

interface Props {
  searchParams: Promise<{ type?: string }>;
}

/** Full category directory, split into Business / Services via the same
 *  curated serviceCategoryIds list the home hub tabs use. */
export default async function CategoriesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const type = sp.type === "services" ? "services" : "business";

  const res = await getCategories().catch(() => null);
  const all = res && ok(res) ? res.data ?? [] : [];

  const serviceIds = new Set(serviceCategoryIds);
  const categories = all.filter((c) => serviceIds.has(c.id) === (type === "services"));

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">
        {type === "services" ? "Service Categories" : "Business Categories"}
      </h1>
      <p className="mt-1 text-xs text-gray-500">{categories.length} categories</p>

      <div className="mt-4 inline-flex rounded-full bg-white p-1 shadow-sm">
        <Link
          href="/categories?type=business"
          className={`rounded-full px-5 py-2 text-sm font-semibold ${
            type === "business" ? "bg-brand text-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Business
        </Link>
        <Link
          href="/categories?type=services"
          className={`rounded-full px-5 py-2 text-sm font-semibold ${
            type === "services" ? "bg-brand text-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Services
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-white p-12 text-center text-sm text-gray-500 shadow-sm">
          Could not load categories — please try again.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 py-7 shadow-sm hover:shadow-md"
            >
              <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-50">
                {cat.image ? (
                  <Image src={cat.image} alt="" fill sizes="56px" className="object-contain p-2.5" />
                ) : (
                  <LayoutGrid className="h-6 w-6 text-brand" />
                )}
              </span>
              <span className="text-center">
                <span className="block text-sm font-bold text-ink">{cat.service_name}</span>
                <span className="mt-1 block text-xs text-gray-400">{cat.business_count} Listings</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
