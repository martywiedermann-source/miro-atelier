# CLAUDE.md – Miro Atelier Projekt

## Projektinfo
- Künstler: Miroslav Wiedermann, Gelnhausen
- Website: ateliermiro.de
- Stack: React + Vite + Tailwind
- Hauptdatei: src/lib/artworks.ts

## Entwicklung starten

```bash
npm run dev
```

Startet **beide Server gleichzeitig**:
- Vite (Frontend): http://localhost:5173
- API-Server (Node.js): http://localhost:3001

**Admin-Panel:** http://localhost:5173/admin
**Vorschau Website:** http://localhost:5173

Nach Code-Änderungen:
```bash
npm run build
```

## Architektur

```
miro-atelier-main/
├── src/                      # React-Frontend
│   ├── pages/Admin.tsx       # Admin-Panel UI
│   ├── lib/artworks.ts       # Alle Kunstwerke (Hauptdatei!)
│   └── components/           # Navbar, Hero, Slider, Lightbox …
├── server/
│   └── api.mjs               # Node.js API-Server (Port 3001)
├── public/
│   ├── api/admin.php         # PHP-Backend für Produktion (ateliermiro.de)
│   ├── images/gallery/       # Alle Galeriebilder nach Werk-ID
│   ├── images/slider/        # Hero-Slider Bilder (hochgeladen via Admin)
│   └── site-override.json    # Admin-Konfiguration (wird vom API geschrieben)
└── DESIGN.md                 # Vollständige Design-Dokumentation
```

## API-Endpunkte (lokal → Node.js, Produktion → PHP)

| Action | Was es tut |
|---|---|
| `check` | Login-Status prüfen |
| `get_config` | site-override.json lesen |
| `save_config` | site-override.json schreiben |
| `list_images?artwork_id=X` | Bilder eines Werks auflisten |
| `upload_image` | Bild zu Werk hochladen |
| `delete_image` | Bild in archiv/ verschieben |
| `upload_slider` | Hero-Slider Bild hochladen |
| `delete_slider` | Slider-Bild in archiv/ verschieben |

## Deploy auf ateliermiro.de

1. `npm run build` → erzeugt `dist/`
2. FTP-Zugangsdaten in `deploy.sh` eintragen
3. `./deploy.sh` ausführen


## Git & Deployment – ABSOLUT VERBOTEN ohne explizite Freigabe

- **NIEMALS `git push` ausführen** – CI/CD läuft automatisch: push → GitHub Actions → FTP → live
- **NIEMALS `./deploy.sh` ausführen** – geht sofort auf ateliermiro.de live
- **NIEMALS `git commit` ohne Aufforderung**
- Vor jedem Push/Commit/Deploy: explizit fragen und Antwort abwarten
- Aktiver Entwicklungs-Branch: `feature/admin-artwork-crud`

## Terminals & Server

- **Dieses Terminal:** Datei-Arbeit, Tests, Builds
- **Dev-Server starten:** `npm run dev` im Hintergrund (oder separates Terminal)
  - Vite: http://localhost:5173 | API: http://localhost:3001
  - Admin lokal: http://localhost:5173/admin
- Port belegt? `lsof -ti:3001 | xargs kill` dann neu starten

## Sicherheit

- **NIEMALS FTP-Passwörter, SSH-Keys oder Credentials ausgeben/zeigen/loggen**
- FTP-Host: 94.130.144.142 | FTP-User: ateliermiromiro (Passwort nur in deploy.sh, nie anzeigen)

## /admin auf live-Site (ateliermiro.de)

- Route `/admin` ist auf Produktion **nicht erreichbar** (alter WebSite X5 Ordner `web/admin/` blockiert sie)
- Lokal funktioniert `/admin` problemlos
- Lösung steht noch aus: .htaccess anpassen oder alten Ordner umbenennen

## PFLICHTREGELN – IMMER EINHALTEN

### Vor jeder Aktion
- ERST analysieren und Liste zeigen
- DANN auf Bestätigung warten
- NIEMALS direkt loslegen ohne zu fragen

### Bilder
- NIEMALS Bilder löschen – nur in archiv/ verschieben
- IMMER höchste Auflösung bevorzugen
- Originale auf ~/Desktop NIEMALS anfassen – nur kopieren
- Private Personenfotos gehören NICHT in die Galerie
- wiedermann-archiv/ Bilder sind KEINE Kunstwerke

