import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC    = path.resolve(__dirname, "../public");
const GALLERY   = path.join(PUBLIC, "images/gallery");
const SLIDER    = path.join(PUBLIC, "images/slider");
const OVERRIDE  = path.join(PUBLIC, "site-override.json");

const app  = express();
const PORT = 3001;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ── Statische Bilder aus public/ ausliefern ───────────────────────────────────
app.use("/images", express.static(path.join(PUBLIC, "images")));

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
const ok  = (res, data = {}) => res.json({ ok: true, ...data });
const err = (res, msg, code = 400) => res.status(code).json({ ok: false, error: msg });

function safeId(s = "")    { return String(s).toLowerCase().replace(/[^a-z0-9-]/g, ""); }
function safeFile(s = "")  { return String(s).replace(/[^a-zA-Z0-9._-]/g, ""); }
function isImage(f)        { return /\.(jpg|jpeg|png|webp)$/i.test(f); }

// ── Multer: dynamische Destination je nach action ─────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const action = String(req.query.action ?? "");
      if (action === "upload_slider") {
        fs.mkdirSync(SLIDER, { recursive: true });
        return cb(null, SLIDER);
      }
      const id  = safeId(req.body?.artwork_id ?? req.query.artwork_id ?? "");
      const dir = path.join(GALLERY, id || "_unknown");
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename(req, file, cb) {
      const ext  = path.extname(file.originalname).toLowerCase() || ".jpg";
      const action = String(req.query.action ?? "");
      const name = action === "upload_slider"
        ? `slide-${Date.now()}${ext}`
        : `bild-${Date.now()}${ext}`;
      cb(null, name);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// ── JSON-Body-Parser nur für Nicht-Multipart-Requests ────────────────────────
app.use("/api/admin.php", (req, res, next) => {
  const ct = req.headers["content-type"] ?? "";
  if (ct.includes("application/json")) {
    express.json()(req, res, next);
  } else if (ct.includes("application/x-www-form-urlencoded")) {
    express.urlencoded({ extended: true })(req, res, next);
  } else {
    next();
  }
});

// ── Haupt-Route ───────────────────────────────────────────────────────────────
app.all("/api/admin.php", (req, res, next) => {
  const ct = req.headers["content-type"] ?? "";
  if (ct.includes("multipart/form-data")) {
    upload.single("image")(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  const action = String(req.query.action ?? "");

  try {
    switch (action) {

      // ── Auth ────────────────────────────────────────────────────────────
      case "check":  return ok(res, { loggedIn: true });
      case "login":  return ok(res, { loggedIn: true });
      case "logout": return ok(res);

      // ── Config lesen ────────────────────────────────────────────────────
      case "get_config": {
        if (!fs.existsSync(OVERRIDE)) return ok(res, { config: { version: 1 } });
        const raw = fs.readFileSync(OVERRIDE, "utf8");
        const config = JSON.parse(raw);
        return ok(res, { config });
      }

      // ── Config schreiben ────────────────────────────────────────────────
      case "save_config": {
        let data = req.body;
        if (!data || typeof data !== "object") {
          return err(res, `Ungültiger Body (type: ${typeof data}, keys: ${Object.keys(data ?? {}).join(",")})`);
        }
        data.version = Math.max(1, parseInt(String(data.version ?? "1"), 10) || 1);
        fs.writeFileSync(OVERRIDE, JSON.stringify(data, null, 2), "utf8");
        console.log(`[API] save_config → ${OVERRIDE} (${JSON.stringify(data).length} Bytes)`);
        return ok(res);
      }

      // ── Galerie: Bilder auflisten ────────────────────────────────────────
      case "list_images": {
        const id  = safeId(String(req.query.artwork_id ?? ""));
        if (!id) return err(res, "Ungültige artwork_id");
        const dir = path.join(GALLERY, id);
        if (!fs.existsSync(dir)) return ok(res, { images: [] });
        const files = fs.readdirSync(dir).filter(isImage).sort();
        return ok(res, { images: files.map(f => `/images/gallery/${id}/${f}`) });
      }

      // ── Galerie: Bild hochladen ──────────────────────────────────────────
      case "upload_image": {
        const id = safeId(String(req.body?.artwork_id ?? ""));
        if (!id) return err(res, "Ungültige artwork_id — Bitte zuerst ID des Werks angeben");
        if (!req.file) return err(res, "Kein Bild empfangen");
        const imgPath = `/images/gallery/${id}/${req.file.filename}`;
        console.log(`[API] upload_image → ${req.file.path}`);
        return ok(res, { path: imgPath });
      }

      // ── Galerie: Bild löschen → archiv/ ─────────────────────────────────
      case "delete_image": {
        const id       = safeId(String(req.body?.artwork_id ?? ""));
        const filename = safeFile(String(req.body?.filename ?? ""));
        if (!id || !filename) return err(res, "Fehlende Parameter (artwork_id, filename)");
        const src = path.join(GALLERY, id, filename);
        if (!fs.existsSync(src)) return err(res, "Datei nicht gefunden", 404);
        const archDir = path.join(GALLERY, id, "archiv");
        fs.mkdirSync(archDir, { recursive: true });
        fs.renameSync(src, path.join(archDir, filename));
        return ok(res);
      }

      // ── Slider: Bild hochladen ───────────────────────────────────────────
      case "upload_slider": {
        if (!req.file) return err(res, "Kein Bild empfangen");
        return ok(res, { path: `/images/slider/${req.file.filename}` });
      }

      // ── Slider: Bild löschen → archiv/ ──────────────────────────────────
      case "delete_slider": {
        const filename = safeFile(String(req.body?.filename ?? ""));
        if (!filename) return err(res, "Fehlender Dateiname");
        const src = path.join(SLIDER, filename);
        if (!fs.existsSync(src)) return err(res, "Datei nicht gefunden", 404);
        const archDir = path.join(SLIDER, "archiv");
        fs.mkdirSync(archDir, { recursive: true });
        fs.renameSync(src, path.join(archDir, filename));
        return ok(res);
      }

      // ── Kontaktformular (Dev: nur loggen) ────────────────────────────────
      case "send_mail": {
        console.log("[DEV] Kontaktformular:", req.body);
        return ok(res);
      }

      default:
        return err(res, `Unbekannte Aktion: "${action}"`, 404);
    }
  } catch (e) {
    console.error(`[API] Fehler bei action="${action}":`, e);
    return err(res, `Server-Fehler: ${e.message}`, 500);
  }
});

// ── Server starten ────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n  ✓ Dev-API läuft auf http://localhost:${PORT}`);
  console.log(`    Admin: http://localhost:5173/admin\n`);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`\n  ✗ Port ${PORT} ist bereits belegt.`);
    console.error(`    Bitte vorherige Instanz beenden: lsof -ti:${PORT} | xargs kill\n`);
    process.exit(1);
  } else {
    throw e;
  }
});
