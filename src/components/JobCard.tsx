import Link from "next/link";
import { Briefcase, Building2, MapPin, Users } from "lucide-react";
import type { Job } from "@/lib/types";
import { salaryRange } from "@/lib/utils";

export default function JobCard({ job }: { job: Job }) {
  const salary = salaryRange(job.salary_range_from, job.salary_range_to);
  return (
    <Link href={`/jobs/${job.id}`} className="block rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-ink">{job.job_title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <Building2 className="h-3.5 w-3.5 shrink-0" /> {job.company_name}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            job.collar_type === "blue_collar" ? "bg-sky-50 text-sky-700" : "bg-indigo-50 text-indigo-700"
          }`}
        >
          {job.collar_type === "blue_collar" ? "Blue Collar" : "White Collar"}
        </span>
      </div>

      <p className="mt-2.5 line-clamp-2 text-sm text-gray-600">{job.job_description}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
        {job.address && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.address}
          </span>
        )}
        {Number(job.vacancies) > 0 && (
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {job.vacancies} vacancies
          </span>
        )}
        {job.experience_required && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" /> {job.experience_required}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-bold text-ink">{salary || "Salary not disclosed"}</span>
        <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">View & Apply</span>
      </div>
    </Link>
  );
}
