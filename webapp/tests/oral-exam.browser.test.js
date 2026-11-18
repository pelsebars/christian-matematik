import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const server = createServer(async (req, res) => {
 try {
  const path = new URL(req.url, 'http://localhost').pathname;
  const file = new URL('../dist/' + (path === '/' ? 'index.html' : path.slice(1)), import.meta.url);
  const data = await readFile(file);
  res.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'text/html');
  res.end(data);
 } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 const errors = []; page.on('pageerror', e => { errors.push(e.message); console.error(e.message); });
 await page.goto(`http://127.0.0.1:${server.address().port}/?preview=1#oralExam/1`);
 const oral = page.locator('#oralExamView');
 await oral.locator('h1').waitFor();
 await page.waitForFunction(() => document.documentElement.dataset.sidebarNavigation === 'ready', null, { timeout: 120000 });
 assert.equal(await oral.isVisible(), true);
 assert.equal(await page.locator('[data-page="home"]').isVisible(), false);
 assert.equal(await oral.locator('.oral-presentation > section').count(), 3);
 assert.equal(await oral.locator('svg').count(), 3);
 assert.equal(await page.locator('#nav-oral-exam .oral-pending').count(), 14);
 assert.equal(await page.locator('#nav-oral-exam a[aria-current="page"]').count(), 1);
 await oral.locator('summary').first().click();
 assert.equal(await oral.locator('details').first().getAttribute('open'), '');
 await page.screenshot({ path: '/tmp/matematik-oral-desktop.png', fullPage: true });
 await page.evaluate(() => window.showMathView('home'));
 assert.equal(await oral.isVisible(), false);
 await page.locator('[data-view="oralExam"]').click();
 await page.waitForURL(url => url.hash === '#oralExam/1');
 assert.equal(await oral.isVisible(), true);
 await page.reload(); await oral.locator('h1').waitFor();
 await page.setViewportSize({ width: 390, height: 844 });
 await page.screenshot({ path: '/tmp/matematik-oral-mobile.png', fullPage: true });
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 assert.ok(await oral.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
 assert.deepEqual(errors, []);
 console.log('Oral exam: direct route, menu, 3 sections, 3 figures, exercises, reload, desktop/mobile passed.');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
