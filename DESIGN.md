# DESIGN.md – Miro Atelier

Visuelles Referenzdokument. Gilt für alle Änderungen am Design.
Orientierung: Galerie-Ästhetik (Rubrecht Contemporary, Wiesbaden).

---

## CSS-Variablen (vollständig)

```css
:root {
  /* Hintergründe */
  --color-bg:           #F9F8F5;   /* Warmes Off-White — Seitenhintergrund */
  --color-bg-white:     #FFFFFF;   /* Reines Weiß — Header, Galerie-Einschübe */
  --color-surface-warm: #EDE9E2;   /* Beige — alternierende Sektionen */
  --color-dark:         #0D0D0D;   /* Fast Schwarz — CTA-Section, Footer */

  /* Text */
  --color-fg:           #1a1a1a;   /* Haupttext — Header-Logo */
  --color-fg-dark:      #0D0D0D;   /* Fließtext, Überschriften */
  --color-muted:        #6B6B6B;   /* Sekundärtext, Metadaten */
  --color-nav:          #333333;   /* Navigation Desktop */

  /* Akzent */
  --color-gold:         #C9A84C;   /* Gold — aktive Nav, Hover, Labels, Trennlinie */
  --color-gold-hover:   #A3862E;   /* Dunkleres Gold für Hover-Zustände */
  --color-gold-line:    rgba(201,168,76,0.4); /* 1px Header-Trennlinie */

  /* Rahmen */
  --color-border:       #E2DDD5;   /* Sehr helles Beige — Linien, Divider */

  /* Spacing-System (8px Basis) */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
}
```

---

## Farben

Definiert in `src/index.css` als CSS-Custom-Properties, eingebunden über `tailwind.config.ts`.

### Hauptfarben

| Token | HSL-Wert | Hex (ungefähr) | Bedeutung |
|---|---|---|---|
| `background` | `50 11% 97.6%` | `#F9F8F5` | Warmes Off-White — Seitenhintergrund |
| `foreground` | `0 0% 5.1%` | `#0D0D0D` | Fast Schwarz — Haupttext, Überschriften |
| `primary` | `43 52% 54%` | `#C4A44A` | **Gold** — Akzentfarbe, Buttons, Labels |
| `gold-hover` | `38 48% 44%` | `#A3862E` | Dunkleres Gold für Hover-Zustände |
| `surface-warm` | `36 19% 93.1%` | `#EDE9E2` | Warmes Hellbeige — Abschnitte (jede zweite Section) |
| `dark-contrast` | `0 0% 5.1%` | `#0D0D0D` | Fast Schwarz — dunkle CTA-Section am Seitenende |
| `dark-contrast-foreground` | `36 19% 93.1%` | `#EDE9E2` | Text auf dunklem Hintergrund |
| `muted-foreground` | `0 0% 42%` | `#6B6B6B` | Mittleres Grau — Fließtext, Metadaten |
| `border` | `36 14% 88%` | `#E2DDD5` | Sehr helles Beige — Linien, Trennstriche |
| `secondary` | `36 19% 93.1%` | `#EDE9E2` | Identisch mit surface-warm |

### Farbprinzip

- **Kein Dunkel-Modus** — nur Light Mode ist umgesetzt
- Kontrast-Hierarchie: `foreground` → `muted-foreground` → `border`
- Gold (`primary`) sparsam einsetzen: nur für Labels, aktive Zustände, Hover und den Akzentpunkt eines Buttons
- Wechsel zwischen `background` (weiß) und `surface-warm` (beige) erzeugt Sektionsrhythmus ohne harte Trennlinien

---

## Fonts

Eingebunden über Google Fonts, konfiguriert in `tailwind.config.ts`.

### Typografie-Hierarchie (4 Ebenen)

| Rolle | Font | Tailwind | Einsatz |
|---|---|---|---|
| **Logo + Große Titel** | Bodoni Moda | `font-bodoni` | Logo MW, Hero-Name, künstlerische Akzente |
| **Überschriften / Display** | Cormorant Garamond | `font-display` | Sektionsüberschriften, Zitate, Kunstwerktitel |
| **Fließtext / UI** | Outfit | `font-body` | Body-Text, Formulare, Beschreibungen |
| **Labels / Metadaten** | Space Mono | `font-mono` | Kategorien, Jahreszahlen, Buttons, Navigation |
| **Galerie-Einschübe** | Abel | `font-abel` | Rubrecht-Sektion, externe redaktionelle Texte |

