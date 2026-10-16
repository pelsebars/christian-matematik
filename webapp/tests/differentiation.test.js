import test from "node:test";
import assert from "node:assert/strict";
import { bank, instantiate } from "../tasks/bank/index.js";
import { gradePart, gradeTask, targetedFeedback } from "../tasks/grading.js";
import { polynomial } from "../tasks/math.js";
import { composeSet } from "../tasks/selection.js";

const derivative = (coefficients) =>
  coefficients.slice(1).map((coefficient, index) => coefficient * (index + 1));
const at = (coefficients, input) =>
  coefficients.reduce((sum, coefficient, exponent) => sum + coefficient * input ** exponent, 0);
const multiply = (left, right) => {
  const result = Array(left.length + right.length - 1).fill(0);
  left.forEach((a, i) => right.forEach((b, j) => (result[i + j] += a * b)));
  return result;
};
const powerCoefficients = (base, exponent) => {
  let result = [1];
  for (let i = 0; i < exponent; i++) result = multiply(result, base);
  return result;
};

test("Differentialregning has complete, unique coverage without method-labelled prompts", () => {
  const tasks = bank
    .map((source) => instantiate(source.id, "coverage"))
    .filter((task) => task.topic === "differentiation");
  assert.equal(tasks.length, 34);
  assert.deepEqual(
    Object.fromEntries(
      ["diff.1", "diff.2", "diff.3", "diff.4", "diff.5"].map((module) => [
        module,
        tasks.filter((task) => task.module === module).length,
      ]),
    ),
    { "diff.1": 6, "diff.2": 7, "diff.3": 8, "diff.4": 6, "diff.5": 7 },
  );
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
  const promptSignatures = tasks.map((task) =>
    task.prompt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
  assert.equal(new Set(promptSignatures).size, promptSignatures.length);
  for (const task of tasks) {
    assert.ok(task.hints.length >= 2, task.id);
    assert.doesNotMatch(
      task.prompt,
      /Produktreglen|Kædereglen|Potensreglen|Differentialkvotient|Vendetangent/i,
      task.id,
    );
    for (const source of [task.prompt, ...task.parts.map((part) => part.label), ...task.hints, task.solution]) {
      for (const tag of source.match(/<math\b[^>]*>/g) || [])
        assert.match(tag, /xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/, task.id);
    }
  }
});

test("Seeded differentiation generators remain deterministic and mathematically valid over 1000 seeds", () => {
  const generatedIds = [
    "diff1.secant-and-tangent",
    "diff1.polynomial",
    "diff1.derivative-value",
    "diff2.polynomial-product",
    "diff2.product-value",
    "diff2.area-rate",
    "diff3.power-chain",
    "diff3.power-value",
    "diff4.tangent",
    "diff4.inflection-tangent",
    "diff5.monotonicity",
    "diff5.local-extrema",
    "diff5.rectangle",
  ];
  for (let seed = 0; seed < 1000; seed++) {
    for (const id of generatedIds) {
      const task = instantiate(id, String(seed));
      assert.deepEqual(task, instantiate(id, String(seed)), id);
      assert.ok(task.parameters, id);
      const answers = Object.fromEntries(
        task.parts.map((part) => [
          part.id,
          ["tuple", "set"].includes(part.type)
            ? part.answer.map(String)
            : part.type === "text"
              ? "Faglig forklaring"
              : String(part.answer),
        ]),
      );
      gradeTask(task, answers).forEach((grade, index) =>
        assert.equal(
          grade.points,
          task.parts[index].type === "text" ? null : task.parts[index].points,
          `${id}:${task.parts[index].id}`,
        ),
      );
    }

    const secant = instantiate("diff1.secant-and-tangent", String(seed));
    {
      const { a, b, c, start, end, step } = secant.parameters;
      const f = (input) => a * input ** 2 + b * input + c;
      assert.equal(Number(secant.parts[0].answer), (f(end) - f(start)) / step);
      assert.equal(Number(secant.parts[1].answer), 2 * a * start + b);
    }

    const basic = instantiate("diff1.polynomial", String(seed));
    {
      const { a, b, c } = basic.parameters;
      assert.deepEqual(polynomial(basic.parts[0].answer), derivative([0, c, b, a]));
    }

    const product = instantiate("diff2.polynomial-product", String(seed));
    {
      const { a, b, c, d } = product.parameters;
      assert.deepEqual(
        polynomial(product.parts[0].answer),
        derivative(multiply([b, a], [d, c])),
      );
    }

    const productValue = instantiate("diff2.product-value", String(seed));
    {
      const { u, du, v, dv, answer } = productValue.parameters;
      assert.equal(answer, du * v + u * dv);
    }

    const area = instantiate("diff2.area-rate", String(seed));
    {
      const { length, width, lengthRate, widthRate, areaRate } = area.parameters;
      assert.equal(areaRate, lengthRate * width + length * widthRate);
    }

    const chain = instantiate("diff3.power-chain", String(seed));
    {
      const { a, b, exponent } = chain.parameters;
      assert.deepEqual(
        polynomial(chain.parts[0].answer),
        derivative(powerCoefficients([b, a], exponent)),
      );
    }

    const chainValue = instantiate("diff3.power-value", String(seed));
    {
      const { constant, input, answer } = chainValue.parameters;
      assert.equal(answer, 6 * input * (input ** 2 + constant) ** 2);
    }

    const tangent = instantiate("diff4.tangent", String(seed));
    {
      const { a, b, c, input, y, slope, intercept } = tangent.parameters;
      assert.equal(y, a * input ** 2 + b * input + c);
      assert.equal(slope, 2 * a * input + b);
      assert.equal(slope * input + intercept, y);
    }

    const inflection = instantiate("diff4.inflection-tangent", String(seed));
    {
      const { a, root, slope, height, intercept } = inflection.parameters;
      assert.notEqual(a, 0);
      assert.deepEqual(inflection.parts[0].answer, [root, height]);
      assert.equal(at(polynomial(inflection.parts[1].answer), root), height);
      assert.equal(polynomial(inflection.parts[1].answer)[1], slope);
      assert.ok(6 * a * (root - 1 - root) * (6 * a * (root + 1 - root)) < 0);
      assert.equal(intercept, height - slope * root);
    }

    for (const id of ["diff5.monotonicity", "diff5.local-extrema"]) {
      const task = instantiate(id, String(seed));
      const { first, second, factor } = task.parameters;
      assert.ok(first < second && factor > 0);
      const derivedValue = (input) => factor * (input - first) * (input - second);
      assert.ok(derivedValue(first - 1) > 0);
      assert.ok(derivedValue((first + second) / 2) < 0);
      assert.ok(derivedValue(second + 1) > 0);
    }

    const rectangle = instantiate("diff5.rectangle", String(seed));
    {
      const { side, perimeter, area } = rectangle.parameters;
      assert.equal(perimeter, 4 * side);
      assert.equal(area, side ** 2);
      assert.equal(at(polynomial(rectangle.parts[0].answer), side), area);
      for (let i = 1; i < 40; i++) {
        const input = (2 * side * i) / 40;
        assert.ok(at(polynomial(rectangle.parts[0].answer), input) <= area + 1e-9);
      }
    }
  }
});

test("Differentiation scoring, partial points, feedback and module filters work", () => {
  const inflection = instantiate("diff4.inflection-tangent", "partial");
  const point = inflection.parts.find((part) => part.id === "point");
  assert.equal(gradePart(point, [String(point.answer[0]), ""]).points, 1);
  assert.match(targetedFeedback(inflection, point, ["", ""]), /inputkoordinaten/);

  const chain = instantiate("diff3.power-chain", "feedback");
  const expression = chain.parts[0];
  const { a, b, exponent } = chain.parameters;
  assert.match(
    targetedFeedback(chain, expression, `${exponent}*(${a}*x+${b})^${exponent - 1}`),
    /indre lineære funktion mangler/,
  );

  const selected = composeSet({
    seed: "differentialregning",
    topics: ["differentiation"],
    minutes: 180,
  });
  assert.ok(selected.tasks.length > 0);
  assert.ok(selected.tasks.every((task) => task.topic === "differentiation"));
  assert.ok(new Set(selected.tasks.map((task) => task.module)).size >= 4);

  const completed = composeSet({
    seed: "modul-1",
    topics: ["differentiation"],
    minutes: 180,
    onlyCompleted: true,
    completed: ["diff.1"],
  });
  assert.ok(completed.tasks.length > 0);
  assert.ok(completed.tasks.every((task) => task.module === "diff.1"));
});
