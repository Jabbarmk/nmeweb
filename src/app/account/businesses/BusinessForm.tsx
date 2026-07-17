"use client";

import { useActionState } from "react";
import { saveBusiness, type ActionResult } from "@/app/actions";
import { Field, SubmitButton, TextArea } from "@/components/form";
import type { BusinessDetail, Category, Subcategory } from "@/lib/types";

/**
 * Shared add/edit business form. Field names match the add_business /
 * update_business API exactly. Note the API's asymmetry: it writes
 * `description`/`highlights`/`address` but reads back `about_company`/
 * `amenities`/`location` — the defaults below map accordingly.
 */
export default function BusinessForm({
  categories,
  subcategories,
  business,
}: {
  categories: Category[];
  subcategories?: Subcategory[];
  business?: BusinessDetail;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(saveBusiness, null);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {business && <input type="hidden" name="__business_id" value={business.id} />}

      <Field label="Business name" name="business_name" required defaultValue={business?.businessName} className="sm:col-span-2" />

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Category <span className="text-rose-500">*</span>
        </span>
        <select
          name="category_id"
          required
          defaultValue={business?.serviceId ?? ""}
          className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.service_name}
            </option>
          ))}
        </select>
      </label>

      {subcategories && subcategories.length > 0 ? (
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Subcategory</span>
          <select
            name="subcategory_id"
            defaultValue={business?.sub_service_id ?? ""}
            className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
          >
            <option value="">None</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.service_name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <Field label="Subcategory ID (optional)" name="subcategory_id" defaultValue={business?.sub_service_id} />
      )}

      <TextArea label="Description" name="description" defaultValue={business?.about_company} className="sm:col-span-2" />
      <Field label="Highlights" name="highlights" placeholder="e.g. Same-day service" defaultValue={business?.amenities} className="sm:col-span-2" />
      <Field label="Keywords" name="keywords" placeholder="comma, separated" defaultValue={business?.keywords} className="sm:col-span-2" />

      <Field label="Contact number" name="contact_number" type="tel" defaultValue={business?.mobileNumber} />
      <Field label="WhatsApp number" name="whatsapp_number" type="tel" defaultValue={business?.whatsappNumber} />
      <Field label="Email" name="email" type="email" defaultValue={business?.email} />
      <Field label="Address" name="address" defaultValue={business?.location} />
      <Field label="Opening time" name="opening_time" type="time" defaultValue={business?.opening_time} />
      <Field label="Closing time" name="closing_time" type="time" defaultValue={business?.closing_time} />
      <Field label="Latitude" name="latitude" defaultValue={business && Number(business.latitude) ? business.latitude : ""} />
      <Field label="Longitude" name="longitude" defaultValue={business && Number(business.longitude) ? business.longitude : ""} />
      <Field label="Instagram URL" name="instagram" type="url" defaultValue={business?.instagram} />
      <Field label="Website" name="website" type="url" />

      <label className="block sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Logo {business?.logo_url && "(uploading replaces the current one)"}
        </span>
        <input
          type="file"
          name="logo"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1.5 block w-full rounded-2xl border border-gray-200 p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
        />
      </label>

      {state && !state.ok && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{state.message}</p>}

      <div className="sm:col-span-2">
        <SubmitButton pending={pending} label={business ? "Save changes" : "Add business"} pendingLabel="Saving…" />
      </div>
    </form>
  );
}
