// src/components/sections/ServicesCatalog.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuBoxes, LuZap, LuWrench, LuArmchair, LuChevronRight,
  LuFile, // или LuFilePen
  LuUsers, LuCoins, LuShieldCheck, LuMessageSquare,
  LuBadgeCheck, LuPhone, LuStar, LuFilter
} from "react-icons/lu";
import {
  useGetCategoriesQuery,
  useGetServicesQuery,
  useGetMastersQuery
} from "@/store/api/baseApi";

const BRAND = { green: "#00B140", greenLight: "#E8F8EE", dark: "#111827" };

/** поддержим и ед/мн. число в названиях */
const CAT_ICON = {
  "Электрика": LuZap,
  "Электрики": LuZap,
  "Сантехника": LuWrench,
  "Сантехники": LuWrench,
  "Мебель и кухни": LuArmchair,
  "Мебель на заказ": LuArmchair
};

const ALL_TABS = [
  { key: "request",  label: "Заявка",        href: "/request",  icon: LuFile },
  { key: "masters",  label: "Мастера",       href: "/masters",  icon: LuUsers,       badge: 6175, local: true },
  { key: "prices",   label: "Цены",          href: "/prices",   icon: LuCoins },
  { key: "services", label: "Сервисы",       href: "/services", icon: LuShieldCheck,  local: true },
  { key: "chat",     label: "Чат поддержки", href: "/support",  icon: LuMessageSquare },
];

function IconSafe({ Comp, className }) {
  const Fallback = LuBoxes;
  const Real = Comp ?? Fallback;
  return <Real className={className} />;
}
function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x;}

