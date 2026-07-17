/** Shared formatting helpers (safe on both server and client). */

/**
 * Some DB rows store an already-full URL in the image column, which the API
 * then prefixes again, producing garbage like ".../master/https://.../master/".
 * Returns a usable URL or null so callers can render their placeholder.
 */
export function validImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const t = url.trim();
  if (!/^https?:\/\//i.test(t)) return null;
  if (t.indexOf("http", 8) !== -1) return null; // concatenated double-URL
  if (t.endsWith("/")) return null; // base path with empty filename
  return t;
}

/**
 * Live data stores business social_links in several shapes: "", a plain URL,
 * a JSON-encoded array string, or an actual array of {platform, url} objects.
 * Normalize them all to a safe renderable list.
 */
export function parseSocialLinks(raw: unknown): { platform: string; url: string }[] {
  let v: unknown = raw;
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return [];
    if (t.startsWith("[") || t.startsWith("{")) {
      try {
        v = JSON.parse(t);
      } catch {
        return [];
      }
    } else {
      return /^https?:\/\//i.test(t) ? [{ platform: "Website", url: t }] : [];
    }
  }
  if (v && !Array.isArray(v) && typeof v === "object") v = [v];
  if (!Array.isArray(v)) return [];
  return v
    .filter(
      (x): x is { platform?: unknown; url: string } =>
        x != null && typeof x === "object" && typeof (x as { url?: unknown }).url === "string" && (x as { url: string }).url.length > 0,
    )
    .map((x) => ({ platform: String(x.platform || "Link"), url: x.url }));
}

/** wa.me needs digits only, with country code. Indian 10-digit numbers get 91. */
export function whatsappLink(number: string, text?: string): string {
  let digits = number.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) digits = `91${digits}`;
  const qs = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${qs}`;
}

export function telLink(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

export function mapsLink(lat: string, lng: string, label?: string): string | null {
  const la = Number(lat);
  const ln = Number(lng);
  if (!la || !ln) return null; // API uses "0.000000" for unset coordinates
  const q = label ? encodeURIComponent(label) : `${la},${ln}`;
  return `https://www.google.com/maps/search/?api=1&query=${q}&center=${la},${ln}`;
}

/** "2026-06-02 22:26:28" → "Jun 2026" (used on reviews and job cards). */
export function monthYear(dateStr: string): string {
  const d = new Date(dateStr.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** Salary range like "15000"–"25000" → "₹15,000 – ₹25,000". Empty when unset. */
export function salaryRange(from: string, to: string): string {
  const f = Number(from);
  const t = Number(to);
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  if (f && t) return `${fmt(f)} – ${fmt(t)}`;
  if (f) return `From ${fmt(f)}`;
  if (t) return `Up to ${fmt(t)}`;
  return "";
}
