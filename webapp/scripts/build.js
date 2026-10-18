import { mkdir, readdir, cp, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url), out = new URL('../dist/', import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const file of await readdir(root)) {
  if (/\.(html|css|js|svg)$/.test(file)) await cp(new URL(file, root), new URL(file, out));
}
for (const folder of ['tasks', 'account']) await cp(new URL(folder, root), new URL(folder, out), { recursive: true });
console.log('Statiske appfiler bygget i dist/. Serverkode og hemmeligheder medtages ikke.');
