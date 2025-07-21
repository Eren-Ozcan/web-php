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
    '054cf408c1355d5dcbbafe9ea7d00a3b:95fd08aae8ded8e97b0989bf61bc53b8af8163199e1a87d3921b1fbb9fcdbdafec90b86950f1ee29aa2218f91bb8ff821f9b6b8524ee29a437a0eef619617e65'
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