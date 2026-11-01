import test from 'node:test';
import assert from 'node:assert/strict';
import {shiftedFormulas as F,shiftedValue,shiftedFormula,math,fishRate,fishAge,milkRate,potRate,childAge,bathTemperature,bathLevel,minimumBathFlow,mexicoValue} from '../ode-shifted-math.js';
import {shiftedTasks} from '../tasks/bank/ode-shifted.js';
import {shiftedLessonTasks,shiftedRequired} from '../ode-shifted-lesson.js';
import {shiftedTaskStep} from '../ode-shifted-exercises.js';
import {shiftedSteps,parseOdeRoute} from '../ode-routes.js';
import {mathMLFunction} from './integration-mathml.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const derivative=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
const render=id=>{const f=mathMLFunction(math(F[id]));return x=>f(x,{t:x});};
const answer=(id,p)=>Number(shiftedTasks.find(t=>t.id==='ode5.'+id).parts.find(q=>q.id===p).answer);
test('rendered shifted solutions independently satisfy differential equations and initial points',()=>{
 const cases=[['origin',(x,y)=>20-4*y,0,100,[0,.1,1]],['point',(x,y)=>6-2*y,1,5,[0,1,2]],['fish',(x,y)=>fishRate*(100-y),0,.4,[0,1,8]],['mexico',(x,y)=>.017*Math.exp(-.025*x)*y,0,132,[0,10,200]],['ball',(x,y)=>9.82-5.5*y,0,0,[0,.5,2]],['milk',(x,y)=>milkRate*(20-y),0,6,[0,2,3]],['circuit',(x,y)=>(9-10*y)/.4,0,0,[0,.05,.2]],['child',(x,y)=>5.24-.045*y,0,50,[0,20,48]],['pollution',(x,y)=>.4-.02*y,0,0,[0,15,50]]];
 for(const [id,rhs,a,b,times] of cases){const f=render(id);near(f(a),b);for(const x of times)near(derivative(f,x),rhs(x,f(x)),.00001);}
 for(const rate of [-2,.2,2])for(const initial of [-3,4,9]){const f=mathMLFunction(math(shiftedFormula(4,initial-4,rate,'<mi>x</mi>',1)));near(f(1),initial);near(derivative(f,1.1),rate*(4-f(1.1)),.00001);near(f(1.1),shiftedValue(4,rate,initial,1.1,1));}
 near(shiftedValue(19,potRate,98,10),60);near(render('fish')(1),11);near(render('milk')(2),13);
});
test('source predictions, inverse ages, distances, thresholds, rates and valid intervals',()=>{
 near(answer('population','rate10'),.5*(50-10));near(answer('population','rate20'),15);near(.5*(50-answer('population','amount')),5);near(answer('family','level'),2);near(answer('origin','constant'),95);near(answer('point','slope'),-4);
 near(render('fish')(answer('fish','lower')),40);near(render('fish')(answer('fish','upper')),60);near(answer('fish','rate'),-Math.log(89/99.6));near(answer('milk','temperature'),render('milk')(3));near(answer('milk','slope'),milkRate*10);near(answer('circuit','rate'),(9-10*.3)/.4);
 const n=10000,h=2/n;let distance=0;for(let i=0;i<n;i++)distance+=(render('ball')(i*h)+render('ball')((i+1)*h))*h/2;near(distance,answer('ball','distance'),1e-6);assert.ok(distance<5);
 near(render('child')(childAge),100);assert.ok(childAge>=0&&childAge<=48);near(answer('child','rate'),.74);
 near(render('pollution')(answer('pollution','time')),10);near(answer('pollution','rate'),derivative(render('pollution'),15),1e-6);near(answer('mexico','rate'),132*.017);near(mexicoValue(200),render('mexico')(200));
});
test('bath minimum meets whole-interval condition and fails below threshold',()=>{
 const v=minimumBathFlow(),L=bathLevel(v);near(bathTemperature(v,40),37);assert.ok(L<37);assert.ok(bathTemperature(v-.001,40)<37&&bathTemperature(v+.001,40)>37);
 for(const flow of [0,1,v,10])for(const t of [0,10,40])near(derivative(x=>bathTemperature(flow,x),t),flow/200*(45-bathTemperature(flow,t))+.015*(22-bathTemperature(flow,t)),1e-7);
 for(let t=0;t<=40;t++){assert.ok(bathTemperature(v,t)>=37-1e-10);if(t<40)assert.ok(bathTemperature(v,t)>bathTemperature(v,t+1));}
 near(answer('bath','temperature'),bathTemperature(1,40));near(answer('bath','flow'),v);
});
test('M5 task bank, grading, routes, independent module filtering and all lesson cards',()=>{
 assert.equal(shiftedTasks.length,13);assert.equal(shiftedLessonTasks.length,28);assert.equal(shiftedRequired.length,23);
 for(const t of shiftedTasks)assert.deepEqual(instantiate(t.id,'shifted',1),t);
 for(const t of shiftedLessonTasks){assert.ok(shiftedSteps.some(([s])=>s===shiftedTaskStep(t)));for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');}}
 for(const [step] of shiftedSteps)assert.equal(parseOdeRoute('#differentialEquations/5/'+step).step,step);
 assert.equal(parseOdeRoute('#differentialEquations/5/unknown').step,'start');
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.1','ode.2','ode.5'],minutes:1000,distribution:{short:100,medium:100,complex:100}});assert.equal(set.tasks.length,31);assert.equal(set.tasks.filter(t=>t.module==='ode.5').length,13);
 assert.equal(composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.5']}).tasks.length,0);
});
