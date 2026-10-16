import test from "node:test";
import assert from "node:assert/strict";
import { bank, instantiate } from "../tasks/bank/index.js";
import { composeSet } from "../tasks/selection.js";
import { gradePart, gradeTask } from "../tasks/grading.js";
import {
  polynomial,
  number,
  equivalent,
  expressionMath,
  power,
  n,
  x,
} from "../tasks/math.js";
import { validateTask } from "../tasks/schema.js";
import { loadState, saveState, emptyState } from "../tasks/storage.js";

test("Safe mathematical equivalence, arithmetic, precedence and Unicode", () => {
  for (const [a, b] of [
    ["(2x+1)^2", "4*x^2+4*x+1"],
    ["x(x+3)+x", "x^2+4x"],
    ["−x²+3x", "3*x-x^2"],
    ["-x^2", "-(x^2)"],
    ["(x+1)*(x-1)", "x^2-1"],
  ])
    assert.ok(equivalent(a, b));
  assert.equal(number("1/2"), 0.5);
  assert.equal(number("2,5"), 2.5);
  assert.equal(number("sqrt(25)"), 5);
  assert.equal(number("-2^2"), -4);
  assert.equal(number("(-2)^2"), 4);
  assert.ok(!equivalent("2*x+1", "x+2"));
  for (const s of [
    "",
    "1/0",
    "x/x",
    "x^-2",
    "x^99",
    "alert(1)",
    "globalThis",
    "1;window.hacked=true",
    "<img>",
    "sqrt(-1)",
    "2**3",
    "1.2.3",
    "1e999",
    "x".repeat(201),
  ])
    assert.throws(() => polynomial(s));
  assert.match(expressionMath("(x+1)^2"), /<msup>/);
  assert.equal(expressionMath("<script>"), "");
});

test("Scoring handles tolerance, partial roots, order, blanks and uncertain text", () => {
  const p = {
    id: "v",
    type: "tuple",
    answer: [3, 4],
    points: 2,
    partial: true,
  };
  assert.equal(gradePart(p, ["3", "0"]).points, 1);
  assert.equal(gradePart(p, ["3", ""]).points, 1);
  assert.equal(gradePart(p, ["4", "3"]).points, 0);
  assert.equal(
    gradePart({ ...p, type: "set", answer: [2, 3] }, ["3", "2"]).points,
    2,
  );
  assert.equal(
    gradePart({ ...p, type: "set", answer: [2, 3] }, ["2", "2"]).points,
    1,
  );
  assert.equal(
    gradePart(
      { type: "number", answer: "2", points: 3, tolerance: 0.001 },
      "2.0005",
    ).points,
    3,
  );
  assert.equal(
    gradePart({ type: "number", answer: "0", points: 1 }, "").status,
    "unanswered",
  );
  assert.equal(
    gradePart({ type: "number", answer: "2", points: 1 }, "log(2)").points,
    null,
  );
  assert.equal(
    gradePart({ type: "text", points: 3 }, "En forklaring").status,
    "manual",
  );
  const t = instantiate("diff.garden", "test");
  assert.equal(
    gradeTask(t, { reason: "Forklaring" }, { reason: 2 }).at(-1).status,
    "self",
  );
  assert.equal(
    gradeTask(t, { reason: "Forklaring" }, { reason: 4 }).at(-1).points,
    null,
  );
});

test("Every fixed task accepts its verified answer; templates remain valid over 1000 seeds", () => {
  for (const source of bank) {
    const t = instantiate(source.id, "test");
    const answers = Object.fromEntries(
      t.parts.map((p) => [
        p.id,
        ["tuple", "set"].includes(p.type)
          ? p.answer.map(String)
          : p.type === "text"
            ? "Forklaring"
            : String(p.answer),
      ]),
    );
    const result = gradeTask(t, answers);
    result.forEach((g, i) =>
      assert.equal(
        g.points,
        t.parts[i].type === "text" ? null : t.parts[i].points,
        t.id,
      ),
    );
  }
  for (let seed = 0; seed < 1000; seed++) {
    const t = instantiate("eq.balance", String(seed));
    const { a, b, c, root } = t.parameters;
    assert.equal(a * root + b, c);
    assert.ok(a >= 2 && a <= 6 && root >= 1 && root <= 8 && b >= 1 && b <= 9);
    assert.equal(gradeTask(t, { x: String(root) })[0].points, 2);
    assert.deepEqual(t, instantiate(t.id, String(seed)));
  }
});

