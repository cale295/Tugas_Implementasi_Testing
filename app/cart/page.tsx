"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, ShoppingBag, CheckCircle, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  note: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  // Checkout modal visibility
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Success modal state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<any>(null);

  // Form states
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);

  // Toast inside checkout or page
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleQtyChange = (id: string, currentQty: number, targetQty: number) => {
    const res = updateQuantity(id, targetQty);
    if (!res.success) {
      showToast(res.message, "error");
    }
  };

  // Validation regex for phone number (accepts indonesian formats: +62..., 62..., 08...)
  const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Nama lengkap harus diisi";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Nama lengkap minimal 3 karakter";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s/g, ""))) {
      newErrors.phone = "Nomor telepon tidak valid (contoh: 081234567890)";
    }

    if (!form.address.trim()) {
      newErrors.address = "Alamat pengiriman harus diisi";
    } else if (form.address.trim().length < 10) {
      newErrors.address = "Alamat pengiriman minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate pseudo-random order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GH-${dateStr}-${randomNum}`;

    // Create the temporary order JSON object
    const orderData = {
      order_id: orderId,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim() || null,
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      totals: {
        subtotal: totalPrice,
        shipping: 0, // Free Shipping
        grand_total: totalPrice,
      },
      created_at: new Date().toISOString(),
    };

    setGeneratedOrder(orderData);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);

    // Empty the cart
    clearCart();

    // Reset form
    setForm({
      name: "",
      phone: "",
      address: "",
      note: "",
    });
  };

  const handleCopyJson = () => {
    if (!generatedOrder) return;
    navigator.clipboard.writeText(JSON.stringify(generatedOrder, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between text-white">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {toast.show && (
          <div
            className={`fixed bottom-5 right-5 md:top-24 md:bottom-auto z-50 flex items-center p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-zinc-900 border-cyan-500 text-white"
                : "bg-zinc-900 border-red-500 text-white"
            }`}
          >
            <div className="mr-3">
              {toast.type === "success" ? (
                <span className="text-cyan-400 text-xl font-bold">✓</span>
              ) : (
                <span className="text-red-400 text-xl font-bold">⚠️</span>
              )}
            </div>
            <div className="text-sm font-semibold">{toast.message}</div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 bg-zinc-900/60 border border-zinc-800 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Keranjang Belanja
            </h2>
            <p className="text-zinc-500 text-sm mt-0.5">Kelola item pilihan game-mu</p>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/20 backdrop-blur-xs border border-zinc-900 rounded-2xl p-8">
            <div className="w-20 h-20 bg-zinc-900/50 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 mb-6 group hover:border-cyan-500/50 hover:text-cyan-400 transition duration-300">
              <ShoppingBag size={38} className="group-hover:scale-110 transition duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-300">Keranjang Anda Kosong</h3>
            <p className="text-zinc-500 mt-2 max-w-sm">
              Belum ada produk yang ditambahkan. Silakan jelajahi koleksi gaming gear premium kami.
            </p>
            <Link
              href="/#produk"
              className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          /* Cart Layout */
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-4 md:p-6 transition flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  {/* Product Details (Image, Title, Brand) */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">
                        {item.brand}
                      </span>
                      <h4 className="text-lg font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-zinc-500 text-sm font-semibold mt-1">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Subtotal Controls */}
                  <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-zinc-800/50">
                    {/* Quantity selectors */}
                    <div className="flex items-center gap-1 bg-black/60 border border-zinc-800 rounded-xl p-1">
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity, item.quantity - 1)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            handleQtyChange(item.id, item.quantity, val);
                          }
                        }}
                        className="w-10 text-center font-bold text-white bg-transparent outline-none border-none text-sm font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => handleQtyChange(item.id, item.quantity, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`p-2 rounded-lg transition ${
                          item.quantity >= item.stock
                            ? "text-zinc-700 cursor-not-allowed"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex items-center gap-6">
                      <div className="text-right min-w-[100px]">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Subtotal</p>
                        <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(item.price * item.quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 bg-zinc-950/60 border border-zinc-900 hover:border-red-950 hover:bg-red-950/20 hover:text-red-400 rounded-xl transition group"
                        title="Hapus item"
                      >
                        <Trash2 size={18} className="group-hover:scale-105 transition" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Ringkasan Pesanan</h3>
              <div className="space-y-4 border-b border-zinc-800/50 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-mono text-zinc-300">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Biaya Pengiriman</span>
                  <span className="font-semibold text-emerald-400 uppercase tracking-wider text-xs">
                    Gratis Ongkir
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-base font-bold text-zinc-300">Total Harga</span>
                <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalPrice)}
                </span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20"
              >
                <CreditCard size={18} />
                Lanjutkan ke Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-250 my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                📦 Formulir Checkout
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6">
              {/* Order Items Preview */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 max-h-[160px] overflow-y-auto space-y-2.5">
                <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">
                  Ringkasan Barang ({cart.length} item)
                </p>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-medium line-clamp-1 max-w-[70%]">
                      {item.name} <span className="text-cyan-400 font-semibold font-mono">x{item.quantity}</span>
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-zinc-800/50 pt-2 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Bayar</span>
                  <span className="text-cyan-400 font-mono">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-zinc-400">
                    Nama Pelanggan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className={`w-full p-3 rounded-xl bg-zinc-900 text-white border text-sm outline-none transition ${
                      errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-cyan-500"
                    }`}
                  />
                  {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name}</span>}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-zinc-400">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    className={`w-full p-3 rounded-xl bg-zinc-900 text-white border text-sm outline-none transition ${
                      errors.phone ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-cyan-500"
                    }`}
                  />
                  {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone}</span>}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="address" className="text-sm font-semibold text-zinc-400">
                  Alamat Pengiriman <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat pengiriman lengkap beserta kode pos"
                  className={`w-full p-3 rounded-xl bg-zinc-900 text-white border text-sm outline-none resize-none transition ${
                    errors.address ? "border-red-500 focus:border-red-500" : "border-zinc-800 focus:border-cyan-500"
                  }`}
                />
                {errors.address && <span className="text-xs text-red-500 font-medium">{errors.address}</span>}
              </div>

              {/* Order Note */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="note" className="text-sm font-semibold text-zinc-400">
                  Catatan Pesanan <span className="text-zinc-600">(opsional)</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  value={form.note}
                  onChange={handleInputChange}
                  placeholder="Catatan tambahan untuk penjual atau kurir..."
                  className="w-full p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800 focus:border-cyan-500 text-sm outline-none resize-none transition"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-850 hover:bg-zinc-900 font-bold transition text-zinc-400 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold transition shadow-lg shadow-cyan-500/10 cursor-pointer"
                >
                  Konfirmasi Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal showing temporary JSON receipt */}
      {isSuccessOpen && generatedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-250 p-6 md:p-8 my-8">
            <div className="flex flex-col items-center text-center max-w-md mx-auto mb-8">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={36} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Pesanan Berhasil Dibuat!</h3>
              <p className="text-zinc-500 text-sm mt-1">
                Terima kasih atas pesanan Anda. Keranjang Anda telah dikosongkan secara otomatis.
              </p>
            </div>

            {/* JSON Output Container */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📄</span> Output JSON Order (Sementara)
                </span>
                <button
                  onClick={handleCopyJson}
                  className="text-xs bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:text-cyan-400 text-zinc-400 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={12} />
                  {copied ? "Tersalin!" : "Salin JSON"}
                </button>
              </div>

              {/* Code Highlight box */}
              <div className="relative bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden p-4 max-h-[300px] overflow-y-auto">
                <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(generatedOrder, null, 2)}
                </pre>
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 text-xs text-zinc-400 leading-relaxed">
                <strong className="text-cyan-400 block mb-1">💡 Catatan Simulasi:</strong>
                Data transaksi di atas disimpan dalam client state sementara dan tidak dikirimkan/disimpan ke database order maupun cart manapun sesuai ketentuan.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-center mt-8 pt-6 border-t border-zinc-900">
              <Link
                href="/"
                onClick={() => setIsSuccessOpen(false)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-8 py-3 rounded-xl transition shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 text-center cursor-pointer min-w-[200px]"
              >
                Kembali Belanja
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
