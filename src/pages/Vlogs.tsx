import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { useVlogs } from "@/hooks/useVlogs";
import { useHomeContent } from "@/hooks/useHomeContent";
import NotFound from "./NotFound";

const Vlogs = () => {
  const { data: vlogs, isLoading } = useVlogs();
  const { data: content } = useHomeContent();
  const header = content?.vlogsSection;
  const vlogsVisible = content?.visibility?.vlogs ?? true;

  if (content && !vlogsVisible) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>Eltra Overseas Vlogs | Factory Tours & Logistics Stories</title>
        <meta
          name="description"
          content="Watch Eltra Overseas fastener factory walkthroughs, QA demos, and global logistics stories captured in our vlogs."
        />
      </Helmet>
      <Navbar />
      <main className="bg-gradient-steel min-h-screen pt-28 pb-24">
        <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-[0.3em]">
            {header?.eyebrow ?? "Vlogs"}
          </span>
          <h1 className="text-4xl md:text-5xl font-display mt-4">
            {header?.title ?? "Behind The Scenes At Eltra Overseas"}
          </h1>
          <p className="text-muted-foreground mt-4">
            {header?.description ?? "Monthly episodes that unpack machining cells, QC labs, and global logistics."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && <p className="col-span-full text-center text-muted-foreground">Loading vlogs...</p>}
          {!isLoading && !vlogs?.length && (
            <p className="col-span-full text-center text-muted-foreground">No vlogs yet. Check back soon.</p>
          )}
          {vlogs?.map((vlog) => (
            <Link
              to={`/vlogs/${vlog.slug}`}
              key={vlog.slug}
                className="card-industrial overflow-hidden p-0 group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${vlog.youtubeId}/hqdefault.jpg`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={vlog.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 text-xs uppercase tracking-widest text-white bg-black/40 px-3 py-1 rounded-full">
                    {vlog.publishedOn}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    {vlog.tags.map((tag) => (
                      <span key={tag} className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-display mt-4 mb-3 group-hover:text-accent transition-colors">{vlog.title}</h2>
                  <p className="text-muted-foreground">{vlog.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Vlogs;
