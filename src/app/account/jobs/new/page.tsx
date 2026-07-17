import type { Metadata } from "next";
import { redirect } from "next/navigation";
import JobForm from "../JobForm";
import { getJobCategories, getJobSubcategories, getMyBusinesses } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Post a Job" };

export default async function NewJobPage() {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const [catsRes, subsRes, bizRes] = await Promise.allSettled([
    getJobCategories(),
    getJobSubcategories(),
    getMyBusinesses(token),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Post a Job</h1>
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <JobForm
          categories={catsRes.status === "fulfilled" && ok(catsRes.value) ? catsRes.value.data ?? [] : []}
          subcategories={subsRes.status === "fulfilled" && ok(subsRes.value) ? subsRes.value.data ?? [] : []}
          businesses={bizRes.status === "fulfilled" && ok(bizRes.value) ? bizRes.value.data ?? [] : []}
        />
      </div>
    </main>
  );
}
