import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Tag } from "lucide-react";
import OfferCard from "@/components/OfferCard";
import { getMyOffers } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "My Offers" };

export default async function MyOffersPage() {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const res = await getMyOffers(token).catch(() => null);
  const offers = res && ok(res) ? res.data ?? [] : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">My Offers</h1>
      <p className="mt-1 text-xs text-gray-500">
        Offers running on your businesses. New offers are added from the N-ME mobile app or admin panel.
      </p>

      {offers.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <Tag className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-base font-semibold text-ink">No offers yet</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </main>
  );
}
