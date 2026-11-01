import test from 'node:test';
import assert from 'node:assert/strict';
import {localTasks} from '../tasks/bank/ode-local.js';
import {localLessonTasks,localRequired,localSolution} from '../ode-local-lesson.js';
import {localTaskStep} from '../ode-local-exercises.js';
import {localSteps,parseOdeRoute} from '../ode-routes.js';
import {localFormulas as F,localSlope,math,rabbitRate,carStop,concretePeak,infusionRate} from '../ode-local-math.js';
import {mathMLFunction} from './integration-mathml.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {polynomial} from '../tasks/math.js';
import {composeSet} from '../tasks/selection.js';
const get=id=>localTasks.find(t=>t.id==='ode3.'+id),answer=(id,p)=>Number(get(id).parts.find(q=>q.id===p).answer);
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const evaluate=(s,x)=>polynomial(s).reduce((sum,c,i)=>sum+c*x**i,0);
const render=id=>mathMLFunction(math(F[id]));
const derivative=(f,x)=>(f(x+1e-4)-f(x-1e-4))/.0002;
test('local slopes, tangent polynomials and missing point agree independently',()=>{
 for(const [id,a,b,m] of [['negative',1,-2,-2],['implicit',1,2,1],['rearrange',2,6,4]]){
  near(answer(id,'slope'),m);const line=get(id).parts.find(p=>p.id==='line').answer;
  near(evaluate(line,a),b);near((evaluate(line,a+1)-evaluate(line,a-1))/2,m);
 }
 near(answer('element','slope'),Math.exp(2-2)*(2*3-2));near(answer('unknown-point','height'),6-4);
 const line=get('unknown-point').parts[1].answer;near(evaluate(line,1),2);near(evaluate(line,2)-evaluate(line,1),6);
 const k=answer('rearrange','parameter');for(const x of [1.1,2,3])near(k+Math.exp(x)+2*x,k*x+Math.exp(x)+2);
 assert.equal(localSlope('root',1,0),null);assert.equal(localSlope('root',1,-1),null);assert.equal(localSlope('quotient',1,0),null);near(localSlope('quotient',1,-2),-2);
 for(const [a,b] of [[1,2],[-1,3],[0,-2]]){near(localSolution(a,b,a),b);for(const x of [a-.1,a,a+.1])near(derivative(t=>localSolution(a,b,t),x),4*x+localSolution(a,b,x),.000001);}
});
test('rendered CAS solutions satisfy their source ODE, initial condition and domain',()=>{
 const cases=[['rabbitsA',(x,y)=>Math.log(3)/4*y,0,100,[0,2,4]],['rabbitsB',(x,y)=>rabbitRate*y,0,100,[0,2,4]],['grass',(x,y)=>.16*y,0,3,[0,2,6]],['medicine',(x,y)=>-.035*y,0,2,[0,1,5]],['world',(x,y)=>.012*y**1.3,0,5.28,[0,20,45]],['car',(x,y)=>(-2*y-1020)/1150,0,20,[0,10,20]],['concrete',(x,y)=>.3*(20-y)+15*Math.exp(-.1*x),0,15,[0,concretePeak,50]],['variable',(x,y)=>y/x+1,1,4,[.5,1,2]],['fish',(x,y)=>.619*Math.exp(-.22*x)*y,10,72,[5,10,16]],['trig',x=>Math.cos(x)+Math.sin(x),Math.PI,2,[0,1,Math.PI]],['mexicoRate',(x,y)=>-.025*y,0,.017,[0,10,100]],['mexico',(x,y)=>.017*Math.exp(-.025*x)*y,0,106.5,[0,10,100]]];
 for(const [id,rhs,start,value,times] of cases){const f=render(id);near(f(start),value,.000001);for(const x of times)near(derivative(f,x),rhs(x,f(x)),.00001);}
 const raw=render('infusion'),f=x=>raw(x,{p:infusionRate});near(f(0),0);near(f(3),100);for(const x of [0,2,5])near(derivative(f,x),infusionRate-.03*f(x),.00001);
});
test('model predictions, derivative data, inverse problems, extrema and travelled distance',()=>{
 near(render('rabbitsA')(4),300);near(derivative(render('rabbitsB'),4),10,.00001);near(render('rabbitsB')(4),answer('rabbits','amount-b'));
 near(render('grass')(answer('grass','time')),8);near(answer('grass','rate'),.16*4);
 near(answer('medicine','derivative'),-.035*1.5);near(answer('medicine','decrease'),.035*1.5);
 near(render('world')(45),answer('world','population'));near(answer('world','rate'),.012*5.28**1.3);
 const car=render('car');near(car(answer('car','stop')),0);const count=10000,h=carStop/count;let area=0;for(let i=0;i<count;i++)area+=(car(i*h)+car((i+1)*h))*h/2;near(area,answer('car','distance'),.00001);
 const temp=render('concrete');near(derivative(temp,answer('concrete','time')),0,.00001);assert.ok(temp(concretePeak)>temp(0)&&temp(concretePeak)>temp(50));assert.ok(derivative(temp,concretePeak-1)>0&&derivative(temp,concretePeak+1)<0);
 near(render('fish')(16),answer('fish','length'));near(render('fish')(answer('fish','age')),40);near(render('mexico')(answer('mexico','time')),200);
 near(answer('variable','slope'),5);
});
test('all tasks integrate with bank, grading, routes and completion filters',()=>{
 assert.equal(localTasks.length,17);assert.equal(localLessonTasks.length,32);assert.equal(localRequired.length,27);
 for(const t of localTasks){assert.deepEqual(instantiate(t.id,'local',1),t);assert.equal(t.hints.length,3);assert.ok(t.errors.length);}
 for(const t of localLessonTasks){assert.ok(localSteps.some(([id])=>id===localTaskStep(t)));for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');}}
 for(const [step] of localSteps)assert.equal(parseOdeRoute('#differentialEquations/3/'+step).step,step);
 assert.equal(parseOdeRoute('#differentialEquations/3/unknown').step,'start');
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.1','ode.2','ode.3'],minutes:500,distribution:{short:50,medium:50,complex:50}});assert.equal(set.tasks.length,35);assert.equal(set.tasks.filter(t=>t.module==='ode.3').length,17);
 assert.equal(composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.3']}).tasks.length,0);
});
