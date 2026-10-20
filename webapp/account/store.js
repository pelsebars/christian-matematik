// Only authenticated server data is used to initialise a user's workspace.
// Old, unscoped localStorage belongs to no identifiable user and is never imported.
const inBrowser = typeof window !== 'undefined';
export const preview = inBrowser && ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === '1';
export let user = null;
export let startupError = '';
const values = new Map(), revisions = new Map(), pending = new Map(), solved = new Map();
let timer, inFlight = null, blocked = false;
export const completions = () => [...solved.values()];
const status = message => { window.dispatchEvent(new CustomEvent('account-sync', { detail: message })); if (blocked) window.dispatchEvent(new Event('account-conflict')); };
export const ready = (async () => {
  if (preview || !inBrowser) return;
  try {
    const response = await fetch('/api/learning', { cache: 'no-store' });
    if (response.status === 401) return;
    if (!response.ok) throw Error('Login og lagring er ikke tilgængeligt lige nu. Prøv igen om lidt.');
    const data = await response.json();
    user = data.user;
    for (const row of data.states) { values.set(row.namespace, JSON.stringify(row.value)); revisions.set(row.namespace, row.revision); }
    for (const row of data.completions) solved.set(row.id, row);
    // Unsynced work is scoped to the verified user and this browser tab.
    try {
      const cached = JSON.parse(sessionStorage.getItem(`math-pending:${user.id}`) || '[]');
      for (const [key, entry] of cached) {
        if (entry.revision !== (revisions.get(key) || 0)) { blocked = true; continue; }
        values.set(key, entry.value); pending.set(key, entry);
        for (const c of entry.completions) solved.set(c.id, c);
      }
      if (blocked) startupError = 'Der er ikke-gemte svar fra en ældre version i denne fane. Den seneste serverversion er åbnet. Kontakt administrator før fanens lokale kladde slettes.';
    } catch { /* A malformed tab cache never replaces server data. */ }
  } catch (error) { startupError = error.message; }
})();
function cachePending() {
  if (!user || blocked) return;
  try { sessionStorage.setItem(`math-pending:${user.id}`, JSON.stringify([...pending])); }
  catch { status('Lokal sikkerhedskopi kunne ikke gemmes. Hold siden åben, indtil synkronisering er færdig.'); }
}
export const accountStorage = {
  getItem(key) { if (preview) return localStorage.getItem(key); return values.get(key) ?? null; },
  setItem(key, value) {
    if (preview) { localStorage.setItem(key, value); return; }
    if (!user) throw Error('Log ind først.');
    JSON.parse(value);
    values.set(key, value);
    pending.set(key, { value, revision: revisions.get(key) || 0, completions: pending.get(key)?.completions || [] });
    cachePending(); status('Gemmer dine fremskridt…');
    clearTimeout(timer); timer = setTimeout(flush, 500);
  },
};
export function markCorrect(namespace, completion) {
  if (!user || solved.has(completion.id)) return;
  solved.set(completion.id, { ...completion, first_correct_at: new Date().toISOString() });
  const entry = pending.get(namespace) || { value: values.get(namespace) || '{}', revision: revisions.get(namespace) || 0, completions: [] };
  entry.completions.push(completion); pending.set(namespace, entry);
  cachePending(); window.dispatchEvent(new Event('account-progress'));
  clearTimeout(timer); timer = setTimeout(flush, 500);
}
export async function flush() {
  if (preview || !user) return true;
  if (blocked) { status('Gemning er stoppet på grund af en versionskonflikt. Dine svar i denne fane er bevaret.'); return false; }
  if (inFlight) return inFlight;
  if (!pending.size) return true;
  inFlight = (async () => {
    try {
      while (pending.size) {
        const [namespace, entry] = pending.entries().next().value;
        const sent = { ...entry, completions: [...entry.completions] };
        const response = await fetch('/api/learning', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ namespace, value: JSON.parse(sent.value), revision: sent.revision, completions: sent.completions }) });
        if (!response.ok) {
          if (response.status === 409) blocked = true;
          const data = await response.json();
          throw Error(data.message || 'Kunne ikke gemme.');
        }
        const { revision } = await response.json(); revisions.set(namespace, revision);
        const latest = pending.get(namespace);
        if (latest === entry && latest.value === sent.value && latest.completions.length === sent.completions.length) pending.delete(namespace);
        else {
          latest.revision = revision;
          latest.completions = latest.completions.filter(c => !sent.completions.some(s => s.id === c.id));
        }
        cachePending();
      }
      status('Alle ændringer er gemt på din konto.'); return true;
    } catch (error) { status(`${error.message} Dine svar er ikke synkroniseret. Hold fanen åben, og prøv igen.`); return false; }
    finally { inFlight = null; }
  })();
  return inFlight;
}
globalThis.window?.addEventListener('online', flush);
globalThis.window?.addEventListener('beforeunload', event => { if (pending.size) { event.preventDefault(); event.returnValue = ''; } });
export function lessonCompletion(key, task) {
  const ode = key.includes('ode') || key.includes('differential');
  const vector = key.startsWith('christian-matematik.vector.');
  const normal = key.startsWith('christian-matematik.normal.');
  const names = { graphs: '2', definite: '3', areas: '4', repetition: 'repetition', solids: '5', substitution: '6', final: '7' };
  const module = vector ? '1' : normal ? ({ introduction:'1', standard:'2', parameters:'3', algebra:'repetition', plots:'4' }[key.split('.')[2]] || '1') : ode ? '1' : names[key.split('.')[2]] || '1';
  const topic = vector ? 'vectorFunctions' : normal ? 'normalDistribution' : ode ? 'differentialEquations' : 'integration';
  const labelNode = document.createElement('div'); labelNode.innerHTML = task.prompt;
  const label = labelNode.textContent.replace(/\s+/g, ' ').trim().slice(0, 170) || task.id;
  const route = location.hash.slice(1).startsWith(topic + '/' + module + '/') ? location.hash.slice(1) : `${topic}/${module}/oevelser`;
  return { id: `lesson:${key}:${task.id}:v${task.version || 1}`, topic, module: module === 'repetition' ? (normal?'B-repetition 10–11':'B-repetition') : `Modul ${module}`, label, route };
}

export function exportDraft() {
  let recovered = null;
  try { recovered = user && JSON.parse(sessionStorage.getItem(`math-pending:${user.id}`) || '[]'); } catch {}
  return JSON.stringify({ username: user?.username, exportedAt: new Date().toISOString(), states: [...values], pending: [...pending], recovered, completions: completions() }, null, 2);
}

export function hasConflict() { return blocked; }
export function reopenSavedVersion() {
  if (!user || !blocked) return;
  sessionStorage.removeItem(`math-pending:${user.id}`);
  pending.clear();
  location.reload();
}
