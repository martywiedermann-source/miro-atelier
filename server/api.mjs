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

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
const ok  = (res, data = {}) => res.json({ ok: true, ...data });
const err = (res, msg, code = 400) => res.status(code).json({ ok: false, error: msg });

function safeId(s = "")       { return s.toLowerCase().replace(/[^a-z0-9-]/g, ""); }
function safeFile(s = "")     { return s.replace(/[^a-zA-Z0-9._-]/g, ""); }
function isImage(filename)    { return /\.(jpg|jpeg|png|webp)$/i.test(filename); }

// ── Multer: Galerie-Upload ────────────────────────────────────────────────────
const galleryStorage = multer.diskStorage({
  destination(req, file, cb) {
    const id  = safeId(req.body.artwork_id ?? req.query.artwork_id ?? "");
    const dir = path.join(GALLERY, id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `bild${Date.now()}${ext}`;
    cb(null, name);
  },
});

// ── Multer: Slider-Upload ─────────────────────────────────────────────────────
const sliderStorage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdirSync(SLIDER, { recursive: true });
    cb(null, SLIDER);
  },
  filename(req, file, cb) {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `slide-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const uploadGallery = multer({ storage: galleryStorage, limits: { fileSize: 20 * 1024 * 1024 } });
const uploadSlider  = multer({ storage: sliderStorage,  limits: { fileSize: 20 * 1024 * 1024 } });

// ── API-Endpunkt ──────────────────────────────────────────────────────────────
app.all("/api/admin.php", uploadGallery.single("image"), uploadSlider.single("image"), async (req, res) => {
  const action = req.query.action ?? "";

  switch (action) {

    // ── Auth (im Dev-Modus immer eingeloggt) ──────────────────────────────
    case "check":
      return ok(res, { loggedIn: true });

    case "login":
      return ok(res, { loggedIn: true });

    case "logout":
      return ok(res);

    // ── Site-Konfiguration ────────────────────────────────────────────────
    case "get_config": {
      if (!fs.existsSync(OVERRIDE)) return ok(res, { config: { version: 1 } });
      const raw = fs.readFileSync(OVERRIDE, "utf8");
      return ok(res, { config: JSON.parse(raw) });
    }

    case "save_config": {
      const data = req.body;
      if (!data || typeof data !== "object") return err(res, "Ungültiges JSON");
      data.version = Math.max(1, parseInt(data.version ?? "1", 10) || 1);
      fs.writeFileSync(OVERRIDE, JSON.stringify(data, null, 2), "utf8");
      return ok(res);
    }

    // ── Galerie: Bilder auflisten ─────────────────────────────────────────
    case "list_images": {
      const id  = safeId(req.query.artwork_id ?? "");
      if (!id) return err(res, "Ungültige artwork_id");
      const dir = path.join(GALLERY, id);
      if (!fs.existsSync(dir)) return ok(res, { images: [] });
      const files = fs.readdirSync(dir).filter(isImage).sort();
      return ok(res, { images: files.map(f => `/images/gallery/${id}/${f}`) });
    }

    // ── Galerie: Bild hochladen ───────────────────────────────────────────
    case "upload_image": {
      const id = safeId(req.body.artwork_id ?? "");
      if (!id) return err(res, "Ungültige artwork_id");
      if (!req.file) return err(res, "Kein Bild erhalten");
      return ok(res, { path: `/images/gallery/${id}/${req.file.filename}` });
    }

    // ── Galerie: Bild löschen (→ archiv/) ────────────────────────────────
    case "delete_image": {
      const id       = safeId(req.body.artwork_id ?? "");
      const filename = safeFile(req.body.filename ?? "");
      if (!id || !filename) return err(res, "Fehlende Parameter");
      const src = path.join(GALLERY, id, filename);
      if (!fs.existsSync(src)) return err(res, "Datei nicht gefunden", 404);
      const archDir = path.join(GALLERY, id, "archiv");
      fs.mkdirSync(archDir, { recursive: true });
      fs.renameSync(src, path.join(archDir, filename));
      return ok(res);
    }

    // ── Slider: Bild hochladen ────────────────────────────────────────────
    case "upload_slider": {
      if (!req.file) return err(res, "Kein Bild erhalten");
      return ok(res, { path: `/images/slider/${req.file.filename}` });
    }

    // ── Slider: Bild löschen (→ archiv/) ─────────────────────────────────
    case "delete_slider": {
      const filename = safeFile(req.body.filename ?? "");
      if (!filename) return err(res, "Fehlende Parameter");
      const src = path.join(SLIDER, filename);
      if (!fs.existsSync(src)) return err(res, "Datei nicht gefunden", 404);
      const archDir = path.join(SLIDER, "archiv");
      fs.mkdirSync(archDir, { recursive: true });
      fs.renameSync(src, path.join(archDir, filename));
      return ok(res);
    }

    // ── Kontaktformular (Dev: nur loggen) ─────────────────────────────────
    case "send_mail": {
      console.log("[DEV] Kontaktformular:", req.body);
      return ok(res);
    }

    default:
      return err(res, `Unbekannte Aktion: ${action}`, 404);
  }
});

app.listen(PORT, () => {
  console.log(`\n  ✓ API-Server läuft auf http://localhost:${PORT}`);
  console.log(`    Admin: http://localhost:5173/admin\n`);
});
