"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WebSlide } from "@/lib/types";

const AUTO_ADVANCE_MS = 5000;

/**
 * Home hero carousel fed by getWebSliders. Auto-advances (paused while
 * hovered), swipe/arrow/dot navigation; a slide with a business_id links to
 * that business's detail page.
 */
export default function HeroSlider({ slides }: { slides: WebSlide[] }) {
  const [index, setIndex] = useState(0);
  const hovering = useRef(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => {
      if (!hovering.current) setIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 lg:px-6">
      <div
        className="group relative overflow-hidden rounded-3xl bg-gray-100"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured businesses"
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const businessId = slide.business_id && Number(slide.business_id) > 0 ? slide.business_id : null;
            const img = (
              <span className="relative block aspect-[16/7] sm:aspect-[16/5] lg:aspect-[16/4]">
                <Image
                  src={slide.image_url}
                  alt={slide.business_name || "Promotion"}
                  fill
                  sizes="(min-width: 1280px) 1232px, 100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </span>
            );
            return (
              <div key={slide.id} className="w-full shrink-0" aria-hidden={i !== index}>
                {businessId ? (
                  <Link href={`/business/${businessId}`} tabIndex={i === index ? 0 : -1}>
                    {img}
                  </Link>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
