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
