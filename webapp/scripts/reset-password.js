import { hashPassword } from 'better-auth/crypto';
import { createServices } from '../server/auth.js';
// Read the password from stdin, never from command arguments or logs.
const username = process.argv[2]?.trim().toLowerCase();
if (!username || process.stdin.isTTY) throw Error('Brug: læs ny adgangskode fra stdin og angiv brugernavnet som argument. Se LOGIN_SETUP.md.');
let password = ''; for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, '');
if (password.length < 12 || password.length > 128) throw Error('Adgangskoden skal være 12–128 tegn.');
const { pool } = createServices();
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const result = await client.query('UPDATE account SET password=$1 WHERE "providerId"=\'credential\' AND "userId"=(SELECT id FROM "user" WHERE username=$2) RETURNING "userId"', [await hashPassword(password), username]);
  if (result.rowCount !== 1) throw Error('Brugeren blev ikke fundet.');
  await client.query('DELETE FROM session WHERE "userId"=$1', [result.rows[0].userId]);
  await client.query('COMMIT'); console.log('Adgangskoden er nulstillet, og alle brugerens sessioner er afsluttet.');
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }
