import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import EventCard from "@/components/EventCard";
import SectionLabel from "@/components/SectionLabel";
import { useEffectiveEvents } from "@/lib/hooks";
import { usePageTitle } from "@/lib/seo";

const Events = () => {
  usePageTitle("Ausstellungen");
  const events = useEffectiveEvents();
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="font-display text-5xl md:text-7xl font-light text-foreground">
              Ausstellungen
            </h1>
          </motion.div>

          {/* Bevorstehend */}
          <section className="mb-32">
            <SectionLabel label="Bevorstehend" />
            {upcoming.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-8">
                Derzeit keine Ausstellungen angekündigt.
              </p>
            ) : (
              upcoming.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))
            )}
          </section>

          {/* Vergangene */}
          {past.length > 0 && (
            <section className="mb-24">
              <SectionLabel label="Vergangene Ausstellungen" />
              {past.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} compact />
              ))}
            </section>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 border-t border-border"
          >
            <p className="font-display text-2xl text-foreground mb-8">
              Interesse an einer Zusammenarbeit?
            </p>
            <Link
              to="/contact?inquiry=exhibition"
              className="inline-block font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-10 py-4 hover:bg-gold-hover transition-all duration-500"
            >
              Ausstellung vorschlagen
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Events;
