"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  useGetThreadByIdQuery,
  useGetMasterByIdQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@/store/api/baseApi";

const userId = "1"; // текущий пользователь

export default function ChatThreadPage() {
  const { threadId } = useParams();
  const { data: thread } = useGetThreadByIdQuery(threadId);
  const { data: master } = useGetMasterByIdQuery(thread?.masterId, { skip: !thread?.masterId });
  const { data: messages = [] } = useGetMessagesQuery(threadId, { skip: !threadId });
  const [sendMessage] = useSendMessageMutation();

  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  async function handleSend() {
    const t = text.trim();
    if (!t) return;
    await sendMessage({ threadId, from: "user", text: t });
    setText("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto p-4">
      <header className="p-3 border-b flex items-center gap-3">
        <div className="font-semibold">{master?.fullName || "Диалог"}</div>
        <div className="text-xs text-gray-500">#{threadId}</div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-lg mt-3">
        {messages.map((m) => (
          <div
            key={m.id || m.createdAt}
            className={`max-w-[70%] p-2 rounded-lg mb-2 ${
              m.from === "user" ? "bg-emerald-100 ml-auto" : "bg-white"
            }`}
          >
            <div className="text-sm">{m.text}</div>
            <div className="mt-1 text-[11px] text-gray-500">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <footer className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите сообщение…"
          className="flex-1 border rounded-lg px-3 py-2"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="px-4 bg-emerald-500 text-white rounded-lg">
          Отправить
        </button>
      </footer>
    </div>
  );
}
