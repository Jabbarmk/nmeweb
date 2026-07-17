import Link from "next/link";
import OfferCard from "./OfferCard";
import type { Offer } from "@/lib/types";

/** "Offers & Deals" row — live data from getOffer. Hidden when empty. */
export default function OffersStrip({ offers, title = "Offers & Deals" }: { offers: Offer[]; title?: string }) {
  if (offers.length === 0) return null;
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <Link href="/offers" className="text-xs font-semibold text-brand hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {offers.slice(0, 4).map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
