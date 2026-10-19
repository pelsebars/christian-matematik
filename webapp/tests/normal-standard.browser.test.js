import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {standardLessonTasks,STANDARD_STORAGE_KEY,STANDARD_NOTES_KEY} from '../normal-standard-lesson.js';
import {normalLessonTasks,NORMAL_STORAGE_KEY} from '../normal-lesson.js';
import {normalStandardTasks} from '../tasks/bank/normal-standard.js';
import {pagesForNormalModule,normalImplemented} from '../normal-routes.js';
import {normalModules,normalGoals} from '../normal-plan.js';
const dir=resolve(fileURLToPath(new URL('..',import.meta.url)));
const server=createServer(async(req,res)=>{try{const request=decodeURIComponent(req.url.split('?')[0]),p=resolve(dir,'.'+(request==='/'?'/index.html':request));if(!p.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'}),errors=[];
const pages=pagesForNormalModule('2');
const routeFor=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':!t.id.includes('.mini.')?'oevelser':({unit:'standard',positive:'standard',negative:'standard',reverse:'tilbage',compare:'tilbage',shape:'tilbage',normal:'udfald',boundary:'udfald',coverage:'udfald',tail:'sandsynlighed',quantile:'sandsynlighed'}[t.id.split('.').at(-1)]);
const bankFixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'standard-bank',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(12000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async path=>{await page.evaluate(path=>window.showMathView(path),path);await page.waitForURL('**/*#'+path);};
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 const answer=async(t,wrong=false)=>{await go('normalDistribution/2/'+routeFor(t));for(const p of t.parts){const field=card(t.id).locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(wrong?p.options.find(o=>o.id!==p.answer).id:p.answer);else await field.fill(wrong?'999':p.answer);}await card(t.id).locator('button[type=submit]').click();};
 await page.goto(url+'/?preview=1#normalDistribution/2');await page.locator('#normal-module-two').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>location.hash),'#normalDistribution/2/start');
 assert.equal(await page.locator('[data-normal-status="2"]').textContent(),'Ikke begyndt');assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'Ikke begyndt');assert.equal(await page.locator('#normal-module-two [data-int-card]').count(),40);assert.equal(await page.locator('#normal-module-one').isVisible(),false);
 const pre=standardLessonTasks.find(t=>t.id==='norm2.pre.decimal');await answer(pre,true);assert.match(await card(pre.id).locator('[data-feedback]').innerText(),/Decimalregning/);
 await card(pre.id).locator('[data-int-jump]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'standard-basics');assert.ok(await page.locator('[data-standard-basic=decimal]').getAttribute('open')!==null);
 await card(pre.id).locator('[data-int-hint]').click();await page.reload();await card(pre.id).waitFor({state:'visible'});assert.equal(await card(pre.id).locator('input').inputValue(),'999');assert.equal(await card(pre.id).locator('.int-hints p').count(),1);
 assert.equal(await page.locator('[data-normal-status="2"]').textContent(),'I gang');
 await go('normalDistribution/2/oevelser');const distance=card('norm2.distance');
 for(const [wrong,feedback] of [['-2',/Regnefejl/],['49',/Begrebsfejl/],['1',/Fortegnsfejl/]]){await distance.locator('[name=z]').fill(wrong);await distance.locator('button[type=submit]').click();assert.match(await distance.locator('[data-feedback=z]').innerText(),feedback);}
 const boundary=card('norm2.fish-boundary');await boundary.locator('[name=second]').selectOption('exceptional');await boundary.locator('button[type=submit]').click();assert.match(await boundary.locator('[data-feedback=second]').innerText(),/præcis tre|Grænsefejl/);
 for(const task of standardLessonTasks){await answer(task);assert.ok(await card(task.id).evaluate(el=>el.classList.contains('is-correct')),task.id);}
 assert.equal(await page.locator('[data-normal-status="2"]').textContent(),'Gennemført');assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'Ikke begyndt');assert.match(await page.locator('[data-normal-overall]').innerText(),/1 af 6/);
 await page.reload();await card('norm2.final.shape').waitFor({state:'visible'});assert.equal(await page.locator('[data-normal-status="2"]').textContent(),'Gennemført');
 await card('norm2.final.reverse').locator('input').fill('102');assert.equal(await page.locator('[data-normal-status="2"]').textContent(),'I gang');await answer(standardLessonTasks.find(t=>t.id==='norm2.final.reverse'));
 await go('normalDistribution/2/oevelser');await page.locator('#standard-notes').fill('Begge grænser, standardmodel, original model og min konklusion.');await page.reload();await page.locator('#standard-notes').waitFor({state:'visible'});assert.match(await page.locator('#standard-notes').inputValue(),/Begge grænser/);
 // Paired graphs preserve areas, respond to keyboard, reject invalid parameters and handle boundaries.
 await go('normalDistribution/2/standard');const lab=page.locator('[data-standard-lab=standard-scale]');
 const old=await lab.locator('[data-standard-graph=original] [data-plot]').innerHTML();await page.locator('#standard-scale-selected').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await lab.locator('[data-standard-graph=original] [data-plot]').innerHTML(),old);
 for(const k of [1,2,3]){await lab.locator(`[data-standard-band="${k}"]`).click();assert.match(await lab.locator('[data-standard-result]').innerText(),new RegExp(['68,27','95,45','99,73'][k-1]));}
 await page.locator('#standard-scale-sd').fill('0,025');await page.locator('#standard-scale-selected').fill('3');assert.match(await lab.locator('[data-standard-result]').innerText(),/ikke exceptionelt/);assert.doesNotMatch(await lab.locator('[data-standard-result]').innerText(),/Exceptionelt udfald/);
 for(const mode of ['left','right','between']){await page.locator('#standard-scale-mode').selectOption(mode);assert.ok((await lab.locator('[data-standard-shade]').first().getAttribute('d')).length>100);}
 await page.locator('#standard-scale-sd').fill('0');assert.match(await lab.locator('[data-standard-error]').innerText(),/positiv spredning/);assert.equal(await lab.locator('svg:visible').count(),0);
 await page.locator('#standard-scale-sd').fill('2');await page.locator('#standard-scale-a').fill('4');await page.locator('#standard-scale-b').fill('-4');assert.match(await lab.locator('[data-standard-error]').innerText(),/gyldige grænser/);await page.locator('#standard-scale-a').fill('-1');await page.locator('#standard-scale-b').fill('1');
 assert.equal(await lab.locator('svg:visible').count(),2);
 const mathProblems=await page.locator('#normal-module-two math').evaluateAll(nodes=>nodes.flatMap(m=>[...(m.namespaceURI!=='http://www.w3.org/1998/Math/MathML'?['namespace']:[]),...[...m.querySelectorAll('mfrac,msup,msub')].filter(el=>el.children.length!==2).map(el=>el.outerHTML)]));assert.deepEqual(mathProblems,[]);
 const ascii=await page.locator('#normal-module-two').evaluate(el=>el.textContent);assert.doesNotMatch(ascii,/sqrt|x\^2|N\(mu|z=\(x|\(x-mu\)/);
 // Direct subpages, keyboard navigation, history and transitions between the modules.
 for(let i=0;i<pages.length;i++){await go(pages[i]);assert.equal(await page.locator('[data-normal-step]:visible').count(),1);assert.equal(await page.locator('.normal-step-menu [aria-current=step]').count(),1);await page.locator('.normal-page-controls a').last().click();await page.waitForURL('**/*#'+(i<pages.length-1?pages[i+1]:'normalDistribution/3'));}
 await go('normalDistribution/2/start');await page.locator('.normal-page-controls a').first().click();await page.waitForURL('**/*#normalDistribution/1/opsummering');await page.locator('.normal-page-controls a').last().click();await page.waitForURL('**/*#normalDistribution/2/start');await page.goBack();await page.waitForURL('**/*#normalDistribution/1/opsummering');
 await go('normalDistribution/2/start');await page.locator('.normal-step-menu a').nth(1).focus();await page.keyboard.press('Enter');await page.waitForURL('**/*#normalDistribution/2/standard');await page.waitForFunction(()=>document.activeElement.id==='subjectTitle');
 for(const m of normalModules.filter(m=>!normalImplemented.includes(m.id))){await go('normalDistribution/'+m.id);assert.match(await page.locator('#normal-planned').innerText(),/Planlagt · ikke implementeret/);assert.equal(await page.locator('[data-normal-step]:visible').count(),0);assert.equal(await page.locator(`[data-normal-status="${m.id}"]`).textContent(),'Planlagt');}
 // Old module-1 persisted answers still load; both modules contribute independently to the total.
 const oldState={version:1,cards:Object.fromEntries(normalLessonTasks.map(t=>[t.id,{answers:Object.fromEntries(t.parts.map(p=>[p.id,p.answer])),checked:true,hints:0}]))};
 await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:NORMAL_STORAGE_KEY,state:oldState});await page.reload();await page.locator('#normal-planned').waitFor({state:'visible'});assert.equal(await page.locator('[data-normal-status="1"]').textContent(),'Gennemført');assert.match(await page.locator('[data-normal-overall]').innerText(),/2 af 6/);
 await go('normalDistribution');await page.locator('#normal-overview details > summary').click();assert.equal(await page.locator('#normal-overview tbody tr').count(),normalGoals.length);
 // Test each new bank task in the real training UI, including the two accessible diagrams.
 await go('tasks');for(const task of normalStandardTasks){await page.evaluate(state=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(state)),bankFixture(task));await page.reload();await page.locator('.task-question').waitFor();if(task.figure)assert.equal(await page.locator('.task-question svg').count(),1);for(const p of task.parts){if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);}await page.locator('[data-task-action=check]').click();assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find/);assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);}
 await page.evaluate(state=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(state)),bankFixture(normalStandardTasks.find(t=>t.id==='norm2.model'),'exam'));await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);assert.doesNotMatch(await page.locator('.task-question').innerText(),/Gennemregnet løsning|Læringsmål|standardiser først/i);
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="norm.2"]').first().click();await page.waitForURL('**/*#normalDistribution/2/start');
 for(const view of ['equations','quadratic','composite','differentiation','planeGeometry','integration/2/start/1','differentialEquations/1/start','formulas']){await go(view);assert.equal(await page.locator('#normalLesson').isVisible(),false);}
 await go('normalDistribution/2/standard');await lab.screenshot({path:'/tmp/matematik-standard-desktop.png'});await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));
 await phone.goto(url+'/?preview=1#normalDistribution/2/standard');await phone.locator('[data-standard-lab=standard-scale]').waitFor({state:'visible'});
 for(const path of [...pages,'normalDistribution','normalDistribution/1/start','normalDistribution/repetition']){await phone.evaluate(path=>window.showMathView(path),path);assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path);}
 await phone.evaluate(()=>window.showMathView('normalDistribution/2/standard'));await phone.locator('[data-standard-lab=standard-scale]').screenshot({path:'/tmp/matematik-standard-mobile.png'});await mobile.close();
 const bad=await browser.newContext();await bad.addInitScript(key=>localStorage.setItem(key,'broken'),STANDARD_STORAGE_KEY);const badpage=await bad.newPage();await badpage.goto(url+'/?preview=1#normalDistribution/2');await badpage.locator('#normal-module-two [data-lesson-warning]').waitFor({state:'visible'});await bad.close();
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('blocked');};});const blockedpage=await blocked.newPage();await blockedpage.goto(url+'/?preview=1#normalDistribution/2/start');await blockedpage.locator('[data-int-card="norm2.pre.sign"] input').fill('6');await blockedpage.locator('#normal-module-two [data-lesson-warning]').waitFor({state:'visible'});await blocked.close();
 assert.deepEqual(errors,[]);console.log('Standardnormal browser passed: 40 cards, 15 bank tasks, two-scale graphs, boundaries, feedback, hints, notes, independent completion, reload, direct routes, exam/repetition, MathML, keyboard and mobile.');
}finally{await browser.close();server.close();}
