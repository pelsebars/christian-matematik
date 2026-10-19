import test from 'node:test';
import assert from 'node:assert/strict';
import { standardize,unstandardize,outcomeClass,standardModel } from '../normal-standard-math.js';
import { cdf,survival,intervalProbability,quantile,pdf } from '../normal-math.js';
import { normalStandardTasks } from '../tasks/bank/normal-standard.js';
import { normalTasks } from '../tasks/bank/normal.js';
import { standardLessonTasks,standardRequired } from '../normal-standard-lesson.js';
import { standardPre,standardMini,standardFinal } from '../normal-standard-exercises.js';
import { validateTask } from '../tasks/schema.js';
import { instantiate } from '../tasks/bank/index.js';
import { goals } from '../tasks/catalog.js';
import { gradePart,targetedFeedback } from '../tasks/grading.js';
import { composeSet } from '../tasks/selection.js';
import { normalImplemented,parseNormalRoute,pagesForNormalModule,normalPages,standardSteps } from '../normal-routes.js';
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} versus ${b}`);
const get=id=>normalStandardTasks.find(t=>t.id==='norm2.'+id);
const area=(points,x,y)=>points.slice(1).reduce((sum,p,i)=>sum+(p[x]-points[i][x])*(p[y]+points[i][y])/2,0);
test('standardization and reverse preserve sign, units, centre and observations across scales',()=>{
 for(const mean of [-30,0,10,100,400.432])for(const sd of [.025,.1,2,6,9.481107768])for(const z of [-4,-3,-2,-1,0,.5,2,3,4]){
  const x=unstandardize(z,mean,sd);near(x,mean+sd*z);near(standardize(x,mean,sd),z,3e-12);
 }
 near(standardize(1.95,2,.025),-2);near(unstandardize(-1.5,50,6),41);
 for(const sd of [0,-1,Infinity,NaN]){assert.throws(()=>standardize(1,0,sd));assert.throws(()=>unstandardize(1,0,sd));}
 assert.throws(()=>standardize(NaN,1,2));assert.throws(()=>unstandardize(Infinity,1,2));
});
test('source convention includes two sigma, excludes exact three from exceptional, and retains gap',()=>{
 for(const [mean,sd] of [[10,3],[8,5],[2,.025],[100,.025],[400.432,.025],[400.432,9.481107768]])for(const sign of [-1,1]){
  assert.equal(outcomeClass(mean+sign*2*sd,mean,sd),'normal');
  assert.equal(outcomeClass(mean+sign*2.5*sd,mean,sd),'between');
  assert.equal(outcomeClass(mean+sign*3*sd,mean,sd),'between');
  assert.equal(outcomeClass(mean+sign*(3+1e-8)*sd,mean,sd),'exceptional');
  assert.equal(outcomeClass(mean+sign*(2+1e-8)*sd,mean,sd),'between');
 }
 assert.equal(outcomeClass(1.95,2,.025),'normal');assert.equal(outcomeClass(1.925,2,.025),'between');assert.equal(outcomeClass(1.924,2,.025),'exceptional');
});
test('paired density plots preserve probability and polygon area; density heights rescale',()=>{
 for(const mean of [0,50,100])for(const sd of [.025,2,10])for(const mode of ['left','right','between'])for(const [a,b] of [[-1,1],[-2,2],[-3,3],[-4,-3],[2,2]]){
  const model=standardModel({mean,sd,selected:1,a,b,mode});
  near(area(model.shade,'x','original'),area(model.shade,'z','standard'),1e-10);
  near(area(model.shade,'z','standard'),model.probability,4e-6);
  near(model.probability,mode==='left'?cdf(mean+b*sd,mean,sd):mode==='right'?survival(mean+a*sd,mean,sd):intervalProbability(mean+a*sd,mean+b*sd,mean,sd),1e-11);
  near(area(model.curve,'z','standard'),.999999426696856,2e-10);
  for(const p of model.curve.filter((_,i)=>i%100===0)){near(p.original*sd,p.standard,1e-11);near(p.standard,pdf(p.z));}
 }
 assert.throws(()=>standardModel({mean:10,sd:2,selected:0,a:2,b:-2,mode:'between'}));
 assert.throws(()=>standardModel({mean:10,sd:0,selected:0,a:-2,b:2,mode:'between'}));
});
test('all source answers agree with independent arithmetic and numerical model calculations',()=>{
 near(Number(get('distance').parts[0].answer),(98-100)/2);near(Number(get('back').parts[0].answer),50+6*-1.5);
 near(Number(get('compare').parts[0].answer),(174-170)/4);near(Number(get('compare').parts[1].answer),(86-80)/3);
 const bounds=get('ranges').parts.slice(0,4).map(p=>Number(p.answer));assert.deepEqual(bounds,[10-2*3,10+2*3,10-3*3,10+3*3]);
 near(Number(get('half-area').parts[0].answer),68.27/2);
 assert.deepEqual(get('read-two').parts.map(p=>Number(p.answer)),[(60+100)/2,(100-60)/4]);
 assert.deepEqual(get('read-one').parts.map(p=>Number(p.answer)),[(45+55)/2,(55-45)/2]);
 near(Number(get('fish-probability').parts[1].answer),.0227501319481792);
 near(Number(get('sweets').parts[0].answer),survival(99,100,2));near(Number(get('sweets').parts[1].answer),.1586552539314571);
 near(Number(get('interval').parts[0].answer),(48-50)/6);near(Number(get('interval').parts[1].answer),(55-50)/6);near(Number(get('interval').parts[2].answer),intervalProbability(48,55,50,6));
 near(Number(get('quantile').parts[0].answer),quantile(.3,10,2));near(cdf(Number(get('quantile').parts[0].answer),10,2),.3);
 near(Number(get('model').parts[2].answer),cdf(184,200,5));near(Number(get('data').parts[0].answer),(371.2-400.432)/9.481107768,1e-9);
});
test('new bank obeys contract, covers goals, separates feedback and preserves old version-1 tasks',()=>{
 assert.equal(normalStandardTasks.length,15);assert.equal(standardLessonTasks.length,40);assert.equal(standardRequired.length,32);assert.equal(standardPre.length,8);assert.equal(standardMini.length,11);assert.equal(standardFinal.length,6);
 for(const t of normalStandardTasks){validateTask(t);assert.deepEqual(instantiate(t.id,'standard-quality'),t);assert.ok(t.hints.length>=2);assert.deepEqual(t.prerequisites,['norm.1']);for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct',t.id+':'+p.id);}
 for(const [id,goal] of Object.entries(goals).filter(([,g])=>g.module==='norm.2'))assert.ok(normalStandardTasks.some(t=>t.goals.includes(id)),id);
 for(const t of normalTasks)assert.deepEqual(t,instantiate(t.id,'old-sets',1));
 const distance=get('distance'),p=distance.parts[0];assert.match(targetedFeedback(distance,p,'-2'),/Regnefejl/);assert.match(targetedFeedback(distance,p,'49'),/Begrebsfejl/);assert.match(targetedFeedback(distance,p,'1'),/Fortegnsfejl/);
 assert.equal(gradePart(get('interval').parts[0],'-1/3').status,'correct');assert.equal(gradePart(get('interval').parts[1],'5/6').status,'correct');
 assert.equal(new Set(normalStandardTasks.map(t=>t.prompt)).size,15);assert.ok(normalStandardTasks.some(t=>t.size==='complex'));assert.ok(normalStandardTasks.some(t=>!t.aids));assert.ok(normalStandardTasks.some(t=>t.aids));
});
test('shared selection requires the preceding module only when completed-module filtering is enabled',()=>{
 const config={topics:['normalDistribution'],minutes:500,distribution:{short:50,medium:50,complex:50},onlyCompleted:true};
 assert.equal(composeSet({...config,completed:['norm.2']}).tasks.length,0);
 assert.equal(composeSet({...config,completed:['norm.1']}).tasks.length,12);
 assert.equal(composeSet({...config,completed:['norm.1','norm.2']}).tasks.length,27);
 assert.equal(composeSet({...config,onlyCompleted:false}).tasks.length,59);
});
test('direct routes preserve module 1 and add all module-2 steps; later modules remain planned',()=>{
 assert.deepEqual(normalImplemented,['1','2','3','repetition']);assert.equal(standardSteps.length,8);assert.equal(pagesForNormalModule('2').length,8);
 for(const path of [...normalPages,...pagesForNormalModule('2')])assert.equal(parseNormalRoute('#'+path).path,path);
 assert.equal(parseNormalRoute('#normalDistribution/2').path,'normalDistribution/2/start');assert.equal(parseNormalRoute('#normalDistribution/2/bad').path,'normalDistribution/2/start');
 assert.equal(parseNormalRoute('#normalDistribution/4').step,'');assert.deepEqual(pagesForNormalModule('4'),[]);
});
