"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetServicesQuery } from "@/store/api/baseApi"; // ← поменяй на "@/store/api", если нужно
import { Spin } from "antd";

const BRAND_GREEN = "#00B140";
const BRAND_GREEN_LIGHT = "#E8F8EE";

const FILTERS = [
  { key: "all", label: "Все" },
  { key: "Электрики", label: "Электрики" },
  { key: "Сантехники", label: "Сантехники" },
  { key: "Мебель на заказ", label: "Мебель на заказ" },
];

// простая функция перемешивания (Фишер–Йетс)
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ServicesSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [shuffleVersion, setShuffleVersion] = useState(0); // меняем, чтобы перешафлить «Все»

  const { data: services = [], isLoading } = useGetServicesQuery();

  // переключатель фильтров; если нажали "Все" — пересобираем порядок
  const onFilterClick = (key) => {
    setActiveFilter(key);
    if (key === "all") setShuffleVersion((v) => v + 1);
  };

  const filtered = useMemo(() => {
    if (!services?.length) return [];
    if (activeFilter === "all") {
      // перемешиваем ТОЛЬКО при изменении данных или при новом клике на "Все"
      return shuffleArray(services);
    }
    return services.filter((s) => s.category === activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, activeFilter, shuffleVersion]);

  return (
    <section className="w-full bg-white">
      <div className="mt-12">
        {/* Заголовок */}
        <header className="mb-6">
          <h2 className="text-[28px] sm:text-[48px] font-extrabold text-gray-900 flex items-center gap-3">
            Новые
            <span
              className="px-3 py-1 rounded-full text-white text-[32px] font-black"
              style={{ backgroundColor: BRAND_GREEN }}
            >
              Сервисы
            </span>
            <span className="font-bold text-gray-900">от Tamir!</span>
          </h2>

          <p className="text-gray-600 text-[19px] max-w-3xl mt-2">
            Боитесь, что мастер затянет сроки, повысит цену или плохо сделает свою работу?
            Тогда воспользуйтесь услугой «Безопасная сделка».
          </p>

          <ul className="mt-4 text-[18px] space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-5 w-5 rounded-full" style={{ backgroundColor: BRAND_GREEN }} />
              <span>Платите только после выполненной работы.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-5 w-5 rounded-full" style={{ backgroundColor: BRAND_GREEN }} />
              <span>Фиксированная цена</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-5 w-5 rounded-full" style={{ backgroundColor: BRAND_GREEN }} />
              <span>Выезд мастера — от 30 минут</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-5 w-5 rounded-full" style={{ backgroundColor: BRAND_GREEN }} />
              <span>Гарантия до 12 месяцев</span>
            </li>
          </ul>
        </header>

        {/* Фильтры */}
        <div className="mt-5 flex flex-wrap gap-3">
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => onFilterClick(f.key)}
                className={`text-lg px-3 py-1.5 rounded-full border transition-colors ${
                  active ? "font-semibold" : ""
                }`}
                style={{
                  borderColor: BRAND_GREEN,
                  color: active ? "#0F5132" : BRAND_GREEN,
                  backgroundColor: active ? BRAND_GREEN_LIGHT : "transparent",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Состояния загрузки/пусто */}
        {isLoading && (
          <div className="mt-6 w-20 m-auto text-gray-500"><Spin/></div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="mt-6 text-gray-500">Пока нет услуг по этому фильтру.</div>
        )}

        {/* Карточки услуг */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={s.image}
                  alt=''
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span
                  className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-md text-white"
                  style={{ backgroundColor: BRAND_GREEN }}
                >
                  {String(s.category || "").toUpperCase()}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
                  {s.title} <span className="text-gray-500">{s.subtitle}</span>
                </h3>

                <div className="text-center bg-white rounded-xl border border-gray-200 py-3">
                  <div className="text-xs text-gray-500">от</div>
                  <div className="text-2xl font-extrabold text-gray-900">
                    {Number(s.price ?? 0).toLocaleString("ru-RU")}{" "}
                    <span className="text-[16px] font-bold">{s.currency}</span>
                  </div>
                </div>

                <button
                  className="w-full rounded-full text-white font-semibold py-3 mt-1"
                  style={{ backgroundColor: BRAND_GREEN }}
                >
                  Заказать услугу
                </button>

                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <Link href={`/services/${s.id}`} className="flex items-center gap-1 group">
                    <span className="hover:!text-green-500">Подробнее</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center m-auto text-sm text-gray-600 mt-10">
        <Link href="/services" className="flex items-center gap-1 group">
          <span>Посмотреть все</span>
          <svg
            className="w-4 h-4 text-[#00B140] transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
