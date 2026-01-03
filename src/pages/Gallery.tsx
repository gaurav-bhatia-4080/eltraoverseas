import { Helmet } from "react-helmet-async";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { useHomeContent } from "@/hooks/useHomeContent";
import NotFound from "./NotFound";

const Gallery = () => {
  const { data: content, isLoading } = useHomeContent();
  const gallery = content?.gallery ?? [];
  const galleryVisible = content?.visibility?.gallery ?? true;

  if (content && !galleryVisible) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>Eltra Overseas Gallery | Manufacturing & Logistics Moments</title>
        <meta
          name="description"
          content="Browse the Eltra Overseas gallery showcasing production lines, QA labs, logistics hubs, and customer shipments."
        />
      </Helmet>
      <Navbar />
      <main className="bg-gradient-steel min-h-screen pt-28 pb-24">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-accent font-semibold text-sm uppercase tracking-[0.3em]">Gallery</span>
            <h1 className="text-4xl md:text-5xl font-display mt-4">Inside Eltra Overseas</h1>
            <p className="text-muted-foreground mt-4">
              Visual stories from machining bays, plating lines, packaging suites, and global dispatch facilities.
            </p>
          </div>

          {isLoading && <p className="text-center text-muted-foreground">Loading images...</p>}
          {!isLoading && gallery.length === 0 && (
            <p className="text-center text-muted-foreground">No gallery images yet. Check back soon.</p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div key={item.id} className="card-industrial overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.caption ?? "Eltra Overseas gallery image"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {item.caption && (
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Gallery;
