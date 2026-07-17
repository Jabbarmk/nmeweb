"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as api from "@/lib/api";
import { clearSession, getToken, setSession } from "@/lib/auth";
import { ok } from "@/lib/types";

/**
 * All mutations go through these server actions — the browser never holds the
 * JWT or calls the API directly. Each action returns { ok, message } for the
 * form components to render, except where a redirect is the success path.
 */

export interface ActionResult {
  ok: boolean;
  message: string;
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

/** The API packs validation errors into message, msg[] or an errors HTML blob. */
function apiMessage(res: { message?: string; msg?: string[]; errors?: string }, fallback: string): string {
  if (res.message) return res.message;
  if (res.msg?.length) return res.msg.join(" ");
  if (res.errors) return res.errors.replace(/<[^>]+>/g, " ").trim();
  return fallback;
}

// ------------------------------------------------------------------ auth

export async function requestOtp(
  mode: "login" | "register",
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return fail("Please enter your email.");
  try {
    const res = mode === "register" ? await api.emailRegisterOtp(email) : await api.emailLoginOtp(email);
    return { ok: ok(res), message: apiMessage(res, ok(res) ? "OTP sent to your email." : "Could not send OTP.") };
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
}

export async function verifyOtp(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const otp = String(formData.get("otp") ?? "").trim();
  if (!email || !otp) return fail("Enter the 6-digit code sent to your email.");

  let success = false;
  try {
    const res = await api.emailVerifyOtp(email, otp);
    if (ok(res) && res.token && res.data) {
      await setSession(res.token, res.data);
      success = true;
    } else {
      return fail(apiMessage(res, "Verification failed."));
    }
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
  if (success) redirect("/account");
  return fail("Verification failed.");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/");
}

// --------------------------------------------------------------- reviews

export async function submitReview(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return fail("Please log in to write a review.");

  const businessId = String(formData.get("business_id") ?? "");
  const rating = String(formData.get("rating") ?? "");
  const review = String(formData.get("review") ?? "").trim();
  if (!rating) return fail("Please select a star rating.");

  try {
    const res = await api.postReview(token, { business_id: businessId, rating, review });
    if (api.isAuthExpired(res)) {
      await clearSession();
      return fail("Your session expired — please log in again.");
    }
    if (ok(res)) revalidatePath(`/business/${businessId}`);
    return { ok: ok(res), message: apiMessage(res, ok(res) ? "Review added." : "Could not add review.") };
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
}

// -------------------------------------------------------- business mgmt

export async function saveBusiness(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return fail("Please log in first.");

  const id = String(formData.get("__business_id") ?? "");
  formData.delete("__business_id");
  // An empty file input still submits a zero-byte entry — the API would treat
  // it as a real upload attempt, so strip it.
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size === 0) formData.delete("logo");

  let newId: number | undefined;
  try {
    if (id) {
      const res = await api.updateBusiness(token, id, formData);
      if (api.isAuthExpired(res)) {
        await clearSession();
        return fail("Your session expired — please log in again.");
      }
      if (!ok(res)) return fail(apiMessage(res, "Could not save the business."));
    } else {
      const res = await api.addBusiness(token, formData);
      if (api.isAuthExpired(res)) {
        await clearSession();
        return fail("Your session expired — please log in again.");
      }
      if (!ok(res)) return fail(apiMessage(res, "Could not save the business."));
      newId = res.business_id;
    }
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
  revalidatePath("/account/businesses");
  redirect(id ? `/account/businesses/${id}/edit?saved=1` : newId ? `/account/businesses/${newId}/edit?created=1` : "/account/businesses");
}

export async function uploadBusinessPhotos(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return fail("Please log in first.");
  const businessId = String(formData.get("__business_id") ?? "");
  formData.delete("__business_id");

  const files = formData.getAll("photos[]").filter((f) => f instanceof File && f.size > 0);
  if (files.length === 0) return fail("Choose at least one image.");

  try {
    const res = await api.addBusinessPhotos(token, businessId, formData);
    if (ok(res)) {
      revalidatePath(`/account/businesses/${businessId}/edit`);
      revalidatePath(`/business/${businessId}`);
    }
    return { ok: ok(res), message: apiMessage(res, ok(res) ? "Photos uploaded." : "Upload failed.") };
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
}

export async function removeBusinessPhoto(businessId: string, photoId: string): Promise<void> {
  const token = await getToken();
  if (!token) return;
  await api.deleteBusinessPhoto(token, photoId);
  revalidatePath(`/account/businesses/${businessId}/edit`);
  revalidatePath(`/business/${businessId}`);
}

// ------------------------------------------------------------------ jobs

export async function saveJob(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return fail("Please log in first.");

  const id = String(formData.get("__job_id") ?? "");
  formData.delete("__job_id");

  try {
    const res = id ? await api.updateJob(token, id, formData) : await api.createJob(token, formData);
    if (api.isAuthExpired(res)) {
      await clearSession();
      return fail("Your session expired — please log in again.");
    }
    if (!ok(res)) return fail(apiMessage(res, "Could not save the job."));
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
  revalidatePath("/account/jobs");
  redirect("/account/jobs?saved=1");
}

export async function removeJob(jobId: string): Promise<void> {
  const token = await getToken();
  if (!token) return;
  await api.deleteJob(token, jobId);
  revalidatePath("/account/jobs");
}

export async function submitJobApplication(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return fail("Please log in to apply for jobs.");

  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) return fail("Please attach your resume (PDF/DOC, max 2MB).");
  if (resume.size > 2 * 1024 * 1024) return fail("Resume is over 2MB — please attach a smaller file.");

  try {
    const res = await api.applyJob(token, formData);
    if (api.isAuthExpired(res)) {
      await clearSession();
      return fail("Your session expired — please log in again.");
    }
    return { ok: ok(res), message: apiMessage(res, ok(res) ? "Application submitted." : "Could not apply.") };
  } catch {
    return fail("Could not reach the server. Please try again.");
  }
}
