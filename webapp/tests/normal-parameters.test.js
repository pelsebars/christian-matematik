import test from 'node:test';
import assert from 'node:assert/strict';
import { leftProbability,sdFromProbability,meanFromProbability,parametersFromQuantiles,meansFromDensity,parameterCases,solveParameterCase,parameterPlotModel } from '../normal-parameters-math.js';
import { cdf,pdf,survival,intervalProbability,quantile } from '../normal-math.js';
import { normalParameterTasks } from '../tasks/bank/normal-parameters.js';
import { normalTasks } from '../tasks/bank/normal.js';
import { normalStandardTasks } from '../tasks/bank/normal-standard.js';
import { parameterLessonTasks,parameterRequired } from '../normal-parameters-lesson.js';
import { parameterPre,parameterMini,parameterFinal } from '../normal-parameters-exercises.js';
import { validateTask } from '../tasks/schema.js';
import { instantiate } from '../tasks/bank/index.js';
import { goals } from '../tasks/catalog.js';
import { gradePart,targetedFeedback } from '../tasks/grading.js';
import { composeSet } from '../tasks/selection.js';
import { normalImplemented,parseNormalRoute,pagesForNormalModule,parameterSteps } from '../normal-routes.js';
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} versus ${b}`);
const task=id=>normalParameterTasks.find(t=>t.id==='norm3.'+id);
const answer=(id,part)=>Number(task(id).parts.find(p=>p.id===part).answer);
const area=points=>points.slice(1).reduce((sum,p,i)=>sum+(p[0]-points[i][0])*(p[1]+points[i][1])/2,0);
test('one unknown parameter is recovered over signs, scales and both tails, then checked forward',()=>{
 for(const mean of [-30,0,10,400.432])for(const sd of [.025,2,9.481107768])for(const p of [.001,.1,.4,.6,.9,.999])for(const side of ['left','right']){
  const b=quantile(side==='left'?p:1-p,mean,sd),width=sdFromProbability(mean,b,p,side),centre=meanFromProbability(sd,b,p,side);
  near(width.sd,sd,2e-10);near(centre.mean,mean,1e-10);near(cdf(b,width.mean,width.sd),leftProbability(p,side),2e-13);
 }
 near(meanFromProbability(3,100,.5).mean,100);
 for(const p of [0,1,-.1,1.1,NaN,Infinity])assert.throws(()=>leftProbability(p));
 assert.throws(()=>leftProbability(.2,'both'));
 for(const sd of [0,-2,NaN,Infinity])assert.throws(()=>meanFromProbability(sd,10,.1));
 assert.throws(()=>sdFromProbability(5,6,.1),/positiv spredning/);
 assert.throws(()=>sdFromProbability(5,5,.5),/ikke entydig/);
 assert.throws(()=>sdFromProbability(5,6,.5),/passer ikke sammen/);
 assert.throws(()=>sdFromProbability(NaN,6,.4));
});
test('two distinct increasing quantiles recover both parameters including asymmetric tails',()=>{
 for(const mean of [-100,0,250])for(const sd of [.03,3,40])for(const [p1,p2] of [[.1,.9],[.1,.8],[.4,.6],[.3,.5]]){
  const a=quantile(p1,mean,sd),b=quantile(p2,mean,sd),model=parametersFromQuantiles(a,p1,b,p2);
  near(model.mean,mean,5e-12);near(model.sd,sd,5e-12);near(cdf(a,model.mean,model.sd),p1);near(cdf(b,model.mean,model.sd),p2);
 }
 for(const args of [[1,.1,1,.9],[2,.1,1,.9],[1,.9,2,.1],[1,.5,2,.5],[1,0,2,1],[NaN,.1,2,.9]])assert.throws(()=>parametersFromQuantiles(...args));
 const asymmetric=parametersFromQuantiles(245,.1,257,.8);assert.ok(Math.abs(asymmetric.mean-251)>1);
});
test('density constraints have zero, one or two centres and never become CDF constraints',()=>{
 for(const sd of [1,3,6])for(const bound of [-2,1,10]){
  const peak=pdf(bound,bound,sd),one=meansFromDensity(bound,sd,peak);assert.deepEqual(one.means,[bound]);
  for(const height of [peak*.01,peak*.4,peak*.99]){const model=meansFromDensity(bound,sd,height);assert.equal(model.means.length,2);near((model.means[0]+model.means[1])/2,bound);for(const mean of model.means)near(pdf(bound,mean,sd),height);}
  assert.throws(()=>meansFromDensity(bound,sd,peak*1.01),/Ingen middelværdi/);
 }
 const density=meansFromDensity(1,3,.05);near(density.means[0],-3.196101301239253);near(density.means[1],5.196101301239253);assert.ok(Math.abs(cdf(1,density.means[0],3)-.05)>.5);
 for(const args of [[1,0,.05],[1,3,0],[1,3,-.05],[1,3,Infinity],[NaN,3,.05]])assert.throws(()=>meansFromDensity(...args));
});
test('parameter graphs show computed whole-tail probabilities and accurate shaded areas',()=>{
 for(const [key,c] of Object.entries(parameterCases)){
  const fitted=solveParameterCase(key),model=parameterPlotModel(fitted.mean,fitted.sd,c.points);
  for(const check of model.checks)near(check.actual,check.p,1e-12);
  near(area(model.shade),model.probability,4e-6);near(area(model.curve),1,1e-11);
  assert.ok(model.min<=fitted.mean-5*fitted.sd);assert.ok(model.max>=fitted.mean+5*fitted.sd);
 }
 const tail=parameterPlotModel(0,1,[{bound:-12,p:.1}]);assert.deepEqual(tail.shade,[]);assert.ok(tail.probability<1e-25);
 assert.throws(()=>solveParameterCase('missing'));assert.throws(()=>parameterPlotModel(0,0,[{bound:1,p:.1}]));assert.throws(()=>parameterPlotModel(0,1,[]));
});
test('all source and adapted answers satisfy the original model conditions',()=>{
 near(cdf(2,5,answer('sd','sd')),.1);near(survival(500,answer('mean','mean'),5),.3);
 near(cdf(90,answer('oil','mean'),answer('oil','sd')),.4);near(survival(110,answer('oil','mean'),answer('oil','sd')),.4);
 near(cdf(245,answer('asymmetric','mean'),answer('asymmetric','sd')),.1);near(cdf(257,answer('asymmetric','mean'),answer('asymmetric','sd')),.8);
 near(survival(10.1,10,answer('keg','sd')),.1);near(cdf(9.8,10,answer('keg','sd')),answer('keg','p'));
 near(cdf(497,answer('candy','mean'),5),.4);near(survival(505,answer('candy','mean'),5),answer('candy','one'));near(answer('candy','one')**2,answer('candy','both'));
 near(intervalProbability(2,2.5,2.1,.3),answer('heavy','p'));near(cdf(100,answer('heavy','mean'),3),.4);
 near(pdf(1,answer('density','lower'),3),.05);near(pdf(1,answer('density','upper'),3),.05);
 near(cdf(245,answer('tea','mean'),answer('tea','sd')),.1);near(survival(255,answer('tea','mean'),answer('tea','sd')),.1);
 near(cdf(answer('interval-bound','k'),10,3),answer('interval-bound','cdf'));near(intervalProbability(2,answer('interval-bound','k'),10,3),.4);
 near((371.2-400.432)/-3.083184023938511,answer('data','sd'));near(answer('read-cdf','mean'),8);near(answer('read-cdf','sd'),3);
});
test('new bank and lessons cover all module-3 goals and preserve version-1 tasks',()=>{
 assert.equal(normalParameterTasks.length,16);assert.equal(parameterLessonTasks.length,43);assert.equal(parameterRequired.length,35);assert.equal(parameterPre.length,8);assert.equal(parameterMini.length,12);assert.equal(parameterFinal.length,7);
 for(const t of normalParameterTasks){validateTask(t);assert.deepEqual(instantiate(t.id,'parameter-quality'),t);assert.ok(t.hints.length>=2);assert.deepEqual(t.prerequisites,['norm.1','norm.2']);for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct',t.id+':'+p.id);if(p.type==='number')assert.equal(gradePart(p,String(Math.round(Number(p.answer)*1e4)/1e4)).status,'correct',t.id+': rounded '+p.id);}}
 for(const t of parameterLessonTasks)for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct',t.id);
 for(const [id] of Object.entries(goals).filter(([,g])=>g.module==='norm.3'))assert.ok(normalParameterTasks.some(t=>t.goals.includes(id)),id);
 for(const t of [...normalTasks,...normalStandardTasks])assert.deepEqual(t,instantiate(t.id,'old-sets',1));
 assert.match(targetedFeedback(task('tail'),task('tail').parts[0],'.3'),/Halevalg/);
 assert.match(targetedFeedback(task('sd'),task('sd').parts[0],'-2.341'),/Fortegns/);
 assert.match(targetedFeedback(task('asymmetric'),task('asymmetric').parts[0],'251'),/Metodefejl/);
 assert.equal(gradePart(task('tail').parts[0],'7/10').status,'correct');
 assert.equal(new Set(normalParameterTasks.map(t=>t.id)).size,16);assert.ok(normalParameterTasks.some(t=>t.size==='complex'));assert.ok(normalParameterTasks.some(t=>!t.aids));assert.ok(normalParameterTasks.some(t=>t.aids));
});
test('selection filters prerequisites and all nine direct steps integrate with the earlier modules',()=>{
 const config={topics:['normalDistribution'],minutes:500,distribution:{short:50,medium:50,complex:50},onlyCompleted:true};
 assert.equal(composeSet({...config,completed:['norm.3']}).tasks.length,0);assert.equal(composeSet({...config,completed:['norm.1','norm.3']}).tasks.length,12);
 assert.equal(composeSet({...config,completed:['norm.1','norm.2']}).tasks.length,27);assert.equal(composeSet({...config,completed:['norm.1','norm.2','norm.3']}).tasks.length,43);assert.equal(composeSet({...config,onlyCompleted:false}).tasks.length,75);
 assert.deepEqual(normalImplemented,['1','2','3','repetition','4']);assert.equal(parameterSteps.length,9);assert.equal(pagesForNormalModule('3').length,9);
 for(const module of normalImplemented)for(const path of pagesForNormalModule(module))assert.equal(parseNormalRoute('#'+path).path,path);
 assert.equal(parseNormalRoute('#normalDistribution/3').path,'normalDistribution/3/start');assert.equal(parseNormalRoute('#normalDistribution/3/bad').path,'normalDistribution/3/start');for(const module of ['5']){assert.equal(parseNormalRoute('#normalDistribution/'+module).step,'');assert.deepEqual(pagesForNormalModule(module),[]);}
});
