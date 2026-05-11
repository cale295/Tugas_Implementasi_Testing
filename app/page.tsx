import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductSection />
      <Footer />

      <ChatWidget />
    </main>
  );
}