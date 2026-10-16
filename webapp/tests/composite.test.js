import test from "node:test";
import assert from "node:assert/strict";
import { bank, instantiate } from "../tasks/bank/index.js";
import { gradeTask, targetedFeedback } from "../tasks/grading.js";
import { number, polynomial } from "../tasks/math.js";
import { composeSet } from "../tasks/selection.js";

const generatedIds = [
  "comp.value-linear",
  "comp.value-power",
  "comp.numeric-chain",
  "comp.reverse-chain",
  "comp.compose",
  "comp.compare-order",
  "comp.domain-cancellation",
  "comp.solve",
  "comp.three-stage",
];

const compositeTasks = (seed = "coverage") =>
  bank
    .map((source) => instantiate(source.id, seed))
    .filter((task) => task.topic === "composite");

const automaticAnswers = (task) =>
  Object.fromEntries(
    task.parts.map((part) => [
      part.id,
      ["tuple", "set"].includes(part.type)
        ? part.answer.map(String)
        : part.type === "text"
          ? "Faglig forklaring"
          : String(part.answer),
    ]),
  );

const value = (expression, input) =>
  polynomial(expression).reduce(
    (sum, coefficient, degree) => sum + coefficient * input ** degree,
    0,
  );

test("Opgavebanken dækker hele modulet uden dubletter eller metodeafslørende prøvetekster", () => {
  const tasks = compositeTasks();
  assert.equal(tasks.length, 13);
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
  assert.ok(tasks.every((task) => task.module === "comp.basic"));

  const coveredGoals = new Set(tasks.flatMap((task) => task.goals));
  for (const goal of [
    "comp.notation",
    "comp.value",
    "comp.structure",
    "comp.order",
    "comp.formula",
    "comp.compare",
    "comp.domain",
    "comp.equation",
    "comp.model",
  ])
    assert.ok(coveredGoals.has(goal), goal);

  const signatures = tasks.map((task) =>
    task.prompt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
  assert.equal(new Set(signatures).size, signatures.length);

  for (const task of tasks) {
    assert.ok(task.hints.length >= 2, task.id);
    assert.doesNotMatch(
      task.prompt,
      /sammensat funktion|komposition|regn indefra|indre funktion|ydre funktion/i,
      task.id,
    );
    for (const part of task.parts)
      assert.ok(
        task.errors.some(
          (error) => error.part === part.id && error.answer === undefined,
        ),
        `${task.id}:${part.id}`,
      );
    for (const source of [
      task.prompt,
      ...task.parts.flatMap((part) => [
        part.label,
        ...(part.options || []).map((option) => option.label),
      ]),
      ...task.hints,
      task.solution,
    ]) {
      for (const tag of source.match(/<math\b[^>]*>/g) || [])
        assert.match(
          tag,
          /xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/,
          task.id,
        );
    }
  }
});

test("Alle seedede familier er deterministiske og matematisk gyldige over 1000 seeds", () => {
  const promptVariety = Object.fromEntries(
    generatedIds.map((id) => [id, new Set()]),
  );

  for (let seed = 0; seed < 1000; seed++) {
    for (const id of generatedIds) {
      const task = instantiate(id, String(seed));
      assert.deepEqual(task, instantiate(id, String(seed)), id);
      assert.ok(task.parameters, id);
      promptVariety[id].add(task.prompt);
      gradeTask(task, automaticAnswers(task)).forEach((grade, index) =>
        assert.equal(
          grade.points,
          task.parts[index].type === "text" ? null : task.parts[index].points,
          `${id}:${seed}`,
        ),
      );
    }

    const linear = instantiate("comp.value-linear", String(seed));
    const lp = linear.parameters;
    assert.equal(lp.coefficient * lp.input + lp.constant, lp.output);
    assert.equal(number(linear.parts[0].answer), lp.output);

    const powered = instantiate("comp.value-power", String(seed));
    const pp = powered.parameters;
    assert.equal(pp.input ** 2 + pp.constant, pp.output);

    const numeric = instantiate("comp.numeric-chain", String(seed));
    const np = numeric.parameters;
    assert.equal(np.input ** 2 + np.innerConstant, np.innerValue);
    assert.equal(
      np.outerCoefficient * np.innerValue + np.outerConstant,
      np.output,
    );

    const reverse = instantiate("comp.reverse-chain", String(seed));
    const rp = reverse.parameters;
    assert.equal(rp.coefficient * rp.input + rp.constant, rp.innerValue);
    assert.equal(
      rp.innerValue ** 2 + rp.radicandConstant,
      rp.output ** 2,
    );

    const compose = instantiate("comp.compose", String(seed));
    const cp = compose.parameters;
    for (const input of [-3, -1, 0, 2, 5])
      assert.equal(
        value(compose.parts[0].answer, input),
        (cp.coefficient * input + cp.constant) ** 2 + cp.outerConstant,
      );

    const compare = instantiate("comp.compare-order", String(seed));
    const op = compare.parameters;
    for (const input of [-2, 0, 3]) {
      assert.equal(
        value(compare.parts[0].answer, input),
        op.coefficient * (input ** 2 + op.squareConstant) + op.constant,
      );
      assert.equal(
        value(compare.parts[1].answer, input),
        (op.coefficient * input + op.constant) ** 2 + op.squareConstant,
      );
    }

    const domain = instantiate("comp.domain-cancellation", String(seed));
    const dp = domain.parameters;
    assert.equal(domain.parts[0].answer, "x-domain");
    assert.equal(number(domain.parts[1].answer), dp.boundary);
    for (const input of [dp.boundary, dp.boundary + 1, dp.boundary + 9])
      assert.equal(Math.sqrt(input - dp.boundary) ** 2 + dp.boundary, input);

    const solved = instantiate("comp.solve", String(seed));
    const sp = solved.parameters;
    assert.deepEqual(solved.parts[0].answer, [-sp.level, sp.level]);
    assert.deepEqual(solved.parts[1].answer, sp.roots);
    assert.notEqual(sp.roots[0], sp.roots[1]);
    for (const root of sp.roots)
      assert.equal(
        (sp.coefficient * root + sp.innerConstant) ** 2 + sp.outerConstant,
        sp.target,
      );

    const three = instantiate("comp.three-stage", String(seed));
    const tp = three.parameters;
    assert.equal(tp.input + tp.shift, tp.afterH);
    assert.equal(tp.scale * tp.afterH, tp.afterG);
    assert.equal(tp.afterG ** 2 + tp.outerConstant, tp.output);
  }

  for (const [id, prompts] of Object.entries(promptVariety))
    assert.ok(
      prompts.size >= (id === "comp.domain-cancellation" ? 6 : 12),
      `${id} gav kun ${prompts.size} varianter`,
    );
});

test("Facit, delpoint, målrettet feedback og modulfilter fungerer", () => {
  const solved = instantiate("comp.solve", "partial-points");
  const partial = gradeTask(solved, {
    levels: [String(solved.parts[0].answer[0]), "999"],
    roots: [String(solved.parts[1].answer[0]), "999"],
  });
  assert.equal(partial[0].points, 1);
  assert.equal(partial[1].points, 2);

  const compose = instantiate("comp.compose", "feedback");
  const p = compose.parameters;
  const missingCrossTerm = `${p.coefficient ** 2}*x^2+${p.constant ** 2 + p.outerConstant}`;
  assert.match(
    targetedFeedback(compose, compose.parts[0], missingCrossTerm),
    /midterleddet mangler/i,
  );

  const structure = instantiate("comp.structure", "fixed");
  const structureGrade = gradeTask(structure, { first: "g", last: "g" });
  assert.equal(structureGrade[0].points, 1);
  assert.equal(structureGrade[1].points, 0);

  const model = instantiate("comp.model", "fixed");
  const modelGrade = gradeTask(model, {
    formula: "model",
    units: "Tid bliver til vægt, som bliver til foder pr. dag.",
  });
  assert.equal(modelGrade[0].points, 3);
  assert.equal(modelGrade[1].points, null);

  const withoutEquationPrerequisite = composeSet({
    seed: "composite-only",
    topics: ["composite"],
    onlyCompleted: true,
    completed: ["comp.basic"],
    minutes: 120,
    distribution: { short: 20, medium: 20, complex: 20 },
  }).tasks;
  assert.equal(withoutEquationPrerequisite.length, 12);
  assert.ok(
    withoutEquationPrerequisite.every((task) => task.id !== "comp.solve"),
  );

  const all = composeSet({
    seed: "composite-all",
    topics: ["composite"],
    onlyCompleted: true,
    completed: ["comp.basic", "eq.basic"],
    minutes: 120,
    distribution: { short: 20, medium: 20, complex: 20 },
  }).tasks;
  assert.equal(all.length, 13);
  assert.ok(all.every((task) => task.topic === "composite"));
});
