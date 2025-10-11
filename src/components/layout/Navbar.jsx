// src/components/layout/Navbar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "@/store/api/authApi";
import {
  Building2, Car, WashingMachine, Globe, ChevronDown, Menu, X, User
} from "lucide-react";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";

/* ===================== helpers ===================== */
// Чтение accessToken из localStorage/RTK Persist
function readAccessTokenFromLS() {
  try {
    const direct = localStorage.getItem("accessToken");
    if (direct && direct !== "null" && direct !== "undefined") return direct;

    const authRaw = localStorage.getItem("auth");
    if (authRaw) {
      try {
        const p = JSON.parse(authRaw);
        if (p?.accessToken) return p.accessToken;
      } catch {}
    }

    // delete authToken in localstorage


    const rootRaw = localStorage.getItem("persist:root");
    if (rootRaw) {
      try {
        const root = JSON.parse(rootRaw);
        const slice = root?.auth;
        if (typeof slice === "string") {
          const p = JSON.parse(slice);
          if (p?.accessToken) return p.accessToken;
        } else if (slice?.accessToken) {
          return slice.accessToken;
        }
      } catch {}
    }
  } catch {}
  return null;
}

/* ===================== SVG Flags ===================== */
function FlagIcon({ code, className = "w-5 h-3 rounded-[2px]" }) {
  switch (code) {
    case "RU": // 🇷🇺
      return (
        <svg viewBox="0 0 9 6" className={className} aria-hidden>
          <rect width="9" height="6" fill="#fff" />
          <rect width="9" height="2" y="2" fill="#0039A6" />
          <rect width="9" height="2" y="4" fill="#D52B1E" />
        </svg>
      );
    case "TJ": // 🇹🇯 (упрощённо)
      return (
        <svg viewBox="0 0 9 6" className={className} aria-hidden>
          <rect width="9" height="6" fill="#fff" />
          <rect width="9" height="2" fill="#D52B1E" />
          <rect width="9" height="2" y="4" fill="#007934" />
          {/* корона (условная) */}
          <circle cx="4.5" cy="3" r="0.38" fill="#FFD700" />
          <path d="M3.8 3h1.4l-.7 0.95z" fill="#FFD700" />
        </svg>
      );
    case "EN": // 🇬🇧 (упрощённый Union Jack)
      return (
        <svg viewBox="0 0 9 6" className={className} aria-hidden>
          <rect width="9" height="6" fill="#012169" />
          <path d="M0,0 L9,6 M9,0 L0,6" stroke="#fff" strokeWidth="1.2" />
          <path d="M0,0 L9,6 M9,0 L0,6" stroke="#C8102E" strokeWidth="0.6" />
          <rect x="3.7" width="1.6" height="6" fill="#fff" />
          <rect y="2.2" width="9" height="1.6" fill="#fff" />
          <rect x="4" width="1" height="6" fill="#C8102E" />
          <rect y="2.5" width="9" height="1" fill="#C8102E" />
        </svg>
      );
    default:
      return <span className={className} />;
  }
}

/* ===================== Language Select ===================== */
const LANGS = [
  { code: "RU", label: "Русский" },
  { code: "TJ", label: "Тоҷикӣ" },
  { code: "EN", label: "English" },
];

