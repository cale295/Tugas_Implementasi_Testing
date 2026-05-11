const products = [
  {
    name: "Gaming Mouse",
    price: "Rp 250.000",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db",
  },
  {
    name: "Mechanical Keyboard",
    price: "Rp 550.000",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
  },
  {
    name: "Gaming Headset",
    price: "Rp 350.000",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
];

export default function ProductSection() {
  return (
    <section className="bg-zinc-950 text-white px-10 py-20">
      <h2 className="text-4xl font-bold mb-10">
        Featured Products
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.name}
            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-cyan-400 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-60 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-bold">
                {product.name}
              </h3>

              <p className="text-cyan-400 mt-2">
                {product.price}
              </p>

              <button className="mt-5 w-full bg-cyan-500 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}