test("Balanced sets are reproducible, diverse, bounded and filterable", () => {
  const options = { seed: "balanced", minutes: 60 };
  const result = composeSet(options);
  assert.ok(result.tasks.length >= 6 && result.tasks.length <= 12);
  assert.equal(new Set(result.tasks.map((t) => t.topic)).size, 6);
  assert.ok(result.minutes <= 60);
  assert.equal(new Set(result.tasks.map((t) => t.id)).size, result.tasks.length);
  assert.deepEqual(result, composeSet(options));
  assert.ok(composeSet({ ...options, aids: "no" }).tasks.every((t) => !t.aids));
  assert.ok(composeSet({ ...options, aids: "yes" }).tasks.every((t) => t.aids));
  assert.ok(
    composeSet({ ...options, topics: ["quadratic"] }).tasks.every(
      (t) => t.topic === "quadratic",
    ),
  );
  assert.equal(
    composeSet({ ...options, onlyCompleted: true, completed: [] }).tasks.length,
    0,
  );
  const completedEquations = composeSet({
    ...options,
    onlyCompleted: true,
    completed: ["eq.basic"],
  }).tasks;
  assert.equal(completedEquations.length, 10);
  assert.ok(completedEquations.every((task) => task.module === "eq.basic"));
  assert.ok(composeSet({ ...options, difficulty: 3 }).tasks.every(t => t.difficulty === 3));
  assert.ok(composeSet({ ...options, minutes: 6 }).minutes <= 6);
  assert.equal(
    composeSet({
      ...options,
      distribution: { short: 0, medium: 1, complex: 0 },
    }).tasks.length,
    1,
  );
  const short = {
    ...options,
    distribution: { short: 1, medium: 0, complex: 0 },
  };
  const first = composeSet(short).tasks[0];
  const history = [
    { items: Array(10).fill({ id: first.id, points: 2, max: 2 }) },
  ];
  assert.notEqual(composeSet(short, history).tasks[0].id, first.id);
});

test("Invalid task integrations fail with actionable errors", () => {
  const t = instantiate("geo.walk", "schema");
  for (const patch of [
    { goals: ["missing"] },
    { version: 0 },
    { aids: "yes" },
    { minutes: -1 },
    { prerequisites: ["missing"] },
    { parts: [{ id: "p", label: "Test", type: "text", points: 2 }] },
    {
      parts: [
        { id: "p", label: "Test", type: "number", answer: "1/0", points: 2 },
      ],
    },
  ])
    assert.throws(() => validateTask({ ...t, ...patch }));
});

test("Local persistence resumes answers, hints, flags and submission; corrupt/versioned data is handled", () => {
  let raw = null;
  const storage = { getItem: () => raw, setItem: (_, v) => (raw = v) };
  const state = emptyState();
  const t = instantiate("eq.balance", "saved");
  state.session = {
    mode: "exam",
    status: "active",
    seed: "saved",
    items: [{ id: t.id, version: 1 }],
    index: 0,
    answers: { [t.id]: { x: "3/2" } },
    hints: {},
    checked: {},
    marked: { [t.id]: true },
    self: {},
    startedAt: 123,
    minutes: 3,
    timer: true,
  };
  assert.ok(saveState(storage, state));
  assert.deepEqual(loadState(storage).state, state);
  state.session.status = "submitted";
  assert.ok(saveState(storage, state));
  assert.equal(loadState(storage).state.session.status, "submitted");
  state.session.items[0].version = 999;
  saveState(storage, state);
  assert.ok(loadState(storage).warning);
  raw = "{";
  assert.ok(loadState(storage).warning);
  assert.equal(
    saveState(
      {
        setItem() {
          throw Error("quota");
        },
      },
      state,
    ),
    false,
  );
});

test("Fixed demonstrations agree with independent mathematical checks", () => {
  const value = (expr, x) =>
    polynomial(expr).reduce((sum, c, i) => sum + c * x ** i, 0);
  const q = instantiate("quad.two-roots", "math");
  assert.equal(q.parts[0].answer, "2");
  for (const root of q.parts[1].answer)
    assert.equal(root ** 2 - 5 * root + 6, 0);
  const comp = instantiate("comp.compose", "math");
  const compositeParameters = comp.parameters;
  for (const x of [-3, 0, 2, 5])
    assert.equal(
      value(comp.parts[0].answer, x),
      (compositeParameters.coefficient * x + compositeParameters.constant) ** 2 +
        compositeParameters.outerConstant,
    );
  const diff = instantiate("diff.product", "math");
  const p = polynomial("x*(x+3)"),
    derivative = p.slice(1).map((c, i) => c * (i + 1));
  assert.deepEqual(polynomial(diff.parts[0].answer), derivative);
  const garden = instantiate("diff.garden", "math");
  for (const x of [1, 2, 5, 9])
    assert.equal(value(garden.parts[0].answer, x), x * (20 - 2 * x));
  const optimum = number(garden.parts[1].answer);
  assert.equal(20 - 4 * optimum, 0);
  assert.equal(
    value(garden.parts[0].answer, optimum),
    number(garden.parts[2].answer),
  );
  for (let i = 1; i < 100; i++)
    assert.ok(value(garden.parts[0].answer, i / 10) <= 50);
  const vector = instantiate("geo.walk", "math");
  assert.deepEqual(vector.parts[0].answer, vector.parameters.delta);
  assert.equal(
    number(vector.parts[1].answer),
    Math.hypot(...vector.parameters.delta),
  );
  const angle = instantiate("geo.angle", "math");
  assert.equal(
    angle.parts[0].answer,
    angle.parameters.dot > 0
      ? "acute"
      : angle.parameters.dot < 0
        ? "obtuse"
        : "right",
  );
  const distance = instantiate("geo.distance", "math");
  const distanceParameters = distance.parameters;
  assert.equal(
    number(distance.parts[0].answer),
    Math.abs(
      distanceParameters.a * distanceParameters.point[0] +
        distanceParameters.b * distanceParameters.point[1] +
        distanceParameters.c,
    ) / distanceParameters.normalLength,
  );
  const circle = instantiate("geo.fountain", "math");
  assert.deepEqual(circle.parts[0].answer, [2, -1]);
  assert.equal(number(circle.parts[1].answer), Math.sqrt(25));
  assert.equal(number(circle.parts[2].answer), 2 + Math.sqrt(25));
  assert.equal((7 - 2) ** 2 + (-1 + 1) ** 2, 25);
});

