import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Artwork, artworks } from "@/lib/artworks";
import { Link } from "react-router-dom";

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
  onNavigate?: (artwork: Artwork) => void;
}

const Lightbox = ({ artwork, onClose, onNavigate }: LightboxProps) => {
  const currentIndex = artwork ? artworks.findIndex((a) => a.id === artwork.id) : -1;

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      if (!onNavigate || currentIndex === -1) return;
      const newIndex = direction === "prev"
        ? (currentIndex - 1 + artworks.length) % artworks.length
        : (currentIndex + 1) % artworks.length;
      onNavigate(artworks[newIndex]);
    },
    [currentIndex, onNavigate]
  );

  useEffect(() => {
    if (!artwork) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo("prev");
      if (e.key === "ArrowRight") goTo("next");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [artwork, onClose, goTo]);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-2 right-0 lg:-right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {/* Image + nav arrows */}
            <div className="flex items-center justify-center relative">
              {onNavigate && (
                <button
                  onClick={() => goTo("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft size={28} />
                </button>
              )}
              <img
                src={artwork.image}
                alt={artwork.title}
                className="max-h-[70vh] w-auto object-contain"
              />
              {onNavigate && (
                <button
                  onClick={() => goTo("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                  aria-label="Next artwork"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col justify-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
                {artwork.category.replace("-", " ")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
                {artwork.title}
              </h2>
              <div className="space-y-1.5 mb-8">
                <p className="font-mono text-sm text-muted-foreground">{artwork.year}</p>
                <p className="font-mono text-sm text-muted-foreground">{artwork.medium}</p>
                <p className="font-mono text-sm text-muted-foreground">{artwork.dimensions}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {artwork.description}
              </p>
              <Link
                to={`/contact?inquiry=artwork&work=${encodeURIComponent(artwork.title)}`}
                className="inline-block self-start font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-8 py-3 hover:bg-gold-hover transition-all duration-500"
                onClick={onClose}
              >
                Inquire About This Work
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
