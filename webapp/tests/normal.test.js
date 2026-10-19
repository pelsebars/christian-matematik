import test from 'node:test';
import assert from 'node:assert/strict';
import {cdf,survival,pdf,quantile,intervalProbability,plotModel} from '../normal-math.js';
import {normalTasks,carrotBelow396} from '../tasks/bank/normal.js';
import {normalData} from '../normal-data.js';
import {normalModules,normalGoals} from '../normal-plan.js';
import {normalPages,parseNormalRoute} from '../normal-routes.js';
import {normalLessonTasks,normalRequired} from '../normal-lesson.js';
import {instantiate} from '../tasks/bank/index.js';
import {validateTask} from '../tasks/schema.js';
import {gradePart,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} versus ${b}`);
const trapezoid=points=>points.slice(1).reduce((s,[x,y],i)=>s+(x-points[i][0])*(y+points[i][1])/2,0);
test('normal probabilities match independent standard reference values and symmetry',()=>{
 near(cdf(0),.5);near(cdf(1),.8413447460685429);near(cdf(-2),.0227501319481792);near(survival(3),.0013498980316301);
 near(intervalProbability(-1,1),.6826894921370859);near(intervalProbability(-2,2),.9544997361036416);
 near(cdf(.96,1,.02),.0227501319481792);near(survival(33,33.2,.4),.691462461274013);
 near(intervalProbability(32,34,33.2,.4),.97589997002019);
 for(const z of [-5,-3,-1,0,1,3,5]){near(cdf(z)+survival(z),1);near(cdf(z),survival(-z));}
 near(intervalProbability(5,5),0);near(intervalProbability(-Infinity,Infinity),1);
 assert.ok(pdf(5,5,.1)>1);near(pdf(5,5,.1),1/(.1*Math.sqrt(2*Math.PI)));
 for(const sd of [0,-1,Infinity,NaN])assert.throws(()=>cdf(1,0,sd),RangeError);
 assert.throws(()=>cdf(NaN));assert.throws(()=>survival(undefined));assert.throws(()=>intervalProbability(3,2));assert.throws(()=>quantile(-.1));
});
test('inverse calculation returns correct quantiles and interval inversion',()=>{
 near(quantile(.4,10,4),8.9866115874568);near(quantile(.5,175,10),175);
 near(quantile(cdf(23,20,3)-.4,20,3),19.5573179752473);
 for(const p of [.0001,.01,.1,.3,.5,.9,.9999])near(cdf(quantile(p)),p,1e-11);
});
test('shaded polygons integrate to displayed probability at extreme parameters in every mode',()=>{
 for(const mean of [0,10,30])for(const sd of [.05,.1,4,10])for(const mode of ['left','right','between'])for(const [a,b] of [[6,14],[-20,60],[mean,mean],[mean-sd,mean+2*sd]]){
  const m=plotModel({mean,sd,a,b,mode});near(trapezoid(m.shade),m.probability,4e-6);near(trapezoid(m.curve),1,1e-12);
  assert.ok(m.shade.every(([x,y])=>y>=0&&Math.abs(y-pdf(x,mean,sd))<1e-14));
 }
 assert.throws(()=>plotModel({mean:1,sd:2,a:4,b:3,mode:'between'}));
});
test('all eight supplied datasets retain sizes and independent aggregates',()=>{
 assert.deepEqual(Object.values(normalData).map(d=>d.rows.length),[400,100,40,200,56,100,18,106]);
 for(const d of Object.values(normalData)){assert.equal(d.sheet,'Ark1');assert.ok(d.rows.every(r=>r.every(Number.isFinite)));}
 const weights=normalData.carrots.rows.map(r=>r[0]);assert.equal(weights.filter(v=>v<396).length,121);assert.equal(carrotBelow396,121);near(weights.reduce((a,b)=>a+b,0)/400,400.432);
 const v=normalData.volume.rows.map(r=>r[0]),avg=v.reduce((a,b)=>a+b,0)/v.length;near(avg,.98492);near(Math.sqrt(v.reduce((s,x)=>s+(x-avg)**2,0)/(v.length-1)),.0555203,1e-7);
});
test('bank, independent answers, diagnostics and feedback follow shared contract',()=>{
 assert.equal(normalTasks.length,12);assert.equal(normalRequired.length,27);assert.equal(normalLessonTasks.length,37);
 for(const t of normalTasks){validateTask(t);assert.deepEqual(t,instantiate(t.id,'normal-quality'));assert.ok(t.hints.length>=2);for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct');}
 const get=id=>normalTasks.find(t=>t.id==='norm.'+id);
 near(Number(get('milk').parts[0].answer),cdf(.96,1,.02));near(Number(get('tails').parts[0].answer),survival(33,33.2,.4));near(Number(get('tails').parts[1].answer),intervalProbability(32,34,33.2,.4));
 near(Number(get('quantile').parts[0].answer),quantile(.4,10,4),1e-8);near(intervalProbability(Number(get('inverse-interval').parts[0].answer),23,20,3),.4,1e-9);
 near(Number(get('independent').parts[0].answer),2**-20);near(Number(get('data').parts[0].answer),121/400);
 const egg=get('model');near(Number(egg.parts[0].answer),cdf(55,62,6));near(Number(egg.parts[1].answer),intervalProbability(55,70,62,6));near(Number(egg.parts[2].answer),survival(70,62,6));
 assert.match(targetedFeedback(get('milk'),get('milk').parts[0],'2,28'),/Procentregning/);assert.match(targetedFeedback(get('cdf'),get('cdf').parts[0],'0,15'),/Områdevalg/);
 assert.equal(gradePart(get('independent').parts[0],'1/1048576').status,'correct');
 assert.equal(composeSet({topics:['normalDistribution'],onlyCompleted:true,completed:['norm.1'],minutes:200,distribution:{short:20,medium:20,complex:20}}).tasks.length,12);
 assert.equal(composeSet({topics:['normalDistribution'],onlyCompleted:true,completed:[]}).tasks.length,0);
});
test('six teaching sessions, separate recap, direct routes and source-linked goal matrix',()=>{
 assert.deepEqual(normalModules.map(m=>m.id),['1','2','3','repetition','4','5','opsamling']);assert.equal(normalGoals.length,26);assert.ok(normalGoals.every(g=>g.length===6));
 assert.equal(parseNormalRoute('#normalDistribution/1/bad').path,'normalDistribution/1/start');assert.equal(parseNormalRoute('#normalDistribution/bad').path,'normalDistribution');assert.equal(parseNormalRoute('#integration'),null);
 for(const route of normalPages)assert.equal(parseNormalRoute('#'+route).path,route);
});
