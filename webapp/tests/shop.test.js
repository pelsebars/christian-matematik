import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { fixture } from './account-fixture.js';
import { createRouter } from '../server/router.js';

test('Shop: atomic spending, idempotency, ownership, account isolation and vouchers', async () => {
 const f=await fixture(), route=createRouter(f);
 const request=(path,method='GET',body,cookie,origin=f.origin)=>route(new Request(f.origin+path,{method,headers:{origin,'content-type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}));
 const signup=async username=>{const r=await request('/api/auth/sign-up/email','POST',{username,password:'shop-test-password-12345'});assert.equal(r.status,200);return r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');};
 const read=async cookie=>{const r=await request('/api/shop','GET',null,cookie);assert.equal(r.status,200);return r.json();};
 const buy=(cookie,itemId,requestId=randomUUID(),extra={})=>request('/api/shop','POST',{itemId,requestId,...extra},cookie);
 try {
  assert.equal((await request('/api/shop')).status,401);
  const a=await signup('shop_alice'),b=await signup('shop_bob');
  const user=(await (await request('/api/learning','GET',null,a)).json()).user;
  const grant=async(count,prefix)=>f.pool.query(`INSERT INTO learning_completion(user_id,exercise_id,topic,module,label,route) SELECT $1,$2 || n::text,'equations','1','Testopgave','equations' FROM generate_series(1,$3::integer) n`,[user.id,prefix,count]);
  assert.equal((await read(a)).rewardPoints,0);
  assert.equal((await buy(a,'military')).status,409);
  assert.equal((await request('/api/shop','PUT',{action:'activate',skinId:'military'},a)).status,403);
  assert.equal((await buy(a,'unknown')).status,400);
  await grant(100,'initial-');
  const id=randomUUID();
  assert.equal((await buy(a,'military',id,{price:0,rewardPoints:99999,userId:'other'})).status,200);
  assert.equal((await read(a)).rewardPoints,60);
  assert.equal((await buy(a,'military',id)).status,200);
  assert.equal((await buy(a,'terminal',id)).status,409);
  assert.equal((await buy(a,'military')).status,409);
  assert.equal((await read(a)).purchases.length,1);
  assert.equal((await request('/api/shop','POST',{itemId:'terminal',requestId:randomUUID()},a,'https://evil.example')).status,403);
  const activated=await request('/api/shop','PUT',{action:'activate',skinId:'military'},a);assert.equal(activated.status,200);
  assert.equal((await (await request('/api/learning','GET',null,a)).json()).activeSkin,'military');
  // Both items are affordable separately; together they exceed the balance.
  const concurrent=await Promise.all([buy(a,'terminal'),buy(a,'machine')]);
  assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409]);
  const state=await read(a);assert.ok(state.rewardPoints>=0);assert.equal(state.purchases.length,2);
  const persisted=await request('/api/learning','PUT',{namespace:'christian-matematik.shoptest.v1',revision:0,value:{score:99},completions:[{id:'new-earned',topic:'equations',module:'1',label:'Ny løsning',route:'equations'}]},a);
  assert.equal(persisted.status,200);assert.equal((await persisted.json()).rewardPoints,state.rewardPoints+1);
  assert.equal((await (await request('/api/learning','GET',null,a)).json()).completions.length,101);
  await grant(200,'more-');
  const voucherId=randomUUID();const voucher=await buy(a,'aaben-beer',voucherId);assert.equal(voucher.status,200);
  const after=await read(a);assert.equal(after.spentPoints,state.spentPoints+150);assert.equal(after.purchases.find(p=>p.id===voucherId).redeemed_at,null);
  assert.equal((await buy(a,'aaben-beer',voucherId)).status,200);
  assert.equal((await read(a)).rewardPoints,after.rewardPoints);
  assert.equal((await request('/api/shop','PUT',{action:'redeem',purchaseId:voucherId},b)).status,404);
  const redeem=()=>request('/api/shop','PUT',{action:'redeem',purchaseId:voucherId},a);
  assert.equal((await redeem()).status,200);
  const used=await read(a);assert.ok(used.purchases.find(p=>p.id===voucherId).redeemed_at);
  await redeem();assert.equal((await read(a)).rewardPoints,after.rewardPoints);
  assert.equal((await read(b)).rewardPoints,0);assert.equal((await read(b)).purchases.length,0);assert.equal((await read(b)).activeSkin,'default');
  assert.equal((await request('/api/shop','PUT',{action:'activate',skinId:'default'},a)).status,200);
  assert.equal((await read(a)).activeSkin,'default');
 } finally {await f.close();}
});
