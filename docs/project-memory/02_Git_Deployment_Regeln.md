---
title: Git & Deployment Regeln
updated: 2026-06-07
---

# 02 Git & Deployment Regeln

## ABSOLUT VERBOTEN (ohne explizite Freigabe)
- `git push` — CI/CD läuft automatisch: push → GitHub Actions → FTP → **sofort live**
- `./deploy.sh` — geht direkt auf ateliermiro.de live
- `git commit` — nur auf explizite Aufforderung
- Secrets anzeigen (FTP-Passwort, SSH-Keys, Tokens)

## Branch-Struktur

```
main
 └── CI/CD trigger: push → GitHub Actions → FTP → ateliermiro.de live

feature/admin-artwork-crud   ← aktiver Entwicklungsbranch
 └── NICHT merged (wartet auf User-Freigabe)
```

## Merge-Checkliste (vor feature → main)

- [ ] `npm run build` läuft ohne Fehler
- [ ] Admin-Panel lokal vollständig getestet
- [ ] Kein `console.log` oder Debug-Code
- [ ] Keine Test-Bilder in gallery/ (nur echte Kunstwerke)
- [ ] site-override.json in .gitignore ✓
- [ ] deploy.sh in .gitignore ✓
- [ ] User-Freigabe erteilt

## .gitignore — was ausgeschlossen ist

```
deploy.sh                        # FTP-Credentials
public/site-override.json        # Runtime-Config, enthält Admin-Einstellungen
public/images/gallery/archiv/    # Archivierte Bilder
public/images/gallery/*/archiv/  # Archiv-Unterordner pro Werk
.gstack/                         # gstack-Konfiguration
node_modules/
dist/
```

## Deploy-Ablauf (wenn freigegeben)
1. `npm run build` → prüfen
2. FTP-Zugangsdaten in `deploy.sh` eintragen (Passwort NIE anzeigen)
3. `./deploy.sh` — lädt dist/ per FTP auf 94.130.144.142

## Produktions-Abweichungen
- `/admin` Route auf ateliermiro.de nicht erreichbar
  - Ursache: alter WebSite X5 Ordner `web/admin/` blockiert React-Router
  - Lösung ausstehend: .htaccess oder Ordner umbenennen
- PHP-Backend (api/admin.php) auf Produktion statt Node.js API
  - Gleiche Endpunkte, gleiche Logik

## Schnellreferenz Git-Befehle (erlaubt)

```bash
git status                  # Änderungen prüfen
git diff                    # Diff anzeigen
git log --oneline -10       # Letzte Commits
git branch                  # Branches anzeigen
git stash                   # Änderungen zwischenspeichern
```