### Code
- Nach JEDER Änderung: npm run build ausführen
- Bei Build-Fehler: sofort stoppen und melden
- artworks.ts vor jeder Änderung komplett lesen
- Keine fremden Platzhalterbilder in der Website

### Duplikate
- Gleiche Werke = ein Ordner, eine artworks.ts Einträge
- Schlechtere Version → archiv/ Unterordner
- MD5 prüfen bevor etwas als Duplikat gilt

## Bereits erledigt – NICHT nochmal machen
- Navigation auf Deutsch umgestellt
- Impressum eingebaut
- Mahlwerk + Mahlwerk-1 zusammengeführt
- Entscheidung + Entscheidung-Gross zusammengeführt
- Alle Bilder von ateliermiro.de heruntergeladen
- Originalfotos von ~/Desktop kopiert
- Slider (Embla Carousel) in ArtworkCard eingebaut
- Lightbox mit Vollbild und Bildnavigation implementiert
- Ausstellungsseite: EventCard zeigt keine Fremdbilder mehr
- Morse Text: SVG-Visualisierung erstellt, Werk sichtbar in Galerie
- Design: alle englischen Texte auf Deutsch, /gallery-Link → /works gefixt
- Timeline: "15th International Biennial" → "15. Internationalen Biennale"
- dist gebaut (npm run build ✓)
- deploy.sh erstellt (curl-basiert, FTP-Zugangsdaten noch eintragen)
- Google Fonts lokal gehostet (Bodoni Moda, Abel, Cormorant Garamond, Outfit, Space Mono via @fontsource) – kein externer Request mehr
- Impressum-Adresse korrigiert (Brühlstraße 3, 63571 Gelnhausen) + Telefon korrigiert
- DSGVO-Hinweis mit Datenschutz-Link im Kontaktformular ergänzt

## Bekannte Werke und ihre Ordner
relief: gelber-schatten, falscher-schatten, ahnentafel, mahlwerk,
freier-fall, strudel, waagerechte, rote-blueten, mahnstufe-1,
zielgenau, bewegte-tiefe-1, bewegte-tiefe-2, herz, experiment,
herbst-mulde, insel, maulwurf, domino, drei-goetzen, morse-text
installation: paradigma
objekt: regalsystem-saly, garderobe, duftlaempchen, schmuckkaestchen, staffelei
projekt: rinder, mausefalle, sonnensegel, tueren, commode

## Entscheidung-Bunt und Entscheidung-Weiss
GETRENNTE Werke – niemals zusammenführen!

## Bereits erledigt (diese Session)
- Logo: "ATELIER / MIROSLAV" in Bodoni Moda im Header
- Hero: "Miroslav Wiedermann" entfernt, Kunstwerk steht im Vordergrund
- Hero: dunkler Gradient → Text immer lesbar auf jedem Bild
- Hero: Dots + Pfeile weiß (kein Gold mehr)
- Node.js API-Server gebaut (server/api.mjs) → Upload funktioniert lokal
- npm run dev startet jetzt API + Vite zusammen
- Admin-Panel CRUD: bestehende Werke editieren + neue Werke anlegen (Branch: feature/admin-artwork-crud)
- Admin-Panel Persistenz: save_config schreibt korrekt in public/site-override.json
- Admin-Panel Upload-Bug behoben: doppeltes Multer entfernt, JSON-Parsing getrennt

## Admin-Panel Status (feature/admin-artwork-crud)
- Bestehende Werke: Titel, Technik, Maße, Jahr, Kategorie, Beschreibung, SEO editierbar ✓
- Neue Werke anlegen: Formular komplett, speichert in newArtworks[] ✓
- Bildupload: funktioniert für bestehende + neue Werke ✓
- Persistenz nach Reload: funktioniert ✓ (getestet mit curl-Diagnose)
- Lokal testen: http://localhost:5173/admin (nach `npm run dev`)

## Qualitätsregeln – Fehlerklassen aus bisherigen Sessions

Diese Regeln basieren auf echten Bugs die aufgetreten sind. IMMER einhalten.

### Regel 1: Array-Fallback – `?.length` statt `??`

**FALSCH:**
```ts
const events = effectiveOverride.events ?? staticEvents;
```
**RICHTIG:**
```ts
const events = effectiveOverride.events?.length ? effectiveOverride.events : staticEvents;
```
**Warum:** `??` gibt den Fallback nur bei `null`/`undefined` zurück — nicht bei `[]`. Eine leere Config-Array (`[]`) unterdrückt so alle statischen Daten. Immer `?.length` verwenden wenn ein leeres Array als "nicht konfiguriert" gilt.

