// src/components/sections/ReviewsAndFaq.jsx
"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  useGetReviewsQuery,
  useGetMastersQuery,
  useGetCompaniesQuery,
  useGetUsersQuery,
} from "@/store/api/baseApi";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const BRAND_GREEN = "#00B140";

function joinDict(arr = []) {
  const dict = {};
  arr.forEach((x) => (dict[String(x.id)] = x));
  return dict;
}

export default function ReviewsAndFaq(props) {
  const { targetType, targetId } = props || {};

  // ---- запросы (masters/companies/users можно без условий)
  const { data: masters = [] } = useGetMastersQuery({ page: 1, limit: 12 });
  const { data: companies = [] } = useGetCompaniesQuery();
  const { data: users = [] } = useGetUsersQuery();

  // отзывы только при наличии цели
  const { data: reviews = [] } = useGetReviewsQuery(
    targetType && targetId ? { targetType, targetId } : skipToken
  );

  // ---- словари
  const usersById = useMemo(() => joinDict(users), [users]);
  const mastersById = useMemo(() => joinDict(masters), [masters]);
  const companiesById = useMemo(() => joinDict(companies), [companies]);

  // ---- карточки
  const cards = useMemo(() => {
    return reviews.map((r) => {
      const author = usersById[String(r.userId)];
      const target =
        r.targetType === "master"
          ? mastersById[String(r.targetId)]
          : companiesById[String(r.targetId)];

      return {
        id: r.id,
        title: author?.name || "Аноним",
        text: r.text,
        price: r.price ?? null,
        rating: r.rating,
        author: {
          name: author?.name || "Пользователь",
          avatar: author?.avatar || "/placeholder/user.png",
        },
        target: {
          name: target?.fullName || target?.name || "Профиль",
          avatar:
            (target?.photos && target.photos[0]) ||
            target?.logo ||
            "/placeholder/avatar.png",
          reviewsCount: target?.reviewsCount ?? 0,
        },
      };
    });
  }, [reviews, usersById, mastersById, companiesById]);

  // ---- FAQ раскрывашка
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="mt-12 space-y-12">
      {/* ---------- Отзывы ---------- */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Отзывы пользователей</h2>

        <div className="relative">
          <button
            className="swiper-prev absolute -left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white shadow border border-gray-200"
            aria-label="prev"
          >
            <LuChevronLeft />
          </button>

          <button
            className="swiper-next absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white shadow border border-gray-200"
            aria-label="next"
          >
            <LuChevronRight />
          </button>

          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={18}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
            navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
            pagination={{ el: ".swiper-dots", clickable: true }}
            className="pb-10"
          >
            {cards.map((c) => (
              <SwiperSlide key={c.id}>
                <article className="h-full rounded-2xl bg-white border border-gray-100 shadow-[0_8px_28px_rgba(17,24,39,0.06)] p-5 flex flex-col">
                  <div
                    className="w-8 h-8 rounded-full mb-3"
                    style={{ background: BRAND_GREEN, opacity: 0.15 }}
                  />
                  <h3 className="font-semibold">{c.title}</h3>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-6">{c.text}</p>

                  <div className="mt-4 text-[12px] text-gray-500">Стоимость работ:</div>
                  <div className="font-semibold">
                    {c.price !== null && c.price !== undefined
                      ? `${Number(c.price).toLocaleString("ru-RU")} cӯм`
                      : "—"}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
                        <Image src={c.author.avatar} alt="Автор" width={32} height={32} />
                      </div>
                      <div className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
                        <Image src={c.target.avatar} alt="Профиль" width={32} height={32} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-700">
                      <div className="font-medium">{c.author.name}</div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span>★</span>
                        <span className="text-gray-600">{c.rating}</span>
                        <span className="text-gray-400">
                          · {c.target.reviewsCount} отзывов
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-dots !bottom-0 flex items-center justify-center gap-2 mt-3" />
        </div>
      </div>

      {/* ---------- FAQ ---------- */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Часто задаваемые вопросы</h2>
        {/* заполни контентом по необходимости */}
      </div>
    </section>
  );
}
