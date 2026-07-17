import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BusinessForm from "../BusinessForm";
import { getCategories } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Register your Business" };

export default async function AddBusinessPage() {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const res = await getCategories().catch(() => null);
  const categories = res && ok(res) ? res.data ?? [] : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Register your Business</h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in the details below — you can add photos right after creating the listing.
      </p>
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <BusinessForm categories={categories} />
      </div>
    </main>
  );
}
