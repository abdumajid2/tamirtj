// src/components/sections/ReviewsCarousel.jsx
"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  useGetReviewsQuery,
  useGetUsersQuery,
  useGetMastersQuery,
  useGetCompaniesQuery,
} from "@/store/api/baseApi";

import { Star, HardHat, ChevronLeft, ChevronRight } from "lucide-react";

const BRAND = { green: "#00B140", greenLight: "#E8F8EE", dark: "#111827" };

function dictById(arr = [], key = "id") {
  const d = {};
  arr?.forEach((x) => (d[String(x?.[key])] = x));
  return d;
}

function formatSomoni(n) {
  const num = Number(n ?? 0);
  return num.toLocaleString("ru-RU") + " сўм".replace("сўм", "сом"); // если нужно именно сомони
}

export default function ReviewsCarousel() {
  const { data: reviews = [] } = useGetReviewsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const { data: masters = [] } = useGetMastersQuery();
  const { data: companies = [] } = useGetCompaniesQuery();

  const usersById = useMemo(() => dictById(users), [users]);
  const mastersById = useMemo(() => dictById(masters), [masters]);
  const companiesById = useMemo(() => dictById(companies), [companies]);

  const items = useMemo(() => {
    return (reviews || []).map((r) => {
      const author = usersById[String(r.authorUserId)];
      const target =
        r.targetType === "master"
          ? mastersById[String(r.targetId)]
          : companiesById[String(r.targetId)];

      return { r, author, target, targetType: r.targetType };
    });
  }, [reviews, usersById, mastersById, companiesById]);

  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          Отзывы пользователей
        </h2>

        {/* стрелки как на примере */}
        <div className="flex items-center gap-3">
          <button
            className="reviews-prev grid place-items-center h-10 w-10 rounded-full border border-gray-200 bg-white shadow hover:shadow-md transition"
            aria-label="Назад"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            className="reviews-next grid place-items-center h-10 w-10 rounded-full border border-gray-200 bg-white shadow hover:shadow-md transition"
            aria-label="Вперёд"
            type="button"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={20}
        slidesPerView={1.05}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4.05 },
        }}
        navigation={{ prevEl: ".reviews-prev", nextEl: ".reviews-next" }}
        pagination={{ clickable: true, el: ".reviews-pagination" }}
        className="!pb-10"
      >
        {items.map(({ r, author, target, targetType }) => (
          <SwiperSlide key={r.id}>
            <article className="h-full rounded-3xl border border-gray-100 bg-white shadow-sm px-6 py-6 flex flex-col">
              {/* шапка с зелёной “каской” и именем автора */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{ backgroundColor: BRAND.greenLight }}
                >
                  <HardHat className="h-5 w-5" color={BRAND.green} />
                </div>
                <div className="font-semibold text-gray-900">
                  {author?.name || "Пользователь"}
                </div>
              </div>

              {/* текст отзыва */}
              <p className="text-gray-700 leading-6 mb-6 line-clamp-5">
                {r.text}
              </p>

              {/* стоимость работ — берём из priceFrom таргета, если есть */}
              <div className="mt-auto">
                <div className="text-sm text-gray-500 mb-1">Стоимость работ:</div>
                <div className="text-2xl font-extrabold text-gray-900">
                  {target?.priceFrom != null
                    ? `${Number(target.priceFrom).toLocaleString("ru-RU")} ${target.priceUnit || "сомони"}`
                    : "—"}
                </div>

                {/* блок мастера/компании внизу */}
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                  <div className="relative h-9 w-9 rounded-full overflow-hidden bg-white">
                    {target?.avatar || target?.logo ? (
                      <Image
                        src={target?.avatar || target?.logo}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-xs text-gray-500">
                        {targetType === "master" ? "M" : "C"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-gray-900 font-medium">
                      {targetType === "master" ? target?.fullName : target?.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        {Number(r.rating ?? target?.rating ?? 0).toFixed(0)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        {(target?.reviewsCount ?? 0).toLocaleString("ru-RU")}{" "}
                        отзывов
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* пагинация точками */}
      <div className="reviews-pagination !bottom-0 flex justify-center"></div>
    </section>
  );
}
