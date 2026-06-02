"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800 text-white">
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        <Link href="/" className="text-2xl font-bold text-cyan-400 tracking-wider">
          GameHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-cyan-400 transition text-zinc-300">
            Home
          </Link>

          <a href="/#produk" className="hover:text-cyan-400 transition text-zinc-300">
            Products
          </a>
        </div>

        {/* Desktop Buttons & Cart */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2.5 hover:text-cyan-400 hover:bg-zinc-800/40 rounded-xl transition text-zinc-300"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-black font-mono animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            className="border border-cyan-500 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-500 hover:text-black transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 hover:text-cyan-400 transition text-zinc-300"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-black font-mono">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-300 hover:text-cyan-400 transition"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-5 border-t border-zinc-800 bg-black">
          <Link
            href="/"
            className="pt-5 hover:text-cyan-400 transition text-zinc-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <a
            href="/#produk"
            className="hover:text-cyan-400 transition text-zinc-300"
            onClick={() => setIsOpen(false)}
          >
            Products
          </a>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login"
              className="border border-cyan-500 px-4 py-3 rounded-lg font-semibold text-center hover:bg-cyan-500 hover:text-black transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-cyan-500 text-black px-4 py-3 rounded-lg font-semibold text-center hover:bg-cyan-400 transition"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}