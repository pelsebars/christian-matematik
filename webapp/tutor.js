import { accountStorage } from './account/store.js';
const bindings = new WeakMap();
let panel, active, opener, busy = false;
const history = new Map();
export function bindTutor(card, identity, getContext) {
  if (!card || bindings.has(card)) return;
  bindings.set(card, { identity, getContext });
  const button = document.createElement('button');
  button.disabled = busy; button.type = 'button'; button.className = 'secondary-button tutor-open'; button.textContent = 'Jeg sidder fast';
  button.addEventListener('click', () => open(card, button));
  (card.querySelector('.int-actions, .exercise-actions, .task-actions') || card).append(button);
}
// Preserve MathML structure (fractions, exponents, vectors) instead of flattening it.
export function taskContext(task, answers, hints = 0) {
  return JSON.stringify({ id: task.id, topic: task.topic, module: task.module, prompt: task.prompt,
    figure: task.figure, parts: task.parts, hints: task.hints, shownHints: hints, solution: task.solution,
    currentAnswers: answers }).slice(0, 30000);
}
function init() {
  if (panel) return;
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = './tutor.css'; document.head.append(css);
  panel = document.createElement('aside'); panel.className = 'tutor-panel'; panel.hidden = true;
  panel.setAttribute('aria-label', 'Hjælp til opgaven');
  panel.innerHTML = `<header><div><strong>Ét trin ad gangen</strong><p>Hjælp til denne opgave</p></div><button type="button" data-close aria-label="Luk opgavechat">✕</button></header>
    <p class="tutor-intro">Skriv, hvor du sidder fast, eller bed om et lille hint. Jeg får opgaven og dine aktuelle svar med.</p>
    <div class="tutor-messages" role="log" aria-label="Samtale om opgaven" aria-live="polite"></div>
    <p class="tutor-status" role="status"></p><button type="button" data-retry hidden>Prøv igen</button>
    <div class="tutor-shortcuts"><button type="button">Giv et hint</button><button type="button">Forklar det enklere</button><button type="button">Vis næste trin</button></div>
    <form><label for="tutor-input">Din besked</label><textarea id="tutor-input" rows="3" maxlength="2000" placeholder="Jeg ved ikke, hvordan jeg starter…" required></textarea><button type="submit" class="primary-button">Send</button></form>`;
  document.body.append(panel);
  panel.querySelector('[data-close]').onclick = close;
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } });
  panel.querySelector('form').onsubmit = event => { event.preventDefault(); send(panel.querySelector('textarea').value); };
  panel.querySelector('[data-retry]').onclick = () => send(null, true);
  panel.querySelectorAll('.tutor-shortcuts button').forEach(b => b.onclick = () => send(b.textContent));
  window.addEventListener('hashchange', close);
}
export function closeTutor() { close(); }
function close() { if (panel) panel.hidden = true; if (opener?.isConnected) opener.focus(); }
async function open(card, button) {
  init();
  if (busy) return;
  const binding = bindings.get(card);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(binding.identity));
  const key = 'christian-matematik.chat.' + [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
  if (!history.has(key)) {
    let messages = [];
    try { const saved = JSON.parse(accountStorage.getItem(key) || '{}'); messages = (saved.messages || []).filter(m => ['user','assistant'].includes(m.role) && typeof m.content === 'string' && m.content.length <= 6000).slice(-40); } catch {}
    history.set(key, messages);
  }
  active = { ...binding, key, messages: history.get(key) }; opener = button;
  panel.querySelector('textarea').value = '';
  panel.querySelector('[data-retry]').hidden = active.messages.at(-1)?.role !== 'user';
  panel.querySelector('.tutor-status').textContent = '';
  panel.hidden = false; render(); panel.querySelector('textarea').focus();
}
function render() {
  const log = panel.querySelector('.tutor-messages'); log.replaceChildren();
  for (const m of active.messages) {
    const item = document.createElement('div'); item.className = 'tutor-message ' + m.role;
    const label = document.createElement('strong'); label.textContent = m.role === 'user' ? 'Dig' : 'Hjælper';
    const text = document.createElement('p'); text.textContent = m.content; item.append(label, text); log.append(item);
  }
  log.scrollTop = log.scrollHeight;
}
function save(session) {
  try { accountStorage.setItem(session.key, JSON.stringify({ messages: session.messages.slice(-40) })); }
  catch { panel.querySelector('.tutor-status').textContent = 'Samtalen kunne ikke gemmes. Hold siden åben.'; }
}
async function send(text, retry = false) {
  if (busy || !active || (!retry && !text?.trim())) return;
  const session = active;
  if (!retry) session.messages.push({ role: 'user', content: text.trim().slice(0, 2000) });
  if (session.messages.at(-1)?.role !== 'user') return;
  busy = true; document.querySelectorAll(".tutor-open").forEach(b => b.disabled = true); save(session); render();
  panel.querySelector('textarea').value = '';
  panel.querySelector('[data-retry]').hidden = true;
  panel.querySelectorAll('form button, .tutor-shortcuts button, [data-retry]').forEach(b => b.disabled = true);
  panel.querySelector('.tutor-status').textContent = 'Hjælperen tænker…';
  try {
    const response = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(45000),
      body: JSON.stringify({ context: session.getContext(), messages: session.messages.slice(-24) }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || typeof data.reply !== 'string') throw Error(data.message || 'Hjælperen er ikke tilgængelig lige nu. Brug opgavens hints, eller prøv igen.');
    session.messages.push({ role: 'assistant', content: data.reply });
    session.messages.splice(0, Math.max(0, session.messages.length - 40));
    panel.querySelector('.tutor-status').textContent = ''; save(session); render();
  } catch (error) {
    panel.querySelector('.tutor-status').textContent = error.name === 'TimeoutError' ? 'Hjælperen svarede ikke i tide. Din besked er bevaret; prøv igen.' : error.message;
    panel.querySelector('[data-retry]').hidden = false;
  } finally {
    busy = false; document.querySelectorAll(".tutor-open").forEach(b => b.disabled = false); panel.querySelectorAll('form button, .tutor-shortcuts button, [data-retry]').forEach(b => b.disabled = false);
  }
}
export function bindLegacyTutors() {
  document.querySelectorAll('.exercise-card[data-exercise-id]').forEach(card => {
    bindTutor(card, 'legacy:' + card.dataset.exerciseId, () => {
      const copy = card.cloneNode(true);
      copy.querySelectorAll('button, input, textarea, .answer-feedback, .tutor-open').forEach(n => n.remove());
      return JSON.stringify({ id: card.dataset.exerciseId, topic: card.dataset.progressGroup,
        prompt: copy.innerHTML, answer: card.dataset.answer,
        currentAnswers: [...card.querySelectorAll('input, textarea, select')].map(n => ({ label: n.getAttribute('aria-label') || n.name, value: n.value })),
        choice: card.querySelector('.answer-choice.is-selected')?.dataset.value,
        choices: [...card.querySelectorAll('.answer-choice')].map(n => ({ value: n.dataset.value, label: n.textContent })) }).slice(0, 30000);
    });
  });
}
