import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fixture} from './account-fixture.js';
import {vectorLessonTasks} from '../vector-lesson.js';
import {vectorTaskStep} from '../vector-exercises.js';
import '../scripts/build.js';
const f=await fixture();
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const errors=[];
async function enter(page,name,signup=false){await page.goto(f.origin);await page.locator('#accountLanding').waitFor();if(signup)await page.locator('.auth-tabs [data-auth-mode=signup]').click();await page.locator('#accountUsername').fill(name);await page.locator('#accountPassword').fill('midlertidig-testkonto-kun-lokalt');if(signup)await page.locator('#repeatPassword').fill('midlertidig-testkonto-kun-lokalt');await page.locator('#accountSubmit').click();await page.locator('html[data-sidebar-navigation=ready]').waitFor();}
const go=(page,path)=>page.evaluate(path=>window.showMathView(path),path);
const saved=async page=>assert.equal(await page.evaluate(async()=> (await import('/account/store.js')).flush()),true);
try{
 const ca=await browser.newContext(),a=await ca.newPage();a.on('pageerror',e=>errors.push(e.message));await enter(a,'vektor_elev_a',true);
 await go(a,'normalDistribution/1/start');const old=a.locator('[data-int-card="norm.pre.percent"]');await old.locator('input').fill('0,25');await old.locator('button[type=submit]').click();await saved(a);
 await go(a,'vectorFunctions/1/start');assert.equal(await a.locator('[data-vector-status="1"]').textContent(),'Ikke begyndt');
 for(const t of vectorLessonTasks){await go(a,'vectorFunctions/1/'+vectorTaskStep(t));const card=a.locator(`[data-int-card="${t.id}"]`);for(const p of t.parts){if(p.type==='choice')await card.locator(`[name="${p.id}"]`).selectOption(p.answer);else await card.locator(`[name="${p.id}"]`).fill(p.answer);}await card.locator('button[type=submit]').click();}
 assert.equal(await a.locator('[data-vector-status="1"]').textContent(),'Gennemført');
 await go(a,'vectorFunctions/1/modeller');await a.locator('#vector-notes').fill('Mine CAS-indtastninger, output og kontrollen på min konto.');await a.locator('[data-int-card="vf1.cas-check"] [data-int-hint]').click();await saved(a);
 const rows=await a.evaluate(async()=> (await import('/account/store.js')).completions());assert.equal(rows.filter(r=>r.topic==='vectorFunctions').length,37);assert.ok(rows.filter(r=>r.topic==='vectorFunctions').every(r=>r.module==='Modul 1'&&r.route.startsWith('vectorFunctions/1/')));assert.equal(rows.filter(r=>r.topic==='normalDistribution').length,1);
 const cb=await browser.newContext(),b=await cb.newPage();b.on('pageerror',e=>errors.push(e.message));await enter(b,'vektor_elev_a');await go(b,'vectorFunctions/1/modeller');
 assert.equal(await b.locator('[data-vector-status="1"]').textContent(),'Gennemført');assert.match(await b.locator('#vector-notes').inputValue(),/på min konto/);assert.equal(await b.locator('[data-int-card="vf1.cas-check"] .int-hints p').count(),1);
 await go(b,'vectorFunctions/1/oevelser');await b.locator('[data-int-card="vf1.position"] [name=x]').fill('999');assert.equal(await b.locator('[data-vector-status="1"]').textContent(),'I gang');await saved(b);await b.reload();await b.locator('#vector-module-one').waitFor({state:'visible'});assert.equal(await b.locator('[data-vector-status="1"]').textContent(),'I gang');assert.equal(await b.locator('[data-int-card="vf1.position"] [name=x]').inputValue(),'999');
 const retained=await b.evaluate(async()=> (await import('/account/store.js')).completions());assert.equal(retained.filter(r=>r.topic==='vectorFunctions').length,37);
 await go(b,'normalDistribution/1/start');assert.equal(await b.locator('[data-int-card="norm.pre.percent"] input').inputValue(),'0,25');assert.ok(await b.locator('[data-int-card="norm.pre.percent"]').evaluate(el=>el.classList.contains('is-correct')));
 const cc=await browser.newContext(),c=await cc.newPage();await enter(c,'vektor_elev_b',true);await go(c,'vectorFunctions/1/modeller');assert.equal(await c.locator('[data-vector-status="1"]').textContent(),'Ikke begyndt');assert.equal(await c.locator('#vector-notes').inputValue(),'');assert.equal(await c.locator('[data-int-card="vf1.cas-check"] .int-hints p').count(),0);
 assert.deepEqual(errors,[]);console.log('Vector account tests passed: all checked answers, correct topic/module/route, persisted completion and rollback, separate device, notes and hints, retained normal answers, historical achievements and user isolation.');
}finally{await browser.close();await f.close();}
