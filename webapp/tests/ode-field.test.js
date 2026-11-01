import test from 'node:test';
import assert from 'node:assert/strict';
import {fieldModels as M,integrate,cellExact,vesselLimit} from '../ode-field-math.js';
import {fieldTasks} from '../tasks/bank/ode-field.js';
import {fieldLessonTasks,fieldRequired} from '../ode-field-lesson.js';
import {fieldTaskStep} from '../ode-field-exercises.js';
import {fieldSteps,parseOdeRoute} from '../ode-routes.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`),last=r=>r.points.at(-1).y;
test('Euler uses old-point slopes and shortened last steps in both directions',()=>{
 assert.deepEqual(integrate((x,y)=>y,[0,2],1,.5,'euler').points,[{x:0,y:2},{x:.5,y:3},{x:1,y:4.5}]);
 near(last(integrate(()=>2,[1,5],0,.3,'euler')),3);near(integrate(()=>2,[0,0],1,.3).points.at(-1).x,1);
 const errors=[.5,.25,.125].map(h=>Math.abs(last(integrate((x,y)=>y,[0,1],1,h,'euler'))-Math.E));assert.ok(errors[0]>errors[1]&&errors[1]>errors[2]);
 assert.throws(()=>integrate(()=>1,[0,0],1,0));assert.throws(()=>integrate(()=>1,[0,0],1,.1,'unknown'));
 assert.ok(integrate((x,y)=>y>=0?1:NaN,[0,0],-1,.1).stopped);assert.ok(integrate((x,y)=>y*y,[0,1],2,.01).stopped);
});
test('fine numerical reference matches independent exact solutions and physical equilibria',()=>{
 near(last(integrate(M.proportional.f,[0,2],1,.001)),2*Math.exp(3));
 for(const end of [0,20,60])near(last(integrate(M.cells.f,[10,266],end,.01)),cellExact(end),1e-5);
 for(const y of [0,2])near(last(integrate(M.quartic.f,[2,y],5,.01)),y);
 near(M.sine.f(0,5),Math.sin(5));near(M.sine.f(1,2),Math.sin(3));
 near(M.vessel.f(0,vesselLimit),0);const r=integrate(M.vessel.f,[0,0],3000,.2);assert.ok(!r.stopped);assert.ok(r.points.every(p=>p.y>=0&&p.y<=vesselLimit));near(last(r),vesselLimit,1e-5);
 assert.ok(Number.isNaN(M.vessel.f(0,-1)));assert.ok(Number.isNaN(M.cells.f(0,-1)));
});
test('source task answers and complete lesson connect to grading, routing and bank filters',()=>{
 const answer=(id,p)=>Number(fieldTasks.find(t=>t.id==='ode4.'+id).parts.find(q=>q.id===p).answer);
 near(answer('exponential','slope'),6);near(answer('rate-equation','rate'),6);for(const id of ['low','high']){const y=answer('rate-equation',id);near(5*y-y*y,4);}
 near(answer('rate-graph','slope'),3);near(answer('polynomial','slope'),11);near(answer('fraction','slope'),4);near(answer('cells','rate'),M.cells.f(10,266));near(answer('vessel','rate'),M.vessel.f(0,8));near(answer('vessel','limit'),vesselLimit);
 assert.equal(fieldTasks.length,13);assert.equal(fieldLessonTasks.length,25);assert.equal(fieldRequired.length,21);
 for(const t of fieldTasks)assert.deepEqual(instantiate(t.id,'field',1),t);
 for(const t of fieldLessonTasks){assert.ok(fieldSteps.some(([s])=>s===fieldTaskStep(t)));for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');}}
 for(const [step] of fieldSteps)assert.equal(parseOdeRoute('#differentialEquations/4/'+step).step,step);
 assert.equal(parseOdeRoute('#differentialEquations/4/unknown').step,'start');
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.1','ode.2','ode.3','ode.4'],minutes:1000,distribution:{short:100,medium:100,complex:100}});assert.equal(set.tasks.length,48);assert.equal(set.tasks.filter(t=>t.module==='ode.4').length,13);
 assert.equal(composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.4']}).tasks.length,0);
});