**Prinzip:** Bodoni = Identität & Wirkung · Cormorant = Eleganz & Text · Space Mono = Präzision & Kontrast

---

### font-bodoni — Bodoni Moda *(Logo & Große Titel)*

```css
font-family: "Bodoni Moda", Didot, "Bodoni 72", Georgia, serif;
```

- **Charakter:** Hoher Kontrast zwischen dünnen und dicken Linien, feine Serifen, klassisch-galerieartig. Didot/Bodoni-Stil.
- **Einsatz:** Logo `MW` im Header, Hero-Überschrift `Miroslav Wiedermann`, große künstlerische Akzente
- **Gewicht:** `font-normal` (400) — der Bodoni-Kontrast wirkt bereits ohne Bold
- **Nicht für:** Fließtext, kleine Navigationstexte (feine Linien werden unlesbar < 14px)
- **Orientierung:** Klassische Kunstgalerien, Mode-Magazine (Vogue nutzt Didot), Hochpreisige Brands

### font-display — Cormorant Garamond

```css
font-family: "Cormorant Garamond", Georgia, serif;
```

- **Einsatz:** Alle Überschriften (h1–h6), Kunstwerktitel, Zitate, Jahreszahlen in der Lightbox
- **Gewicht:** meist `font-light` (300) — bewusst dünn und elegant
- **Charakter:** Klassisch-historisch, edel, viel Weißraum im Schriftbild
- Beispiel: Seitentitel `text-5xl md:text-7xl font-light`

### font-body — Outfit

```css
font-family: "Outfit", system-ui, sans-serif;
```

- **Einsatz:** Fließtext, Formulare, allgemeiner Body-Text
- **Charakter:** Klare, moderne Grotesque — bildet Gegenpol zu Cormorant
- Beispiel: Biobeschreibungen, Formularfelder

### font-mono — Space Mono

```css
font-family: "Space Mono", monospace;
```

- **Einsatz:** Kategorie-Labels, Jahresangaben, Abschnittsmarker, Buttons, Navigationslinks
- **Darstellung:** Immer Großbuchstaben (`uppercase`) mit weitem Letter-Spacing (`tracking-[0.2em]` bis `tracking-[0.4em]`)
- **Charakter:** Technisch-präzise, schafft Kontrast zu den serifenlosen und Serif-Fonts
- Beispiel: `RELIEF · 2007`, `VIEW ALL WORKS`, Filter-Buttons

### Größenreferenz

| Kontext | Klassen |
|---|---|
| Hero-Name | `text-[10vw] md:text-[7vw] lg:text-[5vw] font-light` |
| Seitentitel | `text-5xl md:text-7xl font-light` |
| Sektionsüberschrift | `text-4xl md:text-6xl font-light` |
| Kachel-Titel | `text-2xl` (ArtworkCard), `text-xl` (klein) |
| Kategorie-Label | `text-xs uppercase tracking-[0.2em–0.4em]` |
| Fließtext | `text-sm` oder `text-base`, `leading-relaxed` |

---

## Navigation

### Aufbau

```
[Logo links]                    [Werke · Über · Ausstellungen · Kontakt rechts]
                                                          [☰ auf Mobile]
```

- Datei: `src/components/Navbar.tsx`
- Höhe: `h-20` (80 px)
- Position: `fixed top-0` — immer sichtbar, über allem

### Verhalten

| Zustand | Hintergrund | Border |
|---|---|---|
| Seite oben (scrollY ≤ 50) | `transparent` | `transparent` |
| Gescrollt (scrollY > 50) | `bg-background/92 backdrop-blur-xl` | `border-primary/20` |
| Scrollt nach unten (> 100px) | versteckt (`y: -100`) | — |
| Scrollt nach oben | eingeblendet (`y: 0`) | — |

Die Transition ist 300 ms mit `easeOut`.

### Aktiver Link

Ein goldener Unterstrich (`h-px bg-primary`) mit `layoutId="nav-indicator"` gleitet animiert unter den aktiven Navigationspunkt.

### Mobile Overlay

Beim Hamburger-Klick öffnet sich ein Fullscreen-Overlay (`fixed inset-0 bg-background`). Die Links erscheinen zentriert als `font-display text-4xl`, mit Stagger-Animation (je 100 ms Verzögerung). Schließt sich bei Seitenwechsel automatisch.

### Links (Reihenfolge)

```
Werke         → /works
Über          → /about
Ausstellungen → /events
Kontakt       → /contact
```

Impressum ist **nicht** in der Hauptnavigation — nur in Footer und Impressum-Seite.

