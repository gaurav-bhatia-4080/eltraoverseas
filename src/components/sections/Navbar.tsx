import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Hexagon } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";

type NavLink =
  | { name: string; type: "section"; hash: string }
  | { name: string; type: "page"; path: string };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: content } = useHomeContent();

  const navLinks: NavLink[] = [
    { name: "Products", type: "section", hash: "products" },
    { name: "About", type: "section", hash: "about" },
    { name: "Global Reach", type: "section", hash: "stats" },
    { name: "Testimonials", type: "section", hash: "testimonials" },
    { name: "Vlogs", type: "page", path: "/vlogs" },
    { name: "Contact", type: "page", path: "/contact" },
  ];

  const getLinkTarget = (link: NavLink) => {
    if (link.type === "section") {
      return `/#${link.hash}`;
    }
    return link.path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-accent transition-transform group-hover:rotate-90 duration-500" />
            <span className="font-display font-bold text-xl text-foreground">
              {content?.branding?.brandName ?? "EltraOverseas"}
              <span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={getLinkTarget(link)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="accent" size="lg" asChild>
              <Link to="/contact">Get Quote</Link>
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
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button variant="accent" className="mt-2" asChild>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Get Quote
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
