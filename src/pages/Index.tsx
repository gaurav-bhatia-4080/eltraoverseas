import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VlogsSection from "@/components/sections/VlogsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>Eltra Overseas - Premium Industrial Fasteners | Global Import Export</title>
        <meta
          name="description"
          content="Leading manufacturer and exporter of precision industrial fasteners - screws, nuts, bolts, and custom hardware. ISO certified quality. 50+ countries served."
        />
        <meta name="keywords" content="industrial fasteners, screws, bolts, nuts, washers, import export, manufacturing" />
      </Helmet>

      <main className="overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ProductsSection />
        <StatsSection />
        <TestimonialsSection />
        <VlogsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
