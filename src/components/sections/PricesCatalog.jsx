// src/components/sections/PricesCatalog.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuBoxes, LuZap, LuWrench, LuArmchair, LuChevronRight,
  LuFile, LuUsers, LuCoins, LuShieldCheck, LuMessageSquare
} from "react-icons/lu";
import {
  useGetCategoriesQuery,
  useGetServicesQuery,
  useGetMastersQuery
} from "@/store/api/baseApi";

/* ===== брендовые цвета ===== */
const BRAND = { green: "#00B140", greenLight: "#E8F8EE", dark: "#111827" };

/* ===== иконки категорий ===== */
const CAT_ICON = {
  Электрика: LuZap,
  Электрики: LuZap,
  Сантехника: LuWrench,
  Сантехники: LuWrench,
  "Мебель и кухни": LuArmchair,
  "Мебель на заказ": LuArmchair,
};
const IconSafe = ({ Comp, className }) => {
  const Fallback = LuBoxes;
  const R = typeof Comp === "function" ? Comp : Fallback;
  return <R className={className} />;
};

/* ===== локальные табы (без навигации) ===== */
const ALL_TABS = [
  { key: "request",  label: "Заявка",        href: "/request",  icon: LuFile },
  { key: "masters",  label: "Мастера",       href: "/masters",  icon: LuUsers,       badge: 6175, local: true },
  { key: "prices",   label: "Цены",          href: "/prices",   icon: LuCoins,       local: true }, // <- локально
  { key: "services", label: "Сервисы",       href: "/services", icon: LuShieldCheck, local: true },
  { key: "chat",     label: "Чат поддержки", href: "/support",  icon: LuMessageSquare },
];

/* ===== утилиты ===== */
const fmtPrice = (n) => `От ${Number(n || 0).toLocaleString("ru-RU")} с.`;
function groupServicesByCategory(services = []) {
  const map = new Map();
  for (const s of services) {
    if (!s?.categoryId) continue;
    if (!map.has(s.categoryId)) map.set(s.categoryId, []);
    map.get(s.categoryId).push(s);
  }
  // сортируем внутри категории по цене
  for (const [k, arr] of map.entries()) {
    arr.sort((a,b)=>(a.price??0)-(b.price??0));
    map.set(k, arr);
  }
  return map;
}

