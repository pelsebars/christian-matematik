import { getMigrations } from 'better-auth/db/migration';
import { readFile } from 'node:fs/promises';
import { createServices } from '../server/auth.js';
export async function migrate(services) {
  const migration = await getMigrations(services.auth.options);
  await migration.runMigrations();
  await services.pool.query(await readFile(new URL('../server/schema.sql', import.meta.url), 'utf8'));
}
if (process.argv[1]?.endsWith('/migrate.js')) {
  const services = createServices();
  try { await migrate(services); console.log('Database klar.'); }
  finally { await services.pool.end(); }
}
