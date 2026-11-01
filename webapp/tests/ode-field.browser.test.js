import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {fieldLessonTasks,FIELD_STORAGE_KEY} from '../ode-field-lesson.js';
import {fieldTasks} from '../tasks/bank/ode-field.js';
import {fieldSteps} from '../ode-routes.js';
import {odeLessonTasks,ODE_STORAGE_KEY} from '../ode-lesson.js';
import { fieldTaskStep as stepFor } from '../ode-field-exercises.js';
const dir=resolve(import.meta.dirname,'..');
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.split('?')[0]);const p=resolve(dir,'.'+(path==='/'?'/index.html':path));if(!p.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[];
const fixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'ode4',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 const old=JSON.stringify({version:1,cards:Object.fromEntries(odeLessonTasks.map(t=>[t.id,{answers:Object.fromEntries(t.parts.map(p=>[p.id,p.answer])),checked:true,hints:0}]))});
 await ctx.addInitScript(({key,state})=>{if(!localStorage.getItem(key))localStorage.setItem(key,state);},{key:ODE_STORAGE_KEY,state:old});
 const go=path=>page.evaluate(path=>window.showMathView(path),path),card=id=>page.locator(`[data-int-card="${id}"]`);
 await page.goto(url+'/?preview=1#differentialEquations/4');await page.locator('#ode-module-four').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>location.hash),'#differentialEquations/4/start');assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');
 await card('ode4.pre.coordinates').locator('input').fill('0');await card('ode4.pre.coordinates').locator('button[type=submit]').click();await card('ode4.pre.coordinates').locator('[data-int-jump]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'ode4-basics');
 for(const task of fieldLessonTasks){await go('differentialEquations/4/'+stepFor(task));for(const p of task.parts){const field=card(task.id).locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(p.answer);else await field.fill(p.answer);}await card(task.id).locator('button[type=submit]').click();assert.ok(await card(task.id).evaluate(el=>el.classList.contains('is-correct')),task.id);}
 assert.equal(await page.locator('[data-ode-status="4"]').textContent(),'Gennemført');
 await go('differentialEquations/4/modeller');await page.locator('#ode4-notes').fill('Min CAS-kontrol, enheder og interval.');await card('ode4.vessel').locator('[data-int-hint]').click();await page.reload();await page.locator('#ode4-notes').waitFor({state:'visible'});assert.match(await page.locator('#ode4-notes').inputValue(),/CAS-kontrol/);assert.equal(await card('ode4.vessel').locator('.int-hints p').count(),1);
 await go('differentialEquations/4/oevelser');await card('ode4.exponential').locator('[name=slope]').fill('99');assert.equal(await page.locator('[data-ode-status="4"]').textContent(),'I gang');assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');assert.equal(await page.evaluate(key=>localStorage.getItem(key),ODE_STORAGE_KEY),old);
 await go('differentialEquations/4/udforsk');const before=await page.locator('#ode4-reading').innerText();await page.locator('#ode4-x').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('#ode4-reading').innerText(),before);
 assert.equal(await page.locator('[data-field-euler]').count(),1);await page.locator('#ode4-euler').uncheck();assert.equal(await page.locator('[data-field-euler]').count(),0);await page.locator('#ode4-euler').check();
 for(const model of ['quartic','sine','cells','vessel']){await page.locator('#ode4-model').selectOption(model);assert.equal(await page.locator('[data-field-reference]').count(),1);assert.doesNotMatch(await page.locator('#ode4-graph').innerHTML(),/NaN|Infinity/);const options=await page.locator('#ode4-step option').evaluateAll(es=>es.map(e=>e.value));await page.locator('#ode4-step').selectOption(options.at(-1));}
 await page.locator('#ode4-model').selectOption('cells');assert.match(await page.locator('#ode4-reading').innerText(),/266/);assert.match(await page.locator('#ode4-reading').innerText(),/19,88|19,89/);
 await go('differentialEquations/4/oevelser');for(const img of await page.locator('#ode-module-four img:visible').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());assert.ok(await img.evaluate(e=>e.naturalWidth>0));}
 assert.deepEqual(await page.locator('#ode-module-four math,#ode-module-four msup,#ode-module-four mfrac').evaluateAll(ns=>ns.filter(e=>e.namespaceURI!=='http://www.w3.org/1998/Math/MathML'||(['msup','mfrac'].includes(e.tagName)&&e.children.length!==2)).map(e=>e.outerHTML)),[]);
 assert.deepEqual(await page.locator('#ode-module-four input,#ode-module-four select,#ode-module-four textarea').evaluateAll(es=>es.filter(e=>!e.labels?.length).map(e=>e.id)),[]);
 assert.deepEqual(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);}),[]);
 for(const [step] of fieldSteps){await go('differentialEquations/4/'+step);assert.equal(await page.locator('[data-ode-step]:visible').count(),1);assert.equal(await page.locator('.ode-step-menu [aria-current=step]').count(),1);}
 await go('differentialEquations/repetition/opsummering');await page.locator('.ode-page-controls a').last().click();await page.waitForURL('**/*#differentialEquations/4/start');await go('differentialEquations/4/opsummering');await page.locator('.ode-page-controls a').last().click();await page.waitForURL('**/*#differentialEquations/5/start');await page.locator('#ode-module-five').waitFor({state:'visible'});
 await go('tasks');for(const task of fieldTasks){await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(task));await page.reload();await page.locator('.task-question').waitFor();for(const p of task.parts){if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);}await page.locator('[data-task-action=check]').click();assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find det trin/);}
 await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(fieldTasks.find(t=>t.id==='ode4.vessel'),'exam'));await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="ode.4"]').first().click();await page.waitForURL('**/*#differentialEquations/4/start');
 await go('differentialEquations/4/udforsk');await page.locator('#ode-module-four').screenshot({path:'/tmp/ode4-desktop.png'});
 await page.setViewportSize({width:390,height:844});for(const [step] of fieldSteps){await go('differentialEquations/4/'+step);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),step);}await go('differentialEquations/4/udforsk');await page.locator('#ode-module-four').screenshot({path:'/tmp/ode4-mobile.png'});
 assert.deepEqual(errors,[]);console.log('ODE M4 browser: all 25 cards, 13 bank tasks, exam, M1 preservation, notes, hints, graph, MathML, routes and mobile passed.');
}finally{await browser.close();server.close();}
