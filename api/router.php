<?php
require_once __DIR__ . '/config.php';

// CORS
$allowedOrigins = ['https://sundizayn.com.tr', 'https://www.sundizayn.com.tr'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true) || $origin === '') {
    header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
} else {
    http_response_code(403); exit;
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// JWT
function b64url(string $d): string { return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); }
function b64urlDec(string $s): string { return base64_decode(strtr($s, '-_', '+/') . str_repeat('=', (4 - strlen($s) % 4) % 4)); }
function jwtSign(array $p): string {
    $h = b64url(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $b = b64url(json_encode($p));
    return "$h.$b." . b64url(hash_hmac('sha256', "$h.$b", JWT_SECRET, true));
}
function jwtVerify(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $b, $s] = $parts;
    if (!hash_equals(b64url(hash_hmac('sha256', "$h.$b", JWT_SECRET, true)), $s)) return null;
    $data = json_decode(b64urlDec($b), true);
    if (!isset($data['exp']) || $data['exp'] < time()) return null;
    return $data;
}
function requireAuth(): void {
    // Apache bazı konfigürasyonlarda Authorization'ı striplar — birden fazla yerde ara
    $auth = $_SERVER['HTTP_AUTHORIZATION']
         ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
         ?? (function_exists('getallheaders') ? (getallheaders()['Authorization'] ?? '') : '');
    $token = preg_replace('/^Bearer\s+/i', '', $auth);
    if (!jwtVerify($token)) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }
}

// Password (PBKDF2-SHA512 — Node.js ile uyumlu)
function verifyPassword(string $pw, string $stored): bool {
    [$saltHex, $hash] = explode(':', $stored, 2);
    return hash_equals($hash, hash_pbkdf2('sha512', $pw, hex2bin($saltHex), 10000, 0, false));
}

// Helpers
function body(): array { return json_decode(file_get_contents('php://input'), true) ?? []; }
function dbRead(string $table): mixed {
    $row = getDB()->query("SELECT data FROM $table WHERE id=1")->fetch();
    if (!$row) return null;
    return is_string($row['data']) ? json_decode($row['data'], true) : $row['data'];
}
function dbSave(string $table, mixed $data): void {
    getDB()->prepare("UPDATE $table SET data=? WHERE id=1")->execute([json_encode($data, JSON_UNESCAPED_UNICODE)]);
}

// Router
$method = $_SERVER['REQUEST_METHOD'];
$uri    = trim(preg_replace('#^.*?/api/?#', '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)), '/');

// Rate limit login
if ($uri === 'login' && $method === 'POST') {
    $ip   = md5($_SERVER['REMOTE_ADDR'] ?? '');
    $file = sys_get_temp_dir() . '/rl_' . $ip . '.json';
    $now  = time(); $window = 600; $max = 5;
    $log  = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $log  = array_values(array_filter($log, fn($t) => $t > $now - $window));
    if (count($log) >= $max) { http_response_code(429); echo json_encode(['error'=>'Too many attempts']); exit; }
    $log[] = $now;
    file_put_contents($file, json_encode($log));
}

match (true) {
    $uri === 'health' => print(json_encode(['status'=>'ok','message'=>'PHP backend çalışıyor'])),

    $uri === 'login' && $method === 'POST' => (function() {
        $b = body(); $u = trim($b['username'] ?? ''); $p = $b['password'] ?? '';
        $stmt = getDB()->prepare('SELECT id,username,passwordHash FROM users WHERE username=?');
        $stmt->execute([$u]);
        $user = $stmt->fetch();
        if (!$user)                           { http_response_code(401); echo json_encode(['error'=>'User not found']); return; }
        if (!verifyPassword($p, $user['passwordHash'])) { http_response_code(401); echo json_encode(['error'=>'Password incorrect']); return; }
        echo json_encode(['token'=>jwtSign(['id'=>$user['id'],'username'=>$user['username'],'exp'=>time()+3600])]);
    })(),

    $uri === 'content' && $method === 'GET'  => print(json_encode(dbRead('content') ?? (object)[])),
    $uri === 'content' && $method === 'POST' => (function() {
        requireAuth(); dbSave('content', body()); echo json_encode(['success'=>true]);
    })(),

    $uri === 'translations' && $method === 'GET'  => print(json_encode(dbRead('translations') ?? (object)[])),
    $uri === 'translations' && $method === 'POST' => (function() {
        requireAuth();
        $cur = dbRead('translations') ?? [];
        $new = body();
        foreach ($new as $lang => $keys) {
            foreach ($keys as $k => $v) { $cur[$lang][$k] = $v; }
        }
        dbSave('translations', $cur);
        echo json_encode(['success'=>true]);
    })(),

    $uri === 'pricing' && $method === 'GET'  => print(json_encode(dbRead('pricing') ?? (object)[])),
    $uri === 'pricing' && $method === 'POST' => (function() {
        requireAuth(); dbSave('pricing', body()); echo json_encode(['success'=>true]);
    })(),

    $uri === 'projects' => (function() {
        $c = dbRead('content') ?? [];
        $projects = $c['projects'] ?? [];
        if (($_ = $_GET['highlight'] ?? '') === 'true') {
            $projects = array_values(array_filter($projects, fn($p) => !empty($p['featured'])));
        }
        echo json_encode($projects);
    })(),

    in_array($uri, ['contact','sendMail']) && $method === 'POST' => (function() use ($uri) {
        $b = body();
        $name    = htmlspecialchars($b['name'] ?? '');
        $email   = filter_var($b['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $message = htmlspecialchars($b['message'] ?? '');
        if (!$name || !$email || !$message) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Eksik alan']); return; }

        // Şirkete bildirim
        $toCompany = mail(
            'keremcolak262@gmail.com',
            'Yeni İletişim Mesajı',
            "Gönderen: $name <$email>\n\n$message",
            "From: noreply@sundizayn.com.tr\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8"
        );

        // Gönderene otomatik yanıt (sadece /contact rotasında)
        if ($uri === 'contact') {
            $autoReply = "Merhaba $name,\n\nİletişime geçtiğiniz için teşekkürler. En kısa sürede size dönüş yapacağız.\n\nİyi günler dileriz.";
            mail(
                $email,
                'Bizimle İletişime Geçtiğiniz İçin Teşekkürler',
                $autoReply,
                "From: noreply@sundizayn.com.tr\r\nContent-Type: text/plain; charset=utf-8"
            );
        }

        echo json_encode($toCompany ? ['ok'=>true] : ['ok'=>false,'error'=>'Mail gönderilemedi']);
    })(),

    default => (function() { http_response_code(404); echo json_encode(['error'=>'Not found']); })(),
};
