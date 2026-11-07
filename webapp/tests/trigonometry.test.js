import {bankSessionReward} from '../tasks/rewards.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {trigTasks} from '../tasks/bank/trigonometry.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
import {sineRoots} from '../trig-graphs.js';
import {parseTrigRoute} from '../trig-plan.js';
import {renderPointOverview} from '../point-overview.js';
import {setTopic} from '../server/point-overview.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Both modules are available in the bank, with gradable answers and supported lesson fields',()=>{
 assert.equal(trigTasks.length,28);
 for(const t of trigTasks){assert.deepEqual(instantiate(t.id,'trig'),t);for(const p of t.parts){assert.ok(['number','choice'].includes(p.type));assert.equal(gradePart(p,p.answer).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');assert.equal(gradePart(p,p.type==='choice'?'wrong':'999').status,'incorrect');}}
 const set=composeSet({topics:['trigonometry'],minutes:180,distribution:{short:5,medium:5,complex:5}});
 assert.ok(set.tasks.length>0);assert.ok(set.tasks.every(t=>t.topic==='trigonometry'));
});
test('Independent root checks cover signs, tangencies, repeated periods and closed endpoints',()=>{
 const pi=Math.PI;
 assert.deepEqual(sineRoots(2,1,0,0,15),[]);
 const five=sineRoots(.5,1,0,0,15);assert.equal(five.length,5);
 for(const x of five)near(4*Math.sin(x)+5,7);
 const zero=sineRoots(0,1,0,0,2*pi);assert.equal(zero.length,3);near(zero[0],0);near(zero[2],2*pi);
 const tangent=sineRoots(1,2,-pi/2,0,2*pi);assert.equal(tangent.length,2);near(tangent[0],pi/2);near(tangent[1],3*pi/2);
 for(const x of sineRoots(.2,-2,.7,-4,5))near(Math.sin(-2*x+.7),.2);
});
test('Model answers satisfy original equations and source integral has independent numerical check',()=>{
 const get=id=>trigTasks.find(t=>t.id===id).parts.map(p=>Number(p.answer));
 const [h,t]=get('trig2.wheel');near(h,67.5*Math.sin(.209*7-1.57)+70);near(67.5*Math.sin(.209*t-1.57)+70,40);
 for(const t of get('trig2.breathing'))near(3.2+.4*Math.sin(1.25*t),3.5);
 const [a,v]=get('trig1.integral');let area=0,volume=0;const dx=Math.PI/2/10000;
 for(let i=0;i<10000;i++){const x=(i+.5)*dx,y=Math.sin(x)*Math.sqrt(Math.cos(x));area+=y*dx;volume+=Math.PI*y*y*dx;}
 assert.ok(Math.abs(area-a)<1e-6);assert.ok(Math.abs(volume-v)<1e-7);
});
test('Canonical routes and shop attribution include trigonometry',()=>{
 assert.equal(parseTrigRoute('#trigonometry/2').path,'trigonometry/2/start');
 assert.equal(parseTrigRoute('#trigonometry/2/unknown').path,'trigonometry/2/start');
 assert.equal(parseTrigRoute('#trigonometry/99/start').path,'trigonometry');
 assert.equal(parseTrigRoute('#vectorFunctions'),null);
 assert.equal(setTopic(JSON.stringify({items:[{id:trigTasks[0].id}]})),'trigonometry');
 const html=renderPointOverview({earnedPoints:7,pointOverview:[{topic:'trigonometry',points:7,solved:2}]});
 assert.match(html,/href="#trigonometry"/);assert.match(html,/7 point/);assert.equal((html.match(/Endnu ikke implementeret/g)||[]).length,2);
});

test('Server bank rewards accept new task versions and require checked or submitted answers',()=>{
 const task=trigTasks.find(t=>t.id==='trig2.isolate');
 const session={mode:'training',status:'active',seed:'trig-reward',items:[{id:task.id,version:1}],index:0,answers:{[task.id]:{a:'0,5'}},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),minutes:10,timer:false};
 assert.equal(bankSessionReward(session).points,0);
 session.checked[task.id]=true;assert.equal(bankSessionReward(session).points,2);
 session.answers[task.id].a='999';assert.equal(bankSessionReward(session).points,0);
 session.answers[task.id].a='0,5';session.mode='exam';session.checked={};session.status='submitted';assert.equal(bankSessionReward(session).points,2);
});
