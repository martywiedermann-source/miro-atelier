---
title: Testprotokoll Admin
updated: 2026-06-07
---

# 05 Testprotokoll Admin

## Standard-Checkliste (vor jedem Merge)

### Build
- [ ] `npm run build` ohne Fehler
- [ ] Keine TypeScript-Fehler
- [ ] Bundle-Größe akzeptabel (main.js <600 KB, gzip <200 KB)

### Admin-Panel lokal (http://localhost:5173/admin)
- [ ] Login funktioniert
- [ ] Werk-Liste lädt (statische + neue Werke sichtbar)
- [ ] Werk editieren: Titel, Technik, Maße, Jahr speichern → Reload → bleibt
- [ ] Neues Werk anlegen → erscheint in Galerie
- [ ] Bild hochladen → erscheint in Karte
- [ ] Logo hochladen → erscheint in Navbar → Reload → bleibt
- [ ] Events leer lassen → statische Ausstellungen erscheinen (Array-Fallback!)
- [ ] Seite ausblenden (z.B. Events) → Link verschwindet aus Navbar → Reload → bleibt
- [ ] Sortierung ändern → Galerie neu sortiert → Reload → bleibt
- [ ] Hero-Tagline ausblenden → verschwindet auf Homepage
- [ ] Inquiry Types (Zweck) bearbeiten → Kontaktformular aktualisiert

### Frontend lokal (http://localhost:5173)
- [ ] Homepage lädt ohne Broken Images
- [ ] Galerie /works: Filter funktioniert, Sortierung funktioniert
- [ ] Lightbox öffnet, Zoom funktioniert, Navigation zwischen Bildern
- [ ] Kontaktformular: alle Felder vorhanden, Absenden möglich
- [ ] Ausstellungen /events: zeigt Events
- [ ] Über /about: Banner korrekte Größe, Text korrekt
- [ ] Impressum /impressum: Adresse + Telefon korrekt (Brühlstraße 3, 63571 Gelnhausen)
- [ ] Mobile: Navbar Hamburger-Menü funktioniert
- [ ] Keine Console-Fehler (F12 → Console)

### Persistenz-Test (kritisch)
1. Im Admin etwas ändern
2. Speichern klicken
3. Seite komplett neu laden (Cmd+Shift+R)
4. Änderung muss noch vorhanden sein

---

## Bekannte Produktions-Abweichungen

| Punkt | Lokal | Produktion |
|---|---|---|
| Admin-Route | http://localhost:5173/admin ✓ | ateliermiro.de/admin ✗ (geblockt) |
| API-Backend | Node.js (server/api.mjs) | PHP (api/admin.php) |
| Fonts | Lokal via @fontsource | Gleich |
| site-override.json | public/site-override.json | Gleiche Datei auf Server |

## Getestete Sessions

| Datum | Was getestet | Ergebnis |
|---|---|---|
| 2026-06-07 | Build nach 6-Fix-Plan (Logo, Events, Zoom, Spacing) | ✓ |
| 2026-06-07 | Galerie-Sortierung + Navbar-Logo-Fallback | ✓ (visuell nicht verifiziert — kein Playwright) |
| 2026-06-05 | Admin Persistenz nach curl-Diagnose | ✓ |

## Offene Tests
- Playwright MCP: noch nicht installiert → visuelle Verifikation manuell
- /admin auf Produktion: nicht testbar bis Route-Blocker gelöst
- PHP-Backend: Upload auf Produktion noch nicht end-to-end getestet
