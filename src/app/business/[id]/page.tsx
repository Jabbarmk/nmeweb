import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Copy,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import Stars from "@/components/Stars";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrendingSearches from "@/components/TrendingSearches";
import ReviewForm from "./ReviewForm";
import { getBusiness, getReviews } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { ok, type Review } from "@/lib/types";
import { initials, mapsLink, monthYear, parseSocialLinks, telLink, validImageUrl } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getBusiness(id).catch(() => null);
  const b = res && ok(res) ? res.data : null;
  return {
    title: b ? `${b.businessName} — ${b.location}` : "Business",
    description: b?.dealWith || b?.about_company || undefined,
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params;
  const [bizRes, reviewsRes, user] = await Promise.all([
    getBusiness(id).catch(() => null),
    getReviews(id).catch(() => null),
    getSessionUser(),
  ]);

  const b = bizRes && ok(bizRes) ? bizRes.data : null;
  if (!b) notFound();

  const reviews = reviewsRes && ok(reviewsRes) ? reviewsRes.data : null;
  const photos = (b.photos ?? []).filter((p) => validImageUrl(p.photo_url));
  const gallery = [b.logo_url, ...photos.map((p) => p.photo_url)]
    .map(validImageUrl)
    .filter((u): u is string => u !== null);
  const maps = mapsLink(b.latitude, b.longitude, `${b.businessName} ${b.location}`);
  const open247 = Number(b.is_24x7) === 1;
  const hours = open247
    ? "Open 24 Hours"
    : b.opening_time && b.closing_time
      ? `${b.opening_time} – ${b.closing_time}`
      : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* ── Hero card: gallery + identity + actions ─────────────────────── */}
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <Gallery images={gallery} name={b.businessName} />

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{b.businessName}</h1>
            {b.location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4 shrink-0" /> {b.location}
              </p>
            )}
            {reviews && reviews.total_reviews > 0 && (
              <p className="mt-2 flex items-center gap-2 text-sm">
                <span className="rounded-md bg-brand px-1.5 py-0.5 text-xs font-bold text-white">
                  {reviews.average_rating.toFixed(1)} ★
                </span>
                <span className="text-gray-500">({reviews.total_reviews} Reviews)</span>
              </p>
            )}
            {b.dealWith && <p className="mt-2 max-w-xl text-sm text-gray-600">{b.dealWith}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {b.mobileNumber && (
              <a
                href={telLink(b.mobileNumber)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            )}
            {b.whatsappNumber && <WhatsAppButton number={b.whatsappNumber} name={b.businessName} />}
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          {/* About */}
          {(b.about_company || b.amenities) && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">About the Business</h2>
              {b.about_company && <p className="mt-3 text-sm leading-relaxed text-gray-600">{b.about_company}</p>}
              {b.amenities && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {b.amenities.split(",").map((a) => a.trim()).filter(Boolean).map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {a}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Photos with item name/price when the owner added them */}
          {photos.length > 0 && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Business Photos</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((p) => (
                  <figure key={p.id}>
                    <span className="relative block aspect-square overflow-hidden rounded-xl bg-gray-100">
                      <Image src={p.photo_url} alt={p.name || b.businessName} fill sizes="200px" className="object-cover" />
                    </span>
                    {(p.name || Number(p.rate) > 0) && (
                      <figcaption className="mt-1.5 text-xs">
                        {p.name && <span className="block font-semibold text-ink">{p.name}</span>}
                        {Number(p.rate) > 0 && (
                          <span className="text-gray-600">
                            ₹{Number(p.rate).toLocaleString("en-IN")}{" "}
                            {Number(p.oldRate) > Number(p.rate) && (
                              <s className="text-gray-400">₹{Number(p.oldRate).toLocaleString("en-IN")}</s>
                            )}
                          </span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Reviews &amp; Ratings</h2>

            {reviews && reviews.total_reviews > 0 ? (
              <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-ink">{reviews.average_rating.toFixed(1)}</p>
                  <div className="mt-2 flex justify-center">
                    <Stars value={reviews.average_rating} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{reviews.total_reviews} Reviews</p>
                </div>
                <Histogram reviews={reviews.reviews} total={reviews.total_reviews} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">No reviews yet — be the first to share your experience.</p>
            )}

            <div className="mt-6 space-y-4">
              {reviews?.reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <ReviewForm businessId={b.id} loggedIn={Boolean(user)} />
            </div>
          </section>
        </div>

        {/* ── Right rail ──────────────────────────────────────────────────── */}
        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-ink">{b.businessName}</h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              {b.location && <ContactRow icon={<MapPin className="h-4 w-4 text-brand" />} value={b.location} />}
              {b.mobileNumber && (
                <ContactRow
                  icon={<Phone className="h-4 w-4 text-brand" />}
                  value={[b.mobileNumber, b.landlineNumber].filter(Boolean).join(" / ")}
                  href={telLink(b.mobileNumber)}
                />
              )}
              {b.email && <ContactRow icon={<Mail className="h-4 w-4 text-brand" />} value={b.email} href={`mailto:${b.email}`} />}
              {b.instagram && (
                <ContactRow icon={<Instagram className="h-4 w-4 text-brand" />} value="Instagram" href={b.instagram} external />
              )}
              {parseSocialLinks(b.social_links).map((s) => (
                <ContactRow
                  key={s.url}
                  icon={<Globe className="h-4 w-4 text-brand" />}
                  value={s.platform}
                  href={s.url}
                  external
                />
              ))}
            </ul>
          </div>

          {hours && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-ink">Business Hours</h2>
              <p className="mt-3 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" /> {b.holiday ? `Closed: ${b.holiday}` : "All days"}
                </span>
                <span className="font-semibold text-rose-500">{hours}</span>
              </p>
            </div>
          )}

          {maps && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-ink">Location &amp; Address</h2>
              <p className="mt-2 text-sm text-gray-600">{b.location}</p>
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-2xl bg-gray-100 px-4 py-6 text-center text-sm font-semibold text-brand hover:bg-gray-200"
              >
                Open in Maps
              </a>
            </div>
          )}

          {b.whatsappNumber && (
            <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <h2 className="text-base font-bold text-ink">Quick Enquiry</h2>
              <p className="mt-1 text-xs text-gray-500">Message the business directly on WhatsApp.</p>
              <div className="mt-4 flex justify-center">
                <WhatsAppButton number={b.whatsappNumber} name={b.businessName} />
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="mt-12">
        <TrendingSearches />
      </div>
    </main>
  );
}

/** Mockup-style gallery: one large image + up to 4 tiles, "+N Photos" on the last. */
function Gallery({ images, name }: { images: string[]; name: string }) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/1] items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <Store className="h-12 w-12" />
      </div>
    );
  }
  const [main, ...rest] = images;
  const tiles = rest.slice(0, 4);
  const extra = rest.length - tiles.length;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 sm:aspect-auto sm:min-h-72">
        <Image src={main} alt={name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" priority />
      </span>
      {tiles.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {tiles.map((src, i) => (
            <span key={src + i} className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
              <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
              {i === tiles.length - 1 && extra > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-bold text-white">
                  +{extra} Photos
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Histogram({ reviews, total }: { reviews: Review[]; total: number }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => Number(r.rating) === star).length,
  }));
  return (
    <div className="flex-1 space-y-1.5">
      {counts.map(({ star, n }) => (
        <div key={star} className="flex items-center gap-3 text-xs text-gray-500">
          <span className="w-3 text-right font-medium">{star}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-brand" style={{ width: total ? `${(n / total) * 100}%` : 0 }} />
          </div>
          <span className="w-6">{n}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const name = review.user_full_name.trim() || "N-ME User";
  return (
    <article className="rounded-2xl bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-brand">
            {initials(name)}
          </span>
          <div>
            <p className="text-sm font-bold text-ink">{name}</p>
            {review.created_at && <p className="text-xs text-gray-400">{monthYear(review.created_at)}</p>}
          </div>
        </div>
        <Stars value={Number(review.rating)} className="h-3.5 w-3.5" />
      </div>
      {review.review && <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.review}</p>}
      {review.admin_reply && (
        <p className="mt-3 rounded-xl bg-white p-3 text-xs text-gray-600">
          <span className="font-bold text-ink">Business response: </span>
          {review.admin_reply}
        </p>
      )}
    </article>
  );
}

function ContactRow({
  icon,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="break-words text-gray-700">{value}</span>
    </span>
  );
  return (
    <li className="flex items-start justify-between gap-2">
      {href ? (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="min-w-0 hover:text-brand">
          {content}
        </a>
      ) : (
        content
      )}
      <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />
    </li>
  );
}
