import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import { fixture } from './account-fixture.js';

async function balance(page, expected) {
  // Node's clock keeps running even when the page's debounce timers are paused.
  for (let i = 0; i < 100; i++) {
    if (await page.locator('.workspace-points strong').textContent() === String(expected)) break;
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  assert.equal(await page.locator('.workspace-points strong').textContent(), String(expected));
  assert.equal(await page.locator('#rewardPoints').textContent(), String(expected));
}
const password = 'local-live-points-password';
const f = await fixture();
try {
  assert.equal((await fetch(f.origin + '/api/points')).status, 401);
  for (const [name, engine] of [['WebKit', webkit], ['Chrome', chromium]]) {
    const browser = await engine.launch({ headless:true, ...(name === 'Chrome' ? { channel:'chrome' } : {}) });
    try {
      const context = await browser.newContext(), page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(f.origin);
      await page.locator('#accountLanding').waitFor();
      await page.locator('.auth-tabs [data-auth-mode=signup]').click();
      const username = 'live_points_' + name.toLowerCase();
      await page.locator('#accountUsername').fill(username);
      await page.locator('#accountPassword').fill(password);
      await page.locator('#repeatPassword').fill(password);
      await page.locator('#accountSubmit').click();
      await page.locator('.personal-overview').waitFor();
      const userId = await page.evaluate(async () => (await import('/account/store.js')).user.id);
      await page.evaluate(() => window.showMathView('vectorFunctions/1/start'));
      // Finish the navigation save before pausing the ordinary save timer.
      assert.equal(await page.evaluate(async () => (await import('/account/store.js')).flush()), true);
      const otherContext = await browser.newContext(), other = await otherContext.newPage();
      const login = await otherContext.request.post(f.origin + '/api/auth/sign-in/username', {
        headers:{ Origin:f.origin }, data:{ username, password },
      });
      assert.equal(login.status(), 200);
      await other.clock.install({ time:Date.now() });
      await other.goto(f.origin + '/#vectorFunctions/1/start');
      await other.locator('.personal-overview').waitFor({ state:'attached' });
      await balance(other, 0);

      const now = Date.now();
      await page.clock.install({ time:now });
      await page.clock.pauseAt(now + 1000);
      const first = page.locator('[data-int-card="vf1.pre.coordinates"]');
      await first.locator('select').selectOption('right');
      const isSave = request => request.method() === 'PUT' && request.url().endsWith('/api/learning');
      await Promise.all([page.waitForRequest(isSave, { timeout:5000 }), first.locator('button[type=submit]').click()]);
      await balance(page, 1); // No refresh, manual flush, navigation or debounce timer.
      await page.clock.resume();
      await other.evaluate(() => window.dispatchEvent(new Event('focus')));
      await balance(other, 1);

      // An older balance request may finish after the next correct answer.
      let release;
      const gate = new Promise(resolve => { release = resolve; });
      await page.route('**/api/points', async route => { await gate; await route.fulfill({ json:{ userId, rewardPoints:0 } }); });
      const reading = page.waitForRequest(request => request.url().endsWith('/api/points'));
      await page.evaluate(() => { window.balanceRead = import('/account/store.js').then(store => store.refreshPoints()); });
      await reading;
      const second = page.locator('[data-int-card="vf1.pre.vector"]');
      await second.locator('select').selectOption('move');
      await second.locator('button[type=submit]').click();
      await balance(page, 2);
      release();
      assert.equal(await page.evaluate(() => window.balanceRead), false);
      await page.unroute('**/api/points');
      await balance(page, 2);
      // An already-open second device also catches up during its periodic check.
      await other.clock.fastForward(31000);
      await balance(other, 2);
      // An account switched in another tab must not relabel this user's balance.
      await page.route('**/api/points', route => route.fulfill({ json:{ userId:'another-account', rewardPoints:9000 } }));
      assert.equal(await page.evaluate(async () => (await import('/account/store.js')).refreshPoints()), false);
      await page.unroute('**/api/points');
      await balance(page, 2);

      const isSaveResponse = response => response.request().method() === 'PUT' && response.url().endsWith('/api/learning');
      await Promise.all([page.waitForResponse(isSaveResponse), second.locator('button[type=submit]').click()]);
      await balance(page, 2); // Rechecking never awards the same lesson twice.
      const third = page.locator('[data-int-card="vf1.pre.function"]');
      await third.locator('input').fill('999');
      await Promise.all([page.waitForResponse(isSaveResponse), third.locator('button[type=submit]').click()]);
      await balance(page, 2);
      const failSave = route => route.request().method() === 'PUT'
        ? route.fulfill({ status:503, json:{ message:'Midlertidig testfejl' } }) : route.continue();
      await page.route('**/api/learning', failSave);
      await third.locator('input').fill('7');
      await Promise.all([page.waitForResponse(isSaveResponse), third.locator('button[type=submit]').click()]);
      await balance(page, 2); // A failed save must not invent spendable points.
      await page.locator('#accountSync').filter({ hasText:'ikke synkroniseret' }).waitFor();
      await page.unroute('**/api/learning', failSave);
      await page.locator('#accountRetry').click();
      await balance(page, 3);
      const response = await page.request.get(f.origin + '/api/points');
      assert.equal(response.headers()['cache-control'], 'no-store');
      assert.deepEqual(await response.json(), { userId, rewardPoints:3 });
      await page.reload();
      await page.locator('.personal-overview').waitFor({ state:'attached' });
      await balance(page, 3);
      assert.deepEqual(errors, []);
      console.log(`${name}: live M1 balance without debounce/refresh, second-device focus/poll, stale-response protection, wrong/repeated answers, offline retry and persisted rewards passed.`);
    } finally { await browser.close(); }
  }
} finally { await f.close(); }
