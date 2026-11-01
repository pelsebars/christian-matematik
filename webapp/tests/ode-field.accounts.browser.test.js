import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fixture} from './account-fixture.js';
import {fieldLessonTasks,FIELD_STORAGE_KEY} from '../ode-field-lesson.js';
import {fieldTaskStep} from '../ode-field-exercises.js';
import '../scripts/build.js';
const f=await fixture(),browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[];
async function enter(page,name,signup=false){await page.goto(f.origin);await page.locator('#accountLanding').waitFor();if(signup)await page.locator('.auth-tabs [data-auth-mode=signup]').click();await page.locator('#accountUsername').fill(name);await page.locator('#accountPassword').fill('midlertidig-testkonto-kun-lokalt');if(signup)await page.locator('#repeatPassword').fill('midlertidig-testkonto-kun-lokalt');await page.locator('#accountSubmit').click();await page.locator('html[data-sidebar-navigation=ready]').waitFor();}
const go=(p,path)=>p.evaluate(path=>window.showMathView(path),path);
const saved=async p=>assert.equal(await p.evaluate(async()=>(await import('/account/store.js')).flush()),true);
const rows=p=>p.evaluate(async()=>(await import('/account/store.js')).completions());
try{
 const ca=await browser.newContext(),a=await ca.newPage();a.on('pageerror',e=>errors.push(e.message));await enter(a,'ode4_elev_a',true);
 await go(a,'differentialEquations/1/oevelser');await a.locator('[data-int-card="ode.notation"] select').selectOption('function');await a.locator('[data-int-card="ode.notation"] button[type=submit]').click();await saved(a);
 for(const task of fieldLessonTasks){await go(a,'differentialEquations/4/'+fieldTaskStep(task));const c=a.locator(`[data-int-card="${task.id}"]`);for(const p of task.parts){if(p.type==='choice')await c.locator(`[name="${p.id}"]`).selectOption(p.answer);else await c.locator(`[name="${p.id}"]`).fill(p.answer);}await c.locator('button[type=submit]').click();}
 await go(a,'differentialEquations/4/modeller');await a.locator('#ode4-notes').fill('Min kontrol: afledt, startpunkt, enheder og interval.');await a.locator('[data-int-card="ode4.vessel"] [data-int-hint]').click();await saved(a);
 assert.equal(await a.locator('[data-ode-status="4"]').textContent(),'Gennemført');const records=await rows(a);assert.equal(records.filter(r=>r.topic==='differentialEquations'&&r.module==='Modul 4').length,25);assert.ok(records.filter(r=>r.module==='Modul 4').every(r=>r.route.startsWith('differentialEquations/4/')));assert.equal(records.filter(r=>r.module==='Modul 1').length,1);
 const cb=await browser.newContext(),b=await cb.newPage();await enter(b,'ode4_elev_a');await go(b,'differentialEquations/4/modeller');assert.equal(await b.locator('[data-ode-status="4"]').textContent(),'Gennemført');assert.match(await b.locator('#ode4-notes').inputValue(),/Min kontrol/);assert.equal(await b.locator('[data-int-card="ode4.vessel"] .int-hints p').count(),1);
 await go(b,'differentialEquations/4/oevelser');await b.locator('[data-int-card="ode4.exponential"] [name=slope]').fill('99');assert.equal(await b.locator('[data-ode-status="4"]').textContent(),'I gang');await saved(b);await b.reload();await b.locator('#ode-module-four').waitFor({state:'visible'});assert.equal(await b.locator('[data-ode-status="4"]').textContent(),'I gang');assert.equal((await rows(b)).filter(r=>r.module==='Modul 4').length,25);assert.equal(await b.locator('[data-ode-status="1"]').textContent(),'I gang');
 const cc=await browser.newContext(),c=await cc.newPage();await enter(c,'ode4_elev_b',true);await go(c,'differentialEquations/4/modeller');assert.equal(await c.locator('#ode4-notes').inputValue(),'');assert.equal(await c.locator('[data-ode-status="4"]').textContent(),'Ikke begyndt');
 const db=await f.pool.query('SELECT namespace FROM learning_state WHERE namespace=$1',[FIELD_STORAGE_KEY]);assert.equal(db.rows.length,1);assert.deepEqual(errors,[]);console.log('ODE M4 account test passed: 25 saved cards, module 4 achievements, second device, notes/hints, user isolation, mastery rollback preserves history and M1.');
}finally{await browser.close();await f.close();}
