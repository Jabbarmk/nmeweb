import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, Pencil, Plus } from "lucide-react";
import DeleteJobButton from "./DeleteJobButton";
import { getMyJobs } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";
import { salaryRange } from "@/lib/utils";

export const metadata: Metadata = { title: "My Jobs" };

interface Props {
  searchParams: Promise<{ saved?: string }>;
}

export default async function MyJobsPage({ searchParams }: Props) {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const sp = await searchParams;
  const res = await getMyJobs(token).catch(() => null);
  const jobs = res && ok(res) ? res.data ?? [] : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">My Jobs</h1>
        <Link
          href="/account/jobs/new"
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Post a Job
        </Link>
      </div>

      {sp.saved && (
        <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">Job saved.</p>
      )}

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <Briefcase className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-base font-semibold text-ink">No jobs posted yet</p>
          <p className="mt-1 text-sm text-gray-500">Post a job to start receiving applications.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/jobs/${job.id}`} className="block truncate text-base font-bold text-ink hover:text-brand">
                    {job.job_title}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {job.company_name} · {job.vacancies} vacancies
                    {salaryRange(job.salary_range_from, job.salary_range_to) &&
                      ` · ${salaryRange(job.salary_range_from, job.salary_range_to)}`}
                  </p>
                  {job.status && (
                    <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                      {job.status}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/account/jobs/${job.id}/edit`}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <DeleteJobButton jobId={job.id} title={job.job_title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
