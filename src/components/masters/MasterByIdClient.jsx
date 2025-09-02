// src/components/masters/MasterByIdClient.jsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { skipToken } from "@reduxjs/toolkit/query";
import { Phone, Share2, Star, MapPin, ShieldCheck, BadgeCheck, Images } from "lucide-react";
import { useGetMasterByIdQuery, useGetCategoriesQuery } from "@/store/api/baseApi";

/* UI helpers */
function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50">
      <div className="text-gray-500 text-sm">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
function Stars({ value = 0 }) {
  const v = Number(value) || 0;
  return (
    <div className="inline-flex items-center gap-1 text-amber-500">
      <Star className="w-4 h-4 fill-current" />
      <span className="text-gray-800">{v.toFixed(1)}</span>
    </div>
  );
}
const fmtMoney = (n) => (Number.isFinite(Number(n)) ? `${Number(n).toLocaleString("ru-RU")} cӯм` : "—");
const fmtDate = (iso) => { try { return new Date(iso).toLocaleString("ru-RU"); } catch { return "—"; } };

export default function MasterByIdClient() {
  const [tab, setTab] = useState("info"); // "info" | "photos"

  // ⚡️ Берём id из URL на клиенте
  const params = useParams(); // { id?: string | string[] }
  const routeId =
    typeof params?.id === "string" ? params.id :
    Array.isArray(params?.id) ? params.id[0] : null;

  // нормализуем в строку цифр
  const idForQuery = useMemo(() => (routeId && /^\d+$/.test(routeId) ? routeId : null), [routeId]);

  // если id валиден — вызываем, иначе skipToken (никакого /masters/undefined)
  const { data: master, isLoading, isError, isUninitialized } =
    useGetMasterByIdQuery(idForQuery ?? skipToken);

  const { data: cats = [] } = useGetCategoriesQuery();
  const subDict = useMemo(() => {
    const d = {};
    for (const c of cats) for (const s of c?.subcategories || []) d[s.id] = s;
    return d;
  }, [cats]);

  if (idForQuery === null || isUninitialized) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="p-4 border rounded-xl bg-yellow-50 border-yellow-200 text-yellow-800">
          Некорректный идентификатор мастера.
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </section>
    );
  }

  if (isError || !master) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="p-4 border rounded-xl bg-rose-50 border-rose-200 text-rose-700">
          Не удалось загрузить мастера #{routeId}.
        </div>
      </section>
    );
  }

  const photos = Array.isArray(master.photos) ? master.photos : [];
  const specChips = (master.subCategoryIds || []).map((id) => subDict[id]?.name).filter(Boolean);

  const onCall = () => { if (master.phone) window.location.href = `tel:${master.phone}`; };
  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: master.fullName, url });
      else { await navigator.clipboard.writeText(url); alert("Ссылка скопирована"); }
    } catch {}
  };
  console.log("master:", master);
  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 p-5 rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden ring-1 ring-gray-200">
            <Image
              src={master.avatar || "/placeholder/avatar.png"}
              alt={master.fullName}
              width={80}
              height={80}
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="text-xs text-gray-500">ID {master.id}</div>
            <h1 className="text-2xl font-bold">{master.fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Stars value={master.rating} />
              <span className="text-gray-500 text-sm">· {master.reviewsCount ?? 0} отзывов</span>
              {master.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">
                  <ShieldCheck className="w-4 h-4" /> Верифицирован
                </span>
              )}
              {(master.badges || []).includes("Топ-мастер") && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-full bg-amber-50 text-amber-700 border-amber-200">
                  <BadgeCheck className="w-4 h-4" /> Топ-мастер
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button onClick={onCall} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            <Phone className="w-4 h-4" />
            Контакт мастера
          </button>
          <button onClick={onShare} className="inline-flex items-center gap-2 px-3 h-10 rounded-xl border bg-white hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex items-center gap-6">
        <button
          onClick={() => setTab("info")}
          className={`pb-3 -mb-px border-b-2 ${tab === "info" ? "border-emerald-600 text-emerald-700 font-semibold" : "border-transparent text-gray-600"}`}
        >
          Информация
        </button>
        <button
          onClick={() => setTab("photos")}
          className={`pb-3 -mb-px border-b-2 ${tab === "photos" ? "border-emerald-600 text-emerald-700 font-semibold" : "border-transparent text-gray-600"}`}
        >
          Фото работ <span className="text-gray-400">({photos.length})</span>
        </button>
      </div>

      {tab === "info" && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-5 rounded-2xl border bg-white">
            <h2 className="text-lg font-semibold mb-4">О мастере</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Город: <span className="font-medium">#{master.cityId}</span></span>
            </div>
            <div className="mt-1 text-sm text-gray-500">Последний логин: {fmtDate(master.lastActive)}</div>
            <p className="mt-4 text-gray-700">{master.about || "Описание отсутствует."}</p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Stat label="Опыт" value={`${master.experienceYears ?? 0} лет`} />
              <Stat label="Выполнено" value={`${master.completed ?? 0} заказов`} />
              <Stat label="Ответов" value={`${master.responseRate ?? 0}%`} />
              <Stat label="Стоимость от" value={`${fmtMoney(master.priceFrom)} / ${(master.priceUnit || "час")}`} />
            </div>
            <div className="mt-6">
              <div className="text-gray-500 text-sm mb-2">Специализация:</div>
              <div className="flex flex-wrap gap-2">
                {specChips.length
                  ? specChips.map((name) => <span key={name} className="px-3 py-1 rounded-full border text-sm bg-white">{name}</span>)
                  : <span className="text-gray-500">—</span>}
              </div>
            </div>
          </div>

          <aside className="p-5 rounded-2xl border bg-white h-fit">
            <h3 className="font-semibold mb-3">Быстрый контакт</h3>
            <div className="text-sm text-gray-600">Телефон</div>
            <div className="font-semibold">{master.phone || "—"}</div>
            <button onClick={onCall} className="mt-4 w-full inline-flex justify-center items-center gap-2 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
              <Phone className="w-4 h-4" />
              Позвонить
            </button>
          </aside>
        </div>
      )}

      {tab === "photos" && (
        <div className="p-5 rounded-2xl border bg-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Images className="w-5 h-5" /> Фото работ ({photos.length})
          </h2>
          {photos.length === 0 ? (
            <div className="text-gray-500">Фото пока нет.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.slice(0, 12).map((src, i) => (
                <div key={i} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border">
                  <Image src={src} alt={`work ${i + 1}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
