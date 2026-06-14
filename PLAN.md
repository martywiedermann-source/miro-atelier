# Miro Atelier – Gesamtplan (aktualisiert 2026-06-07)

---

## Tier 1 — Pflicht vor Deploy

Alles hier muss erledigt und im Browser bestätigt sein, bevor `feature/admin-artwork-crud` in `main` gemergt wird.

---

### T1-A: Deployment-Sicherheit (Checkliste, keine Code-Änderung)

Vor jedem Merge/Deploy diese Reihenfolge einhalten — kein Schritt überspringen:

1. Alle Änderungen lokal fertig und im Browser geprüft
2. `npm run build` → muss fehlerfrei laufen
3. `git status --short` → keine ungewollten Dateien
4. `git diff --stat` → nur erwartete Änderungen
5. Logisch getrennte Commits (eine Aufgabe = ein Commit)
6. Erst dann Merge-Entscheidung treffen
7. Kein Deploy vom `feature/*`-Branch — nur `main` geht live via CI/CD

**Verboten:**
- `git push` ohne explizite Freigabe
- `./deploy.sh` ohne explizite Freigabe
- `git commit` ohne Aufforderung

---

### T1-B: Fokus-/Klick-Rahmen CI-konform stylen

**Problem:** Browser-Standard-Fokusrahmen (blau, eckig) erscheinen auf Buttons und Links — nicht CI-konform, wirkt unprofessionell.

**Analyse zuerst:**
- Woher kommen die blauen Rahmen? Browser-Default (`outline: 2px solid blue`) oder Tailwind-Reset?
- Sind es `focus` oder `focus-visible` States? (Unterschied: `focus` = immer sichtbar, `focus-visible` = nur bei Tastaturnavigation)
- Tailwind setzt standardmäßig `outline: none` auf `:focus` — was überschreibt das?

**Ziel:**
- Tastaturnutzung bleibt vollständig zugänglich (Barrierefreiheit nicht kaputt machen)
- Sichtbare Fokusanzeige nur bei Tastaturnavigation (`:focus-visible`)
- CI-konformer Fokus: goldener Rahmen (`ring-2 ring-amber-400`) statt Browsern-Standard-Blau

**Implementierung:**
```css
/* global in index.css */
:focus-visible {
  outline: 2px solid #b8960c; /* Gold aus CI */
  outline-offset: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
}
```
Oder via Tailwind-Plugin: `focusVisiblePlugin` mit `ring-amber-500`.

**Prüfen in:** Navbar-Links, Gallery-Buttons, Lightbox-Buttons, Contact-Form-Inputs, Hero-CTAs

**Verification:**
- [ ] Mit Tab durch Seite navigieren → goldener Fokusring sichtbar
- [ ] Mit Maus klicken → kein Fokusring
- [ ] `npm run build` läuft durch

---

### T1-C: Header/Navbar deploybereit

**Prüfliste (Code-Review + Browser):**

