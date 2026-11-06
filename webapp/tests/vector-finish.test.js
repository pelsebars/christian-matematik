import test from 'node:test';
import assert from 'node:assert/strict';
import {mathMLFunction} from './integration-mathml.js';
import {vectorFinishTasks,finishAreas} from '../tasks/bank/vector-finish.js';
import {vectorFinishLessonTasks,vectorFinishRequired,vectorFinishAreaStatus} from '../vector-finish-lesson.js';
import {finishTaskStep} from '../vector-finish-exercises.js';
import {finishCurve,finishPosition,finishVelocity} from '../vector-finish-graphs.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {gradePart,targetedFeedback} from '../tasks/grading.js';
import {vectorFinishPages,vectorImplemented,parseVectorRoute} from '../vector-routes.js';
import {vectorProgressRows,setVectorProgress} from '../vector-progress.js';
import {renderPointOverview} from '../point-overview.js';
import {goals} from '../tasks/catalog.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`),get=id=>vectorFinishLessonTasks.find(t=>t.id==='vfend.'+id),ans=(id,p)=>Number(get(id).parts.find(p0=>p0.id===p).answer);
const coords=id=>[...get(id).prompt.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(m=>mathMLFunction(`<math>${m[1]}</math>`)).map(f=>t=>f(0,{t,u:t})),derivative=(f,t)=>(f(t+1e-5)-f(t-1e-5))/2e-5;
// Composite midpoint quadrature and bisection are independent of the display code.
function quad(f,a,b,N=160000){let total=0;for(let i=0;i<N;i++)total+=f(a+(i+.5)*(b-a)/N);return total*(b-a)/N;}
function root(f,a,b){for(let i=0;i<100;i++){const c=(a+b)/2;if(f(a)*f(c)<=0)b=c;else a=c;}return(a+b)/2;}
const selected=(id,p)=>{const t=get(id).parts.find(p0=>p0.id===p);return t.options.find(o=>o.id===t.answer).label;};
test('displayed positions, elimination, axis roots, passages and independent clocks are checked in both coordinates',()=>{
 let [x,y]=coords('position');near(x(2),ans('position','x'));near(y(2),ans('position','y'));const f=mathMLFunction('<math>'+selected('position','equation').match(/<mo>=<\/mo>(.*)<\/mrow><\/math>/s)[1]+'</math>');for(const t of [-3,-1,0,2])near(f(x(t)),y(t));
 [x,y]=coords('axes');for(const t of [-3,3])near(x(t),0);near(y(-3),ans('axes','low'));near(y(3),ans('axes','high'));
 [x,y]=coords('passages');for(const t of [-1,ans('passages','other')]){near(x(t),ans('passages','x'));near(y(t),ans('passages','y'));}near((-2)*2+2*2,0);near(ans('passages','angle'),90);
 const c=coords('clocks'),a=ans('clocks','first'),b=ans('clocks','second');near(c[0](a),c[2](b));near(c[1](a),c[3](b));assert.notEqual(a,b);assert.notEqual(c[1](a),c[3](a));
});
test('velocities, acceleration, tangent membership, zero-vector condition and vector/line angles are verified',()=>{
 const [x,y]=coords('tangent'),vx=derivative(x,1),vy=derivative(y,1);near(vx,ans('tangent','vx'));near(vy,ans('tangent','vy'));near(ans('tangent','ax'),2);near(ans('tangent','ay'),0);near(3/2*x(1),y(1));near(vy/vx,1.5);
 near(Math.acos((-3*3)/(3*Math.hypot(3,3)))*180/Math.PI,135);near(180-135,45);const z=coords('zero');near(derivative(z[0],0),0,1e-8);near(derivative(z[1],0),0);near((z[0](.001)-z[0](0))/(z[1](.001)-z[1](0)),.001);
 const s=coords('source-route');near(s[0](2),4);near(s[1](2),4);near(s[0](-2),-4);near(derivative(s[0],2),ans('source-route','vx'));near(derivative(s[1],2),ans('source-route','vy'));near(2*s[0](2)-5*s[1](2)+12,0);near(2*10-5*4,0);near(quad(t=>Math.hypot(3*t*t-2,2*t),0,2),ans('source-route','length'));
});
test('optimization compares all candidates on the actual interval and keeps squared distance distinct',()=>{
 const [x,y]=coords('window');near(y(ans('window','time')),ans('window','height'));assert.ok(y(3)>y(2));assert.ok(6-2*2>0);near(x(2),8);
 const c=coords('stationary');assert.ok(derivative(c[1],-.1)>0&&derivative(c[1],.1)>0);near(c[1](ans('stationary','t')),ans('stationary','height'));
 const r=coords('farthest'),d=t=>Math.hypot(r[0](t),r[1](t)),tmax=root(t=>2*t*t-18*t+37,3,4),tmin=root(t=>2*t*t-18*t+37,5,6);near(tmax,ans('farthest','distance-time'));near(d(tmax),ans('farthest','distance'));for(const t of [0,3,tmin,6])assert.ok(d(tmax)>d(t));near(r[1](3),ans('farthest','height'));assert.notEqual(tmax,ans('farthest','height-time'));
});
test('length, geometric union, signed multiplicity, landing and source circle match independent geometry',()=>{
 const [x,y]=coords('journey');near(ans('journey','length'),4+9);near(Math.hypot(x(3)-x(-2),y(3)-y(-2)),ans('journey','distance'));near(ans('regions','area'),Math.abs(-5)+Math.abs(7));near(ans('regions','signed'),-5+7);near(ans('regions','reverse'),5-7);
 for(const [p,v]of [['length',12*Math.PI],['area',9*Math.PI],['signed',18*Math.PI]])near(mathMLFunction(selected('turns',p))(0),v);
 const c=coords('flight'),T=root(c[1],4,5);near(T,ans('flight','time'));near(c[0](T),ans('flight','range'));near(quad(t=>Math.hypot(5,8-4*t),0,T),ans('flight','length'));assert.ok(ans('flight','length')>ans('flight','range'));
 const s=coords('source-circle');for(const t of [0,.4,1]){near((s[0](t)+2)**2+(s[1](t)-3)**2,25);near(Math.hypot(derivative(s[0],t),derivative(s[1],t)),ans('source-circle','speed'),1e-6);}near(s[0](0),s[0](2*Math.PI/3));near(s[1](0),s[1](2*Math.PI/3));near(mathMLFunction(selected('source-circle','area'))(0),25*Math.PI);
});
test('the method-selection figure uses the displayed model, equal physical quantities and specified closure',()=>{
 const fs=[...finishCurve.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(m=>mathMLFunction(`<math>${m[1]}</math>`));for(const t of [0,.7,1,2,3.8,4]){const p=finishPosition(t),v=finishVelocity(t);for(let j=0;j<2;j++){near(fs[j](0,{t}),p[j]);near(derivative(t=>fs[j](0,{t}),t),v[j]);}}
 near(quad(t=>Math.hypot(...finishVelocity(t)),0,4),11.83154286035678);near(quad(t=>{const [x,y]=finishPosition(t),[dx,dy]=finishVelocity(t);return(x*dy-y*dx)/2;},0,4),-64/3);near(quad(t=>2*(4*t-t*t),0,4),64/3);
});
test('all contracts, rounded answers, area coverage, feedback and old bank versions remain valid',()=>{
 assert.equal(bank.length,493);assert.equal(vectorFinishTasks.length,16);assert.equal(vectorFinishLessonTasks.length,34);assert.equal(vectorFinishRequired.length,28);assert.equal(new Set(vectorFinishLessonTasks.map(t=>t.id)).size,34);
 for(const t of vectorFinishLessonTasks)for(const p of t.parts){assert.equal(gradePart(p,p.answer).status,'correct',t.id+':'+p.id);if(p.tolerance)assert.equal(gradePart(p,Number(p.answer).toFixed(4)).status,'correct');}
 for(const t of vectorFinishTasks){assert.deepEqual(instantiate(t.id,'finish',1),t);assert.ok(t.hints.length>=3);assert.ok(t.parts.every(p=>t.errors.some(e=>e.part===p.id)));assert.doesNotMatch(t.prompt,/brug (Pythagoras|kædereglen|arealformlen)|integrér (farten|normen)/i);}
 assert.equal(vectorFinishAreaStatus(()=>true).length,6);for(const a of vectorFinishAreaStatus(()=>true))assert.ok(a.count===a.total&&a.total>=3);for(const [id]of finishAreas)assert.ok(goals['vfend.'+id]);assert.ok(vectorFinishAreaStatus(()=>false).every(a=>a.count===0));
 for(const [id,p,value,pattern]of [['journey','length','5',/forskydningens længde/],['window','time','3',/uden for/],['regions','area','2',/udligner/],['source-circle','speed','5',/kædefaktoren/]])assert.match(targetedFeedback(get(id),get(id).parts.find(p0=>p0.id===p),value),pattern);
 for(const t of bank.filter(t=>t.module!=='vf.opsamling'))assert.deepEqual(instantiate(t.id,'old',instantiate(t.id,'old').version),instantiate(t.id,'old'));
 const selected=composeSet({topics:['vectorFunctions'],onlyCompleted:true,completed:['vf.1','vf.2','vf.repetition','vf.3','vf.opsamling','int.3','geo.1','diff.1'],minutes:1000,distribution:{short:80,medium:80,complex:80}});assert.equal(selected.tasks.filter(t=>t.module==='vf.opsamling').length,16);
});
test('recap routes and pointshop status use an independent fifth section without changing earned points',()=>{
 assert.deepEqual(vectorImplemented,['1','2','repetition','3','opsamling']);assert.equal(vectorFinishPages.length,8);for(const p of vectorFinishPages)assert.equal(parseVectorRoute('#'+p).path,p);assert.equal(parseVectorRoute('#vectorFunctions/opsamling').path,'vectorFunctions/opsamling/start');for(const t of vectorFinishLessonTasks)assert.ok(vectorFinishPages.includes('vectorFunctions/opsamling/'+finishTaskStep(t)));
 setVectorProgress('3','Gennemført',36,36);setVectorProgress('opsamling','Gennemført',28,28);const state={earnedPoints:123,pointOverview:[{topic:'vectorFunctions',points:12.5,solved:10}],purchases:[{id:'kept'}]},before=structuredClone(state),html=renderPointOverview(state);assert.match(html,/data-point-vector-status="3"[\s\S]*?Gennemført/);assert.match(html,/data-point-vector-status="opsamling"[\s\S]*?28 af 28/);assert.match(html,/12,5 point/);assert.deepEqual(state,before);
 setVectorProgress('opsamling','I gang',27,28);assert.match(renderPointOverview(state),/data-point-vector-status="opsamling"[\s\S]*?I gang/);assert.equal(vectorProgressRows().find(r=>r.id==='3').status,'Gennemført');const copy=vectorProgressRows();copy[0].status='broken';assert.notEqual(vectorProgressRows()[0].status,'broken');setVectorProgress('3','Ikke begyndt',0,36);setVectorProgress('opsamling','Ikke begyndt',0,28);
});
