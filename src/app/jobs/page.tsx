import type { Metadata } from "next";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { getJobCategories, listJobs } from "@/lib/api";
import { ok } from "@/lib/types";

export const metadata: Metadata = { title: "Jobs" };

interface Props {
  searchParams: Promise<{ category?: string; collar?: string }>;
}

export default async function JobsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [jobsRes, catsRes] = await Promise.allSettled([listJobs(), getJobCategories()]);

  const allJobs = jobsRes.status === "fulfilled" && ok(jobsRes.value) ? jobsRes.value.data ?? [] : [];
  const categories = catsRes.status === "fulfilled" && ok(catsRes.value) ? catsRes.value.data ?? [] : [];

  const jobs = allJobs.filter(
    (j) =>
      (!sp.category || j.category_id === sp.category) &&
      (!sp.collar || j.collar_type === sp.collar),
  );

  const chip = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-4 py-2 text-xs font-semibold ${
        active ? "bg-brand text-white" : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );

  const qs = (over: { category?: string; collar?: string }) => {
    const p = new URLSearchParams();
    const cat = "category" in over ? over.category : sp.category;
    const col = "collar" in over ? over.collar : sp.collar;
    if (cat) p.set("category", cat);
    if (col) p.set("collar", col);
    const s = p.toString();
    return s ? `/jobs?${s}` : "/jobs";
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">Explore Jobs</h1>
      <p className="mt-1 text-xs text-gray-500">{jobs.length} open positions</p>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {chip(qs({ category: undefined }), "All categories", !sp.category)}
        {categories.map((c) => chip(qs({ category: c.id }), c.category_name, sp.category === c.id))}
      </div>
      <div className="mt-2 flex gap-2">
        {chip(qs({ collar: undefined }), "All types", !sp.collar)}
        {chip(qs({ collar: "white_collar" }), "White Collar", sp.collar === "white_collar")}
        {chip(qs({ collar: "blue_collar" }), "Blue Collar", sp.collar === "blue_collar")}
      </div>

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-ink">No jobs match these filters</p>
          <Link href="/jobs" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-3xl bg-indigo-50 p-8 text-center">
        <h2 className="text-lg font-bold text-ink">Hiring for your business?</h2>
        <p className="mt-1 text-sm text-gray-600">Post a job and reach applicants across the N-ME network.</p>
        <Link
          href="/account/jobs/new"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Post a Job
        </Link>
      </div>
    </main>
  );
}
