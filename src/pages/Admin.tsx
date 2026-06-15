import { useState, useRef, useEffect, useCallback } from "react";
import { artworks } from "@/lib/artworks";
import { events as staticEvents, type ArtEvent } from "@/lib/events";
import { siteConfig } from "@/lib/siteConfig";
import { useConfig, type SiteOverride, type ArtworkOverride } from "@/contexts/ConfigContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ArtworkPlaceholder from "@/components/ArtworkPlaceholder";

// ── Auth error ────────────────────────────────────────────────────────────────

class AuthError extends Error { constructor() { super("auth"); } }

// ── API helpers ───────────────────────────────────────────────────────────────

async function api(
  action: string,
  body?: Record<string, string>,
  params?: Record<string, string>
): Promise<{ ok: boolean; [k: string]: unknown }> {
  const qs = params ? "&" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`/api/admin.php?action=${action}${qs}`, {
    method: body ? "POST" : "GET",
    credentials: "include",
    headers: body ? { "Content-Type": "application/x-www-form-urlencoded" } : undefined,
    body: body ? new URLSearchParams(body) : undefined,
  });
  if (res.status === 401) throw new AuthError();
  return res.json();
}

async function apiJson(action: string, data: unknown): Promise<{ ok: boolean; [k: string]: unknown }> {
  const res = await fetch(`/api/admin.php?action=${action}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new AuthError();
  return res.json();
}

async function apiUpload(action: string, form: FormData): Promise<{ ok: boolean; [k: string]: unknown }> {
  const res = await fetch(`/api/admin.php?action=${action}`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (res.status === 401) throw new AuthError();
  return res.json();
}

// ── Client-side file validation ───────────────────────────────────────────────

function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  const maxBytes = 10 * 1024 * 1024;
  if (!allowed.includes(file.type)) return "Nur JPG, PNG oder WEBP erlaubt";
  if (file.size > maxBytes) return `Datei zu groß (max 10 MB, diese Datei: ${(file.size / 1024 / 1024).toFixed(1)} MB)`;
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidDate(s: string) {
  if (!s || s.startsWith("XXXX")) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

const PAGE_LABELS: Record<string, string> = {
  works: "Werke",
  about: "Über",
  events: "Ausstellungen",
  contact: "Kontakt",
};

const EVENT_TYPES = ["solo", "group", "speaking"] as const;

const EMPTY_EVENT: Omit<ArtEvent, "id"> = {
  title: "", venue: "", city: "", country: "Deutschland",
  date: "", type: "solo", upcoming: true, visible: true, description: "",
};

const STATIC_HERO_SLIDES = [
  { image: "/images/gallery/gelber-schatten/_mg_3137.jpg", title: "Gelber Schatten", year: "2007" },
  { image: "/images/gallery/strudel/dsc00118.jpg",         title: "Strudel",          year: "2011" },
  { image: "/images/gallery/mahlwerk/bild0394.jpg",        title: "Mahlwerk",         year: "2009" },
  { image: "/images/gallery/entscheidung/dsc00534.jpg",    title: "Entscheidung",     year: "2012" },
  { image: "/images/gallery/ahnentafel/_mg_3558.jpg",      title: "Ahnentafel",       year: "2007" },
];

const IMPRESSUM_FIELDS: Array<{ key: string; label: string; defaultValue: string }> = [
  { key: "name",       label: "Name",         defaultValue: "Miroslav Wiedermann" },
  { key: "strasse",    label: "Straße",        defaultValue: "Berkaer Str. 19" },
  { key: "ort",        label: "PLZ / Ort",     defaultValue: "99837 Werra-Suhl-Tal" },
  { key: "telefon",    label: "Telefon",       defaultValue: "+49 175 5933703" },
  { key: "email",      label: "E-Mail",        defaultValue: "miro@ateliermiro.de" },
  { key: "beruf",      label: "Berufsbezeichnung", defaultValue: "Bildender Künstler (freischaffend seit 1994)." },
  { key: "steuer",     label: "Umsatzsteuer",  defaultValue: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung)." },
];

const ABOUT_FIELDS: Array<{ key: string; label: string; defaultValue: string }> = [
  { key: "label_kuenstler", label: "Label: Der Kuenstler",    defaultValue: "Der Künstler" },
  { key: "bio_p1",          label: "Biografie Absatz 1",      defaultValue: "Miroslav Wiedermann, geboren 1964 in Eger, studierte an der Werkkunstschule Flensburg. Seit 1994 arbeitet er freischaffend in Kunst und Architektur — mit konzeptionellen Messebauten für Cebit, Anuga und Musikmesse Frankfurt sowie Projekten für das Max Planck Institut in Jena und das Sultanat Oman." },
  { key: "bio_p2",          label: "Biografie Absatz 2",      defaultValue: "Sein Atelier befindet sich in Gelnhausen Hailer, wo er seit 2007 arbeitet. Parallel entstanden Projekte in Pilsen und Zlin (Tschechien) sowie Ausstellungen in Hessen und darüber hinaus." },
  { key: "label_kunst",     label: "Label: Zu meiner Kunst",  defaultValue: "Zu meiner Kunst" },
  { key: "kunst_p1",        label: "Kunststatement Absatz 1", defaultValue: "Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd. Ich organisiere meine Arbeiten als Objekte und Installationen." },
  { key: "kunst_p2",        label: "Kunststatement Absatz 2", defaultValue: "Mein Weg zum Filz führte mich vor etwa fünfzehn Jahren nach München, wo mich das Material in seiner Doppelnatur — weich und dennoch strukturstabil — faszinierte. Durch präzises Schneiden und Schichten entwickelte ich eine eigenständige Methode, die meine Arbeiten als echte Reliefs entstehen lässt: zwischen Malerei und Skulptur, veränderlich mit Licht und Betrachterperspektive." },
  { key: "label_kontakt",   label: "Label: Kontakt",          defaultValue: "Kontakt" },
  { key: "kontakt_adresse", label: "Kontakt Adresse",         defaultValue: "Berkaer Str. 19 · 99837 Werra-Suhl-Tal" },
  { key: "kontakt_telefon", label: "Kontakt Telefon",         defaultValue: "Tel. +49 175 5933703" },
  { key: "kontakt_email",   label: "Kontakt E-Mail",          defaultValue: "miro@ateliermiro.de" },
  { key: "zitat",           label: "Zitat (Pullout)",         defaultValue: "Allein der Gedanke, mich einordnen zu wollen, ist mir unendlich fremd." },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-4">
      {children}
    </h2>
  );
}

type Tab = "seiten" | "werke" | "ausstellungen" | "hero" | "impressum" | "über" | "design";

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api("login", { password: pw });
      if (res.ok) {
        onLogin();
      } else {
        setError("Falsches Passwort");
        setPw("");
      }
    } catch {
      setError("Verbindungsfehler — API erreichbar?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">Admin</p>
        <h1 className="font-display text-4xl font-light mb-10">Anmelden</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-wider">Passwort</Label>
            <Input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
              className="mt-1"
            />
          </div>
          {error && <p className="font-mono text-xs text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading || !pw}
            className="w-full font-mono text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:bg-gold-hover"
          >
            {loading ? "..." : "Einloggen"}
          </Button>
        </form>
        <p className="font-mono text-[10px] text-muted-foreground mt-8 text-center">
          ateliermiro.de / admin
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const Admin = () => {
  const { override, draftOverride, setDraftOverride, effectiveOverride, saveToServer } = useConfig();

  // Auth state
  const [authState, setAuthState] = useState<"loading" | "loggedOut" | "loggedIn">("loading");
  const [activeTab, setActiveTab] = useState<Tab>("werke");
  const [saving, setSaving] = useState(false);

  // Artwork state
  const [expandedArtwork, setExpandedArtwork] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const replaceRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [replacingImage, setReplacingImage] = useState<{ artworkId: string; src: string } | null>(null);
  const [syncingArtwork, setSyncingArtwork] = useState<string | null>(null);
  const dragFrom = useRef<{ artworkId: string; index: number } | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  // Event state
  const effectiveEvents: ArtEvent[] = effectiveOverride.events ?? staticEvents;
  const [editingEvent, setEditingEvent] = useState<ArtEvent | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [eventErrors, setEventErrors] = useState<Partial<Record<keyof ArtEvent, string>>>({});

  // Unsaved changes detection
  const hasUnsavedChanges = JSON.stringify(draftOverride) !== JSON.stringify(override ?? { version: 1 });

  // Session expiry handler
  const handleApiError = useCallback((e: unknown) => {
    if (e instanceof AuthError) {
      setAuthState("loggedOut");
      toast.error("Session abgelaufen – bitte neu anmelden");
    } else {
      toast.error("Verbindungsfehler");
    }
  }, []);

  // Auto-save: persist config immediately after destructive operations
  const autoSave = useCallback(async (next: SiteOverride) => {
    setDraftOverride(next);
    const saved = await saveToServer(next);
    if (!saved) toast.error("Gespeichert lokal, aber Server-Fehler – bitte manuell speichern");
  }, [saveToServer, setDraftOverride]);

  // Check auth on mount
  useEffect(() => {
    api("check").then((r) => {
      setAuthState(r.loggedIn ? "loggedIn" : "loggedOut");
    }).catch(() => setAuthState("loggedOut"));
  }, []);

  const handleLogout = async () => {
    await api("logout");
    setAuthState("loggedOut");
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveToServer(draftOverride);
    setSaving(false);
    if (ok) toast.success("Gespeichert");
    else toast.error("Fehler beim Speichern");
  };

  // ── Draft helpers ───────────────────────────────────────────────────────────

  function setPageEnabled(key: string, enabled: boolean) {
    setDraftOverride({ ...draftOverride, pages: { ...draftOverride.pages, [key]: { enabled } } });
  }

  function getPageEnabled(key: string): boolean {
    const o = draftOverride.pages?.[key as keyof typeof siteConfig.pages];
    if (o !== undefined) return !!o.enabled;
    return siteConfig.pages[key as keyof typeof siteConfig.pages].enabled;
  }

  function setArtworkVisible(id: string, visible: boolean) {
    setDraftOverride({
      ...draftOverride,
      artworks: { ...draftOverride.artworks, [id]: { ...draftOverride.artworks?.[id], visible } },
    });
  }

  function getArtworkVisible(id: string, staticVisible?: boolean): boolean {
    const o = draftOverride.artworks?.[id];
    if (o?.visible !== undefined) return o.visible;
    return staticVisible !== false;
  }

  function setImageHidden(artworkId: string, src: string, hidden: boolean) {
    const current = draftOverride.artworks?.[artworkId]?.hiddenImages ?? [];
    const next = hidden ? [...new Set([...current, src])] : current.filter((s) => s !== src);
    setDraftOverride({
      ...draftOverride,
      artworks: { ...draftOverride.artworks, [artworkId]: { ...draftOverride.artworks?.[artworkId], hiddenImages: next } },
    });
  }

  function isImageHidden(artworkId: string, src: string): boolean {
    return (draftOverride.artworks?.[artworkId]?.hiddenImages ?? []).includes(src);
  }

  function getImageOrder(artworkId: string, baseImages: string[]): string[] {
    const order = draftOverride.artworks?.[artworkId]?.imageOrder;
    if (!order) return baseImages;
    const reordered = order.filter((p) => baseImages.includes(p));
    const rest = baseImages.filter((p) => !reordered.includes(p));
    return [...reordered, ...rest];
  }

  function moveImage(artworkId: string, baseImages: string[], from: number, to: number) {
    const list = getImageOrder(artworkId, baseImages);
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setDraftOverride({
      ...draftOverride,
      artworks: { ...draftOverride.artworks, [artworkId]: { ...draftOverride.artworks?.[artworkId], imageOrder: next } },
    });
  }

  const handleImageUpload = useCallback(async (artworkId: string, file: File) => {
    if (!file) return;
    const validErr = validateImageFile(file);
    if (validErr) { toast.error(validErr); return; }
    setUploading(artworkId);
    const form = new FormData();
    form.append("artwork_id", artworkId);
    form.append("image", file);
    try {
      const res = await apiUpload("upload_image", form);
      if (res.ok && res.path) {
        const path = res.path as string;
        const artwork = artworks.find((a) => a.id === artworkId);
        const base = artwork?.images ?? [];
        const currentOrder = getImageOrder(artworkId, base);
        await autoSave({
          ...draftOverride,
          artworks: {
            ...draftOverride.artworks,
            [artworkId]: {
              ...draftOverride.artworks?.[artworkId],
              imageOrder: [...currentOrder, path],
            },
          },
        });
        toast.success("Bild hochgeladen und gespeichert");
      } else {
        toast.error((res.error as string) ?? "Upload fehlgeschlagen");
      }
    } catch (e) {
      handleApiError(e);
    } finally {
      setUploading(null);
    }
  }, [draftOverride, autoSave, handleApiError]);

  const handleImageDelete = useCallback(async (artworkId: string, src: string) => {
    const filename = src.split("/").pop() ?? "";
    if (!filename || !window.confirm(`Bild "${filename}" ins Archiv verschieben?`)) return;
    try {
      const res = await api("delete_image", { artwork_id: artworkId, filename });
      if (res.ok) {
        const artwork = artworks.find((a) => a.id === artworkId);
        const currentOrder = getImageOrder(artworkId, artwork?.images ?? []).filter((p) => p !== src);
        await autoSave({
          ...draftOverride,
          artworks: {
            ...draftOverride.artworks,
            [artworkId]: {
              ...draftOverride.artworks?.[artworkId],
              imageOrder: currentOrder,
              hiddenImages: (draftOverride.artworks?.[artworkId]?.hiddenImages ?? []).filter((h) => h !== src),
            },
          },
        });
        toast.success("Archiviert");
      } else {
        toast.error((res.error as string) ?? "Fehler");
      }
    } catch (e) {
      handleApiError(e);
    }
  }, [draftOverride, autoSave, handleApiError]);

  const handleImageReplace = useCallback(async (artworkId: string, oldSrc: string, file: File) => {
    const validErr = validateImageFile(file);
    if (validErr) { toast.error(validErr); return; }
    setUploading(artworkId);
    const form = new FormData();
    form.append("artwork_id", artworkId);
    form.append("image", file);
    try {
      const uploadRes = await apiUpload("upload_image", form);
      if (uploadRes.ok && uploadRes.path) {
        const newPath = uploadRes.path as string;
        const filename = oldSrc.split("/").pop() ?? "";
        if (filename) await api("delete_image", { artwork_id: artworkId, filename });
        const artwork = artworks.find((a) => a.id === artworkId);
        const currentOrder = getImageOrder(artworkId, artwork?.images ?? []);
        const newOrder = currentOrder.map((p) => p === oldSrc ? newPath : p);
        await autoSave({
          ...draftOverride,
          artworks: {
            ...draftOverride.artworks,
            [artworkId]: {
              ...draftOverride.artworks?.[artworkId],
              imageOrder: newOrder,
              hiddenImages: (draftOverride.artworks?.[artworkId]?.hiddenImages ?? []).filter((h) => h !== oldSrc),
            },
          },
        });
        toast.success("Bild ersetzt und gespeichert");
      } else {
        toast.error((uploadRes.error as string) ?? "Upload fehlgeschlagen");
      }
    } catch (e) {
      handleApiError(e);
    } finally {
      setUploading(null);
    }
  }, [draftOverride, autoSave, handleApiError]);

  // ── Events helpers ──────────────────────────────────────────────────────────

  function validateEvent(ev: Partial<ArtEvent>): boolean {
    const errs: Partial<Record<keyof ArtEvent, string>> = {};
    if (!ev.title?.trim())   errs.title   = "Pflichtfeld";
    if (!ev.venue?.trim())   errs.venue   = "Pflichtfeld";
    if (!ev.city?.trim())    errs.city    = "Pflichtfeld";
    if (!ev.country?.trim()) errs.country = "Pflichtfeld";
    if (!ev.date?.trim())    errs.date    = "Pflichtfeld";
    else if (!isValidDate(ev.date)) errs.date = "Format: JJJJ-MM-TT oder XXXX-01-01";
    setEventErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function saveEvent(ev: ArtEvent) {
    if (!validateEvent(ev)) return;
    const list = effectiveEvents.filter((e) => e.id !== ev.id);
    const updated = isNewEvent ? [...list, ev] : list.map((e) => (e.id === ev.id ? ev : e));
    setDraftOverride({ ...draftOverride, events: updated });
    setEditingEvent(null);
    setIsNewEvent(false);
    setEventErrors({});
  }

  function deleteEvent(id: string) {
    setDraftOverride({ ...draftOverride, events: effectiveEvents.filter((e) => e.id !== id) });
  }

  function startNewEvent() {
    setEditingEvent({ id: `event-${Date.now()}`, ...EMPTY_EVENT });
    setIsNewEvent(true);
    setEventErrors({});
  }

  // ── Hero helpers ────────────────────────────────────────────────────────────

  const heroSlides = draftOverride.heroSlides ?? STATIC_HERO_SLIDES;

  async function removeHeroSlide(i: number) {
    const slide = heroSlides[i];
    const next = heroSlides.filter((_, idx) => idx !== i);
    try {
      if (slide.image.startsWith('/images/slider/')) {
        const filename = slide.image.split('/').pop() ?? '';
        if (filename) await api("delete_slider", { filename });
      }
      await autoSave({ ...draftOverride, heroSlides: next });
      toast.success("Slide entfernt");
    } catch (e) {
      handleApiError(e);
    }
  }

  function moveHeroSlide(from: number, to: number) {
    const next = [...heroSlides];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setDraftOverride({ ...draftOverride, heroSlides: next });
  }

  const sliderUploadRef = useRef<HTMLInputElement>(null);
  const [sliderUploading, setSliderUploading] = useState(false);
  const sliderReplaceRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [sliderReplacing, setSliderReplacing] = useState<number | null>(null);

  async function handleSliderUpload(file: File) {
    const validErr = validateImageFile(file);
    if (validErr) { toast.error(validErr); return; }
    setSliderUploading(true);
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await apiUpload("upload_slider", form);
      if (res.ok && res.path) {
        const path = res.path as string;
        await autoSave({
          ...draftOverride,
          heroSlides: [...heroSlides, { image: path, title: "Neues Bild", year: "" }],
        });
        toast.success("Bild hinzugefügt und gespeichert");
      } else {
        toast.error((res.error as string) ?? "Upload fehlgeschlagen");
      }
    } catch (e) {
      handleApiError(e);
    } finally {
      setSliderUploading(false);
    }
  }

  async function handleSliderReplace(i: number, file: File) {
    const validErr = validateImageFile(file);
    if (validErr) { toast.error(validErr); return; }
    setSliderReplacing(i);
    const oldSlide = heroSlides[i];
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await apiUpload("upload_slider", form);
      if (res.ok && res.path) {
        const path = res.path as string;
        if (oldSlide.image.startsWith('/images/slider/')) {
          const filename = oldSlide.image.split('/').pop() ?? '';
          if (filename) await api("delete_slider", { filename });
        }
        const next = heroSlides.map((s, idx) => idx === i ? { ...s, image: path } : s);
        await autoSave({ ...draftOverride, heroSlides: next });
        toast.success("Bild ersetzt und gespeichert");
      } else {
        toast.error((res.error as string) ?? "Upload fehlgeschlagen");
      }
    } catch (e) {
      handleApiError(e);
    } finally {
      setSliderReplacing(null);
    }
  }

  function updateHeroSlide(i: number, field: "title" | "year", value: string) {
    const next = heroSlides.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setDraftOverride({ ...draftOverride, heroSlides: next });
  }

  // ── Artwork status helpers ──────────────────────────────────────────────────

  function getArtworkStatus(id: string): ArtworkOverride["status"] {
    const override = draftOverride.artworks?.[id];
    if (override?.status) return override.status;
    const art = artworks.find((a) => a.id === id);
    return (art?.status as ArtworkOverride["status"]) ?? "available";
  }

  function setArtworkStatus(id: string, status: ArtworkOverride["status"]) {
    setDraftOverride({
      ...draftOverride,
      artworks: { ...draftOverride.artworks, [id]: { ...draftOverride.artworks?.[id], status } },
    });
  }

  // ── Artwork metadata helpers ────────────────────────────────────────────────

  function getArtworkMetaField<K extends "titleOverride" | "yearOverride" | "dimensionsOverride" | "mediumOverride">(
    id: string, field: K, fallback: string
  ): string {
    const val = draftOverride.artworks?.[id]?.[field];
    return val != null ? String(val) : fallback;
  }

  function setArtworkMetaField(
    id: string,
    field: "titleOverride" | "yearOverride" | "dimensionsOverride" | "mediumOverride",
    value: string
  ) {
    const parsed = field === "yearOverride"
      ? (value === "" ? null : Number(value) || null)
      : value || undefined;
    const next: typeof draftOverride = {
      ...draftOverride,
      artworks: {
        ...draftOverride.artworks,
        [id]: { ...draftOverride.artworks?.[id], [field]: parsed },
      },
    };
    autoSave(next);
  }

  // ── Server image sync ───────────────────────────────────────────────────────

  async function syncServerImages(artworkId: string, currentOrder: string[]) {
    setSyncingArtwork(artworkId);
    try {
      const res = await api("list_images", undefined, { artwork_id: artworkId });
      if (!res.ok) { toast.error((res.error as string) ?? "Fehler"); return; }
      const serverImages = (res.images as string[]) ?? [];
      const newImages = serverImages.filter((p) => !currentOrder.includes(p));
      if (newImages.length === 0) {
        toast.success("Alles synchron – keine neuen Bilder auf Server");
        return;
      }
      await autoSave({
        ...draftOverride,
        artworks: {
          ...draftOverride.artworks,
          [artworkId]: {
            ...draftOverride.artworks?.[artworkId],
            imageOrder: [...currentOrder, ...newImages],
          },
        },
      });
      toast.success(`${newImages.length} neues Bild${newImages.length > 1 ? "er" : ""} vom Server hinzugefügt`);
    } catch (e) {
      handleApiError(e);
    } finally {
      setSyncingArtwork(null);
    }
  }

  // ── Impressum helpers ───────────────────────────────────────────────────────

  function getImpressumField(key: string, defaultValue: string): string {
    return draftOverride.impressum?.[key] ?? defaultValue;
  }

  function setImpressumField(key: string, value: string) {
    setDraftOverride({ ...draftOverride, impressum: { ...draftOverride.impressum, [key]: value } });
  }

  // ── About helpers ────────────────────────────────────────────────────────────

  function getAboutField(key: string, defaultValue: string): string {
    return draftOverride.about?.[key] ?? defaultValue;
  }

  function setAboutField(key: string, value: string) {
    setDraftOverride({ ...draftOverride, about: { ...draftOverride.about, [key]: value } });
  }

  // ── Design helpers ──────────────────────────────────────────────────────────

  function getColor(key: string, fallback: string): string {
    return draftOverride.design?.colors?.[key as keyof NonNullable<typeof draftOverride.design>["colors"]] ?? fallback;
  }

  function setColor(key: string, value: string) {
    setDraftOverride({
      ...draftOverride,
      design: { ...draftOverride.design, colors: { ...draftOverride.design?.colors, [key]: value } },
    });
    document.documentElement.style.setProperty(`--${key === "foreground" ? "foreground" : key === "background" ? "background" : "primary"}`, value);
  }

  // ── Render gates ────────────────────────────────────────────────────────────

  if (authState === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><span className="font-mono text-xs text-muted-foreground">...</span></div>;
  }

  if (authState === "loggedOut") {
    return <LoginScreen onLogin={() => setAuthState("loggedIn")} />;
  }

  const visibleCount = artworks.filter((a) => getArtworkVisible(a.id, a.visible)).length;

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: "werke",         label: "Werke" },
    { id: "hero",          label: "Hero" },
    { id: "seiten",        label: "Seiten" },
    { id: "ausstellungen", label: "Ausstellungen" },
    { id: "über",          label: "Über" },
    { id: "impressum",     label: "Impressum" },
    { id: "design",        label: "Design" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-1">ateliermiro.de</p>
            <h1 className="font-display text-4xl font-light">Admin Panel</h1>
            {hasUnsavedChanges && (
              <p className="font-mono text-[10px] text-amber-600 mt-1 uppercase tracking-wider">
                · Ungespeicherte Änderungen
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline" size="sm"
              onClick={() => window.open("/", "_blank")}
              className="font-mono text-xs uppercase tracking-[0.15em]"
            >
              Vorschau ↗
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="font-mono text-xs uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-gold-hover disabled:opacity-40"
            >
              {saving ? "Speichert..." : "Speichern"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}
              className="font-mono text-xs uppercase tracking-[0.15em]">
              Abmelden
            </Button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors ${
                activeTab === t.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── WERKE ──────────────────────────────────────────────────────── */}
        {activeTab === "werke" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Werke</SectionHeading>
              <span className="font-mono text-xs text-muted-foreground">
                {visibleCount} / {artworks.length} sichtbar
              </span>
            </div>
            <div className="space-y-1">
              {artworks.map((artwork) => {
                const visible = getArtworkVisible(artwork.id, artwork.visible);
                const isExpanded = expandedArtwork === artwork.id;
                const baseImages = artwork.images.length ? artwork.images : artwork.image ? [artwork.image] : [];
                const orderedImages = getImageOrder(artwork.id, baseImages);
                const totalImages = orderedImages.length;

                return (
                  <div key={artwork.id} className="border-b border-border/40">
                    <div className="flex items-center gap-3 py-2">
                      {orderedImages[0] ? (
                        <img src={orderedImages[0]} alt={artwork.title} className={`w-10 h-10 object-cover shrink-0 ${!visible ? "opacity-30 grayscale" : ""}`} />
                      ) : (
                        <ArtworkPlaceholder className="w-10 h-10 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-sm truncate ${!visible ? "line-through text-muted-foreground" : ""}`}>{artwork.title}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{artwork.year} · {totalImages} Bild{totalImages !== 1 ? "er" : ""}</p>
                      </div>
                      <button
                        onClick={() => setExpandedArtwork(isExpanded ? null : artwork.id)}
                        className="font-mono text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-wider px-2 py-1 border border-border/50 hover:border-foreground/30 transition-colors"
                      >
                        {isExpanded ? "▲" : "▼"}
                      </button>
                      <Switch checked={visible} onCheckedChange={(v) => setArtworkVisible(artwork.id, v)} />
                    </div>

                    {isExpanded && (
                      <div className="pb-4 pl-[52px] space-y-3">
                        {/* Replace input (shared per artwork) */}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          ref={(el) => { replaceRefs.current[artwork.id] = el; }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f && replacingImage?.artworkId === artwork.id) {
                              handleImageReplace(replacingImage.artworkId, replacingImage.src, f);
                            }
                            e.target.value = "";
                            setReplacingImage(null);
                          }}
                        />
                        {/* Image grid */}
                        <div className="flex flex-wrap gap-2">
                          {orderedImages.map((src, i) => {
                            const hidden = isImageHidden(artwork.id, src);
                            const dragKey = `${artwork.id}-${i}`;
                            const isDropTarget = dragOverKey === dragKey && dragFrom.current?.artworkId === artwork.id && dragFrom.current?.index !== i;
                            return (
                              <div
                                key={src}
                                className={`relative group/img flex flex-col items-center gap-1 transition-opacity ${isDropTarget ? "ring-2 ring-primary ring-offset-1" : ""}`}
                                draggable
                                onDragStart={() => { dragFrom.current = { artworkId: artwork.id, index: i }; }}
                                onDragOver={(e) => { e.preventDefault(); setDragOverKey(dragKey); }}
                                onDragLeave={() => setDragOverKey(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setDragOverKey(null);
                                  if (dragFrom.current?.artworkId === artwork.id && dragFrom.current.index !== i) {
                                    moveImage(artwork.id, baseImages, dragFrom.current.index, i);
                                  }
                                  dragFrom.current = null;
                                }}
                                onDragEnd={() => { dragFrom.current = null; setDragOverKey(null); }}
                              >
                                <div className="relative cursor-grab active:cursor-grabbing">
                                  <img
                                    src={src}
                                    alt={`${artwork.title} ${i + 1}`}
                                    className={`w-16 h-16 object-cover ${hidden ? "opacity-25 grayscale" : ""}`}
                                    draggable={false}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <button onClick={() => setImageHidden(artwork.id, src, !hidden)} className="text-white text-sm p-0.5" title={hidden ? "Zeigen" : "Ausblenden"}>
                                      {hidden ? "👁" : "🚫"}
                                    </button>
                                    <button onClick={() => { setReplacingImage({ artworkId: artwork.id, src }); replaceRefs.current[artwork.id]?.click(); }} className="text-white text-sm p-0.5" title="Ersetzen">
                                      🔄
                                    </button>
                                    <button onClick={() => handleImageDelete(artwork.id, src)} className="text-white text-sm p-0.5" title="Löschen">
                                      🗑
                                    </button>
                                  </div>
                                </div>
                                {/* Reorder arrows (Tastatur-Fallback) */}
                                <div className="flex gap-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                  <button onClick={() => moveImage(artwork.id, baseImages, i, i - 1)} disabled={i === 0} className="font-mono text-[9px] px-1 border border-border/50 disabled:opacity-20">←</button>
                                  <button onClick={() => moveImage(artwork.id, baseImages, i, i + 1)} disabled={i === orderedImages.length - 1} className="font-mono text-[9px] px-1 border border-border/50 disabled:opacity-20">→</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Upload button */}
                        {totalImages < 15 ? (
                          <>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              ref={(el) => { uploadRefs.current[artwork.id] = el; }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleImageUpload(artwork.id, f);
                                e.target.value = "";
                              }}
                            />
                            <Button
                              variant="outline" size="sm"
                              disabled={uploading === artwork.id}
                              onClick={() => uploadRefs.current[artwork.id]?.click()}
                              className="font-mono text-[10px] uppercase tracking-wider"
                            >
                              {uploading === artwork.id ? "Lädt hoch..." : "+ Bild hochladen"}
                            </Button>
                          </>
                        ) : (
                          <p className="font-mono text-[10px] text-muted-foreground">Maximum 15 Bilder erreicht</p>
                        )}

                        {/* Metadaten-Formular */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-14 shrink-0">Titel</span>
                            <input
                              type="text"
                              defaultValue={getArtworkMetaField(artwork.id, "titleOverride", artwork.title)}
                              key={`title-${artwork.id}`}
                              onBlur={(e) => setArtworkMetaField(artwork.id, "titleOverride", e.target.value)}
                              placeholder={artwork.title}
                              className="flex-1 font-mono text-[10px] border border-border/50 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-14 shrink-0">Jahr</span>
                            <input
                              type="number"
                              defaultValue={getArtworkMetaField(artwork.id, "yearOverride", String(artwork.year ?? ""))}
                              key={`year-${artwork.id}`}
                              onBlur={(e) => setArtworkMetaField(artwork.id, "yearOverride", e.target.value)}
                              placeholder={String(artwork.year ?? "")}
                              className="w-full font-mono text-[10px] border border-border/50 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-14 shrink-0">Maße</span>
                            <input
                              type="text"
                              defaultValue={getArtworkMetaField(artwork.id, "dimensionsOverride", artwork.dimensions)}
                              key={`dim-${artwork.id}`}
                              onBlur={(e) => setArtworkMetaField(artwork.id, "dimensionsOverride", e.target.value)}
                              placeholder={artwork.dimensions || "z.B. 165 × 125 cm"}
                              className="w-full font-mono text-[10px] border border-border/50 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground w-14 shrink-0">Technik</span>
                            <input
                              type="text"
                              defaultValue={getArtworkMetaField(artwork.id, "mediumOverride", artwork.medium)}
                              key={`med-${artwork.id}`}
                              onBlur={(e) => setArtworkMetaField(artwork.id, "mediumOverride", e.target.value)}
                              placeholder={artwork.medium || "z.B. Filz, Acryl"}
                              className="flex-1 font-mono text-[10px] border border-border/50 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>

                        {/* Artwork status + server sync */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/30">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status:</span>
                            <select
                              value={getArtworkStatus(artwork.id)}
                              onChange={(e) => setArtworkStatus(artwork.id, e.target.value as ArtworkOverride["status"])}
                              className="font-mono text-[10px] border border-border/50 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="available">Verfügbar</option>
                              <option value="sold">Verkauft</option>
                              <option value="on-loan">Verliehen</option>
                              <option value="not-for-sale">Nicht käuflich</option>
                            </select>
                          </div>
                          <button
                            onClick={() => syncServerImages(artwork.id, orderedImages)}
                            disabled={syncingArtwork === artwork.id}
                            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/50 px-2 py-1 hover:border-foreground/30 hover:text-foreground transition-colors disabled:opacity-40"
                            title="Server-Bilder prüfen und fehlende hinzufügen"
                          >
                            {syncingArtwork === artwork.id ? "Prüfe..." : "↻ Server-Sync"}
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          Ziehen zum Sortieren · Hover: 🚫 ausblenden · 🔄 ersetzen · 🗑 archivieren · ← → sortieren
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        {activeTab === "hero" && (
          <section>
            <SectionHeading>Hero-Slider</SectionHeading>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Diese Bilder erscheinen auf der Startseite im großen Slider.
            </p>
            <div className="space-y-3 mb-6">
              {heroSlides.map((slide, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-border/50">
                  <img src={slide.image} alt={slide.title} className="w-16 h-10 object-cover shrink-0" />
                  <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                    <Input
                      value={slide.title}
                      onChange={(e) => updateHeroSlide(i, "title", e.target.value)}
                      placeholder="Titel"
                      className="text-xs h-8"
                    />
                    <Input
                      value={slide.year}
                      onChange={(e) => updateHeroSlide(i, "year", e.target.value)}
                      placeholder="Jahr"
                      className="text-xs h-8"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    ref={(el) => { sliderReplaceRefs.current[i] = el; }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSliderReplace(i, f); e.target.value = ""; }}
                  />
                  <div className="flex gap-1">
                    <button onClick={() => moveHeroSlide(i, i - 1)} disabled={i === 0} className="font-mono text-xs px-2 py-1 border border-border/50 disabled:opacity-20">↑</button>
                    <button onClick={() => moveHeroSlide(i, i + 1)} disabled={i === heroSlides.length - 1} className="font-mono text-xs px-2 py-1 border border-border/50 disabled:opacity-20">↓</button>
                    <button onClick={() => sliderReplaceRefs.current[i]?.click()} disabled={sliderReplacing === i} className="font-mono text-xs px-2 py-1 border border-border/50 hover:bg-border/20 disabled:opacity-20" title="Ersetzen">🔄</button>
                    <button onClick={() => removeHeroSlide(i)} className="font-mono text-xs px-2 py-1 border border-border/50 text-destructive hover:bg-destructive/10">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                ref={sliderUploadRef}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSliderUpload(f); e.target.value = ""; }}
              />
              <Button
                variant="outline"
                disabled={sliderUploading}
                onClick={() => sliderUploadRef.current?.click()}
                className="font-mono text-xs uppercase tracking-wider"
              >
                {sliderUploading ? "Lädt hoch..." : "+ Neues Bild hochladen"}
              </Button>
            </div>

            <Separator className="my-6" />

            <SectionHeading>Texte auf der Startseite</SectionHeading>
            <p className="font-body text-sm text-muted-foreground mb-5">
              Diese Texte erscheinen über dem Hero-Slider.
            </p>
            <div className="space-y-4">
              <div>
                <Label className="font-mono text-[10px] uppercase tracking-wider">Tagline</Label>
                <Input
                  value={draftOverride.hero?.tagline ?? ""}
                  onChange={(e) => setDraftOverride({ ...draftOverride, hero: { ...draftOverride.hero, tagline: e.target.value } })}
                  placeholder="Künstler · Relief · Filz"
                  className="mt-1 text-sm"
                />
                <p className="font-mono text-[10px] text-muted-foreground mt-1">Standard: "Künstler · Relief · Filz"</p>
              </div>
              <div>
                <Label className="font-mono text-[10px] uppercase tracking-wider">Button-Text</Label>
                <Input
                  value={draftOverride.hero?.ctaText ?? ""}
                  onChange={(e) => setDraftOverride({ ...draftOverride, hero: { ...draftOverride.hero, ctaText: e.target.value } })}
                  placeholder="Zu den Arbeiten"
                  className="mt-1 text-sm"
                />
                <p className="font-mono text-[10px] text-muted-foreground mt-1">Standard: "Zu den Arbeiten"</p>
              </div>
            </div>
          </section>
        )}

        {/* ── SEITEN ─────────────────────────────────────────────────────── */}
        {activeTab === "seiten" && (
          <section>
            <SectionHeading>Seiten</SectionHeading>
            <div className="space-y-3">
              {Object.keys(PAGE_LABELS).map((key) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="font-body text-sm">{PAGE_LABELS[key]}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant={getPageEnabled(key) ? "default" : "secondary"} className="font-mono text-[10px] uppercase tracking-wider">
                      {getPageEnabled(key) ? "Aktiv" : "Aus"}
                    </Badge>
                    <Switch checked={getPageEnabled(key)} onCheckedChange={(v) => setPageEnabled(key, v)} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AUSSTELLUNGEN ──────────────────────────────────────────────── */}
        {activeTab === "ausstellungen" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Ausstellungen</SectionHeading>
              <Button variant="outline" size="sm" onClick={startNewEvent} className="font-mono text-xs uppercase tracking-[0.15em]">
                + Neu
              </Button>
            </div>
            {effectiveEvents.length === 0 && (
              <p className="font-body text-sm text-muted-foreground py-4">Keine Ausstellungen eingetragen.</p>
            )}
            <div className="space-y-2">
              {effectiveEvents.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between py-3 border-b border-border/40 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant={ev.upcoming ? "default" : "secondary"} className="font-mono text-[10px] uppercase tracking-wider shrink-0">
                        {ev.upcoming ? "Bevorstehend" : "Vergangen"}
                      </Badge>
                    </div>
                    <p className="font-body text-sm truncate">{ev.title}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{ev.venue} · {ev.city}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider"
                      onClick={() => { setEditingEvent({ ...ev }); setIsNewEvent(false); setEventErrors({}); }}>Bearb.</Button>
                    <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider text-destructive hover:bg-destructive/10"
                      onClick={() => deleteEvent(ev.id)}>Löschen</Button>
                  </div>
                </div>
              ))}
            </div>

            {editingEvent && (
              <div className="mt-6 p-5 border border-border bg-surface-warm">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-5">
                  {isNewEvent ? "Neue Ausstellung" : "Ausstellung bearbeiten"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Titel *</Label>
                    <Input value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} className={eventErrors.title ? "border-destructive" : ""} />
                    {eventErrors.title && <p className="font-mono text-[10px] text-destructive mt-1">{eventErrors.title}</p>}
                  </div>
                  <div>
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Galerie / Ort *</Label>
                    <Input value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} className={eventErrors.venue ? "border-destructive" : ""} />
                  </div>
                  <div>
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Stadt *</Label>
                    <Input value={editingEvent.city} onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })} className={eventErrors.city ? "border-destructive" : ""} />
                  </div>
                  <div>
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Land *</Label>
                    <Input value={editingEvent.country} onChange={(e) => setEditingEvent({ ...editingEvent, country: e.target.value })} />
                  </div>
                  <div>
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Datum *</Label>
                    <Input value={editingEvent.date} placeholder="2025-09-15 oder XXXX-01-01" onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} className={eventErrors.date ? "border-destructive" : ""} />
                    {eventErrors.date && <p className="font-mono text-[10px] text-destructive mt-1">{eventErrors.date}</p>}
                  </div>
                  <div>
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Typ</Label>
                    <select value={editingEvent.type} onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as ArtEvent["type"] })}
                      className="w-full h-10 px-3 font-body text-sm border border-input bg-background rounded-sm focus:outline-none focus:ring-1 focus:ring-primary">
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t === "solo" ? "Einzelausstellung" : t === "group" ? "Gruppenausstellung" : "Vortrag"}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Switch id="ev-upcoming" checked={editingEvent.upcoming} onCheckedChange={(v) => setEditingEvent({ ...editingEvent, upcoming: v })} />
                    <Label htmlFor="ev-upcoming" className="font-mono text-[10px] uppercase tracking-wider">Bevorstehend</Label>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="font-mono text-[10px] uppercase tracking-wider">Beschreibung</Label>
                    <Input value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <Button onClick={() => saveEvent(editingEvent)} className="font-mono text-xs uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-gold-hover">Speichern</Button>
                  <Button variant="outline" onClick={() => { setEditingEvent(null); setEventErrors({}); }} className="font-mono text-xs uppercase tracking-[0.15em]">Abbrechen</Button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── ÜBER ───────────────────────────────────────────────────────── */}
        {activeTab === "über" && (
          <section>
            <SectionHeading>Über-Seite</SectionHeading>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Diese Texte erscheinen auf der Über-Seite. Leer lassen = Standardtext wird verwendet.
            </p>
            <div className="space-y-4">
              {ABOUT_FIELDS.map((f) => (
                <div key={f.key}>
                  <Label className="font-mono text-[10px] uppercase tracking-wider">{f.label}</Label>
                  <Input
                    value={getAboutField(f.key, f.defaultValue)}
                    onChange={(e) => setAboutField(f.key, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── IMPRESSUM ──────────────────────────────────────────────────── */}
        {activeTab === "impressum" && (
          <section>
            <SectionHeading>Impressum</SectionHeading>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Diese Texte erscheinen auf der Impressum-Seite.
            </p>
            <div className="space-y-4">
              {IMPRESSUM_FIELDS.map((f) => (
                <div key={f.key}>
                  <Label className="font-mono text-[10px] uppercase tracking-wider">{f.label}</Label>
                  <Input
                    value={getImpressumField(f.key, f.defaultValue)}
                    onChange={(e) => setImpressumField(f.key, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── DESIGN ─────────────────────────────────────────────────────── */}
        {activeTab === "design" && (
          <section>
            <SectionHeading>Design</SectionHeading>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Farben werden sofort auf der Seite sichtbar. Mit "Speichern" werden sie dauerhaft.
            </p>

            <div className="space-y-5">
              {[
                { key: "primary",    label: "Primärfarbe (Gold)",         default: "#c4a882" },
                { key: "background", label: "Hintergrund (Warm-Weiß)",    default: "#faf8f5" },
                { key: "foreground", label: "Textfarbe (Dunkel)",          default: "#2c2a27" },
              ].map((c) => (
                <div key={c.key} className="flex items-center gap-4">
                  <input
                    type="color"
                    value={getColor(c.key, c.default)}
                    onChange={(e) => setColor(c.key, e.target.value)}
                    className="w-10 h-10 border border-border rounded cursor-pointer"
                  />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider">{c.label}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{getColor(c.key, c.default)}</p>
                  </div>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setColor(c.key, c.default)}
                    className="font-mono text-[10px] uppercase tracking-wider ml-auto"
                  >
                    Reset
                  </Button>
                </div>
              ))}

              <Separator />

              <div>
                <Label className="font-mono text-[10px] uppercase tracking-wider">
                  Schriftgröße: {Math.round((draftOverride.design?.fontScale ?? 1) * 100)}%
                </Label>
                <input
                  type="range"
                  min={80} max={120} step={5}
                  value={Math.round((draftOverride.design?.fontScale ?? 1) * 100)}
                  onChange={(e) => {
                    const scale = parseInt(e.target.value) / 100;
                    setDraftOverride({ ...draftOverride, design: { ...draftOverride.design, fontScale: scale } });
                    document.documentElement.style.setProperty("font-size", `${scale * 16}px`);
                  }}
                  className="w-full mt-2"
                />
                <p className="font-mono text-[10px] text-muted-foreground mt-1">80% – 120% der Standardgröße</p>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Admin;
