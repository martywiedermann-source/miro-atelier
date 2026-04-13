import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import EventCard from "@/components/EventCard";
import SectionLabel from "@/components/SectionLabel";
import { events } from "@/lib/events";

const Events = () => {
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="font-display text-5xl md:text-7xl font-light text-foreground">
              Exhibitions & Events
            </h1>
          </motion.div>

          {/* Upcoming */}
          <section className="mb-32">
            <SectionLabel label="Upcoming" />
            {upcoming.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </section>

          {/* Past */}
          <section className="mb-24">
            <SectionLabel label="Past Exhibitions" />
            {past.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} compact />
            ))}
          </section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 border-t border-border"
          >
            <p className="font-display text-2xl text-foreground mb-8">
              Interested in collaborating?
            </p>
            <Link
              to="/contact?inquiry=exhibition"
              className="inline-block font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-10 py-4 hover:bg-gold-hover transition-all duration-500"
            >
              Propose an Exhibition or Event
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Events;
