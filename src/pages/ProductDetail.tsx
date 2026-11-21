import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Maximize2 } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ProductImage from "@/components/ProductImage";
import ImageLightbox from "@/components/ImageLightbox";
import { useProduct } from "@/hooks/useProducts";
import { useHomeContent } from "@/hooks/useHomeContent";
import { resolveProductFieldVisibility } from "@/types/content";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const cleanList = (values?: string[]) => (values ?? []).map((value) => value.trim()).filter(Boolean);

const ChecklistSection = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h3 className="text-sm uppercase tracking-widest text-muted-foreground">{title}</h3>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-foreground">
          <CheckCircle className="w-4 h-4 text-accent shrink-0" /> {item}
        </li>
      ))}
    </ul>
  </div>
);

const PillSection = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mt-8">
    <h3 className="text-sm uppercase tracking-widest text-muted-foreground">{title}</h3>
    <div className="flex flex-wrap gap-3 mt-3">
      {items.map((item) => (
        <span key={item} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
          {item}
        </span>
      ))}
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: content } = useHomeContent();
  const fields = resolveProductFieldVisibility(content?.productFields);

  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Primary image first, then the gallery; drop blanks, duplicates and images that failed to load.
  const images = useMemo(() => {
    const all = [product?.image, ...(product?.gallery ?? [])]
      .map((url) => url?.trim())
      .filter((url): url is string => Boolean(url));
    return Array.from(new Set(all)).filter((url) => !failedImages.includes(url));
  }, [product?.image, product?.gallery, failedImages]);

  useEffect(() => {
    setActiveIndex(0);
    setFailedImages([]);
  }, [slug]);

  useEffect(() => {
    if (activeIndex >= images.length) setActiveIndex(0);
  }, [activeIndex, images.length]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="bg-gradient-steel min-h-screen pt-28 pb-24">
          <div className="container-custom max-w-4xl text-center text-muted-foreground">Loading product...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  const markFailed = (url: string) => setFailedImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  const activeImage = images[activeIndex];

  const materials = fields.materials ? cleanList(product.materials) : [];
  const finishes = fields.finishes ? cleanList(product.finishes) : [];
  const applications = fields.applications ? cleanList(product.applications) : [];
  const sizes = fields.sizes ? cleanList(product.sizes) : [];
  const certifications = fields.certifications ? cleanList(product.certifications) : [];
  const specs = fields.specs ? product.specs?.trim() : "";

  const checklists = [
    { title: "Materials", items: materials },
    { title: "Finish", items: finishes },
    { title: "Applications", items: applications },
  ].filter((section) => section.items.length > 0);

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Eltra Overseas Industrial Fasteners`}</title>
        {product.summary && <meta name="description" content={product.summary} />}
      </Helmet>
      <Navbar />
      <main className="bg-gradient-steel min-h-screen pt-28 pb-24">
        <div className="container-custom max-w-5xl">
          <Link
            to="/#products"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to products
          </Link>

          <div className="mt-6 grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {activeImage ? (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group relative block w-full aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-lg bg-white cursor-zoom-in"
                  aria-label={`View ${product.name} image full screen`}
                >
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={() => markFailed(activeImage)}
                  />
                  <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" /> Click to enlarge
                  </span>
                </button>
              ) : (
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-lg">
                  <ProductImage alt={product.name} />
                </div>
              )}

              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => {
                        setActiveIndex(index);
                        setLightboxOpen(true);
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all",
                        index === activeIndex
                          ? "border-accent shadow-md"
                          : "border-border opacity-70 hover:opacity-100 hover:border-accent/50",
                      )}
                      aria-label={`View ${product.name} image ${index + 1} full screen`}
                      aria-current={index === activeIndex}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => markFailed(image)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-[0.3em]">Product</p>
              <h1 className="text-4xl font-display mt-3">{product.name}</h1>
              {product.description?.trim() && (
                <p className="text-muted-foreground mt-4 text-lg">{product.description}</p>
              )}

              {specs && (
                <div className="mt-6 rounded-2xl border border-border bg-white/70 p-6">
                  <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Specifications</h2>
                  <p className="text-foreground text-lg font-semibold mt-2">{specs}</p>
                </div>
              )}

              {checklists.length > 0 && (
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  {checklists.map((section) => (
                    <ChecklistSection key={section.title} title={section.title} items={section.items} />
                  ))}
                </div>
              )}

              {sizes.length > 0 && <PillSection title="Size" items={sizes} />}
              {certifications.length > 0 && <PillSection title="Certifications & Standards" items={certifications} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ImageLightbox
        images={images}
        index={Math.min(activeIndex, Math.max(images.length - 1, 0))}
        open={lightboxOpen && images.length > 0}
        alt={product.name}
        onOpenChange={setLightboxOpen}
        onIndexChange={setActiveIndex}
      />
    </>
  );
};

export default ProductDetail;
