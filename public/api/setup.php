<?php
/**
 * Einmalige Passwort-Einrichtung für das Admin-Panel.
 * Nach dem Setzen des Passworts wird diese Datei automatisch gelöscht.
 */
$configFile = __DIR__ . '/admin-config.json';

if (file_exists($configFile)) {
    http_response_code(403);
    die('<p style="font-family:sans-serif">Admin ist bereits eingerichtet. Diese Datei wurde gesperrt.</p>');
}

$error = '';
$done  = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pw  = $_POST['password']  ?? '';
    $pw2 = $_POST['password2'] ?? '';
    if (strlen($pw) < 8) {
        $error = 'Passwort muss mindestens 8 Zeichen haben.';
    } elseif ($pw !== $pw2) {
        $error = 'Passwörter stimmen nicht überein.';
    } else {
        $hash = password_hash($pw, PASSWORD_DEFAULT);
        file_put_contents($configFile, json_encode(['password_hash' => $hash], JSON_PRETTY_PRINT));
        // Selbst löschen
        unlink(__FILE__);
        $done = true;
    }
}
?><!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Admin einrichten – ateliermiro.de</title>
<style>
  body { font-family: 'Georgia', serif; max-width: 400px; margin: 80px auto; padding: 0 20px; color: #2c2a27; }
  h1 { font-weight: 300; font-size: 1.8rem; margin-bottom: 0.5rem; }
  label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; margin: 1.2rem 0 0.3rem; }
  input[type=password] { width: 100%; padding: 0.5rem; border: 1px solid #ccc; font-size: 1rem; box-sizing: border-box; }
  button { margin-top: 1.5rem; padding: 0.6rem 1.5rem; background: #c4a882; color: #fff; border: none; cursor: pointer; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.2em; }
  .error { color: #c0392b; margin-top: 1rem; font-size: 0.9rem; }
  .success { color: #27ae60; margin-top: 1rem; }
</style>
</head>
<body>
<?php if ($done): ?>
  <h1>Fertig!</h1>
  <p class="success">Passwort wurde gesetzt. Diese Datei wurde gelöscht.</p>
  <p><a href="/admin">→ Zum Admin-Panel</a></p>
<?php else: ?>
  <h1>Admin einrichten</h1>
  <p>Setze das Passwort für <strong>ateliermiro.de/admin</strong>.</p>
  <form method="post">
    <label>Passwort (min. 8 Zeichen)</label>
    <input type="password" name="password" required minlength="8" autofocus>
    <label>Passwort wiederholen</label>
    <input type="password" name="password2" required minlength="8">
    <?php if ($error): ?><p class="error"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <button type="submit">Passwort setzen</button>
  </form>
<?php endif; ?>
</body>
</html>
