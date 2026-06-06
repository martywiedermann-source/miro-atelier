const ArtworkPlaceholder = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center bg-surface-warm ${className}`}>
    <span className="font-bodoni text-muted-foreground/40 select-none" style={{ fontSize: "clamp(1.5rem, 5cqi, 3rem)" }}>
      MW
    </span>
  </div>
);

export default ArtworkPlaceholder;
