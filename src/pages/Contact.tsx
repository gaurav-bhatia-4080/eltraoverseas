import { Helmet } from "react-helmet-async";
import Navbar from "@/components/sections/Navbar";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import { useHomeContent } from "@/hooks/useHomeContent";

const Contact = () => {
  const { data: content } = useHomeContent();
  const header = content?.contactSection?.header;

  return (
    <>
      <Helmet>
        <title>Contact EltraOverseas | Fastener Quotes & Support</title>
        <meta
          name="description"
          content="Connect with the EltraOverseas team for RFQs, technical guidance, or export documentation related to industrial fasteners."
        />
      </Helmet>
      <Navbar />
      <main className="bg-background min-h-screen pt-28">
        <section className="container-custom text-center max-w-3xl mx-auto pb-10">
          <p className="text-accent font-semibold text-sm uppercase tracking-[0.3em]">
            {header?.eyebrow ?? "Contact"}
          </p>
          <h1 className="text-4xl md:text-5xl font-display mt-4 mb-4">
            {header?.title ?? "Let’s Engineer Your Next Shipment"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {header?.description ??
              "Share the grades, coatings, packaging specs, or destination markets you are targeting. Our export desk will respond with detailed estimates and compliance paperwork."}
          </p>
        </section>
        <ContactSection />
        <div className="mt-10">
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
