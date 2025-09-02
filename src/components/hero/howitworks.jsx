// src/components/sections/HowItWorks.jsx
"use client";
import React from "react";

export default function HowItWorks() {
  const cards = [
    {
      title: "Удобный поиск",
      text:
        "Используйте фильтр, чтобы найти проверенного специалиста в своем городе и даже районе. Контакты всегда под рукой!",
      icon: MapIcon,
    },
    {
      title: "Отзывы и рейтинг",
      text:
        "Доверяйте мнению других! Читайте реальные отзывы, смотрите рейтинг мастеров и сами оценивайте работу специалиста.",
      icon: ReviewsIcon,
    },
    {
      title: "Оставьте заявку",
      text:
        "Заполните короткую форму, и мастера свяжутся с вами. Вам останется выбрать лучшее предложение и договориться о встрече!",
      icon: FormIcon,
    },
    {
      title: "Сравнивайте цены",
      text:
        "Не переплачивайте! Смотрите актуальные расценки и выбирайте подходящий вариант под ваш бюджет.",
      icon: BarsIcon,
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Как это работает
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, text, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl bg-white border border-gray-100 shadow-[0_4px_24px_rgba(16,24,40,0.06)] p-6 flex flex-col items-center text-center transition hover:shadow-[0_8px_32px_rgba(16,24,40,0.10)]"
            >
              <div className="mb-4">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= SVGs ================= */

function IconWrap({ children }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-br from-green-400 to-green-600 rounded-full" />
      <div className="relative w-20 h-20 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function MapIcon() {
  return (
    <IconWrap>
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g>
          <rect x="4" y="10" width="12" height="24" rx="2" fill="#E8F5E9" />
          <rect x="16" y="6" width="12" height="28" rx="2" fill="#ECFDF3" />
          <rect x="28" y="10" width="12" height="24" rx="2" fill="#E8F5E9" />
          {/* дорожка */}
          <path d="M6 24c6 0 8-6 14-6s8 6 14 6" stroke="#34D399" strokeWidth="2" />
          {/* пины */}
          <Pin cx="10" cy="16" />
          <Pin cx="22" cy="12" />
          <Pin cx="34" cy="18" />
        </g>
      </svg>
    </IconWrap>
  );
}

function Pin({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="4" fill="#10B981" />
      <circle cx={cx} cy={cy} r="2" fill="white" />
    </g>
  );
}

function ReviewsIcon() {
  return (
    <IconWrap>
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* лицо */}
        <circle cx="22" cy="16" r="6.5" fill="#ECFDF3" />
        <circle cx="22" cy="15" r="3.5" fill="#10B981" />
        {/* плечи */}
        <rect x="12" y="22" width="20" height="8" rx="4" fill="#E8F5E9" />
        {/* звезды */}
        <g transform="translate(8,32)">
          <Star />
          <Star x={8} />
          <Star x={16} />
          <Star x={24} />
          <Star x={32} />
        </g>
      </svg>
    </IconWrap>
  );
}

function Star({ x = 0 }) {
  return (
    <path
      transform={`translate(${x} 0)`}
      d="M4 0l1.2 2.6L8 3l-2 2 0.5 3L4 6.6 1.5 8 2 6 0 3l2.8-.4L4 0z"
      fill="#FBBF24"
    />
  );
}

function FormIcon() {
  return (
    <IconWrap>
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* лист */}
        <rect x="10" y="10" width="24" height="24" rx="4" fill="#ECFDF3" />
        <rect x="14" y="16" width="16" height="2.4" rx="1" fill="#2DD4BF" />
        <rect x="14" y="21" width="12" height="2.4" rx="1" fill="#A7F3D0" />
        <rect x="14" y="26" width="10" height="2.4" rx="1" fill="#86EFAC" />
        {/* бейдж-пирог */}
        <circle cx="32.5" cy="28.5" r="6.5" fill="white" />
        <circle cx="32.5" cy="28.5" r="5.2" fill="#10B981" />
        <path d="M32.5 23.3A5.2 5.2 0 0 1 37.7 28.5h-5.2v-5.2z" fill="#059669" />
      </svg>
    </IconWrap>
  );
}

function BarsIcon() {
  return (
    <IconWrap>
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* платформа */}
        <rect x="10" y="32" width="24" height="4" rx="2" fill="#EEF2FF" />
        {/* бары */}
        <rect x="14" y="22" width="4" height="10" rx="1" fill="#10B981" />
        <rect x="20" y="18" width="4" height="14" rx="1" fill="#34D399" />
        <rect x="26" y="20" width="4" height="12" rx="1" fill="#10B981" />
        <rect x="32" y="16" width="4" height="16" rx="1" fill="#34D399" />
      </svg>
    </IconWrap>
  );
}
