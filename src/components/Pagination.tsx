import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Server-friendly pagination — plain links that rewrite ?page= on the current
 * path, preserving all other search params.
 */
export default function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    qs.set("page", String(p));
    return `${basePath}?${qs}`;
  };

  // window of up to 5 page numbers centered on the current page
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={href(page - 1)} aria-label="Previous page" className="rounded-full bg-white p-2.5 shadow-sm hover:bg-gray-50">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-10 w-10 rounded-full text-center text-sm font-semibold leading-10 shadow-sm ${
            p === page ? "bg-brand text-white" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} aria-label="Next page" className="rounded-full bg-white p-2.5 shadow-sm hover:bg-gray-50">
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
