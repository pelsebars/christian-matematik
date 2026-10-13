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
import {integrationTasks} from '../tasks/bank/integration.js';
const errors=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(url+'/#integration');
 await page.locator('#int-modul-1').waitFor({state:'visible'});
 assert.equal(await page.locator('#integralLesson [data-int-card]').count(),20);
 assert.equal(await page.locator('#int-forloeb .module-card').count(),8);
 assert.equal(await page.locator('#int-forloeb .module-card').nth(4).locator('.module-card-top span').innerText(),'B-niveau 6–7');
 for(const id of ['int-modul-2','int-modul-3','int-modul-4','int-repetition','int-modul-5','int-modul-6','int-modul-7']) {
  await page.locator(`#int-forloeb [data-int-jump="${id}"]`).click();
  assert.match(await page.locator('#'+id).innerText(),/Planlagt/);
  assert.equal(await page.evaluate(()=>document.activeElement.id),id);
 }
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 await card('int.pre.fraction').locator('input').fill('3');
 await card('int.pre.fraction').locator('button[type=submit]').click();
 assert.match(await card('int.pre.fraction').locator('[data-feedback]').innerText(),/treere/);
 await card('int.pre.fraction').locator('[data-int-jump]').click();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'int-grundkort');
 for(const [id,value] of [['function','7'],['derivative','6'],['fraction','6/3'],['sign','1']]){
  await card('int.pre.'+id).locator('input').fill(value);
  await card('int.pre.'+id).locator('button[type=submit]').click();
 }
 await card('int.pre.power').locator('select').selectOption('negative');
 await card('int.pre.power').locator('button[type=submit]').click();
 assert.match(await page.locator('#int-foundation-status').innerText(),/5 af 5/);
 // Check each microexercise immediately after its new concept.
 for(const [id,answer] of [['definition','yes'],['constant','zero'],['rule','right'],['root','half']]){
  await card('int.mini.'+id).locator('select').selectOption(answer);
  await card('int.mini.'+id).locator('button[type=submit]').click();
  assert.match(await card('int.mini.'+id).locator('[data-feedback]').innerText(),/passer/);
 }
 // Hints are ordered, persisted, and reset by retry.
 const poly=card('int.polynomial');
 await poly.locator('[name=expr]').fill('3x^3');
 await poly.locator('button[type=submit]').click();
 assert.match(await poly.locator('[data-feedback=expr]').innerText(),/mangler division/);
 await poly.locator('[data-int-hint]').click();
 await poly.locator('[data-int-hint]').click();
 assert.equal(await poly.locator('.int-hints p').count(),2);
 await page.reload();
 await page.locator('#int-modul-1').waitFor();
 assert.equal(await poly.locator('[name=expr]').inputValue(),'3x^3');
 assert.equal(await poly.locator('.int-hints p').count(),2);
 assert.match(await poly.locator('[data-feedback=expr]').innerText(),/mangler division/);
 await poly.locator('[data-int-retry]').click();
 assert.equal(await poly.locator('[name=expr]').inputValue(),'');
 assert.equal(await poly.locator('.int-hints p').count(),0);
 assert.equal(await poly.locator('[data-feedback=expr]').innerText(),'');
 // All bank task types and targeted errors.
 for(const t of integrationTasks){
  const c=card(t.id);
  for(const p of t.parts){
   const field=c.locator(`[name="${p.id}"]`);
   if(p.type==='choice')await field.selectOption(p.answer);
   else await field.fill(p.type==='text'?'Jeg sammenligner min forklaring med tjeklisten.':p.answer);
  }
  await c.locator('button[type=submit]').click();
  for(const p of t.parts)assert.match(await c.locator(`[data-feedback="${p.id}"]`).innerText(),p.type==='text'?/egen vurdering/:/passer/);
  await c.locator('summary').click();
  assert.ok(await c.locator('.int-solution').innerText());
 }
 await card('int.motion').locator('[name=position]').fill('3*x^2+2*x');
 await card('int.motion').locator('button[type=submit]').click();
 assert.match(await card('int.motion').locator('[data-feedback=position]').innerText(),/integrationsregel passer.*begyndelsespositionen/s);
 // Safe preview: unsupported input cannot execute and is not marked wrong.
 await card('int.sum').locator('[name=expr]').fill('<img src=x onerror=alert(1)>');
 await card('int.sum').locator('button[type=submit]').click();
 assert.equal(await card('int.sum').locator('.int-preview img').count(),0);
 assert.match(await card('int.sum').locator('[data-feedback=expr]').innerText(),/ikke bedømmes sikkert/);
 for(const [id,value] of [['definition','right'],['family','all'],['log','log']]){
  await card('int.final.'+id).locator('select').selectOption(value);
  await card('int.final.'+id).locator('button[type=submit]').click();
 }
 await card('int.final.sum').locator('input').fill('x*x-3x');
 await card('int.final.sum').locator('input').press('Enter');
 assert.match(await page.locator('#int-final-status').innerText(),/4 af 4/);
 await card('int.final.sum').locator('input').fill('x');
 assert.match(await page.locator('#int-final-status').innerText(),/3 af 4/);
 await page.reload();
 assert.match(await page.locator('#int-final-status').innerText(),/3 af 4/);
 // Graph changes with keyboard and MathML has proper namespaces and arity.
 const before=await page.locator('#int-graph-readout').innerText();
 await page.locator('#int-c-slider').focus();await page.keyboard.press('ArrowRight');
 assert.notEqual(await page.locator('#int-graph-readout').innerText(),before);
 assert.ok(await page.locator('#integralLesson math').evaluateAll(nodes=>nodes.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));
 assert.ok(await page.locator('#integralLesson msup').evaluateAll(nodes=>nodes.every(n=>n.children.length===2)));
 // Topic navigation and home entry.
 await page.locator('.nav-item[data-view=home]').click();
 await page.locator('.topic-card[data-view=integration]').click();
 assert.ok(await page.locator('#integralLesson').isVisible());
 await page.locator('#int-forloeb').scrollIntoViewIfNeeded();
 await page.screenshot({path:'/tmp/matematik-integral-desktop.png'});
 // New tasks in a real exam: no method metadata, hints or solutions before submission.
 await page.locator('.nav-item[data-view=tasks]').click();
 await page.locator('[name=topics][value=integration]').check();
 await page.locator('[name=mode]').selectOption('exam');
 await page.locator('[name=minutes]').fill('90');
 await page.locator('#taskSetup button[type=submit]').click();
 assert.equal(await page.locator('[data-task-action=jump]').count(),7);
 assert.equal(await page.locator('[data-task-action=hint]').count(),0);
 assert.equal(await page.locator('.task-feedback').count(),0);
 assert.equal(await page.locator('[data-task-action=repetition]').count(),0);
 assert.ok(!(await page.locator('#tasksView').innerText()).includes('Læringsmål'));
 const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);
 await page.locator('[data-task-action=jump]').nth(session.items.findIndex(t=>t.id==='int.polynomial')).click();
 await page.locator('[data-part=expr]').fill('x^3');
 await page.reload();assert.equal(await page.locator('[data-part=expr]').inputValue(),'x^3');
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();
 assert.equal(await page.locator('.task-feedback').count(),7);
 assert.ok((await page.locator('#tasksView').innerText()).includes('Stamfunktion og det ubestemte integral'));
 // Mobile page, MathML and opened solutions are readable without page overflow.
 await page.setViewportSize({width:390,height:844});
 await page.locator('#menuButton').click();await page.locator('.nav-item[data-view=integration]').click();
 for(const id of ['int-start','int-regler','int-traening','int-slut']){
  await page.locator(`#integralLesson .lesson-nav [data-int-jump="${id==='int-regler'?'int-teori':id}"]`).click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 const clipped=await page.locator('#integralLesson math').evaluateAll(nodes=>nodes.filter(n=>{
  if(n.closest('.int-table, .int-solution, .int-formula'))return false;
  const r=n.getBoundingClientRect();return r.width>0&&(r.left<0||r.right>innerWidth+1);
 }).map(n=>n.outerHTML));
 assert.deepEqual(clipped,[],'MathML outside horizontal scrolling regions must fit on mobile');
 await page.locator('#int-start').scrollIntoViewIfNeeded();
 await page.screenshot({path:'/tmp/matematik-integral-mobile.png'});
 await page.locator('#int-konstant').scrollIntoViewIfNeeded();
 await page.locator('#int-c-slider').scrollIntoViewIfNeeded();
 await page.screenshot({path:'/tmp/matematik-integral-graph-mobile.png'});
 // Blocked and corrupt local storage are reported.
 const blocked=await browser.newContext();
 await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));
 const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));
 await bp.goto(url+'/#integration');await bp.locator('#int-storage-warning').waitFor();
 assert.match(await bp.locator('#int-storage-warning').innerText(),/lagring er blokeret/);
 await bp.locator('[data-int-card="int.pre.fraction"] input').fill('2');
 assert.match(await bp.locator('#int-storage-warning').innerText(),/kan ikke gemme/);
 const corrupt=await browser.newContext();await corrupt.addInitScript(()=>localStorage.setItem('christian-matematik.integration.v1','{"version":99}'));
 const cp=await corrupt.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url+'/#integration');
 await cp.locator('#int-storage-warning').waitFor();
 assert.deepEqual(errors,[]);
 console.log('Integral browser tests passed: roadmap, all exercises, specific feedback, hints, retry, persisted answers, MathML, keyboard graph, exam bank, mobile and blocked/corrupt storage; no console errors.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
