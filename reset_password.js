import crypto from 'crypto';

// ==============================
// Buraya yeni şifreni gir:
const NEW_PASSWORD = 'sundizayn2025';
// ==============================

const saltBytes = crypto.randomBytes(16);
const saltHex   = saltBytes.toString('hex');
const hash      = crypto.pbkdf2Sync(NEW_PASSWORD, saltBytes, 10000, 64, 'sha512').toString('hex');
const stored    = `${saltHex}:${hash}`;

console.log('\n=== cPanel phpMyAdmin\'de çalıştır ===\n');
console.log(`UPDATE users SET passwordHash='${stored}' WHERE username='kaleythankful';\n`);
console.log(`Yeni şifren: ${NEW_PASSWORD}`);