/* ===== карточка категории с ценами ===== */
function PriceCard({ cat, items = [], mastersCount = 0 }) {
  const IconComp = CAT_ICON[cat?.name] || LuBoxes;

  return (
    <article className="bg-white rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden p-4 sm:p-5">
      {/* шапка */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconSafe Comp={IconComp} className="text-[22px]" />
          <h3 className="font-semibold text-gray-900">{cat?.name}</h3>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <LuUsers />
          <span>{mastersCount}</span>
          <span>мастеров на сайте</span>
        </div>
      </div>

      {/* список услуг */}
      <div className="mt-3 space-y-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
            <span className="truncate">{s.title}</span>
            <span className="flex-1 border-b border-dotted mx-2 opacity-50" />
            <span
              className="whitespace-nowrap font-semibold text-[color:var(--brand-green)]"
              style={{ ["--brand-green"]: BRAND.green }}
            >
              {fmtPrice(s.price)}
            </span>
          </div>
        ))}
      </div>

      {/* кнопки */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="h-10 rounded-full bg-white border text-gray-700 hover:bg-gray-50 flex items-center justify-center text-sm font-semibold"
          // тут можно повесить локальное открытие модалки со списком мастеров
        >
          Показать мастеров
        </button>
        <button
          type="button"
          className="h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold hover:opacity-95 active:opacity-90"
          style={{ background: BRAND.green }}
          // тут можно открыть форму "Вызвать мастера" без навигации
        >
          Вызвать мастера
        </button>
      </div>

      {/* “перейти на страницу цен” — оставим ссылкой, если всё же нужна */}
      <div className="mt-3 flex items-center justify-end">
        <Link
          href={`/prices/${cat?.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          Перейти на страницу цен
          <LuChevronRight />
        </Link>
      </div>
    </article>
  );
}

/* ===== главный компонент ===== */
export default function PricesCatalog({
  activeTabKey = "prices", // стартовый таб
  cityId,                  // опционально: для фильтра мастеров по городу
  perCard = 5,             // сколько услуг показывать в карточке
}) {
  /* локальные табы */
  const [tabKey, setTabKey] = useState(activeTabKey); // "masters" | "prices" | "services"
  const tabs = ALL_TABS;
  const idx = useMemo(() => Math.max(0, tabs.findIndex(t => t.key === tabKey)), [tabs, tabKey]);

  const underline = useRef({ w: 0, x: 0 });
  const [u, setU] = useState({ w: 0, x: 0 });
  const refs = useRef([]);

  useEffect(() => {
    const el = refs.current[idx];
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const parentLeft = el.parentElement.getBoundingClientRect().left;
    const w = Math.max(56, width * 0.28);
    const x = left - parentLeft + (width - w) / 2;
    underline.current = { w, x };
    setU({ w, x });
  }, [idx, tabs.length]);

  /* данные */
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: services = [], isLoading: loadingServices } = useGetServicesQuery();
  const { data: masters = [], isLoading: loadingMasters } = useGetMastersQuery({
    page: 1, limit: 1000, cityId
  });

  /* фильтры */
  const [cat, setCat] = useState("all");
  const [sub, setSub] = useState("all");

  const activeCatObj = useMemo(
    () => (cat === "all" ? null : categories.find((c) => String(c.id) === String(cat))),
    [cat, categories]
  );
  const activeSubs = activeCatObj?.subcategories || [];

  /* подготовка данных */
  const grouped = useMemo(() => groupServicesByCategory(services), [services]);

  const mastersCountByCat = useMemo(() => {
    const dict = {};
    for (const m of masters) {
      const cid = Number(m.categoryId);
      if (!cid) continue;
      dict[cid] = (dict[cid] || 0) + 1;
    }
    return dict;
  }, [masters]);

  const visibleCats = useMemo(() => {
    const list = categories.filter((c) => grouped.has(c.id));
    if (cat === "all") return list;
    return list.filter((c) => String(c.id) === String(cat));
  }, [categories, grouped, cat]);

  const filteredGrouped = useMemo(() => {
    // Если выбрана подкатегория — оставляем в карточках только услуги этой подкатегории
    if (sub === "all") return grouped;
    const res = new Map();
    const subId = Number(sub);
    for (const [cid, arr] of grouped.entries()) {
      const part = arr.filter(s => Number(s.subCategoryId) === subId);
      if (part.length) res.set(cid, part);
    }
    return res;
  }, [grouped, sub]);

  const isPricesTab = tabKey === "prices";
  const isLoading = isPricesTab ? loadingServices : loadingMasters; // для шима

  return (
    <section className="w-full bg-white">
      {/* ===== ВЕРХНИЕ ТАБЫ (локальные) ===== */}
      <div className="relative">
        <div className="flex items-center justify-around gap-4 px-4 sm:px-6">
          {tabs.map((t, i) => {
            const isActive = i === idx;
            const content = (
              <>
                <div ref={(n)=>refs.current[i]=n} className="relative flex items-center gap-2">
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

            return t.local ? (
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
            ) : (
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
          style={{ backgroundColor: BRAND.green, width: u.w, transform: `translateX(${u.x}px)` }}
        />
      </div>

      {/* заголовок + фильтры */}
      <div className="flex items-center justify-between px-4 sm:px-0 mt-4">
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider">
          {isPricesTab ? "Цены" : "Мастера"}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {/* селект категорий */}
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            value={cat}
            onChange={(e) => { setCat(e.target.value); setSub("all"); }}
          >
            <option value="all">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* селект подкатегорий */}
          {cat !== "all" && !!activeSubs.length && (
            <select
              className="rounded-xl border px-3 py-2 text-sm"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
            >
              <option value="all">Все подкатегории</option>
              {activeSubs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* сетка карточек */}
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {/* шиммер */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden bg-white animate-pulse">
              <div className="w-full h-36 bg-gray-100" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
                <div className="h-10 w-full bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}

        {/* цены (локальный таб) */}
        {isPricesTab && !isLoading &&
          (cat === "all" ? visibleCats : visibleCats).map((c) => {
            const arrAll = filteredGrouped.get(c.id) || [];
            const items = arrAll.slice(0, perCard);
            return (
              <PriceCard
                key={c.id}
                cat={c}
                items={items}
                mastersCount={mastersCountByCat[c.id] || 0}
              />
            );
          })}
      </div>

      {/* Если переключат на "Мастера" — можно сюда добавить вашу сетку мастеров,
          но по просьбе оставляем только переход табами без роутинга */}
    </section>
  );
}
