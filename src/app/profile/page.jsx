"use client";

import { useState } from "react";
import { User, Wallet, FileText, HardHat } from "lucide-react";

export default function Profile() {
  const [tab, setTab] = useState("masters");

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Шапка */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Majid Muminzoda</h2>
            <p className="text-sm text-green-600 font-medium">ID 159943</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Текущий баланс:</p>
            <p className="text-lg font-semibold text-green-600">0 с.</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
            + Пополнить
          </button>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => setTab("masters")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            tab === "masters"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
          }`}
        >
          <HardHat className="h-5 w-5" /> Мои мастера
        </button>

        <button
          onClick={() => setTab("info")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            tab === "info"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
          }`}
        >
          <User className="h-5 w-5" /> Информация
        </button>

        <button
          onClick={() => setTab("wallet")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            tab === "wallet"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
          }`}
        >
          <Wallet className="h-5 w-5" /> Кошелек
        </button>

        <button
          onClick={() => setTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            tab === "requests"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
          }`}
        >
          <FileText className="h-5 w-5" /> Мои заявки
        </button>
      </div>

      {/* Контент */}
      <div className="mt-6 border rounded-lg p-6 bg-gray-50">
        {tab === "masters" && (
          <div className="text-center text-gray-500 font-medium">
            Список мастеров пуст
          </div>
        )}
        {tab === "info" && (
          <div className="text-gray-600">Здесь будет информация о профиле.</div>
        )}
        {tab === "wallet" && (
          <div className="text-gray-600">История транзакций и баланс.</div>
        )}
        {tab === "requests" && (
          <div className="text-gray-600">Ваши заявки будут отображаться здесь.</div>
        )}
      </div>
    </div>
  );
}
