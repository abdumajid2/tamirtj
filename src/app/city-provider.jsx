"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// небольшой помощник для работы с cookie
function setCookie(name, value, days = 365) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  } catch {}
}
function getCookie(name) {
  try {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  } catch { return undefined; }
}

const CityContext = createContext({
  cityId: null,
  cityName: null,
  setCity: (_id, _name) => {},
  ensureAsked: () => {},
});

export function CityProvider({ children }) {
  const [cityId, setCityId] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [asked, setAsked] = useState(false); // показали ли модалку уже

  // чтение из LS/cookie при монтировании
  useEffect(() => {
    try {
      const fromLs = localStorage.getItem("city");
      if (fromLs) {
        const p = JSON.parse(fromLs);
        if (p?.id) {
          setCityId(p.id);
          setCityName(p.name || null);
          setAsked(true);
          return;
        }
      }
    } catch {}
    // если в LS пусто — попробуем cookie (полезно после SSR рендера)
    const c = getCookie("cityId");
    if (c) {
      const id = Number(decodeURIComponent(c));
      if (!Number.isNaN(id)) {
        setCityId(id);
        setAsked(true);
      }
    }
  }, []);

  const setCity = (id, name) => {
    setCityId(id ?? null);
    setCityName(name ?? null);
    // persist
    try { localStorage.setItem("city", JSON.stringify({ id, name })); } catch {}
    setCookie("cityId", id ?? "", 365);
  };

  const ensureAsked = () => setAsked(true);

  const value = useMemo(() => ({ cityId, cityName, setCity, ensureAsked }), [cityId, cityName]);

  return (
    <CityContext.Provider value={value}>
      {children}
      {/* Модалка спрашивается только если город ещё не выбран */}
      {!asked || !cityId ? <CityAskModal onPicked={(id, name) => { setCity(id, name); setAsked(true); }} /> : null}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}

/* -------- Модальное окно выбора города -------- */
function CityAskModal({ onPicked }) {
  const [open, setOpen] = useState(true);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // грузим список городов из вашего API
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(base + "/cities")
      .then(r => r.json())
      .then(setCities)
      .catch(() => setCities([{ id:1, name:"Dushanbe" }, { id:2, name:"Khujand" }]));
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute left-1/2 top-[15%] -translate-x-1/2 w-[92%] max-w-md bg-white rounded-2xl shadow-2xl p-5">
        <h3 className="text-lg font-semibold text-gray-900">Укажите ваш город</h3>
        <p className="text-sm text-gray-500 mt-1">Мы покажем мастеров и цены рядом с вами.</p>

        <div className="mt-4 grid gap-2 max-h-[50vh] overflow-auto pr-1">
          {cities.map(c => (
            <button
              key={c.id}
              onClick={() => { onPicked?.(c.id, c.name); setOpen(false); }}
              className="w-full text-left px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-full border text-sm"
          >
            Позже
          </button>
          <button
            onClick={() => { onPicked?.(1, "Dushanbe"); setOpen(false); }}
            className="px-5 py-2 rounded-full text-white text-sm font-semibold"
            style={{ background: "#00B140" }}
          >
            Выбрать «Dushanbe»
          </button>
        </div>
      </div>
    </div>
  );
}
