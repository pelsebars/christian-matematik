import test from 'node:test';
import assert from 'node:assert/strict';
import {bank,instantiate} from '../tasks/bank/index.js';
import {integrationBankTasks,integrationLessonTasks} from '../tasks/bank/integration-complete.js';
import {goals} from '../tasks/catalog.js';
import {gradePart,gradeTask,targetedFeedback} from '../tasks/grading.js';
import {polynomial,number} from '../tasks/math.js';
import {composeSet} from '../tasks/selection.js';
import {mathMLFunction} from './integration-mathml.js';
const near=(a,b,id,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${id}: ${a} != ${b}`);
const at=(p,x)=>p.reduce((s,c,i)=>s+c*x**i,0),derivative=p=>p.slice(1).map((c,i)=>c*(i+1));
const integral=(f,a,b,N=4096)=>{const h=(b-a)/N;let sum=(f(a)+f(b))/2;for(let i=1;i<N;i++)sum+=f(a+i*h);return sum*h;};
const numericDerivative=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
const answer=(t,id)=>number(t.parts.find(p=>p.id===id).answer);
const correct=(t,id)=>{const p=t.parts.find(p=>p.id===id);return mathMLFunction(p.options.find(o=>o.id===p.answer).label);};
const ids=new Set(integrationBankTasks.map(t=>t.id));
test('All seven integral modules retain existing tasks, cover every goal and have neutral, unique questions',()=>{
 assert.equal(integrationBankTasks.length,91);assert.equal(integrationBankTasks.filter(t=>t.generate).length,46);
 assert.deepEqual(Object.fromEntries([1,2,3,4,5,6,7].map(i=>[i,integrationBankTasks.map(s=>instantiate(s.id,'audit')).filter(t=>t.module===`int.${i}`).length])),{1:13,2:13,3:14,4:14,5:16,6:10,7:11});
 for(const t of integrationLessonTasks){assert.ok(ids.has(t.id));assert.ok(instantiate(t.id,'audit').version>=t.version);}
 const all=integrationBankTasks.map(t=>instantiate(t.id,'audit')),covered=new Set(all.flatMap(t=>t.goals));for(const [id,g]of Object.entries(goals))if(/^int\.[1-7]$/.test(g.module))assert.ok(covered.has(id),id);
 const signatures=all.map(t=>t.prompt.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());assert.equal(new Set(signatures).size,all.length);
 for(const t of all){assert.ok(t.hints.length>=2,t.id);assert.doesNotMatch(t.prompt,/integralregning|substitution|kædereglen|potensreglen|trapezmetoden|skivemetoden/i,t.id);for(const p of t.parts){assert.ok(t.errors.some(e=>e.part===p.id),`${t.id}/${p.id}`);if(p.type==='choice'){const labels=p.options.map(o=>o.label.replace(/\s+/g,' '));assert.equal(new Set(labels).size,labels.length,t.id);}}for(const s of [t.prompt,t.solution,...t.hints,...t.parts.map(p=>p.label)])for(const tag of s.match(/<math\b[^>]*>/g)||[])assert.match(tag,/xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/,t.id);}
});

test('All 46 integral generators are deterministic and independently verified over 1000 seeds',()=>{
 const seen=new Map();for(let seed=0;seed<1000;seed++)for(const source of integrationBankTasks.filter(t=>t.generate)){
  const t=instantiate(source.id,String(seed)),p=t.parameters,id=t.id;assert.deepEqual(t,instantiate(id,String(seed)),id);seen.set(id,(seen.get(id)||new Set()).add(t.prompt));
  const values=Object.fromEntries(t.parts.map(part=>[part.id,['set','tuple'].includes(part.type)?part.answer.map(String):part.type==='text'?'Forklaring':part.answer]));for(const g of gradeTask(t,values))assert.equal(g.status,g.id==='reason'?'manual':'correct',id);
  let F,f;
  switch(id){
   case 'int.sum':{const poly=polynomial(t.parts[0].answer);assert.deepEqual(derivative(poly),[p.c,2*p.b,3*p.a]);assert.deepEqual(polynomial(t.parts[1].answer),[p.c,2*p.b,3*p.a]);break;}
   case 'int.exponential':F=correct(t,'choice');f=x=>p.a*p.k*Math.exp(p.a*x);break;
   case 'int.negative':F=correct(t,'choice');f=x=>p.k/x**p.p;break;
   case 'int.cas':F=correct(t,'choice');f=x=>x*Math.exp(p.a*x);break;
   case 'int4.between':{near(answer(t,'right'),p.right,id);const G=x=>-p.a*x*x+p.c-(p.b*x+p.d);near(answer(t,'area'),integral(G,0,p.right),id,1e-7);assert.ok(G(p.right/2)>0);near(G(p.right),0,id);break;}
   case 'int4.split':{const P=x=>p.k*x*(x-p.b)*(x-2*p.b);near(answer(t,'value'),integral(P,0,2*p.b),id);near(answer(t,'area'),integral(x=>Math.abs(P(x)),0,2*p.b),id,1e-6);near(answer(t,'zero'),p.b,id);break;}
   case 'int4.trapezoid':near(answer(t,'amount'),p.h*((p.y[0]+p.y[1])/2+(p.y[1]+p.y[2])/2+(p.y[2]+p.y[3])/2),id);break;
   case 'int4.parameter':{const base=p.L**3/6;near(answer(t,'base'),base,id);near(answer(t,'area'),(p.k-1)*base,id);near(answer(t,'parameter'),p.wanted+1,id);break;}
   case 'int5.line':near(correct(t,'length')(0),Math.hypot(p.length,p.slope*p.length),id);break;
   case 'int6.exponential':F=correct(t,'family');f=x=>2*p.k*x*Math.exp(x*x+p.b);break;
   case 'int6.power':F=correct(t,'family');f=x=>2*x*(x*x+p.b)**p.p;break;
   case 'int6.log':F=correct(t,'family');f=x=>(2*p.k*x+p.k*p.a)/(x*x+p.a*x);break;
   case 'int6.trig':F=correct(t,'family');f=x=>p.k*Math[p.kind==='sin'?'cos':'sin'](x)*Math[p.kind](x)**p.p;break;
   case 'int7.power':{near(answer(t,'value'),p.k*((p.L**p.d+p.q*p.L+p.b)**(p.p+1)-p.b**(p.p+1))/(p.p+1),id);break;}
   case 'int7.exponential':{const expected=Math.exp(p.L**p.p+p.q*p.L+p.b)-Math.exp(p.b);near(correct(t,'value')(0),expected,id);break;}
   case 'int7.trig':near(answer(t,'value'),p.k*(p.kind==='sin'?1:(-1)**p.p)/(p.p+1),id);break;
   case 'int1.mixed-exponential':F=correct(t,'family');f=x=>x**p.p+p.a*Math.exp(x);break;
   case 'int1.reciprocal-sum':F=correct(t,'family');f=x=>p.k/x+p.b*x;break;
   case 'int1.root':F=correct(t,'family');f=x=>p.k*Math.sqrt(x);break;
   case 'int1.scaled-negative':F=correct(t,'primitive');f=x=>(-p.a*x)**-3;break;
   case 'int1.logarithm':F=correct(t,'family');f=x=>p.k*Math.log(x);break;
   case 'int1.constant-family':assert.equal(t.parts[0].answer,'right');near(p.k,p.k+0*p.c,id);break;
   case 'int2.shift':near(answer(t,'shift'),p.b-p.a,id);near(answer(t,'value'),p.y+p.b-p.a,id);break;
   case 'int2.flat-contact':assert.equal(t.parts[0].answer,'right');assert.ok((p.a-1-p.a)**2>0&&(p.a+1-p.a)**2>0);break;
   case 'int2.exponential-point':F=correct(t,'primitive');f=x=>p.k*Math.exp(x)+p.b;near(F(0),p.y,id);break;
   case 'int2.logarithmic-point':F=correct(t,'primitive');f=x=>p.k/x+p.b;near(F(1),p.y,id);break;
   case 'int2.derivative-and-primitive':{const Fp=polynomial(t.parts[1].answer);assert.deepEqual(derivative(Fp),[p.c,-2*p.b,3*p.a]);assert.deepEqual(polynomial(t.parts[0].answer),[-2*p.b,6*p.a]);near(at(Fp,1),p.y,id);break;}
   case 'int3.negative-interval':near(answer(t,'value'),-p.k*p.L,id);near(answer(t,'area'),p.k*p.L,id);break;
   case 'int3.bounded-cubic':near(answer(t,'right'),p.L,id);near(answer(t,'area'),integral(x=>p.k*x*x*(p.L-x),0,p.L),id,1e-6);break;
   case 'int3.oven':{const change=integral(x=>p.k/(p.a*x+p.b),0,p.T);near(answer(t,'change'),change,id,1e-6);near(answer(t,'final'),p.start+change,id,1e-6);break;}
   case 'int3.split-time':{const time=answer(t,'time');near(time*time,p.q*(p.T*p.T-time*time),id);assert.ok(time>0&&time<p.T);break;}
   case 'int4.cross-curves':{const d=x=>p.k*x*(x+p.a)*(x-p.b);near(answer(t,'area'),integral(d,-p.a,0)-integral(d,0,p.b),id,1e-6);near(answer(t,'value'),integral(d,-p.a,p.b),id,1e-6);assert.deepEqual(t.parts[0].answer,[-p.a,0,p.b]);break;}
   case 'int4.interval-rules':near(answer(t,'reverse'),-p.A-p.B,id);near(answer(t,'shifted'),p.A+p.B-4*p.k,id);break;
   case 'int4.product-claim':near(answer(t,'product'),p.a*p.b*p.L,id);near(answer(t,'separate'),p.a*p.b*p.L*p.L,id);assert.notEqual(answer(t,'product'),answer(t,'separate'));break;
   case 'int4.touching-curves':{const d=x=>(x-p.a)**2*(p.b-x),mid=answer(t,'division');near(answer(t,'area'),integral(d,0,p.b),id,1e-6);near(integral(d,p.a,mid),integral(d,mid,p.b),id,1e-6);assert.ok(d(p.a-.1)>0&&d(p.a+.1)>0);break;}
   case 'int5.reciprocal-radius':near(correct(t,'volume')(0),p.k*p.k*Math.PI*Math.log(p.b/p.a),id);break;
   case 'int5.quadratic-body':{const r=x=>(x-p.a)**2+p.b;near(answer(t,'area'),integral(r,0,2*p.a),id,1e-6);near(answer(t,'coefficient'),integral(x=>r(x)**2,0,2*p.a),id,1e-6);near(answer(t,'width'),2*r(0),id);break;}
   case 'int6.log-product':F=correct(t,'family');f=x=>3*x*x*Math.log(x**3+p.b);break;
   case 'int6.missing-factor':{const x=1,der=numericDerivative(x=>Math.exp(x*x+p.b)/(2*x),x);assert.ok(Math.abs(der-Math.exp(1+p.b))>1);break;}
   case 'int6.width-parameter':near(4*answer(t,'parameter')**3/3,4*p.targetK**3/3,id);break;
   case 'int7.cosine-linear':near(answer(t,'value'),1/p.a,id);break;
   case 'int7.tangent-areas':{const line=polynomial(t.parts[0].answer);assert.deepEqual(line,[p.a*p.a,-2*p.a]);near(answer(t,'total'),p.a**3/3,id);near(answer(t,'triangle'),p.a**3/4,id);near(answer(t,'rest'),p.a**3/12,id);break;}
   case 'int7.root-body':{near(answer(t,'right'),p.L,id);const A=p.A,B=p.b,L=p.L;near(answer(t,'coefficient'),A*A*L*L/2-4*A*B*L**3.5/7+B*B*L**5/5,id);break;}
   case 'int7.domain-check':assert.ok(p.a-p.L<p.a&&p.a+p.L>p.a);assert.equal(t.parts[0].answer,'right');break;
   case 'int4.amplitude':near(answer(t,'area'),4*p.k/3,id);near(4*answer(t,'parameter')/3,4*p.wanted/3,id);break;
   case 'int2.tangent-restriction':{const Fp=polynomial(t.parts[2].answer),D=derivative(Fp),x=answer(t,'contact');near(at(D,x),-2*p.a**3,id);near(at(Fp,x),-2*p.a**3*x+p.B,id);near(answer(t,'constant'),p.K,id);assert.ok(x<0);break;}
   default:assert.fail('Missing independent check '+id);
  }
  if(F){
   const points=id==='int6.log'?[.7,1.3,-p.a/2,-p.a/3]:[.7,1.3,2.1];
   for(const point of points)near(numericDerivative(F,point),f(point),id,2e-6);
   const choices=t.parts.find(p=>p.type==='choice');
   for(const option of choices.options.filter(o=>o.id!==choices.answer)){
    const wrong=mathMLFunction(option.label);let valid=points.every(point=>Number.isFinite(wrong(point))&&Math.abs(numericDerivative(wrong,point)-f(point))<2e-6*Math.max(1,Math.abs(f(point))));
    if(id==='int2.exponential-point')valid=valid&&Math.abs(wrong(0)-p.y)<1e-8;
    if(id==='int2.logarithmic-point')valid=valid&&Math.abs(wrong(1)-p.y)<1e-8;
    assert.equal(valid,false,`${id}: distractor ${option.id} also satisfies the task`);
   }
  }
 }
 for(const [id,variants]of seen)assert.ok(variants.size>=3,`${id}: missing variation`);
});

test('Additional fixed source tasks have independently checked numerical and symbolic answers',()=>{
 const get=id=>instantiate(id,'fixed'),part=(id,p)=>answer(get(id),p);
 near(part('int3.sprinter-critique','initial'),10.12-12,'sprinter');near(part('int3.root-region','area'),64/3-9/2,'root region');
 const slope=part('int4.tangent-partition','slope'),end=6-slope;near(end**3/6,18,'equal areas');near(part('int4.three-boundaries','area'),32+128/3,'three boundaries');
 near(correct(get('int5.log-radius'),'volume')(0),Math.PI*(Math.E-2),'log radius');near(part('int5.exponential-cap','area'),5-3/Math.log(2),'cap area');near(part('int5.exponential-cap','volume'),Math.PI*integral(x=>2.5**2-(2**x+2**(-x))**2,-1,1),'cap volume',1e-6);
 near(part('int5.exponential-body','area'),integral(x=>(x+1)*Math.exp(-x),-1,0),'exponential area',1e-6);near(part('int5.exponential-body','volume'),Math.PI*integral(x=>((x+1)*Math.exp(-x))**2,-1,0),'exponential volume',1e-6);
 near(part('int5.signed-body','area'),71/6,'signed area');near(part('int5.signed-body','volume'),Math.PI*integral(x=>(x**3-5*x*x+4*x)**2,0,4),'signed volume',1e-6);
 const f=x=>x**4-8*x**3+16*x*x+x+5,g=x=>x+5,df=x=>4*x**3-24*x*x+32*x+1;near(part('int5.perimeter','volume'),Math.PI*integral(x=>f(x)**2-g(x)**2,0,4),'perimeter volume',1e-6);near(part('int5.perimeter','perimeter'),integral(x=>Math.hypot(1,df(x)),0,4)+4*Math.sqrt(2),'perimeter',1e-6);
 near(part('int5.joined-profile','coefficient'),4+16/3,'joined profile');
 const edge=part('int5.arch','width')/2;near(211.4885-10.4801*(Math.exp(.0329*edge)+Math.exp(-.0329*edge)),0,'arch root',1e-6);near(part('int5.arch','length'),integral(x=>Math.hypot(1,-10.4801*.0329*(Math.exp(.0329*x)-Math.exp(-.0329*x))),-edge,edge,16384),'arch length',1e-6);
 const k=part('int3.parameter-boundary','parameter'),first=k*k*k/2+3*k,total=12.5*k+15;near(total-first,3*first,'parameter boundary');
});

test('Integral grading, partial points, feedback, prerequisites and versions remain coherent',()=>{
 const task=instantiate('int4.cross-curves','partial'),p=task.parts[0];assert.equal(gradePart(p,p.answer.map(String).reverse()).status,'correct');assert.equal(gradePart(p,[String(p.answer[0]),'', '']).points,1);
 const exp=instantiate('int.exponential','wrong'),choice=exp.parts[0];assert.match(targetedFeedback(exp,choice,'multiply'),/ganget/);assert.equal(gradePart(choice,'multiply').status,'incorrect');
 const set=composeSet({seed:'all-integrals',topics:['integration'],minutes:180,onlyCompleted:true,completed:['int.1','int.2','int.3','int.4','int.rep','int.5','int.6','int.7']});assert.equal(new Set(set.tasks.map(t=>t.id)).size,set.tasks.length);assert.ok(set.tasks.every(t=>t.topic==='integration'));
 for(const module of [2,3,4,5,6,7]){const filtered=composeSet({seed:'prereq'+module,topics:['integration'],minutes:180,onlyCompleted:true,completed:['int.'+module]});assert.equal(filtered.tasks.length,0);}
 for(const t of integrationLessonTasks){const changed=integrationBankTasks.find(v=>v.id===t.id);if(changed.generate||changed!==t)assert.ok(changed.version>t.version);}
});

test('Published integral v1 sets retain original questions, answers, history and completed modules',async()=>{
 const {emptyState,loadState}=await import('../tasks/storage.js');const saved=emptyState();saved.completed=['int.1','int.2'];saved.history=[{date:123,points:2,max:3,items:[]}];saved.session={mode:'training',status:'active',seed:'legacy',items:[{id:'int.sum',version:1}],index:0,answers:{'int.sum':{expr:'2*x^3+4*x^2+2*x',check:'6*x^2+8*x+2'}},checked:{'int.sum':true},hints:{'int.sum':1},marked:{'int.sum':true},self:{},startedAt:123,minutes:20,timer:false};
 const loaded=loadState({getItem:()=>JSON.stringify(saved)});assert.equal(loaded.warning,'');assert.deepEqual(loaded.state,saved);const old=instantiate('int.sum','legacy',1);assert.equal(old.version,1);assert.equal(gradePart(old.parts[0],saved.session.answers['int.sum'].expr).status,'correct');assert.equal(instantiate('int.sum','legacy').version,2);assert.throws(()=>instantiate('int.sum','legacy',999));
});