// Visible grouping is essential: an mrow alone does not draw parentheses.
test('MathML powers visibly group negative and compound bases', () => {
  assert.match(power(n(-5), 2), /<mo>\(<\/mo>/);
  assert.match(power(x + '<mo>−</mo>' + n(2), 2), /<mo>\(<\/mo>/);
  assert.ok(!power(x, 2).includes('<mo>(</mo>'));
});

test('Integral module polynomials satisfy their independently specified derivative and initial condition', () => {
  const differentiate = coefficients => coefficients.slice(1).map((c,i)=>c*(i+1));
  const examples = [
    ['int.polynomial','expr',[0,0,3]],
    ['int.sum','expr',[2,8,6]],
    ['int.motion','position',[2,6]],
  ];
  for(const [id,part,expected] of examples){
    const task=instantiate(id,'independent');
    const coefficients=polynomial(task.parts.find(p=>p.id===part).answer);
    const target=id==='int.sum'?[task.parameters.c,2*task.parameters.b,3*task.parameters.a]:expected;
    assert.deepEqual(differentiate(coefficients),target);
  }
  const motion=instantiate('int.motion','independent');
  const p=polynomial(motion.parts[0].answer);
  assert.equal(p[0],5);
  assert.equal(p.reduce((sum,c,i)=>sum+c*2**i,0),21);
  const check=instantiate('int.check','independent');
  assert.deepEqual(polynomial(check.parts[0].answer),differentiate([5,0,-3,4,0,2]));
  assert.notDeepEqual(polynomial(check.parts[0].answer),[0,-6,8,0,10]);
  for(const id of ['int.polynomial','int.sum']) assert.equal(gradePart(instantiate(id,'a').parts[0], 'x^3+1').status,'incorrect');
});

test('Integral targeted feedback distinguishes arithmetic, integration and initial-value errors', async () => {
  const {targetedFeedback}=await import('../tasks/grading.js');
  const poly=instantiate('int.polynomial','a');
  assert.match(targetedFeedback(poly,poly.parts[0],'3*x^3'),/mangler division/);
  const motion=instantiate('int.motion','a');
  assert.match(targetedFeedback(motion,motion.parts[0],'3*x^2+2*x'),/integrationsregel passer.*begyndelsespositionen/);
  assert.match(targetedFeedback(motion,motion.parts[1],'16'),/ændringen fra starten/);
  assert.equal(gradePart(motion.parts[0],'e^x').status,'review');
  const selected=composeSet({seed:'int',topics:['integration'],minutes:90,onlyCompleted:true,completed:['int.1']}).tasks;assert.ok(selected.length>=7);assert.ok(selected.every(t=>t.module==='int.1'));
  assert.equal(composeSet({seed:'int',topics:['integration'],onlyCompleted:true,completed:['int.2']}).tasks.length,0);
});

test('Integral teaching-session routes normalize invalid links and keep every learning part reachable', async () => {
  const { parseIntegralRoute, integralRoute, integralPages, integralSteps } = await import('../integral-routes.js');
  assert.equal(parseIntegralRoute('#tasks'), null);
  assert.equal(parseIntegralRoute('#integration').path, 'integration');
  assert.equal(parseIntegralRoute('#integration/1').path, 'integration/1/start/1');
  assert.equal(parseIntegralRoute('#integration/1/teori/konstant').path, 'integration/1/teori/konstant');
  assert.equal(parseIntegralRoute('#integration/1/unknown/<invalid>').path, 'integration/1/start/1');
  assert.equal(parseIntegralRoute('#integration/1/oevelser/999').path, 'integration/1/oevelser/1');
  assert.equal(parseIntegralRoute('#integration/repetition').module, 'repetition');
  assert.equal(parseIntegralRoute('#integration/99').path, 'integration');
  assert.equal(parseIntegralRoute('#integration/7/teori').path, 'integration/7/teori/graenser');
  assert.equal(integralRoute('1', 'opsummering'), 'integration/1/opsummering');
  assert.equal(integralSteps.length, 6);
  assert.equal(integralPages.length, 28);
  assert.equal(new Set(integralPages).size, integralPages.length);
  for (const path of integralPages) assert.equal(parseIntegralRoute('#' + path).path, path);
});

test('Module 2 point and tangent answers satisfy independently derived conditions', () => {
 const derivative = p => p.slice(1).map((c,i)=>c*(i+1));
 const at = (p,a) => p.reduce((sum,c,i)=>sum+c*a**i,0);
 const point = instantiate('int2.point','independent');
 const p=polynomial(point.parts[0].answer);
 assert.deepEqual(derivative(p),[3,2]); assert.equal(at(p,1),7);
 const condition=instantiate('int2.condition','independent');
 const c=polynomial(condition.parts.find(p=>p.id==='expr').answer);
 assert.deepEqual(derivative(c),[3,-4,3]);assert.equal(at(c,2),9);
 const tangent=instantiate('int2.tangent','independent');
 const t=polynomial(tangent.parts.find(p=>p.id==='expr').answer);
 const a=number(tangent.parts[0].answer);
 assert.equal(at(derivative(t),a),4);assert.equal(at(t,a),4*a+5);
 const two=instantiate('int2.two-tangencies','independent');
 const family=[0,1,-2,1/3];
 for(const [place,constant] of [['a','c-low'],['b','c-high']]){
  const x0=number(two.parts.find(p=>p.id===place).answer),k=number(two.parts.find(p=>p.id===constant).answer);
  assert.ok(Math.abs(at(derivative(family),x0)-(-2))<1e-12);
  assert.ok(Math.abs(at(family,x0)+k-(-2*x0+1))<1e-12);
 }
 const cart=instantiate('int2.cart','independent'),s=polynomial(cart.parts[0].answer);
 assert.deepEqual(derivative(s),[3,-1]);assert.equal(at(s,1),4.5);assert.equal(at(s,3),6.5);
 assert.ok(at(derivative(s),2)>0 && at(derivative(s),4)<0);
 // CAS log formula derivative and initial value are checked analytically.
 const cas=instantiate('int2.cas-point','independent');assert.equal(cas.parts[0].answer,'right');
 const F=x=>3*x*x+2*x*Math.log(x)-2*x+4;
 const dF=x=>6*x+2*Math.log(x)+2-2;
 assert.equal(F(1),5);for(const v of [0.5,1,2,3])assert.ok(Math.abs(dF(v)-(6*v+2*Math.log(v)))<1e-12);
});

test('Module 2 requires module 1 and has valid direct links and targeted feedback', async () => {
 const {targetedFeedback}=await import('../tasks/grading.js');
 const {parseIntegralRoute,pagesForIntegralModule}=await import('../integral-routes.js');
 const task=instantiate('int2.point','check');
 assert.match(targetedFeedback(task,task.parts[0],'x^2+3*x+7'),/ikke nødvendigvis konstanten/);
 assert.match(targetedFeedback(task,task.parts[0],'x^2+3*x'),/integrationsregel passer/);
 const graph=instantiate('int2.sign','check');assert.match(targetedFeedback(graph,graph.parts[0],'zero'),/ikke grafens højde/);
 const noBase=composeSet({seed:'int2',topics:['integration'],onlyCompleted:true,completed:['int.2'],minutes:180});assert.equal(noBase.tasks.length,0);
 const ready=composeSet({seed:'int2',topics:['integration'],onlyCompleted:true,completed:['int.1','int.2'],minutes:180});assert.ok(ready.tasks.some(t=>t.module==='int.2'));
 assert.equal(parseIntegralRoute('#integration/2').path,'integration/2/start/1');
 assert.equal(parseIntegralRoute('#integration/2/teori/fortegn').path,'integration/2/teori/fortegn');
 assert.equal(pagesForIntegralModule('2').length,28);
 for(const path of pagesForIntegralModule('2'))assert.equal(parseIntegralRoute('#'+path).path,path);
});

test('Definite integrals agree with independent derivative, endpoint, model and area calculations', async () => {
 const at=(p,a)=>p.reduce((sum,c,i)=>sum+c*a**i,0),derivative=p=>p.slice(1).map((c,i)=>c*(i+1));
 const basic=instantiate('int3.basic','independent'),p=polynomial(basic.parts[0].answer);
 assert.deepEqual(derivative(p),[1,0,6]);assert.equal(at(p,1)-at(p,0),3);
 const poly=instantiate('int3.polynomial','independent'),q=polynomial(poly.parts[0].answer);
 assert.deepEqual(derivative(q),[1,0,3]);assert.equal(at(q,2)-at(q,0),10);
 assert.equal(number(instantiate('int3.table','a').parts[0].answer),11-3);
 const signed=instantiate('int3.signed','a');assert.equal(number(signed.parts[0].answer),0);assert.equal(number(signed.parts[1].answer),.5+.5);
 const {areaMeasurements,areaModels}=await import('../integral-definite-lesson.js');
 assert.equal(areaMeasurements(areaModels.cross,0,2,8).value,0);assert.equal(areaMeasurements(areaModels.cross,0,2,8).area,1);
 assert.equal(areaMeasurements(areaModels.positive,2,0,8).value,-4);assert.equal(areaMeasurements(areaModels.positive,2,0,8).area,4);
 const a=areaMeasurements(areaModels.positive,0,2,2),b=areaMeasurements(areaModels.positive,0,2,40);
 assert.ok(Math.abs(b.approximation-b.value)<Math.abs(a.approximation-a.value));
 for(const model of Object.values(areaModels))for(const [lower,upper]of [[-1,2],[2,-1],[1,1]]){
  const r=areaMeasurements(model,lower,upper,8);assert.ok(r.area>=0);assert.ok(Math.abs(r.value)<=r.area+1e-12);
  const reverse=areaMeasurements(model,upper,lower,8);assert.equal(r.value,-reverse.value||0);assert.equal(r.area,reverse.area);
 }
 const rate=t=>20*(1-Math.exp(-t))+.5*t,energy=t=>20*t+20*Math.exp(-t)+t*t/4-20;
 assert.ok(Math.abs(rate(5)-22.37)<.01);assert.ok(Math.abs(energy(10)-205)<.01);
 let lo=0,hi=20;for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(energy(mid)<300)lo=mid;else hi=mid;}
 const task=instantiate('int3.energy','a');assert.ok(Math.abs((lo+hi)/2-number(task.parts.find(p=>p.id==='time').answer))<.01);assert.ok(Math.abs(energy((lo+hi)/2)-300)<1e-10);
 const partition=instantiate('int3.partition','a'),r=polynomial(partition.parts[0].answer),k=number(partition.parts[1].answer);
 assert.equal(at(r,k),92);assert.equal(54*2-2*2**3,92);
 assert.ok(Math.abs(100*Math.log(58/10)-175.8)<.05);
 assert.ok(Math.abs(1.5*(Math.exp(4)-1)+2-82.40)<.01);
});

test('Module 3 routes, prerequisites and feedback distinguish integration from arithmetic and area errors', async () => {
 const {parseIntegralRoute,pagesForIntegralModule}=await import('../integral-routes.js');const {targetedFeedback}=await import('../tasks/grading.js');
 assert.equal(parseIntegralRoute('#integration/3').path,'integration/3/start/1');assert.equal(pagesForIntegralModule('3').length,28);
 for(const path of pagesForIntegralModule('3'))assert.equal(parseIntegralRoute('#'+path).path,path);
 const poly=instantiate('int3.polynomial','a');assert.match(targetedFeedback(poly,poly.parts.find(p=>p.id==='upper'),'6'),/potensregningen/);
 const signed=instantiate('int3.signed','a');assert.match(targetedFeedback(signed,signed.parts.find(p=>p.id==='area'),'0'),/ikke det geometriske areal/);
 const table=instantiate('int3.table','a');assert.match(targetedFeedback(table,table.parts[0],'5'),/oprindelige funktions værdier/);
 const incomplete=composeSet({seed:'int3',topics:['integration'],onlyCompleted:true,completed:['int.3'],minutes:180});assert.equal(incomplete.tasks.length,0);
 const completed=composeSet({seed:'int3',topics:['integration'],onlyCompleted:true,completed:['int.1','int.2','int.3'],minutes:180});assert.ok(completed.tasks.some(t=>t.module==='int.3'));
 assert.ok(instantiate('int3.energy','a').aids);assert.ok(!instantiate('int3.exponential','a').aids);
});

test('Module 4 area, linearity, data and parameter answers agree with independent calculations', async()=>{
 const {betweenModels,betweenMeasurements,trapezoidSum}=await import('../integral-areas-lesson.js');
 const {parseIntegralRoute,pagesForIntegralModule}=await import('../integral-routes.js');
 assert.equal(pagesForIntegralModule('4').length,28);for(const p of pagesForIntegralModule('4'))assert.equal(parseIntegralRoute('#'+p).path,p);
 assert.equal(betweenMeasurements(betweenModels.basic,0,1).area,3);
 const cross=betweenMeasurements(betweenModels.cross,-1,3);assert.ok(Math.abs(cross.area-71/6)<1e-12);assert.ok(Math.abs(cross.value+32/3)<1e-12);assert.deepEqual(cross.segments.map(s=>s.upper),['f','g']);
 const P=t=>t**4/4-2*t**3+4*t*t;assert.equal(P(4)-P(0),0);assert.equal(Math.abs(P(2)-P(0))+Math.abs(P(4)-P(2)),8);
 assert.equal(number(instantiate('int4.table','a').parts[0].answer),(12+1.5)-(7-2.5));
 assert.equal(number(instantiate('int4.rules','a').parts[0].answer),3*4-2*(-1));
 assert.equal(trapezoidSum([{x:0,y:0},{x:1,y:2},{x:2,y:3},{x:3,y:3}]),6.5);
 assert.equal(trapezoidSum([{x:0,y:1},{x:2,y:3},{x:5,y:3}]),13);
 for(const N of [2,4,8,16,32]){const pts=Array.from({length:N+1},(_,i)=>({x:2*i/N,y:(2*i/N)**2}));assert.ok(Math.abs(trapezoidSum(pts)-8/3-4/(3*N*N))<1e-12);}
 assert.ok(Math.abs(.037*22**2+22-number(instantiate('int4.water','a').parts[1].answer))<.01);
 const base=2*4**2-4**3/3;assert.ok(Math.abs(base-32/3)<1e-12);assert.ok(Math.abs((7-1)*base-64)<1e-12);
 const incomplete=composeSet({seed:'int4',topics:['integration'],onlyCompleted:true,completed:['int.4'],minutes:180});assert.equal(incomplete.tasks.length,0);
 const completed=composeSet({seed:'int4',topics:['integration'],onlyCompleted:true,completed:['int.1','int.2','int.3','int.4'],minutes:180});assert.ok(completed.tasks.some(t=>t.module==='int.4'));
});

test('B-repetition powers and inverse answers satisfy independent values, compositions and domain checks',async()=>{
 const {inverseModels,reflectedPoint}=await import('../integral-repetition-lesson.js');const {parseIntegralRoute,pagesForIntegralModule}=await import('../integral-routes.js');
 assert.equal(parseIntegralRoute('#integration/repetition').path,'integration/repetition/start/1');assert.equal(pagesForIntegralModule('repetition').length,28);for(const p of pagesForIntegralModule('repetition'))assert.equal(parseIntegralRoute('#'+p).path,p);
 const at=(p,a)=>p.reduce((s,c,i)=>s+c*a**i,0);
 const product=polynomial(instantiate('rep.product','a').parts[0].answer);for(const t of [-3,-1,.5,2])assert.equal(at(product,t),t**5*t**2/t**3);
 const neg=instantiate('rep.negative','a');assert.equal(number(neg.parts[0].answer),2**-3);assert.equal(number(neg.parts[1].answer),(-2)**4);assert.equal(number(neg.parts[2].answer),-(2**4));
 const roots=instantiate('rep.roots','a');assert.equal(number(roots.parts[0].answer),Math.cbrt(27)**2);assert.equal(number(roots.parts[1].answer),1/Math.sqrt(16));assert.equal(Math.sqrt((-3)**2),Math.abs(-3));
 const inv=polynomial(instantiate('rep.linear','a').parts[0].answer);for(const t of [-10,0,2,9]){assert.ok(Math.abs(at(inv,3*t-6)-t)<1e-12);assert.ok(Math.abs(3*at(inv,t)-6-t)<1e-12);}
 for(const m of [inverseModels.linear,inverseModels.square])for(const t of [m.lo,(m.lo+m.hi)/2,m.hi]){assert.ok(Math.abs(m.inverse(m.f(t))-t)<1e-12);const p=reflectedPoint(m,t);assert.deepEqual(p.reflected,[p.original[1],p.original[0]]);}
 assert.equal(inverseModels.full.f(-2),inverseModels.full.f(2));assert.equal(inverseModels.full.oneToOne,false);assert.ok(Math.abs(Math.log(2+Math.exp(3)-2)-3)<1e-12);
 const model=polynomial(instantiate('rep.temperature','a').parts[0].answer);for(const c of [0,20,100])assert.ok(Math.abs(at(model,1.8*c+32)-c)<1e-12);
 const set=composeSet({seed:'rep',topics:['integration'],onlyCompleted:true,completed:['int.rep'],minutes:90});assert.equal(set.tasks.length,7);assert.ok(set.tasks.every(t=>t.module==='int.rep'&&t.prerequisites.length===0));
});

test('Module 5 volumes and lengths match independent analytical and numerical model checks',async()=>{
 const {volumeModels,volumeMeasurements,arcModels,polygonLength,simpsonIntegral}=await import('../integral-solids-lesson.js');const {pagesForIntegralModule,parseIntegralRoute}=await import('../integral-routes.js');
 assert.equal(pagesForIntegralModule('5').length,28);for(const p of pagesForIntegralModule('5'))assert.equal(parseIntegralRoute('#'+p).path,p);
 assert.equal(number(instantiate('int5.root','a').parts[0].answer),2**2/2+2);assert.equal(number(instantiate('int5.washer','a').parts[0].answer),2+4);
 for(const m of Object.values(volumeModels)){assert.ok(Math.abs(simpsonIntegral(t=>Math.PI*(m.R(t)**2-m.r(t)**2),0,m.end)-volumeMeasurements(m,8).exact)<1e-10);}
 const cone=volumeModels.cone;assert.ok(Math.abs(volumeMeasurements(cone,40).approximation-volumeMeasurements(cone,40).exact)<Math.abs(volumeMeasurements(cone,2).approximation-volumeMeasurements(cone,2).exact));
 for(const m of Object.values(arcModels)){assert.ok(Math.abs(simpsonIntegral(t=>Math.hypot(1,m.df(t)),0,2)-m.exact)<1e-10);assert.ok(polygonLength(m.f,0,2,64)<=m.exact+1e-12);}
 assert.ok(polygonLength(arcModels.curve.f,0,2,64)>polygonLength(arcModels.curve.f,0,2,2));assert.ok(Math.abs(polygonLength(arcModels.line.f,0,2,2)-2*Math.sqrt(5))<1e-12);
 const bowl=instantiate('int5.bowl','a'),outer=Math.PI*simpsonIntegral(t=>(2.5*Math.sqrt(t+.5)+1.4)**2,0,6.5),inside=162*Math.PI;assert.ok(Math.abs(inside-number(bowl.parts[0].answer))<.01);assert.ok(Math.abs(outer-inside-number(bowl.parts[1].answer))<.01);
 const R=Math.sqrt(712),lampLength=R*(Math.asin(18/R)-Math.asin(-26/R)),lamp=instantiate('int5.lamp','a');assert.ok(Math.abs(R-number(lamp.parts[1].answer))<.01);assert.ok(Math.abs(lampLength-number(lamp.parts[2].answer))<.01);
 assert.ok(Math.abs(simpsonIntegral(t=>R/Math.sqrt(712-(t-26)**2),0,44)-lampLength)<1e-7);
 const a=180/812**2,analyticCable=812*Math.sqrt(1+(2*a*812)**2)+Math.asinh(2*a*812)/(2*a),cable=instantiate('int5.cable','a');assert.ok(Math.abs(analyticCable-number(cable.parts[1].answer))<.01);assert.ok(Math.abs(simpsonIntegral(t=>Math.hypot(1,2*a*t),-812,812)-analyticCable)<1e-8);
 const radius=t=>-.2*t*t+2*t+2.5,F=t=>.008*t**5-.2*t**4+t**3+5*t*t+6.25*t;assert.equal(radius(5),7.5);assert.ok(Math.abs(simpsonIntegral(t=>radius(t)**2,0,10)-F(10))<1e-7);let lo=0,hi=10;for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(Math.PI*F(mid)<500)lo=mid;else hi=mid;}const h=(lo+hi)/2;assert.ok(Math.abs(h-number(instantiate('int5.carafe','a').parts[2].answer))<.01);assert.ok(Math.abs(Math.PI*F(h)-500)<1e-10);
 const limit=Math.acosh(211.4885/(2*10.4801))/.0329;assert.ok(Math.abs(2*limit-182.51)<.01);assert.ok(Math.abs(simpsonIntegral(t=>Math.hypot(1,-2*10.4801*.0329*Math.sinh(.0329*t)),-limit,limit)-451.26)<.01);
 const incomplete=composeSet({seed:'solid',topics:['integration'],onlyCompleted:true,completed:['int.5'],minutes:180});assert.equal(incomplete.tasks.length,0);const ready=composeSet({seed:'solid',topics:['integration'],onlyCompleted:true,completed:['int.3','int.4','int.rep','int.5'],minutes:180});assert.ok(ready.tasks.some(t=>t.module==='int.5'));
});

