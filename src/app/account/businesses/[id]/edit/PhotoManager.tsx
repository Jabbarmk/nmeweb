"use client";

import { useActionState, useTransition } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { removeBusinessPhoto, uploadBusinessPhotos, type ActionResult } from "@/app/actions";
import { SubmitButton } from "@/components/form";
import type { BusinessPhoto } from "@/lib/types";

const MAX_PHOTOS = 8; // API cap per business

export default function PhotoManager({ businessId, photos }: { businessId: string; photos: BusinessPhoto[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(uploadBusinessPhotos, null);
  const [deleting, startDelete] = useTransition();

  return (
    <section>
      <h2 className="text-lg font-bold text-ink">Photos</h2>
      <p className="mt-1 text-xs text-gray-500">
        {photos.length}/{MAX_PHOTOS} used. JPG, PNG, WEBP or GIF.
      </p>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative">
              <span className="relative block aspect-square overflow-hidden rounded-xl bg-gray-100">
                <Image src={p.photo_url} alt={p.name || ""} fill sizes="150px" className="object-cover" />
              </span>
              <button
                type="button"
                aria-label="Delete photo"
                disabled={deleting}
                onClick={() => startDelete(() => removeBusinessPhoto(businessId, p.id))}
                className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 text-rose-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < MAX_PHOTOS && (
        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="__business_id" value={businessId} />
          <input
            type="file"
            name="photos[]"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            required
            className="block w-full rounded-2xl border border-gray-200 p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-brand"
          />
          {state && (
            <p className={`text-sm font-medium ${state.ok ? "text-emerald-700" : "text-rose-600"}`}>{state.message}</p>
          )}
          <SubmitButton pending={pending} label="Upload photos" pendingLabel="Uploading…" />
        </form>
      )}
    </section>
  );
}
