// src/components/layout/Footer.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin, Clock
} from "lucide-react";

const BRAND_GREEN = "#00B140";
const BRAND_DARK = "#111827";

const NAV = {
  product: [
    { href: "/services", label: "Сервисы" },
    { href: "/masters", label: "Мастера" },
    { href: "/companies", label: "Компании" },
    { href: "/orders", label: "Заявки" },
    { href: "/blog", label: "Блог" },
  ],
  company: [
    { href: "/about", label: "О проекте" },
    { href: "/contacts", label: "Контакты" },
    { href: "/pricing", label: "Цены" },
    { href: "/partners", label: "Партнёрам" },
  ],
  help: [
    { href: "/faq", label: "FAQ" },
    { href: "/safety", label: "Безопасная сделка" },
    { href: "/support", label: "Поддержка" },
    { href: "/how-it-works", label: "Как это работает" },
  ],
  legal: [
    { href: "/privacy", label: "Политика конфиденциальности" },
    { href: "/terms", label: "Пользовательское соглашение" },
    { href: "/cookies", label: "Cookies" },
    { href: "/offer", label: "Публичная оферта" },
  ],
};

export default function Footer({ logoSrc = "/logo.png" }) {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // тут подключишь свой API подписки
    setEmail("");
    alert("Спасибо! Мы добавили ваш email в список рассылки.");
  };

  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        {/* Верхняя сетка */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* О бренде */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src={logoSrc} alt="Tamir.tj" width={150} height={40} priority />
            </Link>
            <p className="mt-4 text-gray-600 leading-7 max-w-md">
              Tamir.tj — сервис для быстрого и безопасного поиска мастеров,
              компаний и услуг. Оплата после выполнения работ, фиксированные цены,
              гарантия до 12 месяцев.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link aria-label="Instagram" href="https://instagram.com" className="group">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 transition-colors group-hover:bg-gray-50">
                  <Instagram className="h-5 w-5 text-gray-700" />
                </span>
              </Link>
              <Link aria-label="Facebook" href="https://facebook.com" className="group">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 transition-colors group-hover:bg-gray-50">
                  <Facebook className="h-5 w-5 text-gray-700" />
                </span>
              </Link>
              <Link aria-label="YouTube" href="https://youtube.com" className="group">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 transition-colors group-hover:bg-gray-50">
                  <Youtube className="h-5 w-5 text-gray-700" />
                </span>
              </Link>
              <Link aria-label="LinkedIn" href="https://linkedin.com" className="group">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 transition-colors group-hover:bg-gray-50">
                  <Linkedin className="h-5 w-5 text-gray-700" />
                </span>
              </Link>
            </div>

            {/* Контакты */}
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Душанбе, проспект Рудаки, 25
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a href="tel:+992900800604" className="hover:underline">+992 900 800 604</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href="mailto:hello@tamir.tj" className="hover:underline">hello@tamir.tj</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Пн–Сб: 09:00–19:00, Вс: выходной
              </li>
            </ul>
          </div>

          {/* Навколонки */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Разделы</h4>
            <ul className="space-y-2 text-gray-700">
              {NAV.product.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="hover:text-emerald-600">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Компания</h4>
            <ul className="space-y-2 text-gray-700">
              {NAV.company.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="hover:text-emerald-600">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Помощь</h4>
            <ul className="space-y-2 text-gray-700">
              {NAV.help.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="hover:text-emerald-600">{i.label}</Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 mb-3 font-semibold text-gray-900">Правовые</h4>
            <ul className="space-y-2 text-gray-700">
              {NAV.legal.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="hover:text-emerald-600">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Подписка */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h5 className="text-lg font-semibold text-gray-900">
                Подпишитесь на полезные статьи и акции
              </h5>
              <p className="text-gray-600 text-sm">
                Раз в неделю — без спама. Можно отписаться в любой момент.
              </p>
            </div>
            <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: BRAND_GREEN }}
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>

        {/* Низ футера */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 md:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Tamir.tj — Все права защищены.
          </p>
          <div className="text-xs text-gray-500">
            Сделано с любовью в Душанбе 💚
          </div>
        </div>
      </div>
    </footer>
  );
}
