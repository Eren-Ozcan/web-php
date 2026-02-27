<?php
// BU DOSYAYI KULLANDIKTAN SONRA HEMEN SİL
require_once __DIR__ . '/config.php';

$newPw   = 'aliosman';
$salt    = random_bytes(16);
$saltHex = bin2hex($salt);
$hash    = hash_pbkdf2('sha512', $newPw, $salt, 10000, 0, false);
$stored  = "$saltHex:$hash";

$stmt = getDB()->prepare("UPDATE users SET passwordHash=? WHERE id=1");
$stmt->execute([$stored]);

echo json_encode([
    'ok'      => $stmt->rowCount() === 1,
    'updated' => $stmt->rowCount(),
    'message' => 'Sifre aliosman olarak guncellendi'
]);
