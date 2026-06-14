---
title: Projektstatus
updated: 2026-06-07
branch: feature/admin-artwork-crud
build: passing
---

# 00 Projektstatus

## Aktiver Branch
`feature/admin-artwork-crud` — noch NICHT in main gemergt.
CI/CD läuft auf `main` → push = sofort live. Daher: kein Push ohne explizite Freigabe.

## Letzter Build
`npm run build` ✓ (2.29s, keine TypeScript-Fehler)

## Was fertig ist (diese Entwicklungsphase)

### Admin-Panel (lokal)
- Bestehende Werke editieren: Titel, Technik, Maße, Jahr, Kategorie, Beschreibung, SEO ✓
- Neue Werke anlegen ✓
- Bildupload für bestehende + neue Werke ✓
- Persistenz nach Reload via site-override.json ✓
- Logo-Upload + Persistenz in Config ✓
- Hero-Text / CTA-Button Toggle (Admin) ✓
- Inquiry Types (Zweck) verwaltbar ✓
- Pages-Tab: Sichtbarkeit speichern ✓

### Frontend
- Galerie-Sortierung (Standard / Neueste / Älteste / A–Z) ✓
- Navbar-Logo: onError-Fallback auf Text "ATELIER MIROSLAV" ✓
- Maße-Streifen unter Artwork-Cards entfernt ✓
- Lightbox: Zoom + Pan implementiert ✓
- About-Banner: Höhe begrenzt ✓
- Seitenabstände vereinheitlicht (pt-20) ✓
- Admin-Panel auf max-w-5xl verbreitert ✓
- Google Fonts lokal gehostet (kein externer Request) ✓
- Impressum: Adresse + Telefon korrekt ✓

## Offene Tasks (priorisiert)

| Prio | Task | Kontext |
|---|---|---|
| 1 | Playwright MCP installieren | Visuelle Verifikation ohne Babysitting |
| 2 | Branch → main mergen | Nach User-Freigabe |
| 3 | /admin auf Produktion freischalten | web/admin/ Ordner blockiert Route |
| 4 | Multi-Bildupload (multiple attr) | Upload-Dialog |
| 5 | Morse-Text: echte Fotos aufnehmen | gallery/morse-text/ |
| 6 | Hero-Slider: bessere Bilder wählen | Via Admin → Hero-Tab |
| 7 | Mehrsprachigkeit DE/EN/ES/FR/AR/CS/ZH | react-i18next |

## Bekannte Blocker
- `/admin` auf ateliermiro.de: alter WebSite X5 Ordner `web/admin/` blockiert React-Route
  - Lösung: .htaccess anpassen oder Ordner umbenennen (wartet auf SSH/FTP-Freigabe)

## Dev-URLs (lokal)
- Frontend: http://localhost:5173
- Admin: http://localhost:5173/admin
- API: http://localhost:3001
- Starten: `npm run dev` (startet Vite + Node.js API gleichzeitig)
