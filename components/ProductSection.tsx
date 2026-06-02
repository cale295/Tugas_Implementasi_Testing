"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "./AddToCartButton";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  stock: number;
  short_description: string;
  categories:
    | {
        name: string;
      }[]
    | null;
};

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [
        { data: productData, error: productError },
        { data: categoryData, error: categoryError },
      ] = await Promise.all([
        supabase.from("products").select(`
          id,
          name,
          brand,
          price,
          image_url,
          stock,
          short_description,
          categories (
            name
          )
        `),
        supabase.from("categories").select("name"),
      ]);

      if (productError) {
        console.error(productError);
      }

      if (categoryError) {
        console.error(categoryError);
      }

      setProducts((productData as unknown as Product[]) || []);
      setCategories([
        "All",
        ...(categoryData?.map((item) => item.name) || []),
      ]);

      setLoading(false);
    }

    loadData();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.categories?.[0]?.name === selectedCategory
        );

  if (loading) {
    return (
      <section className="bg-zinc-950 text-white px-6 md:px-10 py-20 min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium animate-pulse">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="produk" className="bg-zinc-950 text-white px-6 md:px-10 py-20 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-zinc-300 to-cyan-400 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-zinc-400 mt-2">Explore premium gaming gear</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border transition font-medium ${
                selectedCategory === category
                  ? "bg-cyan-500 text-black border-cyan-500"
                  : "border-zinc-700 text-white hover:border-cyan-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => {
          const isOutOfStock = product.stock <= 0;
          return (
            <div
              key={product.id}
              className="group bg-zinc-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-500/50 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-60 w-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full backdrop-blur-md border border-cyan-500/30">
                    {product.categories?.[0]?.name || "Uncategorized"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-black/60 text-zinc-300 px-3 py-1 rounded-full backdrop-blur-md border border-zinc-700/50">
                    {product.brand}
                  </span>
                </div>
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-xs">
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-4 py-2 rounded-lg uppercase tracking-wider text-sm">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1 line-clamp-2 min-h-[40px]">
                    {product.short_description || "Premium gaming accessories for your setups."}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-lg">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        isOutOfStock
                          ? "text-red-400 bg-red-950/30 border border-red-900/50"
                          : product.stock <= 5
                          ? "text-amber-400 bg-amber-950/30 border border-amber-900/50 animate-pulse"
                          : "text-zinc-400 bg-zinc-800/50"
                      }`}
                    >
                      {isOutOfStock ? "Habis" : `Stok: ${product.stock}`}
                    </span>
                  </div>

                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      brand: product.brand,
                      price: product.price,
                      image_url: product.image_url,
                      stock: product.stock,
                    }}
                    className="mt-5 w-full py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 cursor-pointer bg-cyan-500 text-black hover:bg-cyan-400 shadow-md shadow-cyan-500/10 hover:shadow-cyan-400/20"
                    disabledClassName="mt-5 w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                  >
                    🛒 Add to Cart
                  </AddToCartButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}