// src/components/hero/HeroMain.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function HeroMain() {
  const images = [
    "/hero/red4.png",
    "/hero/red5.png",
    "/hero/red6.png",
    "/hero/red9.png",
    "/hero/red8.png",
  ];

  return (
    <section className="relative bg-white py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-20 px-6">
        {/* Лево */}
        <div className="flex-1 text-center basis-[60%] md:text-left space-y-6">
          <h1 className="text-3xl  md:text-6xl font-extrabold text-gray-900 leading-tight">
            Специалисты по ремонту и строительству  со всего Таджикистана!
          </h1>
          <p className="text-gray-500 md:text-xl">
            На Tamir.tj зашёл — мастера нашёл!
          </p>

          <div className="mt-6 flex flex-col sm:flex-row border-2 border-[#00B140] p-2 rounded-full justify-between items-center gap-3 sm:gap-0">
            <input
              type="text"
              placeholder="Напишите, что нужно сделать"
              className="w-full sm:w-96 rounded-full placeholder:text-md outline-none px-5 py-4 text-gray-700"
            />
            <Link
              href="/order"
              className="mt-3 sm:mt-0 sm:-ml-10 rounded-full bg-[#00B140] px-8 py-4 text-white font-semibold hover:bg-green-700 transition"
            >
              ВЫЗВАТЬ МАСТЕРА
            </Link>
          </div>
        </div>

        {/* Право */}
        <div className="flex-1 flex justify-center">
          <div className="relative aspect-square w-64 md:w-[400px]">
            <div className="relative w-full h-full rounded-full bg-blue-100/60 ring-1 ring-black/5 shadow-sm overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                effect="fade"
                fadeEffect={{ crossFade: false }} // ← только один кадр виден
                slidesPerView={1}
                loop={false}
                rewind
                loopAdditionalSlides={images.length} // ← запас дубликатов, чтобы не «пустело»
                speed={600}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                className="w-full h-full"
              >
                {images.map((src, i) => (
                  <SwiperSlide key={src} className="w-full h-full">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-x-0 bottom-0 h-[88%] translate-y-[2%]">
                        <Image
                          src={src}
                          alt={`Мастер ${i + 1}`}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 768px) 16rem, 400px"
                          style={{
                            objectFit: "contain",
                            objectPosition: "center bottom",
                          }}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* Глобальные стили для скрытия предыдущего слайда (без «призраков») */}
      <style jsx global>{`
        .swiper-slide {
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .swiper-slide.swiper-slide-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
