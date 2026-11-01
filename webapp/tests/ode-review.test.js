import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewTasks} from '../tasks/bank/ode-review.js';
import {reviewLessonTasks} from '../ode-review-lesson.js';
import {reviewTracks,reviewTrackProgress,reviewTaskStep} from '../ode-review-exercises.js';
import {reviewSteps,parseOdeRoute} from '../ode-routes.js';
import {binomialPmf,binomialRange,choose} from '../ode-review-math.js';
import {gradePart} from '../tasks/grading.js';
import {instantiate} from '../tasks/bank/index.js';
import {composeSet} from '../tasks/selection.js';
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const get=id=>reviewTasks.find(t=>t.id==='odeb.'+id),answer=(id,p)=>Number(get(id).parts.find(q=>q.id===p).answer);
test('binomial probabilities independently agree with enumerated Bernoulli sequences, moments and endpoint masses',()=>{
 for(let n=1;n<=8;n++)for(const p of [0,.2,.5,.9,1]){
  const masses=Array(n+1).fill(0);for(let bits=0;bits<2**n;bits++){let successes=0,prob=1;for(let i=0;i<n;i++){const success=(bits>>i)&1;successes+=success;prob*=success?p:1-p;}masses[successes]+=prob;}
  for(let k=0;k<=n;k++)near(binomialPmf(n,p,k),masses[k]);near(masses.reduce((s,v)=>s+v,0),1);
 }
 for(const n of [0,1,10,30,100])for(const p of [0,.05,.3,.5,1]){near(binomialRange(n,p,0,n),1);let mean=0,variance=0;for(let k=0;k<=n;k++){mean+=k*binomialPmf(n,p,k);variance+=(k-n*p)**2*binomialPmf(n,p,k);}near(mean,n*p);near(variance,n*p*(1-p));}
 assert.equal(choose(5,2),10);assert.equal(binomialPmf(10,.3,-1),0);assert.equal(binomialPmf(10,.3,11),0);assert.equal(binomialPmf(10,.3,2.5),0);
});
test('source-independent logarithm and probability task answers, interval bounds and rounding',()=>{
 near(2*Math.exp(.3*answer('log.exponential','time')),10);near(80*Math.exp(-.08*answer('log.decay','time')),40);
 const root=answer('log.extraneous','root');assert.ok(root>3);near(Math.log(root)+Math.log(root-3),Math.log(4));near(Math.log(answer('log.domain','root')-1),Math.log(3));
 near(answer('binomial.exact','probability'),.2048);near(answer('binomial.cumulative','atleast'),1-.9**20);
 near(answer('binomial.interval','probability'),[2,3,4].reduce((s,k)=>s+binomialPmf(12,.25,k),0));near(answer('binomial.quality','probability'),1-.96**30-30*.04*.96**29);
 near(answer('binomial.mean','variance'),8.4);near(answer('binomial.mean','sd')**2,8.4);
 assert.equal(gradePart(get('binomial.cumulative').parts[0],'0,6769').status,'correct');assert.equal(gradePart(get('log.domain').parts[1],'1').status,'incorrect');
});
test('each track needs final checks and either every diagnostic or all practice; editing rolls mastery back independently',()=>{
 const done=new Set(),complete=t=>done.has(t.id);const log=reviewTracks[0],bin=reviewTracks[1];
 log.pre.forEach(t=>done.add(t.id));assert.equal(reviewTrackProgress(complete)[0].mastered,false);
 log.final.forEach(t=>done.add(t.id));assert.equal(reviewTrackProgress(complete)[0].mastered,true);assert.equal(reviewTrackProgress(complete)[1].mastered,false);
 bin.final.forEach(t=>done.add(t.id));assert.equal(reviewTrackProgress(complete)[1].mastered,false);bin.practice.forEach(t=>done.add(t.id));assert.equal(reviewTrackProgress(complete)[1].mastered,true);
 done.delete(log.pre[0].id);assert.equal(reviewTrackProgress(complete)[0].mastered,false);assert.equal(reviewTrackProgress(complete)[1].mastered,true);
 log.practice.forEach(t=>done.add(t.id));assert.ok(reviewTrackProgress(complete).every(t=>t.mastered));done.delete(bin.final[0].id);assert.equal(reviewTrackProgress(complete)[1].mastered,false);
});
test('versioned bank, grading, routes and independent repetition filtering',()=>{
 assert.equal(reviewTasks.length,12);assert.equal(reviewLessonTasks.length,30);for(const track of reviewTracks){assert.equal(track.pre.length,3);assert.equal(track.practice.length,9);assert.equal(track.final.length,3);}
 for(const t of reviewTasks)assert.deepEqual(instantiate(t.id,'review'),t);
 for(const t of reviewLessonTasks){assert.ok(reviewSteps.some(([id])=>id===reviewTaskStep(t)));for(const p of t.parts)assert.equal(gradePart(p,p.answer).status,'correct');}
 assert.equal(parseOdeRoute('#differentialEquations/repetition').step,'start');for(const [id]of reviewSteps)assert.equal(parseOdeRoute('#differentialEquations/repetition/'+id).step,id);
 const set=composeSet({topics:['differentialEquations'],onlyCompleted:true,completed:['ode.repetition'],minutes:200,distribution:{short:20,medium:20,complex:20}});assert.equal(set.tasks.length,12);assert.ok(set.tasks.every(t=>t.module==='ode.repetition'));
});
