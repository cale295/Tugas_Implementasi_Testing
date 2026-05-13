import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white flex items-center px-6 md:px-10">
      <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-14 items-center w-full">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm mb-6">
            Premium Gaming Store
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Upgrade Your
            <span className="block text-cyan-400">
              Gaming Setup
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg leading-relaxed max-w-xl">
            Build your ultimate gaming experience with
            premium keyboards, gaming mice, headsets,
            monitors, and high-performance accessories.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="#produk"
              className="bg-cyan-500 text-black px-7 py-4 rounded-xl font-bold hover:bg-cyan-400 transition"
            >
              Shop Now
            </Link>

            <Link
              href="/login"
              className="border border-zinc-700 px-7 py-4 rounded-xl font-bold hover:border-cyan-400 hover:text-cyan-400 transition"
            >
              Customer Login
            </Link>
          </div>

          <div className="flex gap-10 mt-14">
            <div>
              <h3 className="text-3xl font-bold">
                10K+
              </h3>

              <p className="text-zinc-500 text-sm mt-1">
                Customers
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                500+
              </h3>

              <p className="text-zinc-500 text-sm mt-1">
                Products
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                4.9
              </h3>

              <p className="text-zinc-500 text-sm mt-1">
                Rating
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute w-[450px] h-[450px] bg-cyan-500/20 blur-3xl rounded-full" />

          <img
            src="https://images.unsplash.com/photo-1542751110-97427bbecf20"
            alt="Gaming Setup"
            className="relative z-10 w-full max-w-[600px] h-[650px] object-cover rounded-3xl border border-zinc-800 shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}