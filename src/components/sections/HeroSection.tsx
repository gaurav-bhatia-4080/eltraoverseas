import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Truck } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";

const HeroSection = () => {
  const { data: content, isLoading, error } = useHomeContent();
  const hero = content?.hero;
  const catalogUrl = content?.resources?.catalogUrl || "#";

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-hero">
        <p className="text-primary-foreground/70">Loading hero content...</p>
      </section>
    );
  }

  if (error || !hero) {
    return null;
  }

  return (
    <section className="relative min-h-screen flex items-center bg-hero hex-pattern overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent z-0" />
      
      {/* Hero Image */}
      <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
        <img
          src={hero.heroImageUrl}
          alt={hero.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-primary-foreground/80 text-sm font-medium">
              {hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6 animate-fade-up-delay-1">
            {hero.title}
            <br />
            <span className="text-gradient">{hero.highlight}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mb-10 animate-fade-up-delay-2">
            {hero.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up-delay-3">
            <Button
              variant="hero"
              size="xl"
              onClick={() => {
                const el = document.getElementById("products");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Products
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href={catalogUrl} target="_blank" rel="noreferrer" download>
                Download Catalog
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-6 max-w-lg animate-fade-up-delay-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold text-sm">ISO 9001</p>
                <p className="text-primary-foreground/50 text-xs">Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold text-sm">50+</p>
                <p className="text-primary-foreground/50 text-xs">Countries</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold text-sm">Fast</p>
                <p className="text-primary-foreground/50 text-xs">Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
