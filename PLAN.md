# Miro Atelier – Frontend Plan

## Phase 0: Discovery ✓ (abgeschlossen)

**Schlüsselfakten aus Code-Analyse:**

| Thema | Befund |
|---|---|
| Stack | React 18 + Vite + Tailwind + Embla ^8.6 + Framer Motion ^12.38 |
| Bildquelle | `artworks.ts` – dual fields: `images[]` (primär) + `image` (Fallback) |
| Galerie-Layout | CSS Columns Masonry (`columns-1 md:2 lg:3`) – variable Höhen gewollt |
| ArtworkCard | Embla Carousel vorhanden, `watchDrag: false`, Controls nur on-hover |
| Lightbox | Embla Carousel, `object-contain`, feste Sidebar `lg:w-72 xl:w-80` |
| Bildpfade | `/public/images/gallery/[artwork-id]/` – original Kamera-JPGs |
| Broken | `morse-text`: `images: []`, `image: ""` – kein Bild verknüpft |
| Events | `EventCard` zeigt `event.image` – Fremdbild-Platzhalter |

---

## Phase 1: Bildformat-Strategie (Fundament für alles andere)

**Das zentrale Problem – drei Ebenen:**

### 1a — Karussell-Höhensprung (UX-kritisch)

In `ArtworkCard.tsx` gilt: `w-full h-auto` → das erste Bild bestimmt die Kartenhöhe.
Wenn Bild 1 im Querformat ist und Bild 2 im Hochformat, springt die gesamte Karte beim Swipen.

**Lösung: Erster-Bild-Lock**
- Das erste Bild rendered sich natürlich (`h-auto`) und gibt der Karte ihre Höhe
- Alle weiteren Karussell-Slides bekommen `object-cover h-full` statt `h-auto`
- So bleibt die Kartenform stabil, kein Höhensprung

**Implementierung in `ArtworkCard.tsx`:**
```tsx
// Slide 0: natürliche Höhe (setzt Container-Höhe)
// Slide 1+: object-cover füllt diesen Container
className={i === 0
  ? "w-full h-auto object-cover"
  : "w-full h-full object-cover absolute inset-0"
}
```
→ Container: `relative` für die `absolute` Folge-Slides

### 1b — Dateigrößen (Performance-kritisch)

Kamera-JPGs unter `/public/images/gallery/` können 3–8 MB groß sein.
15 Bilder bei `gelber-schatten` × 3–5 MB = 45–75 MB für ein einziges Werk.

**Lösung: Build-Zeit-Optimierung**
- Neue npm-Script `images:optimize` mit `sharp` CLI
- Konvertierung zu WebP, max 1920px Breite, Qualität 82
- Thumbnail-Variante 800px für Karten-Ansicht

**Verzeichnis-Konvention nach Optimierung:**
```
public/images/gallery/gelber-schatten/
  _mg_3137.jpg          ← Original (bleibt, nie löschen)
  _mg_3137.webp         ← Full (Lightbox)
  _mg_3137-thumb.webp   ← Thumb (ArtworkCard)
```

**Änderung in `artworks.ts`:** `images[]` Pfade zeigen auf `.webp`

### 1c — Responsive `srcset` (Qualität auf großen Screens)

```tsx
<img
  src={src}                           // Fallback
  srcSet={`${toThumb(src)} 800w, ${src} 1920w`}
  sizes="(max-width: 768px) 100vw, 33vw"
  loading="lazy"
/>
```

**Verification:**
- [ ] `npm run build` läuft durch
- [ ] Network-Tab: WebP wird geladen
- [ ] Karte springt nicht beim Swipen
- [ ] Lightbox zeigt full-size WebP

---

## Phase 2: ArtworkCard – Slider vervollständigen

**Aktueller Zustand:**
- Embla Carousel existiert ✓
- `watchDrag: false` = kein Touch-Swipe auf Mobile ✗
- Controls erscheinen nur bei Hover = auf Mobile unsichtbar ✗
- Thumb-Bild aus Phase 1 noch nicht eingebaut

