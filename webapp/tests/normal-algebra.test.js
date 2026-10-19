import test from 'node:test';
import assert from 'node:assert/strict';
import {squareCoefficients,conjugateCoefficients,polynomialBody,squareArea,solveLinearSystem,checkPair,lineSegment,algebraSystems} from '../normal-algebra-math.js';
import {normalAlgebraTasks,algebraSquareTasks,algebraSystemTasks} from '../tasks/bank/normal-algebra.js';
import {algebraLessonTasks} from '../normal-algebra-lesson.js';
import {algebraPre,algebraMini,algebraFinal,algebraTracks,algebraTrackProgress} from '../normal-algebra-exercises.js';
import {normalImplemented,pagesForNormalModule,parseNormalRoute,algebraSteps} from '../normal-routes.js';
import {bank,instantiate} from '../tasks/bank/index.js';
import {goals} from '../tasks/catalog.js';
import {validateTask} from '../tasks/schema.js';
import {gradePart,targetedFeedback} from '../tasks/grading.js';
import {polynomial} from '../tasks/math.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} versus ${b}`);
const value=(coefficients,x)=>coefficients.reduce((sum,c,i)=>sum+c*x**i,0);
const get=id=>normalAlgebraTasks.find(t=>t.id==='b1011.'+id);
const answer=(id,part)=>Number(get(id).parts.find(p=>p.id===part).answer);
test('all three identities hold across signs, zero, coefficients and independent product calculations',()=>{
 for(const a of [-3,-1,0,1,2,4])for(const b of [-4,-1,0,2,5])for(const x of [-7,-2,-.5,0,1,3]){
  for(const sign of [-1,1])near(value(squareCoefficients(a,b,sign),x),(a*x+sign*b)*(a*x+sign*b));
  near(value(conjugateCoefficients(a,b),x),(a*x+b)*(a*x-b));
 }
 assert.throws(()=>squareCoefficients(1,2,0));assert.throws(()=>squareCoefficients(NaN,2));
 assert.match(polynomialBody([-25,0,4]),/<mn>4<\/mn>.*<msup>.*<mo>−<\/mo><mn>25/);
});
test('positive square regions cover the whole figure exactly and reject invalid lengths',()=>{
 for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){const model=squareArea(a,b);near(model.parts.reduce((s,v)=>s+v,0),model.total);near(model.total,(a+b)**2);near(model.parts[1],model.parts[2]);}
 for(const [a,b] of [[0,2],[-1,2],[2,NaN],[Infinity,2]])assert.throws(()=>squareArea(a,b));
});
test('linear systems recover integer and fractional pairs and classify zero or repeated conditions',()=>{
 for(const x of [-3,-.5,0,2,4])for(const y of [-2,0,1/3,3])for(const [a,b,d,e] of [[1,1,2,-1],[2,3,3,-2],[-2,1,3,4],[0,1,1,0]]){
  const rows=[[a,b,a*x+b*y],[d,e,d*x+e*y]],solved=solveLinearSystem(...rows);assert.equal(solved.kind,'one');near(solved.x,x);near(solved.y,y);assert.ok(checkPair(rows,solved.x,solved.y).every(c=>c.fits));
 }
 for(const [rows,kind] of [[[[1,1,5],[2,2,12]],'none'],[[[1,1,5],[2,2,10]],'many'],[[[0,0,0],[0,0,0]],'many'],[[[0,0,0],[0,0,2]],'none'],[[[0,0,0],[1,2,3]],'many'],[[[0,0,1],[1,2,3]],'none']])assert.equal(solveLinearSystem(...rows).kind,kind);
 assert.throws(()=>solveLinearSystem([1,2],[2,3,4]));assert.throws(()=>solveLinearSystem([1,2,NaN],[2,3,4]));
 assert.deepEqual(checkPair([[1,1,5],[2,-1,4]],1,4).map(c=>c.fits),[true,false]);
});
test('plotted lines, including vertical and horizontal lines, satisfy the actual equations',()=>{
 for(const row of [...Object.values(algebraSystems).flatMap(c=>c.rows),[1,0,2],[0,1,3],[1,0,20],[0,0,0],[0,0,1]])for(const [x,y] of lineSegment(row)){near(row[0]*x+row[1]*y,row[2]);assert.ok(x>=-2-1e-10&&x<=7+1e-10&&y>=-2-1e-10&&y<=7+1e-10);}
 assert.deepEqual(lineSegment([1,0,20]),[]);assert.deepEqual(lineSegment([1,0,2]),[[2,-2],[2,7]]);assert.throws(()=>lineSegment([1,1,2],2,-2));
});
test('bank answers and factor choices agree with independently expanded products and original equations',()=>{
 for(const [id,a,b,sign] of [['plus',2,3,1],['minus',3,2,-1]])for(const x of [-3,0,2,7])near(answer(id,'quadratic')*x*x+answer(id,'linear')*x+answer(id,'constant'),(a*x+sign*b)**2);
 for(const x of [-3,0,2,7])near(answer('conjugate','quadratic')*x*x+answer('conjugate','constant'),(2*x+5)*(2*x-5));
 const readChoice=label=>{let body=label.replace(/<msup><mrow>(.*?)<\/mrow><mrow><mn>(\d)<\/mn><\/mrow><\/msup>/g,'($1)^$2');return body.replace(/<\/m[ni]>\s*<m[ni]>/g,'*').replace(/<[^>]*>/g,'').replace(/−/g,'-').replace(/\)\(/g,')*(');};
 for(const [id,expected] of [['factor-plus',[16,8,1]],['factor-minus',[9,-12,4]],['factor-difference',[-25,0,9]]]){
  const p=get(id).parts[0];for(const option of p.options){const coefficients=polynomial(readChoice(option.label));const matches=[-3,-1,0,2,7].every(x=>Math.abs(value(coefficients,x)-value(expected,x))<1e-10);assert.equal(matches,option.id===p.answer,id+':'+option.id);}
 }
 for(const [id,rows] of [['substitution',[[1,1,7],[2,1,11]]],['elimination',[[3,2,16],[3,-2,8]]],['scale',[[2,3,13],[3,-2,0]]],['method',[[2,1,9],[5,-3,6]]],['receipts',[[2,1,95],[1,3,90]]]])for(const [a,b,c] of rows)near(a*answer(id,'x')+b*answer(id,'y'),c);
 near(answer('bridge','mean')-answer('bridge','sd'),40);near(answer('bridge','mean')+2*answer('bridge','sd'),64);
 near(answer('area','first'),(3+2)**2);near(answer('area','second'),(4+2)**2);assert.equal(answer('error','linear'),-8);assert.equal(answer('error','constant'),16);
});
test('two independent mastery paths allow an earned shortcut and retract on changed required answers',()=>{
 const complete=new Set(),status=()=>algebraTrackProgress(t=>complete.has(t.id));assert.ok(status().every(t=>!t.mastered));
 for(const t of algebraTracks[0].pre)complete.add(t.id);assert.equal(status()[0].fast,true);assert.equal(status()[0].mastered,false);
 for(const t of algebraTracks[0].final)complete.add(t.id);assert.equal(status()[0].mastered,true);assert.equal(status()[0].practiceCount,0);assert.equal(status()[1].mastered,false);
 complete.delete(algebraTracks[0].pre[0].id);assert.equal(status()[0].mastered,false);
 for(const t of algebraTracks[0].practice)complete.add(t.id);assert.equal(status()[0].mastered,true);
 for(const t of algebraTracks[1].final)complete.add(t.id);assert.equal(status()[1].mastered,false);
 for(const t of algebraTracks[1].practice)complete.add(t.id);assert.ok(status().every(t=>t.mastered));
 complete.delete(algebraTracks[1].final[0].id);assert.equal(status()[1].mastered,false);assert.equal(status()[0].mastered,true);
});
test('new contract, goals, grading, specific error feedback and old task versions remain valid',()=>{
 assert.equal(algebraLessonTasks.length,43);assert.equal(algebraPre.length,8);assert.equal(algebraMini.length,10);assert.equal(algebraFinal.length,9);assert.equal(algebraSquareTasks.length,8);assert.equal(algebraSystemTasks.length,8);
 for(const task of normalAlgebraTasks){validateTask(task);assert.deepEqual(instantiate(task.id,'algebra-quality'),task);assert.deepEqual(task.prerequisites,[]);assert.ok(task.hints.length>=2);}
 for(const task of algebraLessonTasks)for(const part of task.parts)assert.equal(gradePart(part,part.answer).status,'correct',task.id+':'+part.id);
 for(const [id] of Object.entries(goals).filter(([,g])=>g.module==='norm.repetition'))assert.ok(normalAlgebraTasks.some(t=>t.goals.includes(id)),id);
 const p=get('plus').parts.find(p=>p.id==='linear');assert.match(targetedFeedback(get('plus'),p,'6'),/to blandede/);assert.match(targetedFeedback(get('minus'),get('minus').parts[2],'-4'),/Fortegnsfejl/);
 assert.equal(gradePart(get('plus').parts[0],'(2*x+3)^2').status,'review');
 for(const task of bank.filter(t=>!t.id.startsWith('b1011.'))){const saved=instantiate(task.id,'old-set');assert.deepEqual(instantiate(task.id,'old-set',saved.version),saved);}
});
test('unumbered repetition routes and independent module filter retain the six-session structure',()=>{
 assert.deepEqual(normalImplemented,['1','2','3','repetition','4']);assert.equal(algebraSteps.length,11);
 for(const module of normalImplemented)for(const path of pagesForNormalModule(module))assert.equal(parseNormalRoute('#'+path).path,path);
 assert.equal(parseNormalRoute('#normalDistribution/repetition').path,'normalDistribution/repetition/start');assert.equal(parseNormalRoute('#normalDistribution/repetition/bad').step,'start');assert.equal(parseNormalRoute('#normalDistribution/5').step,'');
 const config={topics:['normalDistribution'],minutes:500,distribution:{short:50,medium:50,complex:50},onlyCompleted:true};
 assert.equal(composeSet({...config,completed:['norm.repetition']}).tasks.length,16);assert.equal(composeSet({...config,completed:['norm.1','norm.2','norm.3']}).tasks.length,43);assert.equal(composeSet({...config,completed:['norm.1','norm.2','norm.3','norm.repetition']}).tasks.length,59);assert.equal(composeSet({...config,onlyCompleted:false}).tasks.length,75);
});
