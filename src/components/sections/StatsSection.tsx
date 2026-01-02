import { useEffect, useState, useRef } from "react";
import { useHomeContent } from "@/hooks/useHomeContent";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { data: content, isLoading, error } = useHomeContent();
  const statsSection = content?.statsSection;

  useEffect(() => {
    if (!statsSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
    return () => observer.disconnect();
  }, [statsSection]);

  if (isLoading) {
    return (
      <section id="stats" className="py-24 bg-hero hex-pattern">
        <div className="container-custom text-center text-primary-foreground/70">Loading stats...</div>
      </section>
    );
  }

  if (error || !statsSection) {
    return null;
  }

  return (
    <section id="stats" ref={sectionRef} className="py-24 bg-hero hex-pattern relative">
      <div className="absolute inset-0 bg-primary/90" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            {statsSection.header.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mt-3">
            {statsSection.header.title}
            <br />
            <span className="text-gradient">{statsSection.header.highlight}</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsSection.stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                <span className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground">
                  {isVisible ? (
                    <CountUp end={stat.value} duration={2} delay={index * 0.2} />
                  ) : (
                    "0"
                  )}
                </span>
                <span className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-accent">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-primary-foreground/60 mt-3 font-medium">
                {stat.label}
              </p>
              
              {/* Decorative line */}
              <div className="w-12 h-0.5 bg-accent/30 mx-auto mt-4 group-hover:w-20 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple count up animation component
const CountUp = ({ end, duration, delay }: { end: number; duration: number; delay: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = end / (duration * 60);
      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(interval);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  return <>{count}</>;
};

export default StatsSection;
