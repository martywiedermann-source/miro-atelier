<?php
/**
 * Admin API für ateliermiro.de
 * Endpunkt: /api/admin.php?action=...
 */
session_start();

// ── Konfiguration ─────────────────────────────────────────────────────────────
define('SITE_ROOT',     dirname(__DIR__));
define('OVERRIDE_FILE', SITE_ROOT . '/site-override.json');
define('GALLERY_DIR',   SITE_ROOT . '/images/gallery/');
define('SLIDER_DIR',    SITE_ROOT . '/images/slider/');
define('ADMIN_EMAIL',   'miro@ateliermiro.de');
define('MAX_MB',        10);
define('CONFIG_FILE',   __DIR__ . '/admin-config.json');

// ── CORS (lokal entwickeln + Produktion) ─────────────────────────────────────
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://ateliermiro.de',
    'https://www.ateliermiro.de',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
function ok(array $data = []): never {
    echo json_encode(['ok' => true] + $data, JSON_UNESCAPED_UNICODE);
    exit;
}

function err(string $msg, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

function requireAuth(): void {
    if (empty($_SESSION['admin_logged_in'])) {
        err('Nicht angemeldet', 401);
    }
}

function safeFilename(string $s): string {
    return preg_replace('/[^a-zA-Z0-9._\-]/', '', $s);
}

function safeId(string $s): string {
    return preg_replace('/[^a-z0-9\-]/', '', strtolower($s));
}

// ── Passwort-Config laden ─────────────────────────────────────────────────────
if (!file_exists(CONFIG_FILE)) {
    err('Admin nicht eingerichtet. Bitte /api/setup.php aufrufen.', 503);
}
$adminConfig = json_decode(file_get_contents(CONFIG_FILE), true);
if (empty($adminConfig['password_hash'])) {
    err('Ungültige Admin-Konfiguration.', 503);
}

// ── Routing ───────────────────────────────────────────────────────────────────
$action = $_GET['action'] ?? '';

switch ($action) {

    // ── Auth ──────────────────────────────────────────────────────────────────
    case 'check':
        ok(['loggedIn' => !empty($_SESSION['admin_logged_in'])]);

    case 'login':
        $pw = $_POST['password'] ?? '';
        if (!$pw) err('Kein Passwort angegeben');
        if (password_verify($pw, $adminConfig['password_hash'])) {
            $_SESSION['admin_logged_in'] = true;
            ok();
        }
        sleep(1); // Brute-Force-Verzögerung
        err('Falsches Passwort', 401);

    case 'logout':
        session_destroy();
        ok();

    // ── Config: lesen / schreiben ─────────────────────────────────────────────
    case 'get_config':
        requireAuth();
        if (!file_exists(OVERRIDE_FILE)) {
            ok(['config' => ['version' => 1]]);
        }
        $raw = file_get_contents(OVERRIDE_FILE);
        ok(['config' => json_decode($raw, true) ?? ['version' => 1]]);

    case 'save_config':
        requireAuth();
        $body = file_get_contents('php://input');
        $data = json_decode($body, true);
        if (!is_array($data)) err('Ungültiges JSON');
        $data['version'] = max(1, (int)($data['version'] ?? 1));
        $written = file_put_contents(
            OVERRIDE_FILE,
            json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
        if ($written === false) err('Schreiben fehlgeschlagen – Schreibrechte prüfen', 500);
        ok();

    // ── Bild-Upload (Galerie) ─────────────────────────────────────────────────
    case 'upload_image':
        requireAuth();
        $artworkId = safeId($_POST['artwork_id'] ?? '');
        if (!$artworkId) err('Ungültige artwork_id');

        $dir = GALLERY_DIR . $artworkId . '/';
        if (!is_dir($dir)) {
            // Neues Werk: Ordner anlegen
            if (!mkdir($dir, 0755, true)) err('Ordner konnte nicht erstellt werden', 500);
        }

        // Max 15 Bilder prüfen
        $existing = glob($dir . '*.{jpg,jpeg,png,webp}', GLOB_BRACE) ?: [];
        if (count($existing) >= 15) err('Maximale Bildanzahl (15) erreicht');

        $file = $_FILES['image'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            err('Upload fehlgeschlagen (Fehlercode: ' . ($file['error'] ?? '?') . ')');
        }
        if ($file['size'] > MAX_MB * 1024 * 1024) err('Datei zu groß (max ' . MAX_MB . ' MB)');

        // MIME prüfen
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime  = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        $mimeMap = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
        ];
        if (!isset($mimeMap[$mime])) err('Nur JPG, PNG oder WEBP erlaubt');

        $ext      = $mimeMap[$mime];
        $filename = 'upload-' . time() . '-' . rand(1000, 9999) . '.' . $ext;
        $dest     = $dir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) err('Speichern fehlgeschlagen', 500);

        ok(['path' => '/images/gallery/' . $artworkId . '/' . $filename]);

    // ── Bild-Upload (Hero-Slider) ─────────────────────────────────────────────
    case 'upload_slider':
        requireAuth();
        $file = $_FILES['image'] ?? null;
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) err('Upload fehlgeschlagen');
        if ($file['size'] > MAX_MB * 1024 * 1024) err('Datei zu groß');

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime  = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        $mimeMap = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        if (!isset($mimeMap[$mime])) err('Nur JPG, PNG oder WEBP erlaubt');

        if (!is_dir(SLIDER_DIR)) mkdir(SLIDER_DIR, 0755, true);

        $filename = 'slide-' . time() . '.' . $mimeMap[$mime];
        move_uploaded_file($file['tmp_name'], SLIDER_DIR . $filename);
        ok(['path' => '/images/slider/' . $filename]);

    // ── Bild löschen (→ archiv/) ──────────────────────────────────────────────
    case 'delete_image':
        requireAuth();
        $artworkId = safeId($_POST['artwork_id'] ?? '');
        $filename  = safeFilename($_POST['filename'] ?? '');
        if (!$artworkId || !$filename) err('Fehlende Parameter');

        $src = GALLERY_DIR . $artworkId . '/' . $filename;
        if (!file_exists($src)) err('Datei nicht gefunden', 404);

        $archiveDir = GALLERY_DIR . $artworkId . '/archiv/';
        if (!is_dir($archiveDir)) mkdir($archiveDir, 0755, true);
        rename($src, $archiveDir . $filename);
        ok();

    // ── Kontaktformular senden ────────────────────────────────────────────────
    case 'send_mail':
        // Kein Login erforderlich (öffentlicher Endpunkt)
        $honeypot = $_POST['website'] ?? ''; // Spam-Falle
        if ($honeypot) { ok(); } // Bots still simulieren Erfolg

        $name    = strip_tags(trim($_POST['name']    ?? ''));
        $email   = filter_var(trim($_POST['email']   ?? ''), FILTER_VALIDATE_EMAIL);
        $subject = strip_tags(trim($_POST['subject'] ?? 'Kontaktanfrage'));
        $message = strip_tags(trim($_POST['message'] ?? ''));

        if (!$name || !$email || !$message) {
            err('Bitte Name, E-Mail und Nachricht ausfüllen');
        }
        if (strlen($message) > 5000) err('Nachricht zu lang');

        $mailSubject = '=?UTF-8?B?' . base64_encode('[ateliermiro.de] ' . $subject) . '?=';
        $mailBody    = "Neue Kontaktanfrage von ateliermiro.de\n"
                     . "=====================================\n\n"
                     . "Von: $name <$email>\n\n"
                     . $message;
        $headers = implode("\r\n", [
            'From: noreply@ateliermiro.de',
            "Reply-To: $name <$email>",
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'X-Mailer: ateliermiro.de',
        ]);

        if (mail(ADMIN_EMAIL, $mailSubject, $mailBody, $headers)) {
            ok();
        }
        err('E-Mail konnte nicht gesendet werden. Bitte direkt kontaktieren.', 500);

    default:
        err('Unbekannte Aktion', 404);
}
