"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitJobApplication, type ActionResult } from "@/app/actions";
import { Field, SubmitButton } from "@/components/form";

/** Job application form — fields per the API's white/blue collar split. */
export default function ApplyForm({
  jobId,
  collarType,
  loggedIn,
}: {
  jobId: string;
  collarType: string;
  loggedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(submitJobApplication, null);
  const white = collarType !== "blue_collar";

  if (!loggedIn) {
    return (
      <p className="mt-3 text-sm text-gray-500">
        <Link href="/account/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>{" "}
        to apply for this job.
      </p>
    );
  }

  if (state?.ok) {
    return <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{state.message}</p>;
  }

  return (
    <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="job_id" value={jobId} />
      <input type="hidden" name="collar_type" value={collarType} />

      <Field label="Full name" name="full_name" required />
      <Field label="Contact number" name="contact_number" type="tel" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Address" name="address" required />

      <label className="block sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume (PDF/DOC, max 2MB)</span>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
          className="mt-1.5 block w-full rounded-2xl border border-gray-200 p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
        />
      </label>

      {white ? (
        <>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cover letter (optional)</span>
            <textarea name="cover_letter" rows={3} className="mt-1.5 w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-brand" />
          </label>
          <Field label="Portfolio URL (optional)" name="portfolio" type="url" className="sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
            <input type="checkbox" name="confirm_terms" value="1" required className="h-4 w-4 rounded accent-[var(--color-brand)]" />
            I confirm the details above are accurate.
          </label>
        </>
      ) : (
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Experience (optional)</span>
          <textarea
            name="applicant_experience"
            rows={2}
            placeholder="e.g. 2 years in Plumbing"
            className="mt-1.5 w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-brand"
          />
        </label>
      )}

      <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
        <input type="checkbox" name="save_profile" value="1" className="h-4 w-4 rounded accent-[var(--color-brand)]" />
        Save my profile for future applications
      </label>

      {state && !state.ok && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{state.message}</p>}

      <div className="sm:col-span-2">
        <SubmitButton pending={pending} label="Submit application" pendingLabel="Submitting…" />
      </div>
    </form>
  );
}
