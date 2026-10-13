import { number, equivalent } from "./math.js";
export function blank(value) {
  return Array.isArray(value)
    ? value.every((v) => !String(v ?? "").trim())
    : !String(value ?? "").trim();
}
const near = (a, b, t) => Math.abs(a - b) <= t;
export function gradePart(part, value) {
  if (blank(value))
    return {
      status: "unanswered",
      points: 0,
      max: part.points,
      message: "Dette delspørgsmål er ubesvaret.",
    };
  if (part.type === "text")
    return {
      status: "manual",
      points: null,
      max: part.points,
      message:
        "Din forklaring kræver egen vurdering. Sammenlign med løsningen og tjeklisten.",
    };
  try {
    let fraction = 0;
    const tolerance = part.tolerance ?? 1e-9;
    if (part.type === "number")
      fraction = near(number(value), number(part.answer), tolerance) ? 1 : 0;
    if (part.type === "expression")
      fraction = equivalent(value, part.answer, tolerance) ? 1 : 0;
    if (part.type === "choice") fraction = value === part.answer ? 1 : 0;
    if (["tuple", "set"].includes(part.type)) {
      if (!Array.isArray(value) || value.length !== part.answer.length)
        throw Error("Udfyld de separate svarfelter.");
      const available = [...part.answer];
      let matches = 0;
      value.forEach((v, i) => {
        if (!String(v ?? "").trim()) return;
        const numeric = number(v);
        if (part.type === "tuple") {
          if (near(numeric, part.answer[i], tolerance)) matches++;
        } else {
          const j = available.findIndex((a) => near(numeric, a, tolerance));
          if (j >= 0) {
            matches++;
            available.splice(j, 1);
          }
        }
      });
      fraction = part.partial
        ? matches / part.answer.length
        : Number(matches === part.answer.length);
    }
    return {
      status:
        fraction === 1 ? "correct" : fraction > 0 ? "partial" : "incorrect",
      points: part.points * fraction,
      max: part.points,
      message:
        fraction === 1
          ? "Det passer."
          : fraction > 0
            ? "Du har nogle af delene på plads. Se de resterende trin i løsningen."
            : "Se løsningen og find det trin, du vil øve næste gang.",
    };
  } catch (e) {
    return {
      status: "review",
      points: null,
      max: part.points,
      message: `Svaret kan ikke bedømmes sikkert her. ${e.message} Sammenlign med løsningen.`,
    };
  }
}
export function gradeTask(task, answers = {}, self = {}) {
  return task.parts.map((p) => {
    const result = gradePart(p, answers[p.id]);
    if (
      result.points === null &&
      Number.isFinite(self[p.id]) &&
      self[p.id] >= 0 &&
      self[p.id] <= p.points
    ) {
      result.points = self[p.id];
      result.status = "self";
      result.message = "Point angivet ved egen vurdering.";
    }
    return { ...result, id: p.id };
  });
}
export function targetedFeedback(task, part, value) {
  const rules = task.errors.filter((e) => e.part === part.id);
  const match = rules.find((e) => {
    if (e.answer === undefined) return false;
    try {
      return part.type === "expression"
        ? equivalent(value, e.answer)
        : part.type === "number"
          ? near(number(value), number(e.answer), part.tolerance ?? 1e-9)
          : value === e.answer;
    } catch {
      return false;
    }
  });
  return (
    match?.feedback ||
    rules.find((e) => e.answer === undefined)?.feedback ||
    "Sammenlign dit svar med hvert trin i løsningen."
  );
}
