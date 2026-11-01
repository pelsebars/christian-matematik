import test from 'node:test';
import assert from 'node:assert/strict';
import {logisticFormulas as F,logisticValue as V,logisticTime as T,logisticRate as R,rateRoots,logisticFormula,math,twoPointA,harvestValue,harvestProfit,harvestCandidates,harvestOptimum,soupAmounts} from '../ode-logistic-math.js';
import {logisticTasks} from '../tasks/bank/ode-logistic.js';
import {logisticLessonTasks,logisticRequired} from '../ode-logistic-lesson.js';
import {logisticTaskStep} from '../ode-logistic-exercises.js';
import {logisticSteps,parseOdeRoute} from '../ode-routes.js';
import {mathMLFunction} from './integration-mathml.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`),derivative=(f,x)=>(f(x+1e-4)-f(x-1e-4))/2e-4;
const render=id=>{const f=mathMLFunction(math(F[id]));return x=>f(x,{t:x});};
const answer=(id,p)=>Number(logisticTasks.find(t=>t.id==='ode6.'+id).parts.find(q=>q.id===p).answer);
test('rendered logistic formulas satisfy independent ODEs, initial points and exponent products',()=>{
 const cases=[['population',1000,.0001,100,0],['cars',315,.0004,198,0],['plant',52,.001,2,0],['pig',139.6,.000193,7.3,0],['rates',1000,.00013,50,0],['bacteria',2000,.000155,50,0],['infection',500000,3/500000,2500,0],['harvest',15.5,.000369,13.1,400],['soup',10000,.00002,soupAmounts[0],40],['oyster',53.63,.00018,.59,0],['twoPoints',15,twoPointA,7,10]];
 for(const [id,M,a,initial,start] of cases){const f=render(id);near(f(start),initial,1e-6);for(const t of [start,start+.5,start+2]){near(derivative(f,t),a*f(t)*(M-f(t)),Math.max(1e-6,Math.abs(a*f(t)*(M-f(t)))*1e-7));near(f(t),V(M,a,initial,t,start),1e-6);}}
 near(render('twoPoints')(15),8);near(T(15,twoPointA,7,7.5,10),12.5);assert.ok(!F.pig.includes('0,026524'));assert.ok(F.pig.includes('0,0269428'));
 near(render('rabbits')(0),100);near(derivative(render('rabbits'),20),.03/1700*render('rabbits')(20)*(1700-render('rabbits')(20)),1e-6);
});
test('equilibria, peak criteria, inverse times and positive model branch boundaries',()=>{
 for(const initial of [0,100,150]){const f=x=>V(100,.002,initial,x);near(f(0),initial);near(derivative(f,1),R(.002,100,f(1)),1e-6);}
 assert.ok(V(100,.002,150,10)<150&&V(100,.002,150,10)>100);assert.ok(Number.isNaN(V(100,.002,150,-20)));assert.ok(Number.isNaN(V(0,.002,10,0)));near(V(100,0,10,20),10);
 for(const initial of [10,50,80]){const time=T(100,.002,initial,50);near(V(100,.002,initial,time),50);assert.equal(Math.sign(time),Math.sign(50-initial));}
 assert.ok(Number.isNaN(T(100,.002,0,50)));assert.ok(Number.isNaN(T(100,.002,10,100)));
 for(const initial of [0,100]){const f=mathMLFunction(math(logisticFormula(100,.002,initial)));near(f(10),initial);}
 const max=.002*100*100/4;assert.deepEqual(rateRoots(.002,100,max),[50]);assert.deepEqual(rateRoots(.002,100,max+1),[]);assert.deepEqual(rateRoots(.002,100,-1),[]);assert.deepEqual(rateRoots(.002,100,0),[0,100]);
 for(let y=0;y<=100;y++)assert.ok(R(.002,100,y)<=max);
 for(const y of rateRoots(.002,100,4))near(R(.002,100,y),4);
});
test('source amounts, rates, inverse values and rounding are independently checked',()=>{
 near(answer('rabbits','initial'),100);near(answer('population','rate'),9);near(answer('cars','estimate'),render('cars')(50));near(answer('plant','weight'),render('plant')(5));near(render('plant')(answer('plant','time')),26);near(answer('pig','peak-weight'),139.6/2);
 near(answer('rates','initial-rate'),.00013*50*950);for(const key of ['low','high']){const y=answer('rates',key);near(.00013*y*(1000-y),31);assert.ok(T(1000,.00013,50,y)>0);}
 near(answer('bacteria','amount'),render('bacteria')(15));near(answer('bacteria','rate'),.000155*render('bacteria')(15)*(2000-render('bacteria')(15)));
 near(answer('infection','a'),3/500000);near(render('infection')(answer('infection','time')),100000,1e-5);
 for(const key of ['low','high']){const y=answer('soup',key);near(.00002*y*(10000-y),250);}near(render('soup')(40),answer('soup','low'));near(derivative(render('soup'),40),250,1e-6);
});
test('profit optimum is global on the specified interval including both endpoints',()=>{
 const best=harvestOptimum();near(best,694.8024920481785,1e-6);near(answer('harvest','optimum'),best);assert.equal(harvestCandidates().length,3);near(harvestValue(400),13.1);near(derivative(harvestProfit,best),0,1e-6);
 assert.ok(derivative(harvestProfit,best-10)>0&&derivative(harvestProfit,best+10)<0);
 for(let x=0;x<=1000;x++)assert.ok(harvestProfit(x)<=harvestProfit(best));
 for(const x of [0,400,1000]){near(harvestProfit(x),700*render('harvest')(x)-1.97*x,1e-7);near(derivative(harvestProfit,x),700*.000369*harvestValue(x)*(15.5-harvestValue(x))-1.97,1e-6);}
});
test('M6 bank, grading, routes and module prerequisites cover every source exercise',()=>{
 assert.equal(logisticTasks.length,11);assert.equal(logisticLessonTasks.length,26);assert.equal(logisticRequired.length,21);
 for(const t of logisticTasks)assert.deepEqual(instantiate(t.id,'logistic',1),t);
 for(const t of logisticLessonTasks){assert.ok(logisticSteps.some(([s])=>s===logisticTaskStep(t)));for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');}}
 for(const [step] of logisticSteps)assert.equal(parseOdeRoute('#differentialEquations/6/'+step).step,step);assert.equal(parseOdeRoute('#differentialEquations/6/unknown').step,'start');
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.1','ode.2','ode.6'],minutes:1000,distribution:{short:100,medium:100,complex:100}});assert.equal(set.tasks.length,29);assert.equal(set.tasks.filter(t=>t.module==='ode.6').length,11);assert.equal(composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.6']}).tasks.length,0);
});
