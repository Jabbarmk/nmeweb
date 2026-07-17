/**
 * Typed shapes for the NME API v2, matched against live production responses
 * (not just the Postman docs — production returns most numbers as strings,
 * and `status` itself is sometimes the string "1").
 */

/** API sends numbers as strings ("1", "902") — accept both everywhere. */
export type NumLike = string | number;

export interface ApiEnvelope<T> {
  status: NumLike;
  message?: string;
  msg?: string[];
  errors?: string;
  data?: T;
}

/** True when the API reports success (status may be 1 or "1"). */
export function ok(res: { status: NumLike } | null | undefined): boolean {
  return res != null && Number(res.status) === 1;
}

// ---------------------------------------------------------------- categories

export interface Category {
  id: string;
  service_name: string;
  image: string; // full URL
  orderBy: string;
  dt_created: string;
  business_count: number;
}

export interface Subcategory {
  id: string;
  service_id: string;
  service_name: string;
  image: string; // full URL
  Thumbnailimage: string;
  service_type: string;
  featured: string;
  sort_order: string;
  dt_created: string;
  business_count?: number;
}

export interface SubcategoryResponse extends ApiEnvelope<Subcategory[]> {
  /** Category banner image URLs shown at the top of a category page. */
  urls?: string[];
}

// ---------------------------------------------------------------- businesses

/**
 * Card-level business from list_businesses. NOTE (confirmed on production):
 * no rating, no is_verified, no distance — those exist only in mockups today.
 */
export interface BusinessListItem {
  id: string;
  businessName: string;
  dealWith: string;
  location: string;
  mobileNumber: string;
  whatsappNumber: string;
  serviceId: string;
  sub_service_id: string;
  image: string; // full URL on this endpoint
  status: string;
  dt_created: string;
  service_name: string;
  subServiceName: string;
}

export interface BusinessListResponse extends ApiEnvelope<BusinessListItem[]> {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface BusinessPhoto {
  id: string;
  refId: string;
  image: string; // raw filename
  name: string;
  rate: string;
  oldRate: string;
  dt_created: string;
  photo_url: string; // full URL — use this
}

/** Full business from get_business/{id}. `image` is a raw filename here — use logo_url. */
export interface BusinessDetail {
  id: string;
  user_id: string;
  businessName: string;
  dealWith: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  landlineNumber: string;
  latitude: string;
  longitude: string;
  location: string;
  instagram: string;
  serviceId: string;
  sub_service_id: string;
  status: string;
  image: string;
  email: string;
  amenities: string;
  keywords: string;
  opening_time: string;
  closing_time: string;
  holiday: string;
  is_24x7: string;
  about_company: string;
  /** "", a plain URL string, a JSON string, or an array of {platform,url} —
   *  all seen in live data. Use parseSocialLinks() before rendering. */
  social_links: string | SocialLink[];
  dt_created: string;
  dt_updated: string;
  logo_url: string; // full URL
  photos: BusinessPhoto[];
}

// ------------------------------------------------------------------- reviews

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: string;
  review: string;
  admin_reply: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  user_full_name: string;
}

export interface ReviewsData {
  average_rating: number;
  total_reviews: number;
  reviews: Review[];
}

// --------------------------------------------------------------------- jobs

export interface Job {
  id: string;
  business_id: string;
  job_title: string;
  job_description: string;
  company_name: string;
  vacancies: string;
  category_id: string;
  subcategory_id: string;
  applicant_limit: string;
  time_limit: string;
  contact_name: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  address: string;
  created_at: string;
  updated_at: string;
  skills_required: string;
  qualifications: string;
  salary_range_from: string;
  salary_range_to: string;
  experience_required: string;
  industry: string;
  status: string;
  collar_type: "white_collar" | "blue_collar" | string;
  image_url: string;
}

export interface JobCategory {
  id: string;
  category_name: string;
}

export interface JobSubcategory {
  id: string;
  category_id: string;
  subcategory_name: string;
}

// ------------------------------------------------------------------- offers

/** Shape confirmed against live production getOffer. */
export interface Offer {
  id: string;
  image: string; // full URL
  BusinessID: string;
  serviceID: string;
  Latitude: string;
  Longitude: string;
  FromDate: string; // "12-Jun-2026"
  ToDate: string;
  description: string;
  dt_created: string;
  offer_category_id: string;
  categoryName: string;
  businessName: string;
  mobileNumber: string;
  location: string;
  businessImage: string;
  service_name: string;
}

export interface OfferCategory {
  id: string;
  categoryName?: string;
  category_name?: string;
}

// ------------------------------------------------------------------ sliders

/** Home hero slide from getWebSliders (admin-managed web_main_slider table). */
export interface WebSlide {
  id: string;
  business_name: string;
  business_id: string | null;
  image: string;
  ranking_id: string;
  status: string;
  image_url: string; // full URL — use this
}

// ------------------------------------------------------- website CMS pages

/** One footer link from website_footer_links (admin-managed website_footer_pages). */
export interface FooterPage {
  id: number;
  title: string;
  slug: string;
  sort_order: number;
}

/** Grouped by column_group — currently "Company" and "Support". */
export type FooterLinks = Record<string, FooterPage[]>;

export interface WebsitePage {
  id: number;
  title: string;
  slug: string;
  column_group: string;
  content: string; // HTML from the admin editor
}

// ------------------------------------------------------------------- events

export interface EventCategory {
  id: string;
  name: string;
  sort_order: string;
  status: string;
}

/** Event from list_events / get_event (admin-managed). */
export interface EventRow {
  id: string;
  category_id: string;
  business_id: string;
  title: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  poster: string | null;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string;
  organizer_name: string;
  organizer_phone: string;
  organizer_whatsapp: string;
  ticket_url: string;
  price: string;
  category_name: string;
}

export interface EventsListResponse extends ApiEnvelope<EventRow[]> {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// --------------------------------------------------------------------- auth

export interface User {
  id: string;
  fullName: string;
  userName: string;
  mobile: string;
  email: string;
  whatsapp: string;
  userImage: string;
  dt_created: string;
}

export interface VerifyOtpResponse extends ApiEnvelope<User> {
  token?: string;
}
