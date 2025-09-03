// src/components/sections/FaqList.jsx
"use client";

import { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
// если у тебя есть API: import { useGetFaqsQuery } from "@/store/api/baseApi";

const DEFAULT_FAQS = [
  { id: 1, q: "После регистрации не пришло письмо. Что делать?", a: "Проверьте «Спам». Если письма нет — войдите по номеру телефона или напишите в поддержку." },
  { id: 2, q: "Не помню пароль", a: "Нажмите «Забыли пароль?» на странице входа и восстановите доступ по email или телефону." },
  { id: 3, q: "Как изменить пароль?", a: "Профиль → Настройки → Безопасность. Укажите текущий и новый пароль." },
  { id: 4, q: "Почему мой профиль заблокирован?", a: "Обычно это нарушение правил площадки. Напишите в поддержку — мы подскажем, как снять ограничения." },
  { id: 5, q: "У нас бригада мастеров. Сколько страниц можно создать?", a: "Одна страница на бригаду + индивидуальные страницы на мастеров — без ограничений по количеству." },
  { id: 6, q: "Как разместить фотографии своих проектов?", a: "Профиль мастера → Портфолио → Загрузить фото. Поддерживаются JPG/PNG до 10 МБ." },
  { id: 7, q: "Как повысить рейтинг профиля?", a: "Отвечайте быстро, завершайте заказы через платформу и просите клиентов оставлять отзывы." },
  { id: 8, q: "В каких городах можно найти мастеров?", a: "Во всех крупных городах Таджикистана: Душанбе, Худжанд, Бохтар, Куляб и др." },
  { id: 9, q: "Оставил заявку, но никто не ответил", a: "Повысьте бюджет, добавьте фото/детали или пригласите мастеров из каталога вручную." },
  { id: 10, q: "Как пополнить кошелёк?", a: "Профиль → Кошелёк → Пополнить. Поддерживаем карты, терминалы и QR-оплату." },
];

function FaqRow({ item, open, onToggle }) {
  return (
    <div className="select-none">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-4"
        aria-expanded={open}
      >
        <span className="grid place-items-center h-7 w-7 rounded-full bg-gray-100 text-gray-700">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
        <span className="text-[17px] sm:text-[18px] font-medium text-gray-900 text-left truncate">
          {item.q}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 pl-10 pr-2 text-gray-600 leading-6">{item.a}</p>
        </div>
      </div>

      <div className="h-px bg-gray-200" />
    </div>
  );
}

export default function FaqList({ title = "Часто задаваемые вопросы", items }) {
  // const { data: faqs = [] } = useGetFaqsQuery();
  const data = useMemo(() => (items?.length ? items : DEFAULT_FAQS), [items]); // или faqs
  const [openId, setOpenId] = useState(null);

  // разбиваем на 2 колонки примерно поровну
  const mid = Math.ceil(data.length / 2);
  const col1 = data.slice(0, mid);
  const col2 = data.slice(mid);

  return (
    <section className="w-[500px] p-4 md:w-full md:p-0">
      <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6">
        {title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {[col1, col2].map((col, ci) => (
          <div key={ci} className="rounded-3xl bg-white">
            {col.map((item) => (
              <FaqRow
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() => setOpenId((v) => (v === item.id ? null : item.id))}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
