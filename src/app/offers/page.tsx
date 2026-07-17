import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { MapPin } from "lucide-react";
import OfferCard from "@/components/OfferCard";
import { getOffers, getOffersNear } from "@/lib/api";
import { LOCATION_COOKIE, parseLocation } from "@/lib/location";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Offers & Deals" };

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function OffersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const jar = await cookies();
  const location = parseLocation(jar.get(LOCATION_COOKIE)?.value);

  const [allRes, nearbyRes] = await Promise.allSettled([
    getOffers(),
    location ? getOffersNear(location.lat, location.lon) : Promise.resolve([]),
  ]);
  const all = allRes.status === "fulfilled" && ok(allRes.value) ? allRes.value.data ?? [] : [];
  const nearby = nearbyRes.status === "fulfilled" ? nearbyRes.value : [];

  // Offer categories come embedded on each offer — build chips from live data.
  const categoryNames = [...new Set(all.map((o) => o.categoryName).filter(Boolean))];
  const offers = sp.category ? all.filter((o) => o.categoryName === sp.category) : all;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Offers &amp; Deals</h1>
      <p className="mt-1 text-xs text-gray-500">{offers.length} live offers from businesses across the network</p>

      {location && !sp.category && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
            <MapPin className="h-4 w-4 text-brand" /> Near {location.label}
          </h2>
          {nearby.length === 0 ? (
            <p className="mt-2 rounded-2xl bg-white p-5 text-sm text-gray-500 shadow-sm">
              No offers around {location.label} right now — all offers are below.
            </p>
          ) : (
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nearby.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </section>
      )}

      {location && !sp.category && <h2 className="mt-8 text-lg font-bold text-ink">All offers</h2>}

      {categoryNames.length > 0 && (
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <Chip href="/offers" label="All" active={!sp.category} />
          {categoryNames.map((name) => (
            <Chip
              key={name}
              href={`/offers?category=${encodeURIComponent(name)}`}
              label={name}
              active={sp.category === name}
            />
          ))}
        </div>
      )}

      {offers.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-ink">No offers right now</p>
          <p className="mt-1 text-sm text-gray-500">Check back soon — businesses add new deals all the time.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </main>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
        active ? "bg-brand text-white" : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}
