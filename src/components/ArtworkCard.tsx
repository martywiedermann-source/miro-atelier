import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Artwork } from "@/lib/artworks";
import { useVisibleImages } from "@/lib/hooks";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  index: number;
}

const ArtworkCard = ({ artwork, onClick, index }: ArtworkCardProps) => {
  const images = useVisibleImages(artwork);
  const hasMultiple = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group cursor-pointer relative overflow-hidden shadow-sm"
      onClick={() => onClick(artwork)}
    >
      <div className="relative overflow-hidden">
        {/* Embla carousel */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((src, i) => (
              <div key={i} className="relative min-w-0 shrink-0 grow-0 basis-full">
                <img
                  src={src}
                  alt={`${artwork.title} ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                  className={`transition-transform duration-500 group-hover:scale-[1.02] ${
                    i === 0
                      ? "w-full h-auto object-cover"
                      : "absolute inset-0 w-full h-full object-cover"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-all duration-500 flex flex-col items-center justify-center p-6">
          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-background/70 mb-2">
              {artwork.year ? `${artwork.year} · ` : ""}{artwork.medium.split(" ")[0]}
            </p>
            <h3 className="font-display text-2xl text-background">
              {artwork.title}
            </h3>
          </div>
        </div>

        {/* Prev/next arrows — visible on hover when multiple images */}
        {hasMultiple && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Vorheriges Bild"
            >
              ‹
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Nächstes Bild"
            >
              ›
            </button>

            {/* Dot indicators — immer sichtbar */}
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
    </motion.div>
  );
};

export default ArtworkCard;
