"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  categories:
    | {
        name: string;
      }[]
    | null;
};

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "All",
  ]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

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
          price,
          image_url,
          categories (
            name
          )
        `),

        supabase
          .from("categories")
          .select("name"),
      ]);

      if (productError) {
        console.log(productError);
      }

      if (categoryError) {
        console.log(categoryError);
      }

      setProducts(productData || []);

      setCategories([
        "All",
        ...(categoryData?.map(
          (item) => item.name
        ) || []),
      ]);

      setLoading(false);
    }

    loadData();
  }, []);

  const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(
        (product) =>
          product.categories?.[0]?.name ===
          selectedCategory
      );

  if (loading) {
    return (
      <section className="bg-zinc-950 text-white px-10 py-20">
        Loading products...
      </section>
    );
  }

  return (
    <section
      id="produk"
      className="bg-zinc-950 text-white px-10 py-20"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
        <div>
          <h2 className="text-4xl font-bold">
            Featured Products
          </h2>

          <p className="text-zinc-400 mt-2">
            Explore premium gaming gear
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
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
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-400 hover:-translate-y-1 transition duration-300"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="h-60 w-full object-cover"
            />

            <div className="p-5">
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
  {product.categories?.[0]?.name}
</span>

              <h3 className="text-xl font-bold mt-4">
                {product.name}
              </h3>

              <p className="text-cyan-400 mt-2 font-semibold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </p>

              <button className="mt-5 w-full bg-cyan-500 py-2 rounded-lg font-semibold text-black hover:bg-cyan-400 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}