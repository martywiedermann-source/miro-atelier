---
title: Admin Bugfix Protokoll
updated: 2026-06-07
---

# 04 Admin Bugfix Protokoll

Chronologisches Log aller relevanten Bugs. Neue Bugs am Anfang eintragen.

---

## [2026-06] Navbar-Logo zeigt Broken-Image

**Symptom:** Obere rechte Ecke zeigt kaputtes Bild-Icon im Browser.
**Ursache:** `site-override.json` enthielt veralteten `logoPath` auf nicht-existierende Datei. `<img>` hatte kein `onError`.
**Fix:** `logoError` State + konditionaler Render: Text-Fallback "ATELIER MIROSLAV" wenn `onError` feuert.
**Regel daraus:** Jedes dynamische `<img>` braucht `onError`-Handler. Kein Ausnahme.

---

## [2026-06] Ausstellungen (Events) leer nach Reload

**Symptom:** Admin-Panel zeigt keine Events mehr nach Neuladen der Seite.
**Ursache:** `effectiveOverride.events ?? staticEvents` — `??` gibt Fallback nur bei `null`/`undefined`. Eine leere Config-Array (`[]`) hat alle statischen Daten unterdrückt.
**Fix:** `effectiveOverride.events?.length ? effectiveOverride.events : staticEvents`
**Regel daraus:** Array-Fallback IMMER mit `?.length` prüfen, nie `??`.

---

## [2026-06] Logo-Pfad nach Reload verloren

**Symptom:** Logo-Upload funktioniert, aber nach Seiten-Reload ist das Standard-Logo wieder da.
**Ursache:** `logoPath` fehlte im `SiteOverride` Interface und wurde nicht in den Admin-State initialisiert.
**Fix:** 1) `logoPath?: string` in SiteOverride, 2) `useState(effectiveOverride.logoPath ?? "...")`, 3) `autoSave({ ...draftOverride, logoPath: res.path })`
**Regel daraus:** Neues Config-Feld = immer alle 3 Stellen (Typ + Init + Speichern).

---

## [2026-06] Doppeltes Multer — Upload-Fehler

**Symptom:** Bild-Upload schlägt fehl mit Parse-Fehler.
**Ursache:** Multer (Multipart-Parser) war doppelt registriert in `server/api.mjs`. JSON-Body und Multipart-Body wurden nicht getrennt behandelt.
**Fix:** Multer nur einmal registrieren, JSON-Parsing für reguläre Actions trennen, Multipart nur für Upload-Actions.

---

## [2026-06] Neu hochgeladene Bilder erscheinen nicht zuerst

**Symptom:** Nach Upload eines neuen Bildes erscheint es nicht als erstes in der Galerie-Karte.
**Ursache:** `imageOrder` in der Config hat neue Bilder nicht automatisch vorne einsortiert.
**Fix:** Upload-Handler schreibt neue Bilder an den Anfang der `imageOrder`.

---

## [2026-06] Admin Pages-Tab speichert nicht

**Symptom:** Seiten-Sichtbarkeit (z.B. Events ausblenden) geht nach Reload verloren.
**Ursache:** Toggle hat `draftOverride` geupdatet aber nicht `autoSave()` aufgerufen.
**Fix:** `autoSave()` direkt im Toggle-Handler aufrufen.

---

## Muster-Checkliste bei neuen Bugs

1. Ist es ein Array-Fallback Problem? (`??` statt `?.length`)
2. Fehlt eine der 3 Stellen bei einem Config-Feld?
3. Sind Admin.tsx und hooks.ts für diese Logik konsistent?
4. Hat ein dynamisches `<img>` kein `onError`?
5. Wird `autoSave()` nach der Änderung aufgerufen?
