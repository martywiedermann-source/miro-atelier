export const DEFAULT_INQUIRY_TYPES = ["Werkankauf", "Ausstellungsanfrage", "Pressenanfrage", "Sonstiges"];

interface InquiryTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  types?: string[];
}

const InquiryTypeSelector = ({ value, onChange, types = DEFAULT_INQUIRY_TYPES }: InquiryTypeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 border transition-all duration-300 ${
            value === type
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default InquiryTypeSelector;
