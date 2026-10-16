import test from "node:test";
import assert from "node:assert/strict";
import { bank, instantiate } from "../tasks/bank/index.js";
import { gradeTask, targetedFeedback } from "../tasks/grading.js";
import { composeSet } from "../tasks/selection.js";

const generatedIds = [
  "geo.walk", "geo.vector-arithmetic", "geo.midpoint", "geo.parallel-scale",
  "geo.dot", "geo.angle", "geo.orthogonal-parameter", "geo.angle-measure",
  "geo.projection", "geo.perpendicular", "geo.determinant", "geo.area",
  "geo.line-equation", "geo.line-direction", "geo.line-parameter",
  "geo.line-intersection", "geo.distance", "geo.line-angle",
  "geo.circle-read", "geo.circle-complete", "geo.circle-position",
  "geo.circle-axis", "geo.circle-line", "geo.circle-tangent",
];

const geometryTasks = (seed = "coverage") =>
  bank.map((source) => instantiate(source.id, seed)).filter((task) => task.topic === "planeGeometry");

const automaticAnswers = (task) => Object.fromEntries(task.parts.map((part) => [
  part.id,
  ["tuple", "set"].includes(part.type)
    ? part.answer.map(String)
    : part.type === "text" ? "Faglig forklaring" : String(part.answer),
]));

const vectorLength = ([a, b]) => Math.hypot(a, b);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const determinant = (a, b) => a[0] * b[1] - a[1] * b[0];
const near = (a, b, tolerance = 1e-9) => Math.abs(a - b) <= tolerance;

