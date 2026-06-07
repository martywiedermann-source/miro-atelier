import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import ArtworkCard from "@/components/ArtworkCard";
import Lightbox from "@/components/Lightbox";
import { categories, Artwork } from "@/lib/artworks";
import { useVisibleArtworks } from "@/lib/hooks";
import { usePageTitle, useJsonLd } from "@/lib/seo";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  usePageTitle("Werke");
  useJsonLd("schema-artist", {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Miroslav Wiedermann",
    "jobTitle": "Bildender Künstler",
    "url": "https://www.ateliermiro.de",
    "knowsAbout": ["Relief-Malerei", "Filzrelief", "Expressive Malerei", "Figurativismus"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Gelnhausen",
      "addressRegion": "Hessen",
      "addressCountry": "DE"
    }
  });

  const visibleArtworks = useVisibleArtworks();
  const filtered = activeCategory === "all"
    ? visibleArtworks
    : visibleArtworks.filter((a) => a.category === activeCategory);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 px-6">
        <div className="container mx-auto">
          {/* Header — kompakt, damit Werke sofort above the fold sichtbar sind */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-baseline gap-4 mb-5 pt-2"
          >
            <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
              Werke
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Galerie
            </p>
          </motion.div>

          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`font-mono text-xs uppercase tracking-[0.15em] px-5 py-2 border transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Masonry grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((artwork, i) => (
              <div key={artwork.id} className="break-inside-avoid">
                <ArtworkCard
                  artwork={artwork}
                  onClick={setSelectedArtwork}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onNavigate={setSelectedArtwork}
      />
    </PageTransition>
  );
};

export default Gallery;