---

## Galerie

### Werke-Seite (`/works`)

**Filter-Bar**

Pill-Buttons in `font-mono text-xs uppercase`:
```
Alle Arbeiten  |  Relief  |  Objekt  |  Installation  |  Projekte
```
Aktiver Filter: `bg-primary text-primary-foreground border-primary`
Inaktiv: `border-border text-muted-foreground`

**Layout**

CSS Columns (`columns-1 md:columns-2 lg:columns-3`) — Masonry-ähnlich ohne JS.
Jede Karte hat `break-inside-avoid`.

**ArtworkCard**

- Zeigt das erste Bild (`artwork.images[0]`)
- Bei mehreren Bildern: Embla-Carousel eingebaut
- Auf Hover: prev/next Pfeile (‹/›) und Dot-Indikatoren erscheinen
- Hover-Overlay: `bg-foreground/50` mit Titel + Jahres-/Medium-Label
- Kein festes Seitenverhältnis — Bild bestimmt die Höhe (original proportional)

**Datenbasis:** `src/lib/artworks.ts` — einzige Quelle der Wahrheit

### Lightbox

Öffnet sich beim Klick auf eine Karte. Bedeckt den gesamten Bildschirm.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Kategorie]  [Titel]  [Jahr]                          [✕]      │
├──────────────────────────────────────────┬──────────────────────┤
│                                          │  Medium              │
│   [‹]     Bild (zentriert, max groß)  [›]│  Maße               │
│                                          │  1 / 7              │
│              ● ● ○ ○ ○ ○ ○               │                      │
│                             [←] 3/38 [→] │  [Anfrage]           │
└──────────────────────────────────────────┴──────────────────────┘
```

- **Bild-Navigation** (‹/›): Blättert durch `artwork.images[]` des aktuellen Werks
- **Werk-Navigation** (←/→ unten rechts): Wechselt das gesamte Kunstwerk
- **Dots:** Zeigen Position im Bildsatz, klickbar
- **Keyboard:** `Esc` schließt, `←/→` navigiert durch Bilder
- Sidebar rechts: `lg:w-72 xl:w-80`, enthält Medium, Maße, Bildzähler, Anfrage-Button
- Hintergrund: `bg-background/97 backdrop-blur-sm` — nicht komplett opak

### Dateistruktur

```
public/images/gallery/
  [artwork-id]/
    bild0001.jpg   ← alle Fotos eines Werks
    bild0002.jpg
    ...
```

Bildpfade in `artworks.ts` immer relativ zu `public/`: `/images/gallery/…`

---

## Startseite — Beschreibung

### Section 1 — Hero (Vollbild)

Crossfade-Slider über 5 Kunstwerke:
- Gelber Schatten (2007)
- Strudel (2011)
- Mahlwerk (2009)
- Entscheidung (2012)
- Ahnentafel (2007)

Über den Bildern, vertikal zentriert:
```
                    KÜNSTLER · RELIEF · FILZ
                                             ← Goldfarben, Mono, spacing
                  Miroslav Wiedermann
                                             ← Cormorant, sehr groß, light

                  [ Zu den Arbeiten ]        ← Border-Button
```

Unten links: aktueller Werktitel + Jahreszahl (bei jedem Slide-Wechsel)
Dots zur manuellen Navigation unten mittig.

### Section 2 — Philosophie (Beige Hintergrund)

Zentriert, viel Whitespace:

```
                        PHILOSOPHY

    »Allein der Gedanke, mich einordnen zu wollen,
             ist mir unendlich fremd.«

                    ─────────────
```

Schrift: `font-display text-4xl–7xl italic font-light`
Trennlinie: `.gold-line` (16 px breit, gold, zentriert)

### Section 3 — Selected Works (Weiß)

Links oben: `01 — SELECTED WORKS`   Rechts: `View All →`

Asymmetrisches 2-Spalten-Grid:
```
┌───────────────────┬──────────────┐
│                   │   Mahlwerk   │
│  Gelber Schatten  ├──────────────┤
│  (hoch, 3:4)      │   Strudel    │
└───────────────────┴──────────────┘
```

Links: großes Bild mit `md:row-span-2`, Seitenverhältnis `aspect-[3/4]`
Rechts: zwei Bilder `aspect-[4/3]` übereinander

Darunter: zentrierter `[ View All Works ]` Border-Button

### Section 4 — Über (Beige Hintergrund)

2-Spalten-Grid:
```
┌─────────────────┬────────────────────────────────┐
│                 │  DER KÜNSTLER                  │
│  Portrait-Foto  │                                │
│  (aspect 3:4)   │  Bio-Text…                     │
│                 │                                │
│                 │  [ Zur Vita ]                  │
└─────────────────┴────────────────────────────────┘
```

### Section 5 — Upcoming (Weiß)

`02 — UPCOMING`

Für jeden kommenden Event:
```
15          Ausstellungstitel
SEP         Galerie · Stadt, Land
2025        Beschreibungstext (2 Zeilen)
────────────────────────────────────────────────────
```

Darunter: `[ All Exhibitions ]` Border-Button

### Section 6 — Kontakt-CTA (Dunkler Hintergrund)

```
         Interesse an einer Arbeit?

  [ Anfrage stellen ]   [ Alle Arbeiten ]
