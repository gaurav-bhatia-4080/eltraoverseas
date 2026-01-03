import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import { useVlogs } from "@/hooks/useVlogs";

const VlogsSection = () => {
  const { data: content, isLoading: isContentLoading, error } = useHomeContent();
  const { data: vlogs, isLoading } = useVlogs();
  const section = content?.vlogsSection;
  const isVisible = content?.visibility?.vlogs ?? true;

  if (isContentLoading) {
    return (
      <section id="vlogs" className="py-24 bg-background">
        <div className="container-custom text-center text-muted-foreground">Loading vlogs...</div>
      </section>
    );
  }

  if (error || !section || !isVisible) {
    return null;
  }

  const featured = vlogs?.slice(0, 2) ?? [];

  return (
    <section id="vlogs" className="py-24 bg-background">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">
              {section.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {section.title}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              {section.description}
            </p>
          </div>

          <Link
            to="/vlogs"
            className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-accent transition-colors"
          >
            View all vlogs
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && <p className="col-span-full text-center text-muted-foreground">Loading vlogs...</p>}
          {!isLoading && featured.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">No vlogs published yet.</p>
          )}
          {featured.map((vlog) => (
            <Link
              to={`/vlogs/${vlog.slug}`}
              key={vlog.slug}
              className="group card-industrial overflow-hidden p-0"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${vlog.youtubeId}/hqdefault.jpg`}
                  alt={vlog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <span className="absolute top-4 left-4 text-xs uppercase font-semibold text-white/80 bg-black/40 px-3 py-1 rounded-full">
                  {vlog.publishedOn}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                  {vlog.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm">{vlog.summary}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {vlog.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VlogsSection;
