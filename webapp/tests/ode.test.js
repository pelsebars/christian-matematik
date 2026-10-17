import test from 'node:test';
import assert from 'node:assert/strict';
import { odeTasks } from '../tasks/bank/ode.js';
import { instantiate } from '../tasks/bank/index.js';
import { gradePart,targetedFeedback } from '../tasks/grading.js';
import { composeSet } from '../tasks/selection.js';
import { odeModules,odeGoals } from '../ode-plan.js';
import { parseOdeRoute,odePages } from '../ode-routes.js';
import { polynomial } from '../tasks/math.js';
const evaluate=(formula,x)=>polynomial(formula).reduce((sum,c,i)=>sum+c*x**i,0);
test('ODE module 1 matches independent derivative, initial-value and flow calculations',()=>{
 const get=id=>instantiate('ode.'+id,'ode-check');
 const polynomialTask=get('polynomial');
 for(const x of [-2,-1,0,1,2,3]){
  assert.equal(evaluate(polynomialTask.parts[0].answer,x),-2*x+3);
  assert.equal(evaluate(polynomialTask.parts[1].answer,x),3*x-1);
 }
 assert.equal(polynomialTask.parts[2].answer,'no');
 const family=get('family');
 assert.equal(evaluate(family.parts[1].answer,2),7);
 assert.equal(evaluate(family.parts[1].answer,0),Number(family.parts[0].answer));
 for(const x of [-2,0,1,3]){
  const f=2*Math.exp(x)-x-1;
  assert.ok(Math.abs((2*Math.exp(x)-1)-(x+f))<1e-12);
 }
 const model=get('model');
 assert.equal(Number(model.parts[1].answer),12-4);
 assert.equal(Number(model.parts[4].answer),100+(12-4)*10);
 const cas=get('cas');for(const x of [-3,0,2])assert.equal(evaluate(cas.parts[0].answer,x),3*x*x-2);
});
test('ODE bank integrates goals, exam filtering, grading and targeted feedback',()=>{
 assert.equal(odeTasks.length,6);
 for(const task of odeTasks){
  assert.deepEqual(task,instantiate(task.id,'quality'));
  for(const part of task.parts)assert.equal(gradePart(part,part.answer).status,'correct');
  assert.ok(task.hints.length>=2);assert.ok(task.errors.length);
 }
 const set=composeSet({topics:['differentialEquations'],minutes:180,distribution:{short:10,medium:10,complex:10}});
 assert.equal(set.tasks.length,6);
 assert.equal(composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:[]}).tasks.length,0);
 const task=odeTasks.find(t=>t.id==='ode.model');
 assert.match(targetedFeedback(task,task.parts.at(-1),'80'),/startmængden/);
 assert.equal(gradePart(task.parts[1],'8,0').status,'correct');
 assert.equal(gradePart(task.parts[1],'').status,'unanswered');
 assert.equal(gradePart(odeTasks[1].parts[0],'sin(x)').status,'review');
});
test('ODE route structure preserves seven teaching sessions and a separate recap',()=>{
 assert.deepEqual(odeModules.map(m=>m.id),['1','2','3','repetition','4','5','6','opsamling']);
 assert.equal(odeGoals.length,22);
 assert.equal(parseOdeRoute('#integration'),null);
 assert.equal(parseOdeRoute('#differentialEquations/1/unknown').path,'differentialEquations/1/start');
 assert.equal(parseOdeRoute('#differentialEquations/unknown').path,'differentialEquations');
 for(const path of odePages)assert.equal(parseOdeRoute('#'+path).path,path);
});
