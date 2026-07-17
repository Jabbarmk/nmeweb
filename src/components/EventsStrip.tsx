import Image from "next/image";
import Link from "next/link";
import { listEvents } from "@/lib/api";
import { events as staticEvents } from "@/lib/static-content";
import { ok, type EventRow } from "@/lib/types";
import { validImageUrl } from "@/lib/utils";

interface StripItem {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryId: string;
  img: string;
}

/**
 * "Latest Events in Your Location" — live from list_events (latest 10),
 * as a slow continuous CSS marquee (pauses on hover). Falls back to the
 * static placeholder events if the API is unreachable.
 */
export default async function EventsStrip() {
  const res = await listEvents({ limit: 10 }).catch(() => null);
  const live = res && ok(res) ? res.data ?? [] : [];

  const items: StripItem[] =
    live.length > 0
      ? live.map((ev: EventRow) => ({
          id: ev.id,
          title: ev.title,
          location: ev.location,
          category: ev.category_name,
          categoryId: ev.category_id,
          // Poster when the admin uploaded one (backend path uses backslashes —
          // normalize); seeded placeholder image otherwise.
          img:
            validImageUrl(ev.poster?.replace(/\\/g, "/")) ??
            `https://picsum.photos/seed/nme-event-${ev.id}/480/576`,
        }))
      : staticEvents.map((ev, i) => ({
          id: `static-${i}`,
          title: ev.title,
          location: ev.location,
          category: "",
          categoryId: "",
          img: ev.img,
        }));

  // Two identical copies make the -50% translate loop seamless.
  const loop = [...items, ...items];

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">Latest Events in Your Location</h2>
        <Link href="/events" className="text-sm font-semibold text-brand hover:underline">
          Explore all
        </Link>
      </div>

      <div className="mt-5 overflow-hidden">
        <div className="animate-marquee flex w-max gap-5">
          {loop.map((ev, i) => (
            <Link
              key={`${ev.id}-${i}`}
              href={ev.categoryId ? `/events?category=${ev.categoryId}` : "/events"}
              className="group w-48 shrink-0 sm:w-56"
              aria-hidden={i >= items.length}
              tabIndex={i >= items.length ? -1 : 0}
            >
              <span className="relative block aspect-[5/6] overflow-hidden rounded-[2rem] rounded-bl-none bg-gray-100">
                <Image
                  src={ev.img}
                  alt={ev.title}
                  fill
                  sizes="224px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                {ev.category && (
                  <span className="absolute left-3 top-3 rounded-lg bg-brand px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                    {ev.category}
                  </span>
                )}
              </span>
              <h3 className="mt-3 text-lg font-bold text-ink">{ev.title}</h3>
              <p className="mt-0.5 text-sm text-gray-400">{ev.location}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