| Punkt | Was prüfen |
|---|---|
| Logo | Größe korrekt? Fallback-Text "ATELIER MIROSLAV" wenn Bild fehlt? `onError` aktiv? |
| Navigation Desktop | Alle Links vorhanden, korrekte Routen (`/works` statt `/gallery`) |
| Navigation Mobile | Hamburger-Menü öffnet/schließt? Alle Links klickbar? |
| Sprachumschalter | DE/EN-Umschalter vorbereitet? (Mehrsprachigkeit ist Zukunft, aber Platz dafür? |
| Aktiver Menüpunkt | `NavLink` mit `isActive` → Unterstreichung/Farbe korrekt? |
| Hover-Zustände | Alle Hover-States CI-konform (kein Browser-Default)? |
| Fokus-Zustände | → löst T1-B ab |
| Konsistenz | Navbar identisch auf /, /works, /about, /events, /contact? |

**Dateien:** `src/components/Navbar.tsx`, `src/App.tsx` (Routing)

**Verification:**
- [ ] Alle 5 Seiten im Browser aufgerufen
- [ ] Mobile (375px): Hamburger-Menü funktioniert
- [ ] Desktop (1280px): Logo + Nav + ggf. Sprachumschalter korrekt
- [ ] Kein Broken-Image, kein Layout-Bruch, keine Console-Fehler

---

### T1-D: Fremde Bilder aus Events entfernen

**Aktueller Zustand:** `EventCard` zeigt Platzhalter-/Fremdbilder via `event.image`

**Aufgaben:**
1. `src/lib/events.ts` prüfen: welche Bilder verlinkt sind
2. Falls keine echten Ausstellungsfotos → `event.image` aus Interface entfernen
3. `EventCard` auf reine Typographie umdesignen: Datum-Badge + Titel + Ort + Text
4. Datumformat auf Deutsch: `toLocaleString("de-DE", { month: "long" })`
5. Seitenüberschrift: `"Exhibitions & Events"` → `"Ausstellungen"`

**Verification:**
- [ ] Keine Fremdbilder
- [ ] Deutsch konsistent
- [ ] Build läuft durch

---

### T1-E: Fehlende Bilder (Morse Text + alle Werke)

**Morse Text:** `images: []`, `image: ""` → ArtworkCard rendert leere Karte

**Aufgaben:**
1. `ls public/images/gallery/morse-text/` — Bilder vorhanden?
2. Falls ja: Pfade in `artworks.ts` eintragen
3. Falls nein: Textbasierte SVG-Karte implementieren (Morse-Code-Visualisierung, kein Fremdbild)
4. Alle Werke auf fehlende Bildpfade prüfen: `grep '"image": ""' src/lib/artworks.ts`

**Verification:**
- [ ] Jedes Werk zeigt mindestens ein Bild
- [ ] Keine Console-404-Fehler

---

### T1-F: Performance — schnelle, risikoarme Optimierungen

**Analyse zuerst (kein Blindflug):**

| Prüfpunkt | Wie prüfen |
|---|---|
| Bildgrößen | `find public/images/gallery -name "*.jpg" -size +2M` — welche > 2MB? |
| Lazy Loading | `grep -r "loading=" src/` — fehlt es irgendwo? |
| Lightbox große Bilder | Lädt sie alle Bilder beim Öffnen oder erst beim Navigieren? |
| Thumbnails vorhanden? | `find public/images/gallery -name "*thumb*"` |
| WebP/AVIF | Kein Bild aktuell in WebP — alle Kamera-JPGs |

**Schnelle, risikoarme Maßnahmen (vor Deploy):**
1. `loading="lazy"` auf allen `<img>` Tags die noch fehlen
2. Lightbox: nur aktives Bild laden, Nachbarn preloaden
3. ArtworkCard: erste Bild eager, Rest lazy

**Aufwendige Optimierungen (nach Deploy, T2-B):**
- Sharp-Konvertierung zu WebP
- `srcset` mit Thumbnail-Varianten
- AVIF als zusätzliches Format

**Verification:**
- [ ] Network-Tab: keine unnötigen 3-5MB-Requests beim Seitenaufruf
- [ ] Galerie scrollbar ohne Ruckeln

---

### T1-G: Karussell-Höhensprung fixen

**Problem:** Hochformat nach Querformat-Bild = Karte springt in der Höhe

**Lösung: Erster-Bild-Lock**
```tsx
// Slide 0: setzt Container-Höhe
className={i === 0 ? "w-full h-auto object-cover" : "w-full h-full object-cover absolute inset-0"}
```
Container: `relative` für absolute Folge-Slides

**Datei:** `src/components/ArtworkCard.tsx`

**Verification:**
- [ ] Karte springt nicht beim Bild-Wechsel
- [ ] Mobile: Touch-Swipe funktioniert

---

### T1-H: `npm run build` sauber vor Merge

- Build ohne Fehler und ohne TypeScript-Warnings
- `dist/` lokal mit `npx serve dist` testen
- Alle Routen (`/`, `/works`, `/about`, `/events`, `/contact`) nach hartem Reload prüfen

---

## Tier 2 — Wichtig, nach Deploy umsetzbar

Diese Punkte verbessern die Website erheblich, blockieren aber den ersten Deploy nicht.

---

### T2-A: ArtworkCard Slider vollständig

- `watchDrag: false` entfernen → Touch-Swipe auf Mobile
- Dots immer sichtbar (nicht hover-only)
- Pfeile hover-only auf Desktop, immer sichtbar auf Mobile
- Lazy Loading für nicht-sichtbare Slides

**Datei:** `src/components/ArtworkCard.tsx`

---

### T2-B: Lightbox — Kollabierbare Sidebar

State `sidebarOpen` (default: `true` lg+, `false` mobile), Framer Motion Animation, `i`-Taste als Toggle.

**Datei:** `src/components/Lightbox.tsx`

---

### T2-C: Bildformat-Optimierung (WebP + srcset)

Nach Deploy, weil es Pfade in `artworks.ts` ändert:

```
public/images/gallery/gelber-schatten/
  _mg_3137.jpg          ← Original (bleibt)
  _mg_3137.webp         ← Full (Lightbox)
  _mg_3137-thumb.webp   ← Thumb (ArtworkCard)
```

npm-Script `images:optimize` mit `sharp` CLI. Dann `artworks.ts` Pfade auf `.webp` umstellen.

---

### T2-D: Galerie-Reihenfolge konfigurierbar machen

**Ziele:**
- Reihenfolge per Admin konfigurierbar (Drag-and-Drop bevorzugt, alternativ Hoch-/Runter-Buttons)
- Sortierung „Standard" nutzt Backend-Reihenfolge aus `artworks.ts` / `site-override.json`
- Manuelle Reihenfolge darf andere Sortierungen (Alphabet, Jahr) nicht zerstören — separate Felder
- Neue Werke: konfigurierbar oben oder unten einsortieren (Default: oben)
- `sortOrder?: number` Feld pro Artwork in `SiteOverride`

**Implementierung:**
- `artworks.ts` bekommt optionales `sortOrder` Feld
- Admin-Panel: Werk-Liste per Drag-and-Drop sortierbar (z.B. `@dnd-kit/sortable`)
- `autoSave()` schreibt Reihenfolge in `site-override.json`
- Gallery-Hook liest `sortOrder` und sortiert — ohne andere Sortiermodi zu beeinflussen

---

### T2-E: Bildverwaltung erweitern

| Feature | Aufwand | Priorität |
|---|---|---|
| Mehrere Bilder gleichzeitig hochladen | niedrig (`multiple` Attribut) | hoch |
| Bilder sortieren (Drag-and-Drop) | mittel | hoch |
| Hauptbild festlegen (Index 0) | niedrig | hoch |
| Bild ersetzen (Upload überschreibt) | mittel | mittel |
| Bild löschen (→ archiv/) | niedrig | mittel |
| Alt-Text bearbeiten | niedrig | mittel |
| Bildtitel/Beschreibung bearbeiten | niedrig | mittel |
| Cropping/Zuschnitt | hoch (externe Library) | niedrig |
| Fokuspunkt setzen (oben/mitte/unten) | mittel | niedrig |
| Anzeigegröße (klein/normal/groß/featured) | mittel | niedrig |

**Sofort umsetzbar (wenig Risiko):** `multiple` Attribut auf Upload-Input + Alt-Text-Feld

**Fokuspunkt-Implementierung (wenn gewünscht):**
- `focusPoint?: "top" | "center" | "bottom"` in Artwork-Typ
- CSS `object-position` entsprechend setzen

---

### T2-F: Kontaktseite backendfähig machen

**Aktuell:** Kontaktseite mit statischen Texten und hartkodierter E-Mail.

**Geplante Admin-Felder:**
- E-Mail-Adresse (aktuell: statisch)
- Telefonnummer
- Adresse (Straße, PLZ, Ort)
- Kontaktformular-Überschrift und Einleitungstext
- Anfragearten (Liste): Werkankauf, Ausstellungsanfrage, Presseanfrage, Sonstiges — editierbar, sortierbar, sichtbar/versteckt
- Datenschutztext und Datenschutz-Link
- Social-Media-Icons (Instagram, Website, etc.) im Footer oder auf Kontaktseite

**SiteOverride-Erweiterungen:**
```ts
contact?: {
  email?: string;
  phone?: string;
  address?: { street: string; zip: string; city: string; };
  introText?: string;
  inquiryTypes?: Array<{ label: string; value: string; visible: boolean; }>;
  privacyText?: string;
  privacyUrl?: string;
  socialLinks?: Array<{ platform: string; url: string; }>;
}
```

**Regel 2 beachten:** Alle 3 Stellen gleichzeitig (Typ + Init + Speichern)

---

### T2-G: Über-Seite backendfähig machen

**Geplante Admin-Felder:**
- Hero-/Header-Bild: austauschbar via Upload
- Portrait/Biografie-Bild: austauschbar via Upload
- Seitenüberschrift
- Unterüberschrift / Kurzbiografie
- Fließtexte (Vita-Abschnitte): bearbeitbar
- Abschnitte: sichtbar/versteckbar (z.B. Timeline, Kontakt-Block)
- Reihenfolge der Abschnitte: veränderbar

**SiteOverride-Erweiterungen:**
```ts
about?: {
  heroBannerPath?: string;
  portraitPath?: string;
  headline?: string;
  subHeadline?: string;
  bioText?: string;
  sections?: Array<{ id: string; visible: boolean; order: number; }>;
}
```

---

### T2-H: Ausstellungen-Seite backendfähig machen

**Aktueller Zustand prüfen:**
- Werden Events korrekt angezeigt? (Seite aufrufen, Console prüfen)
- Welche Inhalte fehlen aktuell (z.B. echte Ausstellungsdaten)?

**Geplante Admin-Felder:**
- Ausstellung hinzufügen / bearbeiten / löschen (→ archiv)
- Felder pro Ausstellung: Jahr, Titel, Ort, Beschreibung, Presse/Medienlink
- Bilder pro Ausstellung hochladbar
- Sichtbarkeit einzelner Ausstellungen
- Sortierung nach Jahr (automatisch) + manuelle Übersteuerung

**SiteOverride-Erweiterungen:**
```ts
// events ist bereits vorhanden — erweitern:
events?: Array<{
  id: string;
  year: number;
  title: string;
  location: string;
  description?: string;
  pressLink?: string;
  images?: string[];
  visible: boolean;
  sortOrder?: number;
}>
```

---

### T2-I: Backend-Vorschau verbessern

**Aktuell:** Vorschau-Button öffnet neuen Tab → zeigt gespeicherte `site-override.json`.

**Geplante Verbesserungen:**

| Feature | Beschreibung |
|---|---|
| Vorschau für Seitenänderungen | Vorschau-Tab öffnet exakte Seite (nicht nur /) |
| Vorschau für Werke | Direktlink auf `/works?highlight=[id]` |
| Vorschau für Bildgrößen/Zuschnitt | Vorschau-Modal direkt im Admin |
| Vorschau Sichtbarkeit | Preview-Mode zeigt auch versteckte Elemente markiert |
| Lokale Vorschau vor Speichern | Draft-Mode: Vorschau ohne `autoSave()` auszulösen |
| Entwurf vs. veröffentlicht | Klarer Hinweis im Admin: "Entwurf" vs. "Live" |

**Implementierung:**
- `previewMode` ist bereits in `ConfigContext` vorhanden
- Vorschau-URL als Parameter übergeben: `?preview=true&page=/about`
- Entwurf-Banner: gelber Balken wenn `previewMode === true`

---

### T2-J: Design — Mehr Künstler-Charakter

| Prio | Maßnahme | Datei | Aufwand |
|---|---|---|---|
| 1 | Portrait + About-Banner durch echte Fotos ersetzen | `About.tsx`, `Home.tsx` | gering |
| 2 | Hero: feinere Schrift-Gewichte | `Hero.tsx` | gering |
| 3 | Galerie-Karten: Titel immer sichtbar (kein Hover-Only) | `ArtworkCard.tsx` | mittel |
| 4 | About-Seite: Kontakt auf Deutsch | `About.tsx` | gering |
| 5 | Grain-Textur auf Hero-Section | `Hero.tsx`, `index.css` | gering |

---

## Tier 3 — Großes Zukunftsfeature

Diese Punkte sind strategisch wichtig, aber kein blocker — erst nach stabilem Deploy angehen.

---

### T3-A: Hell/Dunkel-Design

**Analyse:** Admin + Website separat betrachten.

| Kontext | Empfehlung | Risiko |
|---|---|---|
| Admin-Panel | Dark Mode sinnvoll (lange Nutzung, weniger Augenbelastung) | niedrig |
| Website (öffentlich) | Komplexer — Kunstbilder sind auf hellem Hintergrund optimiert | mittel |
| User-Umschalter auf Website | Nur wenn Website-Darkmode funktioniert | mittel |
| Default | CI-Hell bleibt Default (Kunstbilder, Lesbarkeit) | — |

**Risiken Website-Darkmode:**
- Kunstbilder sehen auf dunklem Hintergrund anders aus (schwer steuerbar)
- Texte auf Gold-Akzent bei dunkel: Kontrast prüfen (WCAG AA)
- CI-Konsistenz: Goldtöne funktionieren auf Hell und Dunkel unterschiedlich
- Empfehlung: Erst Admin, dann Website nur wenn Kunstbilder gut aussehen

**Implementierung (wenn beauftragt):**
- Tailwind `darkMode: 'class'` (manuell per Toggle, nicht OS-Präferenz)
- `ThemeProvider` in `App.tsx`, `localStorage` für Persistenz
- Separate Admin-Theme-Variable

---

### T3-B: Mehrsprachigkeit

DE/EN/ES/FR/AR/CS/ZH via `react-i18next`. Arabisch: RTL-Support (`dir="rtl"`).

Erst nach vollständigem deutschen Content.

---

### T3-C: n8n-Workflows

E-Mail-Trigger bei Deploy, Upload, Admin-Login. Lokal per Docker, Webhook in GitHub Actions.

---

### T3-D: Live-Tracking (DSGVO-konform)

Umami auf eigenem Server (Docker), kein Cookie-Banner nötig.

---

### T3-E: Bildserien-Hierarchie

3 Ebenen: Serie → Werk → Fotos. Neues Feld `series?: string` in Artwork-Typ.

---

### T3-F: Admin responsive

Unterschiedliche Ansichten für Mobile/Tablet/Desktop-Admin.

---

## Tier 4 — Als nächstes konkret umsetzen

**Empfohlene Reihenfolge für die nächste Session:**

```
1. T1-B  Fokus-Rahmen analysieren + CI-konform stylen
         → kleiner Eingriff, hohe Sichtbarkeit, Accessibility-konform
         → Datei: src/index.css (oder tailwind.config.js)

2. T1-C  Navbar/Header vollständig im Browser prüfen
         → Checkliste abarbeiten, ggf. kleine Korrekturen
         → Datei: src/components/Navbar.tsx

3. T1-G  Karussell-Höhensprung fixen
         → Datei: src/components/ArtworkCard.tsx

4. T1-D  Fremde Bilder aus Events entfernen
         → Datei: src/components/EventCard.tsx, src/lib/events.ts

5. T1-F  Lazy Loading überprüfen und ggf. ergänzen
         → Quick-Win, risikoarm

6. T1-H  npm run build → lokal testen → git status/diff prüfen
         → Pflicht vor Merge-Entscheidung
```

**Dann erst** Merge-Entscheidung (`feature/admin-artwork-crud` → `main`) und Deploy-Freigabe.

---

## Offene Entscheidungen (User-Input erforderlich)

| # | Frage | Kontext |
|---|---|---|
| E1 | Sprachumschalter im Header jetzt vorbereiten oder weglassen? | Mehrsprachigkeit ist T3, aber Platzhalter im Header jetzt? |
| E2 | Social-Media-Icons: Footer oder Kontaktseite? | T2-F |
| E3 | Dark Mode: erst Admin oder gleich beides planen? | T3-A |
| E4 | Drag-and-Drop für Galerie-Reihenfolge: `@dnd-kit` oder Hoch-/Runter-Buttons? | T2-D |
| E5 | `public/logo/logo-dark.png` (1.9MB): finales Logo oder Platzhalter? | Ggf. optimieren + committen |
| E6 | Portrait + About-Banner: echte Fotos bereits verfügbar auf ~/Desktop? | T2-J |
