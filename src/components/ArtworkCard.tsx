import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Artwork } from "@/lib/artworks";
import { useVisibleImages, useArtworkMeta } from "@/lib/hooks";
import ArtworkPlaceholder from "@/components/ArtworkPlaceholder";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  index: number;
}

const HOVER_DELAY = 620;

const ArtworkCard = ({ artwork, onClick, index }: ArtworkCardProps) => {
  const images = useVisibleImages(artwork);
  const meta = useArtworkMeta(artwork);
  const hasMultiple = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [overlayVisible, setOverlayVisible] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setOverlayVisible(true), HOVER_DELAY);
  };
  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOverlayVisible(false);
  };

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollPrev(); },
    [emblaApi]
  );
  const scrollNext = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollNext(); },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="cursor-pointer relative overflow-hidden shadow-sm"
      onClick={() => onClick(artwork)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden">
        {images.length === 0 ? (
          <ArtworkPlaceholder className="w-full aspect-[4/3]" />
        ) : (
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {images.map((src, i) => (
                <div key={i} className="relative min-w-0 shrink-0 grow-0 basis-full overflow-hidden">
                  <img
                    src={src}
                    alt={`${meta.title} ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                    className={`transition-transform duration-700 ease-out ${
                      i === 0
                        ? "w-full h-auto object-cover"
                        : "absolute inset-0 w-full h-full object-cover"
                    } ${overlayVisible ? "scale-[1.04]" : "scale-100"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dark overlay — fades in on hover */}
        <motion.div
          className="absolute inset-0 bg-foreground/50 pointer-events-none"
          animate={{ opacity: overlayVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Detail popup — aufploppen nach Delay */}
        <AnimatePresence>
          {overlayVisible && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-background/70 mb-2">
                {meta.year ? `${meta.year} · ` : ""}{meta.medium.split(" ")[0]}
              </p>
              <h3 className="font-display text-2xl text-background">
                {meta.title}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slider-Pfeile — erscheinen mit Overlay */}
        {hasMultiple && (
          <>
            <button
              onClick={scrollPrev}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-300 ${overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              aria-label="Vorheriges Bild"
            >
              ‹
            </button>
            <button
              onClick={scrollNext}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all duration-300 ${overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              aria-label="Nächstes Bild"
            >
              ›
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(i); }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "w-4 bg-white" : "w-1 bg-white/50"
                  }`}
                  aria-label={`Bild ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Maße-Streifen */}
      {meta.dimensions && (
        <p className="font-mono text-[10px] text-muted-foreground text-center py-1.5 px-3 border-t border-border/40 tracking-wider">
          {meta.dimensions}
        </p>
      )}
    </motion.div>
  );
};

export default ArtworkCard;
