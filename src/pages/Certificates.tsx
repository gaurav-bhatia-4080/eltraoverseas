import { Helmet } from "react-helmet-async";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { useHomeContent } from "@/hooks/useHomeContent";

const Certificates = () => {
  const { data: content, isLoading } = useHomeContent();
  const certificates = content?.certificates ?? [];

  return (
    <>
      <Helmet>
        <title>Certificates | Eltra Overseas</title>
        <meta name="description" content="Download certifications and accreditations from Eltra Overseas." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 bg-gradient-steel min-h-screen">
        <div className="container-custom space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-accent font-semibold text-sm uppercase tracking-[0.3em]">Certificates</p>
            <h1 className="text-4xl md:text-5xl font-display mt-4">Global Compliance & Quality</h1>
            <p className="text-muted-foreground mt-4">
              Download the latest ISO documents, export licenses, and industry accreditations for Eltra Overseas.
            </p>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading certificates...</p>
          ) : certificates.length === 0 ? (
            <p className="text-center text-muted-foreground">Certificates will be available soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="card-industrial p-6 flex flex-col">
                  <div className="rounded-xl overflow-hidden border border-border mb-4">
                    <img src={certificate.imageUrl} alt={certificate.title} className="w-full h-56 object-cover" />
                  </div>
                  <h2 className="text-xl font-display mb-3">{certificate.title}</h2>
                  <a
                    href={certificate.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border font-semibold text-sm hover:bg-foreground/5 transition-colors"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Certificates;
