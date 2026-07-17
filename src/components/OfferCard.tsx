import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import type { Offer } from "@/lib/types";
import { telLink, validImageUrl } from "@/lib/utils";

/** Coupon-style card in the "Offers & Deals" strips, backed by getOffer. */
export default function OfferCard({ offer }: { offer: Offer }) {
  const image = validImageUrl(offer.businessImage) ?? validImageUrl(offer.image);
  return (
    <article className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-brand/10" aria-hidden />
      <div className="flex items-start gap-3">
        <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {image && <Image src={image} alt="" fill sizes="44px" className="object-cover" />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            {offer.businessName}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-ink">{offer.description || "Special offer"}</h3>
        </div>
      </div>
      {offer.location && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{offer.location}</span>
        </p>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-2.5">
        <span className="text-[10px] text-gray-400">
          {offer.ToDate ? `Valid until ${offer.ToDate}` : offer.service_name}
        </span>
        {offer.mobileNumber && (
          <a
            href={telLink(offer.mobileNumber)}
            className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-1 text-[10px] font-bold text-brand hover:bg-brand/20"
          >
            <Phone className="h-3 w-3" /> Call
          </a>
        )}
      </div>
    </article>
  );
}
