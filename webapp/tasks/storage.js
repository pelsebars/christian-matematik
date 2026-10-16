import { SCHEMA_VERSION } from "./schema.js";
import { instantiate } from "./bank/index.js";
export const STORAGE_KEY = "christian-matematik.tasks.v1";
export function emptyState() {
  return { schema: SCHEMA_VERSION, completed: [], history: [], session: null };
}
export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { state: emptyState(), warning: "" };
    const data = JSON.parse(raw);
    if (
      data.schema !== SCHEMA_VERSION ||
      !Array.isArray(data.completed) ||
      !Array.isArray(data.history)
    )
      throw Error("Ukendt lagringsformat");
    data.completed = data.completed.filter((m) => typeof m === "string");
    data.history = data.history
      .filter(
        (h) =>
          h &&
          Number.isFinite(h.date) &&
          Number.isFinite(h.points) &&
          Number.isFinite(h.max) &&
          Array.isArray(h.items),
      )
      .slice(-30);
    if (data.session) {
      const s = data.session;
      if (
        !["training", "exam"].includes(s.mode) ||
        !["active", "submitted"].includes(s.status) ||
        typeof s.seed !== "string" ||
        !Array.isArray(s.items) ||
        !s.items.length ||
        s.items.length > 100 ||
        !Number.isInteger(s.index) ||
        s.index < 0 ||
        s.index >= s.items.length ||
        !Number.isFinite(s.startedAt) ||
        !Number.isFinite(s.minutes) ||
        typeof s.timer !== "boolean" ||
        !s.answers ||
        !s.checked ||
        !s.hints ||
        !s.marked ||
        !s.self
      )
        throw Error("Ufuldstændigt sæt");
      for (const key of ["answers", "checked", "hints", "marked", "self"])
        if (
          typeof s[key] !== "object" ||
          Array.isArray(s[key]) ||
          s[key] === null
        )
          throw Error("Ugyldige besvarelser");
      if (new Set(s.items.map((r) => r.id)).size !== s.items.length)
        throw Error("Gentagne opgaver");
      for (const ref of s.items) {
        const t = instantiate(ref.id, s.seed, ref.version);
        if (t.version !== ref.version)
          throw Error("En opgave har fået en ny version");
        for (const p of t.parts) {
          const v = s.answers[t.id]?.[p.id];
          if (v !== undefined) {
            if (["tuple", "set"].includes(p.type)) {
              if (
                !Array.isArray(v) ||
                v.length !== p.answer.length ||
                v.some((c) => typeof c !== "string" || c.length > 200)
              )
                throw Error("Ugyldige koordinater");
            } else if (typeof v !== "string" || v.length > 6000)
              throw Error("Ugyldigt svar");
          }
        }
      }
    }
    return { state: data, warning: "" };
  } catch {
    return {
      state: emptyState(),
      warning:
        "Det gemte sæt kunne ikke åbnes. Det kan skyldes en ny opgaveversion eller utilgængelig lagring. Du kan starte et nyt sæt.",
    };
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
