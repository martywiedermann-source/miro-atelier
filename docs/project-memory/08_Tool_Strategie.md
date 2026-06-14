---
title: Tool-Strategie (Claude Chat / Code / MCP)
updated: 2026-06-07
---

# 08 Tool-Strategie

## Wann welches Tool

| Tool | Wofür | Wann NICHT |
|---|---|---|
| **Claude Code** | Datei-Änderungen, Bugs fixen, Build-Checks, Struktur anlegen | Strategie-Diskussionen |
| **Claude Chat** | Ideen entwickeln, Feedback geben, lange Erklärungen | Code direkt schreiben |
| **Claude.ai Projects** | Wissens-Kontext über Sessions hinweg | Real-time Codearbeit |

## MCP-Server (installiert)

### jCodemunch MCP ✓
- **Zweck:** Code-Navigation ohne trial-and-error Datei-Suche
- **Wichtige Befehle:**
  ```
  resolve_repo { "path": "." }          # Repo-Index prüfen
  plan_turn { "query": "...", "model": "claude-sonnet-4-6" }  # Datei-Routing
  search_symbols { "name": "..." }       # Symbol suchen
  get_file_outline { "path": "..." }     # Datei-Struktur
  get_context_bundle { "id": "..." }     # Symbol + Imports
  get_changed_symbols                    # Was hat sich geändert
  ```
- **Regel:** IMMER jCodemunch für Code-Navigation verwenden, nie blind Bash-grep

### Playwright MCP (noch NICHT installiert)
- **Zweck:** Browser-Screenshots + Interaktionen nach Änderungen
- **Status:** Geplant — löst das "Babysitting"-Problem
- **Setup:**
  ```bash
  npx @playwright/mcp@latest
  ```
  Dann in `~/.claude.json` unter `mcpServers` eintragen:
  ```json
  "playwright": {
    "command": "npx",
    "args": ["@playwright/mcp@latest"]
  }
  ```
- **Nutzen:** Nach jeder Frontend-Änderung → Screenshot → keine manuelle Browser-Prüfung nötig

## Anthropic-Empfehlungen für CLAUDE.md

Basierend auf offiziellen Best Practices:

**Was in CLAUDE.md gehört:**
- Projekt-spezifische Regeln (was verboten ist)
- Kritische Fehlermuster mit Codebeispielen (Regel 1-8)
- Architektur-Übersicht (Stack, Ordner)
- Deployment-Constraints

**Was NICHT in CLAUDE.md gehört:**
- Session-spezifischer Status (→ 00_Projektstatus.md)
- Bug-History (→ 04_Admin_Bugfix_Protokoll.md)
- Backlog (→ 06_Backlog.md)
- Lange Erklärungen ohne Handlungsrelevanz

**Format-Empfehlung:**
- Kurze, nummerierte Regeln mit Codebeispielen
- "FALSCH / RICHTIG" Pattern für häufige Bugs
- Abschnitte mit klaren Überschriften für schnelles Scrollen

## gstack Skills (installiert)

Verfügbare Skills via `/skill-name`:
- `/autoplan` — Vollständiger Plan-Review-Workflow
- `/plan-eng-review` — Architektur-Review
- `/review` — Code-Review
- `/investigate` — Bug-Analyse

Proaktive Vorschläge: aktiviert (gstack-config: proactive=true)

## Was Claude Code NICHT kann (Stand 2026)

- Echten Browser öffnen ohne Playwright MCP
- FTP-Upload direkt (nur deploy.sh ausführen)
- E-Mail senden
- n8n-Workflows triggern
- Auf externe APIs zugreifen ohne explizite Tool-Konfiguration
