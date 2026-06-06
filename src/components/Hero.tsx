import { motion } from "framer-motion";
import Slider from "./Slider";
import { useConfig } from "@/contexts/ConfigContext";

const STATIC_HERO_SLIDES = [
  { image: "/images/gallery/gelber-schatten/_mg_3137.jpg", title: "Gelber Schatten", year: "2007" },
  { image: "/images/gallery/strudel/dsc00118.jpg", title: "Strudel", year: "2011" },
  { image: "/images/gallery/mahlwerk/bild0394.jpg", title: "Mahlwerk", year: "2009" },
  { image: "/images/gallery/entscheidung/dsc00534.jpg", title: "Entscheidung", year: "2012" },
  { image: "/images/gallery/ahnentafel/_mg_3558.jpg", title: "Ahnentafel", year: "2007" },
];

const Hero = () => {
  const { effectiveOverride } = useConfig();
  const heroSlides = (effectiveOverride.heroSlides?.length ? effectiveOverride.heroSlides : STATIC_HERO_SLIDES);
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <Slider
      slides={heroSlides}
      autoPlay
      interval={5000}
      showDots
      showArrows
      crossfade
      overlay={
        <div className="text-center px-6 z-20 pointer-events-none">
          {/* Staggered text reveal */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-primary mb-6"
          >
            Künstler · Relief · Filz
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="font-display text-[10vw] md:text-[7vw] lg:text-[5vw] font-light leading-[0.95] tracking-tight text-foreground mb-8"
          >
            Miroslav Wiedermann
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="pointer-events-auto"
          >
            <button
              onClick={scrollToContent}
              className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-foreground border border-foreground/30 px-10 py-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
            >
              Zu den Arbeiten
            </button>
          </motion.div>
        </div>
      }
    />
  );
};

export default Hero;
