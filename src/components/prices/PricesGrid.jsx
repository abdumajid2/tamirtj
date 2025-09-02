// src/components/prices/PricesGrid.jsx
"use client";
import { useGetServicesQuery, useGetCategoriesQuery } from "@/store/api/baseApi";

export default function PricesGrid({ catId, subId }) {
  const { data: services = [], isLoading } = useGetServicesQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  let list = services;
  if (catId) list = list.filter(s => Number(s.categoryId) === Number(catId));
  if (subId) list = list.filter(s => Number(s.subCategoryId) === Number(subId));

  if (isLoading) return <div>Загрузка…</div>;
  if (!list.length) return <div>Нет позиций</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map(s => (
        <article key={s.id} className="rounded-2xl border p-4">
          <div className="font-semibold">{s.title} <span className="text-gray-500">{s.subtitle}</span></div>
          <div className="mt-2 text-2xl font-extrabold">
            {s.price.toLocaleString("ru-RU")} <span className="text-sm">{s.currency}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
