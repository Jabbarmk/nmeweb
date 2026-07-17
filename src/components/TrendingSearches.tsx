import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { trendingSearches } from "@/lib/static-content";

const chipColors = [
  "bg-blue-50 text-blue-700",
  "bg-amber-50 text-amber-700",
  "bg-emerald-50 text-emerald-700",
  "bg-purple-50 text-purple-700",
  "bg-rose-50 text-rose-700",
];

/** Static chips (no trending endpoint yet) linking into real search results. */
export default function TrendingSearches() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-6">
      <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
        <TrendingUp className="h-4 w-4 text-brand" /> Trending Searches
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {trendingSearches.map((term, i) => (
          <Link
            key={term}
            href={`/listing?term=${encodeURIComponent(term)}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium hover:brightness-95 ${chipColors[i % chipColors.length]}`}
          >
            {term}
          </Link>
        ))}
      </div>
    </section>
  );
}
