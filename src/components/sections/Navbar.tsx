import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import EltraLogo from "@/components/EltraLogo";

type NavLink =
  | { name: string; type: "section"; hash: string }
  | { name: string; type: "page"; path: string };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const { data: content } = useHomeContent();

  const showVlogs = content?.visibility?.vlogs ?? true;
  const showTestimonials = content?.visibility?.testimonials ?? true;

  const navLinks: NavLink[] = [
    { name: "About", type: "section", hash: "about" },
    { name: "Products", type: "section", hash: "products" },
    { name: "Global Reach", type: "section", hash: "stats" },
    { name: "Certificates", type: "page", path: "/certificates" },
    ...(showTestimonials ? [{ name: "Testimonials", type: "section", hash: "testimonials" }] : []),
    ...(showVlogs ? [{ name: "Vlogs", type: "page", path: "/vlogs" }] : []),
    { name: "Contact", type: "section", hash: "contact" },
  ];

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["about", "products", "stats", "testimonials", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [location.pathname]);

  const getLinkTarget = (link: NavLink) => {
    if (link.type === "section") {
      return `/#${link.hash}`;
    }
    return link.path;
  };

  const linkIsActive = (link: NavLink) => {
    if (link.type === "section") {
      return location.pathname === "/" && activeSection === link.hash;
    }
    return location.pathname === link.path;
  };

  const linkBaseClass = "nav-link group";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <EltraLogo className="w-10 h-10 transition-transform group-hover:scale-105 duration-500" />
            <span className="font-display font-bold text-xl text-foreground">
              {content?.branding?.brandName ?? "Eltra Overseas"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = linkIsActive(link);
              return (
                <Link
                  key={link.name}
                  to={getLinkTarget(link)}
                  className={`${linkBaseClass} ${
                    isActive ? "text-foreground nav-link--active" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="px-1">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="accent" size="lg" asChild>
              <a href={content?.resources?.catalogUrl || "#"} target="_blank" rel="noreferrer" download>
                Product Catalog
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={getLinkTarget(link)}
                  className={`px-2 py-2 text-base font-bold ${
                    linkIsActive(link) ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-3 py-2">
                <Button variant="accent" className="mt-2" asChild>
                  <a
                    href={content?.resources?.catalogUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    download
                    onClick={() => setIsOpen(false)}
                  >
                    Product Catalog
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
