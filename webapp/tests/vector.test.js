import test from 'node:test';
import assert from 'node:assert/strict';
import {mathMLFunction} from './integration-mathml.js';
import {vectorContent} from '../vector-content.js';
import {vectorTasks} from '../tasks/bank/vector.js';
import {vectorPre,vectorMini,vectorFinal} from '../vector-exercises.js';
import {vectorLessonTasks,vectorRequired} from '../vector-lesson.js';
import {vectorModules,vectorGoals} from '../vector-plan.js';
import {vectorPages,parseVectorRoute} from '../vector-routes.js';
import {plotCurves} from '../vector-math.js';
import {instantiate,bank} from '../tasks/bank/index.js';
import {gradePart,gradeTask,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<=e,`${a} versus ${b}`);
const get=id=>vectorTasks.find(t=>t.id==='vf1.'+id);
const answer=(id,part)=>Number(get(id).parts.find(p=>p.id===part).answer);
// Evaluate the actual rendered coordinate columns using an independent parser.
const rendered=id=>[...get(id).prompt.matchAll(/<mtd>(.*?)<\/mtd>/g)].slice(0,2).map(m=>mathMLFunction('<math>'+m[1]+'</math>'));
const at=(id,t,extra={})=>rendered(id).map(f=>f(0,{t,...extra}));
test('position, membership, axis roots and model constants are independently verified',()=>{
 assert.deepEqual(at('position',2),[5,3]);near(answer('position','x'),5);near(answer('position','y'),3);
 assert.deepEqual(at('point',1),[5,2]);assert.equal(get('point').parts[1].answer,'yes');
 assert.deepEqual(at('false-point',-1),[1,0]);assert.equal(get('false-point').parts[0].answer,'no');
 const points=[-4,0].map(t=>at('second-axis',t));assert.deepEqual(points,[[0,-3],[0,1]]);near(answer('second-axis','low'),points[0][1]);near(answer('second-axis','high'),points[1][1]);
 assert.deepEqual([0,-4].map(t=>at('first-axis',t)),[[4,0],[20,0]]);near(answer('first-axis','low'),4);near(answer('first-axis','high'),20);
 assert.deepEqual(at('parameter',1,{a:4}),[0,2]);near(answer('parameter','a'),4);
 // A false first-coordinate candidate is rejected: second coordinate also matters.
 assert.ok([2,-2].every(t=>at('false-point',t)[1]!==0));
});
test('two independent clocks, simultaneous collisions and all double-point coordinates',()=>{
 const a=t=>[t,2],b=u=>[3,u];assert.deepEqual(a(3),b(2));assert.notDeepEqual(a(3),b(3));
 near(answer('crossing','ta'),3);near(answer('crossing','tb'),2);assert.equal(get('crossing').parts.at(-1).answer,'no');
 assert.deepEqual(a(3),[3,3-1]);near(answer('collision','t'),3);assert.equal(get('collision').parts[1].answer,'yes');
 assert.deepEqual(at('double',-1),[2,3]);assert.deepEqual(at('double',2),[2,3]);
 near(answer('double','low'),-1);near(answer('double','high'),2);
 assert.deepEqual(at('cas-check',-1),at('cas-check',2));
 for(const id of ['double','cas-check']){near(answer(id,'x'),2);near(answer(id,'y'),3);}
});
test('elimination and circle formula retain geometry, interval and period',()=>{
 const f=mathMLFunction(get('eliminate').parts[0].options.find(o=>o.id==='right').label);
 for(let j=-20;j<=20;j++){
  const t=j/5,[x,y]=at('eliminate',t);near(f(x,{y:0}),y);
  const [cx,cy]=at('circle',t);near((cx-4)**2+(cy-3)**2,9);
  const p=at('circle',t+Math.PI);near(p[0],cx);near(p[1],cy);
 }
 near(answer('domain','low'),at('domain',0)[0]);near(answer('domain','high'),at('domain',2)[0]);assert.equal(get('domain').parts[2].answer,'no');
 near(answer('circle','cx'),4);near(answer('circle','cy'),3);near(answer('circle','radius'),3);assert.equal(get('circle').parts[3].answer,'pi');
 const chosen=get('circle-model').parts[0].options.find(o=>o.id==='right').label;
 const fs=[...chosen.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(m=>mathMLFunction('<math>'+m[1]+'</math>'));
 for(let t=0;t<=6.3;t+=.13)near((fs[0](0,{t})-2)**2+(fs[1](0,{t})-1)**2,16);
});
test('projectile answers match an independent bisection, including physical interval and rounding',()=>{
 const height=t=>-4.9*t*t+3.3*t+1.1;
 let low=0,high=3;for(let i=0;i<70;i++){let mid=(low+high)/2;if(height(mid)>0)low=mid;else high=mid;}
 const landing=(low+high)/2;near(answer('tennis','time'),landing,1e-12);near(answer('tennis','x'),14.8*landing,1e-10);near(at('tennis',landing)[1],0);
 assert.deepEqual(at('football',4,{k:7.5}),[30,0]);near(answer('football','time'),4);near(answer('football','k'),30/4);
 assert.equal(gradePart(get('tennis').parts[0],'0,92').status,'correct');assert.equal(gradePart(get('tennis').parts[1],'13,59').status,'correct');assert.equal(gradePart(get('tennis').parts[0],'-0,24').status,'incorrect');
});
test('interactive curves are independently checked against their claimed loci',()=>{
 for(let t=-4;t<=2;t+=.1){let [x,y]=plotCurves.parabola.at(t);near(y,x*x-1);}
 for(let t=0;t<=2*Math.PI;t+=.11){let [x,y]=plotCurves.circle.at(t);near((x-2)**2+(y-1)**2,16);}
 assert.deepEqual(plotCurves.loop.at(-1),[2,3]);assert.deepEqual(plotCurves.loop.at(2),[2,3]);
});
test('new bank pack uses the unchanged contract, partial credit, neutral prompts and specific feedback',()=>{
 assert.equal(vectorTasks.length,16);assert.equal(vectorLessonTasks.length,37);assert.equal(vectorRequired.length,30);
 for(const t of vectorTasks){assert.deepEqual(instantiate(t.id,'vector-quality',1),t);assert.ok(t.hints.length>=3);assert.equal(t.module,'vf.1');assert.equal(t.version,1);for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.ok(t.errors.some(e=>e.part===p.id));}assert.doesNotMatch(t.prompt,/brug (nulreglen|andengrad|indsættelsesmetoden)|sæt (første|anden) koordinat/i);}
 const score=gradeTask(get('position'),{x:'5',y:'999'});assert.deepEqual(score.map(r=>r.points),[1,0]);
 assert.match(targetedFeedback(get('false-point'),get('false-point').parts[0],'yes'),/forskellige parametre/);
 assert.match(targetedFeedback(get('false-point'),get('false-point').parts[1],'-1'),/Fortegn/);
 assert.match(targetedFeedback(get('crossing'),get('crossing').parts.at(-1),'yes'),/fysiske tidspunkt/);
 assert.match(targetedFeedback(get('tennis'),get('tennis').parts[0],'-0.24'),/Rodvalg/);
 assert.match(targetedFeedback(get('circle'),get('circle').parts[2],'6'),/Radius/);
 const set=composeSet({topics:['vectorFunctions'],onlyCompleted:true,completed:['vf.1','geo.1','eq.basic','comp.basic'],minutes:400,distribution:{short:30,medium:30,complex:30}});assert.equal(set.tasks.length,16);
 assert.equal(composeSet({topics:['vectorFunctions'],onlyCompleted:true,completed:[]}).tasks.length,0);
 assert.equal(bank.filter(t=>t.topic!=='vectorFunctions').length,281);
});
test('diagnostics, goal matrix and ordered routes keep future sessions planned',()=>{
 assert.equal(vectorPre.length,7);assert.equal(vectorMini.length,8);assert.equal(vectorFinal.length,6);
 assert.deepEqual(vectorModules.map(m=>m.id),['1','2','repetition','3','opsamling']);assert.equal(vectorGoals.length,32);assert.ok(vectorGoals.every(g=>g.length===5));
 assert.equal(parseVectorRoute('#vectorFunctions/1').path,'vectorFunctions/1/start');assert.equal(parseVectorRoute('#vectorFunctions/1/nope').path,'vectorFunctions/1/start');assert.equal(parseVectorRoute('#vectorFunctions/unknown').path,'vectorFunctions');assert.equal(parseVectorRoute('#normalDistribution'),null);
 for(const route of vectorPages)assert.equal(parseVectorRoute('#'+route).path,route);
 for(const id of ['2','repetition','3'])assert.equal(parseVectorRoute('#vectorFunctions/'+id).path,`vectorFunctions/${id}/start`);
});

test('worked intersection uses two independent parameters in its rendered formulas',()=>{
 const text=vectorContent().split('Gennemregnet: når begge koordinater varierer')[1].split('</details>')[0];
 const f=[...text.matchAll(/<mtd>(.*?)<\/mtd>/g)].slice(0,4).map(m=>mathMLFunction('<math>'+m[1]+'</math>'));
 const a=f.slice(0,2).map(g=>g(0,{t:4/5})),b=f.slice(2).map(g=>g(0,{u:3/5}));
 a.forEach((v,i)=>near(v,b[i]));near(a[0],9/5);near(a[1],8/5);
 assert.notDeepEqual(f.slice(2).map(g=>g(0,{u:4/5})),a);
});
