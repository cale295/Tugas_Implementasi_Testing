export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-black text-white border-b border-zinc-800">
      <h1 className="text-2xl font-bold text-cyan-400">
        GameHub
      </h1>

      <div className="flex gap-6">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <a href="#">Categories</a>
      </div>

      <button className="bg-cyan-500 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition">
        Cart
      </button>
    </nav>
  );
}