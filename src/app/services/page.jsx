// src/components/sections/ServicesCatalog.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuBoxes, LuZap, LuWrench, LuArmchair, LuChevronRight, LuUsers,
  LuCoins, LuShieldCheck, LuMessageSquare, LuFile, LuBadgeCheck,
  LuPhone, LuStar, LuFilter, LuChevronDown, LuX,
  LuBookmarkPlus
} from "react-icons/lu";
import {
  useGetCategoriesQuery,
  useGetServicesQuery,
  useGetMastersQuery,
} from "@/store/api/baseApi";

const BRAND = { green: "#00B140", greenLight: "#E8F8EE", dark: "#111827" };

/** Иконки для категорий */
const CAT_ICON = {
  Электрика: LuZap,
  Электрики: LuZap,
  Сантехника: LuWrench,
  Сантехники: LuWrench,
  "Мебель и кухни": LuArmchair,
  "Мебель на заказ": LuArmchair,
};

function IconSafe({ Comp, className }) {
  const Fallback = LuBoxes;
  const Real = typeof Comp === "function" ? Comp : Fallback;
  return <Real className={className} />;
}
function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

/* ====== Табы ====== */
const ALL_TABS = [
  { key: "request",  label: "Заявка",          href: "/request",  icon: LuFile,          local: true },
  { key: "masters",  label: "Мастера",         href: "/masters",  icon: LuUsers,         badge: 6175, local: true },
  { key: "prices",   label: "Цены",            href: "/prices",   icon: LuCoins,         local: true },
  { key: "services", label: "Сервисы",         href: "/services", icon: LuShieldCheck,   local: true },
  { key: "chat",     label: "Чат поддержки",   href: "/support",  icon: LuMessageSquare },
];

/* ====== Вспомогательные UI ====== */
function Stars({ rating = 0 }) {
  const full = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <LuStar key={i} className={i < full ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );
}

