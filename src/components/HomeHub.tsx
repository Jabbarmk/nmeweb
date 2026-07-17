"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import SegmentedToggle from "./SegmentedToggle";
import { curatedBusiness, curatedServices, serviceCategoryIds } from "@/lib/static-content";
import type { Category } from "@/lib/types";

/**
 * The big white hub card on Home: Business/Services toggle, category icon
 * tiles (live from getService, split into the two tabs via the curated
 * serviceCategoryIds list — the API itself has no type flag), the two promo
 * tiles, and the 2×2 curated grid (static placeholders, see static-content.ts).
 */
export default function HomeHub({ categories }: { categories: Category[] }) {
  const [tab, setTab] = useState<0 | 1>(0);
  const curated = tab === 0 ? curatedBusiness : curatedServices;
  const serviceIds = new Set(serviceCategoryIds);
  const tabCategories = categories.filter((c) => serviceIds.has(c.id) === (tab === 1));
  const tiles = tabCategories.slice(0, 7);

  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 lg:px-6">
      <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex justify-center">
          <SegmentedToggle value={tab} onChange={setTab} />
        </div>

        {/* Category icon tiles — live data. Same tree on both tabs (single API). */}
        <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {tiles.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-gray-50 px-2 py-4 hover:bg-blue-50"
            >
              <span className="relative h-9 w-9 overflow-hidden rounded-lg">
                {cat.image ? (
                  <Image src={cat.image} alt="" fill sizes="36px" className="object-contain" />
                ) : (
                  <LayoutGrid className="h-9 w-9 text-brand" />
                )}
              </span>
              <span className="line-clamp-2 text-center text-[11px] font-semibold text-gray-700 group-hover:text-brand">
                {cat.service_name}
              </span>
            </Link>
          ))}
          <Link
            href={`/categories?type=${tab === 0 ? "business" : "services"}`}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-gray-50 px-2 py-4 hover:bg-blue-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm">
              <LayoutGrid className="h-4.5 w-4.5" />
            </span>
            <span className="text-[11px] font-semibold text-gray-700 group-hover:text-brand">More</span>
          </Link>
        </div>

        {/* Promo tiles → live sections of the app. Artwork (person popping out
            of the pill) extracted from the design mockup — replace the PNGs in
            public/promo/ with higher-res exports to sharpen them. */}
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <PromoTile href="/jobs" img="/promo/explore-jobs.png" alt="Explore Jobs — browse job categories" />
          <PromoTile href="/offers" img="/promo/deals-discounts.png" alt="Deals & Discounts — shop exclusive deals" />
        </div>

      </div>

      {/* Curated 2×2 grid — static placeholder tiles linking into real search.
          Folder-tab cards on the gray page background, per the design. */}
      <div className="mt-8 grid gap-x-6 gap-y-8 lg:grid-cols-2">
        {curated.map((section) => (
          <div key={section.title} className="relative pt-8">
            <span className="absolute left-0 top-0 z-10 inline-flex items-center rounded-[1.6rem] bg-white px-7 py-4 text-base font-bold text-ink shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
              {section.title}
            </span>
            <div className="relative rounded-[2.5rem] bg-white px-6 pb-7 pt-20 shadow-sm">
              <Link
                href={`/listing?term=${encodeURIComponent(section.tiles[0]?.term ?? "")}`}
                className="absolute right-6 top-6 rounded-[1.1rem] bg-indigo-100 px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-indigo-200"
              >
                View All
              </Link>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {section.tiles.map((tile) => (
                  <Link key={tile.label} href={`/listing?term=${encodeURIComponent(tile.term)}`} className="group">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-gray-100">
                      <Image
                        src={tile.img}
                        alt={tile.label}
                        fill
                        sizes="(min-width: 1024px) 200px, 33vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        unoptimized
                      />
                    </span>
                    <span className="mt-3 block text-center text-sm font-semibold text-ink sm:text-base">
                      {tile.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PromoTile({ href, img, alt }: { href: string; img: string; alt: string }) {
  return (
    <Link href={href} className="group block">
      <Image
        src={img}
        alt={alt}
        width={700}
        height={300}
        className="h-auto w-full transition-transform duration-200 group-hover:scale-[1.02]"
      />
    </Link>
  );
}
