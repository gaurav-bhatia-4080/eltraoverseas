import { Quote } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const TestimonialsSection = () => {
  const { data: content, isLoading, error } = useHomeContent();
  const section = content?.testimonialsSection;
  const isVisible = content?.visibility?.testimonials ?? true;

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-gradient-steel">
        <div className="container-custom text-center text-muted-foreground">Loading testimonials...</div>
      </section>
    );
  }

  if (error || !section || !isVisible) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-gradient-steel">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            {section.header.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-3">
            {section.header.title}
            <br />
            <span className="text-gradient">{section.header.highlight}</span>
          </h2>
        </div>

        {/* Testimonials Display */}
        {section.testimonials.length > 3 ? (
          <div className="relative">
            <Carousel opts={{ align: "start" }} className="pt-6">
              <CarouselContent className="pb-16">
                {section.testimonials.map((testimonial, index) => (
                  <CarouselItem key={`${testimonial.author}-${index}`} className="md:basis-1/2 lg:basis-1/3">
                    <div className="card-industrial p-8 relative h-full flex flex-col hover:-translate-y-1 transition-all duration-300">
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Quote className="w-6 h-6 text-accent" />
                      </div>
                      <p className="text-foreground/80 leading-relaxed mb-8 pr-12">"{testimonial.quote}"</p>
                      <div className="border-t border-border pt-6 mt-auto">
                        <p className="font-display font-bold text-foreground">{testimonial.author}</p>
                        <p className="text-muted-foreground text-sm mt-1">{testimonial.role}</p>
                        <p className="text-accent text-sm font-medium mt-1">{testimonial.company}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {section.testimonials.map((testimonial) => (
              <div key={testimonial.author} className="card-industrial p-8 relative group hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-accent" />
                </div>
                <p className="text-foreground/80 leading-relaxed mb-8 pr-12">"{testimonial.quote}"</p>
                <div className="border-t border-border pt-6">
                  <p className="font-display font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm mt-1">{testimonial.role}</p>
                  <p className="text-accent text-sm font-medium mt-1">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
