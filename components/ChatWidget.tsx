"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: currentMessage,
      }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      {
        role: "ai",
        text: data.reply,
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          if (!open && chat.length === 0) {
            setChat([
              {
                role: "ai",
                text: "Halo 👋 Selamat datang di GameHub! Ada yang bisa saya bantu cari? 🎮",
              },
            ]);
          }

          setOpen(!open);
        }}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-cyan-500 text-white text-2xl shadow-2xl z-50 hover:bg-cyan-400 transition"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-5 w-[400px] h-[650px] bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl z-50">
          {/* Header */}
          <div className="bg-cyan-500 p-4 text-white font-bold">
            GameHub AI Support
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === "user"
                    ? "bg-cyan-500 text-white ml-auto"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-700 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Tanya produk..."
              className="flex-1 p-2 rounded-lg bg-zinc-800 text-white outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-cyan-500 px-4 rounded-lg text-white hover:bg-cyan-400"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
