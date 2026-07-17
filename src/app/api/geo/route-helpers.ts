import "server-only";

/**
 * Thin proxy helpers over OpenStreetMap Nominatim (free geocoding, no key).
 * Proxied server-side because Nominatim's usage policy requires an
 * identifying User-Agent, which browsers won't let client JS set.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org";
const UA = "nme-web/0.1 (nmepps@gmail.com)";

interface NominatimPlace {
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string>;
}

export interface GeoResult {
  label: string;
  lat: number;
  lon: number;
}

/** Compact human label: "Kozhikode, Kerala" instead of the full 7-part display_name. */
function toLabel(p: NominatimPlace): string {
  const a = p.address ?? {};
  const locality = p.name || a.suburb || a.village || a.town || a.city || a.county;
  const region = a.state || a.country;
  return [locality, region].filter((s, i, arr) => s && arr.indexOf(s) === i).join(", ") || p.display_name;
}

function toResult(p: NominatimPlace): GeoResult {
  return { label: toLabel(p), lat: Number(p.lat), lon: Number(p.lon) };
}

export async function geoSearch(q: string): Promise<GeoResult[]> {
  const qs = new URLSearchParams({ q, format: "jsonv2", limit: "6", addressdetails: "1", "accept-language": "en" });
  const res = await fetch(`${NOMINATIM}/search?${qs}`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const places = (await res.json()) as NominatimPlace[];
  // Nominatim often returns the same name at several admin levels
  // (city/taluk/district) — keep only the first of each label.
  const seen = new Set<string>();
  return places.map(toResult).filter((r) => !seen.has(r.label) && (seen.add(r.label), true));
}

export async function geoReverse(lat: string, lon: string): Promise<GeoResult> {
  const qs = new URLSearchParams({ lat, lon, format: "jsonv2", addressdetails: "1", "accept-language": "en" });
  const res = await fetch(`${NOMINATIM}/reverse?${qs}`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const place = (await res.json()) as NominatimPlace;
  return { ...toResult(place), lat: Number(lat), lon: Number(lon) };
}
