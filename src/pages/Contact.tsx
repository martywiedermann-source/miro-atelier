import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import { usePageTitle } from "@/lib/seo";

const Contact = () => {
  usePageTitle("Kontakt");
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 lg:gap-24">
            {/* Linke Spalte — Kontaktinfo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
                  Kontakt
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
                  Schreiben Sie mir
                </h1>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
                  Atelier
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:miro@ateliermiro.de"
                    className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail size={16} className="text-primary shrink-0" />
                    <span className="text-sm">miro@ateliermiro.de</span>
                  </a>
                  <a
                    href="tel:+491755933703"
                    className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone size={16} className="text-primary shrink-0" />
                    <span className="text-sm">+49 175 5933703</span>
                  </a>
                  <div className="flex items-start gap-4 text-muted-foreground">
                    <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">
                      Brühlstraße 3<br />
                      63571 Gelnhausen / Hailer
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <img src="/logo/logo-grey.svg" alt="MW" className="w-16 h-auto opacity-30" />
              </div>
            </motion.div>

            {/* Rechte Spalte — Formular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
