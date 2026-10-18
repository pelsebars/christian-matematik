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
import {integrationSubstitutionTasks as bank} from '../tasks/bank/integration-substitution.js';
import {pagesForIntegralModule} from '../integral-routes.js';
const errors=[];
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async p=>{await page.evaluate(p=>window.showMathView(p),p);await page.waitForFunction(p=>location.hash===`#${p}`,p);};
 const card=id=>page.locator(`[data-int-card="${id}"]`),range=async(id,v)=>page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},v);
 const answer=async(id,path,v)=>{await go('integration/6/'+path);const c=card(id);if(await c.locator('select').count())await c.locator('select').selectOption(v);else await c.locator('input').fill(v);await c.locator('button[type=submit]').click();};
 await page.goto(url+'/?preview=1#integration');await page.locator('#int-forloeb').waitFor();assert.equal(await page.locator('#int-forloeb .module-card').nth(6).locator('strong').textContent(),'Åbent');await page.locator('[data-int-jump="int-modul-6"]').first().click();await page.waitForURL('**/*#integration/6/start/1');
 for(const [i,id,v]of [[1,'inner','right'],[2,'chain','right'],[3,'power','right'],[4,'factor','2'],[5,'domain','right']])await answer('int6.pre.'+id,'start/'+i,v);assert.match(await page.locator('#int6-foundation-status').textContent(),/5 af 5/);
 await answer('int6.pre.chain','start/2','missing');await card('int6.pre.chain').locator('[data-int-jump]').click();assert.ok(await page.locator('#int6-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/6/start/2');
 for(const [id,path,v]of [['chain','kaederegel','right'],['factor','substitution','2'],['linear','potenser','right'],['sign','logtrig','right'],['check','kontrol','factor']]){await answer('int6.mini.'+id,'teori/'+path,v);assert.match(await card('int6.mini.'+id).locator('[data-feedback]').textContent(),/passer/);}
 await go('integration/6/teori/substitution');for(let stage=0;stage<4;stage++){await page.locator(`[data-int6-stage="${stage}"]`).click();assert.equal(await page.locator(`[data-int6-stage="${stage}"]`).getAttribute('aria-pressed'),'true');assert.ok((await page.locator('#int6-stage math').count())>=1);}
 await page.locator('#int6-candidate').selectOption('wrong');assert.match(await page.locator('#int6-readout').textContent(),/forkert faktor/);await range('int6-slope','1');assert.match(await page.locator('#int6-readout').textContent(),/passer med integranden/);await range('int6-slope','4');await page.locator('#int6-slope').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#int6-slope').inputValue(),'3');
 await page.locator('#int6-case').selectOption('exponential');assert.equal(await page.locator('#int6-slope-controls').isVisible(),false);await range('int6-point','0');assert.match(await page.locator('#int6-readout').textContent(),/nulpunkt.*forkert/);await page.locator('#int6-case').selectOption('trig');await range('int6-point','1');assert.match(await page.locator('#int6-candidate-formula').textContent(),/−sin/);await page.locator('#int6-candidate').selectOption('correct');assert.match(await page.locator('#int6-readout').textContent(),/passer med integranden/);await page.screenshot({path:'/tmp/matematik-integral-6-desktop.png',fullPage:true});
 for(const [i,t]of bank.entries()){await go(`integration/6/oevelser/${i+1}`);const c=card(t.id);for(const p of t.parts){const f=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await f.selectOption(p.answer);else await f.fill(p.type==='text'?'Jeg viser indre afledt, omskrivning, domæne og kontrollen med kædereglen.':p.answer);}await c.locator('button[type=submit]').click();for(const p of t.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).textContent(),p.type==='text'?/egen vurdering/:/passer/);await c.locator('summary').click();}
 await go('integration/6/oevelser/3');const linear=card('int6.linear');await linear.locator('input').fill('(2*x-1)^5/5');await linear.locator('button[type=submit]').click();assert.match(await linear.locator('[data-feedback]').textContent(),/kompensation/);await linear.locator('[data-int-hint]').click();await linear.locator('[data-int-hint]').click();await go('integration/5/start/1');await go('integration/6/oevelser/3');await page.reload();await linear.waitFor();assert.equal(await linear.locator('input').inputValue(),'(2*x-1)^5/5');assert.equal(await linear.locator('.int-hints p').count(),2);await linear.locator('[data-int-retry]').click();assert.equal(await linear.locator('.int-hints p').count(),0);await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/*#integration/6/oevelser/4');await page.goBack();await linear.waitFor();
 await go('integration/6/oevelser/4');const log=card('int6.log');await log.locator('[name=family]').selectOption('noabs');await log.locator('button[type=submit]').click();assert.match(await log.locator('[data-feedback=family]').textContent(),/nævneren er negativ/);
 for(const [i,id,v]of [[1,'exponential','right'],[2,'linear','1/9'],[3,'log','right'],[4,'trig','right']])await answer('int6.final.'+id,'sluttjek/'+i,v);assert.match(await page.locator('#int6-final-status').textContent(),/4 af 4/);await answer('int6.final.linear','sluttjek/2','1/3');assert.match(await page.locator('#int6-final-status').textContent(),/3 af 4/);
 await page.setViewportSize({width:390,height:844});for(const path of pagesForIntegralModule('6')){await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);if(path.endsWith('teori/kaederegel'))await page.locator('#int6-kaederegel > details > summary').click();if(path.endsWith('teori/kontrol'))await page.locator('#int6-kontrol > details > summary').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const clipped=await page.locator('#int6-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);}
 assert.ok(await page.locator('#int6-lesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));assert.ok(await page.locator('#int6-lesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));assert.ok(await page.locator('#int6-lesson mn').evaluateAll(nodes=>nodes.every(n=>n.children.length===0&&!n.textContent.includes('NaN'))));
 await go('integration/6/teori/substitution');await page.locator('#int6-case').selectOption('exponential');await page.locator('[data-int6-stage="1"]').click();await page.screenshot({path:'/tmp/matematik-integral-6-mobile.png',fullPage:true});await go('integration/6/opsummering');await page.locator('.int-page-controls a').last().click();await page.waitForURL('**/*#integration/7/start/1');assert.ok(await page.locator('#int7-start').isVisible());
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('180');await page.locator('[name=seed]').fill('substitution-exam');await page.locator('#taskSetup details summary').click();for(const id of ['int.1','int.rep','int.6'])await page.locator(`[data-completed="${id}"]`).check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.ok(session.items.some(t=>t.id.startsWith('int6.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.ok(!(await page.locator('.task-question').innerText()).includes('Læringsmål'));}await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="int.6"]').first().click();await page.waitForURL('**/*#integration/6/start/1');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/?preview=1#integration/6');await bp.locator('#int6-storage-warning').waitFor();await bp.locator('[data-int-card="int6.pre.inner"] select').selectOption('right');assert.match(await bp.locator('#int6-storage-warning').textContent(),/kan ikke gemme/);const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.substitution.v1','{"version":99}'));const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/?preview=1#integration/6');await cp.locator('#int6-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('Module 6: all 28 pages, four substitution stages, factor/sign controls, logarithmic domains, all bank answers, persistence, mobile MathML, keyboard, exams and repetition passed; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
