import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "@/lib/siteConfig";
import type { ArtEvent } from "@/lib/events";

export interface ArtworkOverride {
  visible?: boolean;
  hiddenImages?: string[];
  imageOrder?: string[];
  coverImage?: string;
  focalPoint?: string;
  status?: "available" | "sold" | "on-loan" | "not-for-sale";
  title?: string;
  year?: number | null;
  medium?: string;
  dimensions?: string;
  description?: string;
  category?: "relief" | "objekt" | "installation" | "projekt";
  seoTitle?: string;
  seoDescription?: string;
}

export interface NewArtwork {
  id: string;
  title: string;
  year: number | null;
  medium: string;
  dimensions: string;
  category: "relief" | "objekt" | "installation" | "projekt";
  images: string[];
  description: string;
  status: "available" | "sold" | "on-loan" | "not-for-sale";
  visible: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SiteOverride {
  version: number;
  artworks?: Record<string, ArtworkOverride>;
  newArtworks?: NewArtwork[];
  artworkSort?: "custom" | "year-desc" | "year-asc" | "alpha";
  artworkOrder?: string[];
  pages?: Partial<Record<keyof typeof siteConfig.pages, { enabled?: boolean }>>;
  events?: ArtEvent[];
  heroSlides?: Array<{ image: string; title: string; year: string }>;
  hero?: { tagline?: string; ctaText?: string; hideTagline?: boolean; hideCtaButton?: boolean };
  inquiryTypes?: string[];
  logoPath?: string;
  impressum?: Record<string, string>;
  design?: {
    colors?: { primary?: string; background?: string; foreground?: string };
    fontScale?: number;
  };
}

interface ConfigContextType {
  override: SiteOverride | null;
  isLoading: boolean;
  draftOverride: SiteOverride;
  setDraftOverride: (o: SiteOverride) => void;
  previewMode: boolean;
  setPreviewMode: (v: boolean) => void;
  effectiveOverride: SiteOverride;
  saveToServer: (data: SiteOverride) => Promise<boolean>;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

const EMPTY: SiteOverride = { version: 1 };

function applyDesignVars(design: SiteOverride["design"]) {
  if (!design?.colors) return;
  const root = document.documentElement;
  const { primary, background, foreground } = design.colors;
  if (primary)    root.style.setProperty("--primary", primary);
  if (background) root.style.setProperty("--background", background);
  if (foreground) root.style.setProperty("--foreground", foreground);
  if (design.fontScale) {
    root.style.setProperty("font-size", `${design.fontScale * 16}px`);
  }
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<SiteOverride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draftOverride, setDraftOverride] = useState<SiteOverride>(EMPTY);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetch("/site-override.json")
      .then((r) => {
        if (!r.ok) throw new Error("no override");
        return r.json() as Promise<SiteOverride>;
      })
      .then((data) => {
        setOverride(data);
        setDraftOverride(data);
        applyDesignVars(data.design);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const saveToServer = async (data: SiteOverride): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin.php?action=save_config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) {
        setOverride(data);
        applyDesignVars(data.design);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const effectiveOverride = previewMode ? draftOverride : (override ?? EMPTY);

  return (
    <ConfigContext.Provider
      value={{
        override,
        isLoading,
        draftOverride,
        setDraftOverride,
        previewMode,
        setPreviewMode,
        effectiveOverride,
        saveToServer,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
