// src/app/masters/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuFileEdit, LuUsers, LuCoins, LuShield, LuMessageSquare,
  LuPhone, LuStar, LuBadgeCheck, LuFilter,
} from "react-icons/lu";
import { useGetMastersQuery, useGetCategoriesQuery } from "@/store/api/baseApi";

const BRAND = { green: "#00B140" };

/* ---------- utils ---------- */
function SafeIcon({ Comp, className }) {
  const Fallback = LuUsers;
  const R = Comp && typeof Comp === "function" ? Comp : Fallback;
  return <R className={className} />;
}
function classNames(...a) { return a.filter(Boolean).join(" "); }

/* ---------- top tabs ---------- */
const TABS = [
  { key: "request",  label: "Заявка",        href: "/request",  icon: LuFileEdit },
  { key: "masters",  label: "Мастера",       href: "/masters",  icon: LuUsers, badge: 4695 },
  { key: "prices",   label: "Цены",          href: "/prices",   icon: LuCoins },
  { key: "services", label: "Сервисы",       href: "/services", icon: LuShield },
  { key: "chat",     label: "Чат поддержки", href: "/support",  icon: LuMessageSquare },
];

function TopTabs({ activeKey = "masters" }) {
  const tabsRef = useRef([]);
  const [u, setU] = useState({ w: 0, x: 0 });
  const idx = useMemo(() => Math.max(0, TABS.findIndex(t => t.key === activeKey)), [activeKey]);

  useEffect(() => {
    const el = tabsRef.current[idx];
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const parentLeft = el.parentElement.getBoundingClientRect().left;
    const w = Math.max(56, width * 0.28);
    const x = left - parentLeft + (width - w) / 2;
    setU({ w, x });
  }, [idx]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6">
        {TABS.map((t, i) => {
          const active = i === idx;
          return (
            <Link
              key={t.key}
              href={t.href}
              className={classNames(
                "group relative flex flex-col items-center justify-center py-4 select-none",
                "text-gray-500 hover:text-gray-800",
                active && "text-[color:var(--brand-green)]",
              )}
              style={{ ["--brand-green"]: BRAND.green }}
            >
              <div ref={(n)=>tabsRef.current[i]=n} className="relative flex items-center gap-2">
                <SafeIcon Comp={t.icon} className="text-2xl" />
                {t.badge && (
                  <span className={classNames(
                    "px-1.5 py-[1px] rounded-md text-[11px] font-semibold",
                    active ? "bg-[color:var(--brand-green)] text-white" : "bg-gray-200 text-gray-700"
                  )}>
                    {t.badge}
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm font-medium">{t.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200" />
      <div
        className="absolute bottom-0 h-[3px] rounded-full transition-transform duration-300 ease-out"
        style={{ backgroundColor: BRAND.green, width: u.w, transform: `translateX(${u.x}px)` }}
      />
    </div>
  );
}

/* ---------- звёзды ---------- */
function Stars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar key={i} className={i < full ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );
}

/* ---------- карточка мастера ---------- */
function MasterCard({ m }) {
  return (
    <article className="bg-white rounded-[18px] border border-gray-100 shadow-[0_10px_28px_rgba(17,24,39,0.07)] overflow-hidden">
      <div className="p-4 flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
          <Image
            src={m.avatar || "/placeholder.png"}
            alt={m.fullName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 truncate">{m.fullName}</h3>
            {m.verified && <LuBadgeCheck className="text-green-500" title="Проверенный" />}
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <Stars rating={m.rating} />
            <span className="text-gray-600">{typeof m.rating === "number" ? m.rating.toFixed(1) : m.rating}</span>
            <span>•</span>
            <span>{m.reviewsCount} отзывов</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[11px] font-bold">24/7</span>
            <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[11px] font-bold">Срочный вызов</span>
          </div>
        </div>

        <a
          href={`tel:${m.phone || ""}`}
          className="ml-auto w-10 h-10 rounded-full bg-[color:var(--brand-green)] text-white flex items-center justify-center hover:opacity-90"
          style={{ ["--brand-green"]: BRAND.green }}
          aria-label="Позвонить"
        >
          <LuPhone className="text-xl" />
        </a>
      </div>

      {/* три услуги с точечной линией и ценой "от" */}
      <div className="px-4 pb-4">
        {[
          "Устранить течь",
          "Развести трубы",
          "Установить розетки",
        ].map((t, i) => (
          <div key={i} className="flex items-center text-[13px] text-gray-700">
            <span className="whitespace-nowrap">{t}</span>
            <span className="flex-1 border-b border-dotted mx-2 opacity-40" />
            <span className="whitespace-nowrap text-gray-500">
              от {Number((m.priceFrom ?? 0) * (1 + i * 0.25)).toLocaleString("ru-RU")} сoмони
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ---------- рекламный блок ---------- */
function AdCard() {
  return (
    <article className="bg-white rounded-[18px] border border-amber-300 shadow-[0_10px_28px_rgba(17,24,39,0.07)] overflow-hidden">
      <div className="p-4">
        <div className="text-xs text-amber-700 font-semibold mb-1">Реклама</div>
        <div className="relative w-full h-40 bg-amber-50 rounded-xl overflow-hidden">
          <Image src="/demo/ad-yandexgo.png" alt="ad" fill className="object-contain p-3" />
        </div>
        <p className="mt-3 text-sm text-gray-700">
          Стань курьером Yandex Eats — заработай до 10 000 сомони/мес. Гибкий график и бонусы.
        </p>
        <a
          href="tel:+992988776543"
          className="mt-3 inline-flex items-center justify-center w-full rounded-full bg-amber-500 text-white py-2 font-semibold"
        >
          +992 98 877 65 43
        </a>
      </div>
    </article>
  );
}

/* ---------- страница мастеров ---------- */
function MastersGrid({ cityId, categoryId, pageSize = 11 }) {
  const [page, setPage] = useState(1);
  useGetCategoriesQuery();
  const { data: masters = [], isLoading } = useGetMastersQuery({
    cityId, categoryId, page, limit: pageSize,
  });

  const canLoadMore = masters?.length >= pageSize;

  return (
    <section className="w-full bg-white">
      <TopTabs activeKey="masters" />

      <div className="flex items-center justify-between px-4 sm:px-0 mt-4">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider">Результат</h2>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <LuFilter />
          фильтр
        </button>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {page === 1 && <AdCard />}

        {isLoading &&
          Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-[18px] border border-gray-100 bg-white shadow-[0_10px_28px_rgba(17,24,39,0.07)] animate-pulse" />
          ))}

        {!isLoading && masters?.map((m) => <MasterCard key={m.id} m={m} />)}
      </div>

      <div className="flex items-center justify-center my-6">
        {canLoadMore ? (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 rounded-full bg-[#F2F9F4] text-[color:var(--brand-green)] font-semibold border border-green-200 hover:bg-green-50"
            style={{ ["--brand-green"]: BRAND.green }}
          >
            Загрузить ещё
          </button>
        ) : (
          <div className="text-sm text-gray-500">Больше мастеров нет</div>
        )}
      </div>
    </section>
  );
}

/* Next.js page export */
export default function Page() {
  return <MastersGrid />;
}
