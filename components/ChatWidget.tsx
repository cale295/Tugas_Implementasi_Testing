// components/ChatWidget.tsx
"use client";

import { useState, useRef, useEffect } from "react";

type Category = {
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  short_description?: string;
  categories?: Category | Category[] | null;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  products?: Product[];
};

type ChatHistory = {
  role: "user" | "assistant";
  content: string;
};

function getCategoryName(product: Product): string {
  if (!product.categories) return "";
  if (Array.isArray(product.categories)) return product.categories[0]?.name ?? "";
  return product.categories.name ?? "";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);

  // Simpan history buat konteks AI + lastProducts buat follow-up
  const historyRef = useRef<ChatHistory[]>([]);
  const lastProductsRef = useRef<Product[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message;

    setChat((prev) => [...prev, { role: "user", text: currentMessage }]);
    setMessage("");
    setLoading(true);

    // Tambah ke history sebelum kirim
    historyRef.current = [
      ...historyRef.current,
      { role: "user", content: currentMessage },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          history: historyRef.current.slice(-6), // kirim 6 pesan terakhir
          lastProducts: lastProductsRef.current,  // kirim produk terakhir yang ditampilkan
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "AI tidak merespon";
      const newProducts: Product[] = data.products || [];

      // Update lastProducts kalau ada produk baru
      if (newProducts.length > 0) {
        lastProductsRef.current = newProducts;
      }

      // Tambah AI reply ke history
      historyRef.current = [
        ...historyRef.current,
        { role: "assistant", content: aiReply },
      ];

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiReply,
          products: newProducts,
        },
      ]);
    } catch (error) {
      console.error(error);
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "AI sedang error, coba lagi ya." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!open && chat.length === 0) {
      setChat([
        {
          role: "ai",
          text: "Halo 👋 Mau cari gaming gear apa? Contoh: mouse gaming ringan, keyboard wireless, monitor 144Hz.",
        },
      ]);
    }
    setOpen(!open);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-cyan-500 text-white text-2xl shadow-2xl z-50 hover:bg-cyan-400 transition"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-5 w-[400px] max-w-[95vw] h-[650px] bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl z-50">
          {/* Header */}
          <div className="bg-cyan-500 p-4 text-white font-bold flex items-center gap-2">
            <span>🎮</span> GameHub AI Support
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] ${msg.role === "user" ? "ml-auto" : ""}`}
              >
                {/* Bubble */}
                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-white"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-cyan-500 transition"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3">
                          <p className="font-semibold text-white text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {product.brand} · {getCategoryName(product)}
                          </p>
                          {product.short_description && (
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                              {product.short_description}
                            </p>
                          )}
                          <p className="text-cyan-400 text-sm font-semibold mt-2">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="bg-zinc-800 text-zinc-400 px-4 py-3 rounded-2xl w-fit text-sm animate-pulse">
                AI sedang mengetik...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-700 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Tanya produk..."
              className="flex-1 p-3 rounded-xl bg-zinc-800 text-white text-sm outline-none border border-zinc-700 focus:border-cyan-500 transition"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-cyan-500 px-5 rounded-xl text-white hover:bg-cyan-400 transition disabled:opacity-50 text-lg"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}