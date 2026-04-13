import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import InquiryTypeSelector from "./InquiryTypeSelector";
import { Loader2 } from "lucide-react";

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const [inquiry, setInquiry] = useState("Artwork Purchase");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");

  // Pre-fill from URL params
  useEffect(() => {
    const inquiryParam = searchParams.get("inquiry");
    const workParam = searchParams.get("work");

    if (inquiryParam === "artwork") setInquiry("Artwork Purchase");
    else if (inquiryParam === "exhibition") setInquiry("Exhibition Proposal");
    else if (inquiryParam === "speaking") setInquiry("Speaking Booking");
    else if (inquiryParam === "press") setInquiry("Press & Media");

    if (workParam) setSubject(`Inquiry about: ${workParam}`);
  }, [searchParams]);

  // Auto-fill subject from inquiry type
  useEffect(() => {
    if (!searchParams.get("work")) {
      const subjects: Record<string, string> = {
        "Artwork Purchase": "Artwork Inquiry",
        "Exhibition Proposal": "Exhibition Proposal",
        "Speaking Booking": "Speaking Engagement Request",
        "Press & Media": "Press / Media Inquiry",
        "Other": "",
      };
      setSubject(subjects[inquiry] || "");
    }
  }, [inquiry, searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: replace with Resend/EmailJS API key from .env
    // For now, uses mailto: fallback
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const mailto = `mailto:studio@wiedermann.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nType: ${inquiry}\n\n${message}`
    )}`;

    setTimeout(() => {
      window.location.href = mailto;
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <h3 className="font-display text-3xl text-foreground mb-4">Thank you</h3>
        <p className="text-muted-foreground">Your message has been received. We will respond within 48 hours.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Inquiry type */}
      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Inquiry Type
        </label>
        <InquiryTypeSelector value={inquiry} onChange={setInquiry} />
      </div>

      {/* Fields */}
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
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Organization
        </label>
        <input
          type="text"
          name="organization"
          className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
          placeholder="Gallery, institution, or company (optional)"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors font-body"
          placeholder="Subject"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none font-body"
          placeholder="Tell us about your inquiry..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-10 py-4 hover:bg-gold-hover transition-all duration-500 disabled:opacity-50 flex items-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
