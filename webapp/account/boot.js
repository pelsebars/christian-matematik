import { ready, user, startupError, preview, accountStorage, completions, flush, hasConflict, reopenSavedVersion } from './store.js';
import { escapeHTML as esc } from '../tasks/math.js';
const landing = document.querySelector('#accountLanding'), shell = document.querySelector('.app-shell');
const form = document.querySelector('#accountForm'), message = document.querySelector('#accountMessage');
let mode = 'login';
function setMode(next) {
  mode = next;
  document.querySelector('#accountHeading').textContent = mode === 'signup' ? 'Opret din bruger' : 'Velkommen tilbage';
  document.querySelector('#accountSubmit').textContent = mode === 'signup' ? 'Opret bruger' : 'Log ind';
  document.querySelector('#accountPassword').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
  document.querySelector('#accountPassword').minLength = mode === 'signup' ? 12 : 1;
  document.querySelector('#signupHint').hidden = mode !== 'signup';
  document.querySelector('#repeatPasswordLabel').hidden = mode !== 'signup';
  document.querySelector('#repeatPassword').required = mode === 'signup';
  document.querySelectorAll('[data-auth-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.authMode === mode)));
  message.textContent = '';
}
document.querySelectorAll('[data-auth-mode]').forEach(button => button.addEventListener('click', () => { setMode(button.dataset.authMode); document.querySelector('#accountUsername').focus(); }));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (mode === 'signup' && form.password.value !== form.repeatPassword.value) { message.textContent = 'Adgangskoderne er ikke ens.'; return; }
  const button = document.querySelector('#accountSubmit'); button.disabled = true; message.textContent = 'Et øjeblik…';
  try {
    const response = await fetch(`/api/auth/${mode === 'signup' ? 'sign-up/email' : 'sign-in/username'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.username.value.trim().toLowerCase(), password: form.password.value }) });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw Error(response.status === 429 ? 'For mange forsøg. Vent et minut, og prøv igen.' : response.status >= 500 ? 'Login er ikke tilgængeligt lige nu. Prøv igen senere.' : mode === 'login' ? 'Brugernavn eller adgangskode er forkert.' : ['USERNAME_IS_ALREADY_TAKEN', 'USER_ALREADY_EXISTS', 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'].includes(data.code) ? 'Brugernavnet er allerede i brug. Vælg et andet.' : 'Brug 3–30 tegn i brugernavnet og mindst 12 tegn i adgangskoden. Brugernavnet kan indeholde a–z, tal og understregning.');
    }
    location.reload();
  } catch (error) { message.textContent = error.message; button.disabled = false; }
});
await ready;
if (!user && !preview) {
  landing.hidden = false; shell.hidden = true; message.textContent = startupError;
} else {
  landing.hidden = true; shell.hidden = false;
  const bar = document.createElement('div'); bar.className = 'account-bar';
  bar.innerHTML = `<span>${preview ? 'Lokal forhåndsvisning' : `Logget ind som <strong>${esc(user.username)}</strong>`}</span><div><button type="button" id="accountSettings">Adgangskode</button><button type="button" id="accountLogout">Log ud</button></div><p id="accountSync" role="status">${esc(startupError || (preview ? 'Svar gemmes kun lokalt i forhåndsvisning.' : 'Dine fremskridt følger din konto.'))}</p><button type="button" id="accountRetry">Gem igen</button> <button type="button" id="accountBackup">Hent kladde</button><button type="button" id="accountResolve" hidden>Åbn gemt version</button>`;
  document.querySelector('.sidebar-note').before(bar);
  window.addEventListener('account-sync', event => { document.querySelector('#accountSync').textContent = event.detail; });
  document.querySelector('#accountRetry').addEventListener('click', flush);
  async function downloadDraft() {
    const { exportDraft } = await import('./store.js');
    const url = URL.createObjectURL(new Blob([exportDraft()], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'matematik-kladde.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  document.querySelector('#accountBackup').addEventListener('click', downloadDraft);
  const resolveButton = document.querySelector('#accountResolve');
  resolveButton.hidden = !hasConflict();
  window.addEventListener('account-conflict', () => { resolveButton.hidden = false; });
  resolveButton.addEventListener('click', () => {
    if (confirm('Åbn den senest gemte version fra din konto? Det fjerner de ikke-gemte ændringer i denne fane. Vælg Annuller og Hent kladde først, hvis du vil beholde dem som fil.')) reopenSavedVersion();
  });
  document.querySelector('#accountLogout').addEventListener('click', async () => {
    if (!await flush()) return;
    try {
      const response = await fetch('/api/auth/sign-out', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!response.ok) throw Error();
      location.assign(location.pathname);
    } catch { document.querySelector('#accountSync').textContent = 'Kunne ikke logge ud. Prøv igen.'; }
  });
  document.querySelector('#accountSettings').addEventListener('click', () => document.querySelector('#passwordDialog').showModal());
  document.querySelector('#closePassword').addEventListener('click', () => document.querySelector('#passwordDialog').close());
  document.querySelector('#passwordForm').addEventListener('submit', async event => {
    event.preventDefault(); const f = event.target, output = document.querySelector('#passwordMessage');
    if (f.newPassword.value !== f.confirmPassword.value) { output.textContent = 'Adgangskoderne er ikke ens.'; return; }
    try {
      const response = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: f.currentPassword.value, newPassword: f.newPassword.value, revokeOtherSessions: true }) });
      if (!response.ok) throw Error('Kunne ikke skifte adgangskode. Kontrollér din nuværende adgangskode.');
      f.reset(); output.textContent = 'Adgangskoden er ændret. Andre enheder er logget ud.';
    } catch (error) { output.textContent = error.message; }
  });
  // Initial state must be loaded before any lesson binds its forms.
  await new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = './app.js'; script.onload = resolve; script.onerror = reject; document.head.append(script); });
  await import('../tasks/ui.js'); await import('../integral.js'); await import('../ode.js'); await import('../normal.js');
  await import('../sidebar.js');
  await import('./legacy.js');
  const dashboard = document.createElement('section'); dashboard.className = 'personal-overview';
  document.querySelector('[data-page="home"]').prepend(dashboard);
  const labels = { equations: 'Ligninger', quadratic: 'Andengradsligninger', composite: 'Sammensatte funktioner', differentiation: 'Differentialregning', planeGeometry: 'Plangeometri og vektorer', integration: 'Integralregning', differentialEquations: 'Differentialligninger', normalDistribution: 'Normalfordeling' };
  function renderOverview() {
    const rows = completions();
    let resume; try { resume = JSON.parse(accountStorage.getItem('christian-matematik.resume.v1') || '{}').route; } catch {}
    dashboard.innerHTML = `<p class="eyebrow">Mit overblik</p><h1>${preview ? 'Dit personlige arbejdsrum' : `Hej ${esc(user.username)}`}</h1><p>Ét trin ad gangen. Her kan du følge dine korrekt løste opgaver.</p><div class="personal-summary"><strong>${rows.length}</strong><span>opgaver løst korrekt</span>${resume && /^[a-zA-Z0-9/_-]+$/.test(resume) ? `<a class="primary-button" href="#${esc(resume)}">Fortsæt, hvor du slap →</a>` : '<a class="primary-button" href="#equations">Begynd med ligninger →</a>'}</div><div class="personal-topics">${Object.entries(labels).map(([topic, label]) => {
      const items = rows.filter(r => r.topic === topic);
      const groups = [...new Set(items.map(r => r.module))];
      return `<details><summary><span>${label}</span><strong>${items.length} løst</strong></summary>${items.length ? groups.map(group => `<div class="personal-module"><h3>${esc(group)}</h3><ul>${items.filter(r => r.module === group).map(r => `<li><a href="#${esc(r.route)}">${esc(r.label)}</a><span>✓ Løst korrekt</span></li>`).join('')}</ul></div>`).join('') : '<p>Du har endnu ikke løst opgaver i dette emne.</p>'}<a class="text-button" href="#${topic}">Åbn emnet →</a></details>`;
    }).join('')}</div><p class="personal-note">En korrekt løsning bliver i dit overblik, også når du øver opgaven igen. Egne vurderinger og besøgte sider tæller ikke som korrekte løsninger.</p>`;
  }
  renderOverview(); window.addEventListener('account-progress', renderOverview);
  window.addEventListener('mathviewchange', event => {
    if (!['home', 'formulas'].includes(event.detail.view)) { try { accountStorage.setItem('christian-matematik.resume.v1', JSON.stringify({ route: location.hash.slice(1) })); } catch {} }
    renderOverview();
  });
  if (preview) { document.querySelector('#accountSettings').hidden = true; document.querySelector('#accountLogout').hidden = true; }
  await flush();
}
