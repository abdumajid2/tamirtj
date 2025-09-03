// src/app/blog/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Home, Car, Hammer, Wrench, Tv, BookOpen, ChevronDown, Search
} from "lucide-react";

/* ----------------------------- мок-данные ----------------------------- */
const HERO = {
  badge: "Советы по ремонту",
  title: "Осторожно мошенники!",
  ctaText: "Читать дальше",
  ctaHref: "/blog/scam-warning",
  image: "/hero/blog-hero.jpg", // положи картинку в public/hero/blog-hero.jpg
  authors: [
    "/avatars/a1.jpg",
    "/avatars/a2.jpg",
    "/avatars/a3.jpg",
    "/avatars/a4.jpg",
    "/avatars/a5.jpg",
  ],
};

const CATEGORY_ICONS = [
  { key: "build", label: "Строй", icon: Home },
  { key: "auto", label: "Авто", icon: Car },
  { key: "tools", label: "Инструмент", icon: Hammer },
  { key: "tech", label: "Техника", icon: Tv },
  { key: "services", label: "Бытовые услуги", icon: Wrench },
  { key: "edu", label: "Образование и курсы", icon: BookOpen },
];

const ALL_CATEGORIES = [
  { id: "all", name: "Все категории" },
  { id: "plumbing", name: "Сантехника" },
  { id: "electric", name: "Электрика" },
  { id: "paint", name: "Малярные работы" },
  { id: "windows", name: "Окна и двери" },
  { id: "floor", name: "Полы" },
  { id: "furniture", name: "Мебель и кухни" },
];

const POSTS = [
  {
    id: "gas-column-noise",
    category: "СОВЕТЫ ПО РЕМОНТУ",
    title:
      "Газовая колонка шумит при работе: причины шума, опасности и что делать",
    date: "25.08.2025",
    image:
      "https://images.unsplash.com/photo-1581091014534-8987c1d647cc?q=80&w=1600&auto=format&fit=crop",
    categoryId: "plumbing",
  },
  {
    id: "cold-water-from-boiler",
    category: "СЛОВАРЬ РЕМОНТА",
    title: "Почему из бойлера идет холодная вода — причины и что делать",
    date: "25.08.2025",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop",
    categoryId: "plumbing",
  },
  {
    id: "master-story",
    category: "МАСТЕРА",
    title:
      "От косметики до капитального ремонта: опыт мастера Зуфара и его бригады",
    date: "18.08.2025",
    image:
      "https://images.unsplash.com/photo-1596079890744-c1a0462d4b3f?q=80&w=1600&auto=format&fit=crop",
    categoryId: "build",
  },
  {
    id: "gas-boiler-off",
    category: "СОВЕТЫ ПО РЕМОНТУ",
    title:
      "Газовый котел отключается сам по себе — причины и что делать",
    date: "12.08.2025",
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c9f935?q=80&w=1600&auto=format&fit=crop",
    categoryId: "plumbing",
  },
  {
    id: "no-pressure-water",
    category: "СОВЕТЫ ПО РЕМОНТУ",
    title:
      "Нет давления воды в газовой колонке: 5 причин и что делать",
    date: "10.08.2025",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
    categoryId: "plumbing",
  },
  {
    id: "drywall-guide",
    category: "ГИД",
    title: "ГКЛ: Как выбрать и где применять",
    date: "08.08.2025",
    image:
      "https://images.unsplash.com/photo-1600573472591-ee5f2ff3b9a3?q=80&w=1600&auto=format&fit=crop",
    categoryId: "build",
  },
];

/* ----------------------------- утилиты ----------------------------- */
function classNames(...a) {
  return a.filter(Boolean).join(" ");
}

/* ----------------------------- компоненты ----------------------------- */
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
      {children}
    </span>
  );
}

function Card({ post }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-40 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/80 px-2 py-1 text-[11px] font-bold tracking-wide text-gray-900">
          {post.category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="text-[12px] text-gray-500">{post.date}</div>
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <Link
          href={`/blog/${post.id}`}
          className="mt-2 inline-flex items-center gap-1 text-emerald-600 hover:underline"
        >
          Читать дальше →
        </Link>
      </div>
    </article>
  );
}

/* ----------------------------- страница ----------------------------- */
export default function BlogPage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let arr = POSTS;
    if (cat !== "all") arr = arr.filter((p) => p.categoryId === cat);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title.toLowerCase().includes(t) ||
          p.category.toLowerCase().includes(t)
      );
    }
    return arr;
  }, [cat, q]);

  return (
    <section className="w-full">
      {/* HERO */}
      <div className="relative w-full overflow-hidden rounded-2xl h-[320px] md:h-[420px]">
        {HERO.image ? (
          <Image
            src={HERO.image}
            alt={HERO.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />

        <div className="relative z-10 h-full px-5 sm:px-8 md:px-14">
          <div className="flex h-full max-w-6xl flex-col justify-between gap-6 py-6">
            <Badge>{HERO.badge}</Badge>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              {HERO.title}
            </h1>

            <div className="flex items-center justify-between">
              <Link
                href={HERO.ctaHref}
                className="inline-flex items-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {HERO.ctaText}
              </Link>

              {/* аватарки справа как в примере */}
              <div className="hidden md:flex items-center -space-x-3">
                {HERO.authors.map((src, i) => (
                  <span key={i} className="relative inline-block h-9 w-9 rounded-full ring-2 ring-white overflow-hidden">
                    <Image src={src} alt="" fill className="object-cover" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ПАНЕЛЬ КАТЕГОРИЙ + ФИЛЬТРЫ */}
      <div className="mt-6 flex flex-col gap-4">
        {/* иконки-категории */}
        <div className="flex flex-wrap items-center gap-3">
          {CATEGORY_ICONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className="group flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm hover:shadow transition"
            >
              <span className="grid place-items-center rounded-xl bg-gray-100 p-2">
                <Icon className="h-5 w-5 text-gray-700" />
              </span>
              <span className="text-sm font-medium text-gray-800">{label}</span>
            </button>
          ))}
        </div>

        {/* выпадайка категорий + поиск */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="appearance-none rounded-xl border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-800 shadow-sm focus:outline-none"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <div className="text-xs text-gray-500">Всего категорий: {ALL_CATEGORIES.length - 1}</div>
          </div>

          <label className="relative block md:w-[340px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Быстрый поиск"
              className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* СПИСОК КАРТОЧЕК */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} post={p} />
        ))}
      </div>

      {/* пагинация-заглушка */}
      <div className="mt-8 flex justify-center">
        <button className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Загрузить ещё
        </button>
      </div>
    </section>
  );
}
