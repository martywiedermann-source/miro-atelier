import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/siteConfig";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-surface-warm">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Spalte 1: Logo + Kurztext */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo/logo-grey.svg" alt="MW" className="w-10 h-auto opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col leading-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary group-hover:text-gold-hover transition-colors">
                  Atelier
                </span>
                <span className="font-display text-xl font-light text-foreground tracking-wide">
                  Miroslav Wiedermann
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Künstler. Relief. Filz.<br />
              Atelier in Gelnhausen Hailer.
            </p>
          </div>

          {/* Spalte 2: Navigation */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-5">Navigation</p>
            <div className="flex flex-col gap-3">
              {siteConfig.pages.works.enabled && <Link to="/works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Werke</Link>}
              {siteConfig.pages.about.enabled && <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Über</Link>}
              {siteConfig.pages.events.enabled && <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ausstellungen</Link>}
              {siteConfig.pages.contact.enabled && <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kontakt</Link>}
              <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impressum</Link>
              <Link to="/press" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pressemappe</Link>
            </div>
          </div>

          {/* Spalte 3: Kontakt */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-5">Kontakt</p>
            <address className="not-italic flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Miroslav Wiedermann</span>
              <span>Berkaer Str. 19</span>
              <span>99837 Werra-Suhl-Tal</span>
              <a href="tel:+491755933703" className="hover:text-foreground transition-colors mt-1">
                +49 175 5933703
              </a>
              <a href="mailto:miro@ateliermiro.de" className="hover:text-foreground transition-colors">
                miro@ateliermiro.de
              </a>
            </address>
          </div>

          {/* Spalte 4: Rechtliches */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-5">Rechtliches</p>
            <div className="flex flex-col gap-3">
              <Link to="/impressum"   className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Datenschutz</Link>
              <Link to="/bildrechte"  className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bildrechte</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-mono">
            © {new Date().getFullYear()} Miroslav Wiedermann
          </p>
          <div className="flex gap-4 text-muted-foreground/50 text-xs font-mono">
            <Link to="/impressum"   className="hover:text-muted-foreground transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-muted-foreground transition-colors">Datenschutz</Link>
            <Link to="/bildrechte"  className="hover:text-muted-foreground transition-colors">Bildrechte</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
