// app/api/chat/route.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Category = {
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  short_description: string;
  category_id: string | null;
  categories: Category | Category[] | null;
};

type ChatHistory = {
  role: "user" | "assistant";
  content: string;
};

function getCategory(product: Product): Category | null {
  if (!product.categories) return null;
  if (Array.isArray(product.categories)) return product.categories[0] ?? null;
  return product.categories;
}

function buildProductContext(products: Product[]): string {
  return products
    .map((product) => {
      const category = getCategory(product);
      return `
Nama: ${product.name}
Brand: ${product.brand}
Harga: Rp ${new Intl.NumberFormat("id-ID").format(product.price)}
Kategori: ${category?.name ?? "-"}
Deskripsi: ${product.short_description ?? "-"}
`.trim();
    })
    .join("\n\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage: string = body.message || "";
    const lowerMessage = userMessage.toLowerCase();
    const chatHistory: ChatHistory[] = body.history || [];
    const lastProducts: Product[] = body.lastProducts || [];

    // GET PRODUCTS
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        brand,
        price,
        image_url,
        short_description,
        category_id,
        categories (
          name,
          slug
        )
      `)
      .eq("is_active", true)
      .limit(50);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ reply: "Database error", products: [] });
    }

    // CATEGORY KEYWORDS
    const categoryKeywords: Record<string, string[]> = {
      keyboard: ["keyboard", "mechanical", "switch", "keycaps"],
      mouse: ["mouse", "gaming mouse", "wireless mouse", "fps mouse"],
      audio: ["audio", "headset", "headphone", "earphone", "mic"],
      monitor: ["monitor", "display", "screen", "144hz", "240hz"],
    };

    // DETECT CATEGORY
    let detectedCategory = "";
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((kw) => lowerMessage.includes(kw))) {
        detectedCategory = category;
        break;
      }
    }

    // DETECT FOLLOW-UP — user nanya lanjutan dari produk sebelumnya
    const followUpKeywords = [
      "yang mana", "mana yang", "pilih yang", "rekomen yang",
      "bagus yang", "cocok yang", "buat gaming", "buat kerja",
      "buat fps", "buat kompetitif", "yang terbaik", "terbaik dari",
      "antara", "lebih baik", "perbedaan", "bedanya",
    ];
    const isFollowUp =
      lastProducts.length > 0 &&
      followUpKeywords.some((kw) => lowerMessage.includes(kw));

    console.log("DETECTED CATEGORY:", detectedCategory);
    console.log("IS FOLLOW-UP:", isFollowUp);

    // FILTER PRODUCTS — skip filter kalau follow-up, pakai lastProducts
    let recommendedProducts: Product[] = [];

    if (isFollowUp) {
      // Jawab berdasarkan produk yang sudah ditampilkan sebelumnya
      recommendedProducts = lastProducts;
    } else {
      const filteredProducts =
        (products as Product[])?.filter((product) => {
          const category = getCategory(product);
          const categoryName = category?.name?.toLowerCase() ?? "";
          const categorySlug = category?.slug?.toLowerCase() ?? "";

          if (detectedCategory) {
            return (
              categorySlug === detectedCategory ||
              categorySlug.includes(detectedCategory) ||
              categoryName === detectedCategory ||
              categoryName.includes(detectedCategory)
            );
          }

          return (
            product.name?.toLowerCase().includes(lowerMessage) ||
            product.brand?.toLowerCase().includes(lowerMessage) ||
            categoryName.includes(lowerMessage) ||
            categorySlug.includes(lowerMessage)
          );
        }) ?? [];

      recommendedProducts = filteredProducts.slice(0, 3);
    }

    console.log("RECOMMENDED:", recommendedProducts.map((p) => p.name));

    if (recommendedProducts.length === 0) {
      return Response.json({
        reply: "Produk yang cocok belum ditemukan. Coba tanya dengan kata kunci lain seperti nama kategori, brand, atau tipe produk.",
        products: [],
      });
    }

    const productContext = buildProductContext(recommendedProducts);

    // BUILD MESSAGES dengan history
    const systemPrompt = `
Kamu adalah AI recommendation assistant GameHub, toko gaming gear online.

Kepribadian:
- Ramah, singkat, dan to the point
- Bahasa Indonesia kasual (boleh pakai "nih", "sih", "dong")
- Antusias soal gaming gear

Rules:
- Maksimal 3 kalimat per jawaban
- Kalau ada beberapa produk, SEBUTKAN DAN BANDINGKAN semuanya
- Jelaskan keunggulan tiap produk secara singkat
- Berikan rekomendasi spesifik kalau user tanya mana yang lebih bagus
- JANGAN mengarang produk di luar data
- HANYA referensikan produk dari daftar berikut

Produk yang tersedia saat ini:

${productContext}
`.trim();

    // Konversi history ke format AI
    const historyMessages = chatHistory.slice(-6).map((h) => ({
      role: h.role,
      content: h.content,
    }));

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...historyMessages,
            { role: "user", content: userMessage },
          ],
          max_tokens: 200,
          temperature: 0.6,
        }),
      }
    );

    const data = await response.json();
    console.log("AI RESPONSE:", data);

    return Response.json({
      reply: data?.choices?.[0]?.message?.content ?? "AI tidak merespon",
      products: isFollowUp ? [] : recommendedProducts, // follow-up gak perlu re-render cards
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return Response.json({ reply: "AI sedang error", products: [] });
  }
}