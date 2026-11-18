import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { createRouter } from '../server/router.js';
import { TERM_NAMESPACE, freshTerm } from '../term-exam-model.js';
test('exam awards: manual deltas, retries, isolation and immutable submitted answers',async()=>{
 const db=await PGlite.create();
 await db.exec(`CREATE TABLE "user" (id text PRIMARY KEY); INSERT INTO "user" VALUES ('alice'), ('bob');`);
 await db.exec(await readFile(new URL('../server/schema.sql',import.meta.url),'utf8'));
 const query=async(...args)=>{const result=await db.query(...args);return {...result,rowCount:result.affectedRows??result.rows.length};};
 const f={origin:'http://localhost',pool:{query,connect:async()=>({query,release(){}})}},
 route=createRouter({...f,auth:{api:{getSession:async({headers})=>['alice','bob'].includes(headers.get('cookie'))?{user:{id:headers.get('cookie'),username:headers.get('cookie')}}:null}}});
 const req=(path,method='GET',body,cookie='')=>route(new Request(f.origin+path,{method,headers:{origin:f.origin,'content-type':'application/json',cookie},...(body?{body:JSON.stringify(body)}:{})}));
 try {
  const cookie='alice';
  let revision=0;const state={...freshTerm(),status:'finished',elapsed:5000,answers:{'12.b':'wrong','1.a':'22'}};
  const save=async()=>{const r=await req('/api/learning','PUT',{namespace:TERM_NAMESPACE,revision,value:state},cookie);assert.equal(r.status,200,await r.clone().text());const d=await r.json();revision=d.revision;return d.rewardPoints;};
  assert.equal(await save(),10);assert.equal(await save(),10);
  state.manual['1.b']=7;assert.equal(await save(),17);
  state.manual['1.b']=10;assert.equal(await save(),20);
  state.manual['1.b']=3;assert.equal(await save(),13);
  delete state.manual['1.b'];assert.equal(await save(),10);
  const stale=await req('/api/learning','PUT',{namespace:TERM_NAMESPACE,revision:revision-1,value:{...state,manual:{'1.b':10}}},cookie);assert.equal(stale.status,409);
  assert.equal((await(await req('/api/points','GET',null,cookie)).json()).rewardPoints,10);
  const wrong=await req('/api/learning','PUT',{namespace:TERM_NAMESPACE,revision,value:{...state,answers:{'1.a':'23'}}},cookie);assert.equal(wrong.status,400);
  assert.equal((await req('/api/learning','PUT',{namespace:TERM_NAMESPACE,revision,value:{...state,manual:{'1.a':11}}},cookie)).status,400);
  assert.equal((await req('/api/learning','PUT',{namespace:'christian-matematik.fake',revision:0,value:{},completions:[{id:'term:august2026:1.a',topic:'termExam',module:'Exam',label:'Exam',route:'termExam'}]},cookie)).status,400);
  const cb='bob';
  const other=await(await req('/api/learning','GET',null,cb)).json();assert.equal(other.rewardPoints,0);assert.equal(other.states.length,0);
 }finally{await db.close();}
});
