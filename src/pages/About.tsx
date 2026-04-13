import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Timeline from "@/components/Timeline";
import SectionLabel from "@/components/SectionLabel";
import LogoPartnerRow from "@/components/LogoPartnerRow";

const About = () => {
  return (
    <PageTransition>
      {/* Full-width banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src="/images/about-banner.jpg" // REPLACE with actual about banner
          alt="Miroslav Wiedermann in gallery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-12 left-8 md:left-16"
        >
          <h1 className="font-display text-5xl md:text-7xl font-light text-foreground">
            Miroslav Wiedermann
          </h1>
        </motion.div>
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
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">The Artist</p>
                {/* PLACEHOLDER: Replace with actual bio */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Miroslav Wiedermann is a visual artist working across painting, drawing, and mixed media. His work explores the liminal space between abstraction and figuration, searching for moments where form dissolves into feeling.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Based between Berlin and Vienna, his practice is rooted in a deep engagement with materiality — the weight of pigment, the resistance of canvas, the alchemy of gold leaf meeting raw earth tones.
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">The Speaker</p>
                {/* PLACEHOLDER: Replace with actual speaker info */}
                <p className="text-muted-foreground leading-relaxed">
                  As a sought-after speaker, Miroslav addresses themes of creative leadership, the role of art in society, and how artistic thinking can transform business and culture. He has spoken at TEDx, the World Economic Forum, and leading European cultural institutions.
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">The Human</p>
                {/* PLACEHOLDER: Replace with actual personal note */}
                <p className="text-muted-foreground leading-relaxed">
                  Beyond the studio and the stage, Miroslav is driven by a deep curiosity about human connection. He draws inspiration from architecture, philosophy, long walks in unfamiliar cities, and the quiet beauty of ordinary moments.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Quote pullout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center py-20 border-t border-b border-border mb-24"
          >
            {/* PLACEHOLDER: Replace with actual quote */}
            <blockquote className="font-display text-3xl md:text-4xl font-light italic text-foreground leading-relaxed">
              "Every painting begins in darkness. The act of creation is the act of finding light — not adding it, but revealing what was always there."
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mt-8">
              — Miroslav Wiedermann
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="mb-24">
            <SectionLabel label="Milestones" />
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
            <a
              href="/press-kit.pdf"
              target="_blank"
              className="font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-10 py-4 hover:bg-gold-hover transition-all duration-500"
            >
              Download Press Kit
            </a>
            <Link
              to="/contact?inquiry=speaking"
              className="font-mono text-xs uppercase tracking-[0.3em] text-foreground border border-foreground/30 px-10 py-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500"
            >
              Book as Speaker
            </Link>
          </motion.div>

          {/* Partner logos */}
          <div className="pb-24 md:pb-40">
            <SectionLabel label="Exhibited At & Partners" className="justify-center" />
            <LogoPartnerRow />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
