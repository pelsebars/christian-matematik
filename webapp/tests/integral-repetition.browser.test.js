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
import {integrationRepetitionTasks as bank} from '../tasks/bank/integration-repetition.js';
import {pagesForIntegralModule} from '../integral-routes.js';
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async p=>{await page.evaluate(p=>window.showMathView(p),p);await page.waitForFunction(p=>location.hash===`#${p}`,p);};
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 const range=async(id,v)=>page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},v);
 const answer=async(id,path,v)=>{await go('integration/repetition/'+path);const c=card(id);if(await c.locator('select').count())await c.locator('select').selectOption(v);else await c.locator('input').fill(v);await c.locator('button[type=submit]').click();};
 await page.goto(url+'/#integration');await page.locator('#int-forloeb').waitFor();assert.equal(await page.locator('#int-forloeb .module-card').nth(4).locator('strong').textContent(),'Åbent');
 await page.locator('[data-int-jump="int-repetition"]').first().click();await page.waitForURL('**/#integration/repetition/start/1');assert.match(await page.locator('#subjectKicker').textContent(),/Faglig mellemstation/);assert.equal(await page.locator('#int4-start').isVisible(),false);
 for(const [i,id,v]of [[1,'power','8'],[2,'fraction','0.25'],[3,'function','7'],[4,'equation','2'],[5,'unique','no']])await answer('rep.pre.'+id,'start/'+i,v);
 assert.match(await page.locator('#rep-foundation-status').textContent(),/prøv sluttjekket direkte/);
 await answer('rep.pre.function','start/3','6');assert.match(await page.locator('#rep-foundation-status').textContent(),/Begynd med omvendte funktioner/);await card('rep.pre.function').locator('[data-int-jump]').click();assert.ok(await page.locator('#rep-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/repetition/start/3');
 for(const [id,path,v]of [['power','potenser','32'],['root','roedder','8'],['inverse','omvendt','3'],['domain','domaene','nonnegative'],['graph','graf','swap']]){await answer('rep.mini.'+id,'teori/'+path,v);assert.match(await card('rep.mini.'+id).locator('[data-feedback]').textContent(),/passer/);}
 await go('integration/repetition/teori/roedder');await page.locator('#rep-base').selectOption('16');await page.locator('#rep-exponent').selectOption('negative');assert.match(await page.locator('#rep-power-readout').textContent(),/0.25/);await page.locator('#rep-exponent').selectOption('three');assert.match(await page.locator('#rep-power-readout').textContent(),/=64/);
 await go('integration/repetition/teori/graf');await range('rep-input','2');assert.match(await page.locator('#rep-graph-readout').textContent(),/P har koordinater \(2; 5\).*Q har koordinater \(5; 2\)/);await page.locator('#rep-model').selectOption('full');assert.match(await page.locator('#rep-graph-readout').textContent(),/ikke en funktion/);await page.locator('#rep-model').selectOption('square');await range('rep-input','2');assert.match(await page.locator('#rep-graph-readout').textContent(),/Q har koordinater \(4; 2\)/);await page.locator('#rep-input').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#rep-input').inputValue(),'1.5');await page.screenshot({path:'/tmp/matematik-repetition-graph-desktop.png',fullPage:true});
 for(const [i,t]of bank.entries()){await go(`integration/repetition/oevelser/${i+1}`);const c=card(t.id);for(const p of t.parts){const f=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await f.selectOption(p.answer);else await f.fill(p.type==='text'?'Jeg kontrollerer domæne, entydighed og sammensætning.':p.answer);}await c.locator('button[type=submit]').click();for(const p of t.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).textContent(),p.type==='text'?/egen vurdering/:/passer/);await c.locator('summary').click();}
 await go('integration/repetition/oevelser/2');await card('rep.negative').locator('[name=reciprocal]').fill('-8');await card('rep.negative').locator('button[type=submit]').click();assert.match(await card('rep.negative').locator('[data-feedback=reciprocal]').textContent(),/ikke et negativt resultat/);
 await go('integration/repetition/oevelser/5');const square=card('rep.square');await square.locator('select').selectOption('reciprocal');await square.locator('button[type=submit]').click();assert.match(await square.locator('[data-feedback=inverse]').textContent(),/Reciprok er noget andet/);await square.locator('[data-int-hint]').click();await square.locator('[data-int-hint]').click();await go('integration/4/start/1');await go('integration/repetition/oevelser/5');await page.reload();await square.waitFor();assert.equal(await square.locator('select').inputValue(),'reciprocal');assert.equal(await square.locator('.int-hints p').count(),2);await square.locator('[data-int-retry]').click();assert.equal(await square.locator('.int-hints p').count(),0);
 await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/repetition/oevelser/6');await page.goBack();await square.waitFor();
 for(const [i,id,v]of [[1,'negative','1/9'],[2,'root','9'],[3,'inverse','5'],[4,'domain','positive']])await answer('rep.final.'+id,'sluttjek/'+i,v);
 assert.match(await page.locator('#rep-final-status').textContent(),/Potenser og rødder: 2 af 2.*Omvendte funktioner: 2 af 2/);await answer('rep.final.negative','sluttjek/1','-9');await go('integration/repetition/opsummering');assert.match(await page.locator('#rep-next').textContent(),/Gentag negative og rationale eksponenter/);
 await page.setViewportSize({width:390,height:844});
 for(const path of pagesForIntegralModule('repetition')){await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);if(path.endsWith('teori/potenser'))await page.locator('#rep-potenser > details > summary').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const clipped=await page.locator('#rep-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);}
 assert.ok(await page.locator('#rep-lesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));assert.ok(await page.locator('#rep-lesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));assert.ok(await page.locator('#rep-lesson mn').evaluateAll(nodes=>nodes.every(n=>n.children.length===0&&!n.textContent.includes('NaN'))));
 await go('integration/repetition/teori/graf');await page.locator('#rep-model').selectOption('full');await page.screenshot({path:'/tmp/matematik-repetition-mobile.png',fullPage:true});await go('integration/repetition/opsummering');await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/5');assert.match(await page.locator('#int-modul-5').textContent(),/Planlagt/);
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('90');await page.locator('#taskSetup details summary').click();await page.locator('[data-completed="int.rep"]').check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();
 const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.equal(session.items.length,7);assert.ok(session.items.every(t=>t.id.startsWith('rep.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.ok(!(await page.locator('.task-question').innerText()).includes('Læringsmål'));}
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="int.rep"]').first().click();await page.waitForURL('**/#integration/repetition/start/1');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/#integration/repetition');await bp.locator('#rep-storage-warning').waitFor();await bp.locator('[data-int-card="rep.pre.power"] input').fill('8');assert.match(await bp.locator('#rep-storage-warning').textContent(),/kan ikke gemme/);
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.repetition.v1','{"version":99}'));const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration/repetition');await cp.locator('#rep-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('B-repetition: all 28 pages, diagnostic paths, powers, inverses, domains, reflected graphs, all bank tasks, persistence, mobile MathML, keyboard, exam privacy and repetition passed; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
