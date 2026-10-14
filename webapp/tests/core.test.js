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
  assert.equal(result.tasks.length, 9);
  assert.equal(new Set(result.tasks.map((t) => t.topic)).size, 6);
  assert.ok(result.minutes <= 60);
  assert.equal(new Set(result.tasks.map((t) => t.id)).size, 9);
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
  assert.deepEqual(
    composeSet({
      ...options,
      onlyCompleted: true,
      completed: ["eq.basic"],
    }).tasks.map((t) => t.id),
    ["eq.balance"],
  );
  assert.equal(composeSet({ ...options, difficulty: 3 }).tasks.length, 3);
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
  for (const x of [-3, 0, 2, 5])
    assert.equal(value(comp.parts[0].answer, x), (2 * x + 1) ** 2);
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
  assert.deepEqual(vector.parts[0].answer, [4 - 1, 5 - 1]);
  assert.equal(number(vector.parts[1].answer), Math.hypot(4 - 1, 5 - 1));
  assert.equal(
    instantiate("geo.angle", "math").parts[0].answer,
    2 * -1 + 1 * 3 > 0 ? "acute" : "obtuse",
  );
  assert.equal(
    number(instantiate("geo.distance", "math").parts[0].answer),
    Math.abs(-10) / Math.hypot(3, 4),
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
    assert.deepEqual(differentiate(coefficients),expected);
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
  assert.equal(composeSet({seed:'int',topics:['integration'],minutes:90,onlyCompleted:true,completed:['int.1']}).tasks.length,7);
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
  assert.equal(parseIntegralRoute('#integration/7/teori').path, 'integration/7');
  assert.equal(integralRoute('1', 'opsummering'), 'integration/1/opsummering');
  assert.equal(integralSteps.length, 6);
  assert.equal(integralPages.length, 28);
  assert.equal(new Set(integralPages).size, integralPages.length);
  for (const path of integralPages) assert.equal(parseIntegralRoute('#' + path).path, path);
});
