import test from 'node:test';
import assert from 'node:assert/strict';
import {mathMLFunction} from './integration-mathml.js';
import {vectorRepetitionTasks,monotonyTasks,optimizationTasks} from '../tasks/bank/vector-repetition.js';
import {repetitionLessonTasks} from '../vector-repetition-lesson.js';
import {repetitionTracks,repetitionTrackProgress,repetitionTaskStep} from '../vector-repetition-exercises.js';
import {monotonyModels,optimizationModels,modelCandidates} from '../vector-repetition-math.js';
import {vectorImplemented,repetitionPages,parseVectorRoute} from '../vector-routes.js';
import {vectorGoals} from '../vector-plan.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {goals} from '../tasks/catalog.js';
import {gradePart,gradeTask,targetedFeedback} from '../tasks/grading.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const get=id=>repetitionLessonTasks.find(t=>t.id==='b1213.'+id);
const ans=(id,p)=>Number(get(id).parts.find(v=>v.id===p).answer);
const scalar=(id,name='f',arg='x')=>{const html=get(id).prompt.match(/<math\b[^>]*>[\s\S]*?<\/math>/)[0];return v=>mathMLFunction(html)(v,{[name]:0,[arg]:v});};
const coords=id=>[...get(id).prompt.matchAll(/<mtd>(.*?)<\/mtd>/g)].map(m=>v=>mathMLFunction(`<math>${m[1]}</math>`)(v,{t:v}));
const derivative=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
test('rendered monotony examples, roots and classifications agree with independent values',()=>{
 const f=scalar('flat');near(derivative(f,0),0);assert.ok(derivative(f,-1)>0&&derivative(f,1)>0);assert.equal(get('flat').parts[1].answer,'none');
 const g=scalar('global');for(const v of [-2,-1,1,3])near(g(v),v**3-3*v);
 near(g(ans('global','x')),ans('global','max'));near(Math.min(...[-2,-1,1,3].map(g)),ans('global','min'));
 const cas=scalar('cubic-cas');near(derivative(cas,ans('cubic-cas','x')),0,1e-7);near(cas(ans('cubic-cas','x')),ans('cubic-cas','min'));near(Math.max(...[-2,-Math.SQRT2,0,1].map(cas)),ans('cubic-cas','max'));
 const tank=scalar('tank','V','t');assert.ok(derivative(tank,.5)>0&&derivative(tank,2)<0&&derivative(tank,3.5)>0);near(derivative(tank,ans('tank','first')),0,1e-7);near(derivative(tank,ans('tank','second')),0,1e-7);
 const final=scalar('final.roots');for(const p of ['low','high'])near(derivative(final,ans('final.roots',p)),0,1e-7);
 const last=scalar('final.tank','V','t');near(Math.max(...[0,2,4,5].map(last)),ans('final.tank','max'));near(Math.min(...[0,2,4,5].map(last)),ans('final.tank','min'));near(last(2),last(5));
 const reciprocal=scalar('domain');assert.ok(derivative(reciprocal,1)<0);near(reciprocal(2),ans('domain','min'));assert.ok(reciprocal(.00001)>1e4);
});
test('text constraints, endpoints, vector heights and squared distances recover independent optima',()=>{
 for(const [id,perimeter] of [['rectangle',40],['final.rectangle',24]]){const w=ans(id,'width'),l=ans(id,'length');near(2*w+2*l,perimeter);near(w*l,ans(id,'area'));for(let u=.1;u<perimeter/2;u+=.17)assert.ok(u*(perimeter/2-u)<=ans(id,'area')+1e-8);}
 near(2*ans('fence','x')+ans('fence','parallel'),60);near(ans('fence','x')*ans('fence','parallel'),ans('fence','area'));
 for(const id of ['endpoint','final.endpoint']){const f=scalar(id,'h','t'),end=id==='endpoint'?1:2;near(ans(id,'t'),end);near(f(end),ans(id,'height'));assert.ok(derivative(f,end)>0);}
 for(const id of ['height','final.height']){const [x,y]=coords(id),t=ans(id,'t');near(derivative(y,t),0,1e-7);near(y(t),ans(id,'height'));near(Math.hypot(derivative(x,t),derivative(y,t)),ans(id,'speed'),1e-7);assert.ok(y(t)>y(0)&&y(t)>y(t*2));}
 for(const [id,end] of [['distance',4],['final.distance',6]]){const c=coords(id),d=t=>Math.hypot(...c.map(f=>f(t)));const part=get(id).parts.find(p=>p.id==='min'),root=part.options.find(o=>o.id===part.answer).label;near(d(end/2),mathMLFunction(root)(0));near(d(0),ans(id,'max'));near(d(end),ans(id,'max'));}
});
test('source basketball and hedgehog models use verified coordinates, all global candidates and correct units',()=>{
 const b=coords('basketball'),bt=ans('basketball','t');near(b[1](ans('basketball','end')),0);near(derivative(b[1],bt),0,1e-7);near(b[1](bt),ans('basketball','height'));
 const h=coords('hedgehog'),s=t=>h.reduce((sum,f)=>sum+f(t)**2,0),t=ans('hedgehog','t');near(Math.sqrt(s(2)),ans('hedgehog','after'));near(Math.sqrt(s(t)),ans('hedgehog','distance'));near(s(0),0);near(s(5),0);near(derivative(s,t),0,1e-6);
 // Independent factorisation of S' proves uniqueness: cubic increases to its
 // first turning point, then stays positive to 5. Its sole [0,5] zero is bracketed.
 const equations=[...get('hedgehog').solution.matchAll(/<math\b[^>]*>[\s\S]*?<\/math>/g)].map(m=>m[0]);
 const rhs=html=>mathMLFunction('<math><mrow>'+html.split('<mo>=</mo>')[1].replace(/<\/mrow><\/math>$/,'')+'</mrow></math>');
 const renderedS=rhs(equations[1]),renderedD=rhs(equations[2]);for(const u of [.2,1,1.8,3,4.5]){near(renderedS(0,{t:u}),s(u));near(renderedD(0,{t:u}),derivative(s,u),1e-6);}
 const q=t=>3*t**3-40*t*t+170*t-200,turn=(80-Math.sqrt(280))/18;assert.ok(q(0)<0&&q(turn)>0&&q(5)>0);near(q(t),0);assert.ok(turn>t&&turn<5);assert.ok((80+Math.sqrt(280))/18>5);
 for(let u=0;u<=5;u+=.005)assert.ok(s(u)<=s(t)+1e-8);
});
test('interactive models agree with rendered MathML and compare only the selected interval',()=>{
 for(const m of Object.values(monotonyModels)){const f=v=>mathMLFunction(m.formula)(v,{f:0});for(let x=-1.9;x<2;x+=.19){near(m.f(x),f(x));near(m.d(x),derivative(f,x),1e-7);}}
 const h=optimizationModels.height,f=v=>mathMLFunction(h.formula)(v,{h:0,t:v});for(let t=0;t<=4;t+=.2)near(h.f(t),f(t));
 for(const id of Object.keys(optimizationModels))for(const end of [.5,1,2,3,4]){const c=modelCandidates(id,end),max=Math.max(...c.map(c=>c.value));assert.ok(c.every(c=>c.t>=0&&c.t<=end));for(let t=0;t<=end;t+=.005)assert.ok(optimizationModels[id].f(t)<=max+1e-8);}
 assert.equal(modelCandidates('height',1).length,2);assert.equal(modelCandidates('height',4).length,3);assert.throws(()=>modelCandidates('height',5));assert.throws(()=>modelCandidates('unknown',2));
});
test('two tracks independently earn and retract shortcuts and active mastery',()=>{
 const done=new Set(),status=()=>repetitionTrackProgress(t=>done.has(t.id));const [a,b]=repetitionTracks;
 assert.ok(status().every(t=>!t.mastered&&!t.fast));for(const t of a.pre)done.add(t.id);assert.equal(status()[0].fast,true);assert.equal(status()[0].mastered,false);
 for(const t of a.final)done.add(t.id);assert.equal(status()[0].mastered,true);assert.equal(status()[1].mastered,false);assert.equal(status()[0].practiceCount,0);
 done.delete(a.pre[0].id);assert.equal(status()[0].mastered,false);for(const t of a.practice)done.add(t.id);assert.equal(status()[0].mastered,true);
 for(const t of b.final)done.add(t.id);assert.equal(status()[1].mastered,false);for(const t of b.practice)done.add(t.id);assert.ok(status().every(t=>t.mastered));done.delete(b.final[0].id);assert.equal(status()[1].mastered,false);assert.equal(status()[0].mastered,true);
});
test('versioned bank, partial credit, goal coverage, routes and old task versions are preserved',()=>{
 assert.equal(vectorRepetitionTasks.length,16);assert.equal(monotonyTasks.length,8);assert.equal(optimizationTasks.length,8);assert.equal(repetitionLessonTasks.length,40);assert.equal(new Set(repetitionLessonTasks.map(t=>t.id)).size,40);
 for(const t of repetitionLessonTasks){assert.ok(repetitionPages.includes('vectorFunctions/repetition/'+repetitionTaskStep(t)),t.id);for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct',t.id+':'+p.id);}
 for(const t of vectorRepetitionTasks){assert.deepEqual(instantiate(t.id,'repetition',1),t);assert.equal(t.module,'vf.repetition');assert.ok(t.hints.length>=3);assert.ok(t.parts.every(p=>t.errors.some(e=>e.part===p.id)));assert.doesNotMatch(t.prompt,/brug (potensreglen|nulreglen|Pythagoras)|sæt .*afledte.*nul/i);}
 for(const [id] of Object.entries(goals).filter(([,g])=>g.module==='vf.repetition'))assert.ok(vectorRepetitionTasks.some(t=>t.goals.includes(id)),id);
 const t=get('height');assert.deepEqual(gradeTask(t,{t:'2',height:'12',speed:'0'}).map(p=>p.points),[1,1,0]);
 const s=get('square-distance'),p=s.parts[0];assert.match(targetedFeedback(s,p,'sum-coords'),/lagt koordinaterne sammen/);assert.match(targetedFeedback(s,p,'root'),/selve afstanden/);assert.match(targetedFeedback(get('flat'),get('flat').parts[1],'min'),/skifter ikke fortegn/);
 const set=composeSet({topics:['vectorFunctions'],onlyCompleted:true,completed:['vf.repetition'],minutes:500,distribution:{short:40,medium:40,complex:40}});assert.equal(set.tasks.length,16);
 for(const t of bank.filter(t=>t.module!=='vf.repetition')){const old=instantiate(t.id,'unchanged');assert.deepEqual(instantiate(t.id,'unchanged',old.version),old);}
 assert.deepEqual(vectorImplemented,['1','2','repetition','3','opsamling']);assert.equal(repetitionPages.length,12);for(const path of repetitionPages)assert.equal(parseVectorRoute('#'+path).path,path);assert.equal(parseVectorRoute('#vectorFunctions/repetition/bad').path,'vectorFunctions/repetition/start');
 for(const goal of vectorGoals.filter(g=>/^B12|^B13|^A15 /.test(g[0])))assert.doesNotMatch(goal.join(' '),/planlagt/);
});
