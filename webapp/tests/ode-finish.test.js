import test from 'node:test';
import assert from 'node:assert/strict';
import {finishTasks} from '../tasks/bank/ode-finish.js';
import {finishLessonTasks,finishRequired,finishAreaStatus} from '../ode-finish-lesson.js';
import {finishTaskStep} from '../ode-finish-exercises.js';
import {finishSteps,parseOdeRoute} from '../ode-routes.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
import {mathMLFunction} from './integration-mathml.js';
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`),task=id=>finishTasks.find(t=>t.id==='odeend.'+id),answer=(id,p)=>Number(task(id).parts.find(p2=>p2.id===p).answer);
const render=id=>{const part=task(id).parts.find(p=>p.id==='function');return mathMLFunction(part.options.find(o=>o.id===part.answer).label);};
const d=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
test('mixed problems independently check formulas, data, rates, inverse times and model restrictions',()=>{
 near(answer('check','derivative'),2);near(answer('check','rhs'),3);
 const f=render('point');near(f(1),3);for(const x of [0,1,2])near(d(f,x),-2*f(x),1e-6);near(answer('point','slope'),-6);
 near(answer('tangent','slope'),-3);assert.equal(task('tangent').parts.find(p=>p.id==='line').answer,'-3*x+11');
 const g=render('balance');near(g(0),1);for(const x of [0,1,2])near(d(g,x),12-3*g(x),1e-6);
 near(answer('growth','peak'),.02*10*10);near(answer('growth','future'),.02*15*5);
 near(answer('cas','value'),3*Math.E);const k=answer('measurements','k');near(80*Math.exp(3*k),160);near(render('measurements')(answer('measurements','time')),240);
 near(answer('rate-data','amount'),300);assert.equal(task('rate-data').parts.find(p=>p.id==='line').answer,'30*x+240');
 const kt=answer('temperature','k'),temp=t=>20+60*Math.exp(-kt*t);near(temp(10),50);near(temp(20),answer('temperature','after'));near(temp(answer('temperature','time')),30);
 const n=render('population');near(n(0),20);near(n(answer('population','time')),100);near(answer('population','rate'),20);for(const t of [0,3,8])near(d(n,t),.002*n(t)*(200-n(t)),1e-6);assert.ok(answer('population','time')<10);
});
test('Euler results use both old coordinates and preserve independent approximations',()=>{
 near(answer('steps','first'),1+.5);near(answer('steps','second'),1.5+.5*(.5+1.5));
 const y1=1+.5*Math.sin(1),y2=y1+.5*Math.sin(.5+y1);near(answer('numeric','coarse'),y2);
 const z1=1+.25*Math.sin(1),z2=z1+.25*Math.sin(.25+z1),z3=z2+.25*Math.sin(.5+z2),z4=z3+.25*Math.sin(.75+z3);near(answer('numeric','fine'),z4);assert.notEqual(y2,z4);
});
test('completion requires both practice and all six final checks; recommendations roll back independently',()=>{
 assert.equal(finishLessonTasks.length,24);assert.equal(finishRequired.length,18);assert.equal(finishTasks.length,12);
 assert.ok(finishAreaStatus(()=>false).every(a=>a.count===0&&a.total===3));assert.ok(finishAreaStatus(()=>true).every(a=>a.count===3));
 const changed=finishAreaStatus(t=>t.id!=='odeend.tangent');assert.equal(changed.find(a=>a.id==='local').count,2);assert.ok(changed.filter(a=>a.id!=='local').every(a=>a.count===3));
 const finalsOnly=t=>t.id.includes('.final.');assert.ok(finishAreaStatus(finalsOnly).every(a=>a.count===1));assert.equal(finishRequired.filter(finalsOnly).length,6);
});
test('mixed bank integrates routes, grading, module filters and separate repetition',()=>{
 for(const t of finishTasks)assert.deepEqual(instantiate(t.id,'finish',1),t);
 for(const t of finishLessonTasks){assert.ok(finishSteps.some(([s])=>s===finishTaskStep(t)));for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');}}
 for(const [step] of finishSteps)assert.equal(parseOdeRoute('#differentialEquations/opsamling/'+step).step,step);assert.equal(parseOdeRoute('#differentialEquations/opsamling/unknown').step,'start');
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.1','ode.2','ode.3','ode.4','ode.5','ode.6','ode.opsamling'],minutes:2000,distribution:{short:200,medium:200,complex:200}});assert.equal(set.tasks.filter(t=>t.module==='ode.opsamling').length,12);assert.equal(set.tasks.filter(t=>t.module==='ode.repetition').length,0);
 assert.equal(composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.opsamling']}).tasks.length,0);
});