```

Hintergrund: `bg-dark-contrast` (fast Schwarz)
Text: `text-dark-contrast-foreground` (warmes Hellbeige)
Buttons: Border-Stil, goldener Hover

---

## Komponenten-Regeln

### Header / Navbar (`src/components/Navbar.tsx`)

| Eigenschaft | Wert |
|---|---|
| Hintergrund | `#FFFFFF` — immer weiß, kein Transparent-Effekt beim Scrollen |
| Höhe | `76px` |
| Position | `fixed top-0`, `z-50` |
| Unterkante | `1px solid rgba(201,168,76,0.4)` — Gold-Linie, halbtransparent |
| Schatten | keiner |
| Scroll-Verhalten | Auto-Hide nach 100px Scroll nach unten, Einblenden bei Scroll nach oben |
| Einblend-Animation | `opacity: 0→1, y: -12→0`, 0.4s easeOut (Framer Motion) |

**Logo (links):**
- `MW` — Georgia serif, 30px, `#1a1a1a`, letter-spacing `-0.02em`
- `WIEDERMANN` — Georgia serif, 8px, uppercase, `#1a1a1a`, letter-spacing `0.32em`

**Navigation (rechts, Desktop):**
- Font: Georgia serif, 11px, `uppercase`, letter-spacing `0.2em`
- Farbe: `#333333` normal / `#C9A84C` aktiv + Hover
- Aktiver Link: Gold-Unterstrich (`layoutId="nav-indicator"`)

**Sprachschalter (ganz rechts):**
- `DE | EN` — Georgia, 10px, uppercase
- DE aktiv: `#C9A84C` — EN inaktiv: `#999`
- Trenner: `|` in `rgba(201,168,76,0.4)`
- Linke Grenze: `1px solid rgba(201,168,76,0.35)`

**Mobile Overlay:**
- Vollbild weiß, Links zentriert, Georgia serif
- Aktiver Link Gold, Hover Gold
- Stagger-Animation: 70ms Verzögerung je Link

---

### Buttons

| Typ | Stil |
|---|---|
| Primary | `bg-[#C9A84C] text-white`, px-10 py-4, kein Radius |
| Secondary | `border border-[#333]/30`, hover → Primary |
| Ghost | nur Unterstrich oder Text in Gold |

---

### Animations-Prinzipien

- **Easing:** immer `easeOut` für Einblenden, `easeIn` für Ausblenden
- **Dauer:** micro `150ms` / kurz `300–400ms` / mittel `500–800ms`
- **Einblenden:** `opacity+y (20–30px)` via `whileInView`, `once: true`
- **Stagger:** 70–100ms je Element in Listen/Grids
- **Keine ruckeligen Transforms** — immer mit `will-change` oder GPU-optimiert

---

## Gestaltungsprinzipien

1. **Galerie-Ästhetik** — Orientierung an professionellen Kunstgalerien (Rubrecht Contemporary): Reduktion, Weiß, präzise Typografie
2. **Viel Whitespace** — Sektionen `py-24 md:py-40`, Abstände großzügig
3. **Keine runden Ecken** — `border-radius: 0` — alles kantig und präzise
4. **Gold sparsam** — Gold erscheint als Linie, Punkt oder aktiver Zustand — nie als Fläche
5. **Typografie-Kontrast** — Georgia/Cormorant (Serif) gegen Space Mono (Mono) ist der visuelle Kern
6. **Beige/Weiß/Weiß im Wechsel** — Header immer Weiß, Sektionsrhythmus durch `bg-white` ↔ `bg-[#EDE9E2]`
7. **Animationen dezent** — nie auf Kosten der Lesbarkeit
8. **Kein Dark Mode** — warme helle Palette ist bewusst und bleibt so
