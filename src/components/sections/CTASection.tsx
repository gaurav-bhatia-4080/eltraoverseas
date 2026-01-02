import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container-custom">
        <div className="relative rounded-3xl bg-hero hex-pattern overflow-hidden">
          <div className="absolute inset-0 bg-primary/95" />
          
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Content */}
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
                  Ready to Start Your
                  <br />
                  <span className="text-gradient">Global Order?</span>
                </h2>
                <p className="text-primary-foreground/70 text-lg mb-8">
                  Get in touch with our team for competitive quotes, technical support,
                  or custom manufacturing solutions.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button variant="hero" size="xl">
                    Request Quote
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                  <Button variant="hero-outline" size="xl">
                    Download Catalog
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-primary-foreground/10 rounded-xl px-6 py-4 border border-primary-foreground/10">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/60 text-sm">Email Us</p>
                    <p className="text-primary-foreground font-semibold">
                      export@boltworks.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-primary-foreground/10 rounded-xl px-6 py-4 border border-primary-foreground/10">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-primary-foreground/60 text-sm">Call Us</p>
                    <p className="text-primary-foreground font-semibold">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
