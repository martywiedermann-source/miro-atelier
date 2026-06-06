import { motion } from "framer-motion";

const venues = [
  "15. Internationale Biennale Kortrijk",
  "artRIUM Bruchköbel",
  "Galerie Bronto u. Wiesel",
  "Galerie Frech Alzenau",
  "Künstlerbund Simplicius",
  "BBK Galerie Frankfurt",
];

const LogoPartnerRow = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
      {venues.map((venue, i) => (
        <motion.div
          key={venue}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          {venue}
        </motion.div>
      ))}
    </div>
  );
};

export default LogoPartnerRow;
