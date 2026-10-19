import { normalPlotTasks } from "./normal-plots.js";
import { normalAlgebraTasks } from "./normal-algebra.js";
import { normalParameterTasks } from "./normal-parameters.js";
import { normalStandardTasks } from "./normal-standard.js";
import { normalTasks } from "./normal.js";
import { odeTasks } from "./ode.js";
import { integrationBankTasks, integrationLessonTasks } from './integration-complete.js';
import { integrationRepetitionTasks } from './integration-repetition.js';
// Integration point: import a new topic pack and add it here.
import { algebraTasks } from "./algebra.js";
import { equationTasks } from "./equations.js";
import { quadraticTasks } from "./quadratic.js";
import { compositeTasks } from "./composite.js";
import { calculusTasks } from "./calculus.js";
import { differentiationTasks } from "./differentiation.js";
import { geometryTasks } from "./geometry.js";
import { validateTask } from "../schema.js";
export const bank = [...normalPlotTasks, ...normalAlgebraTasks, ...normalParameterTasks, ...normalStandardTasks, ...normalTasks, ...odeTasks, ...algebraTasks, ...equationTasks, ...quadraticTasks, ...compositeTasks, ...calculusTasks, ...differentiationTasks, ...geometryTasks, ...integrationBankTasks, ...integrationRepetitionTasks];
if (new Set(bank.map((t) => t.id)).size !== bank.length)
  throw Error("Opgave-id skal være entydige i banken.");
export function seededRandom(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function instantiate(id, seed, version) {
  const source = bank.find((t) => t.id === id);
  if (!source) throw Error("Opgaven findes ikke længere.");
  // Published integral v1 tasks are immutable teaching fixtures. Resume old sets
  // with their original questions and answers; new selections use current versions.
  if (version !== undefined && version !== source.version) {
    const legacy = integrationLessonTasks.find(t => t.id === id && t.version === version);
    if (!legacy) throw Error("Den gemte opgaveversion understøttes ikke længere.");
    return validateTask(structuredClone(legacy));
  }
  const t = source.generate
    ? source.generate(seededRandom(`${seed}:${id}:${source.version}`))
    : structuredClone(source);
  if (t.id !== id || t.version !== source.version)
    throw Error("Generatoren skal bevare id og version.");
  return validateTask(t);
}
for (const t of bank) instantiate(t.id, "quality-check");
