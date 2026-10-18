import { createServices } from './auth.js';
import { createRouter } from './router.js';
let router;
export default async function handler(req, res) {
  try {
    router ??= createRouter(createServices());
    const origin = new URL(process.env.BETTER_AUTH_URL).origin;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    // Vercel supplies x-real-ip; do not trust user-supplied forwarded chains.
    let body;
    if (!['GET', 'HEAD'].includes(req.method)) {
      if (req.body !== undefined) body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      else { const chunks = []; let size = 0; for await (const chunk of req) { size += chunk.length; if (size > 600000) { res.statusCode = 413; res.end(); return; } chunks.push(chunk); } body = Buffer.concat(chunks); }
    }
    if (body && Buffer.byteLength(body) > 600000) { res.statusCode = 413; res.end(); return; }
    const response = await router(new Request(new URL(req.url, origin), { method: req.method, headers, body }));
    res.statusCode = response.status;
    for (const [key, value] of response.headers) if (key !== 'set-cookie') res.setHeader(key, value);
    const cookies = response.headers.getSetCookie();
    if (cookies.length) res.setHeader('Set-Cookie', cookies);
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.statusCode = 503;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Login er endnu ikke tilsluttet databasen. Prøv igen senere.' }));
  }
}
