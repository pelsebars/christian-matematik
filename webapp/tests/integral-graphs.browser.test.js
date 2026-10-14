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
import { integrationGraphTasks } from '../tasks/bank/integration-graphs.js';
import { pagesForIntegralModule } from '../integral-routes.js';
const errors=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async path=>{await page.evaluate(p=>window.showMathView(p),path);await page.waitForFunction(p=>location.hash===`#${p}`,path);};
 const routes={
  'int2.pre.function':'start/1','int2.pre.derivative':'start/2','int2.pre.equation':'start/3','int2.pre.slope':'start/4','int2.pre.sign':'start/5',
  'int2.mini.graph':'teori/sammenhaeng','int2.mini.shift':'teori/forskydning','int2.mini.zero':'teori/fortegn','int2.mini.point':'teori/punkt','int2.mini.tangent':'teori/tangent',
  'int2.final.sign':'sluttjek/1','int2.final.point':'sluttjek/2','int2.final.tangent':'sluttjek/3','int2.final.distinction':'sluttjek/4',
  ...Object.fromEntries(integrationGraphTasks.map((t,i)=>[t.id,`oevelser/${i+1}`])),
 };
 const card=id=>page.locator(`[data-int-card="${id}"]`),openCard=id=>go('integration/2/'+routes[id]);
 await page.goto(url+'/#integration');await page.locator('#int-forloeb').waitFor({state:'visible'});
 assert.equal(await page.locator('#int-forloeb .module-card').nth(1).locator('strong').textContent(),'Åbent');
 await page.locator('#int-forloeb [data-int-jump="int-modul-2"]').click();await page.waitForURL('**/#integration/2/start/1');
 assert.ok(await page.locator('#int-modul-2').isVisible());
 assert.equal(await page.locator('#int-start').isVisible(),false);
 assert.equal(await page.locator('#int2-lesson [data-int-card]').count(),21);
 assert.equal(await page.locator('.int-step-menu a').count(),6);
 await openCard('int2.pre.equation');await card('int2.pre.equation').locator('input').fill('0');
 await card('int2.pre.equation').locator('button[type=submit]').click();
 assert.match(await card('int2.pre.equation').locator('[data-feedback]').innerText(),/begge sider/);
 await card('int2.pre.equation').locator('[data-int-jump]').click();
 assert.ok(await page.locator('#int2-grundkort').isVisible());assert.equal(await page.evaluate(()=>location.hash),'#integration/2/start/3');
 for(const [id,value]of [['function','4'],['derivative','4'],['equation','-6'],['slope','4']]){
  await openCard('int2.pre.'+id);await card('int2.pre.'+id).locator('input').fill(value);await card('int2.pre.'+id).locator('button[type=submit]').click();
 }
 await openCard('int2.pre.sign');await card('int2.pre.sign').locator('select').selectOption('fall');await card('int2.pre.sign').locator('button[type=submit]').click();
 assert.match(await page.locator('#int2-foundation-status').innerText(),/5 af 5/);
 for(const [id,value]of [['graph','slope'],['shift','height'],['zero','no'],['point','2'],['tangent','1']]){
  await openCard('int2.mini.'+id);const c=card('int2.mini.'+id),select=c.locator('select');
  if(await select.count())await select.selectOption(value);else await c.locator('input').fill(value);
  await c.locator('button[type=submit]').click();assert.match(await c.locator('[data-feedback]').innerText(),/passer/);
 }
 // Graph: changing the constant changes height, while slope stays fixed.
 await go('integration/2/teori/sammenhaeng');
 await page.locator('#int2-x').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
 const before=await page.locator('#int2-graph-readout').textContent();assert.match(before,/f\(2\)=2/);
 await page.locator('#int2-c').focus();await page.keyboard.press('ArrowRight');
 const after=await page.locator('#int2-graph-readout').textContent();assert.notEqual(after,before);assert.match(after,/f\(2\)=2/);
 await page.locator('#int2-model').selectOption('touch');
 assert.match(await page.locator('#int2-graph-readout').innerText(),/intet ekstremum/);
 await page.locator('#int2-fit-point').click();assert.match(await page.locator('#int2-fit-status').innerText(),/hældningerne bevares/);
 assert.equal(await page.locator('#int2-c').inputValue(),'2');assert.equal(await page.locator('#int2-x').inputValue(),'0');
 await page.screenshot({path:'/tmp/matematik-integral-2-graph-desktop.png',fullPage:true});
 // Every exercise, own-review checklist and targeted error pathway.
 for(const task of integrationGraphTasks){
  await openCard(task.id);const c=card(task.id);
  for(const p of task.parts){const field=c.locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(p.answer);else await field.fill(p.type==='text'?'Jeg kontrollerer afledt, punkt og fortegn.':p.answer);}
  await c.locator('button[type=submit]').click();for(const p of task.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).innerText(),p.type==='text'?/egen vurdering/:/passer/);
  await c.locator('summary').click();assert.ok(await c.locator('.int-solution').innerText());
 }
 await openCard('int2.point');await card('int2.point').locator('input').fill('x^2+3*x+7');await card('int2.point').locator('button[type=submit]').click();
 assert.match(await card('int2.point').locator('[data-feedback]').innerText(),/ikke nødvendigvis konstanten/);
 await openCard('int2.sign');await card('int2.sign').locator('select').selectOption('zero');await card('int2.sign').locator('button[type=submit]').click();
 assert.match(await card('int2.sign').locator('[data-feedback]').innerText(),/ikke grafens højde/);
 await openCard('int2.tangent');await card('int2.tangent').locator('[name=constant]').fill('5');await card('int2.tangent').locator('button[type=submit]').click();
 assert.match(await card('int2.tangent').locator('[data-feedback=constant]').innerText(),/ikke integrationskonstanten/);
 await card('int2.tangent').locator('[data-int-hint]').click();await card('int2.tangent').locator('[data-int-hint]').click();
 await go('integration/1/teori/konstant');await openCard('int2.tangent');
 assert.equal(await card('int2.tangent').locator('[name=constant]').inputValue(),'5');
 await page.reload();await card('int2.tangent').waitFor({state:'visible'});
 assert.equal(await card('int2.tangent').locator('.int-hints p').count(),2);assert.equal(await card('int2.tangent').locator('[name=constant]').inputValue(),'5');
 await page.locator('.int-page-controls a').last().click();await card('int2.two-tangencies').waitFor({state:'visible'});
 await page.goBack();await card('int2.tangent').waitFor({state:'visible'});
 await card('int2.tangent').locator('[data-int-retry]').click();assert.equal(await card('int2.tangent').locator('.int-hints p').count(),0);
 for(const [id,value]of [['sign','min'],['point','2'],['tangent','6'],['distinction','slope']]){
  await openCard('int2.final.'+id);const c=card('int2.final.'+id);if(await c.locator('select').count())await c.locator('select').selectOption(value);else await c.locator('input').fill(value);await c.locator('button[type=submit]').click();
 }
 assert.match(await page.locator('#int2-final-status').innerText(),/4 af 4/);
 await openCard('int2.final.point');await card('int2.final.point').locator('input').fill('6');assert.match(await page.locator('#int2-final-status').innerText(),/3 af 4/);
 // Mobile and all 28 addresses: one visible part and correct MathML.
 await page.setViewportSize({width:390,height:844});
 for(const path of pagesForIntegralModule('2')){
  await go(path);assert.equal(await page.locator('.int-step-panel:visible').count(),1);
  if(!path.endsWith('opsummering'))assert.equal(await page.locator('[data-int-part-panel]:visible').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.ok(await page.locator('#int2-lesson math:visible').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));
  const clipped=await page.locator('#int2-lesson math:visible').evaluateAll(nodes=>nodes.filter(n=>{if(n.closest('.int-table,.int-solution,.int-formula'))return false;const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(n=>n.outerHTML));assert.deepEqual(clipped,[]);
 }
 await go('integration/2/teori/sammenhaeng');await page.screenshot({path:'/tmp/matematik-integral-2-graph-mobile.png',fullPage:true});
 await openCard('int2.point');await page.screenshot({path:'/tmp/matematik-integral-2-exercise-mobile.png',fullPage:true});
 // Prerequisite filtering and blind exam presentation of the extended bank.
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=tasks]').click();
 await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=minutes]').fill('180');
 await page.locator('[name=seed]').fill('graph-exam');await page.locator('#taskSetup details summary').click();
 await page.locator('[data-completed="int.1"]').check();await page.locator('[data-completed="int.2"]').check();await page.locator('[name=onlyCompleted]').check();
 await page.locator('#taskSetup button[type=submit]').click();
 const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);
 assert.ok(session.items.some(t=>t.id.startsWith('int2.')));assert.equal(await page.locator('[data-task-action=hint]').count(),0);assert.equal(await page.locator('.task-feedback').count(),0);
 for(let i=0;i<session.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();const text=await page.locator('.task-question').innerText();assert.ok(!text.includes('Læringsmål'));assert.ok(!text.includes('Hint 1'));}
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();
 await page.locator('[data-task-action=repeat-module][data-module="int.2"]').first().click();await page.waitForURL('**/#integration/2/start/1');assert.ok(await page.locator('#int2-start').isVisible());
 // Corrupt and blocked module 2 storage remain usable.
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));
 const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(url+'/#integration/2/start/1');await bp.locator('#int2-storage-warning').waitFor();await bp.locator('[data-int-card="int2.pre.function"] input').fill('4');assert.match(await bp.locator('#int2-storage-warning').innerText(),/kan ikke gemme/);
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.graphs.v1','{"version":99}'));
 const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration/2');await cp.locator('#int2-storage-warning').waitFor();
 assert.deepEqual(errors,[]);console.log('Integral module 2 browser tests passed: all parts, point/tangent/graph feedback, graph controls, signs, hints, local storage, browser history, mobile, MathML, bank exams and repetition; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
