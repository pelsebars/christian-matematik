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
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(120000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const origin=`http://127.0.0.1:${server.address().port}`;
 await page.goto(origin+'/?preview=1#tasks');await page.locator('#tasksView h1').waitFor();
 await page.locator('#tasksView a[href="#termExam"]').click();
 const root=page.locator('#termExamView');await root.locator('h1').waitFor();assert.ok(await root.isVisible());
 assert.equal(await root.locator('.term-task').count(),16);assert.equal(await root.locator('.term-part').count(),25);
 assert.equal(await root.locator('[data-manual]').count(),0);assert.ok(await root.locator('[data-answer="1.a"]').isDisabled());
 await root.locator('[data-term="start"]').click();await root.locator('[data-answer="1.a"]').fill('22');
 await root.locator('[data-term="pause"]').click();assert.equal(await root.locator('[data-term="pause"]').textContent(),'FORTSÆT');assert.ok(await root.locator('[data-answer="1.a"]').isDisabled());
 await page.reload();await root.locator('h1').waitFor();assert.equal(await root.locator('[data-answer="1.a"]').inputValue(),'22');assert.equal(await root.locator('[data-term="pause"]').textContent(),'FORTSÆT');
 await root.locator('[data-term="pause"]').click();assert.ok(await root.locator('[data-answer="1.a"]').isEnabled());
 await page.evaluate(()=>{const k='christian-matematik.termExam.august2026.v1',s=JSON.parse(localStorage.getItem(k));s.elapsed=2*3600000;s.runningSince=Date.now();localStorage.setItem(k,JSON.stringify(s));});
 await page.reload();await root.locator('h1').waitFor();assert.ok(await root.locator('[data-answer="1.a"]').isDisabled());assert.ok(await root.locator('[data-answer="10.b"]').isEnabled());
 await root.locator('[data-answer="10.b"]').fill('42,62%');
 assert.ok(await root.locator('.term-toolbar').evaluate(el=>el.getBoundingClientRect().top>=0 && el.getBoundingClientRect().top<20));
 await page.screenshot({path:'/tmp/matematik-term-desktop.png',fullPage:false});
 page.once('dialog',d=>d.dismiss());await root.locator('[data-term="finish"]').click();assert.equal(await root.locator('[data-manual]').count(),0);
 page.once('dialog',d=>d.accept());await root.locator('[data-term="finish"]').click();
 assert.equal(await root.locator('[data-manual]').count(),25);assert.match(await root.locator('.term-score').textContent(),/^20 \/ 250/);
 await root.locator('[data-manual="1.b"]').selectOption('7');assert.match(await root.locator('.term-score').textContent(),/^27 \/ 250/);
 await root.locator('[data-full="1.b"]').check();assert.match(await root.locator('.term-score').textContent(),/^30 \/ 250/);
 await root.locator('[data-full="1.b"]').uncheck();assert.match(await root.locator('.term-score').textContent(),/^20 \/ 250/);
 await root.locator('[data-manual="1.b"]').selectOption('7');
 await page.reload();await root.locator('h1').waitFor();assert.match(await root.locator('.term-score').textContent(),/^27 \/ 250/);assert.ok(await root.locator('[data-answer="10.b"]').isDisabled());
 await page.screenshot({path:'/tmp/matematik-term-result.png',fullPage:false});
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('#sidebar').getBoundingClientRect().right<=0);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/matematik-term-mobile.png',fullPage:false});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // A closed browser crossing the deadline must submit on reopening.
 await page.evaluate(()=>{const k='christian-matematik.termExam.august2026.v1',s=JSON.parse(localStorage.getItem(k));s.status='running';s.elapsed=0;s.runningSince=Date.now()-6*3600000;s.manual={};localStorage.setItem(k,JSON.stringify(s));});
 await page.reload();await root.locator('.term-score').waitFor();assert.equal(await root.locator('#termClockTotal').textContent(),'05:00:00');assert.ok(await root.locator('[data-answer="16.b"]').isDisabled());
 assert.deepEqual(errors,[]);console.log('Term exam browser: navigation, 25 questions, pause/reload, two-hour lock, submission, manual scores, deadline and mobile passed.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