**Aufgaben (`src/components/ArtworkCard.tsx`):**

1. **Touch aktivieren:** `watchDrag: false` → entfernen (Embla-Default erlaubt Touch-Drag)
2. **Dot-Indikator immer sichtbar:** Bedingung `group-hover:` entfernen für Dots (nur prev/next-Pfeile bleiben hover-only)
3. **Thumb-Pfad:** `src={toThumb(src)}` statt direkter Pfad
4. **Lazy loading nur für sichtbare Slides:** Embla-Plugin `embla-carousel-lazy-load` oder native Intersection Observer

**Verification:**
- [ ] Auf Mobile: Wischen wechselt Bild
- [ ] Dots sichtbar ohne Hover
- [ ] Pfeile erscheinen nur bei Hover (Desktop) / immer (Mobile via Breakpoint)
- [ ] Embla-Events: `onSelect` → `setActiveIndex` synchron

---

## Phase 3: Lightbox – Fast-Vollbild

**Aktueller Zustand:**
- Sidebar `lg:w-72 xl:w-80` = 288–320px fest → Bildfläche verliert ~20% Breite
- Auf Mobile: Sidebar unter dem Bild = viel Scroll nötig

**Lösung: Kollabierbare Sidebar**

```
[Geöffnet]          [Info] ✕
┌─────────────────┬──────────┐
│                 │ Medium   │
│   BILD          │ Maße     │
│                 │ 1/7      │
│                 │ [Anfrage]│
└─────────────────┴──────────┘

[Kollabiert]        [ℹ] ✕
┌──────────────────────────┐
│                          │
│         BILD             │
│                          │
└──────────────────────────┘
```

**Implementierung:**
- State `sidebarOpen: boolean` (default: `true` auf lg+, `false` auf mobile)
- Framer Motion: `animate={{ width: sidebarOpen ? 320 : 0 }}`
- Toggle-Button: `ℹ` Icon oben rechts (neben `✕`)
- Keyboard: `i` toggelt Sidebar

**Aufgaben (`src/components/Lightbox.tsx`):**
1. `useState<boolean>` für `sidebarOpen`
2. `useEffect` → `sidebarOpen = window.innerWidth >= 1024` beim Mount
3. Framer Motion `<motion.div>` statt fester `div` für Sidebar
4. `overflow: hidden` auf Sidebar während Animation

**Verification:**
- [ ] Sidebar-Toggle-Button sichtbar
- [ ] Bild nutzt vollen Platz wenn Sidebar zu
- [ ] Animation ruckelt nicht
- [ ] Mobile: Sidebar default zu

---

## Phase 4: Events-Seite – Fremde Bilder entfernen

**Aktueller Zustand:**
- `EventCard` (non-compact): zeigt `event.image` mit `w-48 h-32 object-cover`
- Das sind Platzhalter-/Fremd-Bilder

**Aufgaben:**
1. `src/lib/events.ts` prüfen: welche Bilder verlinkt sind
2. Entscheidung: Bilder ersetzen **oder** Element komplett entfernen
3. Falls keine echten Ausstellungsfotos → `event.image` aus dem Interface entfernen und `EventCard` umdesignen auf reine Typographie (Datum-Badge + Text)
4. Datumformat auf Deutsch: `const month = date.toLocaleString("de", { month: "short" })` (Zeile 12)
5. Seitenüberschrift auf Deutsch: `"Exhibitions & Events"` → `"Ausstellungen"`

**Verification:**
- [ ] Keine Fremdbilder sichtbar
- [ ] Events-Seite sieht konsistent mit Rest aus
- [ ] Datumformat Deutsch

---

## Phase 5: Morse Text & fehlende Bilder

**Aktueller Zustand:**
`morse-text` in `artworks.ts`: `images: []`, `image: ""`
→ ArtworkCard rendert leere Karte

