import test from 'node:test';
import assert from 'node:assert/strict';
import {mathMLFunction} from './integration-mathml.js';
import {vectorDynamicsTasks} from '../tasks/bank/vector-dynamics.js';
import {dynamicsModels,vectorLength,vectorAngle,lineAngle} from '../vector-dynamics-math.js';
import {dynamicsPre,dynamicsMini,dynamicsFinal} from '../vector-dynamics-exercises.js';
import {dynamicsLessonTasks,dynamicsRequired} from '../vector-dynamics-lesson.js';
import {dynamicsContent} from '../vector-dynamics-content.js';
import {dynamicsPages,vectorPages,parseVectorRoute,vectorImplemented} from '../vector-routes.js';
import {vectorGoals} from '../vector-plan.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {gradePart,gradeTask,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol,`${a} versus ${b}`);
const get=id=>vectorDynamicsTasks.find(t=>t.id==='vf2.'+id);
const answer=(id,part)=>Number(get(id).parts.find(p=>p.id===part).answer);
const columns=html=>[...html.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(m=>mathMLFunction('<math>'+m[1]+'</math>'));
const coords=id=>columns(get(id).prompt);
const at=(id,t,extra={})=>coords(id).slice(0,2).map(f=>f(0,{t,...extra}));
const diff=(f,t,h=1e-5)=>(f(t+h)-f(t-h))/(2*h);
const diff2=(f,t,h=1e-3)=>(f(t+h)-2*f(t)+f(t-h))/(h*h);
const velocity=(id,t)=>coords(id).slice(0,2).map(f=>diff(u=>f(0,{t:u}),t));
test('component differentiation agrees with independently evaluated rendered functions',()=>{
 const chosen=get('derivative').parts[0].options.find(o=>o.id==='right');const v=columns(chosen.label);
 for(const t of [-2,-1,.2,1,2])v.forEach((f,i)=>near(f(0,{t}),velocity('derivative',t)[i],1e-7));
 near(answer('velocity','vx'),velocity('velocity',1)[0]);near(answer('velocity','vy'),velocity('velocity',1)[1]);
 coords('velocity').forEach((f,i)=>near(answer('velocity',i===0?'ax':'ay'),diff2(t=>f(0,{t}),1),1e-6));
 const motion=velocity('motion',1);near(motion[0],3);near(motion[1],2);near(answer('motion','ay'),-2);
 const speed=mathMLFunction(get('motion').parts[2].options.find(o=>o.id==='root').label)(0);near(speed,Math.hypot(...motion),1e-8);
 assert.equal(get('motion').parts.at(-1).answer,'up');
});
test('tangent and axis criteria check position, direction, all candidates and nonzero velocity',()=>{
 const p=at('tangent',2),v=velocity('tangent',2);near(answer('tangent','px'),p[0]);near(answer('tangent','py'),p[1]);near(answer('tangent','m'),v[1]/v[0],1e-8);near(answer('tangent','m')*p[0]+answer('tangent','b'),p[1]);
 const t=answer('vertical','t');assert.deepEqual(at('vertical',t),[-3,0]);near(velocity('vertical',t)[0],0);near(velocity('vertical',t)[1],1);
 assert.equal(get('vertical').parts.at(-1).answer,'vertical');
 const roots=['low','middle','high'].map(p=>answer('horizontal',p));assert.deepEqual(roots,[0,2,4]);
 for(const t of roots){const v=velocity('horizontal',t);near(v[1],0,1e-7);assert.ok(Math.abs(v[0])>1);}
 assert.deepEqual(dynamicsModels.zero.v(0),[0,0]);near(answer('zero','speed'),0);assert.equal(get('zero').parts[1].answer,'investigate');
 near(answer('parameter','k'),16);assert.deepEqual(at('parameter',4,{k:16}).slice(1),[5]);
 const raw=coords('parameter');near(raw[0](0,{t:4,k:16}),0);near(diff(t=>raw[0](0,{t,k:16}),4),0,1e-8);near(diff(t=>raw[1](0,{t}),4),6,1e-8);
});
test('angles use independent dot-product references and distinguish tangent lines from directions',()=>{
 const reference=(a,b)=>Math.acos(a.reduce((s,v,i)=>s+v*b[i],0)/Math.hypot(...a)/Math.hypot(...b))*180/Math.PI;
 for(const [a,b] of [[[3,0],[-3,3]],[[1,0],[0,1]],[[2,1],[3,-4]],[[-2,6],[2,-2]],[[0,-3],[9,3]]]){
  near(vectorAngle(a,b),reference(a,b));near(lineAngle(a,b),Math.min(reference(a,b),180-reference(a,b)));
 }
 near(vectorAngle([1,0],[-1,0]),180);near(lineAngle([1,0],[-1,0]),0);near(vectorAngle([1e200,0],[0,1e200]),90);
 for(const bad of [[0,0],[NaN,1],[Infinity,0]]){assert.throws(()=>vectorAngle(bad,[1,0]),RangeError);assert.throws(()=>lineAngle([1,0],bad),RangeError);}
 assert.throws(()=>vectorLength([1]),RangeError);
 near(answer('angles','vectors'),135);near(answer('angles','lines'),45);
 const u=velocity('double-angle',-1),v=velocity('double-angle',1),angle=reference(u,v);near(answer('double-angle','vectors'),angle,1e-7);near(answer('double-angle','lines'),180-angle,1e-7);
});
test('double-point velocities and tangent slope belong to two distinct parameters at one point',()=>{
 assert.deepEqual(at('double',-1),[2,3]);assert.deepEqual(at('double',2),[2,3]);
 const v1=velocity('double',-1),v2=velocity('double',2);
 for(const [id,value] of [['v1x',v1[0]],['v1y',v1[1]],['v2x',v2[0]],['v2y',v2[1]]])near(answer('double',id),value,1e-8);
 near(answer('double','slope'),v2[1]/v2[0]);assert.equal(get('double').parts[4].answer,'vertical');
 assert.deepEqual(at('double-angle',-1),[-3,1]);assert.deepEqual(at('double-angle',1),[-3,1]);
});
test('circle, projectile, loop and zero-vector visualisations match independent finite differences',()=>{
 for(const model of Object.values(dynamicsModels)){
  for(let i=1;i<20;i++){
   const t=model.range[0]+(model.range[1]-model.range[0])*i/20;
   for(let j=0;j<2;j++){near(model.v(t)[j],diff(u=>model.r(u)[j],t),1e-7);near(model.a(t)[j],diff2(u=>model.r(u)[j],t),2e-5);}
  }
 }
 for(let t=0;t<6.3;t+=.2){const m=dynamicsModels.circle;near(vectorLength(m.v(t)),3);near(m.v(t).reduce((s,v,i)=>s+v*m.a(t)[i],0),0);}
 const task=get('circle'),chosenV=columns(task.parts[0].options.find(o=>o.id==='right').label),chosenA=columns(task.parts[1].options.find(o=>o.id==='inward').label);
 for(let j=0;j<2;j++){near(chosenV[j](0),dynamicsModels.circle.v(Math.PI/4)[j]);near(chosenA[j](0),dynamicsModels.circle.a(Math.PI/4)[j]);}
 near(answer('circle','speed'),3);assert.equal(task.parts[3].answer,'direction');
});
test('basketball maximum, passage, units and endpoint maximum match independent calculations',()=>{
 const y=t=>coords('basketball')[1](0,{t});let lo=0,hi=1.4;
 for(let i=0;i<60;i++){const m=(lo+hi)/2;if(diff(y,m)>0)lo=m;else hi=m;}const peak=(lo+hi)/2;
 near(answer('basketball','t'),peak,1e-8);near(answer('basketball','height'),y(peak),1e-10);near(answer('basketball','vx'),4);near(answer('basketball','vy'),0);near(answer('basketball','ay'),-9.82);
 assert.ok(y(peak)>y(0)&&y(peak)>y(1.4));assert.equal(get('basketball').parts.at(-1).answer,'all');
 const time=3.56/4,v=velocity('passage',time);near(answer('passage','t'),time);near(answer('passage','height'),at('passage',time)[1]);near(answer('passage','speed'),Math.hypot(...v),1e-8);near(answer('passage','slope'),v[1]/v[0],1e-8);
 assert.ok(Math.abs(at('passage',time)[1]-3.05)>.0007); // Source ring coordinate is rounded.
 assert.equal(get('passage').parts.at(-1).answer,'down');
 near(answer('interval','t'),2);near(answer('interval','height'),at('interval',2)[1]);assert.ok(velocity('interval',0)[1]>0&&velocity('interval',2)[1]>0);assert.equal(get('interval').parts[2].answer,'boundary');
 near(answer('units','ms'),Math.sqrt(6*6+8*8));near(answer('units','kmh'),answer('units','ms')*3600/1000);
});
test('aircraft model uses hours, checks both curve parameters and rejects simultaneous collision',()=>{
 const f=coords('aircraft');const land=answer('aircraft','landing');near(f[1](0,{t:land}),0);near(land*60,5);
 const v=f.slice(0,2).map(g=>diff(t=>g(0,{t}),.08));near(answer('aircraft','speed'),Math.hypot(...v),1e-7);
 const tr=answer('aircraft','red'),tb=answer('aircraft','blue');assert.ok(tr>=0&&tr<=land&&tb>=0&&tb<=land);
 for(let j=0;j<2;j++){near(f[j](0,{t:tr}),f[j+2](0,{t:tb}),1e-10);near(answer('aircraft',j===0?'x':'y'),f[j](0,{t:tr}));}
 assert.ok(Math.abs(tr-tb)>.01);const same=15/274;near(f[0](0,{t:same}),f[2](0,{t:same}));assert.ok(Math.abs(f[1](0,{t:same})-f[3](0,{t:same}))>.06);
 const other=(289-Math.sqrt(30345))/92;assert.ok((other-2)/70<0);assert.equal(get('aircraft').parts.at(-1).answer,'no');
 // The velocity is km/hour, not km/second. Check actual rendered unit markup.
 assert.match(get('aircraft').solution,/<mtext>km<\/mtext>[\s\S]*?<mtext>h<\/mtext>/);
});
test('dart model uses the same physical time and correct initial direction',()=>{
 const f=coords('dart'),t=8/25;near(answer('dart','time'),t);near(f[0](0,{t}),f[2](0,{t}));
 near(answer('dart','difference'),f[3](0,{t})-f[1](0,{t}));assert.ok(f[1](0,{t})>0&&f[3](0,{t})>0);
 near(answer('dart','angle'),Math.atan2(diff(t=>f[1](0,{t}),0),diff(t=>f[0](0,{t}),0))*180/Math.PI,1e-8);assert.equal(get('dart').parts[3].answer,'no');
});
test('CAS product and chain-rule answers agree with derivatives of rendered coordinates',()=>{
 const selected=get('cas-product').parts[0].options.find(o=>o.id==='right').label,v=columns(selected);
 for(const t of [-1,.2,1,2])v.forEach((f,i)=>near(f(0,{t}),velocity('cas-product',t)[i],1e-5));near(answer('cas-product','vy'),4*Math.exp(3));
 const time=Math.PI/4,p=at('cas-trig',time),der=velocity('cas-trig',time);near(answer('cas-trig','x'),p[0]);near(answer('cas-trig','y'),p[1]);near(answer('cas-trig','vx'),der[0],1e-7);near(answer('cas-trig','vy'),der[1],1e-7);near(answer('cas-trig','m'),der[1]/der[0],1e-7);near(answer('cas-trig','m')*p[0]+answer('cas-trig','b'),p[1]);
});
test('versioned bank pack, partial points, targeted feedback and completion metadata remain independent',()=>{
 assert.equal(vectorDynamicsTasks.length,20);assert.equal(dynamicsPre.length,9);assert.equal(dynamicsMini.length,10);assert.equal(dynamicsFinal.length,7);assert.equal(dynamicsLessonTasks.length,46);assert.equal(dynamicsRequired.length,37);
 for(const t of vectorDynamicsTasks){assert.deepEqual(instantiate(t.id,'dynamics-test',1),t);assert.equal(t.module,'vf.2');assert.ok(t.hints.length>=3);for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct');assert.ok(t.errors.some(e=>e.part===p.id));}assert.doesNotMatch(t.prompt,/brug (potensreglen|kædereglen|produktreglen)|sæt (første|anden) (afledte )?koordinat/i);}
 const r=gradeTask(get('units'),{ms:'10',kmh:'999'});assert.deepEqual(r.map(p=>p.points),[1,0]);
 const fb=(id,part,value)=>targetedFeedback(get(id),get(id).parts.find(p=>p.id===part),value);
 assert.match(fb('motion','speed','sum'),/lagt komponenterne sammen/);assert.match(fb('motion','speed','square'),/farten i anden/);assert.match(fb('tangent','m','4/11'),/byttet komponenterne/);assert.match(fb('angles','vectors','45'),/linjevinkel/);assert.match(fb('zero','tangent','both'),/Nulvektor/);
 assert.equal(composeSet({topics:['vectorFunctions'],onlyCompleted:true,completed:['vf.2','vf.1','diff.1','geo.1'],minutes:400,distribution:{short:30,medium:30,complex:30}}).tasks.length,20);
 assert.equal(bank.length,317);assert.equal(bank.filter(t=>!t.id.startsWith('vf2.')).length,297);
 assert.deepEqual(vectorImplemented,['1','2']);for(const path of [...vectorPages,...dynamicsPages])assert.equal(parseVectorRoute('#'+path).path,path);
 assert.equal(parseVectorRoute('#vectorFunctions/2/unknown').path,'vectorFunctions/2/start');assert.equal(parseVectorRoute('#vectorFunctions/repetition/start').path,'vectorFunctions/repetition/start');
 for(const goal of vectorGoals.filter(g=>/^A1[1-4] |^K2 /.test(g[0])))assert.doesNotMatch(goal.join(' '),/planlagt/);
 assert.doesNotMatch(dynamicsContent(),/data-vector-step="(monotoni|optimering|areal|kurvelaengde)"/);
});
