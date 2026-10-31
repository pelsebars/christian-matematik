import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import { fixture } from './account-fixture.js';
import { createRouter } from '../server/router.js';
import { bank, instantiate } from '../tasks/bank/index.js';
import { emptyState } from '../tasks/storage.js';
import { BANK_NAMESPACE, bankSessionReward } from '../tasks/rewards.js';
import { backfillBankState } from '../server/bank-rewards.js';
import { pointBalance } from '../server/shop.js';
const answer=p=>['tuple','set'].includes(p.type)?p.answer.map(String):String(p.answer);
function makeSession(refs,{mode='training',startedAt=Date.now(),status='active'}={}){
 return {mode,status,seed:'bank-reward-tests',items:refs.map(t=>({id:t.id,version:t.version})),index:0,answers:Object.fromEntries(refs.map(t=>[t.id,Object.fromEntries(t.parts.filter(p=>p.type!=='text').map(p=>[p.id,answer(p)]))])),checked:Object.fromEntries(refs.map(t=>[t.id,true])),hints:{},marked:{},self:{},startedAt,endedAt:startedAt+1000,minutes:30,timer:false};
}
test('Bank awards: full scores, repeats, partial answers, self assessment and legacy upgrade',async()=>{
 const f=await fixture(),route=createRouter(f);
 let revision=0;
 const sessionUser={user:{id:'test-bank-user',username:'bank_tester'}};
 try{
  const signup=await route(new Request(f.origin+'/api/auth/sign-up/email',{method:'POST',headers:{origin:f.origin,'content-type':'application/json','x-real-ip':'192.0.2.60'},body:JSON.stringify({username:'bank_tester',password:'bank-rewards-long-password'})}));assert.equal(signup.status,200);
  const cookie=signup.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
  const read=async()=>{const r=await route(new Request(f.origin+'/api/learning',{headers:{cookie}}));return r.json();};
  const userId=(await read()).user.id;
  const save=async(s,{completions=[],expected=200}={})=>{const r=await route(new Request(f.origin+'/api/learning',{method:'PUT',headers:{origin:f.origin,cookie,'content-type':'application/json'},body:JSON.stringify({namespace:BANK_NAMESPACE,revision,value:{...emptyState(),session:s},completions})}));assert.equal(r.status,expected);const data=await r.json();if(r.ok)revision=data.revision;return data;};
  const task=bank.map(t=>instantiate(t.id,'bank-reward-tests')).find(t=>t.parts.length===1&&t.parts[0].type==='number'&&t.parts[0].points>1);
  const max=task.parts[0].points;
  const s=makeSession([task]);
  s.checked[task.id]=false;
  assert.equal((await save(s)).rewardPoints,0); // Unchecked answers earn nothing.
  s.checked[task.id]=true;
  const completion={id:`bank:${task.id}:v${task.version}`,topic:task.topic,module:'Test',label:'Test',route:'tasks'};
  assert.equal((await save(s,{completions:[completion]})).rewardPoints,max);
  assert.equal((await save(s,{completions:[completion]})).rewardPoints,max); // Retry.
  assert.equal((await read()).completions[0].points_awarded,0); // No extra +1.
  s.status='submitted';assert.equal((await save(s)).rewardPoints,max); // Final submission.
  const next=makeSession([task],{startedAt:s.startedAt+2000});
  assert.equal((await save(next)).rewardPoints,2*max); // Same family, new set.
  const exam=makeSession([task],{mode:'exam',startedAt:s.startedAt+4000});
  assert.equal((await save(exam)).rewardPoints,2*max);
  exam.status='submitted';assert.equal((await save(exam)).rewardPoints,3*max);
  // Mixed written/automatic tasks award only their automatic portion.
  const mixed=bank.map(t=>instantiate(t.id,'bank-reward-tests')).find(t=>t.parts.some(p=>p.type==='text')&&t.parts.some(p=>p.type==='number'||p.type==='choice'));
  const ms=makeSession([mixed],{startedAt:s.startedAt+6000,status:'submitted'});
  const auto=mixed.parts.filter(p=>p.type!=='text').reduce((n,p)=>n+p.points,0);
  const beforeMixed=(await read()).rewardPoints;
  assert.equal((await save(ms)).rewardPoints,beforeMixed+auto);
  ms.self[mixed.id]=Object.fromEntries(mixed.parts.filter(p=>p.type==='text').map(p=>[p.id,p.points]));
  assert.equal((await save(ms)).rewardPoints,beforeMixed+auto);
  // Partial tuple scores remain fractional and reach the balance unchanged.
  const tuple=bank.map(t=>instantiate(t.id,'bank-reward-tests')).find(t=>t.parts.length===1&&['tuple','set'].includes(t.parts[0].type)&&t.parts[0].partial);
  const ps=makeSession([tuple],{startedAt:s.startedAt+8000});
  ps.answers[tuple.id][tuple.parts[0].id][0]='999999';
  const partial=bankSessionReward(ps).points;assert.ok(partial>0);
  const beforePartial=(await read()).rewardPoints;
  assert.equal((await save(ps)).rewardPoints,beforePartial+partial);
  // Another seed cannot mint more points under an already credited set ID.
  const changed={...ps,seed:'another-seed'};
  assert.equal((await save(changed)).rewardPoints,beforePartial+partial);
  // Conflicting writes cannot award points.
  const conflict=await route(new Request(f.origin+'/api/learning',{method:'PUT',headers:{origin:f.origin,cookie,'content-type':'application/json'},body:JSON.stringify({namespace:BANK_NAMESPACE,revision:0,value:{...emptyState(),session:makeSession([task],{startedAt:s.startedAt+10000})}})}));assert.equal(conflict.status,409);
  assert.equal((await read()).rewardPoints,beforePartial+partial);
  // An old one-point award becomes part of (rather than extra to) the full score.
  const old=makeSession([task],{startedAt:s.startedAt-60000,status:'submitted'});
  await f.pool.query('UPDATE learning_completion SET points_awarded=1,first_correct_at=to_timestamp($2::double precision/1000) WHERE user_id=$1',[userId,old.startedAt+500]);
  const oldBefore=await pointBalance(f.pool,userId);
  const client=await f.pool.connect();
  try{await client.query('BEGIN');await backfillBankState(client,userId,{session:old,history:[]});await client.query('COMMIT');}finally{client.release();}
  assert.equal((await read()).rewardPoints,oldBefore.rewardPoints+max-1);
  const afterUpgrade=(await read()).rewardPoints;
  const retry=await f.pool.connect();try{await retry.query('BEGIN');await backfillBankState(retry,userId,{session:old,history:[]});await retry.query('COMMIT');}finally{retry.release();}
  assert.equal((await read()).rewardPoints,afterUpgrade);
  assert.ok((await read()).completions.length>0);
  // Regression for Christian's report: 21/25, seven old one-point awards.
  await f.pool.query('DELETE FROM bank_set_reward WHERE user_id=$1',[userId]);
  await f.pool.query('DELETE FROM learning_completion WHERE user_id=$1',[userId]);
  const candidates=bank.map(t=>instantiate(t.id,'bank-reward-tests')).filter(t=>t.parts.length===1&&t.parts[0].type==='number');
  const seven=candidates.filter(t=>t.parts[0].points===3).slice(0,7);
  const wrong=candidates.find(t=>t.parts[0].points===4);
  const reported=makeSession([...seven,wrong],{startedAt:s.startedAt-200000,status:'submitted'});
  reported.answers[wrong.id][wrong.parts[0].id]='999999';
  assert.equal(bankSessionReward(reported).points,21);
  for(const t of seven)await f.pool.query(`INSERT INTO learning_completion(user_id,exercise_id,topic,module,label,route,points_awarded,first_correct_at) VALUES($1,$2,$3,'Test','Test','tasks',1,to_timestamp($4::double precision/1000))`,[userId,`bank:${t.id}:v${t.version}`,t.topic,reported.startedAt+500]);
  assert.equal((await read()).rewardPoints,7);
  const history={id:reported.startedAt,date:reported.endedAt,mode:'training',points:21,max:25,items:[...seven,wrong].map(t=>({id:t.id,points:t===wrong?0:3,max:t.parts[0].points,self:0,pending:0}))};
  const upgrade=async value=>{const c=await f.pool.connect();try{await c.query('BEGIN');await backfillBankState(c,userId,value);await c.query('COMMIT');}finally{c.release();}};
  await upgrade({session:null,history:[history]});assert.equal((await read()).rewardPoints,21);
  await upgrade({session:reported,history:[history]});assert.equal((await read()).rewardPoints,21);
  await upgrade({session:reported,history:[history]});assert.equal((await read()).rewardPoints,21);
  reported.startedAt+=300000;reported.endedAt+=300000;
  assert.equal((await save(reported)).rewardPoints,42);
  // New UUID-based history must not be credited again by a later upgrade run.
  reported.startedAt+=300000;reported.endedAt+=300000;reported.rewardId=randomUUID();
  assert.equal((await save(reported)).rewardPoints,63);
  await upgrade({session:null,history:[{...history,id:reported.startedAt,date:reported.endedAt,rewardId:reported.rewardId}]});
  assert.equal((await read()).rewardPoints,63);
  const purchase=await route(new Request(f.origin+'/api/shop',{method:'POST',headers:{origin:f.origin,cookie,'content-type':'application/json'},body:JSON.stringify({itemId:'frozen-pizza',requestId:randomUUID()})}));
  assert.equal(purchase.status,200);assert.equal((await purchase.json()).rewardPoints,23);
  assert.equal((await read()).completions.length,7);
 }finally{await f.close();}
});
