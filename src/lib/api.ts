import "server-only";

import type {
  ApiEnvelope,
  BusinessDetail,
  BusinessListResponse,
  Category,
  EventCategory,
  EventsListResponse,
  FooterLinks,
  Job,
  JobCategory,
  JobSubcategory,
  Offer,
  OfferCategory,
  ReviewsData,
  Subcategory,
  SubcategoryResponse,
  VerifyOtpResponse,
  WebsitePage,
  WebSlide,
} from "./types";

/**
 * Server-side client for the NME API v2. All calls run on the Next.js server
 * (the API exposes no CORS headers, so the browser never talks to it directly).
 *
 * API conventions this client absorbs:
 *  - Always HTTP 200; success/failure lives in body.status (1 / "1" vs 0).
 *  - Auth errors are a status:0 body with a "Bearer token required" message,
 *    never a 401.
 *  - Write endpoints take multipart form-data, not JSON.
 */

const BASE_URL = process.env.NME_API_BASE_URL ?? "https://api.nmeapp.in";

class ApiError extends Error {
  constructor(message: string, public readonly endpoint: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * The CI backend in dev mode can prepend PHP warning HTML to the JSON body.
 * Parse strictly first, then fall back to extracting the trailing JSON object.
 */
async function parseJson<T>(res: Response, endpoint: string): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    const start = text.lastIndexOf("\n{") + 1 || text.indexOf("{");
    if (start >= 0) {
      try {
        return JSON.parse(text.slice(start)) as T;
      } catch {
        /* fall through */
      }
    }
    throw new ApiError("Unparseable API response", endpoint);
  }
}

async function get<T>(path: string, opts?: { token?: string; revalidate?: number | false }): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    next: { revalidate: opts?.revalidate ?? 300 },
  });
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, path);
  return parseJson<T>(res, path);
}

async function postForm<T>(path: string, fields: Record<string, string | Blob>, token?: string): Promise<T> {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, path);
  return parseJson<T>(res, path);
}

/** Forward a FormData built in a server action (may contain files) as-is. */
async function postFormData<T>(path: string, body: FormData, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, path);
  return parseJson<T>(res, path);
}

// ------------------------------------------------------- public browse

export function getCategories() {
  return get<ApiEnvelope<Category[]>>("/api/v2/getService");
}

export function getSubcategories(catId: string) {
  return postForm<SubcategoryResponse>("/api/v2/getSubService", { cat_id: catId });
}

export function listBusinesses(params: {
  category_id?: string;
  subcategory_id?: string;
  term?: string;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params.category_id) qs.set("category_id", params.category_id);
  if (params.subcategory_id) qs.set("subcategory_id", params.subcategory_id);
  if (params.term) qs.set("term", params.term);
  qs.set("page", String(params.page ?? 1));
  qs.set("limit", String(params.limit ?? 20));
  return get<BusinessListResponse>(`/api/v2/list_businesses?${qs}`, { revalidate: 60 });
}

export function getBusiness(id: string) {
  return get<ApiEnvelope<BusinessDetail>>(`/api/v2/get_business/${id}`, { revalidate: 60 });
}

/**
 * Home hero slider images (admin-managed). Not on production yet as of
 * 2026-07-17 (404) — callers must fall back to static banner content.
 */
export function getWebSliders() {
  return get<ApiEnvelope<WebSlide[]>>("/api/v2/getWebSliders", { revalidate: 300 });
}

// ------------------------------------------- website CMS (API-key gated)

/** website_footer_links / website_page are gated by app_settings.website_api_key. */
function websiteKeyHeader(): Record<string, string> {
  const key = process.env.NME_WEBSITE_API_KEY;
  return key ? { "X-API-Key": key } : {};
}

