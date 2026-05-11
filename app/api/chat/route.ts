export async function POST(req: Request) {
  try {
    const body = await req.json();

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
            {
            role: "system",
            content:
                "Kamu adalah AI customer service GameHub, toko aksesoris gaming. Jawab dengan singkat, jelas, ramah, dan langsung ke inti. Maksimal 2-3 kalimat. Fokus membantu user memilih produk gaming seperti mouse, keyboard, headset, dan aksesoris lainnya.",
            },

            {
              role: "user",
              content: body.message,
            },
          ],

          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      reply: "AI sedang error 😭",
    });
  }
}