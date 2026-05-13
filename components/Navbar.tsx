import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 bg-black/80 backdrop-blur-xl text-white border-b border-zinc-800">
      <h1 className="text-2xl font-bold text-cyan-400">
        GameHub
      </h1>

      <div className="flex gap-6">
        <a
          href="#"
          className="hover:text-cyan-400 transition"
        >
          Home
        </a>

        <a
          href="#produk"
          className="hover:text-cyan-400 transition"
        >
          Products
        </a>
      </div>

      <div className="flex items-center gap-4">
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
    </nav>
  );
}