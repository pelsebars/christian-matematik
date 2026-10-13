import { topics, modules, goals } from "./catalog.js";
import { number, polynomial } from "./math.js";
export const SCHEMA_VERSION = 1;
export function validateTask(t) {
  const fail = (message) => {
    throw Error(`${t?.id || "Opgave"}: ${message}`);
  };
  if (
    !t ||
    !/^[-a-z0-9.]+$/.test(t.id) ||
    !Number.isInteger(t.version) ||
    t.version < 1
  )
    fail("id og version kræves");
  if (!topics[t.topic] || modules[t.module]?.topic !== t.topic)
    fail("ukendt emne/modul");
  if (
    !Array.isArray(t.goals) ||
    !t.goals.length ||
    t.goals.some((g) => !goals[g] || goals[g].module !== t.module)
  )
    fail("ukendt eller forkert læringsmål");
  if (
    !Array.isArray(t.prerequisites) ||
    t.prerequisites.some((m) => !modules[m])
  )
    fail("ugyldige forudsætninger");
  if (
    ![1, 2, 3].includes(t.difficulty) ||
    !["short", "medium", "complex"].includes(t.size) ||
    !Number.isFinite(t.minutes) ||
    t.minutes <= 0 ||
    typeof t.aids !== "boolean"
  )
    fail("ugyldige metadata");
  if (
    typeof t.prompt !== "string" ||
    !t.prompt.trim() ||
    !Array.isArray(t.hints) ||
    !t.hints.length ||
    t.hints.some((h) => typeof h !== "string" || !h.trim()) ||
    typeof t.solution !== "string" ||
    !t.solution.trim() ||
    !Array.isArray(t.errors) ||
    !t.errors.length
  )
    fail("tekst, hints, løsning og typiske fejl kræves");
  if (
    !Array.isArray(t.parts) ||
    !t.parts.length ||
    new Set(t.parts.map((p) => p.id)).size !== t.parts.length
  )
    fail("entydige delspørgsmål kræves");
  for (const p of t.parts) {
    if (
      !/^[-a-z0-9]+$/.test(p.id) ||
      typeof p.label !== "string" ||
      !p.label ||
      !Number.isInteger(p.points) ||
      p.points < 1
    )
      fail("ugyldigt delspørgsmål");
    if (
      !["number", "expression", "tuple", "set", "choice", "text"].includes(
        p.type,
      )
    )
      fail("ukendt svarformat");
    if (["number", "expression"].includes(p.type)) {
      try {
        p.type === "number" ? number(p.answer) : polynomial(p.answer);
      } catch {
        fail("ugyldigt facit");
      }
    }
    if (
      ["tuple", "set"].includes(p.type) &&
      (!Array.isArray(p.answer) ||
        !p.answer.length ||
        p.answer.some((a) => !Number.isFinite(a)) ||
        !Array.isArray(p.components) ||
        p.components.length !== p.answer.length)
    )
      fail("ugyldigt koordinat-/løsningssvar");
    if (
      p.type === "choice" &&
      (!Array.isArray(p.options) ||
        !p.options.some((o) => o.id === p.answer) ||
        new Set(p.options.map((o) => o.id)).size !== p.options.length)
    )
      fail("ugyldige svarmuligheder");
    if (
      p.type === "text" &&
      (!Array.isArray(p.checklist) ||
        !p.checklist.length ||
        !Array.isArray(p.concepts) ||
        !p.concepts.length)
    )
      fail("fritekst kræver tjekliste og begreber");
    if (
      p.tolerance !== undefined &&
      (!Number.isFinite(p.tolerance) || p.tolerance < 0)
    )
      fail("ugyldig tolerance");
    if (
      p.partial !== undefined &&
      (!["tuple", "set"].includes(p.type) || typeof p.partial !== "boolean")
    )
      fail("delpoint understøttes pr. komponent i tuple/set");
  }
  for (const e of t.errors)
    if (
      typeof e.feedback !== "string" ||
      !e.feedback ||
      !t.parts.some((p) => p.id === e.part)
    )
      fail("fejl skal knyttes til et delspørgsmål");
  return t;
}
