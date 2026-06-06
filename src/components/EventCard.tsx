import { motion } from "framer-motion";
import { ArtEvent } from "@/lib/events";

interface EventCardProps {
  event: ArtEvent;
  index: number;
  compact?: boolean;
}

const TYPE_LABELS: Record<ArtEvent["type"], string> = {
  solo: "Einzelausstellung",
  group: "Gruppenausstellung",
  speaking: "Vortrag",
};

const EventCard = ({ event, index, compact = false }: EventCardProps) => {
  const isPlaceholderDate = event.date.startsWith("XXXX");
  const date = isPlaceholderDate ? null : new Date(event.date);
  const month = date
    ? date.toLocaleString("de", { month: "short" }).toUpperCase()
    : "—";
  const day = date ? date.getDate() : "—";
  const year = date ? date.getFullYear() : "—";

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="flex items-start gap-6 py-5 border-b border-border"
      >
        <span className="font-mono text-xs text-muted-foreground shrink-0 w-12">
          {isPlaceholderDate ? "—" : year}
        </span>
        <div>
          <h4 className="font-display text-lg text-foreground">{event.title}</h4>
          <p className="font-mono text-xs text-muted-foreground">
            {event.venue} — {event.city}, {event.country}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 md:gap-10 py-8 border-b border-border"
    >
      {/* Date badge */}
      <div className="flex md:flex-col items-center md:items-start gap-2">
        <span className="font-display text-3xl text-primary">{day}</span>
        <div>
          <span className="font-mono text-xs text-primary tracking-wider block">{month}</span>
          <span className="font-mono text-xs text-muted-foreground">{year}</span>
        </div>
      </div>

      {/* Content — kein Fremdbild */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/30 px-2 py-0.5">
            {TYPE_LABELS[event.type] ?? event.type}
          </span>
        </div>
        <h3 className="font-display text-2xl text-foreground mb-2">{event.title}</h3>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          {event.venue} — {event.city}, {event.country}
        </p>
        {event.description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
