import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import JobCard from "@/components/JobCard";
import { getMyAppliedJobs } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Applied Jobs" };

export default async function AppliedJobsPage() {
  const token = await getToken();
  if (!token) redirect("/account/login");

  const res = await getMyAppliedJobs(token).catch(() => null);
  const jobs = res && ok(res) ? res.data ?? [] : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Applied Jobs</h1>

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-base font-semibold text-ink">No applications yet</p>
          <Link href="/jobs" className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
            Browse open jobs
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </main>
  );
}
