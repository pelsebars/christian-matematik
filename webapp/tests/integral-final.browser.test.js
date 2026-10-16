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
import {integrationDefiniteSubstitutionTasks as bank} from '../tasks/bank/integration-definite-substitution.js';
import {pagesForIntegralModule} from '../integral-routes.js';
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async p=>{await page.evaluate(p=>window.showMathView(p),p);await page.waitForFunction(p=>location.hash===`#${p}`,p);};
 const card=id=>page.locator(`[data-int-card="${id}"]`),range=async(id,v)=>page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},v);
 const answer=async(id,path,v)=>{await go('integration/7/'+path);const c=card(id);if(await c.locator('select').count())await c.locator('select').selectOption(v);else await c.locator('input').fill(v);await c.locator('button[type=submit]').click();};
 await page.goto(url+'/#integration');await page.locator('#int-forloeb').waitFor();assert.deepEqual(await page.locator('#int-forloeb .module-card strong').allTextContents(),Array(8).fill('Åbent'));await page.locator('[data-int-jump="int-modul-7"]').first().click();await page.waitForURL('**/#integration/7/start/1');
 for(const [i,id,v]of [[1,'first','1'],[2,'last','5'],[3,'differential','right'],[4,'reverse','-2'],[5,'bounds','4']])await answer('int7.pre.'+id,'start/'+i,v);assert.match(await page.locator('#int7-foundation-status').textContent(),/5 af 5/);
 await answer('int7.pre.reverse','start/4','2');await card('int7.pre.reverse').locator('[data-int-jump]').click();assert.ok(await page.locator('#int7-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/7/start/4');
 for(const [id,path,v]of [['bounds','graenser','right'],['orientation','fortegn','-1'],['routes','metoder','back'],['geometry','anvendelser','right'],['numeric','opsamling','refine']]){await answer('int7.mini.'+id,'teori/'+path,v);assert.match(await card('int7.mini.'+id).locator('[data-feedback]').textContent(),/passer/);}
 await go('integration/7/teori/fortegn');assert.match(await page.locator('#int7-readout').textContent(),/integral: cirka 2,3333/);await range('int7-a','-1');assert.match(await page.locator('#int7-readout').textContent(),/integral: cirka 0/);assert.match(await page.locator('#int7-readout').textContent(),/areal: cirka 4,6667/);await range('int7-a','1');await range('int7-b','0');assert.match(await page.locator('#int7-readout').textContent(),/integral: cirka -2,3333/);assert.match(await page.locator('#int7-readout').textContent(),/går baglæns/);
 await page.locator('#int7-case').selectOption('trig');assert.match(await page.locator('#int7-readout').textContent(),/rækkefølge: 0 til -1/);assert.match(await page.locator('#int7-readout').textContent(),/integral: cirka 0,3333/);await range('int7-a','2');assert.match(await page.locator('#int7-readout').textContent(),/Grænserne er ens/);await page.locator('#int7-case').selectOption('log');await page.locator('#int7-a').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#int7-a').inputValue(),'-0.5');await page.screenshot({path:'/tmp/matematik-integral-7-desktop.png',fullPage:true});
 await go('integration/7/teori/opsamling');assert.match(await page.locator('#int7-numeric caption').textContent(),/Trapezsummer/);const coarse=await page.locator('#int7-numeric tbody').textContent();await range('int7-n','128');assert.notEqual(await page.locator('#int7-numeric tbody').textContent(),coarse);assert.match(await page.locator('#int7-numeric tbody').textContent(),/7,6391/);
 for(const [i,t]of bank.entries()){await go(`integration/7/oevelser/${i+1}`);const c=card(t.id);for(const p of t.parts){const f=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await f.selectOption(p.answer);else await f.fill(p.type==='text'?'Jeg kontrollerer variabel, grænser, fortegn, integrand, domæne og enheder.':p.answer);}await c.locator('button[type=submit]').click();for(const p of t.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).textContent(),p.type==='text'?/egen vurdering/:/passer/);await c.locator('summary').click();}
 await go('integration/7/oevelser/1');const power=card('int7.power');await power.locator('[name=transformed]').selectOption('old');await power.locator('button[type=submit]').click();assert.match(await power.locator('[data-feedback=transformed]').textContent(),/gamle grænser/);await power.locator('[data-int-hint]').click();await power.locator('[data-int-hint]').click();await go('integration/6/start/1');await go('integration/7/oevelser/1');await page.reload();await power.waitFor();assert.equal(await power.locator('[name=transformed]').inputValue(),'old');assert.equal(await power.locator('.int-hints p').count(),2);await power.locator('[data-int-retry]').click();assert.equal(await power.locator('.int-hints p').count(),0);await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration/7/oevelser/2');await page.goBack();await power.waitFor();
 for(const [i,id,v]of [[1,'trig','1'],[2,'bounds','right'],[3,'domain','no'],[4,'model','change']])await answer('int7.final.'+id,'sluttjek/'+i,v);assert.match(await page.locator('#int7-final-status').textContent(),/4 af 4/);await answer('int7.final.domain','sluttjek/3','zero');assert.match(await page.locator('#int7-final-status').textContent(),/3 af 4/);
 await page.setViewportSize({width:390,height:844});for(const path of pagesForIntegralModule('7')){await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);if(path.endsWith('teori/graenser'))await page.locator('#int7-graenser > details > summary').click();if(path.endsWith('teori/metoder'))await page.locator('#int7-metoder > details > summary').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const clipped=await page.locator('#int7-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);}
 assert.ok(await page.locator('#int7-lesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));assert.ok(await page.locator('#int7-lesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));assert.ok(await page.locator('#int7-lesson msubsup').evaluateAll(nodes=>nodes.every(n=>n.children.length===3)));assert.ok(await page.locator('#int7-lesson mn').evaluateAll(nodes=>nodes.every(n=>n.children.length===0&&!n.textContent.includes('NaN'))));
 await go('integration/7/teori/fortegn');await page.locator('#int7-case').selectOption('trig');await page.screenshot({path:'/tmp/matematik-integral-7-mobile.png',fullPage:true});await go('integration/7/opsummering');assert.match(await page.locator('.int-page-controls a').last().textContent(),/hele forløbet/);await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/#integration');await page.locator('#int-forloeb').waitFor();
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('180');await page.locator('[name=seed]').fill('final-exam');await page.locator('#taskSetup details summary').click();for(const id of ['int.1','int.2','int.3','int.4','int.rep','int.5','int.6','int.7'])await page.locator(`[data-completed="${id}"]`).check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.ok(session.items.some(t=>t.id.startsWith('int7.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.ok(!(await page.locator('.task-question').innerText()).includes('Læringsmål'));}await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="int.7"]').first().click();await page.waitForURL('**/#integration/7/start/1');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/#integration/7');await bp.locator('#int7-storage-warning').waitFor();await bp.locator('[data-int-card="int7.pre.first"] input').fill('1');assert.match(await bp.locator('#int7-storage-warning').textContent(),/kan ikke gemme/);const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.final.v1','{"version":99}'));const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration/7');await cp.locator('#int7-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('Module 7: all 28 pages, transformed/reversed/equal bounds, nonmonotone substitution, numerical refinements, capstone tasks, mobile MathML, persistence, exams, repetition and course ending passed; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
