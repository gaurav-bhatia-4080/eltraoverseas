import { Youtube, Twitter, Linkedin, Instagram } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import EltraLogo from "@/components/EltraLogo";

const iconMap = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

const Footer = () => {
  const { data: content, isLoading, error } = useHomeContent();
  const footer = content?.footer;

  if (isLoading) {
    return (
      <footer className="bg-primary pt-20 pb-8">
        <div className="container-custom text-center text-primary-foreground/60">Loading footer...</div>
      </footer>
    );
  }

  if (error || !footer) {
    return null;
  }

  return (
    <footer className="bg-primary pt-20 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-primary-foreground/10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-4 mb-6">
              <EltraLogo className="w-36 h-36" />
              <span className="font-display font-bold text-2xl text-primary-foreground">
                {content?.branding?.brandName ?? "Eltra Overseas"}
              </span>
            </a>
            <p className="text-primary-foreground/60 leading-relaxed mb-6 max-w-sm">
              {footer.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {footer.socialLinks
                .filter((link) => ["instagram", "youtube", "linkedin"].includes(link.icon))
                .map((link) => {
                  const Icon = iconMap[link.icon as keyof typeof iconMap] ?? Youtube;
                  return (
                    <a
                      key={link.icon}
                      href={link.url}
                      className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent/20 transition-colors group"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon className="w-5 h-5 text-primary-foreground/60 group-hover:text-accent transition-colors" />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Links Columns */}
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-display font-bold text-primary-foreground mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-primary-foreground/40 text-sm">{footer.copyright}</p>
          <div className="flex gap-6">
            {footer.legalLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-primary-foreground/40 hover:text-accent text-sm transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
