/**
 * One-time migration: renames the 'admin' user to 'kaleythankful' in the database.
 * Run once from the server/ directory: node scripts/update-username.js
 */
import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../db.js';

const OLD_USERNAME = 'admin';
const NEW_USERNAME = 'kaleythankful';

const [result] = await pool.query(
  'UPDATE users SET username = ? WHERE username = ?',
  [NEW_USERNAME, OLD_USERNAME]
);

if (result.affectedRows === 0) {
  console.log(`No user found with username '${OLD_USERNAME}'. Nothing was changed.`);
} else {
  console.log(`Username updated from '${OLD_USERNAME}' to '${NEW_USERNAME}'.`);
}

await pool.end();
