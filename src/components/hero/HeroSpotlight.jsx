// src/components/hero/HeroSpotlight.jsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSpotlight({

  badge = "Советы по ремонту",
  title = "Ремонт у соседей: в какое время нельзя шуметь?",
  ctaText = "Читать дальше",
  ctaHref = "#",

  
  slides = [
    
     { src: "/hero/slide-1.jpg"},
      {src: "/hero/slide-2.jpg"},
      {src: "/hero/slide-3.jpg"},
      {src: "/hero/slide-4.jpg"},
      {src: "/hero/slide-5.jpg"},
    
  ],

  height = "h-[420px] md:h-[520px]",
  className = "",
}) {
  const [active, setActive] = useState(0);
  const bg = slides?.[active] || {};
  const pausedRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      setActive((i) => (i + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(intervalRef.current);
  }, [slides]);

  return (
    <section
      className={`relative w-full overflow-hidden rounded-2xl ${height} ${className}`}
      aria-label="Рекламный баннер"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >

      {bg?.src ? (
        <Image
          src={bg.src}
          alt={bg.alt || "Фон баннера"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

   
      <div className="absolute inset-0 bg-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

    
      <div className="relative z-10 h-full px-5 sm:px-8 md:px-14">
        <div className="flex h-full max-w-5xl flex-col justify-between p-5 gap-6">
         
          <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {bg.badge || badge}
          </span>

         
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white">
            {bg.title || title}
          </h1>

        
          <div>
            <Link
              href={bg.ctaHref || ctaHref}
              className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {bg.ctaText || ctaText}
            </Link>
          </div>

          {slides?.length > 1 && (
            <div className="mt-2 flex items-center gap-4">
              {slides.slice(0, 6).map((s, i) => (
                <button
                  key={i}
                  aria-label={`Показать слайд ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`relative grid size-12 place-items-center rounded-full transition
                    ${active === i ? "ring-4 ring-white/70" : "ring-2 ring-white/20 hover:ring-white/40"}`}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    {s.src ? (
                      <Image
                        src={s.src}
                        alt={s.alt || `Миниатюра ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="48px"
                        loading="lazy"
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full bg-neutral-600" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
