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
import {integrationDefiniteTasks} from '../tasks/bank/integration-definite.js';
import {pagesForIntegralModule} from '../integral-routes.js';
const errors=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async path=>{await page.evaluate(p=>window.showMathView(p),path);await page.waitForFunction(p=>location.hash===`#${p}`,path);};
 const routes={
  'int3.pre.function':'start/1','int3.pre.primitive':'start/2','int3.pre.power':'start/3','int3.pre.subtract':'start/4','int3.pre.units':'start/5',
  'int3.mini.area':'teori/areal','int3.mini.ftc':'teori/hovedsaetning','int3.mini.compute':'teori/beregning','int3.mini.signed':'teori/fortegn','int3.mini.model':'teori/modeller',
  'int3.final.compute':'sluttjek/1','int3.final.table':'sluttjek/2','int3.final.signed':'sluttjek/3','int3.final.model':'sluttjek/4',
  ...Object.fromEntries(integrationDefiniteTasks.map((t,i)=>[t.id,`oevelser/${i+1}`])),
 };
 const card=id=>page.locator(`[data-int-card="${id}"]`),openCard=id=>go('integration/3/'+routes[id]);
 const answer=async(id,value)=>{await openCard(id);const c=card(id);if(await c.locator('select').count())await c.locator('select').selectOption(value);else await c.locator('input').fill(value);await c.locator('button[type=submit]').click();};
 await page.goto(url+'/#integration');await page.locator('#int-forloeb').waitFor({state:'visible'});
 assert.equal(await page.locator('#int-forloeb .module-card').nth(2).locator('strong').textContent(),'Åbent');
 await page.locator('#int-forloeb [data-int-jump="int-modul-3"]').click();await page.waitForURL('**/#integration/3/start/1');assert.ok(await page.locator('#int-modul-3').isVisible());assert.equal(await page.locator('#int2-start').isVisible(),false);
 await answer('int3.pre.power','-4');assert.match(await card('int3.pre.power').locator('[data-feedback]').innerText(),/hele det negative tal/);
 await card('int3.pre.power').locator('[data-int-jump]').click();assert.ok(await page.locator('#int3-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/3/start/3');
 for(const [id,v]of [['function','5'],['primitive','right'],['power','4'],['subtract','8'],['units','meters']])await answer('int3.pre.'+id,v);
 assert.match(await page.locator('#int3-foundation-status').innerText(),/5 af 5/);
 for(const [id,v]of [['area','6'],['ftc','4'],['compute','10'],['signed','no'],['model','change']]){await answer('int3.mini.'+id,v);assert.match(await card('int3.mini.'+id).locator('[data-feedback]').innerText(),/passer/);}
 // Interactive plot: cancellation, reversed/equal bounds and converging rectangle overshoot.
 await go('integration/3/teori/areal');
 const range=async(id,value)=>page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},value);
 await page.locator('#int3-model').selectOption('cross');
 assert.match(await page.locator('#int3-graph-readout').textContent(),/Geometrisk areal.*1/);
 assert.equal(await page.locator('#int3-graph-readout math').first().textContent(),'∫02f(x)dx=0');
 await page.locator('#int3-model').selectOption('positive');await range('int3-a','2');await range('int3-b','0');
 assert.match(await page.locator('#int3-graph-readout').textContent(),/−4/);assert.match(await page.locator('#int3-graph-readout').innerText(),/baglæns/);
 await range('int3-a','0');assert.match(await page.locator('#int3-graph-readout').innerText(),/bredde nul/);
 await range('int3-b','2');await page.locator('#int3-show-rectangles').check();await range('int3-n','2');
 assert.match(await page.locator('#int3-rectangle-readout').textContent(),/overslaget 2/);
 await range('int3-n','40');assert.match(await page.locator('#int3-rectangle-readout').textContent(),/3,9/);
 await page.screenshot({path:'/tmp/matematik-integral-3-graph-desktop.png',fullPage:true});
 // All task types, specific wrong-answer paths and local persistence.
 for(const task of integrationDefiniteTasks){await openCard(task.id);const c=card(task.id);for(const p of task.parts){const field=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(p.answer);else await field.fill(p.type==='text'?'Jeg angiver grænser, enheder og kontrol.':p.answer);}await c.locator('button[type=submit]').click();for(const p of task.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).innerText(),p.type==='text'?/egen vurdering/:/passer/);await c.locator('summary').click();}
 await openCard('int3.table');await card('int3.table').locator('input').fill('5');await card('int3.table').locator('button[type=submit]').click();assert.match(await card('int3.table').locator('[data-feedback]').innerText(),/oprindelige funktions værdier/);
 await openCard('int3.polynomial');await card('int3.polynomial').locator('[name=upper]').fill('6');await card('int3.polynomial').locator('button[type=submit]').click();assert.match(await card('int3.polynomial').locator('[data-feedback=upper]').innerText(),/potensregningen/);
 await openCard('int3.signed');await card('int3.signed').locator('[name=area]').fill('0');await card('int3.signed').locator('button[type=submit]').click();assert.match(await card('int3.signed').locator('[data-feedback=area]').innerText(),/ikke det geometriske areal/);
 await card('int3.signed').locator('[data-int-hint]').click();await card('int3.signed').locator('[data-int-hint]').click();
 await go('integration/1/teori/begreb');await openCard('int3.signed');await page.reload();await card('int3.signed').waitFor({state:'visible'});
 assert.equal(await card('int3.signed').locator('[name=area]').inputValue(),'0');assert.equal(await card('int3.signed').locator('.int-hints p').count(),2);
 await page.locator('.int-page-controls a').last().click();await card('int3.exponential').waitFor({state:'visible'});await page.goBack();await card('int3.signed').waitFor({state:'visible'});
 await card('int3.signed').locator('[data-int-retry]').click();assert.equal(await card('int3.signed').locator('.int-hints p').count(),0);
 for(const [id,v]of [['compute','1'],['table','7'],['signed','right'],['model','change']])await answer('int3.final.'+id,v);
 assert.match(await page.locator('#int3-final-status').innerText(),/4 af 4/);await openCard('int3.final.compute');await card('int3.final.compute').locator('input').fill('2');assert.match(await page.locator('#int3-final-status').innerText(),/3 af 4/);
 // Every address on mobile, including open solutions, has one visible part and correct MathML.
 await page.setViewportSize({width:390,height:844});
 for(const path of pagesForIntegralModule('3')){await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const clipped=await page.locator('#int3-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);}
 assert.ok(await page.locator('#int3-lesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));
 assert.ok(await page.locator('#int3-lesson msubsup').evaluateAll(nodes=>nodes.every(n=>n.children.length===3)));
 assert.ok(await page.locator('#int3-lesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));
 assert.ok(await page.locator('#int3-lesson mn').evaluateAll(nodes=>nodes.every(n=>n.children.length===0)));
 await go('integration/3/teori/areal');await page.locator('#int3-model').selectOption('curve');await range('int3-a','0');await range('int3-b','1');assert.match(await page.locator('#int3-graph-readout').textContent(),/≈0,667/);await page.locator('#int3-model').selectOption('cross');await range('int3-b','2');await page.screenshot({path:'/tmp/matematik-integral-3-graph-mobile.png',fullPage:true});
 await openCard('int3.polynomial');await page.screenshot({path:'/tmp/matematik-integral-3-exercise-mobile.png',fullPage:true});
 await go('integration/3/opsummering');await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/4');assert.match(await page.locator('#int-modul-4').innerText(),/Planlagt/);
 // Real exam has new tasks without hints or method metadata, and repeat opens module 3.
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('180');await page.locator('[name=seed]').fill('definite-exam');await page.locator('#taskSetup details summary').click();for(const id of ['int.1','int.2','int.3'])await page.locator(`[data-completed="${id}"]`).check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();
 const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.ok(session.items.some(t=>t.id.startsWith('int3.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);
 for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.ok(!(await page.locator('.task-question').innerText()).includes('Læringsmål'));}
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="int.3"]').first().click();await page.waitForURL('**/#integration/3/start/1');assert.ok(await page.locator('#int3-start').isVisible());
 // Unavailable or corrupt storage is reported without stopping the module.
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/#integration/3');await bp.locator('#int3-storage-warning').waitFor();await bp.locator('[data-int-card="int3.pre.function"] input').fill('5');assert.match(await bp.locator('#int3-storage-warning').innerText(),/kan ikke gemme/);
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.definite.v1','{"version":99}'));const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration/3');await cp.locator('#int3-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('Integral module 3 browser tests passed: all 28 parts, limits/sign/area/model feedback, plot and rectangle controls, persisted answers, mobile MathML, history, exams and repetition; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
