import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MagicForm from "@/components/MagicForm";
import LiveBoard from "@/components/LiveBoard";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <MagicForm />
      <LiveBoard />
      <TrustSection />
      <Footer />
    </main>
  );
}
