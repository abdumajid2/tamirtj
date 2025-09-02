// src/components/sections/MastersCatalog.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuBoxes, LuZap, LuWrench, LuArmchair, LuChevronRight,
  LuFileEdit, LuUsers, LuCoins, LuShieldCheck, LuMessageSquare,
  LuBadgeCheck, LuPhone, LuStar, LuFilter
} from "react-icons/lu";
import { useGetCategoriesQuery, useGetMastersQuery } from "@/store/api/baseApi";


const BRAND = { green: "#00B140", greenLight: "#E8F8EE", dark: "#111827" };

const CAT_ICON = {
  Электрика: LuZap,
  Электрики: LuZap,
  Сантехника: LuWrench,
  Сантехники: LuWrench,
  "Мебель и кухни": LuArmchair,
};
const IconSafe = ({ Comp, className }) => {
  const Fallback = LuBoxes;
  const R = typeof Comp === "function" ? Comp : Fallback;
  return <R className={className} />;
};

const TABS = [
  { key: "request",  label: "Заявка",        href: "/request",  icon: LuFileEdit },
  { key: "masters",  label: "Мастера",       href: "/masters",  icon: LuUsers, badge: 6175 },
  { key: "prices",   label: "Цены",          href: "/prices",   icon: LuCoins },
  { key: "services", label: "Сервисы",       href: "/services", icon: LuShieldCheck },
  { key: "chat",     label: "Чат поддержки", href: "/support",  icon: LuMessageSquare },
];

