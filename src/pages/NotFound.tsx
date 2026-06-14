import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "@/lib/seo";

const NotFound = () => {
  usePageTitle("Seite nicht gefunden");
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">404</p>
        <h1 className="font-display text-4xl font-light text-foreground mb-4">Seite nicht gefunden</h1>
        <p className="font-body text-muted-foreground mb-8">
          Diese Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.3em] bg-primary text-primary-foreground px-8 py-3 hover:bg-gold-hover transition-all duration-500"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
