import Link from "next/link";
import Logo from "./Logo";
import { getCategories, getEventCategories, getFooterLinks } from "@/lib/api";
import { fallbackFooterPages } from "@/lib/footer-pages";
import { footerColumns, serviceCategoryIds } from "@/lib/static-content";
import { ok, type Category } from "@/lib/types";

interface FooterLink {
  label: string;
  href: string;
}

const topTen = (cats: Category[]): FooterLink[] =>
  [...cats]
    .sort((a, b) => b.business_count - a.business_count)
    .slice(0, 10)
    .map((c) => ({ label: c.service_name.trim(), href: `/category/${c.id}` }));

/** Static fallback (from the mockup) when the CMS footer API is unreachable. */
const staticColumn = (title: string): FooterLink[] =>
  footerColumns.find((c) => c.title === title)?.links.map((label) => ({ label, href: "#" })) ?? [];

/** CMS-page fallback — same 15 pages as the backend table, served locally. */
const fallbackPagesColumn = (group: "Quick Link" | "Support"): FooterLink[] =>
  fallbackFooterPages.filter((p) => p.group === group).map((p) => ({ label: p.title, href: `/page/${p.slug}` }));

export default async function Footer() {
  const [catsRes, linksRes, eventCatsRes] = await Promise.allSettled([
    getCategories(),
    getFooterLinks(),
    getEventCategories(),
  ]);

  const categories = catsRes.status === "fulfilled" && ok(catsRes.value) ? catsRes.value.data ?? [] : [];
  const serviceIds = new Set(serviceCategoryIds);

  const cms = linksRes.status === "fulfilled" && ok(linksRes.value) ? linksRes.value.data ?? {} : {};
  const cmsColumn = (group: string): FooterLink[] =>
    (cms[group] ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({ label: p.title, href: `/page/${p.slug}` }));

  const eventCategories =
    eventCatsRes.status === "fulfilled" && ok(eventCatsRes.value) ? eventCatsRes.value.data ?? [] : [];

  const columns: { title: string; links: FooterLink[] }[] = [
    // CMS-managed pages (website_footer_links / footermenulink table); local
    // fallback pages keep every link working when the API key isn't set yet.
    { title: "Quick Link", links: cmsColumn("Company").length ? cmsColumn("Company") : fallbackPagesColumn("Quick Link") },
    { title: "Support", links: cmsColumn("Support").length ? cmsColumn("Support") : fallbackPagesColumn("Support") },
    // Live top-10 categories per home-tab type
    { title: "Business", links: topTen(categories.filter((c) => !serviceIds.has(c.id))) },
    { title: "Services", links: topTen(categories.filter((c) => serviceIds.has(c.id))) },
    // Event categories → filtered events page
    {
      title: "Entertainment",
      links: eventCategories.map((ec) => ({ label: ec.name, href: `/events?category=${ec.id}` })),
    },
    { title: "Cities", links: staticColumn("Cities") },
  ].filter((col) => col.links.length > 0);

  return (
    <footer className="mt-12 rounded-t-3xl bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              {/* white chip so the logo's dark text/shadows read on the dark footer */}
              <span className="rounded-2xl bg-white p-1.5">
                <Logo className="h-11 w-11" />
              </span>
              <span className="text-xl font-bold tracking-wide">N - ME APP</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              All your needs are simplified, secure, and just a tap away in one app.
            </p>
          </div>
          <div className="flex gap-3">
            {/* Store links — replace # with real listing URLs when available. */}
            <a href="#" className="rounded-xl border border-white/15 px-4 py-2.5 text-left leading-tight hover:bg-white/5">
              <span className="block text-[10px] text-gray-400">Download on the</span>
              <span className="text-sm font-semibold">App Store</span>
            </a>
            <a href="#" className="rounded-xl border border-white/15 px-4 py-2.5 text-left leading-tight hover:bg-white/5">
              <span className="block text-[10px] text-gray-400">Download on the</span>
              <span className="text-sm font-semibold">Play Store</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-3 lg:grid-cols-6">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href === "#" ? (
                      <span className="text-xs text-gray-400">{link.label}</span>
                    ) : (
                      <Link href={link.href} className="text-xs text-gray-400 hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} N-me App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
