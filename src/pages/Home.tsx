import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import PageTransition from "@/components/PageTransition";
import SectionLabel from "@/components/SectionLabel";
import { Link } from "react-router-dom";
import { useEffectiveEvents } from "@/lib/hooks";
import { siteConfig } from "@/lib/siteConfig";
import { usePageTitle } from "@/lib/seo";

const featuredWorks = [
  { image: "/images/gallery/gelber-schatten/_mg_3137.jpg", title: "Gelber Schatten", year: "2007" },
  { image: "/images/gallery/mahlwerk/bild0394.jpg", title: "Mahlwerk", year: "2009" },
  { image: "/images/gallery/strudel/dsc00118.jpg", title: "Strudel", year: "2011" },
];

const Home = () => {
  usePageTitle();
  const upcomingEvents = useEffectiveEvents().filter((e) => e.upcoming).slice(0, 2);
  return (
    <PageTransition>
      {/* Section 1 — Hero Slider */}
      <Hero />

      {/* Section 2 — Philosophy Teaser */}
      <section className="py-28 md:py-40 px-6 bg-surface-warm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto text-center max-w-4xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-8">
            Philosophie
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight italic leading-tight">
            »Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd.«
          </h2>
          <div className="gold-line mt-12" />
        </motion.div>
      </section>

      {/* Section 3 — Gallery Teaser */}
      <section className="py-24 md:py-40 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-16">
            <SectionLabel number="01" label="Ausgewählte Werke" />
            <Link
              to="/works"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Alle Werke →
            </Link>
          </div>

          {/* Asymmetric grid: large left, two smaller right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Large image left spanning 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative overflow-hidden md:row-span-2 aspect-[3/4] cursor-pointer"
            >
              <Link to="/works">
                <img
                  src={featuredWorks[0].image}
                  alt={featuredWorks[0].title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-500 flex items-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="font-mono text-xs text-background/70 mb-1">{featuredWorks[0].year}</p>
                    <p className="font-display text-2xl text-background">{featuredWorks[0].title}</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Two smaller images right */}
            {featuredWorks.slice(1).map((work, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i + 1) * 0.15 }}
                className="group relative overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <Link to="/works">
                  <img
                    src={work.image}
                    alt={work.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-500 flex items-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="font-mono text-xs text-background/70 mb-1">{work.year}</p>
                      <p className="font-display text-xl text-background">{work.title}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/works"
              className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-foreground border border-foreground/30 px-10 py-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
            >
              Alle Arbeiten
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — About Teaser */}
      <section className="py-24 md:py-40 px-6 bg-surface-warm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img
                src="/images/portrait.jpg" // REPLACE with actual portrait
                alt="Miroslav Wiedermann"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Der Künstler</p>
              <h3 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">
                Zwischen Relief und Skulptur — Filz als Medium.
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Miroslav Wiedermann, geboren 1964 in Eger, arbeitet seit 1994 freischaffend als Künstler. Seine Reliefs entstehen durch präzises Schneiden und Schichten von Filz — ein Material, das er für seine Doppelnatur schätzt: weich und dennoch strukturstabil.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Die Arbeiten stehen zwischen Malerei und Skulptur. Sie verändern sich mit dem Licht und der Perspektive des Betrachters. Atelier in Gelnhausen Hailer.
              </p>
              <Link
                to="/about"
                className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-foreground border border-foreground/30 px-8 py-3 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
              >
                Zur Vita
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5 — Upcoming Events Teaser (nur wenn Seite aktiv + Events vorhanden) */}
      {siteConfig.pages.events.enabled && upcomingEvents.length > 0 && (
        <section className="py-24 md:py-40 px-6">
          <div className="container mx-auto">
            <SectionLabel number="02" label="Bevorstehend" />

            <div className="space-y-8 mb-12">
              {upcomingEvents.map((event, i) => {
                const isPlaceholder = event.date.startsWith("XXXX");
                const date = isPlaceholder ? null : new Date(event.date);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex flex-col md:flex-row gap-6 md:gap-10 py-8 border-b border-border"
                  >
                    <div className="flex items-center gap-4 md:w-40 shrink-0">
                      <span className="font-display text-3xl text-primary">
                        {date ? date.getDate() : "—"}
                      </span>
                      <div>
                        <span className="font-mono text-xs text-primary tracking-wider block">
                          {date ? date.toLocaleString("de", { month: "short" }).toUpperCase() : "—"}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {date ? date.getFullYear() : "—"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display text-xl text-foreground mb-2">{event.title}</h4>
                      <p className="font-mono text-xs text-muted-foreground mb-2">
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
              })}
            </div>

            <Link
              to="/events"
              className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-foreground border border-foreground/30 px-8 py-3 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
            >
              Alle Ausstellungen
            </Link>
          </div>
        </section>
      )}

      {/* Section 6 — Contact CTA Banner (dark contrast section) */}
      <section className="py-24 md:py-32 px-6 bg-dark-contrast">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Logo auf dunklem Hintergrund */}
            <img
              src="/logo/logo-dark.jpg"
              alt="Atelier Miroslav Wiedermann"
              className="w-32 mx-auto mb-10 opacity-90"
            />
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-dark-contrast-foreground mb-10">
              Interesse an einer Arbeit?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact?inquiry=artwork"
                className="font-mono text-xs uppercase tracking-[0.3em] text-dark-contrast-foreground border border-dark-contrast-foreground/30 px-8 py-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
              >
                Anfrage stellen
              </Link>
              <Link
                to="/works"
                className="font-mono text-xs uppercase tracking-[0.3em] text-primary border border-primary/30 px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-500"
              >
                Alle Arbeiten
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
