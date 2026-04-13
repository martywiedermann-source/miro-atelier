import { motion } from "framer-motion";

interface SectionLabelProps {
  number?: string;
  label: string;
  className?: string;
}

/**
 * Reusable section label: "01 — LABEL" style
 * Used across pages for consistent section headings
 */
const SectionLabel = ({ number, label, className = "" }: SectionLabelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-3 mb-8 ${className}`}
    >
      {number && (
        <span className="font-mono text-xs text-primary tracking-wider">{number}</span>
      )}
      {number && <span className="text-border">—</span>}
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </motion.div>
  );
};

export default SectionLabel;
