"use client";

import { useRouter } from "next/navigation";
import { Mic, Search } from "lucide-react";

/** The pill search bar in the header — submits to the listing page. */
export default function HeaderSearch() {
  const router = useRouter();
  return (
    <form
      role="search"
      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2"
      onSubmit={(e) => {
        e.preventDefault();
        const term = new FormData(e.currentTarget).get("term")?.toString().trim();
        router.push(term ? `/listing?term=${encodeURIComponent(term)}` : "/search");
      }}
    >
      <Search className="h-4 w-4 shrink-0 text-gray-500" />
      <input
        name="term"
        type="search"
        placeholder="Search services, businesses, experts..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      <Mic className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
    </form>
  );
}
