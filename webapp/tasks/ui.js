import { accountStorage, markCorrect } from '../account/store.js';
import { topics, modules, goals } from "./catalog.js";
import { bank, instantiate } from "./bank/index.js";
import { composeSet } from "./selection.js";
import { gradeTask, targetedFeedback, blank } from "./grading.js";
import { escapeHTML as esc, expressionMath } from "./math.js";
import { loadState, saveState } from "./storage.js";
const root = document.querySelector("#tasksView");
let storage;
try {
  storage = accountStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw Error("Lagring blokeret");
    },
  };
}
const loaded = loadState(storage);
let state = loaded.state,
  warning = loaded.warning,
  confirmSubmit = false;
const button = (text, action, extra = "") =>
  `<button type="button" class="task-button" data-task-action="${action}" ${extra}>${text}</button>`;
const tasks = () =>
  state.session.items.map((ref) => instantiate(ref.id, state.session.seed, ref.version));
function persist() {
  if (!saveState(storage, state))
    warning =
      "Browseren kan ikke gemme arbejdet lokalt. Hold siden åben, til du er færdig.";
  const status = root.querySelector("#taskSave");
  if (status) status.textContent = warning || "Se gemmestatus i sidemenuen.";
}
const header = () =>
  `<header class="page-intro"><p class="eyebrow">Dit arbejdsrum</p><h1>Opgaver</h1><p class="page-lead">Prøv selv, vælg din vej, og brug løsningerne til at finde næste skridt.</p></header><p id="taskSave" class="task-save" role="status">${esc(warning || "Dit arbejde gemmes på din konto. Se gemmestatus i sidemenuen.")}</p>`;
