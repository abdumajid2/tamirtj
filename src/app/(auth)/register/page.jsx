"use client";
import { useRegisterMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm">
      <h1 className="text-xl font-semibold">Регистрация</h1>
      <input name="name" placeholder="Имя" className="border p-2 w-full" required />
      <input name="email" type="email" placeholder="Email" className="border p-2 w-full" required />
      <input name="phone" placeholder="Телефон" className="border p-2 w-full" />
      <select name="cityId" className="border p-2 w-full" defaultValue="1">
        <option value="1">Душанбе</option>
        <option value="2">Худжанд</option>
        <option value="3">Бохтар</option>
        <option value="4">Куляб</option>
        <option value="5">Истаравшан</option>
      </select>
      <input name="password" type="password" placeholder="Пароль (мин. 6)" className="border p-2 w-full" required minLength={6} />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={isLoading} className="bg-black text-white p-2 rounded w-full">
        {isLoading ? "Создаем..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
