import { gradePart } from './tasks/grading.js';
export const TERM_NAMESPACE = 'christian-matematik.termExam.august2026.v1';
export const HOUR = 3600000, LIMIT = 5 * HOUR;
const part = (id, type, answer, labels, solution, extra = {}) => ({ id, task: Number(id.split('.')[0]), type, answer, labels, solution, points: 10, ...extra });
// Answer keys transcribed from the supplied August 2026 solution. No task text.
export const termParts = [
 part('1.a','number',22,['Svar'],'22'),
 part('1.b','formula',null,['Partielt afledet'],'3x²y + 5',{ accepted:['3*x^2*y+5','5+3*x^2*y','3*y*x^2+5'] }),
 part('2.a','tuple',[8.3,10.5],['Fra','Til'],'[8,3; 10,5]'),
 part('3.a','tuple',[0,40,3],['x','y','y′'],'(0; 40; 3)'),
 part('3.b','formula',null,['f(x)'],'70 − 30·e^(−0,1x)',{accepted:['70-30*e^(-0.1*x)','70-30*exp(-0.1*x)']}),
 part('4.a','set',[0,1,7],['Løsning 1','Løsning 2','Løsning 3'],'x = 0, x = 1 eller x = 7'),
 part('5.a','tuple',[-3,0],['x','y'],'(−3; 0)'),
 part('6.a','tuple',[40,51],['x-komponent','y-komponent'],'(40; 51)'),
 part('6.b','number',1,['t'],'t = 1'),
 part('7.a','expression','2*x-2',['y ='],'y = 2x − 2'),
 part('8.a','formula',null,['Stamfunktion inkl. konstant'],'ln(3x² + 1) + k',{accepted:['ln(3*x^2+1)+k','ln(1+3*x^2)+k']}),
 part('9.a','text',null,['Forklaring / henvisning til papir'],'A er F, og B er f. A har vandret tangent dér, hvor B har et nulpunkt, fordi F′ = f.'),
 part('10.a','text',null,['Forklaring / henvisning til graf'],'Punkterne i normalfordelingsplottet ligger tæt på og usystematisk omkring en ret linje.'),
 part('10.b','number',0.426184,['Sandsynlighed (eller procent med %)'],'P(X ≤ 240) ≈ 0,4262 = 42,62 %. Det er andelen med en løbetid på højst 240 minutter.',{tolerance:0.0001}),
 part('11.a','number',65.4349,['Rumfang'],'65,4',{tolerance:0.05}),
 part('12.a','number',2.47,['kg pr. døgn'],'2,47 kg pr. døgn',{tolerance:0.005}),
 part('12.b','number',6.29826,['kg'],'6,30 kg',{tolerance:0.005}),
 part('12.c','number',14.2596,['døgn'],'14,26 døgn',{tolerance:0.005}),
 part('13.a','text',null,['Henvisning til din graf / noter'],'Gennemgå grafen for r(θ) = ln(θ + 1) med løsningsdokumentet. Grafen vurderes manuelt.'),
 part('13.b','number',2.42854,['Areal'],'2,43',{tolerance:0.005}),
 part('14.a','tuple',[2,-3,-25],['x','y','z'],'(2; −3; −25)'),
 part('14.b','number',33.6373,['Længde'],'33,64',{tolerance:0.005}),
 part('15.a','number',-5.38629,['b'],'−5,38629 (eller −5,39)',{tolerance:0.005}),
 part('16.a','vectorExpression',['0.12*x^2-0.6*x+10','0.24*x^2-3.2*x+7.3'],['x′(t)','y′(t)'],'(0,12t² − 0,6t + 10; 0,24t² − 3,2t + 7,3)'),
 part('16.b','number',9.26285,['m/s'],'9,26 m/s',{tolerance:0.005}),
];
export function freshTerm() { return { status:'ready', elapsed:0, runningSince:null, answers:{}, manual:{} }; }
export function elapsedTerm(s, now = Date.now()) {
 return Math.min(LIMIT, Math.max(0, s.elapsed + (s.status === 'running' ? Math.max(0,now - s.runningSince) : 0)));
}
export function lockedTerm(s, task, now = Date.now()) { return s.status !== 'running' || elapsedTerm(s,now) >= (task <= 9 ? 2*HOUR : LIMIT); }
export function advanceTerm(s, action, now = Date.now()) {
 const elapsed = elapsedTerm(s,now);
 if (s.status === 'running' && elapsed >= LIMIT) action = 'finish';
 if (action === 'start' && s.status === 'ready') return {...s,status:'running',runningSince:now};
 if (action === 'pause' && s.status === 'running') return {...s,status:'paused',elapsed,runningSince:null};
 if (action === 'resume' && s.status === 'paused') return {...s,status:'running',runningSince:now};
 if (action === 'finish' && ['running','paused'].includes(s.status)) return {...s,status:'finished',elapsed,runningSince:null,finishedAt:now};
 return s;
}
const canonical = v => String(v).toLowerCase().replace(/−/g,'-').replace(/[·×]/g,'*').replace(/,/g,'.').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\s/g,'').replace(/^(?:f\(x\)|y|f'_x\(x,y\))=/,'').replace(/\+c$/,'+k').replace(/([0-9)xy])\*(?=[xy(e]|ln|exp)/g,'$1');
export function autoTermGrade(p, raw) {
 let value = raw;
 if (p.type === 'formula') {
  if (!String(value || '').trim()) return {points:0,status:'unanswered'};
  return p.accepted.some(a => canonical(a) === canonical(value)) ? {points:10,status:'correct'} : {points:null,status:'review'};
 }
 if (p.type === 'vectorExpression') {
  const results = p.answer.map((answer,i) => gradePart({type:'expression',answer,points:5},String(value?.[i] || '').replace(/t/g,'x')));
  if (results.every(r=>r.status==='correct')) return {points:10,status:'correct'};
  return {points:results.some(r=>r.points===null) ? null : 0,status:results.some(r=>r.points===null)?'review':'incorrect'};
 }
 if (p.id === '10.b' && typeof value === 'string' && value.trim().endsWith('%')) value = String(Number(value.trim().slice(0,-1).replace(',','.'))/100);
 if (p.type === 'expression') value = String(value || '').replace(/^\s*y\s*=/,'');
 return gradePart(p,value);
}
export function termGrade(p,s) {
 const automatic = autoTermGrade(p,s.answers[p.id]);
 const manual = s.manual[p.id];
 return {...automatic, automatic:automatic.points, ...(Number.isInteger(manual) && manual>=0 && manual<=10 ? {points:manual,status:'overridden'} : {})};
}
export function termTotal(s) { return termParts.reduce((sum,p)=>sum+(termGrade(p,s).points || 0),0); }
export function termCharacter(points) { return points>=209?'12':points>=172?'10':points>=122?'7':points>=82?'4':points>=65?'02':points>=18?'00':'−3'; }
export function validTerm(s) {
 return s && ['ready','running','paused','finished'].includes(s.status) && Number.isFinite(s.elapsed) && s.elapsed>=0 && s.elapsed<=LIMIT && (s.status==='running'?Number.isFinite(s.runningSince)&&s.runningSince>0:s.runningSince===null) && s.answers && typeof s.answers==='object' && !Array.isArray(s.answers) && s.manual && typeof s.manual==='object' && !Array.isArray(s.manual) && termParts.every(p=>{
  const a=s.answers[p.id],m=s.manual[p.id];
  return (a===undefined || (p.labels.length>1 ? Array.isArray(a)&&a.length===p.labels.length&&a.every(v=>typeof v==='string'&&v.length<=4000) : typeof a==='string'&&a.length<=4000)) && (m===undefined || Number.isInteger(m)&&m>=0&&m<=10);
 });
}
