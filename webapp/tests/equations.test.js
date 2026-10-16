import test from "node:test";
import assert from "node:assert/strict";
import { bank, instantiate } from "../tasks/bank/index.js";
import { gradeTask, targetedFeedback } from "../tasks/grading.js";
import { number } from "../tasks/math.js";
import { composeSet } from "../tasks/selection.js";

const generatedIds = [
  "eq.balance",
  "eq.inverse-addition",
  "eq.inverse-scaling",
  "eq.both-sides",
  "eq.negative-coefficients",
  "eq.parentheses-one-side",
  "eq.parentheses-both-sides",
  "eq.fractions",
  "eq.verify-proposal",
];

const equationTasks = (seed = "coverage") =>
  bank
    .map((source) => instantiate(source.id, seed))
    .filter((task) => task.topic === "equations");

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

test("Ligningsbanken dækker hele modulet uden metodeafslørende eller dobbelte opgaver", () => {
  const tasks = equationTasks();
  assert.equal(tasks.length, 10);
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
  assert.ok(tasks.every((task) => task.module === "eq.basic"));

  const coveredGoals = new Set(tasks.flatMap((task) => task.goals));
  for (const goal of [
    "eq.isolate",
    "eq.balance",
    "eq.inverse",
    "eq.collect",
    "eq.parentheses",
    "eq.signs",
    "eq.fractions",
    "eq.check",
  ])
    assert.ok(coveredGoals.has(goal), goal);

  const signatures = tasks.map((task) =>
    task.prompt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
  assert.equal(new Set(signatures).size, signatures.length);

  for (const task of tasks) {
    assert.ok(task.hints.length >= 2, task.id);
    if (task.id !== "eq.first-error") assert.match(task.solution, /Kontrol/i, task.id);
    assert.doesNotMatch(
      task.prompt,
      /ligning|isoler|modsatte regneart|saml led|gang ind|fjern nævner|divider begge/i,
      task.id,
    );
    assert.ok(task.errors.some((error) => error.answer === undefined), task.id);
    for (const source of [
      task.prompt,
      ...task.parts.map((part) => part.label),
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

test("Alle seedede ligningsfamilier er deterministiske og matematisk gyldige over 1000 seeds", () => {
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
        assert.equal(grade.points, task.parts[index].points, `${id}:${seed}`),
      );
    }

    const balance = instantiate("eq.balance", String(seed)).parameters;
    assert.equal(balance.a * balance.root + balance.b, balance.c);

    const addition = instantiate("eq.inverse-addition", String(seed)).parameters;
    assert.equal(addition.root + addition.b, addition.c);
    assert.notEqual(addition.b, 0);

    const scaling = instantiate("eq.inverse-scaling", String(seed)).parameters;
    assert.equal(scaling.a * scaling.root, scaling.c);
    assert.ok(scaling.a >= 2);

    const both = instantiate("eq.both-sides", String(seed)).parameters;
    assert.equal(both.a * both.root + both.b, both.c * both.root + both.d);
    assert.ok(Math.abs(both.a - both.c) >= 2);

    const negative = instantiate(
      "eq.negative-coefficients",
      String(seed),
    ).parameters;
    assert.ok(negative.a < 0 && negative.c < 0);
    assert.equal(
      negative.a * negative.root + negative.b,
      negative.c * negative.root + negative.d,
    );

    const oneParenthesis = instantiate(
      "eq.parentheses-one-side",
      String(seed),
    ).parameters;
    assert.notEqual(oneParenthesis.p * oneParenthesis.a, oneParenthesis.c);
    assert.equal(
      oneParenthesis.p *
        (oneParenthesis.a * oneParenthesis.root + oneParenthesis.b),
      oneParenthesis.c * oneParenthesis.root + oneParenthesis.d,
    );

    const twoParentheses = instantiate(
      "eq.parentheses-both-sides",
      String(seed),
    ).parameters;
    assert.notEqual(
      twoParentheses.p * twoParentheses.b,
      twoParentheses.q * twoParentheses.d,
    );
    assert.equal(
      twoParentheses.p *
        (twoParentheses.a + twoParentheses.b * twoParentheses.root),
      twoParentheses.q *
        (twoParentheses.c + twoParentheses.d * twoParentheses.root),
    );

    const fractions = instantiate("eq.fractions", String(seed));
    const fractionParameters = fractions.parameters;
    const fractionRoot = number(fractions.parts[0].answer);
    assert.equal(fractionRoot, fractionParameters.root);
    assert.ok(
      Math.abs(
        (2 * fractionRoot) / 3 + fractionParameters.b / 4 -
          (fractionRoot / 2 + fractionParameters.e),
      ) < 1e-12,
    );

    const verification = instantiate(
      "eq.verify-proposal",
      String(seed),
    );
    const verificationParameters = verification.parameters;
    assert.equal(
      verificationParameters.a * verificationParameters.root +
        verificationParameters.b,
      verificationParameters.c,
    );
    assert.equal(
      verificationParameters.isCorrect,
      verificationParameters.candidate === verificationParameters.root,
    );
    assert.equal(
      verification.parts.find((part) => part.id === "verdict").answer,
      verificationParameters.isCorrect ? "yes" : "no",
    );
  }

  for (const [id, prompts] of Object.entries(promptVariety))
    assert.ok(prompts.size >= 12, `${id} gav kun ${prompts.size} varianter`);
});

test("Point, delpoint, målrettet feedback og modulfilter fungerer for ligninger", () => {
  const verification = instantiate("eq.verify-proposal", "partial-points");
  const results = gradeTask(verification, {
    verdict: verification.parts[0].answer === "yes" ? "no" : "yes",
    x: verification.parts[1].answer,
  });
  assert.equal(results[0].points, 0);
  assert.equal(results[1].points, 2);

  const fractionTask = instantiate("eq.fractions", "feedback");
  const numerator = fractionTask.parameters.numerator;
  assert.match(
    targetedFeedback(fractionTask, fractionTask.parts[0], String(numerator)),
    /divideres med koefficienten to/i,
  );

  const errorTask = instantiate("eq.first-error", "fixed");
  assert.equal(errorTask.parts[0].answer, "3");
  assert.equal(gradeTask(errorTask, { line: "3" })[0].points, 3);
  assert.match(
    targetedFeedback(errorTask, errorTask.parts[0], "4"),
    /første overgang/i,
  );

  const selected = composeSet({
    seed: "equations-only",
    topics: ["equations"],
    onlyCompleted: true,
    completed: ["eq.basic"],
    minutes: 90,
  }).tasks;
  assert.equal(selected.length, 10);
  assert.ok(selected.every((task) => task.topic === "equations"));
});
