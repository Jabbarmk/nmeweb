import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import Pagination from "@/components/Pagination";
import OffersStrip from "@/components/OffersStrip";
import TrendingSearches from "@/components/TrendingSearches";
import { getCategories, getOffers, listBusinesses } from "@/lib/api";
import { ok } from "@/lib/types";

interface Props {
  searchParams: Promise<{
    category_id?: string;
    subcategory_id?: string;
    term?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = { title: "Businesses & Services" };

export default async function ListingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [listRes, catsRes, offersRes] = await Promise.allSettled([
    listBusinesses({ category_id: sp.category_id, subcategory_id: sp.subcategory_id, term: sp.term, page }),
    getCategories(),
    getOffers(),
  ]);

  const list = listRes.status === "fulfilled" && ok(listRes.value) ? listRes.value : null;
  const businesses = list?.data ?? [];
  const categories = catsRes.status === "fulfilled" && ok(catsRes.value) ? catsRes.value.data ?? [] : [];
  const offers = offersRes.status === "fulfilled" && ok(offersRes.value) ? offersRes.value.data ?? [] : [];

  const categoryName = sp.category_id ? categories.find((c) => c.id === sp.category_id)?.service_name : undefined;
  const heading = sp.term
    ? `Results for “${sp.term}”`
    : categoryName
      ? `Popular ${categoryName} listings`
      : "All Businesses & Services";

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">{heading}</h1>
            <p className="mt-1 text-xs text-gray-500">
              {list ? `${list.total.toLocaleString("en-IN")} Results Found` : "Could not load results — please retry."}
            </p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Filters <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 flex items-start gap-6">
          <div className="min-w-0 flex-1">
            {businesses.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
                <p className="text-base font-semibold text-ink">No listings found</p>
                <p className="mt-1 text-sm text-gray-500">Try a different search term or browse by category.</p>
                <Link href="/search" className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
                  Explore categories
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            )}

            {list && (
              <Pagination
                page={page}
                totalPages={list.total_pages}
                basePath="/listing"
                params={{ category_id: sp.category_id, subcategory_id: sp.subcategory_id, term: sp.term }}
              />
            )}
          </div>

          {/* Lead-gen card from the mockup's right rail */}
          <aside className="sticky top-20 hidden w-80 shrink-0 xl:block">
            <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                ❓
              </span>
              <h2 className="mt-3 text-lg font-bold text-ink">Check out top businesses</h2>
              <p className="mt-1 text-xs text-gray-500">
                Own a business? Get listed and reach thousands of customers directly.
              </p>
              <Link
                href="/account/businesses/add"
                className="mt-5 block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Register your Business
              </Link>
              <p className="mt-3 text-[10px] text-gray-400">
                By submitting, you agree to our Terms of Use and Privacy Policy.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <OffersStrip offers={offers} />
      <div className="mt-10">
        <TrendingSearches />
      </div>
    </main>
  );
}
