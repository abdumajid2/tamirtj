"use client";
import Link from "next/link";
import { useRegisterMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetCitiesQuery } from "@/store/api/baseApi";

export default function RegisterPage() {
  const router = useRouter();
  const token = useSelector((s) => s.auth?.accessToken);
  const [register, { isLoading }] = useRegisterMutation();
  const { data: cities = [] } = useGetCitiesQuery();
  const [err, setErr] = useState("");

  useEffect(() => {
    if (token) router.replace("/");
  }, [token, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      role: form.role.value, // ← важное поле
      cityId: Number(form.cityId.value || 1),
    };
    setErr("");
    try {
      await register(body).unwrap();
      console.log("Register payload ->", body);
 // уже кладёт в стор токен+юзера
      router.push("/");
    } catch (e) {
      setErr(e?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="min-h-[80vh] w-full grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 shadow-lg bg-white p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Регистрация
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Создайте аккаунт, чтобы продолжить.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ваше имя"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Придумайте пароль"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Роль</label>
              <select
                name="role"
                defaultValue="user"
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full"
              >
                <option value="user">Пользователь</option>
                <option value="master">Мастер</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Город</label>
              <select
                name="cityId"
                defaultValue="1"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full"
              >
                {cities?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {err && <p className="text-red-600 text-sm">{err}</p>}

            <button
              disabled={isLoading}
              className="w-full rounded-xl px-4 py-2.5 font-semibold text-white transition
                       bg-[#00B140] hover:opacity-90 active:opacity-80
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-[0_6px_20px_rgba(0,177,64,0.35)]"
            >
              {isLoading ? "Создаём..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Уже есть аккаунт? </span>
            <Link
              href="/login"
              className="font-medium text-[#00B140] hover:underline underline-offset-4"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
