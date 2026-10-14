// Run with Playwright installed, or PLAYWRIGHT_MODULE_PATH pointing to its index.mjs.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, extname } from "node:path";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href
    : "playwright"
);
const dir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const server = createServer(async (req, res) => {
  try {
    const p = resolve(
      dir,
      "." +
        decodeURIComponent(
          req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0],
        ),
    );
    if (!p.startsWith(dir + "/")) throw Error("path");
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      }[extname(p)] || "text/plain",
    );
    res.end(await readFile(p));
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL
    ? { channel: process.env.BROWSER_CHANNEL }
    : {}),
});
import { integrationTasks } from '../tasks/bank/integration.js';
import { integralPages } from '../integral-routes.js';
const errors = [];
try {
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
 const page = await context.newPage();
 page.on('pageerror', e => errors.push(e.message));
 page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
 const go = async path => {
  await page.evaluate(path => window.showMathView(path), path);
  await page.waitForFunction(path => location.hash === `#${path}`, path);
 };
 const routes = {
  'int.pre.function': 'start/1', 'int.pre.derivative': 'start/2', 'int.pre.fraction': 'start/3', 'int.pre.sign': 'start/4', 'int.pre.power': 'start/5',
  'int.mini.definition': 'teori/begreb', 'int.mini.constant': 'teori/konstant', 'int.mini.rule': 'teori/potenser', 'int.mini.root': 'teori/grundregler',
  'int.final.definition': 'sluttjek/1', 'int.final.family': 'sluttjek/2', 'int.final.sum': 'sluttjek/3', 'int.final.log': 'sluttjek/4',
  ...Object.fromEntries(integrationTasks.map((t, i) => [t.id, `oevelser/${i + 1}`])),
 };
 const card = id => page.locator(`[data-int-card="${id}"]`);
 const openCard = id => go('integration/1/' + routes[id]);
 await page.goto(url + '/#integration');
 await page.locator('#int-forloeb').waitFor({ state: 'visible' });
 assert.equal(await page.locator('#int-start').isVisible(), false);
 assert.equal(await page.locator('#int-maal').isVisible(), false);
 assert.equal(await page.locator('[data-int-module="1"] [data-int-card]').count(), 20);
 assert.equal(await page.locator('#int-forloeb .module-card').count(), 8);
 assert.equal(await page.locator('#int-forloeb .module-card').nth(4).locator('.module-card-top span').innerText(), 'B-niveau 6–7');
 await page.locator('.int-goal-map > summary').click();
 assert.ok(await page.locator('#int-maal').isVisible());
 await page.locator('.int-goal-map > summary').click();
 for (const [id, path] of [['int-modul-6','6'],['int-modul-7','7']]) {
  await page.locator(`#int-forloeb [data-int-jump="${id}"]`).click();
  await page.waitForURL(`**/#integration/${path}`);
  assert.match(await page.locator('#' + id).innerText(), /Planlagt/);
  assert.equal(await page.locator('#int-forloeb').isVisible(), false);
  assert.equal(await page.locator('#int-start').isVisible(), false);
  await page.locator('.int-breadcrumb a').click();
  await page.locator('#int-forloeb').waitFor({ state: 'visible' });
 }
 await page.locator('#int-forloeb [data-int-jump="int-modul-1"]').click();
 await page.waitForURL('**/#integration/1/start/1');
 assert.ok(await page.locator('#int-modul-1').isVisible());
 await openCard('int.pre.fraction');
 await card('int.pre.fraction').locator('input').fill('3');
 await card('int.pre.fraction').locator('button[type=submit]').click();
 assert.match(await card('int.pre.fraction').locator('[data-feedback]').innerText(), /treere/);
 await card('int.pre.fraction').locator('[data-int-jump]').click();
 assert.ok(await page.locator('#int-grundkort').isVisible());
 assert.equal(await page.evaluate(() => document.activeElement.id), 'int-grundkort');
 assert.equal(await page.evaluate(() => location.hash), '#integration/1/start/3');
 for (const [id, value] of [['function','7'],['derivative','6'],['fraction','6/3'],['sign','1']]) {
  await openCard('int.pre.' + id);
  await card('int.pre.' + id).locator('input').fill(value);
  await card('int.pre.' + id).locator('button[type=submit]').click();
 }
 await openCard('int.pre.power');
 await card('int.pre.power').locator('select').selectOption('negative');
 await card('int.pre.power').locator('button[type=submit]').click();
 assert.match(await page.locator('#int-foundation-status').innerText(), /5 af 5/);
 for (const [id, answer] of [['definition','yes'],['constant','zero'],['rule','right'],['root','half']]) {
  await openCard('int.mini.' + id);
  await card('int.mini.' + id).locator('select').selectOption(answer);
  await card('int.mini.' + id).locator('button[type=submit]').click();
  assert.match(await card('int.mini.' + id).locator('[data-feedback]').innerText(), /passer/);
 }
 await openCard('int.polynomial');
 const poly = card('int.polynomial');
 await poly.locator('[name=expr]').fill('3x^3');
 await poly.locator('button[type=submit]').click();
 assert.match(await poly.locator('[data-feedback=expr]').innerText(), /mangler division/);
 await poly.locator('[data-int-hint]').click(); await poly.locator('[data-int-hint]').click();
 // Switch parts and teaching sessions without destroying live form state.
 await page.locator('.int-page-controls a').last().click();
 await card('int.sum').waitFor({ state: 'visible' });
 await page.locator('.int-page-controls a').first().click();
 assert.equal(await poly.locator('[name=expr]').inputValue(), '3x^3');
 assert.equal(await poly.locator('.int-hints p').count(), 2);
 await go('integration/2/start/1'); await openCard('int.polynomial');
 await page.reload(); await poly.waitFor({ state: 'visible' });
 assert.equal(await poly.locator('[name=expr]').inputValue(), '3x^3');
 assert.equal(await poly.locator('.int-hints p').count(), 2);
 assert.match(await poly.locator('[data-feedback=expr]').innerText(), /mangler division/);
 // Real browser Back/Forward restores the small page and active menu.
 await page.locator('.int-page-controls a').last().click(); await card('int.sum').waitFor({ state: 'visible' });
 await page.goBack(); await poly.waitFor({ state: 'visible' });
 assert.equal(await page.locator('[data-int-step][aria-current]').getAttribute('data-int-step'), 'oevelser');
 await page.goForward(); await card('int.sum').waitFor({ state: 'visible' });
 await openCard('int.polynomial');
 await poly.locator('[data-int-retry]').click();
 assert.equal(await poly.locator('[name=expr]').inputValue(), '');
 assert.equal(await poly.locator('.int-hints p').count(), 0);
 for (const t of integrationTasks) {
  await openCard(t.id); const c = card(t.id);
  for (const p of t.parts) {
   const field = c.locator(`[name="${p.id}"]`);
   if (p.type === 'choice') await field.selectOption(p.answer);
   else await field.fill(p.type === 'text' ? 'Jeg sammenligner med tjeklisten.' : p.answer);
  }
  await c.locator('button[type=submit]').click();
  for (const p of t.parts) assert.match(await c.locator(`[data-feedback="${p.id}"]`).innerText(), p.type === 'text' ? /egen vurdering/ : /passer/);
  await c.locator('summary').click();
 }
 await openCard('int.motion');
 await card('int.motion').locator('[name=position]').fill('3*x^2+2*x');
 await card('int.motion').locator('button[type=submit]').click();
 assert.match(await card('int.motion').locator('[data-feedback=position]').innerText(), /integrationsregel passer.*begyndelsespositionen/s);
 await openCard('int.sum');
 await card('int.sum').locator('[name=expr]').fill('<img src=x onerror=alert(1)>');
 await card('int.sum').locator('button[type=submit]').click();
 assert.equal(await card('int.sum').locator('.int-preview img').count(), 0);
 assert.match(await card('int.sum').locator('[data-feedback=expr]').innerText(), /ikke bedømmes sikkert/);
 for (const [id, answer] of [['definition','right'],['family','all'],['log','log']]) {
  await openCard('int.final.' + id);
  await card('int.final.' + id).locator('select').selectOption(answer);
  await card('int.final.' + id).locator('button[type=submit]').click();
 }
 await openCard('int.final.sum'); await card('int.final.sum').locator('input').fill('x*x-3x');
 await card('int.final.sum').locator('input').press('Enter');
 assert.match(await page.locator('#int-final-status').innerText(), /4 af 4/);
 await card('int.final.sum').locator('input').fill('x'); await page.reload();
 assert.match(await page.locator('#int-final-status').innerText(), /3 af 4/);
 await go('integration/1/teori/konstant');
 const before = await page.locator('#int-graph-readout').innerText();
 await page.locator('#int-c-slider').focus(); await page.keyboard.press('ArrowRight');
 assert.notEqual(await page.locator('#int-graph-readout').innerText(), before);
 assert.ok(await page.locator('#integralLesson math').evaluateAll(nodes => nodes.every(n => n.namespaceURI === 'http://www.w3.org/1998/Math/MathML')));
 assert.ok(await page.locator('#integralLesson msup').evaluateAll(nodes => nodes.every(n => n.children.length === 2)));
 // Each example, including the CAS logarithm, is reachable.
 for (let i = 1; i <= 6; i++) {
  await go(`integration/1/eksempler/${i}`);
  assert.equal(await page.locator('#int-step-eksempler .example-card:visible').count(), 1);
 }
 assert.match(await page.locator('#int-step-eksempler .example-card:visible').innerText(), /Logaritmen/);
 await page.locator('.nav-item[data-view=home]').click();
 await page.locator('.topic-card[data-view=integration]').click();
 assert.ok(await page.locator('#int-forloeb').isVisible());
 await page.screenshot({ path: '/tmp/matematik-integral-overview-desktop.png' });
 await go('integration/1/oevelser/1');
 await page.screenshot({ path: '/tmp/matematik-integral-session-desktop.png' });
 // Exam integration and targeted repetition lead to the session, not the overview.
 await page.locator('.nav-item[data-view=tasks]').click();
 await page.locator('[name=topics][value=integration]').check();
 await page.locator('#taskSetup details summary').click();
 await page.locator('[data-completed="int.1"]').check();
 await page.locator('[name=onlyCompleted]').check();
 await page.locator('[name=mode]').selectOption('exam'); await page.locator('[name=minutes]').fill('90');
 await page.locator('#taskSetup button[type=submit]').click();
 assert.equal(await page.locator('[data-task-action=jump]').count(), 7);
 assert.equal(await page.locator('[data-task-action=hint]').count(), 0);
 assert.equal(await page.locator('.task-feedback').count(), 0);
 assert.ok(!(await page.locator('#tasksView').innerText()).includes('Læringsmål'));
 const session = await page.evaluate(() => JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);
 await page.locator('[data-task-action=jump]').nth(session.items.findIndex(t => t.id === 'int.polynomial')).click();
 await page.locator('[data-part=expr]').fill('x^3'); await page.reload();
 assert.equal(await page.locator('[data-part=expr]').inputValue(), 'x^3');
 await page.locator('[data-task-action=finish]').click(); await page.locator('[data-task-action=submit]').click();
 assert.equal(await page.locator('.task-feedback').count(), 7);
 await page.locator('[data-task-action=repeat-module][data-module="int.1"]').first().click();
 await page.waitForURL('**/#integration/1/start/1');
 assert.ok(await page.locator('#int-start').isVisible());
 assert.equal(await page.locator('#int-forloeb').isVisible(), false);
 // Visit all small pages on a phone: exactly one part is visible, no clipped MathML.
 await page.setViewportSize({ width: 390, height: 844 });
 for (const path of integralPages) {
  await go(path);
  assert.equal(await page.locator('.int-step-panel:visible').count(), 1);
  if (!path.endsWith('opsummering')) assert.equal(await page.locator('[data-int-part-panel]:visible').count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const clipped = await page.locator('#integralLesson math:visible').evaluateAll(nodes => nodes.filter(n => {
   if (n.closest('.int-table, .int-solution, .int-formula')) return false;
   const r = n.getBoundingClientRect(); return r.width > 0 && (r.left < 0 || r.right > innerWidth + 1);
  }).map(n => n.outerHTML));
  assert.deepEqual(clipped, [], 'MathML outside scrolling regions must fit on mobile');
 }
 await go('integration/1/oevelser/1'); await page.screenshot({ path: '/tmp/matematik-integral-session-mobile.png' });
 await page.locator('.int-breadcrumb a').click(); await page.screenshot({ path: '/tmp/matematik-integral-overview-mobile.png' });
 // Direct URLs, normalization, planned sessions and keyboard navigation.
 await page.goto(url + '/#integration/1/teori/konstant');
 await page.locator('#int-konstant').waitFor({ state: 'visible' });
 await page.goto(url + '/#integration/1/unknown/<invalid>');
 await page.waitForURL('**/#integration/1/start/1');
 await page.goto(url + '/#integration/7'); await page.locator('#int-modul-7').waitFor({ state: 'visible' });
 assert.match(await page.title(), /Substitution/);
 await page.locator('.int-page-controls a').last().click(); await page.locator('#int-forloeb').waitFor({ state: 'visible' });
 await go('integration/1/teori/begreb');
 await page.locator('.int-step-menu [data-int-step=eksempler]').focus(); await page.keyboard.press('Enter');
 await page.waitForURL('**/#integration/1/eksempler/1');
 // Blocked/corrupt storage does not prevent navigating or answering.
 const blocked = await browser.newContext();
 await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw Error('blocked'); } }));
 const bp = await blocked.newPage(); bp.on('pageerror', e => errors.push(e.message));
 await bp.goto(url + '/#integration/1/start/3'); await bp.locator('#int-storage-warning').waitFor();
 assert.match(await bp.locator('#int-storage-warning').innerText(), /lagring er blokeret/);
 await bp.locator('[data-int-card="int.pre.fraction"] input').fill('2');
 assert.match(await bp.locator('#int-storage-warning').innerText(), /kan ikke gemme/);
 const corrupt = await browser.newContext(); await corrupt.addInitScript(() => localStorage.setItem('christian-matematik.integration.v1', '{"version":99}'));
 const cp = await corrupt.newPage(); cp.on('pageerror', e => errors.push(e.message));
 await cp.goto(url + '/#integration'); await cp.locator('#int-storage-warning').waitFor();
 assert.deepEqual(errors, []);
 console.log('Integral browser tests passed: separate sessions, all small pages, browser history, direct links, all exercises, hints, persisted state, exam repetition, mobile, MathML, keyboard, blocked/corrupt storage; no console errors.');
} finally { await browser.close(); await new Promise(done => server.close(done)); }
