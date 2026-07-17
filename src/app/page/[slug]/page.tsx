import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWebsitePage } from "@/lib/api";
import { findFallbackPage } from "@/lib/footer-pages";
import { ok } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Admin-managed content when the CMS API responds; local fallback otherwise. */
async function loadPage(slug: string): Promise<{ title: string; content: string } | null> {
  const res = await getWebsitePage(slug).catch(() => null);
  if (res && ok(res) && res.data) return res.data;
  return findFallbackPage(slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadPage(slug);
  return { title: page ? page.title : "Page" };
}

/** CMS page from the admin "Website" section (website_page/{slug}). */
export default async function WebsitePage({ params }: Props) {
  const { slug } = await params;
  const page = await loadPage(slug);
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold text-ink">{page.title}</h1>
      <article
        className="cms-content mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-10"
        // Content is authored by admins in the backend's editor.
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}