**Aufgaben:**
1. `ls public/images/gallery/morse-text/` — vorhanden?
2. Falls Bilder da: Pfade in `artworks.ts` eintragen
3. Falls keine Fotos: Textbasierte Karte implementieren — Morse-Code als SVG-Text-Overlay darstellen (visuell interessant, kein Fremdbild)
4. Alle anderen Werke auf fehlende/kaputte `image`-Pfade prüfen: `grep -r '"image": ""' src/lib/artworks.ts`

**Verification:**
- [ ] Jedes Werk zeigt mindestens ein Bild
- [ ] `npm run build` — keine 404s im Build
- [ ] Browser-Konsole zeigt keine Bild-404-Fehler

---

## Phase 6: Design – Mehr Künstler-Charakter

**Ziel:** Von "professionell minimal" → "authentisch künstlerisch"

**Konkrete Maßnahmen (priorisiert):**

| Prio | Maßnahme | Datei | Aufwand |
|---|---|---|---|
| 1 | Portrait + About-Banner ersetzen | `About.tsx`, `Home.tsx` | gering |
| 2 | Hero: Feinere Schrift-Gewichte | `Hero.tsx` | gering |
| 3 | Galerie-Karten: Titel immer sichtbar (kein Hover-Only) | `ArtworkCard.tsx` | mittel |
| 4 | About-Seite: Kontakt auf Deutsch | `About.tsx` | gering |
| 5 | Custom Cursor: Fadenkreuz in der Galerie | `Gallery.tsx` | mittel |
| 6 | Grain-Textur auf Hero-Section | `Hero.tsx`, `index.css` | gering |

**Portrait/Banner ersetzen:**
- `public/images/portrait.jpg` und `public/images/about-banner.jpg` sind Platzhalter
- Mit echten Fotos von Miroslav Wiedermann ersetzen (laut CLAUDE.md: Originale von ~/Desktop kopieren)

**Verification:**
- [ ] Keine Platzhalterbilder mehr
- [ ] Build läuft durch
- [ ] Visuell konsistent mit DESIGN.md Farbpalette

---

## Phase 7: Build & Deploy

**Voraussetzungen:** Alle Phasen 1–6 abgeschlossen, Build sauber.

**Aufgaben:**
1. `npm run build` → prüfen ob `dist/` korrekt
2. `dist/` lokal testen: `npx serve dist`
3. `.htaccess` für SPA-Routing (React Router) bereitstellen
4. FTP-Upload nach `ateliermiro.de`
5. DNS/Cache prüfen nach Upload

**`.htaccess` für SPA-Routing (muss mit hochgeladen werden):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Verification:**
- [ ] Alle Routen (`/works`, `/about`, `/events`) funktionieren nach hartem Reload
- [ ] Bilder laden korrekt (keine 404)
- [ ] Mobile getestet

---

## Reihenfolge (Empfehlung)

```
Phase 1a (Karussell-Fix) → Phase 2 (Slider) → Phase 3 (Lightbox)
         ↓
Phase 4 (Events) → Phase 5 (Morse Text)
         ↓
Phase 1b+c (Image Optimierung) → Phase 6 (Design) → Phase 7 (Deploy)
```

Phase 1a–3 zuerst: Diese fixen das sichtbarste UX-Problem.
Image-Optimierung (1b+c) kurz vor Deploy: braucht Script-Setup, macht Pfade in artworks.ts kaputt wenn zu früh.

---

## Offene Fragen vor Start

1. **Bildformat-Problem konkret:** Ist das Hauptproblem (a) Karussell-Höhensprung, (b) Dateigröße/Ladezeit, oder (c) etwas anderes?
2. **Portrait + About-Banner:** Gibt es bereits echte Fotos auf ~/Desktop?
3. **Workflow-Dokument:** Du hattest einen Workflow erwähnt – was ist darin?
4. **Events:** Gibt es Ausstellungsfotos die statt der Platzhalter rein sollen?