/* UI: звёзды */
function Stars({ rating = 0 }) {
  const full = Math.round(Number(rating) || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar key={i} className={i < full ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );
}

/* Карточка мастера */
function MasterCard({ m, catName }) {
  const CatIcon = CAT_ICON[catName] || LuBoxes;
  return (
    <article className="bg-white rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden">
      <div className="p-5 flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
          <Image src="https://picsum.photos/seed/master-104-1/1200/800" width={700} height={500} loading="lazy" alt="" unoptimized />

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
        {["Диагностика/выезд", "Работа по часам", "Материал по опту"].map((t, i) => (
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

/* КАРТОЧКА сервиса (ваша) */
function ServiceCard({ s, catLabel }) {
  const IconComp = CAT_ICON[s.category] || CAT_ICON[catLabel];
  const img = s.image || "/placeholder.png";
  return (
    <article className="bg-white rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={img}
          alt={s.title}
          fill
          loading="lazy"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover"
        />
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-full text-white"
          style={{ background: BRAND.green }}
        >
          <IconSafe Comp={IconComp} className="text-[14px]" />
          {(s.category || catLabel || "Сервис").toUpperCase()}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-[15px] font-semibold leading-snug text-gray-900 min-h-[40px]">
          {s.title} {s.subtitle && <span className="text-gray-500">{s.subtitle}</span>}
        </h3>

        <div className="mt-3 text-center rounded-xl border border-gray-200 py-3">
          <div className="text-xs text-gray-500 -mb-1">от</div>
          <div className="text-[24px] font-extrabold text-gray-900">
            {Number(s.price ?? 0).toLocaleString("ru-RU")}{" "}
            <span className="text-[14px] font-bold">{s.currency ?? "сомони"}</span>
          </div>
        </div>

        <button
          className="mt-4 w-full rounded-full text-white font-semibold py-3 hover:opacity-95 active:opacity-90 transition"
          style={{ background: BRAND.green }}
        >
          Заказать услугу
        </button>

        <div className="mt-3 flex items-center justify-center">
          <Link href={`/services/${s.id}`} className="group inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
            Подробнее
            <LuChevronRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
console.log('services:', services?.length, services);

export default function ServicesCatalog({ activeTabKey = "masters", cityId, pageSize = 12 }) {
  /* локальные табы: переключаем Мастера/Сервисы без навигации */
  const [tabKey, setTabKey] = useState(activeTabKey); // "masters" | "services"
  const tabs = ALL_TABS;
  const idx = useMemo(() => Math.max(0, tabs.findIndex(t => t.key === tabKey)), [tabs, tabKey]);

  const [underlineStyle, setUnderlineStyle] = useState({ transform: "translateX(0)", width: 0 });
  const tabMeasureRefs = useRef([]);

  useEffect(() => {
    const el = tabMeasureRefs.current[idx];
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const parentLeft = el.parentElement.getBoundingClientRect().left;
    const w = Math.max(56, width * 0.28); // узкая линия как на макете
    const x = left - parentLeft + (width - w) / 2;
    setUnderlineStyle({ transform: `translateX(${x}px)`, width: w });
  }, [idx, tabs.length]);

  /* Данные */
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: services = [], isLoading: loadingServices } = useGetServicesQuery();

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]); // накопленные мастера
  const { data: pageData = [], isLoading: loadingMasters } = useGetMastersQuery({
    cityId,
    categoryId: undefined,
    page,
    limit: pageSize,
  });

 useEffect(() => {
  if (!pageData || pageData.length === 0) return;

  setRows(prev =>
    page === 1
      ? pageData
      : [...prev, ...pageData.filter(item => !prev.some(p => p.id === item.id))]
  );
}, [pageData, page]);


  /* Фильтры */
  const [cat, setCat] = useState("all");
  const [sub, setSub] = useState("all");
  const [mix, setMix] = useState(0);

  const activeCatObj = useMemo(
    () => (cat === "all" ? null : categories.find((c) => String(c.id) === String(cat))),
    [cat, categories]
  );
  const activeSubs = activeCatObj?.subcategories || [];

  /* для мастеров: клиентский фильтр по категории/сабу */
  const mastersFiltered = useMemo(() => {
    let list = rows;
    if (cat !== "all") {
      const catId = Number(cat);
      list = list.filter(m => Number(m.categoryId) === catId);
    }
    if (sub !== "all") {
      const sId = Number(sub);
      list = list.filter(m => Array.isArray(m.subCategoryIds) && m.subCategoryIds.includes(sId));
    }
    return list;
  }, [rows, cat, sub]);

  /* для сервисов: ваш фильтр */
  const servicesFiltered = useMemo(() => {
    if (!services.length) return [];
    let list = services;
    if (cat !== "all") {
      const catId = Number(cat);
      list = list.filter((s) => {
        if (s.categoryId != null) return Number(s.categoryId) === catId;
        return s.category && activeCatObj && (s.category === activeCatObj.name);
      });
    }
    if (sub !== "all") {
      const subId = Number(sub);
      list = list.filter((s) => {
        if (s.subCategoryId != null) return Number(s.subCategoryId) === subId;
        const found = activeSubs.find((x) => Number(x.id) === subId);
        return found ? s.subcategory === found.name : true;
      });
    }
    if (cat === "all" && sub === "all") return shuffle(list);
    return list;
  }, [services, cat, sub, activeCatObj, activeSubs, mix]);

  const onCat = (value) => { setCat(value); setSub("all"); if (value === "all") setMix((v)=>v+1); };

  /* отображаемое имя категории по id мастера */
  const catNameById = useMemo(() => Object.fromEntries(categories.map(c => [String(c.id), c.name])), [categories]);

  const isMastersTab = tabKey === "masters";
  const isLoading = isMastersTab ? (loadingMasters && rows.length === 0) : loadingServices;

  const canLoadMore = isMastersTab ? ((pageData?.length || 0) >= pageSize) : false;

  return (
    <section className="w-full bg-white">
      {/* ===== ВЕРХНИЕ ТАБЫ (локальные для masters/services) ===== */}
      <div className="relative">
        <div className="flex items-center justify-around gap-4 px-4 sm:px-6">
          {tabs.map((t, i) => {
            const isActive = i === idx;
            const content = (
              <>
                <div ref={(n)=>tabMeasureRefs.current[i]=n} className="relative flex items-center gap-2">
                  <IconSafe Comp={t.icon} className="text-2xl" />
                  {t.badge && (
                    <span className={[
                      "px-1.5 py-[1px] rounded-md text-[11px] font-semibold",
                      isActive ? "bg-[color:var(--brand-green)] text-white" : "bg-gray-200 text-gray-700"
                    ].join(" ")}>
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm font-medium">{t.label}</div>
              </>
            );

            // локальные табы — без перехода, просто меняем состояние
            if (t.local) {
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTabKey(t.key)}
                  className={[
                    "group relative flex flex-col items-center justify-center py-4 select-none",
                    "text-gray-500 hover:text-gray-800",
                    isActive ? "text-[color:var(--brand-green)]" : ""
                  ].join(" ")}
                  style={{ ["--brand-green"]: BRAND.green }}
                >
                  {content}
                </button>
              );
            }

            // остальные — настоящие ссылки
            return (
              <Link
                key={t.key}
                href={t.href}
                className={[
                  "group relative flex flex-col items-center justify-center py-4 select-none",
                  "text-gray-500 hover:text-gray-800",
                  isActive ? "text-[color:var(--brand-green)]" : ""
                ].join(" ")}
                style={{ ["--brand-green"]: BRAND.green }}
              >
                {content}
              </Link>
            );
          })}
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200" />
        <div
          className="absolute bottom-0 h-[3px] rounded-full transition-transform duration-300 ease-out"
          style={{ backgroundColor: BRAND.green, width: underlineStyle.width, transform: underlineStyle.transform }}
        />
      </div>

      {/* заголовок + иконка фильтра справа */}
      <div className="flex items-center justify-between px-4 sm:px-0 mt-4">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider">
          {isMastersTab ? "Мастера" : "Сервисы"  }
        </h2>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <LuFilter />
          фильтр
        </button>
      </div>

      {/* ===== ФИЛЬТРЫ КАТЕГОРИЙ ===== */}
      <div className="mt-3 -mx-4 sm:mx-0">
        <div className="flex gap-2 sm:gap-3 items-center justify-start sm:justify-center overflow-x-auto no-scrollbar px-4 sm:px-0 py-2">
          <button
            onClick={() => onCat("all")}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border"
            style={{ borderColor: BRAND.green, color: BRAND.green, background: "#fff" }}
          >
            <IconSafe Comp={LuBoxes} className="text-base" />
            Все
          </button>

          {categories.map((c) => {
            const IconComp = CAT_ICON[c.name];
            const active = String(cat) === String(c.id);
            return (
              <button
                key={c.id}
                onClick={() => onCat(c.id)}
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

      {/* ===== ФИЛЬТРЫ ПОДКАТЕГОРИЙ ===== */}
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

      {/* ===== ГРИД ===== */}
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden bg-white animate-pulse">
              <div className="w-full h-40 bg-gray-100" />
              <div className="p-6 space-y-4">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-10 w-1/2 bg-gray-100 rounded" />
                <div className="h-11 w-full bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}

        {!isLoading && isMastersTab && mastersFiltered.map((m) => (
          <MasterCard key={m.id} m={m} catName={catNameById[String(m.categoryId)]} />
        ))}

        {!isLoading && !isMastersTab && servicesFiltered.map((s) => (
          <ServiceCard key={s.id} s={s} catLabel={activeCatObj?.name} />
        ))}
      </div>

      {/* ===== ПАГИНАЦИЯ только для мастеров ===== */}
      {isMastersTab && (
        <div className="flex items-center justify-center my-6">
          {canLoadMore ? (
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-6 py-3 rounded-full bg-[#F2F9F4] text-[color:var(--brand-green)] font-semibold border border-green-200 hover:bg-green-50"
              style={{ ["--brand-green"]: BRAND.green }}
            >
              Загрузить ещё
            </button>
          ) : (
            <div className="text-sm text-gray-500">Это все мастера по текущему фильтру</div>
          )}
        </div>
      )}

      {/* ===== ССЫЛКА «Посмотреть все» (для сервиса оставим ссылку) ===== */}
      {!isMastersTab && (
        <div className="flex items-center justify-center text-sm text-gray-600 mt-6">
          <Link href="/services" className="group inline-flex items-center gap-1">
            <span>Посмотреть все</span>
            <LuChevronRight className="text-[18px] text-[#00B140] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
