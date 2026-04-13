import { motion } from "framer-motion";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

// PLACEHOLDER: Replace with actual milestones
const milestones: TimelineItem[] = [
  { year: "2024", title: "Museum für Moderne Kunst — Solo Exhibition", description: "Major solo show 'Nocturnes' featuring 12 large-scale paintings." },
  { year: "2023", title: "Art Basel — Gallery Representation", description: "Represented by Galerie Koenig at Art Basel, international recognition." },
  { year: "2022", title: "World Economic Forum — Keynote", description: "Invited speaker on creativity and innovation at Davos side event." },
  { year: "2021", title: "Centre Pompidou — Group Exhibition", description: "Featured in 'New European Painting' survey exhibition." },
  { year: "2020", title: "Residency — Villa Romana, Florence", description: "Six-month artist residency exploring Italian materiality and light." },
  { year: "2018", title: "First Major Solo Exhibition", description: "Breakthrough solo show at Kunsthalle Wien, critical acclaim." },
];

/**
 * Vertical center-line timeline with alternating left/right entries
 */
const Timeline = () => {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border" />

      <div className="space-y-16">
        {milestones.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12"
            >
              {/* Dot on line */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1 w-2.5 h-2.5 rounded-full bg-primary z-10" />

              {/* Content */}
              <div className={`pl-12 md:pl-0 ${isLeft ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                <h4 className="font-display text-xl text-foreground mt-1 mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* Empty column for alignment */}
              {isLeft ? <div className="hidden md:block" /> : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
