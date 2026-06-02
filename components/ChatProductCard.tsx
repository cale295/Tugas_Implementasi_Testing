"use client";

import React from "react";
import AddToCartButton from "./AddToCartButton";

interface Category {
  name: string;
}

interface ProductType {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  stock: number;
  short_description?: string;
  categories?: Category | Category[] | null;
}

interface ChatProductCardProps {
  product: ProductType;
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
  const getCategoryName = (): string => {
    if (!product.categories) return "";
    if (Array.isArray(product.categories)) {
      return product.categories[0]?.name ?? "";
    }
    return product.categories.name ?? "";
  };

  const categoryName = getCategoryName();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-zinc-800 border border-zinc-700/80 rounded-xl overflow-hidden hover:border-cyan-500/50 transition duration-300 flex flex-col w-full">
      {/* Product Image */}
      <div className="relative h-32 w-full overflow-hidden bg-zinc-950 flex-shrink-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {categoryName && (
            <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full backdrop-blur-xs border border-cyan-500/30">
              {categoryName}
            </span>
          )}
          {product.brand && (
            <span className="text-[9px] font-bold bg-black/60 text-zinc-300 px-2 py-0.5 rounded-full backdrop-blur-xs border border-zinc-700/50">
              {product.brand}
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-xs">
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1.5 rounded-md uppercase tracking-wider text-[10px]">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h4 className="font-bold text-white text-sm line-clamp-1" title={product.name}>
            {product.name}
          </h4>
          <p className="text-zinc-400 text-xs mt-1 line-clamp-2 min-h-[32px]">
            {product.short_description || "No description available."}
          </p>
        </div>

        {/* Pricing and Stock info */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-cyan-400 text-sm font-extrabold font-mono">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isOutOfStock
                  ? "text-red-400 bg-red-950/20 border border-red-900/30"
                  : product.stock <= 5
                  ? "text-amber-400 bg-amber-950/20 border border-amber-900/30 animate-pulse"
                  : "text-zinc-400 bg-zinc-700/50"
              }`}
            >
              {isOutOfStock ? "Habis" : `Stok: ${product.stock}`}
            </span>
          </div>

          {/* Add to Cart button */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              image_url: product.image_url,
              stock: product.stock,
            }}
            className={`mt-2.5 w-full py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer bg-cyan-500 text-black hover:bg-cyan-400`}
            disabledClassName={`mt-2.5 w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed`}
          >
            🛒 Tambah ke Keranjang
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