function LanguageSelect({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find((l) => l.code === value) || LANGS[0];

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-lg font-medium text-gray-700 hover:bg-gray-100"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FlagIcon code={current.code} />
        {current.code}
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg p-2 z-20"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === current.code}
              onClick={() => {
                onChange?.(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 ${
                l.code === current.code ? "bg-gray-50" : ""
              }`}
            >
              <FlagIcon code={l.code} />
              <div className="flex-1">
                <div className="text-gray-900 font-medium leading-none">{l.label}</div>
                <div className="text-gray-500 text-[11px] leading-none mt-0.5">{l.code}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== Navbar ===================== */
export default function Navbar() {
  // --- UI state ---
  const [openMobile, setOpenMobile] = useState(false);
  const [openCats, setOpenCats] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [openLangMobile, setOpenLangMobile] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  // язык
  const [lang, setLang] = useState("RU");

  // гидрация и auth из LS
  const [authedLS, setAuthedLS] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // refs для кликов вне
  const catRef = useRef(null);
  const regionRef = useRef(null);
  const userRef = useRef(null);

  // routing
  const pathname = usePathname();
  const router = useRouter();
  const hideHeader = pathname === "/login" || pathname === "/register";

  // auth (Redux)
  const user = useSelector((s) => s.auth?.user);
  const accessToken = useSelector((s) => s.auth?.accessToken);
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  // для отслеживания первого входа
  const prevAuthedRef = useRef(false);

  // гидрация + начальные значения
  useEffect(() => {
    setHydrated(true);
    setAuthedLS(!!readAccessTokenFromLS());
    try {
      const savedLang = localStorage.getItem("lang");
      if (savedLang && ["RU", "TJ", "EN"].includes(savedLang)) setLang(savedLang);
    } catch {}
  }, []);

  // события storage: токен/язык
  useEffect(() => {
    const onStorage = (e) => {
      if (["accessToken", "auth", "persist:root"].includes(e.key)) {
        const has = !!readAccessTokenFromLS();
        setAuthedLS(has);
        if (has) router.refresh(); // сразу показать «Вызвать мастера» и «Профиль»
      }
      if (e.key === "lang") {
        try {
          const saved = localStorage.getItem("lang");
          if (saved && ["RU", "TJ", "EN"].includes(saved)) {
            setLang(saved);
            router.refresh();
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  // быстрый rAF-зонд (≈1c) чтобы мгновенно показать CTA
  useEffect(() => {
    if (!hydrated) return;

    let stopped = false;
    let frames = 0;
    const maxFrames = 60;

    const tick = () => {
      if (stopped) return;
      if (accessToken) {
        setAuthedLS(true);
        stopped = true;
        return;
      }
      const t = readAccessTokenFromLS();
      if (t) {
        setAuthedLS(true);
        stopped = true;
        return;
      }
      if (++frames < maxFrames) requestAnimationFrame(tick);
    };

    if (!accessToken && !authedLS) requestAnimationFrame(tick);
    return () => { stopped = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, accessToken]);

  // sync при изменении Redux токена
  useEffect(() => {
    if (!hydrated) return;
    if (accessToken) setAuthedLS(true);
    else setAuthedLS(!!readAccessTokenFromLS());
  }, [accessToken, hydrated]);

  // фокус вкладки — перечитать LS
  useEffect(() => {
    const onFocus = () => {
      setAuthedLS(!!readAccessTokenFromLS());
      try {
        const saved = localStorage.getItem("lang");
        if (saved && ["RU", "TJ", "EN"].includes(saved)) setLang(saved);
      } catch {}
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // клики вне дропдаунов (десктоп)
  useEffect(() => {
    const onDocClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCats(false);
      if (regionRef.current && !regionRef.current.contains(e.target)) setOpenRegion(false);
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // закрывать меню при смене маршрута
  useEffect(() => {
    setOpenMobile(false);
    setOpenCats(false);
    setOpenRegion(false);
    setOpenLangMobile(false);
    setOpenUser(false);
  }, [pathname]);

  const onLogout = async () => {
    try {
      await logout().unwrap();
      setAuthedLS(false);
      router.refresh(); // мгновенно обновить UI
      router.push("/");
    } catch {}
  };

  const isAuthed = !!user || !!accessToken || !!authedLS;

  // впервые стали авторизованы — принудительный refresh
  useEffect(() => {
    if (!hydrated) return;
    const prev = prevAuthedRef.current;
    if (!prev && isAuthed) router.refresh();
    prevAuthedRef.current = isAuthed;
  }, [isAuthed, hydrated, router]);

  // смена языка
  const handleLangChange = (code) => {
    setLang(code);
    try { localStorage.setItem("lang", code); } catch {}
    router.refresh();
  };

  const categories = [
    { href: "/", label: "Строй", icon: Building2, color: "text-green-500" },
    { href: "/auto", label: "Авто", icon: Car, color: "text-red-500" },
    { href: "/technica", label: "Техника", icon: WashingMachine, color: "text-blue-500" },
    { href: "/uslugi", label: "Бытовые услуги", icon: HiMiniWrenchScrewdriver, color: "text-orange-500" },
  ];
  const regions = ["Душанбе", "Худжанд", "Бохтар", "Кулоб", "Истаравшан"];

  if (hideHeader) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ЛОГО + регион */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/tamirlogo.png"
              alt="Tamir.tj"
              width={80}
              height={80}
              className="rounded"
              style={{ width: "auto", height: "90px" }}
              priority
            />
          </Link>

          <div ref={regionRef} className="relative">
            <button
              onClick={() => setOpenRegion((v) => !v)}
              className="ml-2 hidden md:inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              <Globe className="w-4 h-4 text-green-600" />
              Регион
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>
            {openRegion && (
              <div className="absolute left-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg p-2">
                {regions.map((r) => (
                  <button
                    key={r}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => setOpenRegion(false)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Центр: меню (десктоп) */}
        <div className="hidden md:flex items-center gap-1">
          <div ref={catRef} className="relative">
            <button
              onClick={() => setOpenCats((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100"
            >
              <Building2 className="w-6 h-6 text-green-600" />
              Строй
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>
            {openCats && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl p-2">
                {categories.map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-800"
                    onClick={() => setOpenCats(false)}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/services" className="rounded-full px-3 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100">
            Сервисы
          </Link>
          <Link href="/blog" className="rounded-full px-3 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100">
            Блог
          </Link>
        </div>

        {/* Право: язык (селект) + аккаунт/CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelect value={lang} onChange={handleLangChange} />

          {!hydrated ? null : !isAuthed ? (
            <div>
              <Link
                href="/register"
                className="rounded-full px-4 py-2 text-lg font-semibold border border-gray-200 shadow-sm hover:shadow transition mr-2"
              >
                Регистрация
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-green-600 text-white px-4 py-2 text-lg font-semibold border border-gray-200 shadow-sm hover:shadow transition"
              >
                Войти
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/orders/new"
                className="rounded-full bg-[#00B140] text-white px-4 py-2 text-lg font-semibold shadow-sm hover:shadow transition"
              >
                Вызвать мастера
              </Link>

              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setOpenUser((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-lg font-medium text-gray-800 hover:bg-gray-100"
                >
                  <User className="w-5 h-5 text-green-600" />
                  {user?.name || "Профиль"}
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>
                {openUser && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg p-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                      onClick={() => setOpenUser(false)}
                    >
                      Мой профиль
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                      onClick={() => setOpenUser(false)}
                    >
                      Избранное
                    </Link>
                    <Link
                      href="/chats"
                      className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                      onClick={() => setOpenUser(false)}
                    >
                      Мои чаты
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                      onClick={() => setOpenUser(false)}
                    >
                      Мои заказы
                    </Link>
                    <button
                      onClick={onLogout}
                      disabled={loggingOut}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-red-600"
                    >
                      {loggingOut ? "Выходим..." : "Выйти"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Бургер для мобилы */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100"
          onClick={() => setOpenMobile((v) => !v)}
          aria-label="Открыть меню"
        >
          {openMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Мобильное меню */}
      {openMobile && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setOpenRegion((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              <Globe className="w-4 h-4 text-green-600" />
              Регион
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>
            {openRegion && (
              <div className="w-full">
                <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm p-2">
                  {["Душанбе","Худжанд","Бохтар","Кулоб","Истаравшан"].map((r) => (
                    <button
                      key={r}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                      onClick={() => {
                        setOpenRegion(false);
                        setOpenMobile(false);
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-2">
            <button
              onClick={() => setOpenCats((v) => !v)}
              className="w-full inline-flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              <span className="inline-flex items-center gap-2">
                <Building2 className="w-4 h-4 text-green-600" />
                Строй
              </span>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>
            {openCats && (
              <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm p-2">
                {[
                  { href: "/", label: "Строй", icon: Building2, color: "text-green-500" },
                  { href: "/auto", label: "Авто", icon: Car, color: "text-red-500" },
                  { href: "/technica", label: "Техника", icon: WashingMachine, color: "text-blue-500" },
                  { href: "/uslugi", label: "Бытовые услуги", icon: HiMiniWrenchScrewdriver, color: "text-orange-500" },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-800"
                    onClick={() => {
                      setOpenCats(false);
                      setOpenMobile(false);
                    }}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-2 flex flex-col gap-1">
            <Link
              href="/services"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
              onClick={() => setOpenMobile(false)}
            >
              Сервисы
            </Link>
            <Link
              href="/blog"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
              onClick={() => setOpenMobile(false)}
            >
              Блог
            </Link>

            {/* мобильный селект языка */}
            <div className="mt-2 relative">
              <button
                onClick={() => setOpenLangMobile(v => !v)}
                className="w-full inline-flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <span className="inline-flex items-center gap-2">
                  <FlagIcon code={lang} />
                  {LANGS.find(l => l.code === lang)?.label || lang}
                </span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              {openLangMobile && (
                <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-2">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setOpenLangMobile(false);
                        handleLangChange(l.code);
                        setOpenMobile(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FlagIcon code={l.code} />
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              {!hydrated ? null : !isAuthed ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/register"
                    className="rounded-full bg-white text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:text-green-600 shadow-sm hover:shadow transition"
                    onClick={() => setOpenMobile(false)}
                  >
                    Регистрация
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full bg-white text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:text-green-600 shadow-sm hover:shadow transition"
                    onClick={() => setOpenMobile(false)}
                  >
                    Войти
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/orders/new"
                    className="rounded-full bg-[#00B140] text-white px-4 py-2 text-sm font-semibold shadow-sm hover:shadow transition"
                    onClick={() => setOpenMobile(false)}
                  >
                    Вызвать мастера
                  </Link>

                  <Link
                    href="/profile"
                    className="rounded-full bg-white text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:text-green-600 shadow-sm hover:shadow transition"
                    onClick={() => setOpenMobile(false)}
                  >
                    {user?.name || "Профиль"}
                  </Link>
                  <button
                    onClick={() => { onLogout(); setOpenMobile(false); }}
                    disabled={loggingOut}
                    className="rounded-full bg-red-50 text-red-700 px-4 py-2 text-sm font-semibold border border-red-200 hover:bg-red-100 transition"
                  >
                    {loggingOut ? "Выходим..." : "Выйти"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
