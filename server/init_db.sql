CREATE DATABASE IF NOT EXISTS mefaaluminyum_wp289;
USE mefaaluminyum_wp289;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL
);

INSERT INTO users (username, passwordHash)
  VALUES (
    'admin',
    'a33448fff98cd761fe10c8a7cecfd12d:42850e744618f339c5e71d279dfb5d2feb98c5d4441538f305526a186d258ce7e4adcc4b22d2ff89e8907342d5adf64f2704f63f177765fbbca733148c75281f'
  )
  ON DUPLICATE KEY UPDATE username=VALUES(username);

CREATE TABLE IF NOT EXISTS content (
  id INT PRIMARY KEY,
  data JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS translations (
  id INT PRIMARY KEY,
  data JSON NOT NULL
);

INSERT IGNORE INTO content (id, data) VALUES (1, '{}');
INSERT IGNORE INTO translations (id, data) VALUES (1, '{}');
