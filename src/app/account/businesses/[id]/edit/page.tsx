import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BusinessForm from "../../BusinessForm";
import PhotoManager from "./PhotoManager";
import { getBusiness, getCategories, getMyBusinesses, getSubcategories } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Edit Business" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; created?: string }>;
}

export default async function EditBusinessPage({ params, searchParams }: Props) {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const { id } = await params;
  const sp = await searchParams;

  // get_business is public and returns any listing — verify ownership against
  // the user's own list before showing an edit surface.
  const [bizRes, mineRes, catsRes] = await Promise.all([
    getBusiness(id).catch(() => null),
    getMyBusinesses(token).catch(() => null),
    getCategories().catch(() => null),
  ]);

  const business = bizRes && ok(bizRes) ? bizRes.data : null;
  const mine = mineRes && ok(mineRes) ? mineRes.data ?? [] : [];
  if (!business || !mine.some((b) => b.id === id)) notFound();

  const categories = catsRes && ok(catsRes) ? catsRes.data ?? [] : [];
  const subsRes = business.serviceId ? await getSubcategories(business.serviceId).catch(() => null) : null;
  const subcategories = subsRes && ok(subsRes) ? subsRes.data ?? [] : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Edit {business.businessName}</h1>

      {(sp.saved || sp.created) && (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          {sp.created ? "Business created — add photos below to complete the listing." : "Changes saved."}
        </p>
      )}

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <BusinessForm categories={categories} subcategories={subcategories} business={business} />
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <PhotoManager businessId={business.id} photos={business.photos ?? []} />
      </div>
    </main>
  );
}
