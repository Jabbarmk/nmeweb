"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { submitReview, type ActionResult } from "@/app/actions";

/** "Write a review" — star picker + text, posts via server action (JWT stays server-side). */
export default function ReviewForm({ businessId, loggedIn }: { businessId: string; loggedIn: boolean }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(submitReview, null);

  if (!loggedIn) {
    return (
      <p className="text-sm text-gray-500">
        <Link href="/account/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>{" "}
        to write a review.
      </p>
    );
  }

  if (state?.ok) {
    return <p className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{state.message}</p>;
  }

  return (
    <form action={formAction}>
      <h3 className="text-sm font-bold text-ink">Write a review</h3>
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="rating" value={rating || ""} />

      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`h-7 w-7 ${(hover || rating) >= star ? "text-amber-400" : "text-gray-300"}`}
              fill="currentColor"
              strokeWidth={0}
            />
          </button>
        ))}
      </div>

      <textarea
        name="review"
        rows={3}
        placeholder="Share your experience (optional)"
        className="mt-3 w-full rounded-2xl border border-gray-200 p-3.5 text-sm outline-none focus:border-brand"
      />

      {state && !state.ok && <p className="mt-2 text-sm font-medium text-rose-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="mt-3 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
