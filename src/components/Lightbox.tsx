import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Artwork } from "@/lib/artworks";
import { useVisibleArtworks, useVisibleImages, useArtworkMeta } from "@/lib/hooks";
import ArtworkPlaceholder from "@/components/ArtworkPlaceholder";
import { Link } from "react-router-dom";

const EMPTY_ARTWORK: Artwork = {
  id: "", title: "", year: null, medium: "", dimensions: "",
  category: "relief", images: [], image: "", description: "", status: "available",
};

const STATUS_LABEL: Record<string, string> = {
  available: "Verfügbar",
  sold: "Verkauft",
  "on-loan": "Leihgabe",
};

const STATUS_DOT: Record<string, string> = {
  available: "bg-green-500",
  sold: "bg-muted-foreground/40",
  "on-loan": "bg-amber-400",
};

interface LightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
  onNavigate?: (artwork: Artwork) => void;
}

const Lightbox = ({ artwork, onClose, onNavigate }: LightboxProps) => {
  const visibleArtworks = useVisibleArtworks();
  const currentIndex = artwork ? visibleArtworks.findIndex((a) => a.id === artwork.id) : -1;
  const [imgIndex, setImgIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sidebar starts closed — user opens with "i"
  useEffect(() => {
    setSidebarOpen(false);
  }, [artwork?.id]);

  useEffect(() => {
    setImgIndex(0);
    if (emblaApi) emblaApi.scrollTo(0, true);
  }, [artwork?.id, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setImgIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const goToPrevImg = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const goToNextImg = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const goTo = useCallback(
    (direction: "prev" | "next") => {
      if (!onNavigate || currentIndex === -1) return;
      const newIndex =
        direction === "prev"
          ? (currentIndex - 1 + visibleArtworks.length) % visibleArtworks.length
          : (currentIndex + 1) % visibleArtworks.length;
      onNavigate(visibleArtworks[newIndex]);
    },
    [currentIndex, onNavigate, visibleArtworks]
  );

  useEffect(() => {
    if (!artwork) return;
    const images = artwork.images.length ? artwork.images : artwork.image ? [artwork.image] : [];
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "i") setSidebarOpen((v) => !v);
      if (e.key === "ArrowLeft") {
        if (images.length > 1) goToPrevImg();
        else goTo("prev");
      }
      if (e.key === "ArrowRight") {
        if (images.length > 1) goToNextImg();
        else goTo("next");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [artwork, onClose, goTo, goToPrevImg, goToNextImg]);

  const images = useVisibleImages(artwork ?? EMPTY_ARTWORK);
  const meta = useArtworkMeta(artwork ?? EMPTY_ARTWORK);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-background/97 backdrop-blur-sm flex flex-col"
          onClick={onClose}
        >
          {/* Top bar */}
          <div
            className="flex-none flex items-center justify-between px-6 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {artwork.category}
              </p>
              <h2 className="font-display text-xl md:text-2xl font-light text-foreground mt-0.5">
                {meta.title}
                {meta.year && (
                  <span className="font-mono text-sm text-muted-foreground ml-4">{meta.year}</span>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${
                  sidebarOpen
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Info ein/ausblenden"
                title="Info (i)"
              >
                <Info size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Schließen"
              >
                <X size={26} />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div
            className="flex flex-1 min-h-0 flex-col lg:flex-row gap-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image area */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black/5">
              {images.length > 0 ? (
                <>
                  <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                    <div className="flex h-full">
                      {images.map((src, i) => (
                        <div
                          key={i}
                          className="min-w-0 shrink-0 grow-0 basis-full h-full flex items-center justify-center p-4 md:p-8"
                        >
                          <img
                            src={src}
                            alt={`${meta.title} ${i + 1}`}
                            className="max-h-full max-w-full object-contain select-none"
                            draggable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevImg}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors z-10"
                        aria-label="Vorheriges Bild"
                      >
                        <ChevronLeft size={28} />
                      </button>
                      <button
                        onClick={goToNextImg}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors z-10"
                        aria-label="Nächstes Bild"
                      >
                        <ChevronRight size={28} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              imgIndex === i
                                ? "w-5 bg-primary"
                                : "w-1.5 bg-foreground/25 hover:bg-foreground/50"
                            }`}
                            aria-label={`Bild ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <ArtworkPlaceholder className="w-full h-full" />
              )}

              {/* Artwork prev/next */}
              {onNavigate && (
                <div className="absolute bottom-3 right-3 flex gap-1 z-10">
                  <button
                    onClick={() => goTo("prev")}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground/50 hover:text-foreground border border-border/50 hover:border-border transition-colors text-xs font-mono"
                    title="Vorheriges Werk"
                  >
                    ←
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-muted-foreground/40 text-xs font-mono">
                    {currentIndex + 1}/{visibleArtworks.length}
                  </span>
                  <button
                    onClick={() => goTo("next")}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground/50 hover:text-foreground border border-border/50 hover:border-border transition-colors text-xs font-mono"
                    title="Nächstes Werk"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* Info sidebar — kollabierbar */}
            <motion.div
              animate={{ width: sidebarOpen ? 300 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-none overflow-hidden border-t lg:border-t-0 lg:border-l border-border/40"
            >
              <div className="w-[300px] h-full flex flex-col justify-between px-6 py-6">
                <div>
                  {/* Status */}
                  {(() => {
                    const s = artwork.status ?? "available";
                    return (
                      <div className="flex items-center gap-2 mb-5">
                        <span className={`inline-block w-2 h-2 rounded-full flex-none ${STATUS_DOT[s] ?? STATUS_DOT.available}`} />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {STATUS_LABEL[s] ?? "Verfügbar"}
                        </span>
                      </div>
                    );
                  })()}

                  <div className="space-y-1.5 mb-8">
                    {meta.medium && (
                      <p className="font-mono text-sm text-muted-foreground">{meta.medium}</p>
                    )}
                    {meta.dimensions && (
                      <p className="font-mono text-sm text-muted-foreground">{meta.dimensions}</p>
                    )}
                    {images.length > 1 && (
                      <p className="font-mono text-xs text-muted-foreground/50 pt-1">
                        {imgIndex + 1} / {images.length}
                      </p>
                    )}
                  </div>
                  {artwork.description && (
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {artwork.description}
                    </p>
                  )}
                </div>
                {(artwork.status ?? "available") !== "sold" ? (
                  <div className="flex flex-col gap-2 mt-6">
                    <Link
                      to={`/contact?inquiry=artwork&work=${encodeURIComponent(meta.title)}`}
                      className="inline-block self-start font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-6 py-3 hover:bg-gold-hover transition-all duration-500"
                      onClick={onClose}
                    >
                      Anfrage stellen
                    </Link>
                    <a
                      href={`mailto:miro@ateliermiro.de?subject=${encodeURIComponent(`Anfrage zu: ${meta.title}`)}`}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Direkt per E-Mail →
                    </a>
                  </div>
                ) : (
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mt-6">
                    Dieses Werk ist verkauft
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
