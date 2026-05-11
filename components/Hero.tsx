export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-between px-10 bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="max-w-xl">
        <p className="text-cyan-400 mb-3">
          Gaming Accessories Store
        </p>

        <h1 className="text-6xl font-bold leading-tight">
          Upgrade Your
          <span className="text-cyan-400">
            {" "}
            Gaming Setup
          </span>
        </h1>

        <p className="mt-5 text-zinc-400">
          Temukan mouse, keyboard, headset,
          dan aksesoris gaming terbaik.
        </p>

        <button className="mt-8 bg-cyan-500 px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition">
          Shop Now
        </button>
      </div>

      <img
        src="https://images.unsplash.com/photo-1542751110-97427bbecf20"
        alt="gaming"
        className="w-[500px] rounded-3xl shadow-2xl"
      />
    </section>
  );
}