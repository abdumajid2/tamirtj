// src/app/orders/new/page.jsx  (или в том файле, что вы показали)
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useGetCategoriesQuery, useGetCitiesQuery, useCreateOrderMutation } from "@/store/api/baseApi";

export default function OrderPage() {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: cities = [] } = useGetCitiesQuery();
  const [createOrder, { isLoading, isSuccess, data: created }] = useCreateOrderMutation();

  const user = useSelector((s) => s.auth?.user);
  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    cityId: "",
    phone: "+992",
    description: "",
  });
  const [err, setErr] = useState("");

  const activeCat = useMemo(
    () => categories.find(c => String(c.id) === String(form.categoryId)),
    [categories, form.categoryId]
  );
  const subs = activeCat?.subcategories || [];

  useEffect(() => {
    // если сменили категорию — сбросить подкатегорию
    setForm((f) => ({ ...f, subCategoryId: "" }));
  }, [form.categoryId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const payload = {
        userId: user?.id ?? null,
        categoryId: Number(form.categoryId),
        subCategoryId: form.subCategoryId ? Number(form.subCategoryId) : null,
        cityId: Number(form.cityId),
        phone: form.phone.trim(),
        description: form.description.trim(),
      };
      // простая валидация
      if (!payload.categoryId || !payload.cityId || !payload.phone || !payload.description) {
        setErr("Заполните обязательные поля.");
        return;
      }
      await createOrder(payload).unwrap();
    } catch (e) {
      setErr(e?.data?.message || "Не удалось отправить заявку");
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h1 className="text-xl font-semibold text-green-800">Заявка отправлена!</h1>
          <p className="text-sm text-green-800/80 mt-2">
            Номер заявки: <b>{created?.id}</b>. Мы уведомим мастеров и скоро с вами свяжутся.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/orders" className="px-4 py-2 rounded-full border border-green-600 text-green-700 hover:bg-green-100">
              Мои заявки
            </Link>
            <Link href="/" className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700">
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Создать заявку</h1>
      <p className="text-gray-500 mt-1">Опишите задачу — подходящие мастера увидят ваш запрос.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full border rounded-xl px-3 py-2 focus:ring-4 focus:ring-green-100 focus:border-green-600"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {!!subs.length && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Подкатегория (необязательно)</label>
            <select
              value={form.subCategoryId}
              onChange={(e) => setForm((f) => ({ ...f, subCategoryId: e.target.value }))}
              className="w-full border rounded-xl px-3 py-2 focus:ring-4 focus:ring-green-100 focus:border-green-600"
            >
              <option value="">Не выбрано</option>
              {subs.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Город *</label>
          <select
            value={form.cityId}
            onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value }))}
            className="w-full border rounded-xl px-3 py-2 focus:ring-4 focus:ring-green-100 focus:border-green-600"
            required
          >
            <option value="">Выберите город</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Телефон для связи *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+992 ХХХ ХХ ХХ"
            className="w-full border rounded-xl px-3 py-2 focus:ring-4 focus:ring-green-100 focus:border-green-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Что нужно сделать? *</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Кратко опишите задачу: где, что установить/починить, когда удобно…"
            className="w-full border rounded-xl px-3 py-2 focus:ring-4 focus:ring-green-100 focus:border-green-600"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Без фото пока — добавим загрузку позже.</p>
        </div>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-green-600 text-white py-3 font-semibold hover:bg-green-700 disabled:opacity-60"
        >
          {isLoading ? "Отправляем…" : "Отправить заявку"}
        </button>
      </form>
    </div>
  );
}
