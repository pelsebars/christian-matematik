// Run with Playwright installed, or PLAYWRIGHT_MODULE_PATH pointing to its index.mjs.
import assert from "node:assert/strict";
import {instantiate} from "../tasks/bank/index.js";
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

import { odeLessonTasks, ODE_STORAGE_KEY } from '../ode-lesson.js';
import { odeTasks } from '../tasks/bank/ode.js';
import { odeModules } from '../ode-plan.js';
import { odePages } from '../ode-routes.js';
const errors=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage(); page.setDefaultTimeout(12000);
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async path=>{await page.evaluate(path=>window.showMathView(path),path);await page.waitForFunction(path=>location.hash===(path?`#${path}`: ''),path);};
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 const routeFor=t=>t.id.includes('.pre.')?'start':t.id.includes('.mini.')?'teori':t.id.includes('.final.')?'sluttjek':'oevelser';
 const answer=async(t,wrong=false)=>{
  await go('differentialEquations/1/'+routeFor(t));
  for(const p of t.parts){
   const field=card(t.id).locator(`[name="${p.id}"]`);
   if(p.type==='choice')await field.selectOption(wrong?p.options.find(o=>o.id!==p.answer).id:p.answer);
   else await field.fill(wrong?'999':p.answer);
  }
  await card(t.id).locator('button[type=submit]').click();
 };
 await page.goto(url+'/#differentialEquations/1');
 await page.locator('#ode-module-one').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>location.hash),'#differentialEquations/1/start');
 assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Ikke begyndt');
 assert.equal(await page.locator('[data-ode-step="start"]').isVisible(),true);
 assert.equal(await page.locator('#integralLesson').isVisible(),false);
 await answer(odeLessonTasks.find(t=>t.id==='ode.pre.derivative'),true);
 assert.match(await card('ode.pre.derivative').locator('[data-feedback]').innerText(),/eksponent/);
 await card('ode.pre.derivative').locator('[data-int-jump]').click();
 assert.equal(await page.evaluate(()=>document.activeElement.id),'ode-basics');
 assert.ok(await page.locator('#ode-basics details').nth(1).getAttribute('open')!==null);
 await card('ode.pre.derivative').locator('[data-int-hint]').click();
 assert.equal(await card('ode.pre.derivative').locator('.int-hints p').count(),1);
 await page.reload();
 assert.equal(await card('ode.pre.derivative').locator('input').inputValue(),'999');
 assert.equal(await card('ode.pre.derivative').locator('.int-hints p').count(),1);
 assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'I gang');
 for(const t of odeLessonTasks){await answer(t);assert.ok(await card(t.id).evaluate(el=>el.classList.contains('is-correct')),t.id);}
 assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');
 await page.reload();
 assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');
 // Editing a previously correct answer withdraws completion immediately.
 await go('differentialEquations/1/sluttjek');
 await card('ode.final.initial').locator('input').fill('4');
 assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'I gang');
 await answer(odeLessonTasks.find(t=>t.id==='ode.final.initial'));
 await go('differentialEquations/1/teori');
 const before=await page.locator('[data-ode-plot]').innerHTML();
 await page.locator('#ode-constant').focus();await page.keyboard.press('ArrowRight');
 assert.notEqual(await page.locator('[data-ode-plot]').innerHTML(),before);
 assert.ok(await page.locator('#ode-graph-reading math').count());
 const mathProblems=await page.locator('#odeLesson math').evaluateAll(nodes=>nodes.flatMap(m=>[...m.querySelectorAll('mfrac,msup')].filter(el=>el.children.length!==2).map(el=>el.outerHTML)));
 assert.deepEqual(mathProblems,[]);
 await go('differentialEquations/1/start');
 await page.locator('#ode-session .ode-step-menu a').nth(1).focus();
 await page.keyboard.press('Enter');
 await page.waitForURL('**/#differentialEquations/1/teori');
 await page.waitForFunction(()=>document.activeElement.id==='subjectTitle');
 await page.locator('#ode-session .ode-page-controls a').first().click();
 await page.waitForURL('**/#differentialEquations/1/start');
 await page.goBack();await page.waitForURL('**/#differentialEquations/1/teori');
 for(let i=0;i<odePages.length;i++){
  await go(odePages[i]);
  assert.equal(await page.locator('[data-ode-step]:visible').count(),1);
  assert.equal(await page.locator('#ode-session .ode-step-menu [aria-current="step"]').count(),1);
  await page.locator('#ode-session .ode-page-controls a').last().click();
  await page.waitForFunction(expected=>location.hash===`#${expected}`,i<odePages.length-1?odePages[i+1]:'differentialEquations/2');
 }
 for(const m of odeModules.slice(1)){
  await go('differentialEquations/'+m.id);
  assert.match(await page.locator('#ode-planned').innerText(),/Planlagt · ikke implementeret/);
  assert.equal(await page.locator('[data-ode-step]:visible').count(),0);
  await page.locator('#ode-session .ode-breadcrumb a').click();
  await page.waitForURL('**/#differentialEquations');
 }
 assert.equal(await page.locator('#ode-overview .module-card').count(),8);
 await page.locator('#ode-overview details > summary').click();
 assert.equal(await page.locator('#ode-overview table tbody tr').count(),22);
 // Existing main views and nested integral route continue to work.
 for(const view of ['home','equations','quadratic','composite','differentiation','planeGeometry','integration/1/start/1','tasks','formulas']){
  await go(view==='home'?'':view);
  assert.equal(await page.locator('#odeLesson').isVisible(),false);
 }
 await go('tasks');assert.ok(await page.locator('input[value="differentialEquations"]').count() || (await page.locator('#tasksView').innerText()).includes('Differentialligninger'));

 // Exercise the real shared bank with each new task in an isolated training session.
 const fixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'ode-bank',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
 for(const task of odeTasks){
  await page.evaluate(state=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(state)),fixture(task));
  await page.reload();await page.locator('.task-question').waitFor();
  for(const p of task.parts){
   if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();
   else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);
  }
  await page.locator('[data-task-action=check]').click();
  assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find det trin/);
  assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);
 }
 await page.evaluate(state=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(state)),fixture(odeTasks[1],'exam'));
 await page.reload();await page.locator('.task-question').waitFor();
 assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);
 assert.doesNotMatch(await page.locator('.task-question').innerText(),/Gennemregnet løsning|Læringsmål|differentier/i);
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));
 await phone.goto(url+'/#differentialEquations/1/teori');
 await phone.locator('#ode-family-graph').waitFor({state:'visible'});
 assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await phone.screenshot({path:'/tmp/matematik-ode-mobile.png',fullPage:true});
 for(const path of ['differentialEquations','differentialEquations/1/oevelser','differentialEquations/repetition']){
  await phone.evaluate(path=>window.showMathView(path),path);
  assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path);
 }
 await mobile.close();
 // Malformed storage and storage failure produce a visible warning, not a broken app.
 const bad=await browser.newContext();await bad.addInitScript(key=>localStorage.setItem(key,'broken'),ODE_STORAGE_KEY);
 const badPage=await bad.newPage();await badPage.goto(url+'/#differentialEquations/1');
 await badPage.locator('#odeLesson [data-lesson-warning]').waitFor({state:'visible'});await bad.close();
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('blocked');};});
 const blockedPage=await blocked.newPage();await blockedPage.goto(url+'/#differentialEquations/1/start');
 await blockedPage.locator('[data-int-card="ode.pre.function"] input').fill('7');
 await blockedPage.locator('#odeLesson [data-lesson-warning]').waitFor({state:'visible'});await blocked.close();
 assert.deepEqual(errors,[]);
 console.log('ODE browser passed: all cards, feedback, hints, storage/reload, completion, routes, MathML, graph, keyboard and mobile.');
}finally{await browser.close();server.close();}
