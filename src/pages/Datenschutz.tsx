import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";

const Datenschutz = () => {
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
              Datenschutz&shy;erklärung
            </h1>

            <div className="space-y-12 text-muted-foreground leading-relaxed">

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  1. Verantwortlicher
                </h2>
                <address className="not-italic space-y-1">
                  <p className="text-foreground font-medium">Miroslav Wiedermann</p>
                  <p>Berkaer Str. 19</p>
                  <p>99837 Werra-Suhl-Tal</p>
                  <p className="mt-2">
                    Telefon:{" "}
                    <a href="tel:+491755933703" className="hover:text-foreground transition-colors">
                      +49 175 5933703
                    </a>
                  </p>
                  <p>
                    E-Mail:{" "}
                    <a href="mailto:miro@ateliermiro.de" className="hover:text-foreground transition-colors">
                      miro@ateliermiro.de
                    </a>
                  </p>
                </address>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  2. Erhobene Daten und Zweck
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground mb-2">Server-Logfiles</p>
                    <p>
                      Beim Aufruf dieser Website speichert der Hosting-Anbieter automatisch Zugriffsdaten
                      (IP-Adresse, Datum/Uhrzeit, aufgerufene Seite, Browsertyp). Diese Daten dienen
                      ausschließlich der technischen Betriebssicherheit und werden nicht an Dritte weitergegeben.
                      Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb).
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground mb-2">Kontaktformular</p>
                    <p>
                      Das Kontaktformular auf dieser Website öffnet Ihr lokales E-Mail-Programm (mailto:).
                      Es werden keine Daten auf dem Server gespeichert oder übermittelt. Die Verarbeitung
                      Ihrer Nachricht erfolgt ausschließlich über Ihre eigene E-Mail-Kommunikation.
                      Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung).
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground mb-2">Hosting</p>
                    <p>
                      Diese Website wird auf Servern der Hetzner Online GmbH (Deutschland) gehostet.
                      Der Server-Standort befindet sich in Deutschland. Rechtsgrundlage: Art. 6 Abs. 1
                      lit. f DSGVO. Weitere Informationen: <a href="https://www.hetzner.com/de/legal/privacy-policy" className="hover:text-foreground transition-colors">hetzner.com</a>.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  3. Keine Tracker, keine Cookies
                </h2>
                <p>
                  Diese Website verwendet keine Analyse-Tools (z. B. Google Analytics), keine
                  Tracking-Cookies und keine Social-Media-Plugins. Es werden keine personenbezogenen
                  Daten zu Werbezwecken verarbeitet.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  4. Speicherdauer
                </h2>
                <p>
                  Kontaktanfragen werden nur so lange gespeichert, wie es zur Bearbeitung erforderlich ist,
                  spätestens jedoch nach drei Jahren gelöscht, sofern keine gesetzlichen
                  Aufbewahrungspflichten entgegenstehen.
                </p>
              </section>

              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  5. Ihre Rechte
                </h2>
                <p className="mb-4">
                  Sie haben gegenüber dem Verantwortlichen folgende Rechte bezüglich Ihrer
                  personenbezogenen Daten:
                </p>
                <ul className="list-none space-y-2 pl-0">
                  {[
                    "Recht auf Auskunft (Art. 15 DSGVO)",
                    "Recht auf Berichtigung (Art. 16 DSGVO)",
                    "Recht auf Löschung (Art. 17 DSGVO)",
                    "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
                    "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
                    "Widerspruchsrecht (Art. 21 DSGVO)",
                  ].map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">—</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Zur Geltendmachung Ihrer Rechte wenden Sie sich bitte an:{" "}
                  <a href="mailto:miro@ateliermiro.de" className="hover:text-foreground transition-colors">
                    miro@ateliermiro.de
                  </a>
                </p>
                <p className="mt-4">
                  Sie haben außerdem das Recht, Beschwerde bei einer Datenschutz-Aufsichtsbehörde
                  einzulegen. Zuständig ist der Thüringer Landesbeauftragte für den Datenschutz
                  und die Informationsfreiheit (ThürLfDI), Erfurt.
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Datenschutz;
