import { accountStorage, markCorrect } from './store.js';
const key = 'christian-matematik.lessons.v1';
let state = {};
try { state = JSON.parse(accountStorage.getItem(key) || '{}'); } catch { /* Local preview may block storage. */ }
const topics = { equationLesson: 'equations', quadraticLesson: 'quadratic', compositeLesson: 'composite', differentiationLesson: 'differentiation', planeGeometryLesson: 'planeGeometry' };
const cards = [...document.querySelectorAll('.exercise-card')];
for (const card of cards) {
  const saved = state[card.dataset.exerciseId];
  if (!saved) continue;
  [...card.querySelectorAll('input')].forEach((input, i) => { input.value = saved.answers?.[i] || ''; });
  card.querySelectorAll('.answer-choice').forEach(button => { const selected = button.dataset.value === saved.choice; button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected)); });
  if (saved.correct) { card.dataset.solved = 'true'; card.classList.add('is-correct'); card.querySelector('.answer-feedback').textContent = 'Tidligere løst korrekt.'; }
}
for (const group of new Set(cards.map(c => c.dataset.progressGroup))) window.updateExerciseProgress(group);
function save(card, correct) {
  const id = card.dataset.exerciseId;
  const previous = state[id] || {};
  state[id] = { answers: [...card.querySelectorAll('input')].map(i => i.value), choice: card.querySelector('.answer-choice.is-selected')?.dataset.value, correct: previous.correct || correct === true };
  try { accountStorage.setItem(key, JSON.stringify(state)); } catch { /* Storage errors are already shown by the shared store. */ }
  if (correct) {
    const lesson = card.closest('[id$="Lesson"]');
    const topic = topics[lesson?.id];
    const section = card.closest('.lesson-section');
    const module = section?.querySelector('h2')?.textContent.trim() || card.dataset.progressGroup;
    const label = card.querySelector('h3')?.textContent.trim() || `Opgave ${cards.filter(c => c.dataset.progressGroup === card.dataset.progressGroup).indexOf(card) + 1}`;
    markCorrect(key, { id: `lesson:${id}`, topic, module: module.slice(0,120), label: label.slice(0,200), route: topic });
  }
}
window.addEventListener('exercise-checked', event => save(event.detail.card, event.detail.correct));
for (const card of cards) {
  card.addEventListener('input', () => save(card));
  card.querySelectorAll('.answer-choice').forEach(button => button.addEventListener('click', () => save(card)));
}
