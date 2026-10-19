import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parameterLessonTasks,PARAMETERS_STORAGE_KEY,PARAMETERS_NOTES_KEY} from '../normal-parameters-lesson.js';
import {normalLessonTasks,NORMAL_STORAGE_KEY} from '../normal-lesson.js';
import {standardLessonTasks,STANDARD_STORAGE_KEY} from '../normal-standard-lesson.js';
import {normalParameterTasks} from '../tasks/bank/normal-parameters.js';
import {parameterCases} from '../normal-parameters-math.js';
import {pagesForNormalModule,normalImplemented} from '../normal-routes.js';
import {normalModules,normalGoals} from '../normal-plan.js';
const dir=resolve(fileURLToPath(new URL('..',import.meta.url)));
const server=createServer(async(req,res)=>{try{const request=decodeURIComponent(req.url.split('?')[0]),p=resolve(dir,'.'+(request==='/'?'/index.html':request));if(!p.startsWith(dir+'/'))throw Error();res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'}),errors=[];
const pages=pagesForNormalModule('3');
const routeFor=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':!t.id.includes('.mini.')?'oevelser':({information:'oplysninger',median:'oplysninger',tail:'oplysninger',sd:'spredning',consistency:'spredning',mean:'middelvaerdi',symmetry:'begge',both:'begge',check:'begge',density:'taethed',mirror:'taethed',tools:'taethed'}[t.id.split('.').at(-1)]);
const bankFixture=(task,mode='training')=>({schema:1,completed:[],history:[],session:{mode,status:'active',seed:'parameter-bank',items:[{id:task.id,version:task.version}],index:0,answers:{},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),timer:false,minutes:30,requested:1}});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(12000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async path=>{await page.evaluate(path=>window.showMathView(path),path);await page.waitForURL('**/*#'+path);};
 const card=id=>page.locator(`[data-int-card="${id}"]`);
 const answer=async(t,wrong=false)=>{await go('normalDistribution/3/'+routeFor(t));for(const p of t.parts){const field=card(t.id).locator(`[name="${p.id}"]`);if(p.type==='choice')await field.selectOption(wrong?p.options.find(o=>o.id!==p.answer).id:p.answer);else await field.fill(wrong?'999':p.answer);}await card(t.id).locator('button[type=submit]').click();};
 await page.goto(url+'/?preview=1#normalDistribution/3');await page.locator('#normal-module-three').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>location.hash),'#normalDistribution/3/start');
 for(const id of ['1','2','3'])assert.equal(await page.locator(`[data-normal-status="${id}"]`).textContent(),'Ikke begyndt');
 assert.equal(await page.locator('#normal-module-three [data-int-card]').count(),43);assert.equal(await page.locator('#normal-module-two').isVisible(),false);
 const pre=parameterLessonTasks.find(t=>t.id==='norm3.pre.fraction');await answer(pre,true);assert.match(await card(pre.id).locator('[data-feedback]').innerText(),/Regning/);
 await card(pre.id).locator('[data-int-jump]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'parameter-basics');assert.ok(await page.locator('[data-parameter-basic=fraction]').getAttribute('open')!==null);
 await card(pre.id).locator('[data-int-hint]').click();await page.reload();await card(pre.id).waitFor({state:'visible'});assert.equal(await card(pre.id).locator('input').inputValue(),'999');assert.equal(await card(pre.id).locator('.int-hints p').count(),1);
 assert.equal(await page.locator('[data-normal-status="3"]').textContent(),'I gang');
 await go('normalDistribution/3/oevelser');
 for(const [id,part,wrong,feedback] of [['tail','p','.3',/Halevalg/],['sd','sd','-2.341',/Fortegns/],['asymmetric','mean','251',/Metodefejl/]]){const c=card('norm3.'+id);await c.locator(`[name="${part}"]`).fill(wrong);await c.locator('button[type=submit]').click();assert.match(await c.locator(`[data-feedback="${part}"]`).innerText(),feedback);}
 const density=card('norm3.density');await density.locator('[name=reason]').selectOption('cdf');await density.locator('button[type=submit]').click();assert.match(await density.locator('[data-feedback=reason]').innerText(),/tæthed|kurvehøjde/);
 for(const task of parameterLessonTasks){await answer(task);assert.ok(await card(task.id).evaluate(el=>el.classList.contains('is-correct')),task.id);}
 assert.equal(await page.locator('[data-normal-status="3"]').textContent(),'Gennemført');for(const id of ['1','2'])assert.equal(await page.locator(`[data-normal-status="${id}"]`).textContent(),'Ikke begyndt');assert.match(await page.locator('[data-normal-overall]').innerText(),/1 af 6/);
 await page.reload();await card('norm3.final.median').waitFor({state:'visible'});assert.equal(await page.locator('[data-normal-status="3"]').textContent(),'Gennemført');
 await card('norm3.final.sd').locator('input').fill('102');assert.equal(await page.locator('[data-normal-status="3"]').textContent(),'I gang');await answer(parameterLessonTasks.find(t=>t.id==='norm3.final.sd'));
 await go('normalDistribution/3/oevelser');await page.locator('#parameter-notes').fill('Betingelser, to ligninger, positiv spredning og kontrol af alle oprindelige arealer.');await page.reload();await page.locator('#parameter-notes').waitFor({state:'visible'});assert.match(await page.locator('#parameter-notes').inputValue(),/alle oprindelige arealer/);
 assert.ok(await page.evaluate(key=>localStorage.getItem(key),PARAMETERS_NOTES_KEY));
 // All four parameter cases: only the unknowns can move; fitting satisfies every given area.
 await go('normalDistribution/3/oplysninger');const lab=page.locator('#parameter-lab');
 for(const [key,c] of Object.entries(parameterCases)){
  await page.locator('#parameter-case').selectOption(key);for(const param of ['mean','sd'])assert.equal(await page.locator('#parameter-'+param).isDisabled(),c.known===param);
  const movable=c.known==='sd'?'mean':'sd',old=await lab.locator('[data-parameter-graph=pdf] [data-plot]').innerHTML();await page.locator('#parameter-'+movable).focus();await page.keyboard.press('ArrowRight');assert.notEqual(await lab.locator('[data-parameter-graph=pdf] [data-plot]').innerHTML(),old);
  await lab.locator('[data-parameter-solve]').click();const results=await lab.locator('[data-parameter-result] p').allTextContents();assert.equal(results.length,c.points.length);for(let i=0;i<results.length;i++){const wanted=c.points[i].p.toFixed(4).replace('.',',');assert.ok(results[i].includes('venstre areal '+wanted+'. Oplyst areal: '+wanted),results[i]);}
  assert.ok((await lab.locator('[data-parameter-shade]').getAttribute('d')).length>100);assert.equal(await lab.locator('[data-parameter-graph=cdf] circle').count(),2*c.points.length);
 }
 await lab.screenshot({path:'/tmp/matematik-parameters-desktop.png'});
 await go('normalDistribution/3/taethed');const densityLab=page.locator('#parameter-density-lab');
 assert.match(await densityLab.locator('[data-density-result]').innerText(),/To middelværdier passer: [-−]3,1961 og 5,1961/);
 assert.equal(await densityLab.locator('[data-density-plot] > path[stroke-width="3"]').count(),2);
 await densityLab.screenshot({path:'/tmp/matematik-density-desktop.png'});
 const oldDensity=await densityLab.locator('[data-density-plot]').innerHTML();await page.locator('#parameter-density-sd').focus();await page.keyboard.press('ArrowRight');assert.notEqual(await densityLab.locator('[data-density-plot]').innerHTML(),oldDensity);
 await page.locator('#parameter-density-height').fill('1');assert.match(await densityLab.locator('[data-density-result]').innerText(),/Ingen middelværdi/);assert.equal(await densityLab.locator('svg').isVisible(),false);
 await page.locator('#parameter-density-height').fill('');assert.equal(await densityLab.locator('svg').isVisible(),false);await page.locator('#parameter-density-height').fill('0,05');assert.equal(await densityLab.locator('svg').isVisible(),true);
 const mathProblems=await page.locator('#normal-module-three math').evaluateAll(nodes=>nodes.flatMap(m=>[...(m.namespaceURI!=='http://www.w3.org/1998/Math/MathML'?['namespace']:[]),...[...m.querySelectorAll('mfrac,msup,msub')].filter(el=>el.children.length!==2).map(el=>el.outerHTML)]));assert.deepEqual(mathProblems,[]);
 const ascii=await page.locator('#normal-module-three').evaluate(el=>el.textContent);assert.doesNotMatch(ascii,/sqrt|x\^2|N\(mu|z=\(x|\(x-mu\)/);
 const duplicateIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);});assert.deepEqual(duplicateIds,[]);
 for(let i=0;i<pages.length;i++){await go(pages[i]);assert.equal(await page.locator('[data-normal-step]:visible').count(),1);assert.equal(await page.locator('.normal-step-menu [aria-current=step]').count(),1);await page.locator('.normal-page-controls a').last().click();await page.waitForURL('**/*#'+(i<pages.length-1?pages[i+1]:'normalDistribution/repetition'));}
 await go('normalDistribution/3/start');await page.locator('.normal-page-controls a').first().click();await page.waitForURL('**/*#normalDistribution/2/opsummering');await page.locator('.normal-page-controls a').last().click();await page.waitForURL('**/*#normalDistribution/3/start');await page.goBack();await page.waitForURL('**/*#normalDistribution/2/opsummering');
 await go('normalDistribution/3/start');await page.locator('.normal-step-menu a').nth(1).focus();await page.keyboard.press('Enter');await page.waitForURL('**/*#normalDistribution/3/oplysninger');await page.waitForFunction(()=>document.activeElement.id==='subjectTitle');
 for(const m of normalModules.filter(m=>!normalImplemented.includes(m.id))){await go('normalDistribution/'+m.id);assert.match(await page.locator('#normal-planned').innerText(),/Planlagt · ikke implementeret/);assert.equal(await page.locator('[data-normal-step]:visible').count(),0);assert.equal(await page.locator(`[data-normal-status="${m.id}"]`).textContent(),'Planlagt');}
 // Existing saved module-1/2 answers survive and count independently alongside the new module.
 for(const [key,tasks] of [[NORMAL_STORAGE_KEY,normalLessonTasks],[STANDARD_STORAGE_KEY,standardLessonTasks]]){const state={version:1,cards:Object.fromEntries(tasks.map(t=>[t.id,{answers:Object.fromEntries(t.parts.map(p=>[p.id,p.answer])),checked:true,hints:0}]))};await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key,state});}
 await page.reload();await page.locator('#normal-planned').waitFor({state:'visible'});for(const id of ['1','2','3'])assert.equal(await page.locator(`[data-normal-status="${id}"]`).textContent(),'Gennemført');assert.match(await page.locator('[data-normal-overall]').innerText(),/3 af 6/);
 await go('normalDistribution');await page.locator('#normal-overview details > summary').click();assert.equal(await page.locator('#normal-overview tbody tr').count(),normalGoals.length);
 await go('tasks');for(const task of normalParameterTasks){await page.evaluate(state=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(state)),bankFixture(task));await page.reload();await page.locator('.task-question').waitFor();if(task.figure)assert.equal(await page.locator('.task-question svg').count(),1);for(const p of task.parts){if(p.type==='choice')await page.locator(`.task-question [data-part="${p.id}"][value="${p.answer}"]`).check();else await page.locator(`.task-question [data-part="${p.id}"]`).fill(p.answer);}await page.locator('[data-task-action=check]').click();assert.doesNotMatch(await page.locator('.task-feedback').innerText(),/Se løsningen og find/);assert.match(await page.locator('.task-feedback').innerText(),/Det passer/);}
 await page.evaluate(state=>localStorage.setItem('christian-matematik.tasks.v1',JSON.stringify(state)),bankFixture(normalParameterTasks.find(t=>t.id==='norm3.density'),'exam'));await page.reload();await page.locator('.task-question').waitFor();assert.equal(await page.locator('.task-feedback,[data-task-action=hint]').count(),0);assert.doesNotMatch(await page.locator('.task-question').innerText(),/Gennemregnet løsning|Læringsmål|Facit/i);
 await page.locator('[data-task-action=finish]').click();await page.locator('[data-task-action=submit]').click();await page.locator('[data-task-action=repeat-module][data-module="norm.3"]').first().click();await page.waitForURL('**/*#normalDistribution/3/start');
 for(const view of ['equations','quadratic','composite','differentiation','planeGeometry','integration/2/start/1','differentialEquations/1/start','formulas']){await go(view);assert.equal(await page.locator('#normalLesson').isVisible(),false);}
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),phone=await mobile.newPage();phone.on('pageerror',e=>errors.push(e.message));
 await phone.goto(url+'/?preview=1#normalDistribution/3/oplysninger');await phone.locator('#parameter-lab').waitFor({state:'visible'});
 for(const path of [...pages,'normalDistribution','normalDistribution/2/start','normalDistribution/repetition']){await phone.evaluate(path=>window.showMathView(path),path);assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path);}
 await phone.evaluate(()=>window.showMathView('normalDistribution/3/oplysninger'));await phone.locator('#parameter-lab').screenshot({path:'/tmp/matematik-parameters-mobile.png'});await phone.evaluate(()=>window.showMathView('normalDistribution/3/taethed'));await phone.locator('#parameter-density-lab').screenshot({path:'/tmp/matematik-density-mobile.png'});await mobile.close();
 const bad=await browser.newContext();await bad.addInitScript(key=>localStorage.setItem(key,'broken'),PARAMETERS_STORAGE_KEY);const badpage=await bad.newPage();await badpage.goto(url+'/?preview=1#normalDistribution/3');await badpage.locator('#normal-module-three [data-lesson-warning]').waitFor({state:'visible'});await bad.close();
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('blocked');};});const blockedpage=await blocked.newPage();await blockedpage.goto(url+'/?preview=1#normalDistribution/3/start');await blockedpage.locator('[data-int-card="norm3.pre.sign"] input').fill('-3');await blockedpage.locator('#normal-module-three [data-lesson-warning]').waitFor({state:'visible'});await blocked.close();
 assert.deepEqual(errors,[]);console.log('Parameter browser passed: 43 cards, 16 bank tasks, four model-fitting cases, density ambiguity, targeted feedback, hints, notes, independent completion, reload, nine direct routes, exam/repetition, MathML, keyboard and mobile.');
}finally{await browser.close();server.close();}
