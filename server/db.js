import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'merhaba123',
  database: process.env.DB_NAME || 'mefaaluminyum_wp289',
  waitForConnections: true,
  connectionLimit: 10
});
