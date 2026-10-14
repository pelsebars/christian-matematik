import { integrationSubstitutionTasks } from './integration-substitution.js';
import { integrationSolidTasks } from './integration-solids.js';
import { integrationRepetitionTasks } from './integration-repetition.js';
import { integrationAreaTasks } from "./integration-areas.js";
import { integrationDefiniteTasks } from "./integration-definite.js";
import { integrationGraphTasks } from "./integration-graphs.js";
// Integration point: import a new topic pack and add it here.
import { integrationTasks } from "./integration.js";
import { algebraTasks } from "./algebra.js";
import { calculusTasks } from "./calculus.js";
import { geometryTasks } from "./geometry.js";
import { validateTask } from "../schema.js";
export const bank = [...algebraTasks, ...calculusTasks, ...geometryTasks, ...integrationTasks, ...integrationGraphTasks, ...integrationDefiniteTasks, ...integrationAreaTasks, ...integrationRepetitionTasks, ...integrationSolidTasks, ...integrationSubstitutionTasks];
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
export function instantiate(id, seed) {
  const source = bank.find((t) => t.id === id);
  if (!source) throw Error("Opgaven findes ikke længere.");
  const t = source.generate
    ? source.generate(seededRandom(`${seed}:${id}:${source.version}`))
    : structuredClone(source);
  if (t.id !== id || t.version !== source.version)
    throw Error("Generatoren skal bevare id og version.");
  return validateTask(t);
}
for (const t of bank) instantiate(t.id, "quality-check");
