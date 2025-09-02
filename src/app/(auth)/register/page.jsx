"use client";
import { useRegisterMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: e.currentTarget.name.value.trim(),
      email: e.currentTarget.email.value.trim(),
      password: e.currentTarget.password.value,
      phone: e.currentTarget.phone.value.trim() || undefined,
      cityId: Number(e.currentTarget.cityId.value) || null,
    };
    setErr("");
    try {
      await registerUser(body).unwrap();
      router.push("/"); // или /profile
    } catch (e) {
      setErr(e?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="min-h-[80vh] w-full grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 shadow-lg bg-white p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Регистрация</h1>
            <p className="text-sm text-gray-500 mt-1">
              Создайте аккаунт, чтобы пользоваться сервисом
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Имя</label>
              <input
                name="name"
                placeholder="Ваше имя"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Телефон</label>
              <input
                name="phone"
                placeholder="+992 900 00 00 00"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Город</label>
              <select
                name="cityId"
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
                defaultValue="1"
              >
                <option value="1">Душанбе</option>
                <option value="2">Худжанд</option>
                <option value="3">Бохтар</option>
                <option value="4">Куляб</option>
                <option value="5">Истаравшан</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Пароль</label>
              <input
                name="password"
                type="password"
                placeholder="Пароль (мин. 6 символов)"
                minLength={6}
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 w-full outline-none focus:ring-4 focus:ring-green-100 focus:border-[#00B140]"
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
              {isLoading ? "Создаем..." : "Зарегистрироваться"}
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
