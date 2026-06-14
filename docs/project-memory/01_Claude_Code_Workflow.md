---
title: Claude Code Workflow
updated: 2026-06-07
---

# 01 Claude Code Workflow

## Grundprinzip
**Kein Babysitting.** Claude analysiert, plant, setzt um — ohne jeden Schritt zu kommentieren.
Rückfragen nur bei echter Unklarheit oder Risiko (Datenverlust, Deployment, Secrets).

## Session-Start (Pflicht)
1. `resolve_repo { "path": "." }` — jCodemunch Index prüfen
2. CLAUDE.md lesen (passiert automatisch)
3. `00_Projektstatus.md` lesen — aktueller Stand
4. Bei Codearbeit: `plan_turn { "query": "...", "model": "claude-sonnet-4-6" }` für Datei-Routing

## Arbeitsablauf

```
1. Aufgabe verstehen → relevante Dateien lesen
2. Plan in 3-5 Sätzen zeigen (was, wo, warum)
3. Umsetzen
4. npm run build → auf Fehler prüfen
5. Fertig melden mit: was geändert, was zu prüfen ist
```

**Fertig = Build grün + Änderung kurz beschrieben.**
Ohne Playwright MCP: "Bitte im Browser prüfen" explizit schreiben.
Mit Playwright MCP: Screenshot machen und zeigen.

## Was NICHT getan wird (ohne explizite Freigabe)
- git commit / push / deploy
- Bestehende Bilder löschen
- FTP-Credentials anfassen oder anzeigen
- CLAUDE.md verändern (außer Regeländerungen die der User bestätigt)
- Fremde Platzhalterbilder einfügen

## Pflicht-Checks vor Codeänderungen
- artworks.ts vor jeder Änderung komplett lesen
- Bei neuen SiteOverride-Feldern: alle 3 Stellen (Typ + Init + Speichern) → [[03_Admin_Backend_Architektur]]
- Array-Fallback: `?.length` statt `??` → [[04_Admin_Bugfix_Protokoll]]

## Tool-Nutzung
- Code finden: jCodemunch MCP (`search_symbols`, `get_file_outline`, `get_context_bundle`)
- Dateien lesen (vor Edit): `Read`-Tool
- Editieren: `Edit`-Tool (nie `sed`/`awk` über Bash)
- Visuelle Verifikation: Playwright MCP (sobald installiert)

## Playwright MCP (noch nicht installiert)
```bash
npx @playwright/mcp@latest
# dann in ~/.claude.json unter mcpServers eintragen
```
Sobald installiert: nach jeder Frontend-Änderung Screenshot + Console-Check.

## Kommunikation
- Knappe Meldungen, kein Kommentar zu jedem Schritt
- Wenn geblockt: sagen was fehlt, nicht weiterraten
- Fragen nur wenn die Entscheidung wirklich beim User liegt
