"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LayoutGrid } from "lucide-react";
import SegmentedToggle from "@/components/SegmentedToggle";
import type { Subcategory } from "@/lib/types";

const PAGE_SIZE = 10;

/**
 * "People's Top Picks" subcategory grid with the mockup's Businesses/Services
 * toggle (visual only — one shared subcategory tree in the API) and the
 * "Load More Subcategories" reveal.
 */
export default function SubcategoryGrid({
  categoryId,
  categoryName,
  subcategories,
}: {
  categoryId: string;
  categoryName: string;
  subcategories: Subcategory[];
}) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Sort busiest first so "Top Picks" is earned, not arbitrary.
  const sorted = [...subcategories].sort((a, b) => (b.business_count ?? 0) - (a.business_count ?? 0));
  const shown = sorted.slice(0, visible);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{tab === 0 ? "People’s Top Picks" : "Popular picks"}</h1>
          <p className="mt-1 text-xs text-gray-500">
            Most searched &amp; trusted {categoryName ? `in ${categoryName}` : "around you"}
          </p>
        </div>
        <SegmentedToggle value={tab} onChange={setTab} labels={["Businesses", "Services"]} />
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          No subcategories here yet.{" "}
          <Link href={`/listing?category_id=${categoryId}`} className="font-semibold text-brand hover:underline">
            Browse all listings in this category
          </Link>
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
          {shown.map((sub) => (
            <Link
              key={sub.id}
              href={`/listing?category_id=${categoryId}&subcategory_id=${sub.id}`}
              className="flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 py-7 shadow-sm hover:shadow-md"
            >
              <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-50">
                {sub.image ? (
                  <Image src={sub.image} alt="" fill sizes="56px" className="object-contain p-2.5" />
                ) : (
                  <LayoutGrid className="h-6 w-6 text-brand" />
                )}
              </span>
              <span className="text-center">
                <span className="block text-sm font-bold text-ink">{sub.service_name}</span>
                {sub.business_count != null && (
                  <span className="mt-1 block text-xs text-gray-400">{sub.business_count} Listings</span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}

      {visible < sorted.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink shadow-sm hover:shadow-md"
          >
            Load More Subcategories <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
