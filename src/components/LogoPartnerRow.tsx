import { motion } from "framer-motion";

// REPLACE: add partner/gallery logos here (SVG or PNG)
const partners = [
  { name: "Galerie Koenig", logo: "/placeholder.svg" },
  { name: "Art Basel", logo: "/placeholder.svg" },
  { name: "Kunsthalle Wien", logo: "/placeholder.svg" },
  { name: "Centre Pompidou", logo: "/placeholder.svg" },
  { name: "Museum MMK", logo: "/placeholder.svg" },
];

/**
 * Horizontal row of partner/gallery logos
 * Grayscale by default, full color on hover
 */
const LogoPartnerRow = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
      {partners.map((partner, i) => (
        <motion.div
          key={partner.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="w-[160px] h-[60px] flex items-center justify-center grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500"
        >
          {/* REPLACE: swap placeholder with actual partner logo */}
          <img
            src={partner.logo}
            alt={partner.name}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default LogoPartnerRow;
