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
import {integrationBankTasks,integrationLessonTasks} from '../tasks/bank/integration-complete.js';
import {instantiate} from '../tasks/bank/index.js';
const errors=[];
const fixture=(items,seed,mode='training')=>({schema:1,completed:['int.1','int.2','int.3','int.4','int.rep','int.5','int.6','int.7'],history:[],session:{mode,status:'active',seed,items,index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:180,requested:items.length}});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto(url+'/#tasks');await page.locator('#taskSetup').waitFor();
 for(let module=1;module<=7;module++){
  const seed='integral-bank-browser-'+module,list=integrationBankTasks.map(s=>instantiate(s.id,seed)).filter(t=>t.module===`int.${module}`),state=fixture(list.map(t=>({id:t.id,version:t.version})),seed);
  await page.evaluate(v=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(v)),state);await page.reload();await page.locator('.task-question').waitFor();
  for(const [index,task]of list.entries()){
   await page.locator('[data-task-action=jump]').nth(index).click();
   assert.ok(await page.locator('.task-question math').evaluateAll(ns=>ns.every(n=>n.namespaceURI==='http://www.w3.org/1998/Math/MathML')));
   assert.ok(await page.locator('.task-question msup').evaluateAll(ns=>ns.every(n=>n.children.length===2)));
   for(const p of task.parts){const field=page.locator(`.task-question [data-part="${p.id}"]`);if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else if(['set','tuple'].includes(p.type)){for(const [i,v]of p.answer.entries())await page.locator(`.task-question [data-part="${p.id}"][data-component="${i}"]`).fill(String(v));}else await field.fill(p.type==='text'?'Jeg kontrollerer betingelser, fortegn, grænser og den afledte.':String(p.answer));}
   if(index===0){await page.locator('[data-task-action=hint]').click();await page.locator('[data-task-action=hint]').click();assert.equal(await page.locator('.task-question .hint').count(),2);await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-question .hint').count(),2);}
   await page.locator('[data-task-action=check]').click();const result=await page.locator('.task-feedback').textContent();assert.ok(!result.includes('Se løsningen og find det trin'),task.id);assert.match(result,/Det passer/,task.id);if(task.parts.some(p=>p.type==='text'))assert.match(result,/Faglig tjekliste/,task.id);
   await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),task.id);assert.ok(await page.locator('.task-question mn').evaluateAll(ns=>ns.every(n=>n.children.length===0&&!/NaN|Infinity/.test(n.textContent))),task.id);await page.setViewportSize({width:1440,height:1000});
  }
  console.log(`Integral bank module ${module}: ${list.length} tasks graded and checked on mobile.`);
 }
 // A genuinely user-composed exam still obeys the budget and keeps solutions private.
 await page.evaluate(()=>localStorage.removeItem('christian-matematik.tasks.v1'));await page.reload();await page.locator('#taskSetup').waitFor();await page.locator('[name=topics][value=integration]').check();await page.locator('[name=mode]').selectOption('exam');await page.locator('[name=seed]').fill('integral-bank-exam');await page.locator('[name=minutes]').fill('180');await page.locator('#taskSetup details summary').click();for(const id of ['int.1','int.2','int.3','int.4','int.rep','int.5','int.6','int.7'])await page.locator(`[data-completed="${id}"]`).check();await page.locator('[name=onlyCompleted]').check();await page.locator('#taskSetup button[type=submit]').click();
 const exam=await page.evaluate(()=>JSON.parse(localStorage.getItem('christian-matematik.tasks.v1')).session);assert.ok(exam.items.length>0&&exam.items.length<=12);assert.ok(exam.items.map(t=>instantiate(t.id,exam.seed).minutes).reduce((a,b)=>a+b,0)<=180);for(let i=0;i<exam.items.length;i++){await page.locator('[data-task-action=jump]').nth(i).click();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);assert.doesNotMatch(await page.locator('.task-question').textContent(),/Gennemregnet løsning|Læringsmål|substitution|kædereglen|potensreglen/i);}
 // Old, already checked v1 answers must not be reinterpreted with a v2 seed.
 const legacy=fixture([{id:'int.sum',version:1}],'legacy');legacy.history=[{date:123,points:3,max:5,items:[]}];legacy.session.answers={'int.sum':{expr:'2*x^3+4*x^2+2*x',check:'6*x^2+8*x+2'}};legacy.session.checked={'int.sum':true};legacy.session.hints={'int.sum':1};await page.evaluate(v=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(v)),legacy);await page.reload();await page.locator('.task-feedback').waitFor();assert.match(await page.locator('.task-feedback').textContent(),/Det passer/);assert.equal(await page.locator('[data-part=expr]').inputValue(),'2*x^3+4*x^2+2*x');assert.ok(!(await page.locator('#taskSave').textContent()).includes('kunne ikke åbnes'));
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('#sidebar').getBoundingClientRect().right<=1);await page.screenshot({path:'/tmp/matematik-integral-bank-mobile.png',fullPage:true});assert.deepEqual(errors,[]);console.log('All 91 integral bank tasks, seeded answers, hints, persistence, mobile MathML, exam privacy and legacy v1 sets passed.');
}finally{await browser.close();await new Promise(done=>server.close(done));}
