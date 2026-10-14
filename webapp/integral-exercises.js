import { escapeHTML, expressionMath } from './tasks/math.js';
import { gradePart, targetedFeedback } from './tasks/grading.js';
export function renderExercise(task,number){
 return `<article class="integral-exercise" data-int-card="${task.id}"><p class="eyebrow">${number} · ${task.aids?'Med hjælpemidler':'Uden hjælpemidler'}</p>${task.prompt}${task.figure || ''}<form>${task.parts.map(p=>`<div class="int-part"><label for="${task.id}-${p.id}">${p.label}</label>${p.type==='choice'?`<select id="${task.id}-${p.id}" name="${p.id}"><option value="">Vælg et svar</option>${p.options.map(o=>`<option value="${o.id}">${escapeHTML(o.label.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim())}</option>`).join('')}</select><div class="int-options" aria-label="Svarmuligheder">${p.options.map(o=>`<p><strong></strong><span>${o.label}</span></p>`).join('')}</div>`:p.type==='text'?`<textarea id="${task.id}-${p.id}" name="${p.id}" rows="3"></textarea>`:`<input id="${task.id}-${p.id}" name="${p.id}" autocomplete="off" ${p.type==='number'?'inputmode="decimal"':''}><div class="int-preview" data-preview="${p.id}" aria-live="polite"></div>`}<div data-feedback="${p.id}" role="status"></div></div>`).join('')}<button type="submit" class="primary-button">Kontrollér svar</button></form><div class="int-actions"><button type="button" class="secondary-button" data-int-hint>Vis næste hint</button><button type="button" class="text-button" data-int-retry>Prøv igen</button></div><div class="int-hints" aria-live="polite"></div><details class="int-solution"><summary>Se gennemregnet løsning</summary>${task.solution}${task.parts.filter(p=>p.type==='text').map(p=>`<p><strong>Egen vurdering af ${p.label.toLowerCase()}</strong></p><ul>${p.checklist.map(c=>`<li>${c}</li>`).join('')}</ul><p>Forklaringer vurderes ikke automatisk. Brug tjeklisten til at finde dit næste øvepunkt.</p>`).join('')}</details></article>`;
}
export const renderExercises=(tasks)=>`<div class="int-exercises">${tasks.map((t,i)=>renderExercise(t,i+1)).join('')}</div>`;

// The same bounded grader and versioned local format as the first lesson.
export function bindLessonExercises(root, tasks, key, onProgress, helpId) {
 let state = {};
 const warning = root.querySelector('[data-lesson-warning]');
 const warn = message => { warning.hidden = false; warning.textContent = message; };
 try {
  const raw = localStorage.getItem(key);
  if (raw) {
   const saved = JSON.parse(raw);
   if (saved.version !== 1 || !saved.cards || typeof saved.cards !== 'object') throw Error('format');
   for (const t of tasks) {
    const d = saved.cards[t.id]; if (!d || typeof d !== 'object') continue;
    const answers = {};
    for (const p of t.parts) if (typeof d.answers?.[p.id] === 'string' && d.answers[p.id].length <= 5000) answers[p.id] = d.answers[p.id];
    state[t.id] = { answers, checked: d.checked === true, hints: Number.isInteger(d.hints) ? Math.max(0, Math.min(d.hints, t.hints.length)) : 0 };
   }
  }
 } catch { warn('Tidligere modulsvar kunne ikke læses, eller lagring er blokeret. Du kan stadig arbejde videre.'); }
 const save = () => { try { localStorage.setItem(key, JSON.stringify({ version: 1, cards: state })); } catch { warn('Browseren kan ikke gemme dine modulsvar. Hold siden åben for at bevare arbejdet.'); } };
 const complete = t => state[t.id]?.checked && t.parts.every(p => gradePart(p, state[t.id].answers[p.id]).status === 'correct');
 for (const t of tasks) {
  const el = root.querySelector(`[data-int-card="${t.id}"]`), form = el.querySelector('form');
  const d = state[t.id] ??= { answers: {}, checked: false, hints: 0 };
  t.parts.filter(p => p.type === 'choice').forEach(p => {
   const sel = form.elements.namedItem(p.id); p.options.forEach((o, i) => { sel.options[i + 1].textContent = `Mulighed ${i + 1}`; });
   sel.nextElementSibling.querySelectorAll('p strong').forEach((label, i) => { label.textContent = `${i + 1}. `; });
  });
  function display() {
   for (const p of t.parts) {
    const v = d.answers[p.id] ?? ''; form.elements.namedItem(p.id).value = v;
    const preview = el.querySelector(`[data-preview="${p.id}"]`); if (preview) preview.innerHTML = expressionMath(v);
    const feedback = el.querySelector(`[data-feedback="${p.id}"]`); feedback.replaceChildren();
    if (d.checked) {
     const r = gradePart(p, v); feedback.textContent = r.status === 'incorrect' ? targetedFeedback(t, p, v) : r.message;
     feedback.className = `int-feedback ${r.status}`;
     if (r.status === 'incorrect' && helpId && t.id.includes('.pre.')) feedback.insertAdjacentHTML('beforeend', `<p><button type="button" class="text-button" data-int-jump="${helpId}">Åbn grundhjælp</button></p>`);
    }
   }
   el.classList.toggle('is-correct', Boolean(complete(t)));
   el.querySelector('.int-hints').innerHTML = t.hints.slice(0, d.hints).map((h, i) => `<p><strong>Hint ${i + 1}:</strong> ${h}</p>`).join('');
   const b = el.querySelector('[data-int-hint]'); b.disabled = d.hints >= t.hints.length; b.textContent = b.disabled ? 'Alle hints er vist' : 'Vis næste hint';
  }
  form.addEventListener('input', () => { for (const p of t.parts) d.answers[p.id] = form.elements.namedItem(p.id).value; d.checked = false; display(); onProgress(complete); save(); });
  form.addEventListener('submit', e => { e.preventDefault(); d.checked = true; display(); onProgress(complete); save(); });
  el.querySelector('[data-int-hint]').addEventListener('click', () => { d.hints = Math.min(t.hints.length, d.hints + 1); display(); save(); });
  el.querySelector('[data-int-retry]').addEventListener('click', () => { d.answers = {}; d.checked = false; d.hints = 0; el.querySelector('details').open = false; display(); onProgress(complete); save(); form.elements[0].focus(); });
  display();
 }
 onProgress(complete);
}
