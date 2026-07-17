"use client";

/**
 * The Business / Services pill toggle from the mockups. Purely visual state —
 * the API serves one shared category tree, so both tabs hit the same
 * endpoints; only curated/static content differs per tab today.
 */
export default function SegmentedToggle({
  value,
  onChange,
  labels = ["Business", "Services"],
}: {
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  labels?: [string, string] | string[];
}) {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1" role="tablist">
      {labels.map((label, i) => (
        <button
          key={label}
          role="tab"
          aria-selected={value === i}
          onClick={() => onChange(i as 0 | 1)}
          className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
            value === i ? "bg-white text-brand shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
