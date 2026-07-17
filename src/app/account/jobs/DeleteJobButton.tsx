"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeJob } from "@/app/actions";

export default function DeleteJobButton({ jobId, title }: { jobId: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This cannot be undone.`)) start(() => removeJob(jobId));
      }}
      className="flex items-center gap-1.5 rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
