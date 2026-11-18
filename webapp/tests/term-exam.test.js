import test from 'node:test';
import assert from 'node:assert/strict';
import { HOUR, LIMIT, freshTerm, advanceTerm, elapsedTerm, lockedTerm, termParts, autoTermGrade, termGrade, termTotal, termCharacter, validTerm } from '../term-exam-model.js';
test('timer persists wall time, pauses, locks first part exactly at two hours and submits at five',()=>{
 const start=100000;let s=freshTerm();assert.ok(validTerm(s));assert.ok(lockedTerm(s,10,start));
 s=advanceTerm(s,'start',start);assert.equal(lockedTerm(s,16,start),false);
 assert.equal(lockedTerm(s,9,start+2*HOUR-1),false);assert.equal(lockedTerm(s,9,start+2*HOUR),true);
 assert.equal(lockedTerm(s,10,start+2*HOUR),false);
 s=advanceTerm(s,'pause',start+HOUR);assert.equal(elapsedTerm(s,start+10*HOUR),HOUR);assert.ok(lockedTerm(s,10));
 s=advanceTerm(s,'resume',start+10*HOUR);assert.equal(elapsedTerm(JSON.parse(JSON.stringify(s)),start+11*HOUR),2*HOUR);
 s=advanceTerm(s,'tick',start+14*HOUR);assert.equal(s.status,'finished');assert.equal(s.elapsed,LIMIT);
 assert.equal(advanceTerm(s,'start').status,'finished');assert.ok(lockedTerm(s,16));
});
test('all 25 answer keys, notation, tolerance and manual scores',()=>{
 assert.equal(termParts.length,25);let s=freshTerm();
 for(const p of termParts){s.answers[p.id]=p.type==='text'?'Løst på papir':p.type==='formula'?p.accepted[0]:Array.isArray(p.answer)?p.answer.map(String):String(p.answer);const g=autoTermGrade(p,s.answers[p.id]);assert.equal(g.points,p.type==='text'?null:10,p.id);}
 assert.equal(termTotal(s),220);
 for(const p of termParts.filter(p=>p.type==='text'))s.manual[p.id]=10;
 assert.equal(termTotal(s),250);
 const byId=id=>termParts.find(p=>p.id===id);
 assert.equal(autoTermGrade(byId('10.b'),'42,62%').points,10);
 assert.equal(autoTermGrade(byId('12.b'),'6,30').points,10);
 assert.equal(autoTermGrade(byId('12.b'),'6,4').points,0);
 assert.equal(autoTermGrade(byId('7.a'),'y=2(x-1)').points,10);
 assert.equal(autoTermGrade(byId('4.a'),['7','0','1']).points,10);
 assert.equal(autoTermGrade(byId('4.a'),['7','7','1']).points,0);
 assert.equal(autoTermGrade(byId('8.a'),'ln(3x²+1)+C').points,10);
 assert.equal(autoTermGrade(byId('3.b'),'another notation').points,null);
 s.manual['1.a']=7;assert.equal(termGrade(byId('1.a'),s).points,7);assert.equal(termTotal(s),247);
 s.manual['1.a']=0;assert.equal(termTotal(s),240);delete s.manual['1.a'];assert.equal(termTotal(s),250);
 assert.ok(validTerm(s));s.manual['1.a']=11;assert.equal(validTerm(s),false);
});
test('grade thresholds are explicit and include boundary points',()=>{
 for(const [points,grade] of [[0,'−3'],[17,'−3'],[18,'00'],[64,'00'],[65,'02'],[81,'02'],[82,'4'],[121,'4'],[122,'7'],[171,'7'],[172,'10'],[208,'10'],[209,'12'],[250,'12']])assert.equal(termCharacter(points),grade);
});
