import test from 'node:test';
import assert from 'node:assert/strict';
import {polarTasks} from '../tasks/bank/polar.js';
import {instantiate} from '../tasks/bank/index.js';
import {gradePart} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
import {parsePolarRoute} from '../polar-plan.js';
import {renderPointOverview} from '../point-overview.js';
import {setTopic} from '../server/point-overview.js';
import {bankSessionReward} from '../tasks/rewards.js';
test('Polar exercises can be selected, graded and attributed in the shared bank',()=>{
 assert.equal(polarTasks.length,13);
 for(const t of polarTasks){assert.deepEqual(instantiate(t.id,'polar'),t);for(const p of t.parts){assert.equal(gradePart(p,p.answer.replace('.',',')).status,'correct');assert.equal(gradePart(p,'').status,'unanswered');assert.equal(gradePart(p,p.type==='choice'?'wrong':'999').status,'incorrect');}}
 const set=composeSet({topics:['polarCoordinates'],minutes:120,distribution:{short:5,medium:8,complex:0}});assert.ok(set.tasks.length>0);assert.ok(set.tasks.every(t=>t.topic==='polarCoordinates'));
 assert.equal(setTopic(JSON.stringify({items:[{id:polarTasks[0].id}]})),'polarCoordinates');
 const html=renderPointOverview({earnedPoints:4,pointOverview:[{topic:'polarCoordinates',points:4,solved:2}]});assert.match(html,/href="#polarCoordinates"/);assert.match(html,/4 point/);assert.doesNotMatch(html,/Endnu ikke implementeret/);
 const task=polarTasks[0],session={mode:'training',status:'active',seed:'polar',items:[{id:task.id,version:1}],index:0,answers:{[task.id]:{r:'5'}},checked:{},hints:{},marked:{},self:{},startedAt:Date.now(),minutes:10,timer:false};assert.equal(bankSessionReward(session).points,0);session.checked[task.id]=true;assert.equal(bankSessionReward(session).points,2);
});
test('Inverse answers roundtrip in every quadrant and on the vertical axis',()=>{
 for(const [id,x,y] of [['quadrant',-3,3],['fourth',3,-3],['axis',0,-5],['final-inverse',-4,-4]]){
  const t=polarTasks.find(t=>t.id===`polar1.${id}`),r=Number(t.parts[0].answer),a=Number(t.parts[1].answer)*Math.PI/180;
  assert.ok(Math.abs(r*Math.cos(a)-x)<1e-9);assert.ok(Math.abs(r*Math.sin(a)-y)<1e-9);
 }
 assert.equal(parsePolarRoute('#polarCoordinates/1').path,'polarCoordinates/1/start');assert.equal(parsePolarRoute('#polarCoordinates/1/unknown').step,'start');assert.equal(parsePolarRoute('#polarCoordinates/99').path,'polarCoordinates');assert.equal(parsePolarRoute('#trigonometry'),null);
});
