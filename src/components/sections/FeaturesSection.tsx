import { Shield, Truck, Award, HeadphonesIcon, Factory, Leaf } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";

const iconLookup = {
  shield: Shield,
  truck: Truck,
  award: Award,
  support: HeadphonesIcon,
  factory: Factory,
  leaf: Leaf,
};

const FeaturesSection = () => {
  const { data: content, isLoading, error } = useHomeContent();
  const section = content?.featuresSection;

  if (isLoading) {
    return (
      <section id="about" className="py-24 bg-background">
        <div className="container-custom text-center text-muted-foreground">Loading capabilities...</div>
      </section>
    );
  }

  if (error || !section) {
    return null;
  }

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              {section.header.eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-3">
              {section.header.title}
              <br />
              <span className="text-gradient">{section.header.highlight}</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-md lg:text-right">
            {section.header.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.features.map((feature, index) => {
            const Icon = iconLookup[feature.icon as keyof typeof iconLookup] ?? Shield;
            return (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Icon className="w-7 h-7 text-accent" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