export async function getFooterLinks(): Promise<ApiEnvelope<FooterLinks>> {
  const res = await fetch(`${BASE_URL}/api/v2/website_footer_links`, {
    headers: websiteKeyHeader(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, "website_footer_links");
  return res.json();
}

export async function getWebsitePage(slug: string): Promise<ApiEnvelope<WebsitePage>> {
  const res = await fetch(`${BASE_URL}/api/v2/website_page/${encodeURIComponent(slug)}`, {
    headers: websiteKeyHeader(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new ApiError(`HTTP ${res.status}`, "website_page");
  return res.json();
}

// ------------------------------------------------------ events (public)

export function getEventCategories() {
  return get<ApiEnvelope<EventCategory[]>>("/api/v2/get_event_categories", { revalidate: 3600 });
}

export function listEvents(params?: { category_id?: string; term?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.category_id) qs.set("category_id", params.category_id);
  if (params?.term) qs.set("term", params.term);
  qs.set("page", String(params?.page ?? 1));
  qs.set("limit", String(params?.limit ?? 20));
  return get<EventsListResponse>(`/api/v2/list_events?${qs}`, { revalidate: 60 });
}

// ------------------------------------------------------------- reviews

export function getReviews(businessId: string) {
  return get<ApiEnvelope<ReviewsData>>(`/api/v2/get_reviews/${businessId}`, { revalidate: 0 });
}

export function postReview(token: string, fields: { business_id: string; rating: string; review: string }) {
  return postForm<ApiEnvelope<never>>("/api/v2/post_review", fields, token);
}

// ---------------------------------------------------------------- auth

export function emailRegisterOtp(email: string) {
  return postForm<ApiEnvelope<never>>("/api/v2/email_register_otp", { email });
}

export function emailLoginOtp(email: string) {
  return postForm<ApiEnvelope<never>>("/api/v2/email_login_otp", { email });
}

export function emailVerifyOtp(email: string, otp: string) {
  return postForm<VerifyOtpResponse>("/api/v2/email_verify_otp", { email, otp });
}

// ---------------------------------------------------- jobs & offers browse

export function listJobs() {
  return get<ApiEnvelope<Job[]>>("/api/v2/list_jobs", { revalidate: 60 });
}

export function getJobCategories() {
  return get<ApiEnvelope<JobCategory[]>>("/api/v2/get_job_categories");
}

export function getJobSubcategories() {
  return get<ApiEnvelope<JobSubcategory[]>>("/api/v2/get_job_subcategories");
}

export function getOffers() {
  return get<ApiEnvelope<Offer[]>>("/api/v2/getOffer", { revalidate: 60 });
}

export function getOfferCategories() {
  return get<ApiEnvelope<OfferCategory[]>>("/api/v2/getOfferCategory");
}

/**
 * getOfferV1 rows are business-detail-shaped and differ from getOffer
 * (offerImage vs image, dealWith instead of description, extra distance
 * field) — confirmed on production. Normalized here so OfferCard renders both.
 */
interface OfferV1Row {
  id: string;
  offerImage: string;
  businessName: string;
  dealWith: string;
  mobileNumber: string;
  location: string;
  latitude: string;
  longitude: string;
  FromDate: string;
  ToDate: string;
  dt_created: string;
  categoryId: string;
  categoryName: string;
  serviceId: string;
  service_name: string;
  businessImage: string;
  distance: string;
}

export async function getOffersNear(lat: number, lon: number): Promise<Offer[]> {
  const res = await get<ApiEnvelope<OfferV1Row[]>>(
    `/api/v2/getOfferV1?Latitude=${lat}&Longitude=${lon}`,
    { revalidate: 60 },
  );
  if (Number(res.status) !== 1) return [];
  return (res.data ?? []).map((r) => ({
    id: r.id,
    image: r.offerImage,
    BusinessID: "",
    serviceID: r.serviceId,
    Latitude: r.latitude,
    Longitude: r.longitude,
    FromDate: r.FromDate,
    ToDate: r.ToDate,
    description: r.dealWith,
    dt_created: r.dt_created,
    offer_category_id: r.categoryId,
    categoryName: r.categoryName,
    businessName: r.businessName,
    mobileNumber: r.mobileNumber,
    location: r.location,
    businessImage: r.businessImage,
    service_name: r.service_name,
  }));
}

// ----------------------------------------------------- authed: profile

export function getMyBusinesses(token: string) {
  return get<ApiEnvelope<BusinessDetail[]> & { count?: number }>("/api/v2/get_my_businesses", {
    token,
    revalidate: 0,
  });
}

export function getMyJobs(token: string) {
  return get<ApiEnvelope<Job[]> & { count?: number }>("/api/v2/get_my_jobs", { token, revalidate: 0 });
}

export function getMyOffers(token: string) {
  return get<ApiEnvelope<Offer[]> & { count?: number }>("/api/v2/get_my_offers", { token, revalidate: 0 });
}

export function getMyAppliedJobs(token: string) {
  return get<ApiEnvelope<Job[]> & { count?: number }>("/api/v2/get_my_applied_jobs", { token, revalidate: 0 });
}

// -------------------------------------------------- authed: business mgmt

export function addBusiness(token: string, form: FormData) {
  return postFormData<ApiEnvelope<never> & { business_id?: number }>("/api/v2/add_business", form, token);
}

export function updateBusiness(token: string, id: string, form: FormData) {
  return postFormData<ApiEnvelope<never>>(`/api/v2/update_business/${id}`, form, token);
}

export function addBusinessPhotos(token: string, businessId: string, form: FormData) {
  return postFormData<ApiEnvelope<never> & { uploaded?: string[] }>(
    `/api/v2/add_business_photos/${businessId}`,
    form,
    token,
  );
}

export function deleteBusinessPhoto(token: string, photoId: string) {
  return get<ApiEnvelope<never>>(`/api/v2/delete_business_photo/${photoId}`, { token, revalidate: 0 });
}

// -------------------------------------------------------- authed: jobs

export function createJob(token: string, form: FormData) {
  return postFormData<ApiEnvelope<never> & { job_id?: number }>("/api/v2/create_job", form, token);
}

export function updateJob(token: string, id: string, form: FormData) {
  return postFormData<ApiEnvelope<never>>(`/api/v2/update_job/${id}`, form, token);
}

export function deleteJob(token: string, id: string) {
  return get<ApiEnvelope<never>>(`/api/v2/delete_job/${id}`, { token, revalidate: 0 });
}

export function applyJob(token: string, form: FormData) {
  return postFormData<ApiEnvelope<never> & { application_id?: number }>("/api/v2/apply_job", form, token);
}

/** Message the API returns on any endpoint when the JWT is missing/expired. */
export function isAuthExpired(res: { status: unknown; message?: string }): boolean {
  return Number(res.status) === 0 && (res.message ?? "").includes("Bearer");
}
