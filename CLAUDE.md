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

## Offene Aufgaben
1. FTP-Zugangsdaten in deploy.sh eintragen → `./deploy.sh` ausführen
2. Hero-Slider: andere/bessere Bilder wählen (via Admin-Panel → Hero-Tab)
3. Morse Text: echte Fotos des Werks aufnehmen → gallery/morse-text/
4. Mehrsprachigkeit (DE/EN/ES/FR/AR/CS/ZH) mit react-i18next
