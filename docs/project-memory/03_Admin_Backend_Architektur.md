---
title: Admin & Backend Architektur
updated: 2026-06-07
---

# 03 Admin & Backend Architektur

## Architektur-Überblick

```
React Frontend (Vite, Port 5173)
  ├── src/pages/Admin.tsx          ← Admin-Panel UI
  ├── src/contexts/ConfigContext.tsx ← SiteOverride Typ + useConfig Hook
  ├── src/lib/hooks.ts             ← useVisibleArtworks, useEffectiveEvents, etc.
  └── src/lib/artworks.ts          ← Statische Kunstwerk-Daten (Hauptdatei!)

Node.js API (Port 3001) — nur lokal
  └── server/api.mjs               ← Alle Admin-Aktionen

PHP Backend — nur Produktion
  └── public/api/admin.php         ← Gleiche Endpunkte wie Node.js

Runtime-Config
  └── public/site-override.json    ← Wird vom Admin geschrieben, von allen gelesen
```

## API-Endpunkte

| Action | Methode | Was es tut |
|---|---|---|
| `check` | GET | Login-Status prüfen |
| `get_config` | GET | site-override.json lesen |
| `save_config` | POST | site-override.json schreiben |
| `list_images?artwork_id=X` | GET | Bilder eines Werks auflisten |
| `upload_image` | POST multipart | Bild zu Werk hochladen |
| `delete_image` | POST | Bild in archiv/ verschieben |
| `upload_slider` | POST multipart | Hero-Slider Bild hochladen |
| `delete_slider` | POST | Slider-Bild in archiv/ verschieben |
| `upload_logo` | POST multipart | Logo hochladen → public/logo/ |

## SiteOverride Typ (ConfigContext.tsx)

```typescript
interface SiteOverride {
  artworks?: Record<string, ArtworkOverride>;  // Pro-Werk Overrides
  newArtworks?: NewArtwork[];                   // Im Admin erstellte Werke
  artworkSort?: "custom" | "year-desc" | "year-asc" | "alpha";
  artworkOrder?: string[];                      // Custom-Reihenfolge (IDs)
  heroSlides?: HeroSlide[];                     // Hero-Slider Bilder
  events?: ArtEvent[];                          // Ausstellungen
  inquiryTypes?: InquiryType[];                 // Kontaktformular Zwecke
  pages?: Record<string, { enabled: boolean }>; // Seitenvisibilität
  logoPath?: string;                            // Pfad zum Logo-Bild
  heroTaglineVisible?: boolean;                 // Tagline anzeigen
  heroCtaVisible?: boolean;                     // CTA-Button anzeigen
}
```

## Kritische Regel: Array-Fallback
```typescript
// FALSCH — leeres Array [] unterdrückt alle statischen Daten:
const events = effectiveOverride.events ?? staticEvents;

// RICHTIG:
const events = effectiveOverride.events?.length ? effectiveOverride.events : staticEvents;
```
Gilt für: events, heroSlides, newArtworks, inquiryTypes.

## Kritische Regel: Neues Config-Feld = 3 Stellen
1. **Typ**: Feld in `SiteOverride` interface eintragen
2. **Init**: Admin-State aus `effectiveOverride.feldName` initialisieren
3. **Speichern**: Bei Änderung via `autoSave({ ...draftOverride, feldName: value })`

## effectiveOverride Logik
```typescript
// previewMode = Admin zeigt Vorschau der nicht gespeicherten Änderungen
const effectiveOverride = previewMode ? draftOverride : (override ?? EMPTY);
```

## Bildverwaltung
- Bilder liegen in: `public/images/gallery/{artwork-id}/`
- Archiv: `public/images/gallery/{artwork-id}/archiv/` (nie löschen, nur verschieben)
- Slider-Bilder: `public/images/slider/`
- Logo: `public/logo/`
- Fokalpoint pro Bild: `o?.focalPoint ?? "center center"`

## hooks.ts — öffentliche Seite

```typescript
useVisibleArtworks()   // Kombiniert statische + neue Werke, sortiert via applySortMode()
useVisibleImages()     // Berücksichtigt hiddenImages, imageOrder, coverImage
useArtworkMeta()       // Merged statische Daten mit Admin-Overrides
useEffectiveEvents()   // Events aus Config oder statischen Daten (Array-Fallback!)
```

**Konsistenzregel:** Gleiche Logik muss in Admin.tsx UND hooks.ts identisch sein.
