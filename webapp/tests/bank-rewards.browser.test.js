import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {fixture} from './account-fixture.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import '../scripts/build.js';
const f=await fixture(),browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const task=bank.map(t=>instantiate(t.id,'bank-browser')).find(t=>t.parts.length===1&&t.parts[0].type==='number'&&t.parts[0].points>1);
const points=task.parts[0].points;
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(f.origin);await page.locator('.auth-tabs [data-auth-mode=signup]').click();await page.locator('#accountUsername').fill('bank_browser');await page.locator('#accountPassword').fill('bank-browser-password');await page.locator('#repeatPassword').fill('bank-browser-password');await page.locator('#accountSubmit').click();await page.locator('.personal-overview').waitFor();
 const start=async mode=>{
  await page.evaluate(async({mode,id,version})=>{
   const store=await import('/account/store.js');
   const session={mode,status:'active',seed:'bank-browser',items:[{id,version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),rewardId:crypto.randomUUID(),minutes:10,timer:false};
   store.accountStorage.setItem('christian-matematik.tasks.v1',JSON.stringify({schema:1,completed:[],history:[],session}));await store.flush();
  },{mode,id:task.id,version:task.version});
  await page.goto(f.origin+'/#tasks');await page.reload();await page.locator('.task-question input').waitFor();
  await page.locator('.task-question input').fill(String(task.parts[0].answer));
 };
 const saved=async()=>assert.equal(await page.evaluate(async()=>await(await import('/account/store.js')).flush()),true);
 const balance=async expected=>{await saved();assert.equal(await page.locator('#rewardPoints').textContent(),String(expected));};
 const finish=async()=>{await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();};
 await start('training');await balance(0);await page.locator('[data-task-action=check]').click();await balance(points);await finish();await balance(points);
 assert.match(await page.locator('.task-reward-note').textContent(),new RegExp(`${points} butikspoint`));
 await page.reload();await page.locator('.task-score').waitFor();await balance(points);
 await start('training');await page.locator('[data-task-action=check]').click();await balance(2*points);
 await start('exam');await balance(2*points);await finish();await balance(3*points);
 assert.deepEqual(errors,[]);console.log('Bank reward browser passed: full training score, same-set retry/reload, repeated task in a new set, submitted exam.');
}finally{await browser.close();await f.close();}