test('Module 6 substitution families satisfy independent chain-rule, domain and model checks',async()=>{
 const {substitutionCase}=await import('../integral-substitution-lesson.js');const {pagesForIntegralModule,parseIntegralRoute}=await import('../integral-routes.js');
 assert.equal(pagesForIntegralModule('6').length,28);for(const p of pagesForIntegralModule('6'))assert.equal(parseIntegralRoute('#'+p).path,p);
 const derivative=(f,t)=>{const h=1e-5;return(f(t+h)-f(t-h))/(2*h);};
 for(const type of ['linear','exponential','trig'])for(const a of [1,2,3,4])for(const t of [-1,-.5,0,.5,1]){const m=substitutionCase(type,a);assert.ok(Math.abs(derivative(m.F,t)-m.f(t))<1e-6*Math.max(1,Math.abs(m.f(t))));assert.ok(Math.abs(derivative(m.wrongF,t)-m.wrongFactor*m.f(t))<1e-6*Math.max(1,Math.abs(m.f(t))));}
 const poly=polynomial(instantiate('int6.linear','a').parts[0].answer),D=poly.slice(1).map((c,i)=>c*(i+1)),at=(p,t)=>p.reduce((s,c,i)=>s+c*t**i,0);for(const t of [-2,0,.5,2])assert.ok(Math.abs(at(D,t)-(2*t-1)**4)<1e-9);assert.ok(Math.abs(at(poly,.5))<1e-12);
 const powerPrimitive=t=>(t*t+3)**4/4;for(const t of [-1,0,1])assert.ok(Math.abs(derivative(powerPrimitive,t)-2*t*(t*t+3)**3)<1e-5);
 const logPrimitive=t=>3*Math.log(Math.abs(t*t+t));for(const t of [-2,-.75,-.25,1,2])assert.ok(Math.abs(derivative(logPrimitive,t)-(6*t+3)/(t*t+t))<1e-6);
 const pointPrimitive=t=>-1.5*Math.log((4-2*t)/4);assert.ok(Math.abs(pointPrimitive(0))<1e-12);assert.ok(Math.abs(pointPrimitive(1)-number(instantiate('int6.point','a').parts[1].answer))<.01);for(const t of [-1,0,1])assert.ok(Math.abs(derivative(pointPrimitive,t)-3/(4-2*t))<1e-8);
 const base=.4937,v=t=>12.42-.0944*t-12.42*base**t,S=t=>12.42*t-.0472*t*t-12.42*(base**t-1)/Math.log(base);assert.equal(S(0),0);for(const t of [0,1,2,4]){assert.ok(v(t)>=0);assert.ok(Math.abs(derivative(S,t)-v(t))<1e-8);}const runner=instantiate('int6.runner','a');assert.ok(Math.abs(v(3)-number(runner.parts[0].answer))<.01);assert.ok(Math.abs(S(2)-number(runner.parts[1].answer))<.01);assert.ok(Math.abs(S(4)-S(2)-number(runner.parts[2].answer))<.01);
 const u9=t=>(t**3+2)*Math.log(t**3+2)-(t**3+2);for(const t of [-1,0,1])assert.ok(Math.abs(derivative(u9,t)-3*t*t*Math.log(t**3+2))<1e-7);
 const incomplete=composeSet({seed:'sub',topics:['integration'],onlyCompleted:true,completed:['int.6'],minutes:180});assert.equal(incomplete.tasks.length,0);const ready=composeSet({seed:'sub',topics:['integration'],onlyCompleted:true,completed:['int.1','int.rep','int.6'],minutes:180});assert.ok(ready.tasks.some(t=>t.module==='int.6'));
});

