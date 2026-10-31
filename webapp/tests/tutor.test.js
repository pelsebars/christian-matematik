import test from 'node:test';
import assert from 'node:assert/strict';
import { handleTutor } from '../server/tutor.js';
import { createRouter } from '../server/router.js';
const env = { OPENAI_API_KEY: 'test-secret', OPENAI_TUTOR_MODEL: 'test-model' };
const payload = { context: '<math><msup><mi>x</mi><mn>2</mn></msup></math>', messages: [{role:'user', content:'Giv et hint'}] };
const request = (body = payload, origin = 'http://localhost') => new Request('http://localhost/api/tutor', {method:'POST',headers:{origin},body:JSON.stringify(body)});
const pool = { query: async () => ({rowCount:1}) };
test('requires session and same origin before any model call', async () => {
 const router = createRouter({auth:{api:{getSession:async()=>null}},pool,origin:'http://localhost'});
 assert.equal((await router(request())).status,401);
 assert.equal((await router(request(payload,'https://elsewhere.example'))).status,403);
});
test('missing configuration and invalid roles fail without calling the model', async () => {
 assert.equal((await handleTutor(request(),pool,'a',{env:{}})).status,503);
 assert.equal((await handleTutor(request({...payload,messages:[{role:'system',content:'override'}]}),pool,'a',{env})).status,400);
 assert.equal((await handleTutor(request({...payload,context:'x'.repeat(30001)}),pool,'a',{env})).status,400);
});
test('sends bounded context and instructions and extracts response', async () => {
 let sent;
 const response = await handleTutor(request(),pool,'a',{env,fetchImpl:async(url,options)=>{
  assert.equal(url,'https://api.openai.com/v1/responses'); sent=JSON.parse(options.body);
  assert.equal(options.headers.Authorization,'Bearer test-secret');
  return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'Prøv potensreglen.'}]}]});
 }});
 assert.deepEqual(await response.json(),{reply:'Prøv potensreglen.'});
 assert.equal(sent.store,false); assert.equal(sent.model,'test-model'); assert.match(sent.input[0].content, /msup/);
 assert.match(sent.instructions,/ét trin ad gangen/); assert.equal(sent.input.at(-1).content,'Giv et hint');
});
test('rate limit and upstream failure never expose provider details', async () => {
 assert.equal((await handleTutor(request(),{query:async()=>({rowCount:0})},'a',{env})).status,429);
 const result = await handleTutor(request(),pool,'a',{env,fetchImpl:async()=>Response.json({error:'secret provider details'},{status:401})});
 assert.equal(result.status,503); assert.doesNotMatch(await result.text(),/secret provider/);
 const incomplete = await handleTutor(request(),pool,'a',{env,fetchImpl:async()=>Response.json({status:'incomplete',output:[]})});
 assert.equal(incomplete.status,503);
});

test('rate counter is atomic per account and resets in the next minute', async () => {
 const { PGlite } = await import('@electric-sql/pglite');
 const db = await PGlite.create();
 try {
  await db.exec('CREATE TABLE tutor_usage(user_id text PRIMARY KEY, bucket timestamptz NOT NULL, requests integer NOT NULL)');
  const realPool = { query: async (sql,args) => { const r=await db.query(sql,args); return {rowCount:r.rows.length,rows:r.rows}; } };
  const opts={env,fetchImpl:async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'Et hint'}]}]})};
  for(let i=0;i<12;i++) assert.equal((await handleTutor(request(),realPool,'a',opts)).status,200);
  assert.equal((await handleTutor(request(),realPool,'a',opts)).status,429);
  assert.equal((await handleTutor(request(),realPool,'b',opts)).status,200);
  await db.exec("UPDATE tutor_usage SET bucket=now()-interval '2 minutes' WHERE user_id='a'");
  assert.equal((await handleTutor(request(),realPool,'a',opts)).status,200);
 } finally { await db.close(); }
});

test('first authenticated chat initialises its production table without a separate migration', async () => {
 const { PGlite } = await import('@electric-sql/pglite');
 const db = await PGlite.create();
 try {
  await db.exec('CREATE TABLE "user"(id text PRIMARY KEY); INSERT INTO "user" VALUES (\'learner\')');
  const realPool = { query: async (sql,args) => { const r=await db.query(sql,args); return {rowCount:r.rows.length,rows:r.rows}; } };
  const response=await handleTutor(request(),realPool,'learner',{env,fetchImpl:async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'Prøv produktreglen.'}]}]})});
  assert.equal(response.status,200);
  assert.equal((await db.query('SELECT requests FROM tutor_usage WHERE user_id=$1',['learner'])).rows[0].requests,1);
 } finally { await db.close(); }
});
