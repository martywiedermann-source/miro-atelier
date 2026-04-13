import { motion } from "framer-motion";
import Slider from "./Slider";

// REPLACE: swap slide images with actual artwork photography
const heroSlides = [
  { image: "/images/slider/slide-1.jpg", title: "Nocturne in Gold", year: "2024" },
  { image: "/images/slider/slide-2.jpg", title: "Crimson Dissolution", year: "2023" },
  { image: "/images/slider/slide-3.jpg", title: "Aurum Fragment", year: "2023" },
  { image: "/images/slider/slide-4.jpg", title: "Terra Fluens", year: "2023" },
  { image: "/images/slider/slide-5.jpg", title: "Lux Aeterna", year: "2024" },
];

const Hero = () => {
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
            {/* PLACEHOLDER: Replace with actual tagline */}
            Artist · Speaker · Visionary
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
              Discover the Work
            </button>
          </motion.div>
        </div>
      }
    />
  );
};

export default Hero;
