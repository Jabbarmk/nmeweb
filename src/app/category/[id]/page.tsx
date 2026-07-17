import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LayoutGrid, Search } from "lucide-react";
import SubcategoryGrid from "./SubcategoryGrid";
import { getCategories, getSubcategories } from "@/lib/api";
import { ok } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getCategories().catch(() => null);
  const cat = res?.data?.find((c) => c.id === id);
  return { title: cat ? cat.service_name : "Category" };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const [catsRes, subsRes] = await Promise.all([
    getCategories().catch(() => null),
    getSubcategories(id).catch(() => null),
  ]);

  const categories = catsRes && ok(catsRes) ? catsRes.data ?? [] : [];
  const current = categories.find((c) => c.id === id);
  if (!current && categories.length > 0) notFound();

  const subcategories = subsRes && ok(subsRes) ? subsRes.data ?? [] : [];
  const banners = subsRes?.urls ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex gap-6">
        {/* Category rail (mockup's left sidebar) */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <nav aria-label="Categories" className="rounded-3xl bg-white p-3 shadow-sm">
            <ul className="max-h-[70vh] space-y-1 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const active = cat.id === id;
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.id}`}
                      className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold ${
                        active
                          ? "border border-gray-200 bg-white text-brand shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="relative h-5 w-5 shrink-0 overflow-hidden">
                        {cat.image ? (
                          <Image src={cat.image} alt="" fill sizes="20px" className="object-contain" />
                        ) : (
                          <LayoutGrid className="h-5 w-5" />
                        )}
                      </span>
                      <span className="truncate">{cat.service_name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Search within this category */}
          <form action="/listing" className="flex items-center gap-3">
            <input type="hidden" name="category_id" value={id} />
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-gray-500" />
              <input
                name="term"
                type="search"
                placeholder={`Search within ${current?.service_name ?? "this category"}`}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <button type="submit" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
              Search
            </button>
          </form>

          {banners.length > 0 && (
            <div className="relative mt-4 aspect-[4/1] overflow-hidden rounded-2xl bg-gray-100">
              {/* unoptimized: some banner filenames (parentheses etc.) make the
                  upstream reject the optimizer's fetch — let the browser load it */}
              <Image src={banners[0]} alt="" fill sizes="900px" className="object-cover" unoptimized />
            </div>
          )}

          <SubcategoryGrid categoryId={id} categoryName={current?.service_name ?? ""} subcategories={subcategories} />
        </div>
      </div>
    </main>
  );
}
