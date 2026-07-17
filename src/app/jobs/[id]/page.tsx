import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase, Building2, GraduationCap, Mail, MapPin, Phone, Users, Wrench } from "lucide-react";
import ApplyForm from "./ApplyForm";
import { listJobs } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { ok, type Job } from "@/lib/types";
import { salaryRange, telLink } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

/** list_jobs is the only public read for jobs — no get_job/{id} endpoint exists. */
async function findJob(id: string): Promise<Job | null> {
  const res = await listJobs().catch(() => null);
  if (!res || !ok(res)) return null;
  return res.data?.find((j) => j.id === id) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await findJob(id);
  return { title: job ? `${job.job_title} at ${job.company_name}` : "Job" };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const [job, user] = await Promise.all([findJob(id), getSessionUser()]);
  if (!job) notFound();

  const salary = salaryRange(job.salary_range_from, job.salary_range_to);
  const facts = [
    { icon: Users, label: "Vacancies", value: job.vacancies },
    { icon: Briefcase, label: "Experience", value: job.experience_required },
    { icon: GraduationCap, label: "Qualifications", value: job.qualifications },
    { icon: Wrench, label: "Skills", value: job.skills_required },
  ].filter((f) => f.value);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">{job.job_title}</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
              <Building2 className="h-4 w-4" /> {job.company_name}
            </p>
            {job.address && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> {job.address}
              </p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                job.collar_type === "blue_collar" ? "bg-sky-50 text-sky-700" : "bg-indigo-50 text-indigo-700"
              }`}
            >
              {job.collar_type === "blue_collar" ? "Blue Collar" : "White Collar"}
            </span>
            <p className="mt-2 text-lg font-bold text-ink">{salary || "Salary not disclosed"}</p>
          </div>
        </div>

        {facts.length > 0 && (
          <dl className="mt-6 grid gap-4 rounded-2xl bg-gray-50 p-5 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
                  <dd className="text-sm font-medium text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}

        <section className="mt-6">
          <h2 className="text-base font-bold text-ink">Job Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{job.job_description}</p>
        </section>

        <section className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-gray-100 p-5 text-sm">
          <span className="font-semibold text-ink">Contact: {job.contact_name}</span>
          {job.phone && (
            <a href={telLink(job.phone)} className="flex items-center gap-1.5 text-brand hover:underline">
              <Phone className="h-4 w-4" /> {job.phone}
            </a>
          )}
          {job.email && (
            <a href={`mailto:${job.email}`} className="flex items-center gap-1.5 text-brand hover:underline">
              <Mail className="h-4 w-4" /> {job.email}
            </a>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-ink">Apply for this job</h2>
        <ApplyForm jobId={job.id} collarType={job.collar_type} loggedIn={Boolean(user)} />
      </div>
    </main>
  );
}