function TopTabs({ activeKey = "masters" }) {
  const idx = useMemo(() => Math.max(0, TABS.findIndex(t => t.key === activeKey)), [activeKey]);
  const refs = useRef([]);
  const [u, setU] = useState({ w: 0, x: 0 });

  useEffect(() => {
    const el = refs.current[idx];
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const parentLeft = el.parentElement.getBoundingClientRect().left;
    const w = Math.max(56, width * 0.28);
    const x = left - parentLeft + (width - w) / 2;
    setU({ w, x });
  }, [idx]);

  return (
    <div className="relative">
      <div className="flex items-center justify-around gap-4 px-4 sm:px-6">
        {TABS.map((t, i) => {
          const active = i === idx;
          return (
            <Link
              key={t.key}
              href={t.href}
              className={[
                "group relative flex flex-col items-center justify-center py-4 select-none",
                "text-gray-500 hover:text-gray-800",
                active ? "text-[color:var(--brand-green)]" : ""
              ].join(" ")}
              style={{ ["--brand-green"]: BRAND.green }}
            >
              <div ref={(n)=>refs.current[i]=n} className="relative flex items-center gap-2">
                <IconSafe Comp={t.icon} className="text-2xl" />
                {t.badge && (
                  <span className={[
                    "px-1.5 py-[1px] rounded-md text-[11px] font-semibold",
                    active ? "bg-[color:var(--brand-green)] text-white" : "bg-gray-200 text-gray-700"
                  ].join(" ")}>
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


const Stars = ({ rating = 0 }) => {
  const full = Math.round(Number(rating) || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar key={i} className={i < full ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );
};

function MasterCard({ m }) {
  const catName = m.categoryName || m.category || ""; // если прокинешь имя категории
  const CatIcon = CAT_ICON[catName] || LuBoxes;

  return (
    <article className="bg-white rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden">
      <div className="p-5 flex items-start gap-3">
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
            <span className="text-gray-600">{Number(m.rating).toFixed(1)}</span>
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

      <div className="px-5 pb-5">
        {[
          "Диагностика/выезд",
          "Работа по часам",
          "Материал по опту",
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

      <div className="px-5 pb-5 -mt-2">
        <span
          className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-full text-white"
          style={{ background: BRAND.green }}
        >
          <CatIcon className="text-[14px]" />
          {(catName || "Мастер").toUpperCase()}
        </span>
      </div>

      <div className="px-5 pb-5 -mt-3">
        <Link href={`/masters/${m.id}`} className="group inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          Подробнее
          <LuChevronRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}


export default function MastersCatalog({
  cityId,
  activeTabKey = "masters",
  pageSize = 12,
}) {
  const PAGE_LIMIT = pageSize;

 
  const { data: categories = [] } = useGetCategoriesQuery();

 
  const [cat, setCat] = useState("all"); 
  const [sub, setSub] = useState("all"); 

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);


  const { data: pageData = [], isLoading, isFetching, error } = useGetMastersQuery({
    cityId,
    categoryId: cat === "all" ? undefined : Number(cat),
    page,
    limit: PAGE_LIMIT,
  });

  useEffect(() => {
    setPage(1);
    setRows([]);
  }, [cat, sub]);

  useEffect(() => {
    if (!pageData) return;
    setRows(prev => (page === 1 ? pageData : [...prev, ...pageData]));
  }, [pageData, page]);

  const activeCatObj = useMemo(
    () => (cat === "all" ? null : categories.find((c) => String(c.id) === String(cat))),
    [cat, categories]
  );
  const activeSubs = activeCatObj?.subcategories || [];


  const displayed = useMemo(() => {
    const base = rows.length ? rows : pageData;
    if (sub === "all") return base;
    const sId = Number(sub);
    return (base || []).filter(
      (m) => Array.isArray(m.subCategoryIds) && m.subCategoryIds.includes(sId)
    );
  }, [rows, pageData, sub]);


  const canLoadMore = (pageData?.length || 0) === PAGE_LIMIT;

  return (
    <section className="w-full bg-white">
   
      <TopTabs activeKey={activeTabKey} />


      <div className="flex items-center justify-between px-4 sm:px-0 mt-4">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider">Мастера</h2>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <LuFilter />
          фильтр
        </button>
      </div>

      <div className="mt-3 -mx-4 sm:mx-0">
        <div className="flex gap-2 sm:gap-3 items-center justify-start sm:justify-center overflow-x-auto no-scrollbar px-4 sm:px-0 py-2">
          <button
            onClick={() => { setCat("all"); setSub("all"); }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border"
            style={{ borderColor: BRAND.green, color: BRAND.green, background: "#fff" }}
          >
            <IconSafe Comp={LuBoxes} className="text-base" />
            Все
          </button>

          {categories.map((c) => {
            const IconComp = CAT_ICON[c.name] || LuBoxes;
            const active = String(cat) === String(c.id);
            return (
              <button
                key={c.id}
                onClick={() => { setCat(c.id); setSub("all"); }}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border",
                  active ? "ring-2 ring-green-200" : ""
                ].join(" ")}
                style={{ borderColor: BRAND.green, color: BRAND.green, background: "#fff" }}
              >
                <IconSafe Comp={IconComp} className="text-base" />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {cat !== "all" && !!activeSubs.length && (
        <div className="-mx-4 sm:mx-0">
          <div className="flex gap-2 sm:gap-3 items-center justify-start sm:justify-center overflow-x-auto no-scrollbar px-4 sm:px-0 py-1">
            <button
              onClick={() => setSub("all")}
              className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold border"
              style={{ borderColor: BRAND.green, color: BRAND.green, background: "#fff" }}
            >
              Все подкатегории
            </button>
            {activeSubs.map((s) => {
              const active = String(sub) === String(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => setSub(s.id)}
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold border",
                    active ? "ring-2 ring-green-200" : ""
                  ].join(" ")}
                  style={{ borderColor: BRAND.green, color: BRAND.green, background: "#fff" }}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && page === 1 &&
          Array.from({ length: PAGE_LIMIT }).map((_, i) => (
            <div key={i} className="rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden bg-white animate-pulse">
              <div className="w-full h-40 bg-gray-100" />
              <div className="p-6 space-y-4">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-10 w-1/2 bg-gray-100 rounded" />
                <div className="h-11 w-full bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}

        {!isLoading && !isFetching && displayed?.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500 py-8">
            Мастеров по текущему фильтру не найдено
          </div>
        )}

        {displayed.map((m) => (
          <MasterCard key={m.id} m={m} />
        ))}
      </div>


      <div className="flex items-center justify-center my-6">
        {canLoadMore ? (
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={isFetching}
            className="px-6 py-3 rounded-full bg-[#F2F9F4] text-[color:var(--brand-green)] font-semibold border border-green-200 hover:bg-green-50 disabled:opacity-60"
            style={{ ["--brand-green"]: BRAND.green }}
          >
            {isFetching ? "Загрузка..." : "Загрузить ещё"}
          </button>
        ) : (
          <div className="text-sm text-gray-500">Это все мастера по текущему фильтру</div>
        )}
      </div>


      {error && (
        <div className="mt-2 text-center text-xs text-red-500">
          Ошибка загрузки мастеров
        </div>
      )}
    </section>
  );
}
