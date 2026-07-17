import { cookies } from "next/headers";
import HeroBanner from "@/components/HeroBanner";
import HeroSlider from "@/components/HeroSlider";
import HomeHub from "@/components/HomeHub";
import MidBanner from "@/components/MidBanner";
import EventsStrip from "@/components/EventsStrip";
import OffersStrip from "@/components/OffersStrip";
import TrendingSearches from "@/components/TrendingSearches";
import { getCategories, getOffers, getOffersNear, getWebSliders } from "@/lib/api";
import { LOCATION_COOKIE, parseLocation } from "@/lib/location";
import { ok } from "@/lib/types";

export default async function HomePage() {
  const jar = await cookies();
  const location = parseLocation(jar.get(LOCATION_COOKIE)?.value);

  // All fetches are non-fatal: the page renders with whatever loads.
  const [categoriesRes, offersRes, nearbyRes, slidersRes] = await Promise.allSettled([
    getCategories(),
    getOffers(),
    location ? getOffersNear(location.lat, location.lon) : Promise.resolve([]),
    getWebSliders(),
  ]);

  const categories =
    categoriesRes.status === "fulfilled" && ok(categoriesRes.value) ? categoriesRes.value.data ?? [] : [];
  const allOffers = offersRes.status === "fulfilled" && ok(offersRes.value) ? offersRes.value.data ?? [] : [];
  const nearby = nearbyRes.status === "fulfilled" ? nearbyRes.value : [];
  // Admin-managed hero slides; endpoint isn't on production yet, so fall back
  // to the static banner until it 200s.
  const slides =
    slidersRes.status === "fulfilled" && ok(slidersRes.value)
      ? (slidersRes.value.data ?? []).filter((s) => s.image_url)
      : [];

  // Prefer offers around the chosen location; fall back to all when none nearby.
  const offers = nearby.length > 0 ? nearby : allOffers;
  const offersTitle = location && nearby.length > 0 ? `Offers & Deals near ${location.label}` : "Offers & Deals";

  return (
    <main>
      {slides.length > 0 ? <HeroSlider slides={slides} /> : <HeroBanner />}
      <HomeHub categories={categories} />
      <MidBanner />
      <EventsStrip />
      <OffersStrip offers={offers} title={offersTitle} />
      <div className="mt-10">
        <TrendingSearches />
      </div>
    </main>
  );
}
