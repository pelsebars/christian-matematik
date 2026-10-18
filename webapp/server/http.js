import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRouter } from './router.js';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
export function appServer() {
  let router;
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://127.0.0.1:${server.address().port}`);
      if (url.pathname.startsWith('/api/')) {
        if (!router) { res.writeHead(503); res.end(); return; }
        const chunks = []; let size = 0;
        for await (const chunk of req) { size += chunk.length; if (size > 600000) { res.writeHead(413); res.end(); return; } chunks.push(chunk); }
        const headers = new Headers(req.headers);
        headers.set('x-real-ip', req.socket.remoteAddress);
        const response = await router(new Request(url, { method: req.method, headers, ...(!['GET','HEAD'].includes(req.method) ? { body: Buffer.concat(chunks) } : {}) }));
        res.statusCode = response.status;
        for (const [key, value] of response.headers) if (key !== 'set-cookie') res.setHeader(key, value);
        if (response.headers.getSetCookie().length) res.setHeader('set-cookie', response.headers.getSetCookie());
        res.end(Buffer.from(await response.arrayBuffer())); return;
      }
      const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
      if (!path.startsWith(root)) { res.writeHead(404); res.end(); return; }
      const content = await readFile(path);
      res.setHeader('Content-Type', { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml' }[extname(path)] || 'application/octet-stream');
      res.end(content);
    } catch { res.writeHead(404); res.end('Ikke fundet'); }
  });
  return { server, configure: services => { router = createRouter(services); } };
}
