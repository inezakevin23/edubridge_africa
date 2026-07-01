import Navbar from "../components/layout/Navbar";
import Hero from "../components/hero/Hero";
import DashboardPreview from "../components/home/DashboardPreview";
import Features from "../components/home/Features";
import Footer from "../components/layout/Footer";

export default function Landing() {
  return (
    <div className="bg-[#0B1020] min-h-screen">
      <Navbar />

      <Hero />

      <Features />

      <DashboardPreview />

      <Footer />
    </div>
  );
}
