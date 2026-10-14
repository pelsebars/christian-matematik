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
import {integrationSolidTasks as bank} from '../tasks/bank/integration-solids.js';
import {pagesForIntegralModule} from '../integral-routes.js';
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async p=>{await page.evaluate(p=>window.showMathView(p),p);await page.waitForFunction(p=>location.hash===`#${p}`,p);};
 const card=id=>page.locator(`[data-int-card="${id}"]`),range=async(id,v)=>page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},v);
 const answer=async(id,path,v)=>{await go('integration/5/'+path);const c=card(id);if(await c.locator('select').count())await c.locator('select').selectOption(v);else await c.locator('input').fill(v);await c.locator('button[type=submit]').click();};
 await page.goto(url+'/#integration');await page.locator('#int-forloeb').waitFor();assert.equal(await page.locator('#int-forloeb .module-card').nth(5).locator('strong').textContent(),'Åbent');await page.locator('[data-int-jump="int-modul-5"]').first().click();await page.waitForURL('**/#integration/5/start/1');
 for(const [i,id,v]of [[1,'radius','6'],[2,'square','right'],[3,'bounds','8'],[4,'derivative','right'],[5,'units','volume']])await answer('int5.pre.'+id,'start/'+i,v);assert.match(await page.locator('#int5-foundation-status').textContent(),/5 af 5/);
 await answer('int5.pre.square','start/2','missing');await card('int5.pre.square').locator('[data-int-jump]').click();assert.ok(await page.locator('#int5-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/5/start/2');
 for(const [id,path,v]of [['disc','skiver','4'],['hole','hul','8'],['arc','kurvelaengde','3'],['model','modeller','inside'],['cas','cas','right']]){await answer('int5.mini.'+id,'teori/'+path,v);assert.match(await card('int5.mini.'+id).locator('[data-feedback]').textContent(),/passer/);}
 await go('integration/5/teori/skiver');assert.match(await page.locator('#int5-volume-readout').textContent(),/12 gange pi/);await page.locator('#int5-model').selectOption('washer');assert.match(await page.locator('#int5-volume-readout').textContent(),/indre radius: 1/);assert.match(await page.locator('#int5-volume-readout').textContent(),/9 gange pi/);await page.locator('#int5-model').selectOption('cone');await range('int5-cut','2');assert.match(await page.locator('#int5-volume-readout').textContent(),/Ydre radius: 2/);await range('int5-count','2');assert.equal(await page.locator('[data-int5-slice]').count(),4);assert.match(await page.locator('#int5-volume-readout').textContent(),/7,854/);await range('int5-count','40');assert.equal(await page.locator('[data-int5-slice]').count(),80);assert.match(await page.locator('#int5-volume-readout').textContent(),/8,3763/);await page.locator('#int5-cut').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#int5-cut').inputValue(),'1.75');await page.screenshot({path:'/tmp/matematik-integral-5-volume-desktop.png',fullPage:true});
 await go('integration/5/teori/kurvelaengde');await range('int5-arc-count','2');const small=await page.locator('#int5-arc-readout').textContent();await range('int5-arc-count','64');const large=await page.locator('#int5-arc-readout').textContent();assert.notEqual(small,large);assert.match(large,/4,6467/);await page.locator('#int5-arc-model').selectOption('line');assert.match(await page.locator('#int5-arc-readout').textContent(),/præcise længde/);
 for(const [i,t]of bank.entries()){await go(`integration/5/oevelser/${i+1}`);const c=card(t.id);for(const p of t.parts){const f=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await f.selectOption(p.answer);else await f.fill(p.type==='text'?'Jeg kontrollerer radius, grænser, afledt og enheder.':p.answer);}await c.locator('button[type=submit]').click();for(const p of t.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).textContent(),p.type==='text'?/egen vurdering/:/passer/);await c.locator('summary').click();}
 await go('integration/5/oevelser/2');const washer=card('int5.washer');await washer.locator('input').fill('4');await washer.locator('button[type=submit]').click();assert.match(await washer.locator('[data-feedback=coefficient]').textContent(),/kvadreret afstanden/);await washer.locator('[data-int-hint]').click();await washer.locator('[data-int-hint]').click();await go('integration/repetition/start/1');await go('integration/5/oevelser/2');await page.reload();await washer.waitFor();assert.equal(await washer.locator('input').inputValue(),'4');assert.equal(await washer.locator('.int-hints p').count(),2);await washer.locator('[data-int-retry]').click();assert.equal(await washer.locator('.int-hints p').count(),0);await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/5/oevelser/3');await page.goBack();await washer.waitFor();
 for(const [i,id,v]of [[1,'disc','12'],[2,'hole','5'],[3,'arc','right'],[4,'height','right']])await answer('int5.final.'+id,'sluttjek/'+i,v);assert.match(await page.locator('#int5-final-status').textContent(),/4 af 4/);await answer('int5.final.disc','sluttjek/1','6');assert.match(await page.locator('#int5-final-status').textContent(),/3 af 4/);
 await page.setViewportSize({width:390,height:844});for(const path of pagesForIntegralModule('5')){await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);if(path.endsWith('teori/cas'))await page.locator('#int5-cas > details > summary').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const clipped=await page.locator('#int5-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);}
 assert.ok(await page.locator('#int5-lesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));assert.ok(await page.locator('#int5-lesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));assert.ok(await page.locator('#int5-lesson msubsup').evaluateAll(nodes=>nodes.every(n=>n.children.length===3)));assert.ok(await page.locator('#int5-lesson mn').evaluateAll(nodes=>nodes.every(n=>n.children.length===0&&!n.textContent.includes('NaN'))));
 await go('integration/5/teori/kurvelaengde');await page.locator('#int5-arc-model').selectOption('curve');await range('int5-arc-count','4');await page.screenshot({path:'/tmp/matematik-integral-5-mobile.png',fullPage:true});await go('integration/5/opsummering');await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/6');assert.match(await page.locator('#int-modul-6').textContent(),/Planlagt/);
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('180');await page.locator('[name=seed]').fill('solid-exam');await page.locator('#taskSetup details summary').click();for(const id of ['int.3','int.4','int.rep','int.5'])await page.locator(`[data-completed="${id}"]`).check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.ok(session.items.some(t=>t.id.startsWith('int5.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.ok(!(await page.locator('.task-question').innerText()).includes('Læringsmål'));}await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="int.5"]').first().click();await page.waitForURL('**/#integration/5/start/1');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/#integration/5');await bp.locator('#int5-storage-warning').waitFor();await bp.locator('[data-int-card="int5.pre.radius"] input').fill('6');assert.match(await bp.locator('#int5-storage-warning').textContent(),/kan ikke gemme/);const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.solids.v1','{"version":99}'));const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration/5');await cp.locator('#int5-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('Module 5: all 28 pages, discs and washers, arc controls, model tasks, feedback, persistence, mobile MathML, keyboard, exams and repetition passed; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
