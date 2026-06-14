import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { useConfig } from "@/contexts/ConfigContext";

const allNavLinks = [
  { path: "/works",   label: "Werke",        key: "works"   },
  { path: "/about",   label: "Über",          key: "about"   },
  { path: "/events",  label: "Ausstellungen", key: "events"  },
  { path: "/contact", label: "Kontakt",       key: "contact" },
] as const;

const GOLD = "#C9A84C";

const NavLink = ({ link, pathname }: { link: typeof allNavLinks[number]; pathname: string }) => {
  const [hovered, setHovered] = useState(false);
  const isActive = pathname === link.path;
  const showGold = isActive || hovered;
  return (
    <Link
      to={link.path}
      className="relative text-[11px] uppercase tracking-[0.2em] transition-colors duration-300"
      style={{ fontFamily: "Georgia, serif", color: showGold ? GOLD : "#333333" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {link.label}
      <span
        className="absolute -bottom-px left-0 right-0 h-px transition-opacity duration-300"
        style={{ backgroundColor: GOLD, opacity: showGold ? 1 : 0 }}
      />
    </Link>
  );
};

const Navbar = () => {
  const { effectiveOverride } = useConfig();
  const [hidden, setHidden]       = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const navLinks = allNavLinks.filter((l) =>
    (effectiveOverride.pages?.[l.key]?.enabled ?? siteConfig.pages[l.key].enabled)
  );
  const logoSrc = effectiveOverride.logoPath ?? "/logo/logo-dark.jpg";

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScrollY && y > 100);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white"
        style={{ borderBottom: `1px solid rgba(201, 168, 76, 0.4)` }}
      >
        <nav
          className="container mx-auto flex items-center justify-between px-6 lg:px-12"
          style={{ height: "76px" }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center select-none group transition-opacity duration-300 hover:opacity-70">
            {logoError ? (
              <span
                className="font-display text-sm tracking-[0.12em] font-light"
                style={{ color: "#1a1a1a", fontFamily: "'Bodoni Moda', Georgia, serif" }}
              >
                ATELIER <span style={{ color: GOLD }}>MIROSLAV</span>
              </span>
            ) : (
              <img
                src={logoSrc}
                alt="Atelier Miroslav Wiedermann"
                className="h-10 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <NavLink key={link.path} link={link} pathname={location.pathname} />
            ))}

            {/* Sprachschalter */}
            <div
              className="flex items-center gap-1.5 pl-6 ml-2 text-[10px] uppercase tracking-[0.18em]"
              style={{ borderLeft: `1px solid rgba(201,168,76,0.35)`, fontFamily: "Georgia, serif" }}
            >
              <button type="button" style={{ color: GOLD }}>DE</button>
              <span style={{ color: "rgba(201,168,76,0.4)" }}>|</span>
              <button
                type="button"
                className="transition-colors duration-200"
                style={{ color: "#999" }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = "#999")}
              >
                EN
              </button>
            </div>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden z-50"
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            style={{ color: "#1a1a1a" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
              >
                <Link
                  to={link.path}
                  className="text-sm uppercase tracking-[0.28em] transition-colors duration-200"
                  style={{
                    fontFamily: "Georgia, serif",
                    color: location.pathname === link.path ? GOLD : "#1a1a1a",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div
              className="flex items-center gap-2 mt-6 text-[10px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <span style={{ color: GOLD }}>DE</span>
              <span style={{ color: "rgba(201,168,76,0.4)" }}>|</span>
              <span style={{ color: "#bbb" }}>EN</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
