"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetThreadsQuery, useGetMasterByIdQuery } from "@/store/api/baseApi";

const userId = "1"; // текущий пользователь

function ThreadRow({ t }) {
  // мини-карточка мастера для строки
  const { data: master } = useGetMasterByIdQuery(t.masterId);
  return (
    <Link
      href={`/chat/${t.id}`}
      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl border"
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden border">
        <Image src={master?.avatar || "/placeholder.png"} alt="" fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{master?.fullName || `Мастер #${t.masterId}`}</div>
        <div className="text-sm text-gray-500 truncate">{t.lastMessage || "Нет сообщений"}</div>
      </div>
      <div className="text-xs text-gray-400">{new Date(t.lastTs).toLocaleTimeString()}</div>
    </Link>
  );
}

export default function ChatListPage() {
  const { data: threads = [], isLoading } = useGetThreadsQuery({ userId });

  return (
    <section className="max-w-3xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl font-bold mb-4">Чаты</h1>
      {isLoading && <div>Загрузка…</div>}
      {!isLoading && threads.length === 0 && (
        <div className="text-gray-500">Пока нет переписок.</div>
      )}
      <div className="grid gap-2">
        {threads.map((t) => <ThreadRow key={t.id} t={t} />)}
      </div>
    </section>
  );
}