test('Module 7 transformed bounds, orientation, capstone geometry and models agree with independent calculations',async()=>{
 const {definiteSubstitutionCase,definiteSubstitutionMeasurements,trapezoidIntegral}=await import('../integral-final-lesson.js');const {simpsonIntegral}=await import('../integral-solids-lesson.js');const {pagesForIntegralModule,parseIntegralRoute}=await import('../integral-routes.js');
 assert.equal(pagesForIntegralModule('7').length,28);for(const p of pagesForIntegralModule('7'))assert.equal(parseIntegralRoute('#'+p).path,p);
 for(const type of ['power','log','trig']){const m=definiteSubstitutionCase(type);for(const [a,b]of type==='trig'?[[0,Math.PI/2],[Math.PI/2,Math.PI],[Math.PI,0],[1,1]]:[[-1,1],[0,1],[1,0],[2,2]]){const r=definiteSubstitutionMeasurements(m,a,b);assert.ok(Math.abs(simpsonIntegral(m.f,a,b)-r.value)<1e-9);assert.ok(r.area+1e-12>=Math.abs(r.value));assert.ok(Math.abs(definiteSubstitutionMeasurements(m,b,a).value+r.value)<1e-12);assert.equal(definiteSubstitutionMeasurements(m,b,a).area,r.area);}}
 const power=definiteSubstitutionCase('power'),r=definiteSubstitutionMeasurements(power,-1,1);assert.equal(r.value,0);assert.ok(Math.abs(r.area-14/3)<1e-12);const generatedPower=instantiate('int7.power','a'),params=generatedPower.parameters;assert.ok(Math.abs(number(generatedPower.parts[1].answer)-params.k*(params.last**(params.p+1)-params.b**(params.p+1))/(params.p+1))<1e-9);
 const log=t=>(2*t-1)/(t*t-t+4);assert.ok(Math.abs(simpsonIntegral(log,0,4)-Math.log(4))<1e-10);const geoLog=-simpsonIntegral(log,0,.5)+simpsonIntegral(log,.5,4);assert.ok(Math.abs(geoLog-Math.log(1024/225))<1e-10);
 assert.equal(10**5-2**5,99968);assert.ok(Math.abs(simpsonIntegral(t=>5*Math.cos(t)*Math.sin(t)**4,0,Math.PI/2)-1)<1e-10);
 const a=3,f=t=>(t-1)*(a-t);assert.ok(Math.abs(-simpsonIntegral(f,0,1)-4/3)<1e-12);assert.ok(Math.abs(simpsonIntegral(f,1,a)-4/3)<1e-12);
 const g=t=>Math.log1p(t*t),df=t=>2*t/(1+t*t),areaExact=6*Math.log(10)-12+4*Math.atan(3),rows=[[g,1,areaExact],[t=>g(t)**2,Math.PI,34.46293252423299],[t=>Math.hypot(1,df(t)),1,7.639134479499738]];const geometry=instantiate('int7.geometry','a');for(const [i,[fun,factor,reference]]of rows.entries()){assert.ok(Math.abs(factor*simpsonIntegral(fun,-3,3)-reference)<1e-8);assert.ok(Math.abs(reference-number(geometry.parts[i].answer))<.01);assert.ok(Math.abs(factor*trapezoidIntegral(fun,-3,3,128)-reference)<Math.abs(factor*trapezoidIntegral(fun,-3,3,8)-reference));}
 const v=t=>2*t+t*Math.exp(.32*t),distance=simpsonIntegral(v,0,10),F=t=>t*t+(t/.32-1/.32**2)*Math.exp(.32*t);assert.ok(Math.abs(distance-(F(10)-F(0)))<1e-8);const task=instantiate('int7.transport','a');for(const [i,result]of [distance,distance/10,50+distance].entries())assert.ok(Math.abs(result-number(task.parts[i].answer))<.01);
 const incomplete=composeSet({seed:'int7',topics:['integration'],onlyCompleted:true,completed:['int.7'],minutes:180});assert.equal(incomplete.tasks.length,0);const ready=composeSet({seed:'int7',topics:['integration'],onlyCompleted:true,completed:['int.1','int.2','int.3','int.4','int.rep','int.5','int.6','int.7'],minutes:180});assert.ok(ready.tasks.some(t=>t.module==='int.7'));
});
