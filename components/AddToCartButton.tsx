"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

interface ProductInput {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  stock: number;
}

interface AddToCartButtonProps {
  product: ProductInput;
  className?: string;
  disabledClassName?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({
  product,
  className = "bg-cyan-500 text-black hover:bg-cyan-400 font-bold py-2 px-4 rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2",
  disabledClassName = "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2",
  children,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
    });

    setToast({
      show: true,
      message: result.success ? "Produk berhasil ditambahkan ke keranjang" : result.message,
      type: result.success ? "success" : "error",
    });
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <>
      {/* Toast Portal/Container */}
      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 md:top-24 md:bottom-auto z-[9999] flex items-center p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
            toast.type === "success"
              ? "bg-zinc-900/95 backdrop-blur-md border-cyan-500 text-white"
              : "bg-zinc-900/95 backdrop-blur-md border-red-500 text-white"
          }`}
        >
          <div className="mr-3">
            {toast.type === "success" ? (
              <span className="text-cyan-400 text-xl font-bold">✓</span>
            ) : (
              <span className="text-red-400 text-xl font-bold">⚠️</span>
            )}
          </div>
          <div className="text-sm font-semibold">{toast.message}</div>
        </div>
      )}

      <button
        onClick={handleAddToCartClick}
        disabled={isOutOfStock}
        className={isOutOfStock ? disabledClassName : className}
      >
        {children || (isOutOfStock ? "Stok Habis" : "🛒 Add to Cart")}
      </button>
    </>
  );
}
