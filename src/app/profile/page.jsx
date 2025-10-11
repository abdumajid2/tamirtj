// src/app/profile/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import {
  User, Wallet, FileText, HardHat, Phone, Star, BadgeCheck
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_AUTH || "http://localhost:4000";

/* === такой же helper, как в Navbar === */
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

export default function Profile() {
  const authUser = useSelector((s) => s.auth?.user);
  const accessToken = useSelector((s) => s.auth?.accessToken);

  const [lsToken, setLsToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // «гидрация» + мгновенное чтение токена из LS
  useEffect(() => {
    setHydrated(true);
    setLsToken(readAccessTokenFromLS());
    const onFocus = () => setLsToken(readAccessTokenFromLS());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const isAuthed = !!authUser || !!accessToken || !!lsToken;
  const userId = authUser?.id ?? null;

  // ---- профиль (balance и т.д.) ----
  const [profile, setProfile] = useState(authUser || null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errProfile, setErrProfile] = useState("");

  // ---- мастера из тредов ----
  const [masters, setMasters] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(false);
  const [errMasters, setErrMasters] = useState("");

  // загрузка профиля (из /users — как в вашем mock-сервере)
  useEffect(() => {
    if (!isAuthed) return; // не мучаем сервер без токена
    let canceled = false;

    (async () => {
      try {
        setLoadingProfile(true);
        setErrProfile("");

        // получим список и найдём себя (в mock нет /auth/me)
        const res = await fetch(`${API}/users`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load user list");
        const list = await res.json();

        // если Redux знает userId — используем его; если нет, просто возьмём первого —
        // (в реальном API замените на /auth/me)
        const me =
          (userId && Array.isArray(list) && list.find((u) => u.id === userId)) ||
          (Array.isArray(list) ? list[0] : null);

        if (!canceled) setProfile(me);
      } catch (e) {
        if (!canceled) setErrProfile("Не удалось загрузить профиль");
      } finally {
        if (!canceled) setLoadingProfile(false);
      }
    })();

    return () => { canceled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, userId]);

  // загрузка мастеров из моих тредов
  useEffect(() => {
    if (!isAuthed) return;
    let canceled = false;

    (async () => {
      try {
        setLoadingMasters(true);
        setErrMasters("");

        // если нет id из Redux, треды мы не найдём — это ok
        const uid = userId ?? "1"; // fallback под seed, чтобы что-то показать
        const tr = await fetch(
          `${API}/threads?userId=${encodeURIComponent(uid)}&_sort=lastTs&_order=desc`,
          { credentials: "include" }
        );
        if (!tr.ok) throw new Error("Failed to load threads");
        const threads = await tr.json();

        const ids = [...new Set((threads || []).map((t) => t.masterId).filter(Boolean))];
        const masterList = await Promise.all(
          ids.map(async (id) => {
            const r = await fetch(`${API}/masters/${id}`, { credentials: "include" });
            if (!r.ok) return null;
            return r.json();
          })
        );
        const cleaned = masterList.filter(Boolean);
        if (!canceled) setMasters(cleaned);
      } catch (e) {
        if (!canceled) setErrMasters("Не удалось загрузить мастеров");
      } finally {
        if (!canceled) setLoadingMasters(false);
      }
    })();

    return () => { canceled = true; };
  }, [isAuthed, userId]);

  const balance = useMemo(() => profile?.balance ?? 0, [profile]);

  // если нет вообще никаких следов авторизации
  if (hydrated && !isAuthed) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-xl border p-6 bg-white">
          <h2 className="text-xl font-semibold">Нужно войти</h2>
          <p className="text-gray-600 mt-2">
            Пожалуйста, <Link href="/login" className="text-green-600 underline">войдите</Link> или{" "}
            <Link href="/register" className="text-green-600 underline">зарегистрируйтесь</Link>, чтобы увидеть профиль.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Шапка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {profile?.name || "Профиль"}
            </h2>
            <p className="text-sm text-green-600 font-medium">
              ID {profile?.id ?? "—"}
            </p>
            <p className="text-xs text-gray-500">{profile?.email || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Текущий баланс:</p>
            <p className="text-lg font-semibold text-green-600">
              {loadingProfile ? "…" : `${balance} с.`}
            </p>
            {errProfile && <p className="text-xs text-red-600">{errProfile}</p>}
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
            + Пополнить
          </button>
        </div>
      </div>

      {/* Навигация */}
      <Tabs masters={<MastersBlock loading={loadingMasters} error={errMasters} masters={masters} />}
            info={<InfoBlock profile={profile} />}
            wallet={<div className="text-gray-600">История транзакций пока пустая. Баланс: <span className="font-semibold text-green-700">{balance} с.</span></div>}
            requests={<div className="text-gray-600">Заявок пока нет.</div>}
      />
    </div>
  );
}

/* --- UI блоки --- */

function Tabs({ masters, info, wallet, requests }) {
  const [tab, setTab] = useState("masters");
  return (
    <>
      <div className="flex flex-wrap gap-3 mt-6">
        <TabBtn active={tab === "masters"} onClick={() => setTab("masters")} Icon={HardHat} text="Мои мастера" />
        <TabBtn active={tab === "info"} onClick={() => setTab("info")} Icon={User} text="Информация" />
        <TabBtn active={tab === "wallet"} onClick={() => setTab("wallet")} Icon={Wallet} text="Кошелек" />
        <TabBtn active={tab === "requests"} onClick={() => setTab("requests")} Icon={FileText} text="Мои заявки" />
      </div>

      <div className="mt-6 border rounded-lg p-6 bg-gray-50">
        {tab === "masters" && masters}
        {tab === "info" && info}
        {tab === "wallet" && wallet}
        {tab === "requests" && requests}
      </div>
    </>
  );
}

function TabBtn({ active, onClick, Icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
        active
          ? "bg-green-600 text-white border-green-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
      }`}
    >
      <Icon className="h-5 w-5" /> {text}
    </button>
  );
}

function InfoBlock({ profile }) {
  return (
    <div className="grid gap-3 text-gray-700">
      <Row label="Имя" value={profile?.name} />
      <Row label="Email" value={profile?.email} />
      <Row label="Роль" value={profile?.role} />
      <Row label="Город" value={profile?.cityId} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{String(value ?? "—")}</span>
    </div>
  );
}

function MastersBlock({ loading, error, masters }) {
  if (loading) return <div className="text-center text-gray-500">Загружаем мастеров…</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!masters?.length) return <div className="text-center text-gray-500 font-medium">Список мастеров пуст</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {masters.map((m) => (
        <article key={m.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
              <Image
                src={m.avatar || "/placeholder.png"}
                alt={m.fullName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 truncate">{m.fullName}</h3>
                {m.verified && <BadgeCheck className="w-4 h-4 text-green-500" title="Проверенный" />}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-700">{Number(m.rating || 0).toFixed(1)}</span>
                <span>•</span>
                <span>{m.reviewsCount ?? 0} отзывов</span>
              </div>
            </div>
            <a
              href={`tel:${m.phone || ""}`}
              title={`Позвонить ${m.fullName}`}
              className="ml-auto w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700"
              rel="nofollow"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          <div className="px-4 pb-4">
            <Link href={`/masters/${m.id}`} className="inline-block text-sm text-green-700 hover:underline">
              Открыть профиль мастера
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
