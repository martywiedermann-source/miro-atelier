---
title: Zukunft — Integrationen & Live-Tracking
updated: 2026-06-07
---

# 09 Zukunft — Integrationen

## Obsidian-Integration

**Ziel:** docs/project-memory/ als Obsidian-Vault verwenden.

**Setup (wenn bereit):**
1. Obsidian öffnen → "Open folder as Vault" → `docs/project-memory/`
2. Wikilinks funktionieren bereits (Format `[[Dateiname]]`)
3. Frontmatter (`title`, `updated`) wird von Obsidian gelesen

**Geplante Obsidian-Erweiterungen:**
- Dataview-Plugin: Live-Tabellen aus Frontmatter (z.B. alle offenen Tasks)
- Calendar-Plugin: Sessions nach Datum navigieren
- Graph View: Verbindungen zwischen Dateien visualisieren

**Für Multi-Projekt:**
- Oberhalb-Vault: `~/projekte/kunden/` als Wurzel
- Jedes Projekt bekommt eigenes `docs/project-memory/`
- Globale Referenzen: `[[Gelnhausen]]`, `[[ateliermiro.de]]` etc.

---

## n8n-Workflows

**Ziel:** Automatische Benachrichtigungen + Trigger für Projekt-Events.

**Geplante Workflows:**

| Trigger | Aktion | Priorität |
|---|---|---|
| GitHub Push auf main | E-Mail "Deploy gestartet" | Hoch |
| Deployment fertig | E-Mail mit Diff + Link | Hoch |
| Neues Bild hochgeladen | Backup-Trigger | Mittel |
| Admin Login | Sicherheits-Notiz | Niedrig |

**n8n-Setup (lokal):**
```bash
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Verbindung zu GitHub Actions:**
- Webhook-URL in n8n erstellen
- In `.github/workflows/deploy.yml` als Step eintragen

---

## Live-Tracking (DSGVO-konform)

**Ziel:** Besucher-Analytics ohne Google Analytics, keine Cookie-Banner.

**Optionen:**

| Tool | Hosting | DSGVO | Kosten |
|---|---|---|---|
| Plausible | Self-hosted | ✓ | Gratis |
| Umami | Self-hosted | ✓ | Gratis |
| Fathom | Cloud | ✓ | ~14$/Monat |

**Empfehlung:** Umami auf eigenem Server (Docker), Daten bleiben bei dir.

**Was getrackt werden sollte:**
- Seitenaufrufe pro Werk (Interesse messen)
- Referrer (woher kommen Besucher)
- Kontaktformular-Conversions

---

## Multi-Projekt-Struktur

**Ziel:** Gleiches Wissenssystem für weitere Kundenprojekte.

**Geplante Struktur:**
```
~/projekte/kunden/
├── miro-atelier-main/
│   └── docs/project-memory/    ← dieses System
├── [projekt-b]/
│   └── docs/project-memory/
└── _shared/
    └── claude-workflows/       ← gemeinsame Prompt-Vorlagen
```

**Claude.ai Projects:**
- Projekt "miro-atelier" mit CLAUDE.md + project-memory als Kontext
- Separates Projekt pro Kunde

---

## Bildserien-Hierarchie (Kunst-spezifisch)

**3-Ebenen-Konzept:**
```
Serie (z.B. "Entscheidung")
 ├── Werk: Entscheidung-Bunt
 │   └── Fotos: [img1, img2, img3]
 └── Werk: Entscheidung-Weiss
     └── Fotos: [img1, img2]
```

**Technisch:**
- Neues Feld `series?: string` in Artwork-Typ
- Admin: Serie-Filter + Gruppenansicht
- Galerie: optional nach Serie gruppieren

---

## Nächste konkrete Schritte

1. Playwright MCP installieren (sofort umsetzbar)
2. Obsidian Vault öffnen (sofort umsetzbar)
3. n8n lokal starten + GitHub-Webhook (nach Merge)
4. Umami Analytics einrichten (nach Merge)
