"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, LocateFixed, MapPin, Search, X } from "lucide-react";
import { LOCATION_COOKIE, type UserLocation } from "@/lib/location";

/**
 * Header location pill: search a place (Nominatim via /api/geo/search) or use
 * the browser's geolocation, then store the pick in a cookie and refresh so
 * server components (nearby offers) re-render with it.
 */
export default function LocationPicker({ initial }: { initial: UserLocation | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Debounced place search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { results: UserLocation[]; error?: string };
        setResults(data.results ?? []);
        setError(data.error ?? null);
      } catch {
        setError("Location search is unavailable right now.");
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query, open]);

  const select = (loc: UserLocation) => {
    document.cookie = `${LOCATION_COOKIE}=${encodeURIComponent(JSON.stringify(loc))}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    setQuery("");
    setResults([]);
    router.refresh();
  };

  const clear = () => {
    document.cookie = `${LOCATION_COOKIE}=; path=/; max-age=0`;
    setOpen(false);
    router.refresh();
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation.");
      return;
    }
    setError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`/api/geo/reverse?lat=${latitude}&lon=${longitude}`);
          const data = (await res.json()) as { result?: UserLocation };
          if (data.result) select(data.result);
          else setError("Could not resolve your location.");
        } catch {
          setError("Could not resolve your location.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — allow it in your browser, or search instead."
            : "Could not get your position. Try searching instead.",
        );
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 sm:px-3.5"
      >
        <MapPin className="h-4 w-4 shrink-0 text-brand" />
        <span className="max-w-24 truncate sm:max-w-40">{initial?.label ?? "Select location"}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose your location"
          className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg"
        >
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex w-full items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2.5 text-sm font-semibold text-brand hover:bg-blue-100 disabled:opacity-60"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            {locating ? "Locating…" : "Use current location"}
          </button>

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-brand">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, area or locality"
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
            {searching && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />}
          </div>

          {error && <p className="mt-2 px-1 text-xs font-medium text-rose-600">{error}</p>}

          {results.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto">
              {results.map((r, i) => (
                <li key={`${r.lat},${r.lon},${i}`}>
                  <button
                    type="button"
                    onClick={() => select(r)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{r.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!searching && query.trim().length >= 2 && results.length === 0 && !error && (
            <p className="mt-2 px-1 pb-1 text-xs text-gray-500">No places found for “{query.trim()}”.</p>
          )}

          {initial && (
            <button
              type="button"
              onClick={clear}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-50"
            >
              <X className="h-3.5 w-3.5" /> Clear location
            </button>
          )}
        </div>
      )}
    </div>
  );
}
