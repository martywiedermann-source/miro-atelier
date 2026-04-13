import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-surface-warm">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Logo + Tagline */}
          <div className="space-y-4">
            {/* REPLACE: swap /logo/logo-grey.svg with your actual greyscale logo */}
            <Link to="/" className="inline-block w-[100px] h-[34px]">
              <img
                src="/logo/logo-grey.svg"
                alt="Miroslav Wiedermann"
                className="w-full h-full object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {/* PLACEHOLDER: Replace with actual tagline */}
              Visual artist and speaker exploring form, tension, and silence.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-5">Navigation</p>
            <div className="flex flex-col gap-3">
              <Link to="/works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Works</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>

          {/* Column 3: Social */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-5">Connect</p>
            <div className="flex flex-col gap-3">
              {/* PLACEHOLDER: Replace with actual social links */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={16} /> Instagram
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-5">Newsletter</p>
            <p className="text-sm text-muted-foreground mb-4">Stay informed about new works and exhibitions.</p>
            {/* TODO: replace with actual newsletter integration (Mailchimp, ConvertKit, etc.) */}
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-gold-hover transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-mono">
            © 2025 Miroslav Wiedermann · All rights reserved
          </p>
          <p className="text-muted-foreground/50 text-xs font-mono">
            {/* PLACEHOLDER: Replace with actual studio name */}
            Site by [Your Studio]
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
