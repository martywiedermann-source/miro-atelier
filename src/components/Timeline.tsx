import { motion } from "framer-motion";
import { artworks } from "@/lib/artworks";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const milestones: TimelineItem[] = [
  { year: "1964", title: "Geboren in Eger", description: "Miroslav Wiedermann wird in Eger (Cheb) geboren." },
  { year: "1994", title: "Selbständige Arbeit in Kunst und Architektur", description: "Beginn der freischaffenden Tätigkeit als Künstler und Architekt. Konzeptionelle Messebauten für Cebit, Anuga und Musikmesse Frankfurt." },
  { year: "1996", title: "15. Internationale Biennale Kortrijk", description: "Teilnahme an der 15. Internationalen Biennale in Kortrijk, Belgien." },
  { year: "1997", title: "Max Planck Institut Jena", description: "Konzeptionelle Arbeit für das Max Planck Institut in Jena." },
  { year: "1999", title: "Einzelausstellung Herrnhaag — hr3-Bericht", description: "Einzelausstellung in Herrnhaag (Lichtenburg). TV-Bericht im hr3." },
  { year: "2000", title: "Publikation »kunstWerk«", description: "Aufnahme in die Publikation »kunstWerk – Aktuelle Positionen der Bildenden Kunst«. Gruppenausstellungen im KunsWerk Holzhausenschlösschen und der BBK Galerie Frankfurt." },
  { year: "2002", title: "Einzelausstellung Galerie Frech Alzenau", description: "Einzelausstellung mit TV-Bericht. Großprojekt in Wiesbaden." },
  { year: "2007", title: "Atelier Gelnhausen — Künstlerbund Simplicius", description: "Gastmitglied beim Künstlerbund Simplicius in Hanau. Einrichtung des Ateliers in Gelnhausen Hailer." },
  { year: "2009", title: "Einzelausstellung artRIUM Bruchköbel", description: "Einzelausstellung im artRIUM Bruchköbel." },
  { year: "2010", title: "Galerie Bronto u. Wiesel, Wiesbaden", description: "Ausstellung in der Galerie Bronto u. Wiesel in Wiesbaden." },
];

function artworkForYear(year: string) {
  const yr = parseInt(year, 10);
  const matches = artworks.filter((a) => a.year === yr && a.images.length > 0);
  if (matches.length === 0) return null;
  return matches.reduce((best, a) => a.images.length > best.images.length ? a : best);
}

const Timeline = () => {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border" />

      <div className="space-y-16">
        {milestones.map((item, i) => {
          const isLeft = i % 2 === 0;
          const artwork = artworkForYear(item.year);
          const imgSrc = artwork?.images[0];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12"
            >
              {/* Dot on line */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1 w-2.5 h-2.5 rounded-full bg-primary z-10" />

              {isLeft ? (
                <>
                  {/* Text — left column */}
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.08 + 0.1 }}
                    className="pl-12 md:pl-0 md:text-right md:pr-12"
                  >
                    <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                    <h4 className="font-display text-xl text-foreground mt-1 mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </motion.div>

                  {/* Image or empty — right column */}
                  {imgSrc ? (
                    <motion.div
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: i * 0.08 + 0.15 }}
                      className="hidden md:flex items-center pl-12"
                    >
                      <img
                        src={imgSrc}
                        alt={artwork!.title}
                        className="w-32 h-24 object-cover shadow-sm"
                        loading="lazy"
                      />
                      <span className="font-mono text-[10px] text-muted-foreground ml-3 leading-tight">
                        {artwork!.title}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                </>
              ) : (
                <>
                  {/* Image or empty — left column */}
                  {imgSrc ? (
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: i * 0.08 + 0.15 }}
                      className="hidden md:flex items-center justify-end pr-12"
                    >
                      <span className="font-mono text-[10px] text-muted-foreground mr-3 leading-tight text-right">
                        {artwork!.title}
                      </span>
                      <img
                        src={imgSrc}
                        alt={artwork!.title}
                        className="w-32 h-24 object-cover shadow-sm"
                        loading="lazy"
                      />
                    </motion.div>
                  ) : (
                    <div className="hidden md:block" />
                  )}

                  {/* Text — right column */}
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: i * 0.08 + 0.1 }}
                    className="pl-12 md:col-start-2 md:pl-12"
                  >
                    <span className="font-mono text-xs text-primary tracking-wider">{item.year}</span>
                    <h4 className="font-display text-xl text-foreground mt-1 mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
