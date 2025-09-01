"use client";
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
  useEffect(() => { if (token) router.replace("/"); }, [token, router]);

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
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm">
      <h1 className="text-xl font-semibold">Войти</h1>
      <input name="email" type="email" placeholder="Email" className="border p-2 w-full" required />
      <input name="password" type="password" placeholder="Пароль" className="border p-2 w-full" required />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={isLoading} className="bg-black text-white p-2 rounded w-full">
        {isLoading ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}
