import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fixture} from './account-fixture.js';
import {trigTasks} from '../tasks/bank/trigonometry.js';
import {trigSteps} from '../trig-plan.js';
const f=await fixture(),browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const errors=[];
const go=(page,path)=>page.evaluate(path=>window.showMathView(path),path);
async function login(page,name,signup=false){await page.goto(f.origin);await page.locator('#accountLanding').waitFor();if(signup)await page.locator('.auth-tabs [data-auth-mode=signup]').click();await page.locator('#accountUsername').fill(name);await page.locator('#accountPassword').fill('trigonometri-lokal-testkode-123');if(signup)await page.locator('#repeatPassword').fill('trigonometri-lokal-testkode-123');await page.locator('#accountSubmit').click();await page.locator('html[data-sidebar-navigation=ready]').waitFor();}
const save=async p=>assert.equal(await p.evaluate(async()=> (await import('/account/store.js')).flush()),true);
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
 await login(page,'trig_elev',true);
 for(const m of ['1','2'])for(const [step] of trigSteps){await go(page,`trigonometry/${m}/${step}`);assert.ok(await page.locator(`#trig-module-${m} [data-trig-step="${step}"]`).isVisible());assert.equal(await page.locator('#vectorLesson').isVisible(),false);}
 await go(page,'trigonometry/1');assert.equal(await page.evaluate(()=>location.hash),'#trigonometry/1/start');
 for(const task of trigTasks){await go(page,`trigonometry/${task.module.split('.')[1]}/${task.step}`);const card=page.locator(`[data-int-card="${task.id}"]`);for(const p of task.parts){const input=card.locator(`[name="${p.id}"]`);if(p.type==='choice')await input.selectOption(p.answer);else await input.fill(p.answer.replace('.',','));}await card.locator('button[type=submit]').click();assert.ok(await card.evaluate(e=>e.classList.contains('is-correct')),task.id);}
 for(const m of ['1','2'])assert.equal(await page.locator(`[data-trig-status="${m}"]`).textContent(),'Gennemført');
 await go(page,'trigonometry/2/modeller');await page.locator('#trig-notes-2').fill('Radianer, to grene, interval og kontrol.');await page.locator('[data-int-card="trig2.wheel"] [data-int-hint]').click();await save(page);
 const rows=await page.evaluate(async()=> (await import('/account/store.js')).completions());assert.equal(rows.filter(r=>r.topic==='trigonometry').length,28);assert.ok(rows.every(r=>r.route.startsWith('trigonometry/')&&['Modul 1','Modul 2'].includes(r.module)));
 await go(page,'shop');await page.locator('[data-filter=overview]').click();await page.waitForFunction(()=>document.querySelector('.point-summary')?.textContent.includes('28'));assert.match(await page.locator('[data-point-trig-status="2"]').innerText(),/Gennemført/);
 // Actual persisted account on another device, including active status rollback and retained points.
 const other=await browser.newContext(),b=await other.newPage();await login(b,'trig_elev');await go(b,'trigonometry/2/modeller');assert.equal(await b.locator('#trig-notes-2').inputValue(),'Radianer, to grene, interval og kontrol.');assert.equal(await b.locator('[data-int-card="trig2.wheel"] .int-hints p').count(),1);
 await b.locator('[data-int-card="trig2.wheel"] [name=h]').fill('999');assert.equal(await b.locator('[data-trig-status="2"]').textContent(),'I gang');await save(b);await b.reload();await b.locator('html[data-sidebar-navigation=ready]').waitFor();assert.equal(await b.locator('[data-trig-status="2"]').textContent(),'I gang');
 const rewards=await b.evaluate(async()=>await (await fetch('/api/shop')).json());assert.equal(rewards.earnedPoints,28);assert.equal(rewards.pointOverview.find(r=>r.topic==='trigonometry').solved,28);
 // A real bank training check awards result points under the same topic.
 await b.evaluate(async()=>{const store=await import('/account/store.js');store.accountStorage.setItem('christian-matematik.tasks.v1',JSON.stringify({schema:1,completed:[],history:[],session:{mode:'training',status:'active',seed:'trig-bank',items:[{id:'trig2.isolate',version:1}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),rewardId:crypto.randomUUID(),minutes:10,timer:false}}));await store.flush();});
 await b.goto(f.origin+'/#tasks');await b.reload();await b.locator('.task-question input').fill('0,5');await b.locator('[data-task-action=check]').click();await save(b);
 const bankRewards=await b.evaluate(async()=>await (await fetch('/api/shop')).json());assert.equal(bankRewards.earnedPoints,30);assert.equal(bankRewards.pointOverview.find(r=>r.topic==='trigonometry').points,30);
 // Check graph keyboard access, edge cases, accessible fields, unique IDs and mobile layout.
 await go(b,'trigonometry/2/udforsk');const before=await b.locator('[data-trig-readout]').last().textContent();await b.locator('#trig-lab-2-w').focus();await b.keyboard.press('ArrowRight');assert.notEqual(await b.locator('[data-trig-readout]').last().textContent(),before);
 await b.locator('#trig-lab-2-a').fill('0');await b.locator('#trig-lab-2-level').fill('1');assert.match(await b.locator('[data-trig-roots]').last().textContent(),/alle x/);
 assert.deepEqual(await b.locator('#trigLesson input,#trigLesson select,#trigLesson textarea').evaluateAll(els=>els.filter(e=>!e.labels?.length).map(e=>e.id)),[]);
 assert.deepEqual(await b.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);}),[]);
 await b.setViewportSize({width:390,height:844});assert.ok(await b.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await b.waitForTimeout(400);await b.screenshot({path:'/tmp/trigonometry-mobile.png',fullPage:true});
 await b.setViewportSize({width:1440,height:1000});await b.waitForTimeout(400);await b.screenshot({path:'/tmp/trigonometry-desktop.png',fullPage:true});
 await go(b,'tasks');await b.locator('[data-task-action=finish]').click();await b.locator('[data-task-action=submit]').click();await b.locator('[data-task-action=new]').click();assert.ok(await b.locator('input[name=topics][value=trigonometry]').isVisible());await b.evaluate(()=>window.openTrigSection('trig-module-2'));assert.equal(await b.evaluate(()=>location.hash),'#trigonometry/2/teori');
 const fresh=await browser.newContext(),c=await fresh.newPage();await login(c,'trig_anden',true);await go(c,'trigonometry/2/modeller');assert.equal(await c.locator('#trig-notes-2').inputValue(),'');assert.equal(await c.locator('[data-trig-status="2"]').textContent(),'Ikke begyndt');assert.deepEqual(errors,[]);
 console.log('Trigonometry browser checks passed: both modules, all 28 answers, account persistence, point attribution, editing, isolation, graph, mobile and bank navigation.');
}finally{await browser.close();await f.close();}
