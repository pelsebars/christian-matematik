import test from "node:test";
import assert from "node:assert/strict";
import { bank, instantiate } from "../tasks/bank/index.js";
import { gradeTask, targetedFeedback } from "../tasks/grading.js";
import { composeSet } from "../tasks/selection.js";

const generatedIds = [
  "quad.foundation-sign-root",
  "quad.standard",
  "quad.coefficients",
  "quad.discriminant",
  "quad.solution-count",
  "quad.solve-general",
  "quad.double-root",
  "quad.no-real",
  "quad.missing-linear",
  "quad.missing-constant",
  "quad.both-sides",
  "quad.verify",
];

const quadraticTasks = (seed = "coverage") =>
  bank
    .map((source) => instantiate(source.id, seed))
    .filter((task) => task.topic === "quadratic");

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

const value = (a, b, c, root) => a * root ** 2 + b * root + c;

const assertMathML = (task) => {
  for (const source of [
    task.prompt,
    ...task.parts.flatMap((part) => [
      part.label,
      ...(part.options?.map((option) => option.label) || []),
    ]),
    ...task.hints,
    task.solution,
  ]) {
    assert.doesNotMatch(source, /\bx\^|sqrt\(|\+\/-|\+-/i, task.id);
    for (const tag of source.match(/<math\b[^>]*>/g) || [])
      assert.match(
        tag,
        /xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/,
        task.id,
      );
  }
};

test("Andengradsbanken dækker hele modulet uden dubletter eller metodeafslørende opgavetekster", () => {
  const tasks = quadraticTasks();
  assert.equal(tasks.length, 15);
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
  assert.ok(tasks.every((task) => task.module === "quad.basic"));

  const coveredGoals = new Set(tasks.flatMap((task) => task.goals));
  for (const goal of [
    "quad.foundation",
    "quad.recognize",
    "quad.standard",
    "quad.coefficients",
    "quad.discriminant",
    "quad.classify",
    "quad.formula",
    "quad.roots",
    "quad.check",
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
      /andengrad|diskriminant|løsningsformel|standardform|koefficient|faktoris|brug formlen/i,
      task.id,
    );
    assertMathML(task);
    for (const part of task.parts)
      assert.ok(
        task.errors.some(
          (error) => error.part === part.id && error.answer === undefined,
        ),
        `${task.id}:${part.id} mangler generel feedback`,
      );
  }
});

test("Alle seedede familier er deterministiske, varierede og matematisk gyldige over 1000 seeds", () => {
  const promptVariety = Object.fromEntries(
    generatedIds.map((id) => [id, new Set()]),
  );

  for (let seed = 0; seed < 1000; seed++) {
    for (const id of generatedIds) {
      const task = instantiate(id, String(seed));
      assert.deepEqual(task, instantiate(id, String(seed)), id);
      assert.ok(task.parameters, id);
      promptVariety[id].add(
        JSON.stringify({
          prompt: task.prompt,
          labels: task.parts.map((part) => part.label),
          answers: task.parts.map((part) => part.answer),
        }),
      );
      gradeTask(task, automaticAnswers(task)).forEach((grade, index) =>
        assert.equal(grade.points, task.parts[index].points, `${id}:${seed}`),
      );
    }

    const foundation = instantiate(
      "quad.foundation-sign-root",
      String(seed),
    );
    const foundationValue = foundation.parameters.value;
    assert.equal(
      Number(foundation.parts[0].answer),
      foundationValue ** 2,
    );
    assert.equal(
      Number(foundation.parts[1].answer),
      -(foundationValue ** 2),
    );
    assert.equal(Number(foundation.parts[2].answer), foundationValue);

    const standard = instantiate("quad.standard", String(seed)).parameters;
    assert.equal(standard.leftB - standard.rightB, standard.canonicalB);
    assert.equal(standard.leftC - standard.rightC, standard.canonicalC);
    assert.notEqual(standard.a, 0);

    const coefficients = instantiate(
      "quad.coefficients",
      String(seed),
    ).parameters;
    assert.notEqual(coefficients.a, 0);
    if (coefficients.missing === 1) assert.equal(coefficients.b, 0);
    if (coefficients.missing === 2) assert.equal(coefficients.c, 0);

    const discriminant = instantiate(
      "quad.discriminant",
      String(seed),
    ).parameters;
    assert.equal(
      discriminant.d,
      discriminant.b ** 2 - 4 * discriminant.a * discriminant.c,
    );

    const classification = instantiate(
      "quad.solution-count",
      String(seed),
    ).parameters;
    assert.equal(
      classification.expected,
      classification.d > 0
        ? "two"
        : classification.d === 0
          ? "one"
          : "none",
    );

    const general = instantiate("quad.solve-general", String(seed)).parameters;
    assert.ok(general.d > 0);
    assert.equal(general.d, general.b ** 2 - 4 * general.a * general.c);
    assert.equal(value(general.a, general.b, general.c, general.r1), 0);
    assert.equal(value(general.a, general.b, general.c, general.r2), 0);
    assert.notEqual(general.r1, general.r2);

    const repeated = instantiate("quad.double-root", String(seed)).parameters;
    assert.equal(repeated.d, 0);
    assert.equal(value(repeated.a, repeated.b, repeated.c, repeated.root), 0);
    assert.equal(-repeated.b / (2 * repeated.a), repeated.root);

    const noReal = instantiate("quad.no-real", String(seed)).parameters;
    assert.ok(noReal.d < 0);
    assert.equal(noReal.d, noReal.b ** 2 - 4 * noReal.a * noReal.c);
    assert.ok(noReal.a * (0 - noReal.center) ** 2 + noReal.lift > 0);

    const missingLinear = instantiate(
      "quad.missing-linear",
      String(seed),
    ).parameters;
    assert.equal(missingLinear.b, 0);
    assert.equal(
      value(
        missingLinear.a,
        missingLinear.b,
        missingLinear.c,
        -missingLinear.root,
      ),
      0,
    );
    assert.equal(
      value(
        missingLinear.a,
        missingLinear.b,
        missingLinear.c,
        missingLinear.root,
      ),
      0,
    );

    const missingConstant = instantiate(
      "quad.missing-constant",
      String(seed),
    ).parameters;
    assert.equal(missingConstant.c, 0);
    assert.equal(
      value(missingConstant.a, missingConstant.b, 0, 0),
      0,
    );
    assert.equal(
      value(
        missingConstant.a,
        missingConstant.b,
        0,
        missingConstant.nonZeroRoot,
      ),
      0,
    );

    const both = instantiate("quad.both-sides", String(seed)).parameters;
    for (const root of [both.r1, both.r2]) {
      assert.equal(
        both.a * root ** 2 + both.leftB * root,
        both.rightB * root + both.rightC,
      );
      assert.equal(
        value(both.a, both.canonicalB, both.canonicalC, root),
        0,
      );
    }

    const verification = instantiate("quad.verify", String(seed));
    const verify = verification.parameters;
    const firstWorks = value(verify.a, verify.b, verify.c, verify.candidateOne) === 0;
    const secondWorks = value(verify.a, verify.b, verify.c, verify.candidateTwo) === 0;
    assert.equal(secondWorks, true);
    assert.equal(
      verification.parts[0].answer,
      firstWorks ? "both" : "second",
    );
  }

  for (const [id, prompts] of Object.entries(promptVariety)) {
    const minimum = id === "quad.foundation-sign-root" ? 8 : 12;
    assert.ok(
      prompts.size >= minimum,
      `${id} gav kun ${prompts.size} varianter`,
    );
  }
});

test("Facit, delpoint, målrettet feedback og modulfilter fungerer", () => {
  const general = instantiate("quad.solve-general", "partial");
  const partial = gradeTask(general, {
    d: general.parts[0].answer,
    roots: [String(general.parts[1].answer[0]), ""],
  });
  assert.equal(partial[0].points, 2);
  assert.equal(partial[1].points, 2);
  assert.equal(partial[1].status, "partial");

  const discriminant = instantiate("quad.discriminant", "feedback");
  const { a, b, c } = discriminant.parameters;
  assert.match(
    targetedFeedback(
      discriminant,
      discriminant.parts[0],
      String(b ** 2 + 4 * a * c),
    ),
    /lagt fire a c til/i,
  );

  const analysis = instantiate("quad.sign-analysis", "fixed");
  assert.equal(gradeTask(analysis, { line: "2" })[0].points, 3);
  assert.match(
    targetedFeedback(analysis, analysis.parts[0], "3"),
    /viderefører allerede fejlen/i,
  );

  const selected = composeSet({
    seed: "quadratic-only",
    topics: ["quadratic"],
    onlyCompleted: true,
    completed: ["eq.basic", "quad.basic"],
    minutes: 120,
  }).tasks;
  assert.ok(selected.length >= 10);
  assert.ok(selected.every((task) => task.topic === "quadratic"));
  assert.equal(new Set(selected.map((task) => task.id)).size, selected.length);
});
