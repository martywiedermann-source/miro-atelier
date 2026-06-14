---
title: Gute Prompts & Prompt-Bibliothek
updated: 2026-06-07
---

# 07 Gute Prompts

Prompt-Vorlagen die gut funktioniert haben. Für wiederkehrende Aufgaben direkt verwenden.

---

## Session-Start (Standard)

```
Branch: feature/admin-artwork-crud
Projekt: ~/projekte/kunden/miro-atelier-main

Bitte zuerst nur analysieren, dann Plan zeigen, dann auf Freigabe warten.
Nicht committen. Nicht pushen. Nicht deployen.

Aufgabe: [AUFGABE]
```

---

## Bug-Report Prompt

```
Es gibt einen Bug:
Symptom: [was sieht der User]
Wo: [URL oder Komponente]
Wann: [Bedingung]

Bitte analysieren und einen Fix vorschlagen. Erst zeigen was geändert wird, dann auf Freigabe warten.
```

---

## Admin-Feature Prompt

```
Bitte folgendes Admin-Feature implementieren:
[BESCHREIBUNG]

Beachte:
- Alle 3 Stellen bei SiteOverride-Feldern (Typ + Init + Speichern)
- Array-Fallback mit ?.length, nicht ??
- Admin.tsx und hooks.ts konsistent halten
- Nach Änderung npm run build ausführen
```

---

## Frontend-Änderung Prompt

```
Bitte folgende Frontend-Änderung umsetzen:
[BESCHREIBUNG]

Beachte:
- Dynamische <img> brauchen onError-Handler
- Nach Änderung npm run build ausführen
- Wenn kein Playwright: "Bitte im Browser prüfen" schreiben
```

---

## Merge-Vorbereitung Prompt

```
Wir wollen feature/admin-artwork-crud in main mergen.
Bitte prüfe:
1. Gibt es noch offene Todos oder Debug-Code?
2. npm run build — läuft clean?
3. Welche Dateien haben sich geändert (git diff --stat main)?
4. Was muss ich vor dem Merge im Browser testen?

Danach auf meine Freigabe warten.
```

---

## Wissenssystem Update Prompt

```
Bitte docs/project-memory/ aktualisieren:
- 00_Projektstatus.md: neue erledigte Tasks, neue offene Tasks
- 04_Admin_Bugfix_Protokoll.md: [neuer Bug und Fix]
- 06_Backlog.md: [neue/abgeschlossene Tasks]

Datum: [DATUM]
Nicht committen.
```

---

## Anti-Patterns (funktioniert NICHT gut)

| Schlechter Prompt | Problem | Besser |
|---|---|---|
| "Mach das Admin-Panel besser" | Zu vage, Claude macht zu viel | Konkrete Feature-Liste angeben |
| "Schau ob alles stimmt" | Führt zu oberflächlicher Prüfung | Spezifische Checkliste mitgeben |
| "Lösch die alten Bilder" | Bilder werden gelöscht statt archiviert | "Bilder in archiv/ verschieben" |
| Ohne Branch-Kontext starten | Claude kennt Deployment-Risiko nicht | Immer Branch + Constraints nennen |
