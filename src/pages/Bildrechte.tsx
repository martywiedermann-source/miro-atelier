import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { usePageTitle } from "@/lib/seo";

const Bildrechte = () => {
  usePageTitle("Bildrechte");
  return (
    <PageTransition>
      <div className="min-h-screen pt-40 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Rechtliches</p>
            <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-16">
              Bildrechte
            </h1>

            <div className="space-y-12 text-muted-foreground leading-relaxed">

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  Urheberrecht an den Kunstwerken
                </h2>
                <p>
                  Alle auf dieser Website abgebildeten Kunstwerke — Reliefs, Objekte, Installationen
                  und Projekte — sind urheberrechtlich geschützte Werke gemäß §§ 2 ff. UrhG.
                </p>
                <p className="mt-4">
                  © Miroslav Wiedermann. Alle Rechte vorbehalten.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  Fotografien der Kunstwerke
                </h2>
                <p>
                  Die Werkfotos wurden vom Künstler selbst erstellt. Das Urheberrecht an den
                  Fotografien liegt ebenfalls bei Miroslav Wiedermann.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  Nutzung
                </h2>
                <p>
                  Jede Nutzung der abgebildeten Werke und Fotografien — insbesondere Vervielfältigung,
                  Verbreitung, öffentliche Zugänglichmachung, Bearbeitung oder gewerbliche Nutzung —
                  bedarf der ausdrücklichen schriftlichen Genehmigung des Künstlers.
                </p>
                <p className="mt-4">
                  Anfragen richten Sie bitte an:{" "}
                  <a
                    href="mailto:miro@ateliermiro.de"
                    className="hover:text-foreground transition-colors"
                  >
                    miro@ateliermiro.de
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  Presse und Ausstellungen
                </h2>
                <p>
                  Für redaktionelle Zwecke und Ausstellungsankündigungen stehen Pressebilder nach
                  vorheriger Absprache zur Verfügung. Bitte nehmen Sie Kontakt auf.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  Verwertungsgesellschaft
                </h2>
                <p>
                  Miroslav Wiedermann ist Mitglied der VG Bild-Kunst, der Verwertungsgesellschaft
                  für visuelle Kunst in Deutschland. Die VG Bild-Kunst nimmt die Rechte ihrer
                  Mitglieder wahr und verfolgt unerlaubte Nutzungen.
                </p>
                <p className="mt-4 text-sm">
                  Hinweis: Sollten Sie keine Mitgliedschaft bei der VG Bild-Kunst besitzen,
                  entfernen Sie diesen Abschnitt oder passen Sie ihn entsprechend an.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  Schriften und Software
                </h2>
                <p>
                  Die auf dieser Website verwendeten Schriftarten (Cormorant Garamond, Outfit,
                  Space Mono) werden lokal ausgeliefert und sind unter der SIL Open Font License
                  lizenziert. Es erfolgt keine Datenübertragung an externe Schriftanbieter.
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Bildrechte;
