import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import JobForm from "../../JobForm";
import { getJobCategories, getJobSubcategories, getMyBusinesses, getMyJobs } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Edit Job" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const { id } = await params;
  const [myJobsRes, catsRes, subsRes, bizRes] = await Promise.allSettled([
    getMyJobs(token),
    getJobCategories(),
    getJobSubcategories(),
    getMyBusinesses(token),
  ]);

  // Only jobs the user owns are editable — get_my_jobs is the ownership check.
  const job =
    myJobsRes.status === "fulfilled" && ok(myJobsRes.value)
      ? myJobsRes.value.data?.find((j) => j.id === id)
      : undefined;
  if (!job) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Edit {job.job_title}</h1>
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <JobForm
          categories={catsRes.status === "fulfilled" && ok(catsRes.value) ? catsRes.value.data ?? [] : []}
          subcategories={subsRes.status === "fulfilled" && ok(subsRes.value) ? subsRes.value.data ?? [] : []}
          businesses={bizRes.status === "fulfilled" && ok(bizRes.value) ? bizRes.value.data ?? [] : []}
          job={job}
        />
      </div>
    </main>
  );
}
