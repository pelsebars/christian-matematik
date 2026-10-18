import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { createServices } from '../server/auth.js';
import { appServer } from '../server/http.js';
import { migrate } from '../scripts/migrate.js';
export async function fixture() {
  const db = await PGlite.create();
  const socket = new PGLiteSocketServer({ db, port: 0, host: '127.0.0.1', maxConnections: 10 });
  await socket.start();
  const app = appServer();
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${app.server.address().port}`;
  const conn = socket.getServerConn();
  const services = createServices({ DATABASE_URL: `postgresql://postgres:postgres@${conn}/postgres`, BETTER_AUTH_URL: origin, BETTER_AUTH_SECRET: 'local-test-secret-only-never-production-1234567890' });
  await migrate(services); app.configure(services);
  return { ...services, db, origin, async close() { app.server.closeAllConnections(); await new Promise(resolve => app.server.close(resolve)); await services.pool.end(); await socket.stop(); await db.close(); } };
}
