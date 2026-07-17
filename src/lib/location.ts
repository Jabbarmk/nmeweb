/**
 * User-selected location, shared between client (LocationPicker sets the
 * cookie) and server (pages read it to fetch nearby offers). Not sensitive,
 * so the cookie is deliberately not httpOnly.
 */

export const LOCATION_COOKIE = "nme_location";

export interface UserLocation {
  label: string;
  lat: number;
  lon: number;
}

export function parseLocation(raw: string | undefined | null): UserLocation | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(decodeURIComponent(raw)) as Partial<UserLocation>;
    if (typeof v.label === "string" && typeof v.lat === "number" && typeof v.lon === "number") {
      return { label: v.label, lat: v.lat, lon: v.lon };
    }
  } catch {
    /* malformed cookie — treat as unset */
  }
  return null;
}
