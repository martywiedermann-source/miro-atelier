import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

const allNavLinks = [
  { path: "/works",   label: "Werke",        key: "works"   },
  { path: "/about",   label: "Über",          key: "about"   },
  { path: "/events",  label: "Ausstellungen", key: "events"  },
  { path: "/contact", label: "Kontakt",       key: "contact" },
] as const;

const navLinks = allNavLinks.filter(
  (l) => siteConfig.pages[l.key].enabled
);

const GOLD = "#C9A84C";

const NavLink = ({ link, pathname }: { link: typeof navLinks[number]; pathname: string }) => {
  const isActive = pathname === link.path;
  return (
    <Link
      to={link.path}
      className="relative text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 group"
      style={{ fontFamily: "Georgia, serif", color: isActive ? GOLD : "#333333" }}
    >
      {link.label}
      <span
        className="absolute -bottom-px left-0 right-0 h-px transition-opacity duration-300"
        style={{ backgroundColor: GOLD, opacity: isActive ? 1 : 0 }}
      />
      <style>{`
        a:hover > span { opacity: 1 !important; }
        a:hover { color: ${GOLD} !important; }
      `}</style>
    </Link>
  );
};

const Navbar = () => {
  const [hidden, setHidden]       = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const location = useLocation();

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
          <Link to="/" className="flex flex-col leading-none select-none">
            <span
              className="text-[30px] leading-none"
              style={{ fontFamily: "Georgia, serif", color: "#1a1a1a", letterSpacing: "-0.02em" }}
            >
              MW
            </span>
            <span
              className="text-[8px] uppercase mt-0.5"
              style={{ fontFamily: "Georgia, serif", color: "#1a1a1a", letterSpacing: "0.32em" }}
            >
              Wiedermann
            </span>
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
              <button style={{ color: GOLD }}>DE</button>
              <span style={{ color: "rgba(201,168,76,0.4)" }}>|</span>
              <button
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
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden z-50"
            aria-label="Menü öffnen"
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
