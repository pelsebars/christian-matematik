import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {localLessonTasks,LOCAL_STORAGE_KEY} from '../ode-local-lesson.js';
import {localTasks} from '../tasks/bank/ode-local.js';
import {localSteps} from '../ode-routes.js';
import {odeLessonTasks,ODE_STORAGE_KEY} from '../ode-lesson.js';
import { localTaskStep as stepFor } from '../ode-local-exercises.js';
const dir=resolve(import.meta.dirname,'..');
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.split('?')[0]);const p=resolve(dir,'.'+(path==='/'?'/index.html':path));if(!p.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[];
const fixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'ode3',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 const old=JSON.stringify({version:1,cards:Object.fromEntries(odeLessonTasks.map(t=>[t.id,{answers:Object.fromEntries(t.parts.map(p=>[p.id,p.answer])),checked:true,hints:0}]))});
 await ctx.addInitScript(({key,state})=>{if(!localStorage.getItem(key))localStorage.setItem(key,state);},{key:ODE_STORAGE_KEY,state:old});
 const go=path=>page.evaluate(path=>window.showMathView(path),path),card=id=>page.locator(`[data-int-card="${id}"]`);
 await page.goto(url+'/?preview=1#differentialEquations/3');await page.locator('#ode-module-three').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>location.hash),'#differentialEquations/3/start');assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');
 await card('ode3.pre.coordinates').locator('input').fill('0');await card('ode3.pre.coordinates').locator('button[type=submit]').click();await card('ode3.pre.coordinates').locator('[data-int-jump]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'ode3-basics');
 for(const task of localLessonTasks){await go('differentialEquations/3/'+stepFor(task));for(const p of task.parts){const field=card(task.id).locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(p.answer);else await field.fill(p.answer);}await card(task.id).locator('button[type=submit]').click();assert.ok(await card(task.id).evaluate(el=>el.classList.contains('is-correct')),task.id);}
 assert.equal(await page.locator('[data-ode-status="3"]').textContent(),'Gennemført');
 await go('differentialEquations/3/cas');await page.locator('#ode3-notes').fill('Min CAS-kontrol, enheder og interval.');await card('ode3.mexico').locator('[data-int-hint]').click();await page.reload();await page.locator('#ode3-notes').waitFor({state:'visible'});assert.match(await page.locator('#ode3-notes').inputValue(),/CAS-kontrol/);assert.equal(await card('ode3.mexico').locator('.int-hints p').count(),1);
 await go('differentialEquations/3/oevelser');await card('ode3.negative').locator('[name=slope]').fill('99');assert.equal(await page.locator('[data-ode-status="3"]').textContent(),'I gang');assert.equal(await page.locator('[data-ode-status="1"]').textContent(),'Gennemført');assert.equal(await page.evaluate(key=>localStorage.getItem(key),ODE_STORAGE_KEY),old);
 await go('differentialEquations/3/udforsk');const before=await page.locator('#ode3-reading').innerText();await page.locator('#ode3-x').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await page.locator('#ode3-reading').innerText(),before);
 assert.equal(await page.locator('[data-local-curve]').count(),1);await page.locator('#ode3-curve').uncheck();assert.equal(await page.locator('[data-local-curve]').count(),0);
 await page.locator('#ode3-model').selectOption('root');await page.locator('#ode3-y').fill('0');assert.match(await page.locator('#ode3-reading').innerText(),/ikke defineret/);assert.equal(await page.locator('[data-local-tangent],[data-local-element]').count(),0);await page.locator('#ode3-y').fill('4');assert.equal(await page.locator('[data-local-element]').count(),1);assert.equal(await page.locator('#ode3-curve').isDisabled(),true);
 await page.locator('#ode3-model').selectOption('quotient');await page.locator('#ode3-y').fill('-2');assert.equal(await page.locator('[data-local-element]').count(),1);await page.locator('#ode3-model').selectOption('linear');await page.locator('#ode3-curve').check();
 assert.deepEqual(await page.locator('#ode-module-three math,#ode-module-three msup,#ode-module-three mfrac').evaluateAll(ns=>ns.filter(e=>e.namespaceURI!=='http://www.w3.org/1998/Math/MathML'||(['msup','mfrac'].includes(e.tagName)&&e.children.length!==2)).map(e=>e.outerHTML)),[]);
 assert.deepEqual(await page.locator('#ode-module-three input,#ode-module-three select,#ode-module-three textarea').evaluateAll(es=>es.filter(e=>!e.labels?.length).map(e=>e.id)),[]);
 assert.deepEqual(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);}),[]);
 for(const [step] of localSteps){await go('differentialEquations/3/'+step);assert.equal(await page.locator('[data-ode-step]:visible').count(),1);assert.equal(await page.locator('.ode-step-menu [aria-current=step]').count(),1);}
 await go('differentialEquations/1/opsummering');await page.locator('.ode-page-controls a').last().click();await page.waitForURL('**/*#differentialEquations/2/start');await go('differentialEquations/2/opsummering');await page.locator('.ode-page-controls a').last().click();await page.waitForURL('**/*#differentialEquations/3/start');
 await go('differentialEquations/6');assert.match(await page.locator('#ode-planned').innerText(),/Planlagt/);
 await go('tasks');for(const task of localTasks){await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(task));await page.reload();await page.locator('.task-question').waitFor();for(const p of task.parts){if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);}await page.locator('[data-task-action=check]').click();assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find det trin/);}
 await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(localTasks.find(t=>t.id==='ode3.mexico'),'exam'));await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="ode.3"]').first().click();await page.waitForURL('**/*#differentialEquations/3/start');
 await go('differentialEquations/3/udforsk');await page.locator('#ode-module-three').screenshot({path:'/tmp/ode3-desktop.png'});
 await page.setViewportSize({width:390,height:844});for(const [step] of localSteps){await go('differentialEquations/3/'+step);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),step);}await go('differentialEquations/3/udforsk');await page.locator('#ode-module-three').screenshot({path:'/tmp/ode3-mobile.png'});
 assert.deepEqual(errors,[]);console.log('ODE M3 browser: all 32 cards, 17 bank tasks, exam, M1 preservation, notes, hints, graph, MathML, routes and mobile passed.');
}finally{await browser.close();server.close();}
