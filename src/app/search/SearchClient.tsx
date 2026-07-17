"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, Mic, Search, X } from "lucide-react";
import type { Category } from "@/lib/types";

const RECENT_KEY = "nme_recent_searches";
const MAX_RECENT = 8;

/** Search hub: big search bar, recent searches (localStorage), top categories. */
export default function SearchClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      /* corrupted storage — start fresh */
    }
  }, []);

  const saveRecent = (list: string[]) => {
    setRecent(list);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  };

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    saveRecent([t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT));
    router.push(`/listing?term=${encodeURIComponent(t)}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <form
        role="search"
        className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          submit(new FormData(e.currentTarget).get("term")?.toString() ?? "");
        }}
      >
        <Search className="h-5 w-5 shrink-0 text-gray-500" />
        <input
          name="term"
          type="search"
          autoFocus
          placeholder="Search services, businesses, experts..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <Mic className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
      </form>

      {recent.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Recent Searches</h2>
            <button onClick={() => saveRecent([])} className="text-xs font-semibold text-brand hover:underline">
              Clear all
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {recent.map((term) => (
              <span key={term} className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm text-gray-700 shadow-sm">
                <button onClick={() => submit(term)} className="hover:text-brand">
                  {term}
                </button>
                <button
                  aria-label={`Remove ${term}`}
                  onClick={() => saveRecent(recent.filter((r) => r !== term))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Most Used Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="flex flex-col items-center gap-3 rounded-3xl bg-white px-4 py-7 shadow-sm hover:shadow-md"
            >
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-50">
                {cat.image ? (
                  <Image src={cat.image} alt="" fill sizes="48px" className="object-contain p-2" />
                ) : (
                  <LayoutGrid className="h-5 w-5 text-brand" />
                )}
              </span>
              <span className="text-center text-sm font-bold text-ink">{cat.service_name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
