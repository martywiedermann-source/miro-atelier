import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";

const Contact = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 lg:gap-24">
            {/* Left column — info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
                  Let's Talk
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
                  Start a Conversation
                </h1>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Contact</p>
                <div className="space-y-4">
                  {/* PLACEHOLDER: Replace with actual contact info */}
                  <a href="mailto:studio@wiedermann.art" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail size={16} className="text-primary" />
                    <span className="text-sm">studio@wiedermann.art</span>
                  </a>
                  <a href="tel:+4912345678" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone size={16} className="text-primary" />
                    <span className="text-sm">+49 123 456 78</span>
                  </a>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm">Berlin, Germany</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Social</p>
                <div className="space-y-3">
                  {/* PLACEHOLDER: Replace with actual social links */}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Instagram size={16} />
                    <span className="text-sm">@miroslavwiedermann</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin size={16} />
                    <span className="text-sm">miroslav-wiedermann</span>
                  </a>
                </div>
              </div>

              {/* Small logo */}
              <div className="pt-4">
                <img src="/logo/logo-grey.svg" alt="MW" className="w-16 h-auto opacity-30" />
              </div>
            </motion.div>

            {/* Right column — form */}
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
