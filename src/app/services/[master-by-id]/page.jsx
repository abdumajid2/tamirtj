"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LuBadgeCheck, LuChevronLeft, LuChevronRight, LuMapPin, LuPhone,
  LuClock3, LuStar, LuShieldCheck, LuCamera, LuMessageSquare
} from "react-icons/lu";

import {
  useGetMasterByIdQuery,
  useGetCategoriesQuery,
  useGetMasterReviewsQuery,
  useGetServicesQuery,
} from "@/store/api/baseApi";

const BRAND = { green: "#00B140", dark: "#111827" };

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

function Chip({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
      {children}
    </span>
  );
}

export default function MasterProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: master, isLoading, isError } = useGetMasterByIdQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: reviews = [] } = useGetMasterReviewsQuery(id);
  const { data: services = [] } = useGetServicesQuery();

  const cat = useMemo(() => categories.find(c => String(c.id) === String(master?.categoryId)), [categories, master]);
  const subNames = useMemo(() => {
    if (!master?.subCategoryIds || !cat?.subcategories) return [];
    const dict = Object.fromEntries(cat.subcategories.map(s => [String(s.id), s.name]));
    return (master.subCategoryIds || []).map(x => dict[String(x)]).filter(Boolean);
  }, [master, cat]);

  const catServices = useMemo(() => {
    if (!master?.categoryId) return [];
    return services.filter(s => String(s.categoryId) === String(master.categoryId))
                   .slice(0, 8);
  }, [services, master]);

  const photos = master?.photos || [];

  const [tab, setTab] = useState("info"); // info | reviews | photos

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto p-4">
        <div className="h-8 w-44 bg-gray-100 rounded mb-4 animate-pulse" />
        <div className="rounded-2xl border bg-white p-4 shadow animate-pulse">
          <div className="h-32 bg-gray-100 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded" />)}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !master) {
    return (
      <section className="max-w-4xl mx-auto p-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <LuChevronLeft /> Назад
        </button>
        <div className="mt-6 rounded-xl border bg-white p-6 text-center">
          <p className="text-gray-700">Мастер не найден.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Хедер: аватар + имя + рейтинг + кнопки */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border flex-shrink-0">
            <Image src={master.avatar || "/placeholder.png"} alt={master.fullName} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {master.fullName}
              </h1>
              {master.verified && <LuBadgeCheck className="text-emerald-500" title="Проверенный мастер" />}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <Stars rating={master.rating} />
              <span className="font-medium text-gray-800">{Number(master.rating).toFixed(1)}</span>
              <span>•</span>
              <span>{master.reviewsCount} отзывов</span>
              {cat?.name && (
                <>
                  <span>•</span>
                  <span>{cat.name}</span>
                </>
              )}
              {master.cityId && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><LuMapPin /> Город ID: {master.cityId}</span>
                </>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <Chip>Опыт: {master.experienceYears}+ лет</Chip>
              <Chip>Выполнено: {master.completed}</Chip>
              <Chip className="!bg-emerald-50 !text-emerald-700">Отклик: {master.responseRate}%</Chip>
              {master.badges?.includes("Гарантия") && (
                <Chip><LuShieldCheck className="mr-1" /> Гарантия</Chip>
              )}
              <Chip><LuClock3 className="mr-1" /> 24/7 Срочный вызов</Chip>
            </div>
          </div>

          <a
            href={`tel:${master.phone || ""}`}
            className="ml-auto hidden sm:inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-white font-semibold"
            style={{ background: BRAND.green }}
          >
            <LuPhone className="text-lg" />
            Позвонить
          </a>
        </div>

        {/* быстрые кнопки под хедером (мобайл) */}
        <div className="mt-4 sm:hidden">
          <a
            href={`tel:${master.phone || ""}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-white font-semibold"
            style={{ background: BRAND.green }}
          >
            <LuPhone className="text-lg" />
            Контакт мастера
          </a>
        </div>
      </div>

      {/* Табы */}
      <div className="mt-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="border-b px-2 sm:px-4">
          <div className="flex items-center">
            {[
              { key: "info", label: "Информация" },
              { key: "reviews", label: `Отзывы (${reviews.length})` },
              { key: "photos", label: `Фото работ (${photos.length})` },
            ].map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={[
                    "relative py-3 px-4 text-sm font-semibold",
                    active ? "text-[color:var(--brand-green)]" : "text-gray-600 hover:text-gray-900"
                  ].join(" ")}
                  style={{ ["--brand-green"]: BRAND.green }}
                >
                  {t.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-px h-[3px] rounded-full" style={{ background: BRAND.green }} />
                  )}
                </button>
              );
            })}
            <div className="ml-auto pr-2 sm:pr-4">
              <Link
                href={`/request?master=${master.id}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                style={{ background: BRAND.green }}
              >
                <LuMessageSquare /> Написать/Заказать
              </Link>
            </div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="p-4 sm:p-6">
          {tab === "info" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">О мастере</h3>
                  <p className="mt-1 text-gray-700">{master.about || "Описание появится позже."}</p>
                </div>

                {subNames.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Специализация</h3>
                    <div className="flex flex-wrap gap-2">
                      {subNames.map((s) => <Chip key={s}>{s}</Chip>)}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Прайс популярных работ</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {catServices.map((s) => (
                      <div key={s.id} className="flex items-center text-sm bg-gray-50 rounded-lg px-3 py-2">
                        <span className="truncate">{s.title}</span>
                        <span className="flex-1 border-b border-dotted mx-2 opacity-50" />
                        <span className="whitespace-nowrap font-semibold text-[color:var(--brand-green)]" style={{ ["--brand-green"]: BRAND.green }}>
                          от {Number(s.price).toLocaleString("ru-RU")} {s.currency || "с."}
                        </span>
                      </div>
                    ))}
                    {catServices.length === 0 && <div className="text-sm text-gray-500">Для этой категории пока нет прайса.</div>}
                  </div>
                </div>
              </div>

              <aside className="space-y-3">
                <div className="rounded-2xl border p-4">
                  <div className="text-sm text-gray-500">Телефон</div>
                  <a href={`tel:${master.phone || ""}`} className="mt-1 block text-lg font-bold text-gray-900">
                    {master.phone || "—"}
                  </a>
                  <a
                    href={`tel:${master.phone || ""}`}
                    className="mt-3 inline-flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-white font-semibold"
                    style={{ background: BRAND.green }}
                  >
                    <LuPhone /> Позвонить
                  </a>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="text-sm text-gray-500">Активность</div>
                  <div className="mt-1 text-gray-800">В сети: {new Date(master.lastActive).toLocaleString()}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Chip>24/7</Chip>
                    <Chip>Срочный выезд</Chip>
                    <Chip>Безопасная сделка</Chip>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {tab === "reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 && <div className="text-sm text-gray-500">Пока нет отзывов.</div>}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <p className="mt-2 text-gray-800">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "photos" && (
            <>
              {photos.length === 0 && <div className="text-sm text-gray-500">Фото пока нет.</div>}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border">
                    <Image src={src} alt={`photo-${i + 1}`} fill className="object-cover" />
                    <div className="absolute left-2 top-2 inline-flex items-center gap-1 text-xs bg-black/55 text-white px-2 py-1 rounded">
                      <LuCamera /> {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Похожие мастера — по категории */}
      {/* (опционально можно добавить твой же грид карточек) */}
      {cat?.name && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider">
              Похожие специалисты: {cat.name}
            </h3>
            <Link href={`/masters?categoryId=${master.categoryId}`} className="inline-flex items-center gap-1 text-sm text-[#00B140]">
              Смотреть всех <LuChevronRight />
            </Link>
          </div>
          {/* сюда можно вывести твой <MasterCard /> со списком, если нужно */}
        </div>
      )}
    </section>
  );
}