function render(focus = false) {
  const s = state.session;
  root.innerHTML =
    header() + (s ? (s.status === "submitted" ? results() : work()) : setup());
  if (focus) {
    const heading = root.querySelector("#taskHeading");
    heading?.focus();
  }
}
function setup() {
  const readyModules = new Set(
    bank.map((t) => instantiate(t.id, "catalog").module),
  );
  return `<section class="task-panel"><h2 id="taskHeading" tabindex="-1">Vælg dit sæt</h2><p>Blandet træning giver hints og feedback efter hver opgave. Et prøvesæt viser først løsninger og point efter samlet aflevering.</p><form id="taskSetup">
 <div class="task-settings">
 <label>Tilstand<select name="mode"><option value="training">Blandet træning</option><option value="exam">Prøvesæt</option></select></label>
 <label>Ønsket tid i minutter<input name="minutes" type="number" min="3" max="180" value="60" required></label>
 <label>Sværhedsgrad<select name="difficulty"><option value="0">Blandet</option><option value="1">Grundlæggende</option><option value="2">Øvet</option><option value="3">Udfordrende</option></select></label>
 <label>Hjælpemidler<select name="aids"><option value="all">Både med og uden</option><option value="no">Uden hjælpemidler</option><option value="yes">Med hjælpemidler</option></select></label>
 <label>Seed til at genskabe sættet<input name="seed" value="${esc(new Date().toLocaleDateString("da-DK"))}" maxlength="80" required></label>
 <label class="task-check"><input name="timer" type="checkbox"> Vis tidtagning i prøvesæt</label>
 </div>
 <fieldset><legend>Hovedemner</legend><p>Ingen markering betyder alle tilgængelige emner.</p><div class="task-checks">${Object.entries(
   topics,
 )
   .map(
     ([id, title]) =>
       `<label><input type="checkbox" name="topics" value="${id}"> ${esc(title)}</label>`,
   )
   .join("")}</div></fieldset>
 <fieldset><legend>Fordeling af opgaver</legend><div class="task-settings">${[
   ["short", "Korte", 6],
   ["medium", "Mellemstore", 4],
   ["complex", "Komplekse", 2],
 ]
   .map(
     ([id, title, value]) =>
       `<label>${title}<input name="${id}" type="number" min="0" max="20" value="${value}" required></label>`,
   )
   .join(
     "",
   )}</div><p>Demonstrationsbanken har ${bank.length} opgaver. Et mindre sæt bruger de opgaver, der passer til dine valg, uden at gentage samme opgave.</p></fieldset>
 <details><summary>Gennemførte moduler</summary><p>Markér selv de moduler, du har gennemført. Det registreres kun på denne enhed. Moduler uden demonstrationsopgaver kan stadig være forudsætninger.</p><div class="task-checks">${Object.entries(
   modules,
 )
   .map(
     ([id, m]) =>
       `<label><input type="checkbox" data-completed="${id}" ${state.completed.includes(id) ? "checked" : ""}> ${esc(m.name)}${readyModules.has(id) ? "" : " (ingen opgaver endnu)"}</label>`,
   )
   .join("")}</div></details>
 <label class="task-check"><input name="onlyCompleted" type="checkbox"> Kun gennemførte moduler og forudsætninger</label>
 <label class="task-check"><input name="useHistory" type="checkbox" checked> Brug tidligere resultater til at undgå gentagelser og støtte repetition</label>
 <p>Ved samme seed, valg og historik genskabes samme sæt. Slå historik fra for at dele et sæt med andre.</p>
 <p id="taskSetupMessage" role="status"></p><button class="task-button task-primary" type="submit">Start sæt</button></form></section>
 ${
   state.history.length
     ? `<section class="task-panel"><h2>Tidligere sæt</h2><ul>${state.history
         .slice(-5)
         .reverse()
         .map(
           (h) =>
             `<li>${esc(new Date(h.date).toLocaleDateString("da-DK"))} · ${h.mode === "exam" ? "Prøvesæt" : "Træning"} · ${h.points} af ${h.max} point${h.pending ? " · kræver egen vurdering" : ""}${h.self ? " · med egen vurdering" : ""}</li>`,
         )
         .join("")}</ul></section>`
     : ""
 }`;
}
function field(part, answer, locked) {
  const disabled = locked ? "disabled" : "";
  const name = `answer-${part.id}`;
  if (part.type === "choice")
    return `<div class="task-checks">${part.options.map((o) => `<label><input type="radio" name="${name}" data-part="${part.id}" value="${esc(o.id)}" ${answer === o.id ? "checked" : ""} ${disabled}> ${o.label}</label>`).join("")}</div>`;
  if (["tuple", "set"].includes(part.type))
    return `<div class="task-components">${part.components.map((label, i) => `<label>${esc(label)}<input type="text" inputmode="text" autocomplete="off" data-part="${part.id}" data-component="${i}" value="${esc(answer?.[i] || "")}" ${disabled}></label>`).join("")}</div>`;
  if (part.type === "text")
    return `<textarea aria-label="${esc(part.label)}" data-part="${part.id}" rows="5" maxlength="6000" ${disabled}>${esc(answer || "")}</textarea>`;
  return `<input type="text" aria-label="${esc(part.label)}" data-part="${part.id}" autocomplete="off" maxlength="200" value="${esc(answer || "")}" ${disabled}><div class="task-preview" data-preview="${part.id}" aria-live="polite">${expressionMath(answer || "")}</div>`;
}
function work() {
  const s = state.session,
    list = tasks(),
    t = list[s.index],
    locked = s.mode === "training" && s.checked[t.id];
  const done = Object.values(s.checked).filter(Boolean).length;
  return `<section class="task-panel task-session"><div class="task-topline"><h2 id="taskHeading" tabindex="-1">${s.mode === "exam" ? "Prøvesæt" : "Blandet træning"} · Opgave ${s.index + 1} af ${list.length}</h2>${s.timer && s.mode === "exam" ? '<p id="taskTimer" role="timer" aria-label="Forløbet tid"></p>' : ""}</div><p>${s.minutes} minutters forventet arbejdstid · Seed: ${esc(s.seed)}${s.mode === "training" ? ` · ${done} besvarede` : ""}</p>
 ${s.requested > list.length ? `<p class="hint">Banken og dine filtre gav ${list.length} af de ${s.requested} ønskede opgaver. Sættet er tilpasset uden gentagelser.</p>` : ""}
 <nav class="task-numbers" aria-label="Opgaver i sættet">${list.map((q, i) => `<button class="task-button ${s.index === i ? "is-active" : ""}" type="button" data-task-action="jump" data-index="${i}" ${s.index === i ? 'aria-current="step"' : ""} aria-label="Opgave ${i + 1}${s.marked[q.id] ? ", markeret til senere" : ""}${hasAnswer(q) ? ", har svar" : ""}">${i + 1}${s.marked[q.id] ? " ★" : ""}${hasAnswer(q) ? " •" : ""}</button>`).join("")}</nav>
 <article class="task-question"><div class="task-topline"><p>${t.aids ? "Hjælpemidler tilladt" : "Uden hjælpemidler"} · ${t.parts.reduce((a, p) => a + p.points, 0)} point</p>${button(s.marked[t.id] ? "★ Markeret til senere" : "Markér til senere", "mark", `aria-pressed="${Boolean(s.marked[t.id])}"`)}</div>${t.prompt}${t.figure || ""}
 <p class="task-input-help">Skriv tal eller brøker i felterne. Udtryk kan indtastes med parenteser og potens via tastaturet; de vises matematisk nedenunder. Polynomier kan vurderes automatisk. Andre udtryk gennemgås efter aflevering.</p>
 ${t.parts.map((p) => `<fieldset class="task-part"><legend>${p.label} <span class="task-muted">(${p.points} point)</span></legend>${field(p, s.answers[t.id]?.[p.id], locked)}</fieldset>`).join("")}
 ${
   s.mode === "training"
     ? `<div class="task-actions">${!locked ? button("Tjek besvarelse", "check") : ""}${!locked && s.hints[t.id] < t.hints.length ? button("Vis næste hint", "hint") : !locked && !s.hints[t.id] ? button("Vis første hint", "hint") : ""}</div><div aria-live="polite">${t.hints
         .slice(0, s.hints[t.id] || 0)
         .map(
           (h, i) => `<p class="hint"><strong>Hint ${i + 1}:</strong> ${h}</p>`,
         )
         .join("")}${locked ? feedback(t) : ""}</div>`
     : ""
 }
 </article><div class="task-actions">${s.index ? button("Forrige", "previous") : ""}${s.index < list.length - 1 ? button("Næste", "next") : ""}${button(s.mode === "exam" ? "Aflever prøvesæt" : "Afslut træning", "finish")}</div>
 ${confirmSubmit ? `<div class="task-confirm" role="region" aria-label="Samlet aflevering"><h3>Klar til samlet aflevering?</h3><p>${list.filter((q) => !hasAnswer(q)).length} opgaver er helt ubesvarede. ${list.filter((q) => s.marked[q.id]).length} er markeret til senere. Efter aflevering kan svarene gennemgås, og opgaver kan prøves igen.</p>${button("Aflever og se resultat", "submit")}${button("Fortsæt arbejdet", "cancel")}</div>` : ""}</section>`;
}
function hasAnswer(t) {
  return t.parts.some((p) => !blank(state.session.answers[t.id]?.[p.id]));
}
function feedback(t) {
  const s = state.session,
    grades = gradeTask(t, s.answers[t.id], s.self[t.id]);
  return `<section class="task-feedback"><h3>Feedback og næste skridt</h3><p>${esc(topics[t.topic])} · ${esc(modules[t.module].name)}</p><ul>${t.goals.map((g) => `<li>${esc(goals[g].text)}</li>`).join("")}</ul>${t.parts
    .map((p, i) => {
      const r = grades[i];
      return `<div class="task-part"><h4>${p.label}</h4><p>${r.points === null ? "Afventer egen vurdering" : `${r.points} af ${r.max} point${r.status === "self" ? " · egen vurdering" : ""}`} · ${esc(r.message)}</p>${!["correct", "self"].includes(r.status) ? `<p>${esc(targetedFeedback(t, p, s.answers[t.id]?.[p.id]))}</p>` : ""}${p.type === "text" ? `<p><strong>Faglig tjekliste</strong></p><ul>${p.checklist.map((c) => `<li>${esc(c)}</li>`).join("")}</ul><p>Centrale begreber: ${p.concepts.map(esc).join(", ")}.</p>` : ""}${r.points === null || r.status === "self" ? `<label>Egen vurdering (ikke automatisk bedømmelse)<select data-self-task="${t.id}" data-self-part="${p.id}"><option value="">Vælg efter gennemgang</option>${Array.from({ length: p.points + 1 }, (_, j) => `<option value="${j}" ${s.self[t.id]?.[p.id] === j ? "selected" : ""}>${j} point</option>`).join("")}</select></label>` : ""}</div>`;
    })
    .join("")}
 <h3>Gennemregnet løsning</h3>${t.solution}<details><summary>Typiske fejl</summary><ul>${t.errors.map((e) => `<li>${esc(e.feedback)}</li>`).join("")}</ul></details>${grades.some((g) => g.points !== g.max) ? button(`Repetér: ${esc(modules[t.module].name)}`, "repeat-module", `data-module="${t.module}"`) : ""}</section>`;
}
function totals(list) {
  const s = state.session;
  return list
    .flatMap((t) => gradeTask(t, s.answers[t.id], s.self[t.id]))
    .reduce(
      (a, g) => ({
        points: a.points + (g.points ?? 0),
        max: a.max + g.max,
        pending: a.pending + (g.points === null ? g.max : 0),
        self: a.self + (g.status === "self" ? g.max : 0),
      }),
      { points: 0, max: 0, pending: 0, self: 0 },
    );
}
function aggregate(list, key) {
  const ids = [
    ...new Set(list.flatMap((t) => (key === "topic" ? [t.topic] : t.goals))),
  ];
  return `<ul>${ids
    .map((id) => {
      const ts = list.filter((t) =>
          key === "topic" ? t.topic === id : t.goals.includes(id),
        ),
        r = totals(ts);
      return `<li>${esc(key === "topic" ? topics[id] : goals[id].text)}: ${r.points} af ${r.max} point${r.pending ? ` · ${r.pending} point afventer vurdering` : ""}${r.self ? " · med egen vurdering" : ""}</li>`;
    })
    .join("")}</ul>`;
}
function results() {
  const s = state.session,
    list = tasks(),
    r = totals(list);
  const weak = list.filter((t) =>
    gradeTask(t, s.answers[t.id], s.self[t.id]).some(
      (g) => g.status !== "correct" && g.points !== g.max,
    ),
  );
  const repeat = [...new Set(weak.map((t) => t.module))];
  return `<section class="task-panel"><h2 id="taskHeading" tabindex="-1">Dit resultat og næste skridt</h2><p class="task-score">${r.points} af ${r.max} point</p>${r.pending ? `<p>${r.pending} point afventer egen vurdering. Disse svar tæller endnu ikke som forkerte.</p>` : ""}${r.self ? `<p>${r.self} mulige point er vurderet af dig selv. De øvrige er bedømt automatisk.</p>` : ""}<p>Brug resultatet til at vælge, hvad du vil arbejde med næste gang. Ét usikkert trin kan øves særskilt.</p><p>${list.filter((t) => !hasAnswer(t)).length} helt ubesvarede opgaver · ${list.filter((t) => s.marked[t.id]).length} markeret til senere · ${list.flatMap((t) => gradeTask(t, s.answers[t.id], s.self[t.id])).filter((g) => g.status === "unanswered").length} ubesvarede delspørgsmål.</p><p>Seed: ${esc(s.seed)}${s.timer ? ` · Forløbet tid: ${Math.floor((s.endedAt - s.startedAt) / 60000)} minutter` : ""}</p>
 <h3>Fordelt på hovedemner</h3>${aggregate(list, "topic")}<h3>Fordelt på læringsmål</h3>${aggregate(list, "goal")}<p>En opgave kan knyttes til flere læringsmål. Pointene kan derfor optræde under flere mål.</p>
 ${repeat.length ? `<h3>Forslag til repetition</h3><div class="task-actions">${repeat.map((id) => button(esc(modules[id].name), "repeat-module", `data-module="${id}"`)).join("")}</div>` : ""}
 <div class="task-actions">${weak.length ? button("Prøv fejlbesvarede og uafklarede opgaver igen", "retry") : ""}${button("Vælg et nyt sæt", "new")}</div></section>
 ${list.map((t, i) => `<details class="task-panel"><summary>Opgave ${i + 1}${s.marked[t.id] ? " · markeret" : ""} · ${totals([t]).points} af ${totals([t]).max} point</summary>${t.prompt}${t.figure || ""}<h3>Din besvarelse</h3>${t.parts.map((p) => `<fieldset disabled class="task-part"><legend>${p.label}</legend>${field(p, s.answers[t.id]?.[p.id], true)}</fieldset>`).join("")}${feedback(t)}</details>`).join("")}`;
}
function start(list, options) {
  state.session = {
    mode: options.mode,
    status: "active",
    seed: options.seed,
    items: list.map((t) => ({ id: t.id, version: t.version })),
    index: 0,
    answers: {},
    checked: {},
    hints: {},
    marked: {},
    self: {},
    startedAt: Date.now(),
    timer: options.mode === "exam" && options.timer,
    minutes: options.minutes,
    requested: options.requested,
  };
  confirmSubmit = false;
  persist();
  render(true);
}
function record() {
  const s = state.session,
    list = tasks(),
    r = totals(list);
  const entry = {
    id: s.startedAt,
    date: s.endedAt,
    mode: s.mode,
    ...r,
    items: list.map((t) => ({ id: t.id, ...totals([t]) })),
  };
  state.history = state.history.filter((h) => h.id !== s.startedAt);
  state.history.push(entry);
  state.history = state.history.slice(-30);
}
root.addEventListener("submit", (event) => {
  if (event.target.id !== "taskSetup") return;
  event.preventDefault();
  const f = new FormData(event.target);
  const options = {
    mode: f.get("mode"),
    seed: f.get("seed").trim(),
    minutes: Number(f.get("minutes")),
    difficulty: Number(f.get("difficulty")),
    aids: f.get("aids"),
    topics: f.getAll("topics"),
    onlyCompleted: f.has("onlyCompleted"),
    completed: state.completed,
    distribution: Object.fromEntries(
      ["short", "medium", "complex"].map((k) => [k, Number(f.get(k))]),
    ),
    timer: f.has("timer"),
  };
  const result = composeSet(options, f.has("useHistory") ? state.history : []);
  if (!result.tasks.length) {
    root.querySelector("#taskSetupMessage").textContent =
      "Ingen opgaver passer til valgene. Prøv flere moduler, længere tid eller andre filtre.";
    return;
  }
  start(result.tasks, {
    ...options,
    minutes: result.minutes,
    requested: result.requested,
  });
});
root.addEventListener("input", (event) => {
  const input = event.target,
    s = state.session;
  if (!input.dataset.part || !s || s.status !== "active") return;
  const t = tasks()[s.index];
  if (s.checked[t.id]) return;
  s.answers[t.id] ??= {};
  const part = input.dataset.part;
  if (input.dataset.component !== undefined) {
    const p = t.parts.find((p) => p.id === part);
    if (!Array.isArray(s.answers[t.id][part]))
      s.answers[t.id][part] = Array(p.answer.length).fill("");
    s.answers[t.id][part][Number(input.dataset.component)] = input.value;
  } else s.answers[t.id][part] = input.value;
  const preview = root.querySelector(`[data-preview="${part}"]`);
  if (preview) preview.innerHTML = expressionMath(input.value);
  persist();
  root.querySelectorAll('[data-task-action="jump"]').forEach((b, i) => {
    const q = tasks()[i];
    b.textContent = `${i + 1}${s.marked[q.id] ? " ★" : ""}${hasAnswer(q) ? " •" : ""}`;
    b.setAttribute(
      "aria-label",
      `Opgave ${i + 1}${s.marked[q.id] ? ", markeret til senere" : ""}${hasAnswer(q) ? ", har svar" : ""}`,
    );
  });
});
root.addEventListener("change", (event) => {
  const input = event.target;
  if (input.dataset.completed) {
    const id = input.dataset.completed;
    state.completed = state.completed.filter((m) => m !== id);
    if (input.checked) state.completed.push(id);
    persist();
  }
  if (input.dataset.selfTask) {
    const s = state.session,
      id = input.dataset.selfTask,
      p = input.dataset.selfPart;
    if (
      !s ||
      !(s.status === "submitted" || (s.mode === "training" && s.checked[id]))
    )
      return;
    s.self[id] ??= {};
    if (input.value === "") delete s.self[id][p];
    else s.self[id][p] = Number(input.value);
    if (s.status === "submitted") record();
    persist();
    const openDetails = [...root.querySelectorAll("details[open]")].map((d) =>
      [...root.querySelectorAll("details")].indexOf(d),
    );
    render();
    openDetails.forEach((i) => {
      const d = root.querySelectorAll("details")[i];
      if (d) d.open = true;
    });
    root
      .querySelector(`[data-self-task="${id}"][data-self-part="${p}"]`)
      ?.focus();
  }
});
root.addEventListener("click", (event) => {
  const b = event.target.closest("[data-task-action]");
  if (!b) return;
  const action = b.dataset.taskAction,
    s = state.session;
  if (action === "repeat-module") {
    const m = modules[b.dataset.module];
    if (m.topic === "differentialEquations" && window.openOdeSection) {
      window.openOdeSection(m.section);
      return;
    }
    if (m.topic === "integration" && window.openIntegralSection) {
      window.openIntegralSection(m.section);
      return;
    }
    window.showMathView(m.topic);
    requestAnimationFrame(() =>
      document
        .getElementById(m.section)
        ?.scrollIntoView({ behavior: "smooth" }),
    );
    return;
  }
  if (action === "new") {
    state.session = null;
    persist();
    render(true);
    return;
  }
  if (!s) return;
  const list = tasks(),
    t = list[s.index];
  if (action === "retry") {
    const retry = list.filter((q) =>
      gradeTask(q, s.answers[q.id], s.self[q.id]).some(
        (g) => g.points !== g.max,
      ),
    );
    start(retry, {
      mode: "training",
      seed: s.seed,
      minutes: retry.reduce((a, t) => a + t.minutes, 0),
      requested: retry.length,
      timer: false,
    });
    return;
  }
  if (s.status !== "active") return;
  if (action === "next") s.index = Math.min(list.length - 1, s.index + 1);
  if (action === "previous") s.index = Math.max(0, s.index - 1);
  if (action === "jump") s.index = Number(b.dataset.index);
  if (action === "mark") s.marked[t.id] = !s.marked[t.id];
  if (action === "hint" && s.mode === "training" && !s.checked[t.id])
    s.hints[t.id] = Math.min(t.hints.length, (s.hints[t.id] || 0) + 1);
  if (action === "check" && s.mode === "training") s.checked[t.id] = true;
  if (action === "finish") confirmSubmit = true;
  if (action === "cancel") confirmSubmit = false;
  if (action === "submit") {
    s.status = "submitted";
    s.endedAt = Date.now();
    record();
    confirmSubmit = false;
  }
  persist();
  if (action === "check" || action === "submit") {
    for (const task of action === "check" ? [t] : list) {
      if (gradeTask(task, s.answers[task.id], {}).every(part => part.status === "correct")) {
        markCorrect("christian-matematik.tasks.v1", { id: `bank:${task.id}:v${task.version}`, topic: task.topic, module: modules[task.module]?.name || task.module, label: task.title || task.id, route: 'tasks' });
      }
    }
  }
  render(["next", "previous", "jump", "submit"].includes(action));
  if (action === "check")
    root
      .querySelector(".task-feedback")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (action === "finish") root.querySelector(".task-confirm button")?.focus();
});
function tick() {
  const timer = root.querySelector("#taskTimer"),
    s = state.session;
  if (timer && s) {
    const seconds = Math.floor((Date.now() - s.startedAt) / 1000);
    timer.textContent = `Forløbet tid: ${Math.floor(seconds / 60)} min ${seconds % 60} sek`;
  }
}
render();
setInterval(tick, 1000);
tick();
