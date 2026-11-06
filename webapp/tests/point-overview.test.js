import test from 'node:test';
import assert from 'node:assert/strict';
import { setTopic, pointOverview } from '../server/point-overview.js';
import { bank } from '../tasks/bank/index.js';
import { renderPointOverview } from '../point-overview.js';

test('Set attribution never guesses scores within mixed or missing definitions', () => {
 const a=bank[0], b=bank.find(task=>task.topic!==a.topic);
 assert.equal(setTopic(JSON.stringify({items:[{id:a.id}]})),a.topic);
 for(const definition of [null,'invalid','{}',JSON.stringify({items:[{id:a.id},{id:b.id}]}),JSON.stringify({items:[{id:'removed'}]})]) assert.equal(setTopic(definition),'unallocated');
});
test('Overview sums exact net awards without changing data, preserving fractional and legacy points',async()=>{
 const topic=bank[0].topic;
 const db={query:async(sql,params)=>{
  assert.match(sql,/^SELECT/);assert.deepEqual(params,['alice']);
  if(sql.includes('learning_completion'))return {rows:[{topic,points:2,solved:3}]};
  assert.match(sql,/GREATEST\(0,points-legacy_points\)/);
  return {rows:[{definition:JSON.stringify({items:[{id:bank[0].id}]}),points:2.5},{definition:null,points:4}]};
 }};
 const result=await pointOverview(db,'alice');
 assert.deepEqual(result,[{topic,points:4.5,solved:3},{topic:'unallocated',points:4,solved:0}]);
 const html=renderPointOverview({earnedPoints:8.5,pointOverview:result});
 assert.match(html,/8,5/);assert.match(html,/Blandede sæt og ældre point/);
 assert.equal((html.match(/Endnu ikke implementeret/g)||[]).length,3);
});

test('SQL overview respects account boundaries and offsets historical awards',async()=>{
 const {PGlite}=await import('@electric-sql/pglite');
 const {readFile}=await import('node:fs/promises');
 const db=await PGlite.create();
 try {
  await db.exec('CREATE TABLE "user" (id text PRIMARY KEY); INSERT INTO "user" VALUES (\'a\'),(\'b\');');
  await db.exec(await readFile(new URL('../server/schema.sql',import.meta.url),'utf8'));
  await db.query(`INSERT INTO learning_completion(user_id,exercise_id,topic,module,label,route,points_awarded) VALUES ('a','one','equations','1','One','equations',1),('b','other','equations','1','Other','equations',99)`);
  const task=bank.find(t=>t.topic==='equations');
  await db.query(`INSERT INTO bank_set_reward(user_id,set_id,mode,definition,points,legacy_points) VALUES ('a','set1','training',$1,5.5,1),('a','old','exam',NULL,2,0)`,[JSON.stringify({items:[{id:task.id}]})]);
  const rows=await pointOverview(db,'a');
  assert.deepEqual(rows,[{topic:'equations',solved:1,points:5.5},{topic:'unallocated',solved:0,points:2}]);
  assert.deepEqual(await pointOverview(db,'missing'),[]);
 }finally{await db.close();}
});
