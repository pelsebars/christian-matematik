import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import pg from 'pg';
import { checkServerIdentity } from 'node:tls';

export function createServices(env = process.env) {
  if (!env.DATABASE_URL || !env.BETTER_AUTH_SECRET || !env.BETTER_AUTH_URL) {
    throw new Error('DATABASE_URL, BETTER_AUTH_SECRET og BETTER_AUTH_URL skal konfigureres.');
  }
  if (env.BETTER_AUTH_SECRET.length < 32) throw new Error('Loginhemmeligheden skal være mindst 32 tegn.');
  const origin = new URL(env.BETTER_AUTH_URL).origin;
  if (!origin.startsWith('https://') && !/^http:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(origin)) throw new Error('HTTPS kræves.');
  // Railway's TCP proxy preserves TLS; its certificate names the internal service.
  const ssl = env.DATABASE_CA_CERT ? {
    ca: env.DATABASE_CA_CERT, rejectUnauthorized: true,
    checkServerIdentity: (_host, cert) => checkServerIdentity(env.DATABASE_TLS_NAME || new URL(env.DATABASE_URL).hostname, cert),
  } : undefined;
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL, ssl, max: 3, idleTimeoutMillis: 10000, connectionTimeoutMillis: 10000 });
  const auth = betterAuth({
    database: pool, secret: env.BETTER_AUTH_SECRET, baseURL: origin,
    trustedOrigins: [origin],
    emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128 },
    session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
    advanced: { ipAddress: { ipAddressHeaders: ['x-real-ip'] } },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 120,
      customRules: { '/sign-in/username': { window: 60, max: 10 }, '/sign-up/email': { window: 60, max: 5 } } },
    plugins: [username({ minUsernameLength: 3, maxUsernameLength: 30,
      usernameValidator: value => /^[a-z0-9_]{3,30}$/.test(value) })],
  });
  return { pool, auth, origin };
}
