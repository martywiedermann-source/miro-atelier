import { motion } from "framer-motion";
import { Artwork } from "@/lib/artworks";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  index: number;
}

const ArtworkCard = ({ artwork, onClick, index }: ArtworkCardProps) => {
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
        <img
          src={artwork.image}
          alt={artwork.title}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-all duration-500 flex flex-col items-center justify-center p-6">
          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-background/70 mb-2">
              {artwork.year} · {artwork.medium.split(" ")[0]}
            </p>
            <h3 className="font-display text-2xl text-background">
              {artwork.title}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
