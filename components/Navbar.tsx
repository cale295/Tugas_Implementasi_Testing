"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800 text-white">
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        <h1 className="text-2xl font-bold text-cyan-400">
          GameHub
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="hover:text-cyan-400 transition"
          >
            Home
          </a>

          <a
            href="#products"
            className="hover:text-cyan-400 transition"
          >
            Products
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-5 border-t border-zinc-800 bg-black">
          <a
            href="#"
            className="pt-5 hover:text-cyan-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>

          <a
            href="#products"
            className="hover:text-cyan-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Products
          </a>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login"
              className="border border-cyan-500 px-4 py-3 rounded-lg font-semibold text-center hover:bg-cyan-500 hover:text-black transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-cyan-500 text-black px-4 py-3 rounded-lg font-semibold text-center hover:bg-cyan-400 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}