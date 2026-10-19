import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalLessonTasks,NORMAL_STORAGE_KEY} from '../normal-lesson.js';
import {normalTasks} from '../tasks/bank/normal.js';
import {normalPages} from '../normal-routes.js';
import {normalModules,normalGoals} from '../normal-plan.js';
const dir=resolve(fileURLToPath(new URL('..',import.meta.url)));
const server=createServer(async(req,res)=>{try{const p=resolve(dir,'.'+(decodeURIComponent(req.url.split('?')[0])==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));if(!p.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const errors=[];
const routeFor=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.id==='norm.density'?'taethed':t.id==='norm.milk'?'vaerktoej':t.id.includes('.mini.')?({variable:'model',parameters:'model',population:'model',density:'taethed',point:'taethed',symmetry:'fordeling',cdf:'fordeling',between:'fordeling',quantile:'vaerktoej',independent:'vaerktoej'}[t.id.split('.').at(-1)]):'oevelser';
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage();page.setDefaultTimeout(12000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async path=>{await page.evaluate(path=>window.showMathView(path),path);await page.waitForFunction(path=>location.hash==='#'+path,path);};
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 const answer=async(t,wrong=false)=>{await go('normalDistribution/1/'+routeFor(t));for(const p of t.parts){const field=card(t.id).locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(wrong?p.options.find(o=>o.id!==p.answer).id:p.answer);else await field.fill(wrong?'999':p.answer);}await card(t.id).locator('button[type=submit]').click();};
 await page.goto(url+'/?preview=1#normalDistribution/1');await page.locator('#normal-module-one').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>location.hash),'#normalDistribution/1/start');
 assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'Ikke begyndt');
 assert.equal(await page.locator('#odeLesson').isVisible(),false);
 assert.equal(await page.locator('#normal-module-one [data-int-card]').count(),37);
 // An arithmetic error opens its own foundational help and persists hints and answer.
 const pre=normalLessonTasks.find(t=>t.id==='norm.pre.percent');await answer(pre,true);
 assert.match(await card(pre.id).locator('[data-feedback]').innerText(),/hundrede/);
 await card(pre.id).locator('[data-int-jump]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'normal-basics');
 assert.ok(await page.locator('[data-basic=percent]').getAttribute('open')!==null);
 await card(pre.id).locator('[data-int-hint]').click();await page.reload();await card(pre.id).waitFor({state:'visible'});
 assert.equal(await card(pre.id).locator('input').inputValue(),'999');assert.equal(await card(pre.id).locator('.int-hints p').count(),1);
 assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'I gang');
 // Misconception feedback differs from arithmetic and percentage format feedback.
 await go('normalDistribution/1/taethed');await card('norm.density').locator('[name=point]').fill('3,989');await card('norm.density').locator('button[type=submit]').click();
 assert.match(await card('norm.density').locator('[data-feedback=point]').innerText(),/højde|kurvens/);
 await go('normalDistribution/1/vaerktoej');await card('norm.milk').locator('input').fill('2,28');await card('norm.milk').locator('button[type=submit]').click();assert.match(await card('norm.milk').locator('[data-feedback]').innerText(),/Procentregning/);
 // Every rendered exercise is answered through its actual UI.
 for(const t of normalLessonTasks){await answer(t);assert.ok(await card(t.id).evaluate(el=>el.classList.contains('is-correct')),t.id);}
 assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'Gennemført');await page.reload();await page.locator('#normal-module-one').waitFor({state:'visible'});
 assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'Gennemført');
 await card('norm.final.middle').locator('input').fill('0,8');assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'I gang');await answer(normalLessonTasks.find(t=>t.id==='norm.final.middle'));
 await go('normalDistribution/1/oevelser');await page.locator('#normal-notes').fill('Model, liter, venstre areal, output og min konklusion.');await page.reload();await page.locator('#normal-notes').waitFor({state:'visible'});assert.match(await page.locator('#normal-notes').inputValue(),/konklusion/);
 // Paired graphs update through keyboard and area choice; invalid intervals are explicit.
 await go('normalDistribution/1/taethed');const lab=page.locator('[data-normal-lab=normal-area]');
 const before=await lab.locator('[data-normal-density] [data-plot]').innerHTML();await page.locator('#normal-area-mean').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await lab.locator('[data-normal-density] [data-plot]').innerHTML(),before);
 for(const mode of ['left','right','between']){await page.locator('#normal-area-mode').selectOption(mode);assert.match(await lab.locator('[data-normal-result]').innerText(),/cirka/);assert.ok((await lab.locator('[data-shade]').getAttribute('d')).length>10);}
 await page.locator('#normal-area-sd').fill('0.05');assert.match(await lab.locator('[data-normal-result]').innerText(),/tæthed/);
 await page.locator('#normal-area-a').fill('30');assert.match(await lab.locator('[data-normal-error]').innerText(),/Nedre grænse/);assert.equal(await lab.locator('svg:visible').count(),0);await page.locator('#normal-area-a').fill('6');
 await go('normalDistribution/1/vaerktoej');await page.locator('#normal-inverse button').click();assert.match(await page.locator('#normal-inverse-result').innerText(),/8,9866/);await page.locator('#normal-inverse-sd').fill('0');await page.locator('#normal-inverse button').click();assert.match(await page.locator('#normal-inverse-result').innerText(),/positiv spredning/);
 // MathML namespace, fractions, powers and limits; no ASCII mathematical notation.
 const mathProblems=await page.locator('#normalLesson math').evaluateAll(nodes=>nodes.flatMap(m=>[...(m.namespaceURI!=='http://www.w3.org/1998/Math/MathML'?['namespace']:[]),...[...m.querySelectorAll('mfrac,msup,msub')].filter(el=>el.children.length!==2).map(el=>el.outerHTML),...[...m.querySelectorAll('msubsup')].filter(el=>el.children.length!==3).map(el=>el.outerHTML)]));assert.deepEqual(mathProblems,[]);
 assert.doesNotMatch(await page.locator('#normalLesson').innerText(),/N\(mu|sqrt|x\^2|z=\(x|mnormalller/);
 // Navigation forward/back, direct routes, overview links and planned pages.
 for(let i=0;i<normalPages.length;i++){await go(normalPages[i]);assert.equal(await page.locator('[data-normal-step]:visible').count(),1);assert.equal(await page.locator('.normal-step-menu [aria-current]').count(),1);await page.locator('.normal-page-controls a').last().click();await page.waitForURL('**/*#'+(i<normalPages.length-1?normalPages[i+1]:'normalDistribution/2/start'));}
 await go('normalDistribution/1/model');await page.locator('.normal-page-controls a').first().click();await page.waitForURL('**/*#normalDistribution/1/start');await page.goBack();await page.waitForURL('**/*#normalDistribution/1/model');
 await go('normalDistribution/1/start');await page.locator('.normal-step-menu a').nth(1).focus();await page.keyboard.press('Enter');await page.waitForURL('**/*#normalDistribution/1/model');await page.waitForFunction(()=>document.activeElement.id==='subjectTitle');
 for(const m of normalModules.slice(2)){await go('normalDistribution/'+m.id);assert.match(await page.locator('#normal-planned').innerText(),/Planlagt · ikke implementeret/);assert.equal(await page.locator('[data-normal-step]:visible').count(),0);await page.locator('.normal-breadcrumb a').click();await page.waitForURL('**/*#normalDistribution');}
 assert.equal(await page.locator('#normal-overview .module-card').count(),7);await page.locator('#normal-overview details > summary').click();assert.equal(await page.locator('#normal-overview tbody tr').count(),normalGoals.length);assert.match(await page.locator('[data-normal-overall]').innerText(),/1 af 6/);
 for(const path of ['equations','quadratic','composite','differentiation','planeGeometry','integration/1/start/1','differentialEquations/1/start','formulas','tasks']){await go(path);assert.equal(await page.locator('#normalLesson').isVisible(),false);}
 // Shared bank: all tasks in training; exam hides hints/solutions and topic metadata.
 const fixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'normal-bank',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
 for(const task of normalTasks){await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(task));await page.reload();await page.locator('.task-question').waitFor();for(const p of task.parts){if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);}await page.locator('[data-task-action=check]').click();assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find det trin/);}
 await page.evaluate(s=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(s)),fixture(normalTasks.find(t=>t.id==='norm.model'),'exam'));await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);assert.doesNotMatch(await page.locator('.task-question').innerText(),/Gennemregnet løsning|Læringsmål|venstre hale|fordelingsfunktion/i);
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="norm.1"]').first().click();await page.waitForURL('**/*#normalDistribution/1/start');
 await go('normalDistribution/1/fordeling');await page.screenshot({path:'/tmp/matematik-normal-desktop.png',fullPage:true});await ctx.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));
 await phone.goto(url+'/?preview=1#normalDistribution/1/taethed');await phone.locator('#normal-area-mean').waitFor({state:'visible'});
 for(const path of [...normalPages,'normalDistribution','normalDistribution/repetition']){await phone.evaluate(path=>window.showMathView(path),path);assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path);}
 await phone.evaluate(()=>window.showMathView('normalDistribution/1/taethed'));await phone.screenshot({path:'/tmp/matematik-normal-mobile.png',fullPage:true});await mobile.close();
 const bad=await browser.newContext();await bad.addInitScript(key=>localStorage.setItem(key,'broken'),NORMAL_STORAGE_KEY);const bpage=await bad.newPage();await bpage.goto(url+'/?preview=1#normalDistribution/1');await bpage.locator('#normal-module-one [data-lesson-warning]').waitFor({state:'visible'});await bad.close();
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('blocked');};});const b=await blocked.newPage();await b.goto(url+'/?preview=1#normalDistribution/1/start');await b.locator('[data-int-card="norm.pre.percent"] input').fill('0,25');await b.locator('#normal-module-one [data-lesson-warning]').waitFor({state:'visible'});await blocked.close();
 assert.deepEqual(errors,[]);console.log('Normal browser passed: all 37 cards, graphs, MathML, feedback, notes, completion, storage/reload, routes, bank/exam, keyboard and mobile.');
}finally{await browser.close();server.close();}
