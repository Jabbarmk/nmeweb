import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Store } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import type { BusinessListItem } from "@/lib/types";
import { telLink, validImageUrl } from "@/lib/utils";

/**
 * Listing card. Deliberately omits the mockup's rating / verified / distance
 * elements — list_businesses doesn't return them (confirmed on production).
 * They belong on the detail page, where get_reviews provides real ratings.
 */
export default function BusinessCard({ business }: { business: BusinessListItem }) {
  const image = validImageUrl(business.image);
  return (
    <article className="rounded-3xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <Link
          href={`/business/${business.id}`}
          className="relative block h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-36 sm:w-44"
        >
          {image ? (
            <Image
              src={image}
              alt={business.businessName}
              fill
              sizes="(min-width: 640px) 176px, 112px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-gray-300">
              <Store className="h-8 w-8" />
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/business/${business.id}`} className="block">
            <h3 className="truncate text-base font-bold text-ink hover:text-brand sm:text-lg">
              {business.businessName}
            </h3>
          </Link>
          {business.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{business.location}</span>
            </p>
          )}
          {business.dealWith && (
            <p className="mt-1.5 line-clamp-2 text-xs text-gray-600 sm:text-sm">{business.dealWith}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[business.service_name, business.subServiceName].filter(Boolean).map((chip) => (
              <span key={chip} className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
            <CardActions business={business} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 sm:hidden">
        <CardActions business={business} />
      </div>
    </article>
  );
}

function CardActions({ business }: { business: BusinessListItem }) {
  return (
    <>
      {business.mobileNumber && (
        <a
          href={telLink(business.mobileNumber)}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
        >
          <Phone className="h-3.5 w-3.5" /> Call Now
        </a>
      )}
      {business.whatsappNumber && <WhatsAppButton number={business.whatsappNumber} name={business.businessName} />}
    </>
  );
}