**Gilt für alle Arrays in `SiteOverride`:** events, heroSlides, newArtworks, inquiryTypes.

---

### Regel 2: Neue Config-Felder – 3 Stellen gleichzeitig

Wenn ein neues Admin-editierbares Feld eingebaut wird, IMMER alle 3 Stellen:

1. **Typ:** Feld in `SiteOverride` interface (ConfigContext.tsx) eintragen
2. **Init:** Admin-State aus `effectiveOverride.feldName` initialisieren (nicht hardcoded)
3. **Speichern:** Bei Änderung via `autoSave({ ...draftOverride, feldName: value })` persistieren

**Beispiel:** Logo-Pfad → erst `logoPath?: string` in SiteOverride, dann `useState(effectiveOverride.logoPath ?? "/logo/logo-dark.jpg")`, dann `autoSave({ ...draftOverride, logoPath: res.path })`.

Fehlt eine der 3 Stellen → Feld geht nach Reload verloren.

---

### Regel 3: Konsistenz zwischen Admin und Public-Site

Wenn eine Logik in `Admin.tsx` geändert wird, IMMER prüfen ob dieselbe Logik auch in `src/lib/hooks.ts` (für die öffentliche Seite) existiert. Beide müssen identisch sein.

**Konkret:** Admin und `useEffectiveEvents()` / `useVisibleArtworks()` müssen denselben Fallback-Mechanismus verwenden.

---

### Regel 4: Vorschau-Verhalten verstehen

- **VORSCHAU-Button** öffnet neuen Tab → sieht nur **gespeicherte** Config (site-override.json)
- **Code-Änderungen** (CSS, Komponenten) sind sofort im Dev-Server sichtbar
- **Config-Änderungen** sind erst nach "SPEICHERN" + VORSCHAU sichtbar
- Der VORSCHAU-Button speichert jetzt automatisch vor dem Öffnen

Beim Testen nach Config-Änderungen: erst "Speichern" bestätigen, dann Vorschau prüfen.

---

### Regel 5: Nach jeder Änderung an Config-Logik testen

Checkliste nach Änderungen an Admin-Panel oder hooks.ts:
- [ ] `npm run build` läuft ohne Fehler
- [ ] Lokale Dev-Site zeigt Änderung (http://localhost:5173)
- [ ] Admin gespeichert → VORSCHAU zeigt Änderung im neuen Tab
- [ ] Seite neu laden → Änderung bleibt (Persistenz)

---

### Regel 6: Jedes `<img>` braucht onError-Fallback

Jedes `<img>`-Tag mit dynamischem `src` (aus Config, Upload, User-Daten) MUSS einen `onError`-Handler haben:
- Entweder: `onError={() => setError(true)}` + bedingter Fallback-Render
- Oder: `onError={(e) => { e.currentTarget.src = '/fallback.jpg'; }}`

Kein dynamisches `<img>` ohne Fehlerbehandlung.

---

### Regel 7: "Fertig" bedeutet visuell verifiziert

Eine Aufgabe gilt erst als fertig, wenn:
1. `npm run build` ohne Fehler
2. Dev-Server läuft (`npm run dev`)
3. Die betroffene Seite im Browser geöffnet und geprüft
4. Kein Broken-Image, kein Layout-Bruch, keine Console-Fehler

Wenn kein Browser verfügbar (kein Playwright MCP): explizit schreiben **"Code-Änderung abgeschlossen — bitte im Browser prüfen"** statt "fertig".

---

### Regel 8: Playwright MCP für visuelle Verifikation nutzen

Wenn Playwright MCP installiert ist: nach jeder Frontend-Änderung Screenshot machen und prüfen bevor dem User "fertig" gemeldet wird. Playwright-MCP gibt vollständige Browser-Kontrolle: Screenshots, Interaktionen, Console-Logs.

Setup:
```bash
npx @playwright/mcp@latest
```

In `~/.claude.json` unter `mcpServers` eintragen (Server heißt "playwright").

## Offene Aufgaben
1. Admin-Panel lokal fertig testen (User testet gerade)
2. Branch feature/admin-artwork-crud → main mergen (erst nach User-Freigabe)
3. /admin auf Produktion freischalten (web/admin/ Konflikt lösen)
4. Hero-Slider: bessere Bilder wählen (via Admin → Hero-Tab)
5. Morse Text: echte Fotos aufnehmen → gallery/morse-text/
6. Mehrsprachigkeit (DE/EN/ES/FR/AR/CS/ZH) mit react-i18next
