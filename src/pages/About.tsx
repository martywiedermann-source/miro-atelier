import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Timeline from "@/components/Timeline";
import SectionLabel from "@/components/SectionLabel";
import LogoPartnerRow from "@/components/LogoPartnerRow";
import { usePageTitle } from "@/lib/seo";

const About = () => {
  usePageTitle("Über den Künstler");
  return (
    <PageTransition>
      {/* Full-width banner — Bild enthält Text bereits eingedruckt, kein HTML-Overlay */}
      <div className="w-full overflow-hidden">
        <img
          src="/images/about-banner.jpg"
          alt="Miroslav Wiedermann"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="px-6">
        <div className="container mx-auto">
          {/* Bio section — 3 parts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 py-24 md:py-40">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/images/portrait.jpg" // REPLACE with actual portrait
                alt="Miroslav Wiedermann"
                className="w-full aspect-[3/4] object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center space-y-12"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Der Künstler</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Miroslav Wiedermann, geboren 1964 in Eger, studierte an der Werkkunstschule Flensburg. Seit 1994 arbeitet er freischaffend in Kunst und Architektur — mit konzeptionellen Messebauten für Cebit, Anuga und Musikmesse Frankfurt sowie Projekten für das Max Planck Institut in Jena und das Sultanat Oman.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Sein Atelier befindet sich in Gelnhausen Hailer, wo er seit 2007 arbeitet. Parallel entstanden Projekte in Pilsen und Zlin (Tschechien) sowie Ausstellungen in Hessen und darüber hinaus.
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Zu meiner Kunst</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd. Ich organisiere meine Arbeiten als Objekte und Installationen.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Mein Weg zum Filz führte mich vor etwa fünfzehn Jahren nach München, wo mich das Material in seiner Doppelnatur — weich und dennoch strukturstabil — faszinierte. Durch präzises Schneiden und Schichten entwickelte ich eine eigenständige Methode, die meine Arbeiten als echte Reliefs entstehen lässt: zwischen Malerei und Skulptur, veränderlich mit Licht und Betrachterperspektive.
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Kontakt</p>
                <p className="text-muted-foreground leading-relaxed">
                  Berkaer Str. 19 · 99837 Werra-Suhl-Tal<br />
                  Tel. +49 175 5933703<br />
                  miro@ateliermiro.de
                </p>
              </div>
            </motion.div>
          </div>

          {/* Galerie Rubrecht — editorial section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="-mx-6 px-6 py-20 md:py-32 bg-white border-t border-b border-black/10 mb-24"
          >
            <div className="max-w-3xl mx-auto">
              <p className="font-abel text-[10px] uppercase tracking-[0.35em] text-black/40 mb-8">
                Galerie Rubrecht Contemporary · Wiesbaden
              </p>
              <h2 className="font-abel text-2xl md:text-3xl text-black leading-snug mb-2">
                Neue Stimme im Kanon der Reliefkunst
              </h2>
              <p className="font-abel text-sm text-black/50 mb-10">
                Miroslav Wiedermanns Entdeckung des Materials Filz und die Folgen — 2004
              </p>
              <div className="space-y-5 text-[15px] leading-[1.85] text-black/75" style={{ fontFamily: '"Times New Roman", Georgia, serif' }}>
                <p>
                  Maler? Bildhauer? Miroslav Wiedermann schüttelt den Kopf, beginnt zu lächeln.
                  „Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd."
                  Für Wiedermann sind die Übergänge fließend. Er ordnet seine Werke gerne
                  in Objekt und Installation ein — und doch trägt seine Herangehensweise
                  unübersehbar sowohl bildhauerische wie malerische Züge.
                </p>
                <p>
                  Da sind kantig-prägnante, klar begrenzte, untereinander geschwisterlich
                  ähnliche Volumina — als Individuum ausgesprochen winzig, dafür jedoch
                  stets gleich im Kollektiv daherkommend. Und da sind Farben: mal streng
                  monochrom, mal tonig abgestuft, mal im harten Komplementärkontrast.
                  Aufgetragene Farben erscheinen als Formen ebenso wie der Werkstoff Filz
                  als formtragendes Element.
                </p>
              </div>
              <p className="font-abel text-[11px] text-black/35 tracking-[0.15em] uppercase mt-10">
                © Text Dr. Roland Held
              </p>
            </div>
          </motion.div>

          {/* Quote pullout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center py-20 border-t border-b border-border mb-24"
          >
            <blockquote className="font-display text-3xl md:text-4xl font-light italic text-foreground leading-relaxed">
              »Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd.«
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mt-8">
              — Miroslav Wiedermann
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="mb-24">
            <SectionLabel label="Stationen" />
            <Timeline />
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-6 mb-24"
          >
            <Link
              to="/works"
              className="font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-10 py-4 hover:bg-gold-hover transition-all duration-500"
            >
              Zu den Arbeiten
            </Link>
            <Link
              to="/contact"
              className="font-mono text-xs uppercase tracking-[0.3em] text-foreground border border-foreground/30 px-10 py-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
            >
              Kontakt
            </Link>
          </motion.div>

          {/* Partner logos */}
          <div className="pb-24 md:pb-40">
            <SectionLabel label="Ausgestellt bei & Partner" className="justify-center" />
            <LogoPartnerRow />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
