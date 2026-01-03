import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import { useProducts } from "@/hooks/useProducts";

const ProductsSection = () => {
  const { data: content, isLoading: isContentLoading, error } = useHomeContent();
  const { data: products, isLoading } = useProducts();
  const section = content?.productsSection;
  const catalogUrl = content?.resources?.catalogUrl || "#";

  if (isContentLoading) {
    return (
      <section id="products" className="py-24 bg-gradient-steel">
        <div className="container-custom text-center text-muted-foreground">Loading products...</div>
      </section>
    );
  }

  if (error || !section) {
    return null;
  }

  return (
    <section id="products" className="py-24 bg-gradient-steel">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {section.eyebrow && (
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{section.eyebrow}</span>
          )}
          {section.description && <p className="text-muted-foreground text-lg mt-3">{section.description}</p>}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <p className="text-center col-span-full text-muted-foreground">Loading products...</p>}
          {!isLoading && !products?.length && (
            <p className="text-center col-span-full text-muted-foreground">No products available yet.</p>
          )}
          {products?.map((product, index) => (
            <Link
              key={product.slug}
              to={`/products/${product.slug}`}
              className="group card-industrial p-0 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-display font-bold text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                    {product.specs}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{product.summary}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <a
            href={catalogUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-accent transition-colors group"
          >
            Product Catalog
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
