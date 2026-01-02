import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { useVlog } from "@/hooks/useVlogs";
import NotFound from "./NotFound";

const VlogDetail = () => {
  const { slug } = useParams();
  const { data: vlog, isLoading } = useVlog(slug);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="bg-background min-h-screen pt-28 pb-24">
          <div className="container-custom max-w-4xl text-center text-muted-foreground">Loading vlog...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!vlog) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{`${vlog.title} | EltraOverseas Vlogs`}</title>
        <meta name="description" content={vlog.summary} />
      </Helmet>
      <Navbar />
      <main className="bg-background min-h-screen pt-28 pb-24">
        <div className="container-custom max-w-4xl">
          <Link
            to="/vlogs"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to vlogs
          </Link>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider text-accent">
              {vlog.tags.map((tag) => (
                <span key={tag} className="bg-accent/10 text-accent px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-display mt-4">{vlog.title}</h1>
            <p className="text-muted-foreground mt-3">Published {vlog.publishedOn}</p>
          </div>

          <div className="mt-8 rounded-3xl overflow-hidden border border-border shadow-lg">
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${vlog.youtubeId}?rel=0`}
                title={vlog.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          <article className="mt-10 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>{vlog.description}</p>
            <p>
              Looking for something specific? Reach out with grade, coating, or packaging requirements from the contact
              section, and we can feature it in a future vlog.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VlogDetail;
