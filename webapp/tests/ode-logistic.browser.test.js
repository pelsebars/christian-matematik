import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {logisticLessonTasks,LOGISTIC_STORAGE_KEY} from '../ode-logistic-lesson.js';
import {logisticTasks} from '../tasks/bank/ode-logistic.js';
import {logisticSteps} from '../ode-routes.js';
import {odeLessonTasks,ODE_STORAGE_KEY} from '../ode-lesson.js';
import { logisticTaskStep as stepFor } from '../ode-logistic-exercises.js';
const dir=resolve(import.meta.dirname,'..');
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.split('?')[0]);const p=resolve(dir,'.'+(path==='/'?'/index.html':path));if(!p.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[];
const fixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'ode6',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 const old=JSON.stringify({version:1,cards:Object.fromEntries(odeLessonTasks.map(t=>[t.id,{answers:Object.fromEntries(t.parts.map(p=>[p.id,p.answer])),checked:true,hints:0}]))});
 await ctx.addInitScript(({key,state})=>{if(!localStorage.getItem(key))localStorage.setItem(key,state);},{key:ODE_STORAGE_KEY,state:old});
 const go=path=>page.evaluate(path=>window.showMathView(path),path),card=id=>page.locator(`[data-int-card="${id}"]`);
 await page.goto(url+'/?preview=1#differentialEquations/6');await page.locator('#ode-module-six').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>location.hash),'#differentialEquations/6/start');assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');
 await card('ode6.pre.product').locator('input').fill('0');await card('ode6.pre.product').locator('button[type=submit]').click();await card('ode6.pre.product').locator('[data-int-jump]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'ode6-basics');
 for(const task of logisticLessonTasks){await go('differentialEquations/6/'+stepFor(task));for(const p of task.parts){const field=card(task.id).locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(p.answer);else await field.fill(p.answer);}await card(task.id).locator('button[type=submit]').click();assert.ok(await card(task.id).evaluate(el=>el.classList.contains('is-correct')),task.id);}
 assert.equal(await page.locator('[data-ode-status="6"]').textContent(),'Gennemført');
 await go('differentialEquations/6/udvidet');await page.locator('#ode6-notes').fill('Min CAS-kontrol, enheder og interval.');await card('ode6.harvest').locator('[data-int-hint]').click();await page.reload();await page.locator('#ode6-notes').waitFor({state:'visible'});assert.match(await page.locator('#ode6-notes').inputValue(),/CAS-kontrol/);assert.equal(await card('ode6.harvest').locator('.int-hints p').count(),1);
 await go('differentialEquations/6/oevelser');await card('ode6.population').locator('[name=rate]').fill('99');assert.equal(await page.locator('[data-ode-status="6"]').textContent(),'I gang');assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');assert.equal(await page.evaluate(key=>localStorage.getItem(key),ODE_STORAGE_KEY),old);
 await go('differentialEquations/6/udforsk');assert.match(await page.locator('#ode6-reading').innerText(),/a = 0,0001/);const before=await page.locator('#ode6-reading').innerText();await page.locator('#ode6-time').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('#ode6-reading').innerText(),before);
 await page.locator('#ode6-exponential').check();assert.equal(await page.locator('[data-logistic-exponential]').count(),1);await page.locator('#ode6-exponential').uncheck();assert.equal(await page.locator('[data-logistic-exponential]').count(),0);
 await page.locator('#ode6-peak').click();assert.match(await page.locator('#ode6-reading').innerText(),/værdi 500, hastighed 25/);
 for(const percent of ['0','100','120']){await page.locator('#ode6-initial').fill(percent);assert.equal(await page.locator('#ode6-peak').isDisabled(),true);assert.doesNotMatch(await page.locator('#ode6-curve').innerHTML(),/NaN|Infinity/);}
 await page.locator('#ode6-initial').fill('80');await page.locator('#ode6-peak').click();assert.equal(await page.locator('#ode6-time').inputValue(),'0');assert.match(await page.locator('#ode6-reading').innerText(),/størst|Største/);
 await page.locator('#ode6-initial').fill('10');await page.locator('#ode6-limit').fill('500');await page.locator('#ode6-rate').fill('0.2');await page.locator('#ode6-peak').click();assert.match(await page.locator('#ode6-reading').innerText(),/værdi 250, hastighed 25/);
 await go('differentialEquations/6/udvidet');await page.locator('#ode-module-six details').filter({has:page.locator('summary', {hasText:'referencegraf'})}).locator('summary').click();assert.ok(await page.locator('#ode-module-six svg[aria-label*="Fortjeneste"]').isVisible());
 assert.deepEqual(await page.locator('#ode-module-six math,#ode-module-six msup,#ode-module-six mfrac').evaluateAll(ns=>ns.filter(e=>e.namespaceURI!=='http://www.w3.org/1998/Math/MathML'||(['msup','mfrac'].includes(e.tagName)&&e.children.length!==2)).map(e=>e.outerHTML)),[]);
 assert.deepEqual(await page.locator('#ode-module-six input,#ode-module-six select,#ode-module-six textarea').evaluateAll(es=>es.filter(e=>!e.labels?.length).map(e=>e.id)),[]);
 assert.deepEqual(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);}),[]);
 for(const [step] of logisticSteps){await go('differentialEquations/6/'+step);assert.equal(await page.locator('[data-ode-step]:visible').count(),1);assert.equal(await page.locator('.ode-step-menu [aria-current=step]').count(),1);}
 await go('differentialEquations/5/opsummering');await page.locator('.ode-page-controls a').last().click();await page.waitForURL('**/*#differentialEquations/6/start');await go('differentialEquations/6/opsummering');await page.locator('.ode-page-controls a').last().click();await page.waitForURL('**/*#differentialEquations/opsamling/start');await page.locator('#ode-module-finish').waitFor({state:'visible'});
 await go('tasks');for(const task of logisticTasks){await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(task));await page.reload();await page.locator('.task-question').waitFor();for(const p of task.parts){if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);}await page.locator('[data-task-action=check]').click();assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find det trin/);}
 await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(logisticTasks.find(t=>t.id==='ode6.harvest'),'exam'));await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="ode.6"]').first().click();await page.waitForURL('**/*#differentialEquations/6/start');
 await go('differentialEquations/6/udforsk');await page.locator('#ode-module-six').screenshot({path:'/tmp/ode6-desktop.png'});
 await page.setViewportSize({width:390,height:844});for(const [step] of logisticSteps){await go('differentialEquations/6/'+step);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),step);}await go('differentialEquations/6/udforsk');await page.locator('#ode-module-six').screenshot({path:'/tmp/ode6-mobile.png'});
 assert.deepEqual(errors,[]);console.log('ODE M6 browser: all 26 cards, 11 bank tasks, exam, M1 preservation, notes, hints, graph, MathML, routes and mobile passed.');
}finally{await browser.close();server.close();}
