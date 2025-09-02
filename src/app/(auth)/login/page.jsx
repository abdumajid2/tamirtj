"use client";
import Link from "next/link";
import { useLoginMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/authSlice";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [err, setErr] = useState("");

  // если уже авторизован — уводим со страницы логина
  const token = useSelector((s) => s.auth?.accessToken);
  useEffect(() => {
    if (token) router.replace("/");
  }, [token, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value.trim(),
      password: e.currentTarget.password.value,
    };
    setErr("");
    try {
      const data = await login(body).unwrap(); // ожидаем { user, accessToken }
      dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
      router.push("/");
    } catch (e) {
      setErr(e?.data?.message || "Неверный email или пароль");
    }
  };

  return (
    <div className="min-h-[80vh] w-full grid place-items-center px-4">
      <div className="w-full max-w-md">
        {/* Карточка */}
        <div className="rounded-2xl border border-gray-100 shadow-lg bg-white p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Войти</h1>
            <p className="text-sm text-gray-500 mt-1">
              Добро пожаловать! Авторизуйтесь, чтобы продолжить.
            </p>
          </div>

          {/* Соц-кнопки */}
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              {/* Google SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.2-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.6 6 29.1 4 24 4 16.1 4 9.3 8.5 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.3 0 10-1.8 13.6-5l-6.3-5.2C29.4 36 26.9 37 24 37c-5.4 0-9.9-3.1-11.7-7.6l-6.6 5.1C8.8 39.4 15.9 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3-4.8 5-8.3 5-5.4 0-9.9-3.1-11.7-7.6l-6.6 5.1C10.2 39.4 17.3 44 24 44c10 0 19-7.3 19-20 0-1.2-.1-2.3-.4-3.5z"/>
              </svg>
              Войти через Google
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              {/* Apple SVG */}
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.365 1.43c.082 1.02-.3 2.02-.98 2.79-.73.84-1.91 1.49-3.06 1.41-.096-1.01.33-2.04.98-2.78.77-.86 2.08-1.5 3.06-1.42zM20.49 17.41c-.53 1.19-1.17 2.37-2.1 3.39-.78.86-1.73 1.8-2.95 1.8-1.27 0-1.68-.82-3.13-.82-1.47 0-1.93.79-3.17.84-1.28.05-2.25-.93-3.03-1.79-1.65-1.84-2.93-4.67-2.28-7.21.39-1.53 1.41-2.81 2.84-3.34 1.38-.51 2.9-.3 4.2.34.5.25 1.04.55 1.6.53.5-.02.98-.29 1.44-.53 1.5-.76 3.12-.86 4.54.03.67.41 1.22.98 1.62 1.65-1.9 1.11-2.54 3.53-1.59 5.12z"/>
              </svg>
              Войти через Apple
            </button>
          </div>

          {/* Разделитель */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px w-full bg-gray-200" />
            <span className="text-xs uppercase text-gray-400">или</span>
            <div className="h-px w-full bg-gray-200" />
          </div>

          {/* Форма логина (логика без изменений) */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Ваш пароль"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
                required
                autoComplete="current-password"
              />
            </div>

            {err && <p className="text-red-600 text-sm">{err}</p>}

            <button
              disabled={isLoading}
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white transition
                         bg-[#00B140] hover:opacity-90 active:opacity-80
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-[0_6px_20px_rgba(0,177,64,0.35)]"
            >
              {isLoading ? "Входим..." : "Войти"}
            </button>
          </form>

          {/* Низ карточки */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>У меня нет аккаунта? </span>
            <Link
              href="/register"
              className="font-medium text-[#00B140] hover:underline underline-offset-4"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
