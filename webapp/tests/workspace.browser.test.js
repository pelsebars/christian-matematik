import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + (req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!path.startsWith(root)) throw Error();
    res.setHeader('Content-Type', { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' }[extname(path)] || 'application/octet-stream');
    res.end(await readFile(path));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
try {
  for (const [name, engine] of [['WebKit', webkit], ['Chrome', chromium]]) {
    const browser = await engine.launch({ headless:true, ...(name === 'Chrome' ? { channel:'chrome' } : {}) });
    try {
      const page = await browser.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/?preview=1#normalDistribution/1/start`);
      await page.locator('.personal-overview').waitFor({ state:'attached' });
      assert.ok(await page.locator('*').count() < 10000, 'Inactive lessons stay outside the live document');
      const go = path => page.evaluate(path => window.showMathView(path), path);
      const card = page.locator('[data-int-card="norm.pre.percent"]');
      await card.locator('input').fill('0,25');
      await card.locator('button[type=submit]').click();
      await card.locator('[data-int-hint]').click();
      await card.evaluate(el => { window.originalCard = el; window.originalHint = el.querySelector('.int-hints p'); });
      await card.locator('input').evaluate(el => { el.focus(); el.value = '0,250'; el.setSelectionRange(2, 2); el.dispatchEvent(new Event('input', { bubbles:true })); });
      assert.equal(await card.locator('input').evaluate(el => el.selectionStart), 2, 'Typing retains the caret');
      assert.equal(await card.evaluate(el => el.querySelector('.int-hints p') === window.originalHint), true, 'Typing preserves unchanged hints');
      assert.equal(await card.locator('[data-feedback]').textContent(), '');
      await card.locator('button[type=submit]').click();
      assert.equal(await card.evaluate(el => el.classList.contains('is-correct')), true);
      await go('normalDistribution/1/taethed');
      const slider = page.locator('[data-normal-value=mean]').first();
      await slider.fill('12');
      const graph = await page.locator('[data-normal-density] [data-plot]').first().innerHTML();
      for (const [route, selector] of [
        ['normalDistribution/2/start', '#normal-module-two [data-int-card]'],
        ['normalDistribution/3/start', '#normal-module-three [data-int-card]'],
        ['differentialEquations/2/start', '#ode-module-two [data-int-card]'],
        ['vectorFunctions/3/start', '#vector-module-three [data-int-card]'],
        ['trigonometry/2/start', '#trig-module-2 [data-int-card]'],
        ['integration/2/start', '#integralLesson'],
        ['equations', '#equationLesson .exercise-card'],
        ['planeGeometry', '#planeGeometryLesson'],
        ['shop', '#shopView'],
        ['home', '.personal-overview'],
      ]) {
        await go(route);
        await page.locator(selector).first().waitFor({ state:'visible' });
        assert.equal(await page.locator('#normal-module-one [data-int-card]').count(), 0);
      }
      await go('normalDistribution/1/taethed');
      assert.equal(await slider.inputValue(), '12');
      assert.equal(await page.locator('[data-normal-density] [data-plot]').first().innerHTML(), graph);
      await go('normalDistribution/1/start');
      assert.equal(await card.evaluate(el => el === window.originalCard), true, 'Restore original nodes and listeners');
      assert.equal(await card.locator('input').inputValue(), '0,250');
      assert.equal(await card.locator('.int-hints p').count(), 1);
      await card.locator('[data-int-retry]').click();
      await card.locator('input').fill('0,25');
      await card.locator('button[type=submit]').click();
      assert.equal(await card.evaluate(el => el.classList.contains('is-correct')), true);
      await page.reload();
      await page.locator('.personal-overview').waitFor({ state:'attached' });
      assert.equal(await card.locator('input').inputValue(), '0,25');
      assert.equal(await card.evaluate(el => el.classList.contains('is-correct')), true);
      assert.deepEqual(errors, []);
      console.log(`${name}: bounded DOM, caret, feedback, answers/hints/graphs, course/module switching, original listeners and reload passed.`);
    } finally { await browser.close(); }
  }
} finally { server.closeAllConnections(); await new Promise(done => server.close(done)); }

// Exercise the real account store/API against an isolated, disposable database.
const { fixture } = await import('./account-fixture.js');
const f = await fixture(), browser = await webkit.launch({ headless:true });
try {
  const page = await browser.newPage();
  await page.goto(f.origin);
  await page.locator('#accountLanding').waitFor();
  await page.locator('.auth-tabs [data-auth-mode=signup]').click();
  await page.locator('#accountUsername').fill('webkit_workspace');
  await page.locator('#accountPassword').fill('local-workspace-test-password');
  await page.locator('#repeatPassword').fill('local-workspace-test-password');
  await page.locator('#accountSubmit').click();
  await page.locator('.personal-overview').waitFor({ state:'attached' });
  const go = path => page.evaluate(path => window.showMathView(path), path);
  const flush = () => page.evaluate(async () => (await import('/account/store.js')).flush());
  const data = () => page.evaluate(async () => (await fetch('/api/learning')).json());
  await go('normalDistribution/1/start');
  const first = page.locator('[data-int-card="norm.pre.percent"]');
  await first.locator('input').fill('0,25');
  await first.locator('button[type=submit]').click();
  await first.locator('[data-int-hint]').click();
  // Navigate away while the save is still pending.
  await go('trigonometry/1/start');
  assert.equal(await flush(), true);
  let saved = await data();
  assert.equal(saved.rewardPoints, 1);
  assert.equal(saved.completions.length, 1);
  const state = saved.states.find(s => s.namespace === 'christian-matematik.normal.introduction.v1');
  assert.equal(state.value.cards['norm.pre.percent'].answers.answer, '0,25');
  assert.equal(state.value.cards['norm.pre.percent'].hints, 1);
  await go('normalDistribution/1/start');
  await first.locator('button[type=submit]').click();
  assert.equal(await flush(), true);
  assert.equal((await data()).rewardPoints, 1, 'Restoring and checking again never doubles points');
  await go('normalDistribution/2/start');
  const second = page.locator('[data-int-card="norm2.pre.negative"]');
  // Use its published answer rather than depending on an unrelated exercise value.
  const { standardPre } = await import('../normal-standard-exercises.js');
  await second.locator('input').fill(String(standardPre.find(t => t.id === 'norm2.pre.negative').parts[0].answer));
  await second.locator('button[type=submit]').click();
  assert.equal(await flush(), true);
  saved = await data();
  assert.equal(saved.rewardPoints, 2);
  assert.equal(saved.completions.length, 2);
  await page.reload();
  await page.locator('.personal-overview').waitFor({ state:'attached' });
  await go('normalDistribution/1/start');
  assert.equal(await first.locator('input').inputValue(), '0,25');
  assert.equal(await first.locator('.int-hints p').count(), 1);
  assert.equal((await data()).rewardPoints, 2);
  console.log('WebKit accounts: pending saves survive navigation, persisted answers/hints and points survive reload, and retries never duplicate rewards.');
} finally { await browser.close(); await f.close(); }
