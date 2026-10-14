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
import {integrationAreaTasks as bank} from '../tasks/bank/integration-areas.js';
import {pagesForIntegralModule} from '../integral-routes.js';
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async p=>{await page.evaluate(p=>window.showMathView(p),p);await page.waitForFunction(p=>location.hash===`#${p}`,p);};
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 const range=async(id,v)=>page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},v);
 await page.goto(url+'/#integration');await page.locator('#int-forloeb').waitFor();
 assert.equal(await page.locator('#int-forloeb .module-card').nth(3).locator('strong').textContent(),'Åbent');
 await page.locator('[data-int-jump="int-modul-4"]').first().click();await page.waitForURL('**/#integration/4/start/1');
 for(const [i,id,v]of [[1,'equation','2'],[2,'parenthesis','right'],[3,'bounds','2'],[4,'upper','f'],[5,'units','area']]){
  await go(`integration/4/start/${i}`);const c=card('int4.pre.'+id);const f=c.locator('input,select').first();if(await c.locator('select').count())await f.selectOption(v);else await f.fill(v);await c.locator('button[type=submit]').click();assert.match(await c.locator('[data-feedback]').innerText(),/passer/);
 }
 assert.match(await page.locator('#int4-foundation-status').innerText(),/5 af 5/);
 await go('integration/4/start/2');await card('int4.pre.parenthesis').locator('select').selectOption('wrong');await card('int4.pre.parenthesis').locator('button[type=submit]').click();await card('int4.pre.parenthesis').locator('[data-int-jump]').click();assert.ok(await page.locator('#int4-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/4/start/2');
 await go('integration/4/teori/mellem');assert.match(await page.locator('#int4-readout').textContent(),/areal: cirka 3/);await page.locator('#int4-model').selectOption('cross');assert.match(await page.locator('#int4-readout').textContent(),/11,8333/);assert.match(await page.locator('#int4-readout').textContent(),/-10,6667/);assert.equal(await page.locator('#int4-segments tbody tr').count(),2);assert.deepEqual(await page.locator('#int4-segments tbody tr td:nth-child(3)').allTextContents(),['f','g']);await page.screenshot({path:'/tmp/matematik-integral-4-graphs.png',fullPage:true});
 await range('int4-a','3');assert.match(await page.locator('#int4-readout').textContent(),/areal: cirka 0/);
 await go('integration/4/teori/numerisk');assert.match(await page.locator('#int4-numeric-readout').textContent(),/Overslag: cirka 3/);await range('int4-n','32');assert.match(await page.locator('#int4-numeric-readout').textContent(),/2,668/);await page.locator('#int4-n').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#int4-n').inputValue(),'30');
 for(const [i,t]of bank.entries()){
  await go(`integration/4/oevelser/${i+1}`);const c=card(t.id);
  for(const p of t.parts){const f=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await f.selectOption(p.answer);else await f.fill(p.type==='text'?'Jeg kontrollerer grænser, fortegn og enheder.':p.answer);}
  await c.locator('button[type=submit]').click();for(const p of t.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).innerText(),p.type==='text'?/egen vurdering/:/passer/);await c.locator('summary').click();
 }
 await go('integration/4/oevelser/3');const split=card('int4.split');await split.locator('[name=area]').fill('0');await split.locator('button[type=submit]').click();assert.match(await split.locator('[data-feedback=area]').innerText(),/ikke det samlede areal/);await split.locator('[data-int-hint]').click();await split.locator('[data-int-hint]').click();await page.reload();await split.waitFor();assert.equal(await split.locator('[name=area]').inputValue(),'0');assert.equal(await split.locator('.int-hints p').count(),2);await split.locator('[data-int-retry]').click();assert.equal(await split.locator('.int-hints p').count(),0);
 for(const [i,id,v]of [[1,'split','split'],[2,'add','2'],[3,'trapezoid','1'],[4,'parameter','3']]){await go(`integration/4/sluttjek/${i}`);const c=card('int4.final.'+id);if(await c.locator('select').count())await c.locator('select').selectOption(v);else await c.locator('input').fill(v);await c.locator('button[type=submit]').click();}
 assert.match(await page.locator('#int4-final-status').textContent(),/4 af 4/);
 await page.setViewportSize({width:390,height:844});
 for(const path of pagesForIntegralModule('4')){await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const clipped=await page.locator('#int4-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);}
 assert.ok(await page.locator('#int4-lesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));
 assert.ok(await page.locator('#int4-lesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));
 assert.ok(await page.locator('#int4-lesson msubsup').evaluateAll(nodes=>nodes.every(n=>n.children.length===3)));
 await go('integration/4/teori/numerisk');await page.screenshot({path:'/tmp/matematik-integral-4-mobile.png',fullPage:true});await go('integration/4/opsummering');await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/repetition');await page.goBack();await page.waitForURL('**/#integration/4/opsummering');
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('180');await page.locator('[name=seed]').fill('areas-exam');await page.locator('#taskSetup details summary').click();for(const id of ['int.1','int.2','int.3','int.4'])await page.locator(`[data-completed="${id}"]`).check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();
 const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.ok(session.items.some(t=>t.id.startsWith('int4.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);
 for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.ok(!(await page.locator('.task-question').innerText()).includes('Læringsmål'));}
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="int.4"]').first().click();await page.waitForURL('**/#integration/4/start/1');assert.ok(await page.locator('#int4-start').isVisible());
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/#integration/4');await bp.locator('#int4-storage-warning').waitFor();await bp.locator('[data-int-card="int4.pre.equation"] input').fill('2');assert.match(await bp.locator('#int4-storage-warning').innerText(),/kan ikke gemme/);
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.areas.v1','{"version":99}'));const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration/4');await cp.locator('#int4-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('Module 4: all 28 pages, bank answers, interval split, trapezoids, keyboard, persistence, mobile MathML and storage failures passed; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
