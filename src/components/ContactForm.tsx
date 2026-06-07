import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import InquiryTypeSelector, { DEFAULT_INQUIRY_TYPES } from "./InquiryTypeSelector";
import { useConfig } from "@/contexts/ConfigContext";
import { Loader2 } from "lucide-react";

const INQUIRY_SUBJECTS: Record<string, string> = {
  "Werkankauf":        "Anfrage zu einem Werk",
  "Ausstellungsanfrage": "Ausstellungsanfrage",
  "Pressenanfrage":    "Presse / Medienanfrage",
  "Sonstiges":         "",
};

const ContactForm = () => {
  const { effectiveOverride } = useConfig();
  const inquiryTypes = effectiveOverride.inquiryTypes ?? DEFAULT_INQUIRY_TYPES;
  const [searchParams] = useSearchParams();
  const [inquiry, setInquiry] = useState(inquiryTypes[0] ?? "Werkankauf");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");

  // URL-Parameter vorausfüllen
  useEffect(() => {
    const inquiryParam = searchParams.get("inquiry");
    const workParam = searchParams.get("work");

    if (inquiryParam === "artwork")    setInquiry("Werkankauf");
    else if (inquiryParam === "exhibition") setInquiry("Ausstellungsanfrage");
    else if (inquiryParam === "press") setInquiry("Pressenanfrage");

    if (workParam) setSubject(`Anfrage zu: ${workParam}`);
  }, [searchParams]);

  // Betreff automatisch aus Anfrage-Typ (bekannte Typen → Mapping, neue Typen → Typname)
  useEffect(() => {
    if (!searchParams.get("work")) {
      setSubject(INQUIRY_SUBJECTS[inquiry] ?? inquiry);
    }
  }, [inquiry, searchParams]);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("inquiry_type", inquiry);
    formData.append("subject_line", subject);

    try {
      const res = await fetch("/api/admin.php?action=send_mail", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
      } else {
        setError(json.error ?? "Fehler beim Senden. Bitte versuchen Sie es später erneut.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h3 className="font-display text-3xl text-foreground mb-4">Vielen Dank</h3>
        <p className="text-muted-foreground">
          Ihre Nachricht wurde geöffnet. Ich melde mich in Kürze bei Ihnen.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Anfrage-Typ */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Art der Anfrage
        </label>
        <InquiryTypeSelector value={inquiry} onChange={setInquiry} types={inquiryTypes} />
      </div>

      {/* Felder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
            placeholder="Ihr vollständiger Name"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            E-Mail *
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
            placeholder="ihre@email.de"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Institution / Galerie
        </label>
        <input
          type="text"
          name="organization"
          className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
          placeholder="Galerie, Institution oder Unternehmen (optional)"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Betreff
        </label>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
          placeholder="Betreff"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Nachricht *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none font-body"
          placeholder="Ihre Nachricht…"
        />
      </div>

      {/* Honeypot – für Bots unsichtbar */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      {error && (
        <p className="font-mono text-xs text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-10 py-4 hover:bg-gold-hover transition-all duration-500 disabled:opacity-50 flex items-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Nachricht senden
      </button>

      <p className="font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
        Mit dem Absenden werden Ihre Angaben zur Bearbeitung Ihrer Anfrage verwendet.
        Es findet keine Weitergabe an Dritte statt.{" "}
        <a href="/datenschutz" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
          Datenschutzerklärung
        </a>
      </p>
    </form>
  );
};

export default ContactForm;