/* ====== Карточки ====== */
function MasterCard({ m, catName }) {
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
            <span className="text-gray-600">{Number(m.rating || 0).toFixed(1)}</span>
            <span>•</span>
            <span>{m.reviewsCount ?? 0} отзывов</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[11px] font-bold">24/7</span>
            <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[11px] font-bold">Срочный вызов</span>
          </div>
        </div>

        <a
          href={`tel:${m.phone || ""}`}
          title={`Позвонить ${m.fullName}`}
          className="ml-auto w-10 h-10 rounded-full bg-[color:var(--brand-green)] text-white flex items-center justify-center hover:opacity-90"
          style={{ ["--brand-green"]: BRAND.green }}
          aria-label="Позвонить"
          rel="nofollow"
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
        <article className="flex items-center justify-between ">
          <div>

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
          Подробнее <LuChevronRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
            </div>

            <div className="px-5 pb-5 -mt-3 text-3xl cursor-pointer">
              <p style={{ color: BRAND.green }} title="В избранное" role="button" fill="" >
              <LuBookmarkPlus/>
              </p>
            </div>
          </article>
    </article>
  );
}

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
            Подробнее <LuChevronRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function PriceCard({ cat, items = [], mastersCount = 0 }) {
  const IconComp = CAT_ICON[cat?.name] || LuBoxes;
  const fmt = (n) => `От ${Number(n || 0).toLocaleString("ru-RU")} с.`;

  return (
    <article className="bg-white rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden p-4 sm:p-5">
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

      <div className="mt-3 space-y-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
            <span className="truncate">{s.title}</span>
            <span className="flex-1 border-b border-dotted mx-2 opacity-50" />
            <span
              className="whitespace-nowrap font-semibold text-[color:var(--brand-green)]"
              style={{ ["--brand-green"]: BRAND.green }}
            >
              {fmt(s.price)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="h-10 rounded-full bg-white border text-gray-700 hover:bg-gray-50 flex items-center justify-center text-sm font-semibold"
        >
          Показать мастеров
        </button>
        <button
          type="button"
          className="h-10 rounded-full text-white flex items-center justify-center text-sm font-semibold hover:opacity-95 active:opacity-90"
          style={{ background: BRAND.green }}
        >
          Вызвать мастера
        </button>
      </div>
    </article>
  );
}

/* ====== Модал фильтра ====== */
function FilterModal({
  open,
  onClose,
  categories = [],
  currentCat = "all",
  currentSub = "all",
  onApply,
}) {
  const [cat, setCat] = useState(currentCat);
  const [sub, setSub] = useState(currentSub);

  useEffect(() => {
    setCat(currentCat);
    setSub(currentSub);
  }, [currentCat, currentSub, open]);

  const activeCatObj =
    cat === "all" ? null : categories.find((c) => String(c.id) === String(cat));
  const subs = activeCatObj?.subcategories || [];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-[8%] -translate-x-1/2 w-[92%] max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-[16px] font-semibold text-gray-900">Фильтр</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <LuX />
          </button>
        </div>

        <div className="p-5 grid gap-4">
          <div>
            <div className="text-[13px] font-semibold text-gray-800 mb-2">Категория</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCat("all");
                  setSub("all");
                }}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  cat === "all"
                    ? "bg-[color:var(--brand-green)] text-white border-transparent"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
                style={{ ["--brand-green"]: BRAND.green }}
              >
                Все
              </button>
              {categories.map((c) => {
                const active = String(cat) === String(c.id);
                const IconComp = CAT_ICON[c.name];
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCat(c.id);
                      setSub("all");
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border flex items-center gap-2 ${
                      active
                        ? "bg-[color:var(--brand-green)] text-white border-transparent"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    style={{ ["--brand-green"]: BRAND.green }}
                  >
                    <IconSafe Comp={IconComp} className="text-base" />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {cat !== "all" && !!subs.length && (
            <div className="mt-1">
              <div className="text-[13px] font-semibold text-gray-800 mb-2">
                Подкатегория
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSub("all")}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    sub === "all"
                      ? "bg-slate-900 text-white border-transparent"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  Все подкатегории
                </button>
                {subs.map((s) => {
                  const active = String(sub) === String(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSub(s.id)}
                      className={`px-3 py-1.5 rounded-full text-sm border ${
                        active
                          ? "bg-slate-900 text-white border-transparent"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-end">
          <button
            onClick={() => {
              setCat("all");
              setSub("all");
              onApply?.("all", "all");
              onClose();
            }}
            className="h-10 px-4 rounded-full border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50"
          >
            Сбросить
          </button>
          <button
            onClick={() => {
              onApply?.(cat, sub);
              onClose();
            }}
            className="h-10 px-5 rounded-full text-white text-sm font-semibold"
            style={{ background: BRAND.green }}
          >
            Показать результаты
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====== Форма заявки (стилизованная) ====== */
function RequestForm() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <form className="max-w-xl mx-auto px-4 py-6">
      <div>
        <label className="block text-[15px] font-semibold text-gray-900 mb-2">
          Что нужно сделать?
        </label>
        <textarea
          rows={4}
          placeholder="Какую работу нужно выполнить? Кратко опишите задачу — двух-трёх предложений хватит…"
          className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-800 p-3 placeholder:text-gray-400"
        />
        <p className="mt-2 text-[12px] text-gray-500">
          Заполните детали или прикрепите фото — мастеру будет проще оценить работу.
        </p>
      </div>

      <div className="mt-6">
        <label className="block text-[15px] font-semibold text-gray-900 mb-2">
          Как с вами связаться?
        </label>
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2.5">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Tajikistan.svg"
            alt="TJ"
            width={20}
            height={14}
            className="rounded-sm"
          />
          <input
            type="tel"
            defaultValue="+992"
            placeholder="+992"
            className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="mt-6 border rounded-2xl p-3 border-emerald-500 bg-white shadow-[0_2px_8px_rgba(16,185,129,.08)]">
        <p className="text-[13px] text-gray-600 mb-2">
          Получите больше откликов, заполнив детали
        </p>
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 bg-gray-100/60 rounded-full px-4 py-2"
        >
          <span>Заполнить детали</span>
          <LuChevronDown
            className={`text-[18px] transition-transform ${detailsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {detailsOpen && (
          <div className="mt-4 grid gap-3">
            <input
              type="text"
              placeholder="Адрес (улица, дом, подъезд)"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Удобное время (например, сегодня 15:00–18:00)"
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <label className="block">
              <span className="text-[13px] text-gray-600">Фото проблемы (по желанию)</span>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:py-2 file:px-3 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </label>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-emerald-500 py-3.5 text-white font-semibold text-sm hover:bg-emerald-600 transition"
      >
        Отправить заявку
      </button>
    </form>
  );
}

/* ====== Главный компонент ====== */
export default function ServicesCatalog({
  activeTabKey = "masters",
  cityId,
  pageSize = 12,
  pricesPerCard = 5,
}) {
  const [tabKey, setTabKey] = useState(activeTabKey);
  const tabs = ALL_TABS;
  const idx = useMemo(
    () => Math.max(0, tabs.findIndex((t) => t.key === tabKey)),
    [tabs, tabKey]
  );

  // Полоска-подсветка
  const tabsWrapRef = useRef(null);
  const tabMeasureRefs = useRef([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({ transform: "translateX(0px)", width: 0 });

  useEffect(() => {
    const recalc = () => {
      const el = tabMeasureRefs.current[idx];
      const wrap = tabsWrapRef.current;
      if (!el || !wrap) return;
      const { left, width } = el.getBoundingClientRect();
      const baseLeft = wrap.getBoundingClientRect().left;

      const w = Math.max(56, Math.min(140, width * 0.6)); // ширина ~60% от таба
      const x = left - baseLeft + (width - w) / 2;

      setUnderlineStyle({ width: w, transform: `translateX(${x}px)` });
    };

    const raf = requestAnimationFrame(recalc);
    window.addEventListener("resize", recalc);
    window.addEventListener("orientationchange", recalc);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", recalc);
      window.removeEventListener("orientationchange", recalc);
    };
  }, [idx]);

  /* Данные */
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: services = [], isLoading: loadingServices } = useGetServicesQuery();

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);

  // нормализуем ответ мастеров на массив
  const qMasters = useGetMastersQuery({ cityId, categoryId: undefined, page, limit: pageSize });
  const raw = qMasters.data;
  const pageData = Array.isArray(raw) ? raw : (raw?.rows ?? raw?.data ?? []);
  const loadingMasters = qMasters.isLoading;

  useEffect(() => {
    if (!pageData || pageData.length === 0) return;
    setRows((prev) =>
      page === 1
        ? pageData
        : [...prev, ...pageData.filter((item) => !prev.some((p) => p.id === item.id))]
    );
  }, [pageData, page]);

  /* Фильтры */
  const [cat, setCat] = useState("all");
  const [sub, setSub] = useState("all");
  const [mix, setMix] = useState(0); // для перемешивания, если all

  const activeCatObj = useMemo(
    () => (cat === "all" ? null : categories.find((c) => String(c.id) === String(cat))),
    [cat, categories]
  );
  const activeSubs = activeCatObj?.subcategories || [];
  const catNameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [String(c.id), c.name])),
    [categories]
  );

  const mastersFiltered = useMemo(() => {
    let list = rows;
    if (cat !== "all") list = list.filter((m) => Number(m.categoryId) === Number(cat));
    if (sub !== "all")
      list = list.filter(
        (m) => Array.isArray(m.subCategoryIds) && m.subCategoryIds.includes(Number(sub))
      );
    return list;
  }, [rows, cat, sub]);

  const servicesFiltered = useMemo(() => {
    if (!services.length) return [];
    let list = services;
    if (cat !== "all") {
      const catId = Number(cat);
      list = list.filter((s) =>
        s.categoryId != null
          ? Number(s.categoryId) === catId
          : activeCatObj && s.category === activeCatObj.name
      );
    }
    if (sub !== "all") {
      const subId = Number(sub);
      list = list.filter((s) =>
        s.subCategoryId != null
          ? Number(s.subCategoryId) === subId
          : activeSubs.find((x) => Number(x.id) === subId)
          ? s.subcategory === activeSubs.find((x) => Number(x.id) === subId)?.name
          : true
      );
    }
    if (cat === "all" && sub === "all") return shuffle(list);
    return list;
  }, [services, cat, sub, activeCatObj, activeSubs, mix]);

  /* Группировка для вкладки "Цены" */
  const groupedServices = useMemo(() => {
    const map = new Map();
    for (const s of servicesFiltered) {
      const cId =
        s.categoryId ?? categories.find((c) => c.name === s.category)?.id;
      if (!cId) continue;
      if (!map.has(cId)) map.set(cId, []);
      map.get(cId).push(s);
    }
    for (const [, arr] of map.entries()) arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    return map;
  }, [servicesFiltered, categories]);

  const mastersCountByCat = useMemo(() => {
    const dict = {};
    for (const m of rows) {
      const cid = Number(m.categoryId);
      if (!cid) continue;
      dict[cid] = (dict[cid] || 0) + 1;
    }
    return dict;
  }, [rows]);

  const visibleCatsForPrices = useMemo(() => {
    const ids = [...groupedServices.keys()];
    return categories.filter((c) => ids.includes(c.id));
  }, [categories, groupedServices]);

  const isRequestTab = tabKey === "request";
  const isMastersTab = tabKey === "masters";
  const isPricesTab = tabKey === "prices";

  const isLoading = isMastersTab ? (loadingMasters && rows.length === 0) : loadingServices;
  const canLoadMore = isMastersTab ? (pageData?.length || 0) >= pageSize : false;

  return (
    <section className="w-full bg-white">
      {/* Табы */}
      <div className="relative">
        <div ref={tabsWrapRef} className="grid grid-cols-3 md:grid-cols-5 gap-4 px-4 sm:px-6">
          {ALL_TABS.map((t, i) => {
            const isActive = t.key === tabKey;

            const inner = (
              <>
                <div className="relative flex items-center gap-2">
                  <IconSafe Comp={t.icon} className="text-2xl" />
                  {t.badge && (
                    <span
                      className={[
                        "px-1.5 py-[1px] rounded-md text-[11px] font-semibold",
                        isActive ? "bg-[color:var(--brand-green)] text-white" : "bg-gray-200 text-gray-700",
                      ].join(" ")}
                      style={{ ["--brand-green"]: BRAND.green }}
                    >
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm font-medium">{t.label}</div>
              </>
            );

            const cls = [
              "group relative flex flex-col items-center justify-center py-4 select-none",
              "text-gray-500 hover:text-gray-800",
              isActive ? "text-[color:var(--brand-green)]" : "",
            ].join(" ");

            return t.local ? (
              <button
                key={t.key}
                ref={(n) => (tabMeasureRefs.current[i] = n)}
                type="button"
                onClick={() => setTabKey(t.key)}
                className={cls}
                style={{ ["--brand-green"]: BRAND.green }}
              >
                {inner}
              </button>
            ) : (
              <Link
                key={t.key}
                ref={(n) => (tabMeasureRefs.current[i] = n)}
                href={t.href}
                className={cls}
                style={{ ["--brand-green"]: BRAND.green }}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200 z-0" />
        <div
          className="absolute bottom-0 h-[3px] rounded-full transition-transform duration-300 ease-out z-10 pointer-events-none"
          style={{ backgroundColor: BRAND.green, width: underlineStyle.width, transform: underlineStyle.transform }}
        />
      </div>

      {/* Заголовок + фильтр (кроме заявки) */}
      {!isRequestTab && (
        <div className="flex items-center justify-between px-4 sm:px-0 mt-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider">
            {isMastersTab ? "Мастера" : isPricesTab ? "Цены" : "Сервисы"}
          </h2>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LuFilter /> фильтр
          </button>
        </div>
      )}

      {/* Контент */}
      {isRequestTab ? (
        <RequestForm />
      ) : (
        <>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[22px] border border-gray-100 shadow-[0_12px_40px_rgba(17,24,39,0.08)] overflow-hidden bg-white animate-pulse"
                >
                  <div className="w-full h-40 bg-gray-100" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-3/4 bg-gray-100 rounded" />
                    <div className="h-10 w-1/2 bg-gray-100 rounded" />
                    <div className="h-11 w-full bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}

            {!isLoading && isMastersTab &&
              mastersFiltered.map((m) => (
                <MasterCard key={m.id} m={m} catName={catNameById[String(m.categoryId)]} />
              ))}

            {!isLoading && isPricesTab &&
              visibleCatsForPrices.map((c) => {
                const items = (groupedServices.get(c.id) || []).slice(0, pricesPerCard);
                return (
                  <PriceCard
                    key={c.id}
                    cat={c}
                    items={items}
                    mastersCount={mastersCountByCat[c.id] || 0}
                  />
                );
              })}

            {!isLoading && !isMastersTab && !isPricesTab &&
              servicesFiltered.map((s) => (
                <ServiceCard key={s.id} s={s} catLabel={activeCatObj?.name} />
              ))}
          </div>

          {/* Пагинация мастеров */}
          {isMastersTab && (
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
                <div className="text-sm text-gray-500">Это все мастера по текущему фильтру</div>
              )}
            </div>
          )}

          {/* “Посмотреть все” — только для вкладки Сервисы */}
          {!isMastersTab && !isPricesTab && (
            <div className="flex items-center justify-center text-sm text-gray-600 mt-6">
              <Link href="/services" className="group inline-flex items-center gap-1">
                <span>Посмотреть все</span>
                <LuChevronRight className="text-[18px] text-[#00B140] transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </>
      )}

      {/* Модал фильтра */}
      <FilterModal
        open={tabKey !== "request" && filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        currentCat={cat}
        currentSub={sub}
        onApply={(newCat, newSub) => {
          setCat(newCat);
          setSub(newSub);
          if (newCat === "all") setMix((v) => v + 1);
        }}
      />
    </section>
  );
}
