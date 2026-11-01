import test from 'node:test';
import assert from 'node:assert/strict';
import { proportionalTasks } from '../tasks/bank/ode-proportional.js';
import { proportionalLessonTasks,proportionalRequired } from '../ode-proportional-lesson.js';
import { instantiate } from '../tasks/bank/index.js';
import { gradePart } from '../tasks/grading.js';
import { composeSet } from '../tasks/selection.js';
import { proportionalSteps,parseOdeRoute } from '../ode-routes.js';
import { mathMLFunction } from './integration-mathml.js';
import { modelValue,rateBetween } from '../ode-proportional-math.js';
const get=id=>proportionalTasks.find(t=>t.id==='ode2.'+id);
const answer=(id,p)=>get(id).parts.find(q=>q.id===p).answer;
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('rendered particular solutions independently satisfy their differential equations and initial points',()=>{
 for(const [id,rate,start,value] of [['origin',8,0,2],['point',2,1,4],['decay',-1,2,7],['ship',.1518,25,6.25]]){
  const p=get(id).parts.find(p=>p.id==='function'),f=mathMLFunction(p.options.find(o=>o.id===p.answer).label);
  near(f(start),value);
  for(const x of [start-.3,start,start+.2])near((f(x+1e-5)-f(x-1e-5))/2e-5,rate*f(x),.00001);
 }
});
test('model values, units, logarithms, percentages and numeric tolerances agree with independent calculations',()=>{
 near(Number(answer('population','rate')),Math.log(10500/10000)/5);
 near(10000*Math.exp(Number(answer('population','rate'))*10),Number(answer('population','prediction')));
 near(7*Math.exp(Number(answer('two-points','rate'))*3),5);
 near(6.25*Math.exp(.1518*(Number(answer('ship','speed'))-25)),4);
 near(Number(answer('ship','ratio')),100*Math.exp(-.1518*7.5));
 near(Number(answer('percent','percent')),100*(Math.exp(.1)-1));
 assert.equal(gradePart(get('ship').parts[1],'22,06').status,'correct');
 assert.equal(gradePart(get('ship').parts[1],'22').status,'incorrect');
 assert.match(get('ship').parts[1].label,/knob/);
 for(const rate of [-.5,0,.5])for(const b of [1,2,5]){near(modelValue(b,rate,0),b);near(modelValue(b,rate,4)/modelValue(b,rate,2),Math.exp(rate*2));near(rateBetween(b,modelValue(b,rate,4),4),rate);}
});
test('bank, routes, grading, completion metadata and independent M1 filters',()=>{
 assert.equal(proportionalTasks.length,12);assert.equal(proportionalLessonTasks.length,28);assert.equal(proportionalRequired.length,23);
 for(const task of proportionalLessonTasks)for(const p of task.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');}
 for(const task of proportionalTasks)assert.deepEqual(instantiate(task.id,'test'),task);
 for(const [step] of proportionalSteps)assert.equal(parseOdeRoute('#differentialEquations/2/'+step).step,step);
 assert.equal(parseOdeRoute('#differentialEquations/2/bad').step,'start');
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.1','ode.2'],minutes:400,distribution:{short:30,medium:30,complex:30}});
 assert.equal(set.tasks.length,18);assert.equal(set.tasks.filter(t=>t.module==='ode.2').length,12);

});
