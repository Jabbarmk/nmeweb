import type { Metadata } from "next";
import SearchClient from "./SearchClient";
import { getCategories } from "@/lib/api";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage() {
  const res = await getCategories().catch(() => null);
  const categories = res && ok(res) ? res.data ?? [] : [];
  // "Most used" = the categories with the most listings behind them.
  const mostUsed = [...categories].sort((a, b) => b.business_count - a.business_count).slice(0, 8);

  return <SearchClient categories={mostUsed} />;
}
