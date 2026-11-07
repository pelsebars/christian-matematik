import test from 'node:test';
import assert from 'node:assert/strict';
import {twoTasks} from '../tasks/bank/twoVariables.js';
import {twoModules,parseTwoRoute} from '../two-plan.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
import {setTopic} from '../server/point-overview.js';
import {renderPointOverview} from '../point-overview.js';
import {bankSessionReward} from '../tasks/rewards.js';
test('Released modules have complete task flows, valid catalog answers and bank selection',()=>{
 assert.equal(new Set(twoTasks.map(t=>t.id)).size,twoTasks.length);
 for(const m of twoModules){const tasks=twoTasks.filter(t=>t.module===`two.${m.id}`);assert.ok(tasks.length>=10);for(const step of ['start','oevelser','modeller','slut'])assert.ok(tasks.some(t=>t.step===step));}
 for(const t of twoTasks){assert.deepEqual(instantiate(t.id,'two'),t);for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct',t.id);assert.equal(gradePart(p,'').status,'unanswered');assert.equal(gradePart(p,p.type==='choice'?'wrong':'99999').status,'incorrect');}}
 const set=composeSet({topics:['twoVariables'],minutes:180,distribution:{short:5,medium:5,complex:5}});assert.ok(set.tasks.length);assert.ok(set.tasks.every(t=>t.topic==='twoVariables'));
});
test('Routes, topic attribution and point overview expose released modules',()=>{
 assert.equal(parseTwoRoute('#twoVariables/1/unknown').path,'twoVariables/1/start');assert.equal(parseTwoRoute('#twoVariables/99').path,'twoVariables');assert.equal(parseTwoRoute('#trigonometry'),null);
 assert.equal(setTopic(JSON.stringify({items:[{id:twoTasks[0].id}]})),'twoVariables');
 const html=renderPointOverview({earnedPoints:4,pointOverview:[{topic:'twoVariables',points:4,solved:2}]});for(const m of twoModules)assert.ok(html.includes(`data-point-two-status="${m.id}"`));assert.ok(html.includes('href="#twoVariables"'));
});
test('Model answers independently satisfy equations and numerical arc length',()=>{
 const get=id=>twoTasks.find(t=>t.id===id).parts.map(p=>Number(p.answer));
 const [b,h]=get('two1.bmi');assert.ok(Math.abs(b*1.7**2-78)<1e-8);assert.ok(Math.abs(83/h**2-24.3)<1e-8);
 const [height,length]=get('two1.slide');assert.equal(height,9.4);let sum=0;const dx=20/10000;for(let i=0;i<10000;i++){const x=(i+.5)*dx;sum+=Math.hypot(1,.0375*Math.exp(.125*x)-1.5125*Math.exp(-.125*x))*dx;}assert.ok(Math.abs(sum-length)<.006,`${sum} vs ${length}`);
});
test('Bank rewards require an actual check and withdraw active credit on editing',()=>{
 const t=twoTasks[0],session={mode:'training',status:'active',seed:'two',items:[{id:t.id,version:1}],answers:{[t.id]:{a:t.parts[0].answer}},checked:{},hints:{},self:{},marked:{},index:0,startedAt:Date.now(),minutes:10,timer:false};
 assert.equal(bankSessionReward(session).points,0);session.checked[t.id]=true;assert.equal(bankSessionReward(session).points,2);session.answers[t.id].a='999';assert.equal(bankSessionReward(session).points,0);
});

test('Module 2 gradients agree with independent central differences, including quotient and model units',()=>{
 const t=twoTasks.find(t=>t.id==='two2.quotient');if(!t)return;
 const cases=[['two2.quotient',(x,y)=>2*x*y/(x*x+y*y),1,2],['two2.bmi-rate',(x,y)=>x/y**2,90,1.8],['two2.final',(x,y)=>x*x-4*y*y+3*x*y,1,2],['two2.gradient',(x,y)=>x*x*y-3*x*y*y-2*y*y+1,1,2]];
 for(const [id,f,x,y] of cases){const a=twoTasks.find(t=>t.id===id).parts.map(p=>+p.answer),h=1e-5;assert.ok(Math.abs((f(x+h,y)-f(x-h,y))/(2*h)-a[0])<1e-6,id);assert.ok(Math.abs((f(x,y+h)-f(x,y-h))/(2*h)-a[1])<1e-6,id);}
});


test('Stationary classification covers minima, maxima, saddles and inconclusive cases',async()=>{
 const {classifyStationary:c}=await import('../two-math.js');
 assert.deepEqual(c(4,8,-1),{determinant:31,kind:'min'});assert.deepEqual(c(-2,-8,1),{determinant:15,kind:'max'});assert.deepEqual(c(2,-2,2),{determinant:-8,kind:'saddle'});assert.deepEqual(c(0,0,0),{determinant:0,kind:'unknown'});assert.equal(c(2,2,2).kind,'unknown');
 const cases=[['two3.minimum',(x,y)=>x*x+y*y-4*y],['two3.saddle',(x,y)=>x*x-y*y+2*x*y+4*y],['two3.two-points',(x,y)=>x**3+3*x*y-y*y],['two3.chip',(x,y)=>1-x*x/9+y*y/4],['two3.final',(x,y)=>x*x-y*y-4*x*y+10*y]];
 for(const [id,f] of cases){const task=twoTasks.find(t=>t.id===id);if(!task)continue;const [x,y,z]=task.parts.map(p=>+p.answer),h=1e-4;assert.ok(Math.abs(f(x,y)-z)<1e-8,id);assert.ok(Math.abs((f(x+h,y)-f(x-h,y))/(2*h))<1e-6,id);assert.ok(Math.abs((f(x,y+h)-f(x,y-h))/(2*h))<1e-6,id);const xx=(f(x+h,y)-2*f(x,y)+f(x-h,y))/h**2,yy=(f(x,y+h)-2*f(x,y)+f(x,y-h))/h**2,xy=(f(x+h,y+h)-f(x+h,y-h)-f(x-h,y+h)+f(x-h,y-h))/(4*h*h);assert.equal(c(xx,yy,xy).kind,task.parts.find(p=>p.id==='kind').answer,id);}
});
