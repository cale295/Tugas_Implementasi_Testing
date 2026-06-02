# GameHub - Premium Gaming Gear E-Commerce

**GameHub** adalah platform e-commerce modern yang didedikasikan untuk penjualan perlengkapan gaming (gaming gear) premium. Aplikasi ini dibangun menggunakan teknologi web modern seperti **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Supabase**, serta mengintegrasikan **AI Recommendation Assistant** yang cerdas berbasis model **Llama 3.1 8B Instruct** melalui Hugging Face Inference API.

---

## 🚀 Fitur Utama

1. **Katalog Produk Dinamis**
   - Data produk dan kategori dimuat secara *real-time* dari database **Supabase**.
   - Menyediakan fitur penyaringan (*filtering*) produk berdasarkan kategori secara interaktif.
   - Deteksi otomatis status ketersediaan barang (Stok Habis, Stok Menipis, atau Tersedia).

2. **Sistem Keranjang Belanja (React Context)**
   - Manajemen keranjang belanja secara global menggunakan React Context API.
   - Validasi ketat terhadap jumlah pembelian agar tidak melebihi stok yang tersedia di database.
   - Fitur untuk menambah, mengurangi, dan menghapus item langsung dari halaman keranjang.
   - Penyimpanan data keranjang secara otomatis di `localStorage` (inklusif penanganan hidrasi SSR untuk mencegah mismatch).

3. **Formulir Checkout & Simulasi Transaksi**
   - Halaman khusus `/cart` yang memuat ringkasan detail belanja.
   - Form checkout yang dilengkapi dengan validasi input yang ketat (seperti format nomor telepon Indonesia dan panjang karakter minimal alamat/nama).
   - Menghasilkan output tanda terima transaksi dalam format data **JSON terstruktur** setelah checkout berhasil dikonfirmasi.

4. **GameHub AI Chatbot Assistant**
   - Asisten rekomendasi belanja virtual yang berada di bagian sudut kanan bawah halaman.
   - Mampu memberikan rekomendasi dan komparasi spesifik berdasarkan produk nyata yang tersimpan di database.
   - Dilengkapi pendeteksi pertanyaan lanjutan (*follow-up*) untuk merespon diskusi komparasi dari pengguna secara kontekstual.
   - Ditenagai oleh model LLM **Llama-3.1-8B-Instruct** yang dihubungkan melalui Hugging Face.

5. **Antarmuka Premium & Responsif**
   - Desain estetis bertema futuristik gelap (*dark mode*) yang disukai para gamer.
   - Responsif di berbagai perangkat (Mobile, Tablet, Desktop).
   - Animasi mikro (*micro-animations*) halus, efek *glassmorphism*, dan transisi interaktif menggunakan **Tailwind CSS v4**.

---

## 🛠️ Tech Stack

* **Framework Utama:** [Next.js 16.2.4 (App Router)](https://nextjs.org/)
* **Library Frontend:** [React 19.2.4](https://react.dev/)
* **Database & BaaS:** [Supabase SDK](https://supabase.com/) (`@supabase/supabase-js`)
* **Kecerdasan Buatan:** [Hugging Face Inference](https://huggingface.co/) (`@huggingface/inference`)
* **Styling & Ikon:** [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)

---

## 📂 Struktur Direktori Utama

```bash
tugasimp/
├── app/                      # Next.js App Router Pages & API Routes
│   ├── api/chat/route.ts     # API Endpoint untuk integrasi chatbot Llama-3.1
│   ├── cart/page.tsx         # Halaman Keranjang Belanja & Form Checkout
│   ├── login/page.tsx        # Halaman Login (Simulasi)
│   ├── signup/page.tsx       # Halaman Pendaftaran (Simulasi)
│   ├── layout.tsx            # Root Layout pembungkus aplikasi (termasuk Provider)
│   └── page.tsx              # Halaman Utama (Homepage)
├── components/               # Komponen UI Reusable
│   ├── AddToCartButton.tsx   # Tombol dinamis dengan validasi stok
│   ├── ChatProductCard.tsx   # Card produk yang direkomendasikan di dalam chat
│   ├── ChatWidget.tsx        # Widget Chatbot AI interaktif di sudut layar
│   ├── Footer.tsx            # Footer aplikasi
│   ├── Hero.tsx              # Bagian atas halaman utama dengan jargon & banner
│   ├── Navbar.tsx            # Navigasi sticky dengan badge jumlah keranjang
│   └── ProductSection.tsx    # Bagian katalog produk dengan filter kategori
├── context/                  # Pengaturan State Global
│   └── CartContext.tsx       # Provider untuk logika keranjang (Cart State)
├── lib/                      # Inisialisasi Klien Eksternal
│   └── supabase.ts           # Konfigurasi Supabase Client
└── package.json              # Daftar dependensi dan script aplikasi
```

---

## ⚙️ Persyaratan Awal & Konfigurasi `.env.local`

Sebelum menjalankan aplikasi, Anda perlu menyiapkan berkas konfigurasi `.env.local` di root direktori proyek ini. Masukkan variabel lingkungan berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Hugging Face AI Configuration
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

---

## 🚀 Cara Menjalankan Project Secara Lokal

1. **Clone repositori ini** (atau buka direktori project).
2. **Install Dependensi:**
   Menggunakan npm untuk mengunduh modul-modul yang dibutuhkan:
   ```bash
   npm install
   ```

3. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal di [http://localhost:3000](http://localhost:3000).

4. **Build untuk Produksi (Opsional):**
   ```bash
   npm run build
   npm run start
   ```

---

## 💡 Informasi Tambahan Simulasi
- **Checkout Flow:** Transaksi yang dilakukan di situs ini bersifat **simulasi**. Ketika Anda mengisi form checkout dan melakukan konfirmasi, keranjang belanja Anda akan dikosongkan secara otomatis dan sistem akan menghasilkan file JSON berisi rincian data transaksi Anda (yang dapat disalin/diekspor). Tidak ada transaksi finansial nyata atau data yang disimpan permanen di database penjualan.
