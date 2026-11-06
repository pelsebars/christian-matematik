import test from 'node:test';
import assert from 'node:assert/strict';
import {mathMLFunction} from './integration-mathml.js';
import {vectorMeasureTasks} from '../tasks/bank/vector-measure.js';
import {measureLessonTasks,measureRequired} from '../vector-measure-lesson.js';
import {measurePre,measureMini,measureFinal,measureTaskStep} from '../vector-measure-exercises.js';
import {measureModels,measureIntegral,polygonLength,signedDensity,areaFormula,crossVector,coordinateArea} from '../vector-measure-math.js';
import {measurePages,vectorImplemented,parseVectorRoute} from '../vector-routes.js';
import {vectorGoals} from '../vector-plan.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {goals} from '../tasks/catalog.js';
import {gradePart,gradeTask,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const get=id=>measureLessonTasks.find(t=>t.id==='vf3.'+id),answer=(id,p)=>Number(get(id).parts.find(p0=>p0.id===p).answer);
const coords=id=>[...get(id).prompt.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(m=>mathMLFunction(`<math>${m[1]}</math>`)).map(f=>t=>f(0,{t}));
const derivative=(f,t)=>(f(t+1e-5)-f(t-1e-5))/2e-5;
// Independent four-point Gauss-Legendre composite quadrature (not the app's Simpson routine).
function quad(f,a,b,count=1200){const nodes=[-.8611363115940526,-.3399810435848563,.3399810435848563,.8611363115940526],weights=[.3478548451374538,.6521451548625461,.6521451548625461,.3478548451374538],h=(b-a)/count;let sum=0;for(let k=0;k<count;k++){const m=a+h*(k+.5);for(let i=0;i<4;i++)sum+=h/2*weights[i]*f(m+h/2*nodes[i]);}return sum;}
const selected=(id,p)=>{const part=get(id).parts.find(p0=>p0.id===p);return part.options.find(o=>o.id===part.answer).label;};
test('constant speed, backtracking, repeated circles and two clocks have independently verified lengths',()=>{
 for(const [id,speed,a,b] of [['constant',5,1,3],['final.constant',10,0,1.5]]){const [x,y]=coords(id);near(Math.hypot(derivative(x,a),derivative(y,a)),speed);near(answer(id,'speed'),speed);near(answer(id,'length'),speed*(b-a));}
 for(const [id,a,b] of [['backtrack',-1,2],['final.backtrack',-2,1]]){const [x,y]=coords(id);near(answer(id,'length'),a*a+b*b);near(answer(id,'distance'),Math.hypot(x(b)-x(a),y(b)-y(a)));}
 near(mathMLFunction(selected('circle','length'))(0),2*Math.PI);near(mathMLFunction(selected('repeat','length'))(0),8*Math.PI);near(mathMLFunction(selected('repeat','area'))(0),4*Math.PI);
 near(answer('time-scale','l1'),Math.hypot(3,4)*2);near(answer('time-scale','l2'),Math.hypot(6,8));
});
test('source projectile, road and skiers match rendered coordinates, physical endpoints and independent quadrature',()=>{
 const [x,y]=coords('cannon'),T=answer('cannon','time');near(y(T),0);near(x(T),answer('cannon','range'));near(quad(t=>Math.hypot(11.2,8.43-9.82*t),0,T),answer('cannon','length'),1e-9);assert.ok(T>0&&answer('cannon','length')>answer('cannon','range'));
 const [rx,ry]=coords('road');near(Math.hypot(derivative(rx,1),derivative(ry,1)),answer('road','speed'));near(quad(t=>Math.hypot(12,.003*t*t-.2*t+2.4),0,60),answer('road','length'),1e-9);near(Math.hypot(rx(60)-rx(0),ry(60)-ry(0)),answer('road','distance'));
 const s=coords('skiers'),t1=answer('skiers','first'),t2=answer('skiers','second');near(s[1](t1),-300);near(s[3](t2),-300);assert.ok(t2<t1);near(t1*Math.hypot(.4,10),answer('skiers','l1'));near(quad(t=>Math.hypot(-3*Math.sin(3*t)-.5,-.04*t**3),0,t2,2400),answer('skiers','l2'),1e-8);
 const f=coords('final.model'),last=answer('final.model','time');near(f[1](last),0);near(f[0](last),answer('final.model','range'));near(quad(t=>Math.hypot(6,4-2*t),0,last),answer('final.model','length'));
 for(const [g,d] of [[y,t=>8.43-9.82*t],[ry,t=>.003*t*t-.2*t+2.4],[s[2],t=>-3*Math.sin(3*t)-.5],[s[3],t=>-.04*t**3]])for(const t of [.3,1,2])near(derivative(g,t),d(t),1e-6);
});
test('source model car, astroid, ellipse and double-point loop match independent exact and numerical geometry',()=>{
 const c=coords('model-car');for(const t of [.2,1,3,7]){near(c[0](t),Math.sin(t)+2);near(c[1](t),3*Math.sin(t/2)+1);}
 near(quad(t=>Math.hypot(Math.cos(t),1.5*Math.cos(t/2)),0,4*Math.PI),answer('model-car','length'));near(quad(t=>((Math.sin(t)+2)*1.5*Math.cos(t/2)-(3*Math.sin(t/2)+1)*Math.cos(t))/2,0,2*Math.PI),answer('model-car','area'));
 const a=coords('astroid');for(const t of [.3,1,2,4]){near(a[0](t),4*Math.cos(t)**3);near(a[1](t),4*Math.sin(t)**3);}near(4*quad(t=>12*Math.sin(t)*Math.cos(t),0,Math.PI/2),answer('astroid','length'));
 near(quad(t=>Math.hypot(3*Math.sin(t),2*Math.cos(t)),0,2*Math.PI),answer('ellipse','length'));near(mathMLFunction(selected('ellipse','area'))(0),6*Math.PI);
 const p=coords('loop-bounds'),other=answer('loop-bounds','other');near(p[0](-2),answer('loop-bounds','x'));near(p[1](-2),answer('loop-bounds','y'));near(p[0](-2),p[0](other));near(p[1](-2),p[1](other));near(quad(t=>(t**4-4*t**3+12*t*t)/2,-2,other),answer('loop-measure','area'));near(quad(t=>Math.hypot(2*t-2,3*t*t-12),-2,other),answer('loop-measure','length'));near(Math.atan(6)*180/Math.PI,answer('loop-measure','angle'));
});
test('open-curve closure, loop subdivision, radial area and sign reversal obey the stated conditions',()=>{
 near(mathMLFunction(selected('small-loop','area'))(0),quad(t=>(t*t-1)**2/2,-1,1));near(mathMLFunction(selected('closure','area'))(0),quad(t=>t-t*t,0,1));near(-1/3+1/2,1/6);
 const k=answer('radial','k');near(k**5/5+k**3,6);assert.ok(k>0&&k<Math.sqrt(3));near(quad(t=>(t**4+3*t*t)/2,-k,k),6);
 const a=quad(t=>-(Math.sin(t)**3),0,Math.PI),b=quad(t=>-(Math.sin(t)**3),Math.PI,2*Math.PI);near(a,-4/3);near(b,4/3);near(a+b,answer('cancellation','signed'));near(Math.abs(a)+Math.abs(b),mathMLFunction(selected('cancellation','area'))(0));
 near(mathMLFunction(selected('orientation','signed'))(0),-4*Math.PI);near(mathMLFunction(selected('orientation','area'))(0),4*Math.PI);near(mathMLFunction(selected('final.ellipse','signed'))(0),-3*Math.PI);
 assert.match(areaFormula(),/<mfrac><mrow><mn>1<\/mn><\/mrow><mrow><mn>2<\/mn>/);assert.match(areaFormula(),/<mover accent="true">/);assert.match(coordinateArea(),/<mi>x<\/mi>[\s\S]*?<mo>−<\/mo><mi>y<\/mi>/);
 assert.match(crossVector(),/<mover[\s\S]*?<mo>ˆ<\/mo>/);
});
test('interactive models use correct positions, derivatives, signed areas and converging polygon lengths',()=>{
 for(const [id,m] of Object.entries(measureModels)){const cells=[...m.formula.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(v=>mathMLFunction(`<math>${v[1]}</math>`));for(let i=1;i<8;i++){const t=m.range[0]+(m.range[1]-m.range[0])*i/8;cells.forEach((f,j)=>{near(f(0,{t}),m.r(t)[j]);near(derivative(t=>f(0,{t}),t),m.v(t)[j],1e-6);});}
  const [a,b]=m.range,L=quad(t=>Math.hypot(...m.v(t)),a,b),p8=polygonLength(m,a,b,8),p64=polygonLength(m,a,b,64);assert.ok(p8<=p64+1e-8&&p64<=L+1e-8,id);near(measureIntegral(t=>Math.hypot(...m.v(t)),a,b),L,1e-7);near(measureIntegral(t=>signedDensity(m,t),a,b),-measureIntegral(t=>signedDensity(m,t),b,a));
 }
 near(measureIntegral(t=>signedDensity(measureModels.eight,t),0,Math.PI),-4/3);near(measureIntegral(t=>signedDensity(measureModels.car,t),0,2*Math.PI),4);near(measureIntegral(t=>signedDensity(measureModels.loop,t),-2,4),129.6);
 assert.throws(()=>measureIntegral(t=>t,0,1,3));assert.throws(()=>polygonLength(measureModels.circle,0,1,0));
});
test('all new contracts, partial points, rounded answers and specific feedback are valid without changing old versions',()=>{
 assert.equal(vectorMeasureTasks.length,20);assert.equal(measureLessonTasks.length,45);assert.equal(measureRequired.length,36);assert.equal(measurePre.length,9);assert.equal(measureMini.length,9);assert.equal(measureFinal.length,7);assert.equal(new Set(measureLessonTasks.map(t=>t.id)).size,45);
 for(const t of measureLessonTasks)for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct',t.id+':'+p.id);if(p.tolerance)assert.equal(gradePart(p,Number(p.answer).toFixed(4)).status,'correct');}
 for(const t of vectorMeasureTasks){assert.deepEqual(instantiate(t.id,'measure',1),t);assert.ok(t.hints.length>=3);assert.ok(t.parts.every(p=>t.errors.some(e=>e.part===p.id)));assert.doesNotMatch(t.prompt,/brug (Pythagoras|kædereglen|arealformlen)|integrér (farten|normen)/i);}
 for(const [id] of Object.entries(goals).filter(([,g])=>g.module==='vf.3'))assert.ok(vectorMeasureTasks.some(t=>t.goals.includes(id)),id);
 assert.deepEqual(gradeTask(get('constant'),{speed:'5',length:'15'}).map(p=>p.points),[1,0]);assert.match(targetedFeedback(get('constant'),get('constant').parts[0],'7'),/lagt komponenterne sammen/);assert.match(targetedFeedback(get('backtrack'),get('backtrack').parts[0],'3'),/forskydningens længde/);assert.match(targetedFeedback(get('cancellation'),get('cancellation').parts[1],'zero'),/udligning/);
 for(const t of bank.filter(t=>t.module!=='vf.3')){const old=instantiate(t.id,'retained');assert.deepEqual(instantiate(t.id,'retained',old.version),old);}
});
test('module 3 routes, required controls and catalog filter leave only the recap planned',()=>{
 assert.deepEqual(vectorImplemented,['1','2','repetition','3']);assert.equal(measurePages.length,13);for(const p of measurePages)assert.equal(parseVectorRoute('#'+p).path,p);assert.equal(parseVectorRoute('#vectorFunctions/3/unknown').path,'vectorFunctions/3/start');assert.equal(parseVectorRoute('#vectorFunctions/opsamling').path,'vectorFunctions/opsamling');
 for(const t of measureLessonTasks)assert.ok(measurePages.includes('vectorFunctions/3/'+measureTaskStep(t)),t.id);assert.ok(measureRequired.every(t=>!t.id.includes('.pre.')));
 const set=composeSet({topics:['vectorFunctions'],onlyCompleted:true,completed:['vf.3','vf.1','vf.2','int.3'],minutes:500,distribution:{short:50,medium:50,complex:50}});assert.equal(set.tasks.filter(t=>t.module==='vf.3').length,20);
 for(const g of vectorGoals.filter(g=>/^A1[6-9] /.test(g[0])))assert.doesNotMatch(g.join(' '),/planlagt/);
});
