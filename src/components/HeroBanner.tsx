import Image from "next/image";
import { heroBanner } from "@/lib/static-content";

/** Static ad banner (placeholder — no banners API yet). */
export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 lg:px-6">
      <div className={`relative overflow-hidden rounded-3xl ${heroBanner.bg}`}>
        <div className="flex items-center justify-between gap-6 px-8 py-10 sm:px-12">
          <div className="text-white">
            <p className="text-sm font-medium opacity-80">{heroBanner.subline}</p>
            <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">{heroBanner.headline}</h2>
            <p className="mt-3 text-xs font-semibold tracking-wider opacity-70">{heroBanner.note}</p>
          </div>
          <div className="relative hidden h-40 w-72 shrink-0 overflow-hidden rounded-2xl sm:block lg:w-96">
            <Image src={heroBanner.img} alt="" fill sizes="384px" className="object-cover" unoptimized />
          </div>
        </div>
      </div>
    </section>
  );
}
