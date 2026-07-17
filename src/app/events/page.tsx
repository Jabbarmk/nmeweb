import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, IndianRupee, MapPin, Phone, Ticket, User } from "lucide-react";
import Pagination from "@/components/Pagination";
import { getEventCategories, listEvents } from "@/lib/api";
import { ok, type EventRow } from "@/lib/types";
import { mapsLink, telLink, validImageUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Events" };

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function EventsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [eventsRes, catsRes] = await Promise.allSettled([
    listEvents({ category_id: sp.category, page }),
    getEventCategories(),
  ]);

  const list = eventsRes.status === "fulfilled" && ok(eventsRes.value) ? eventsRes.value : null;
  const events = list?.data ?? [];
  const categories = catsRes.status === "fulfilled" && ok(catsRes.value) ? catsRes.value.data ?? [] : [];
  const activeCategory = categories.find((c) => c.id === sp.category);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold text-ink">
        {activeCategory ? `${activeCategory.name} Events` : "Upcoming Events"}
      </h1>
      <p className="mt-1 text-xs text-gray-500">
        {list ? `${list.total} upcoming event${list.total === 1 ? "" : "s"}` : "Could not load events — please retry."}
      </p>

      {categories.length > 0 && (
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <Chip href="/events" label="All" active={!sp.category} />
          {categories.map((c) => (
            <Chip key={c.id} href={`/events?category=${c.id}`} label={c.name} active={sp.category === c.id} />
          ))}
        </div>
      )}

      {events.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-ink">No upcoming events here</p>
          <Link href="/events" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
            See all events
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}

      {list && (
        <Pagination page={page} totalPages={list.total_pages} basePath="/events" params={{ category: sp.category }} />
      )}
    </main>
  );
}

function EventCard({ event }: { event: EventRow }) {
  // Backend builds poster URLs with backslashes — normalize before validating.
  const poster = validImageUrl(event.poster?.replace(/\\/g, "/"));
  const date = new Date(`${event.event_date}T00:00:00`);
  const dateLabel = isNaN(date.getTime())
    ? event.event_date
    : date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const time = [event.start_time, event.end_time]
    .filter(Boolean)
    .map((t) => t.slice(0, 5))
    .join(" – ");
  const maps = mapsLink(event.latitude, event.longitude, event.location);
  const price = Number(event.price);

  return (
    <article className="flex flex-col rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {poster && (
        <span className="relative mb-4 block aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
          <Image src={poster} alt={event.title} fill sizes="400px" className="object-cover" />
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold text-ink">{event.title}</h2>
        {event.category_name && (
          <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
            {event.category_name}
          </span>
        )}
      </div>
      {event.description && <p className="mt-2 line-clamp-3 text-sm text-gray-600">{event.description}</p>}

      <div className="mt-3 space-y-1.5 text-xs text-gray-500">
        <p className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand" /> {dateLabel}
        </p>
        {time && (
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-brand" /> {time}
          </p>
        )}
        {event.location && (
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" />
            {maps ? (
              <a href={maps} target="_blank" rel="noopener noreferrer" className="hover:text-brand hover:underline">
                {event.location}
              </a>
            ) : (
              event.location
            )}
          </p>
        )}
        {event.organizer_name && (
          <p className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-brand" /> {event.organizer_name}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="flex items-center gap-1 text-sm font-bold text-ink">
          {price > 0 ? (
            <>
              <IndianRupee className="h-3.5 w-3.5" />
              {price.toLocaleString("en-IN")}
            </>
          ) : (
            "Free entry"
          )}
        </span>
        <span className="flex gap-2">
          {event.organizer_phone && (
            <a
              href={telLink(event.organizer_phone)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
            >
              <Phone className="h-3 w-3" /> Contact
            </a>
          )}
          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
            >
              <Ticket className="h-3 w-3" /> Tickets
            </a>
          )}
        </span>
      </div>
    </article>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
        active ? "bg-brand text-white" : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}
