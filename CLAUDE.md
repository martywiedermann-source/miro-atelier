# CLAUDE.md – Miro Atelier Projekt

## Projektinfo
- Künstler: Miroslav Wiedermann, Gelnhausen
- Website: ateliermiro.de
- Stack: React + Vite + Tailwind
- Hauptdatei: src/lib/artworks.ts

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

## Offene Aufgaben
1. FTP-Zugangsdaten in deploy.sh eintragen → `./deploy.sh` ausführen
2. Morse Text: echte Fotos des Werks aufnehmen und in gallery/morse-text/ ablegen
3. Mehrsprachigkeit (DE/EN/ES/FR/AR/CS/ZH) mit react-i18next
4. Logo einbauen (aktuell nur "MW"-Text im Header)
