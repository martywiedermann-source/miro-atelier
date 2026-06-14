import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { useConfig } from "@/contexts/ConfigContext";
import { usePageTitle } from "@/lib/seo";

const DEFAULTS = {
  name:     "Miroslav Wiedermann",
  strasse:  "Brühlstraße 3",
  ort:      "63571 Gelnhausen",
  telefon:  "06051 977030",
  email:    "miro@ateliermiro.de",
  beruf:    "Bildender Künstler (freischaffend seit 1994).",
  steuer:   "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).",
};

const Impressum = () => {
  usePageTitle("Impressum");
  const { effectiveOverride } = useConfig();
  const imp = effectiveOverride.impressum ?? {};
  const get = (key: keyof typeof DEFAULTS) => imp[key] ?? DEFAULTS[key];

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
            <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-16">Impressum</h1>

            <div className="space-y-12 text-muted-foreground">
              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Angaben gemäß § 5 TMG</h2>
                <address className="not-italic leading-relaxed space-y-1">
                  <p className="text-foreground font-medium">{get("name")}</p>
                  <p>{get("strasse")}</p>
                  <p>{get("ort")}</p>
                </address>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Kontakt</h2>
                <div className="space-y-1">
                  <p>
                    Telefon:{" "}
                    <a href={`tel:${get("telefon").replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">
                      {get("telefon")}
                    </a>
                  </p>
                  <p>
                    E-Mail:{" "}
                    <a href={`mailto:${get("email")}`} className="hover:text-foreground transition-colors">
                      {get("email")}
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Berufsbezeichnung</h2>
                <p className="leading-relaxed">{get("beruf")}</p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Umsatzsteuer</h2>
                <p className="leading-relaxed">{get("steuer")}</p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p className="leading-relaxed">
                  {get("name")}, {get("strasse")}, {get("ort")}
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Haftung für Inhalte</h2>
                <p className="leading-relaxed">
                  Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht
                  verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Haftung für Links</h2>
                <p className="leading-relaxed">
                  Diese Website enthält keine externen Links zu Drittseiten. Sollten zukünftig Links eingefügt werden,
                  besteht keine Haftung für deren Inhalte. Für die Inhalte der verlinkten Seiten sind ausschließlich
                  deren Betreiber verantwortlich.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">Urheberrecht</h2>
                <p className="leading-relaxed">
                  Alle auf dieser Website abgebildeten Kunstwerke, Fotos und Texte sind urheberrechtlich geschützt
                  und Eigentum von Miroslav Wiedermann. Jede Vervielfältigung, Bearbeitung oder Nutzung — auch
                  auszugsweise — bedarf der ausdrücklichen schriftlichen Genehmigung.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Impressum;
