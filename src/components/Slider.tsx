import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderSlide {
  image: string;
  title?: string;
  year?: string;
}

interface SliderProps {
  slides: SliderSlide[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  crossfade?: boolean;
  className?: string;
  overlay?: React.ReactNode;
  /** Height class, e.g. "h-screen" or "h-[60vh]" */
  heightClass?: string;
}

/**
 * Reusable full-screen slider component built on Embla Carousel.
 * Supports autoplay, crossfade transitions, dots, arrows, and overlay content.
 *
 * Usage:
 *   <Slider slides={slides} autoPlay interval={5000} showDots showArrows crossfade />
 */
const Slider = ({
  slides,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  crossfade = false,
  className = "",
  overlay,
  heightClass = "h-screen",
}: SliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: crossfade ? 0 : 30,
  });

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, emblaApi]);

  // Crossfade mode: render all slides stacked, toggle opacity
  if (crossfade) {
    return (
      <div className={`relative ${heightClass} w-full overflow-hidden ${className}`}>
        {slides.map((slide, i) => (
          <AnimatePresence key={i}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === i ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ zIndex: activeIndex === i ? 1 : 0 }}
            >
              <img
                src={slide.image}
                alt={slide.title || `Slide ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* Dark gradient overlay — bottom for caption, subtle overall for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.1) 100%)",
                }}
              />
              {/* Slide caption bottom-left */}
              {slide.title && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeIndex === i ? 1 : 0, y: activeIndex === i ? 0 : 20 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute bottom-24 left-8 md:left-16 z-10"
                >
                  <p className="font-display text-lg md:text-xl text-white/80">
                    {slide.title}
                    {slide.year && (
                      <span className="font-mono text-xs text-white/50 ml-3">{slide.year}</span>
                    )}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ))}

        {/* Hidden embla for index tracking */}
        <div className="sr-only" ref={emblaRef}>
          <div className="flex">
            {slides.map((_, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full" />
            ))}
          </div>
        </div>

        {/* Overlay content (hero text etc.) */}
        {overlay && <div className="absolute inset-0 z-10 flex items-center justify-center">{overlay}</div>}

        {/* Arrows */}
        {showArrows && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  activeIndex === i
                    ? "bg-white w-6"
                    : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard slide mode
  return (
    <div className={`relative ${heightClass} w-full overflow-hidden ${className}`}>
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full h-full relative">
              <img
                src={slide.image}
                alt={slide.title || `Slide ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.1) 100%)",
                }}
              />
              {slide.title && (
                <div className="absolute bottom-24 left-8 md:left-16">
                  <p className="font-display text-lg md:text-xl text-white/80">
                    {slide.title}
                    {slide.year && (
                      <span className="font-mono text-xs text-white/50 ml-3">{slide.year}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {overlay && <div className="absolute inset-0 z-10 flex items-center justify-center">{overlay}</div>}

      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                activeIndex === i
                  ? "bg-white w-6"
                  : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