test("Plangeometribanken dækker alle fem moduler uden dubletter eller metodeafslørende prøvetekster", () => {
  const tasks = geometryTasks();
  assert.equal(tasks.length, 30);
  assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
  assert.deepEqual(
    Object.fromEntries(["geo.1", "geo.2", "geo.3", "geo.4", "geo.5"].map((module) => [module, tasks.filter((task) => task.module === module).length])),
    { "geo.1": 5, "geo.2": 5, "geo.3": 6, "geo.4": 7, "geo.5": 7 },
  );

  const coveredGoals = new Set(tasks.flatMap((task) => task.goals));
  for (const goal of [
    "geo.point-vector", "geo.vector", "geo.vector-arithmetic", "geo.length", "geo.midpoint", "geo.vector-reasoning",
    "geo.dot", "geo.orthogonal", "geo.angle", "geo.angle-measure", "geo.angle-geometry",
    "geo.projection", "geo.perpendicular", "geo.determinant", "geo.parallel", "geo.orientation", "geo.area",
    "geo.line-form", "geo.line-vectors", "geo.line-equation", "geo.line-intersection", "geo.line-relations", "geo.line",
    "geo.circle-form", "geo.circle-complete", "geo.circle-position", "geo.circle-intersection", "geo.circle-tangent", "geo.circle",
  ]) assert.ok(coveredGoals.has(goal), goal);

  const signatures = tasks.map((task) => task.prompt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  assert.equal(new Set(signatures).size, signatures.length);

  for (const task of tasks) {
    assert.ok(task.hints.length >= 2, task.id);
    assert.doesNotMatch(task.prompt, /brug (?:Pythagoras|cosinus|tangens)|projektion|skalarprodukt|determinant|kvadratkomplet|afstandformel/i, task.id);
    for (const part of task.parts)
      assert.ok(task.errors.some((error) => error.part === part.id && error.answer === undefined), `${task.id}:${part.id}`);
    for (const source of [task.prompt, ...task.parts.flatMap((part) => [part.label, ...(part.options || []).map((option) => option.label)]), ...task.hints, task.solution]) {
      assert.doesNotMatch(source, /\([+-]?\d+\s*[,;]\s*[+-]?\d+\)|sqrt\(|\^2|\+\/-/i, task.id);
      for (const tag of source.match(/<math\b[^>]*>/g) || [])
        assert.match(tag, /xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/, task.id);
    }
  }
});

test("Alle seedede geometrifamilier er deterministiske, varierede og matematisk gyldige over 1000 seeds", () => {
  const variants = Object.fromEntries(generatedIds.map((id) => [id, new Set()]));
  for (let seed = 0; seed < 1000; seed++) {
    for (const id of generatedIds) {
      const task = instantiate(id, String(seed));
      assert.deepEqual(task, instantiate(id, String(seed)), id);
      assert.ok(task.parameters, id);
      variants[id].add(JSON.stringify({ prompt: task.prompt, answers: task.parts.map((part) => part.answer) }));
      gradeTask(task, automaticAnswers(task)).forEach((grade, index) =>
        assert.equal(grade.points, task.parts[index].type === "text" ? null : task.parts[index].points, `${id}:${seed}`));
    }

    const walk = instantiate("geo.walk", String(seed));
    assert.deepEqual(walk.parameters.end.map((value, i) => value - walk.parameters.start[i]), walk.parameters.delta);
    assert.equal(vectorLength(walk.parameters.delta), walk.parameters.length);

    const arithmetic = instantiate("geo.vector-arithmetic", String(seed)).parameters;
    assert.deepEqual(arithmetic.sum, arithmetic.a.map((value, i) => value + arithmetic.b[i]));
    assert.deepEqual(arithmetic.difference, arithmetic.a.map((value, i) => value - arithmetic.b[i]));
    assert.deepEqual(arithmetic.combination, arithmetic.a.map((value, i) => arithmetic.scale * value + arithmetic.b[i]));

    const midpoint = instantiate("geo.midpoint", String(seed)).parameters;
    assert.deepEqual(midpoint.midpoint, midpoint.p.map((value, i) => (value + midpoint.q[i]) / 2));

    const parallel = instantiate("geo.parallel-scale", String(seed)).parameters;
    assert.deepEqual(parallel.b, parallel.a.map((value) => parallel.factor * value));
    assert.equal(parallel.direction, parallel.factor > 0 ? "same" : "opposite");

    const product = instantiate("geo.dot", String(seed)).parameters;
    assert.equal(product.dot, dot(product.a, product.b));

    const angleType = instantiate("geo.angle", String(seed)).parameters;
    assert.equal(angleType.expected, angleType.dot > 0 ? "acute" : angleType.dot < 0 ? "obtuse" : "right");

    const orthogonal = instantiate("geo.orthogonal-parameter", String(seed)).parameters;
    assert.equal(orthogonal.a[0] * orthogonal.root + orthogonal.a[1] * orthogonal.q, 0);

    const measured = instantiate("geo.angle-measure", String(seed)).parameters;
    const independentAngle = Math.acos(measured.dot / (vectorLength(measured.a) * vectorLength(measured.b))) * 180 / Math.PI;
    assert.ok(near(measured.angle, independentAngle, 0.051));

    const projection = instantiate("geo.projection", String(seed)).parameters;
    assert.deepEqual(projection.projection, projection.b.map((value) => projection.scale * value));
    assert.equal(dot(projection.a.map((value, i) => value - projection.projection[i]), projection.b), 0);

    const perpendicular = instantiate("geo.perpendicular", String(seed)).parameters;
    assert.equal(dot(perpendicular.a, perpendicular.perpendicular), 0);
    assert.equal(determinant(perpendicular.a, perpendicular.perpendicular), dot(perpendicular.a, perpendicular.a));

    const determinantTask = instantiate("geo.determinant", String(seed)).parameters;
    assert.equal(determinantTask.determinant, determinant(determinantTask.a, determinantTask.b));

    const area = instantiate("geo.area", String(seed)).parameters;
    assert.equal(area.area, Math.abs(determinant(area.a, area.b)) / 2);

    const line = instantiate("geo.line-equation", String(seed)).parameters;
    assert.equal(dot(line.normal, line.point) + line.c, 0);

    const direction = instantiate("geo.line-direction", String(seed)).parameters;
    assert.equal(dot(direction.normal, direction.direction), 0);

    const lineParameter = instantiate("geo.line-parameter", String(seed)).parameters;
    assert.deepEqual(lineParameter.target, lineParameter.start.map((value, i) => value + lineParameter.t * lineParameter.direction[i]));

    const intersection = instantiate("geo.line-intersection", String(seed)).parameters;
    assert.equal(dot(intersection.normals[0], intersection.intersection) + intersection.c1, 0);
    assert.equal(dot(intersection.normals[1], intersection.intersection) + intersection.c2, 0);
    assert.notEqual(determinant(...intersection.normals), 0);

    const distance = instantiate("geo.distance", String(seed)).parameters;
    assert.equal(Math.abs(distance.a * distance.point[0] + distance.b * distance.point[1] + distance.c) / distance.normalLength, distance.distance);

    const lineAngle = instantiate("geo.line-angle", String(seed)).parameters;
    assert.ok(near(lineAngle.angle, Math.atan2(lineAngle.direction[1], lineAngle.direction[0]) * 180 / Math.PI, 0.051));

    const circleRead = instantiate("geo.circle-read", String(seed)).parameters;
    assert.ok(circleRead.radius > 0);

    const complete = instantiate("geo.circle-complete", String(seed)).parameters;
    assert.equal(complete.f, complete.center[0] ** 2 + complete.center[1] ** 2 - complete.radius ** 2);

    const position = instantiate("geo.circle-position", String(seed)).parameters;
    assert.equal(position.expected, position.distanceSquared < position.radius ** 2 ? "inside" : position.distanceSquared === position.radius ** 2 ? "on" : "outside");

    const axis = instantiate("geo.circle-axis", String(seed)).parameters;
    for (const root of axis.roots)
      assert.equal((root - axis.center[0]) ** 2 + axis.center[1] ** 2, axis.radiusSquared);

    const circleLine = instantiate("geo.circle-line", String(seed)).parameters;
    for (const root of circleLine.roots)
      assert.equal((root - circleLine.center[0]) ** 2 + (circleLine.lineY - circleLine.center[1]) ** 2, circleLine.radius ** 2);

    const tangent = instantiate("geo.circle-tangent", String(seed)).parameters;
    assert.equal(dot(tangent.radial, tangent.point) + tangent.c, 0);
    assert.ok(near(vectorLength(tangent.radial), tangent.radius));
  }

  for (const [id, values] of Object.entries(variants)) assert.ok(values.size >= 4, `${id} gav kun ${values.size} varianter`);
});

test("Delpoint, målrettet feedback og modulforudsætninger fungerer for geometrien", () => {
  const walk = instantiate("geo.walk", "partial");
  const partial = gradeTask(walk, { vector: [String(walk.parts[0].answer[0]), "999"], length: walk.parts[1].answer });
  assert.equal(partial[0].points, 1);
  assert.equal(partial[1].points, 2);
  assert.match(targetedFeedback(walk, walk.parts[1], String(walk.parameters.length ** 2)), /kvadrat/i);

  const area = instantiate("geo.area", "feedback");
  assert.match(targetedFeedback(area, area.parts[0], String(Math.abs(area.parameters.determinant))), /parallelogram/i);

  const circle = instantiate("geo.circle-read", "feedback");
  assert.match(targetedFeedback(circle, circle.parts[1], String(circle.parameters.radius ** 2)), /radius i anden/i);

  const firstThree = composeSet({ seed: "geometry-first-three", topics: ["planeGeometry"], onlyCompleted: true, completed: ["geo.1", "geo.2", "geo.3"], minutes: 300, distribution: { short: 30, medium: 30, complex: 30 } }).tasks;
  assert.ok(firstThree.every((task) => ["geo.1", "geo.2", "geo.3"].includes(task.module)));
  assert.equal(firstThree.length, 16);

  const all = composeSet({ seed: "geometry-all", topics: ["planeGeometry"], onlyCompleted: true, completed: ["geo.1", "geo.2", "geo.3", "geo.4", "geo.5"], minutes: 300, distribution: { short: 30, medium: 30, complex: 30 } }).tasks;
  assert.equal(all.length, 30);
  assert.ok(all.every((task) => task.topic === "planeGeometry"));
});
