import test from 'node:test';
import assert from 'node:assert/strict';
import {normalFinishTasks,finishAreas} from '../tasks/bank/normal-finish.js';
import {normalFinishLessonTasks,normalFinishRequired,normalFinishAreaStatus} from '../normal-finish-lesson.js';
import {finishPre,finishMini,finishFinal,finishTaskStep} from '../normal-finish-exercises.js';
import {finishContent} from '../normal-finish-content.js';
import {finishCases} from '../normal-finish-graphs.js';
import {normalImplemented,normalFinishSteps,pagesForNormalModule,parseNormalRoute} from '../normal-routes.js';
import {normalData} from '../normal-data.js';
import {cdf,survival,quantile} from '../normal-math.js';
import {outcomeClass} from '../normal-standard-math.js';
import {sourceRegression,transformedRegression,squaredPairs,transformedPrediction} from '../normal-regression-math.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {validateTask} from '../tasks/schema.js';
import {gradePart,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} versus ${b}`),get=id=>normalFinishTasks.find(t=>t.id==='normend.'+id),value=(id,part)=>Number(get(id).parts.find(p=>p.id===part).answer);
test('recap has eight real steps, all six skill areas and only assessed activities count toward completion',()=>{
 assert.equal(normalFinishLessonTasks.length,34);assert.equal(normalFinishRequired.length,28);assert.equal(finishPre.length,6);assert.equal(finishMini.length,6);assert.equal(finishFinal.length,6);assert.equal(normalFinishTasks.length,16);assert.equal(normalFinishSteps.length,8);assert.equal(finishAreas.length,6);
 for(const t of normalFinishLessonTasks){validateTask(t);assert.ok(pagesForNormalModule('opsamling').includes('normalDistribution/opsamling/'+finishTaskStep(t)));for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct',t.id+' '+p.id);}
 const blank=normalFinishAreaStatus(()=>false),full=normalFinishAreaStatus(()=>true);assert.ok(blank.every(a=>a.count===0&&a.total>=3));assert.ok(full.every(a=>a.count===a.total));assert.ok(normalFinishAreaStatus(t=>t.id.includes('.pre.')).every(a=>a.count===0));
 const edited=normalFinishAreaStatus(t=>t.id!=='normend.final.algebra');assert.equal(edited.find(a=>a.id==='algebra').count,full.find(a=>a.id==='algebra').count-1);assert.ok(edited.filter(a=>a.id!=='algebra').every(a=>a.count===a.total));
 assert.equal(parseNormalRoute('#normalDistribution/opsamling').path,'normalDistribution/opsamling/start');assert.equal(parseNormalRoute('#normalDistribution/opsamling/bad').step,'start');assert.equal(normalImplemented.length,7);assert.ok(normalImplemented.includes('opsamling'));
});
test('mixed answers reproduce area, standardization, inverse and parameter calculations with correct boundaries',()=>{
 assert.equal(value('point','p'),0);near(value('cdf','between'),.85-.20);near(value('cdf','right'),1-.85);assert.equal(value('scale','z'),(88-100)/4);assert.equal(outcomeClass(88,100,4),'between');
 near(cdf(12,value('parameters','mean'),value('parameters','sd')),.158655253931457,1e-12);near(cdf(20,value('parameters','mean'),value('parameters','sd')),.841344746068543,1e-12);
 near(value('quantile','bound'),57.68930939326765);near(cdf(value('quantile','bound'),50,6),.9,1e-12);near(value('bags','one'),survival(258,250,5),1e-12);near(value('bags','both'),survival(258,250,5)**2,1e-12);assert.equal(outcomeClass(266,250,5),'exceptional');
});
test('data tasks retain all original pairs and distinguish measured fractions from model probabilities',()=>{
 assert.equal(normalData.carrots.rows.length,400);const count=normalData.carrots.rows.filter(r=>r[0]<410).length;assert.equal(count,341);assert.equal(value('carrots','observed'),count/400);near(value('carrots','model'),.8435521918352719);assert.notEqual(value('carrots','observed'),value('carrots','model'));assert.equal((get('carrots').figure.match(/<tr>/g)||[]).length,401);assert.equal((get('heights').figure.match(/<circle /g)||[]).length,200);assert.equal(get('heights').parts[0].answer,'question');
 const p=sourceRegression('phillips');near(value('phillips','lower'),p.lower);near(value('phillips','upper'),p.upper);assert.ok(p.lower<0&&p.upper>0);assert.equal((get('phillips').figure.match(/<tr>/g)||[]).length,19);
 const u=sourceRegression('unibrew');near(value('production','time'),u.slope*1000+u.intercept);assert.equal((get('production').figure.match(/<tr>/g)||[]).length,107);assert.equal(get('production').parts[1].answer,'slope');
});
test('algebra and transformed response tasks test the full operation and return to the correct scale',()=>{
 for(const x of [-3,0,1,4])near(value('square','quadratic')*x*x+value('square','linear')*x+value('square','constant'),(x-3)**2);
 const u=value('system','u'),v=value('system','v');assert.equal(2*u+v,11);assert.equal(u-v,1);const model=transformedRegression(squaredPairs,'squared');near(value('transform','speed'),transformedPrediction(model,.5,'squared'));near(value('transform','speed')**2,model.slope*.5+model.intercept);
});
test('new bank contract preserves every old version and requires the complete prior course only in filtered sets',()=>{
 for(const t of normalFinishTasks){assert.deepEqual(instantiate(t.id,'recap-quality',1),t);assert.ok(t.hints.length>=2);assert.ok(t.errors.length>=t.parts.length);assert.doesNotMatch(t.prompt,/<h[1-6]|Modul [1-5]|normend\./);}
 assert.ok(normalFinishTasks.some(t=>t.size==='complex'));assert.ok(normalFinishTasks.some(t=>t.aids));assert.ok(normalFinishTasks.some(t=>!t.aids));
 for(const t of bank.filter(t=>t.module!=='norm.opsamling'))assert.deepEqual(instantiate(t.id,'saved',t.version),instantiate(t.id,'saved'));
 const config={topics:['normalDistribution'],minutes:2000,distribution:{short:100,medium:100,complex:100},onlyCompleted:true};assert.equal(composeSet({...config,completed:['norm.opsamling']}).tasks.length,0);const completed=['norm.1','norm.2','norm.3','norm.repetition','norm.4','norm.5','norm.opsamling'];assert.equal(composeSet({...config,completed}).tasks.length,109);assert.equal(composeSet({...config,onlyCompleted:false}).tasks.length,109);
});
test('feedback separates arithmetic, area, boundary, model and confidence misconceptions',()=>{
 assert.match(targetedFeedback(get('point'),get('point').parts[0],'0.3'),/Begrebsfejl/);assert.match(targetedFeedback(get('scale'),get('scale').parts[0],'-12'),/Regnefejl/);assert.match(targetedFeedback(get('scale'),get('scale').parts[1],'exceptional'),/Grænsefejl/);assert.match(targetedFeedback(get('cdf'),get('cdf').parts[1],'0.85'),/Højre hale/);assert.match(targetedFeedback(get('claims'),get('claims').parts[1],'parameter'),/gentagne/);
 for(const [id,part,answer] of [['carrots','model','0,8436'],['phillips','upper','0,0616'],['production','time','32,447'],['transform','speed','2,597']])assert.equal(gradePart(get(id).parts.find(p=>p.id===part),answer).status,'correct');
});
test('recap content includes accessible visuals, distinct data cases and explicit limits on automated assessment',()=>{
 const html=finishContent();assert.equal((html.match(/data-normal-step=/g)||[]).length,8);assert.equal((html.match(/data-int-card=/g)||[]).length,34);assert.match(html,/Det vigtigste at forstå/);assert.match(html,/giver ikke automatisk point/);assert.doesNotMatch(html.replace(/<[^>]*>/g,' '),/sqrt|x\^2|N\(mu/);
 for(const c of Object.values(finishCases)){const svg=c.figure();assert.match(svg,/role="img"/);assert.doesNotMatch(svg,/NaN|Infinity/);assert.ok(c.answer.length>100);}
});
