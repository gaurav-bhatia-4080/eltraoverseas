import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { useProduct } from "@/hooks/useProducts";
import NotFound from "./NotFound";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);

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

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Eltra Overseas Industrial Fasteners`}</title>
        <meta name="description" content={product.summary} />
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
              <div className="rounded-3xl overflow-hidden border border-border shadow-lg max-h-[420px]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {product.gallery.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={`${product.name} detail`}
                    className="rounded-2xl border border-border object-cover h-32"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-[0.3em]">Product</p>
              <h1 className="text-4xl font-display mt-3">{product.name}</h1>
              <p className="text-muted-foreground mt-4 text-lg">{product.description}</p>

              <div className="mt-6 rounded-2xl border border-border bg-white/70 p-6">
                <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Specifications</h2>
                <p className="text-foreground text-lg font-semibold mt-2">{product.specs}</p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Materials</h3>
                  <ul className="mt-3 space-y-2">
                    {product.materials.map((material) => (
                      <li key={material} className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="w-4 h-4 text-accent" /> {material}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Applications</h3>
                  <ul className="mt-3 space-y-2">
                    {product.applications.map((app) => (
                      <li key={app} className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="w-4 h-4 text-accent" /> {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground">Certifications & Standards</h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {product.certifications.map((cert) => (
                    <span key={cert} className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
