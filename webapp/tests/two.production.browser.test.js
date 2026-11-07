// Loads real production assets. API calls use an isolated local test database;
// this smoke check never creates accounts, completions or purchases in production.
import assert from 'node:assert/strict';
import {chromium,request} from 'playwright';
import {fixture} from './account-fixture.js';
const count=Number(process.argv[2]||4),origin='https://christian-matematik-webapp.vercel.app';
const f=await fixture(),api=await request.newContext({baseURL:f.origin,extraHTTPHeaders:{origin:f.origin}}),browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
try{
 const signup=await api.post('/api/auth/sign-up/email',{data:{username:'production_asset_smoke',password:'local-only-smoke-password-123'}});assert.ok(signup.ok(),await signup.text());
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/api/**',async route=>{
  const req=route.request(),url=new URL(req.url());
  const response=await api.fetch(url.pathname+url.search,{method:req.method(),data:req.postData()||undefined,headers:{'content-type':'application/json'}});
  await route.fulfill({status:response.status(),contentType:'application/json',body:await response.body()});
 });
 await p.goto(origin+'/#twoVariables');await p.locator('html[data-sidebar-navigation=ready]').waitFor();
 assert.equal(await p.locator('[data-two-status]').count(),count);
 for(let m=1;m<=count;m++)for(const step of ['start','teori','udforsk','oevelser','modeller','slut']){
  await p.evaluate(path=>window.showMathView(path),`twoVariables/${m}/${step}`);assert.ok(await p.locator(`#two-module-${m} [data-two-step=${step}]`).isVisible());
 }
 await p.evaluate(()=>window.showMathView('twoVariables/1/start'));const card=p.locator('[data-int-card="two1.substitute"]');await card.locator('input').fill('3');await card.locator('[type=submit]').click();assert.ok(await card.evaluate(e=>e.classList.contains('is-correct')));assert.equal(await p.evaluate(async()=>(await import('/account/store.js')).flush()),true);
 await p.evaluate(()=>window.showMathView('shop'));await p.locator('[data-filter=overview]').click();assert.equal(await p.locator('[data-point-two-status]').count(),count);await p.locator('[data-point-two-status="1"]').getByRole('link').click();assert.equal(await p.evaluate(()=>location.hash),'#twoVariables/1/start');
 await p.evaluate(()=>window.showMathView('tasks'));assert.ok(await p.locator('input[name=topics][value=twoVariables]').isVisible());assert.deepEqual(errors,[]);
 console.log(`Production frontend smoke passed for ${count} modules, navigation, checked answer, shop and bank; all API writes stayed in isolated local test DB.`);
}finally{await browser.close();await api.dispose();await f.close();}
