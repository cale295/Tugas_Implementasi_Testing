"use client";

import { useState } from "react";

const products = [
  {
    name: "Gaming Mouse",
    price: "Rp 250.000",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db",
  },
  {
    name: "Mechanical Keyboard",
    price: "Rp 550.000",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
  },
  {
    name: "Gaming Headset",
    price: "Rp 350.000",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    name: '24" Gaming Monitor',
    price: "Rp 2.500.000",
    category: "Monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
  },
  {
    name: "RTX Gaming PC",
    price: "Rp 15.000.000",
    category: "PC",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  },
  {
    name: "Gaming Chair",
    price: "Rp 1.800.000",
    category: "Furniture",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
  },
  {
    name: "Wireless Controller",
    price: "Rp 650.000",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
  },
];

const categories = [
  "All",
  "Accessories",
  "Audio",
  "Monitor",
  "PC",
  "Furniture",
];

export default function ProductSection() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === selectedCategory
        );

  return (
    <section id="produk" className="bg-zinc-950 text-white px-10 py-20">
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
            key={product.name}
            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-400 hover:-translate-y-1 transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-60 w-full object-cover"
            />

            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h3 className="text-xl font-bold mt-4">
                {product.name}
              </h3>

              <p className="text-cyan-400 mt-2 font-semibold">
                {product.price}
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