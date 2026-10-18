import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './account-fixture.js';
import { createRouter } from '../server/router.js';

const password = 'en-lang-test-adgangskode';
test('Real PostgreSQL protocol: accounts, sessions, isolation, CSRF, conflict and password changes', async () => {
  const f = await fixture();
  const route = createRouter(f);
  const request = (path, { method = 'GET', body, cookie, origin = f.origin, ip = '192.0.2.1' } = {}) => route(new Request(f.origin + path, { method, headers: { origin, 'content-type': 'application/json', 'x-real-ip': ip, ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) }));
  const cookieFrom = response => response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  try {
    assert.equal((await request('/api/learning')).status, 401);
    const a = await request('/api/auth/sign-up/email', { method: 'POST', body: { username: 'alice', password } });
    assert.equal(a.status, 200, await a.clone().text());
    const cookieA = cookieFrom(a); assert.ok(cookieA); assert.match(a.headers.get('set-cookie'), /httponly/i);
    const b = await request('/api/auth/sign-up/email', { method: 'POST', body: { username: 'bob', password }, ip: '192.0.2.2' });
    assert.equal(b.status, 200, await b.clone().text()); const cookieB = cookieFrom(b);
    const payload = { namespace: 'christian-matematik.lessons.v1', value: { exercise1: { correct: true } }, revision: 0, completions: [{ id: 'exercise1-v1', topic: 'equations', module: 'Ligninger', label: 'Opgave 1', route: 'equations' }] };
    assert.equal((await request('/api/learning', { method:'PUT', cookie:cookieA, body:payload, origin:'https://evil.example' })).status, 403);
    assert.equal((await request('/api/learning', { method:'PUT', cookie:cookieA, body:payload })).status, 200);
    assert.equal((await request('/api/learning', { method:'PUT', cookie:cookieA, body:payload })).status, 409);
    const stateA = await (await request('/api/learning', { cookie:cookieA })).json();
    const stateB = await (await request('/api/learning', { cookie:cookieB })).json();
    assert.equal(stateA.completions.length,1); assert.equal(stateB.completions.length,0); assert.equal(stateB.states.length,0);
    assert.equal((await request('/api/learning', { method:'PUT', cookie:cookieB, body:{ ...payload, userId:stateA.user.id, completions:[] } })).status,200);
    assert.equal((await (await request('/api/learning', { cookie:cookieA })).json()).states[0].revision,1);
    assert.equal((await request('/api/learning', { method:'PUT', cookie:cookieA, body:{ ...payload, revision:1, value:{exercise1:{correct:false}} } })).status,200);
    assert.equal((await (await request('/api/learning', { cookie:cookieA })).json()).completions.length,1);
    assert.equal((await request('/api/auth/sign-in/username', {method:'POST',body:{username:'alice',password:'forkert'},ip:'192.0.2.3'})).status,401);
    const login = await request('/api/auth/sign-in/username', {method:'POST',body:{username:'alice',password},ip:'192.0.2.3'});
    assert.equal(login.status,200); const cookieA2=cookieFrom(login);
    const changed = await request('/api/auth/change-password', {method:'POST',cookie:cookieA,body:{currentPassword:password,newPassword:'en-helt-ny-adgangskode',revokeOtherSessions:true}});
    assert.equal(changed.status,200,await changed.clone().text());
    assert.equal((await request('/api/learning',{cookie:cookieA2})).status,401);
    assert.equal((await request('/api/auth/sign-out',{method:'POST',cookie:cookieB,body:{}})).status,200);
    assert.equal((await request('/api/learning',{cookie:cookieB})).status,401);
    const rows = await f.pool.query('SELECT password FROM account');
    assert.ok(rows.rows.every(row=>row.password && row.password!==password && row.password.length>80));
    for(let i=0;i<10;i++) await request('/api/auth/sign-in/username',{method:'POST',ip:'192.0.2.99',body:{username:'nobody',password:'wrong-password'}});
    assert.equal((await request('/api/auth/sign-in/username',{method:'POST',ip:'192.0.2.99',body:{username:'nobody',password}})).status,429);
    assert.equal((await request('/api/auth/delete-user',{method:'POST',cookie:cookieA,body:{}})).status,404);
  } finally { await f.close(); }
});
