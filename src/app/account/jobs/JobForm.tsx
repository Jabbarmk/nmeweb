"use client";

import { useActionState, useState } from "react";
import { saveJob, type ActionResult } from "@/app/actions";
import { Field, SubmitButton, TextArea } from "@/components/form";
import type { BusinessDetail, Job, JobCategory, JobSubcategory } from "@/lib/types";

/** Create/edit job posting — field names match create_job / update_job exactly. */
export default function JobForm({
  categories,
  subcategories,
  businesses,
  job,
}: {
  categories: JobCategory[];
  subcategories: JobSubcategory[];
  businesses: BusinessDetail[];
  job?: Job;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveJob, null);
  const [categoryId, setCategoryId] = useState(job?.category_id ?? "");
  const subs = subcategories.filter((s) => s.category_id === categoryId);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {job && <input type="hidden" name="__job_id" value={job.id} />}

      <Field label="Job title" name="job_title" required defaultValue={job?.job_title} className="sm:col-span-2" />
      <TextArea label="Job description" name="job_description" required rows={4} defaultValue={job?.job_description} className="sm:col-span-2" />
      <Field label="Company name" name="company_name" required defaultValue={job?.company_name} />

      {businesses.length > 0 && (
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Link to my business (optional)</span>
          <select
            name="business_id"
            defaultValue={job?.business_id ?? ""}
            className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
          >
            <option value="">None</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.businessName}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Category <span className="text-rose-500">*</span>
        </span>
        <select
          name="category_id"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.category_name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Subcategory <span className="text-rose-500">*</span>
        </span>
        <select
          name="subcategory_id"
          required
          defaultValue={job?.subcategory_id ?? ""}
          className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        >
          <option value="" disabled>
            Select a subcategory
          </option>
          {(subs.length > 0 ? subs : subcategories).map((s) => (
            <option key={s.id} value={s.id}>
              {s.subcategory_name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Collar type <span className="text-rose-500">*</span>
        </span>
        <select
          name="collar_type"
          required
          defaultValue={job?.collar_type ?? "white_collar"}
          className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        >
          <option value="white_collar">White collar</option>
          <option value="blue_collar">Blue collar</option>
        </select>
      </label>

      <Field label="Vacancies" name="vacancies" type="number" required defaultValue={job?.vacancies} />
      <Field label="Applicant limit" name="applicant_limit" type="number" required defaultValue={job?.applicant_limit} />
      <Field label="Time limit (days)" name="time_limit" type="number" required defaultValue={job?.time_limit} />

      <Field label="Contact name" name="contact_name" required defaultValue={job?.contact_name} />
      <Field label="Phone" name="phone" type="tel" required defaultValue={job?.phone} />
      <Field label="Email" name="email" type="email" required defaultValue={job?.email} />
      <Field label="WhatsApp" name="whatsapp" type="tel" required defaultValue={job?.whatsapp} />
      <Field label="Address" name="address" required defaultValue={job?.address} className="sm:col-span-2" />

      {state && !state.ok && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{state.message}</p>}

      <div className="sm:col-span-2">
        <SubmitButton pending={pending} label={job ? "Save changes" : "Post job"} pendingLabel="Saving…" />
      </div>
    </form>
  );
}
