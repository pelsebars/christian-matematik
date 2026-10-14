import { createIntegralAreasLesson } from './integral-areas-lesson.js';
import { createIntegralDefiniteLesson } from './integral-definite-lesson.js';
import { createIntegralGraphLesson } from './integral-graphs-lesson.js';
import { integralModules } from './integral-plan.js';
import { integralSteps, integralRoute, parseIntegralRoute, stepsForIntegralModule, pagesForIntegralModule } from './integral-routes.js';

// Move the existing lesson nodes rather than rebuilding forms: answers, open hints,
// event handlers, the graph and the existing local-storage format remain intact.
export function mountIntegralNavigation(root) {
  const get = id => root.querySelector(`#${id}`);
  const element = (tag, className = '') => { const el = document.createElement(tag); el.className = className; return el; };
  const link = (path, label, className = 'text-button') => {
    const a = element('a', className); a.href = `#${path}`; a.textContent = label; return a;
  };
  const moduleKey = m => m.id === 'int.rep' ? 'repetition' : m.id.split('.')[1];
  const overview = element('div'); overview.id = 'int-overview';
  const lesson = element('div'); lesson.id = 'int-session'; lesson.hidden = true;
  const roadmap = get('int-forloeb');
  overview.append(roadmap);
  const goalDetails = element('details', 'int-goal-map');
  const goalSummary = element('summary'); goalSummary.textContent = 'Se hele læringsmålskortet';
  goalDetails.append(goalSummary, get('int-maal')); overview.append(goalDetails);
  root.querySelector('.lesson-nav').remove();
  root.prepend(overview, lesson);
  const back = element('nav', 'int-breadcrumb'); back.setAttribute('aria-label', 'Tilbage til emneoversigten');
  back.append(link('integration', '← Integralregning · alle undervisningsgange'));
  lesson.append(back);
  const menu = element('nav', 'int-step-menu'); menu.setAttribute('aria-label', 'Trin i undervisningsgangen');
  menu.innerHTML = integralSteps.map((s, i) => `<a href="#${integralRoute('1', s.id)}" data-int-step="${s.id}"><span>${i + 1}</span>${s.title}</a>`).join('');
  lesson.append(menu);
  const status = element('p', 'int-location'); status.id = 'int-location'; status.setAttribute('role', 'status'); lesson.append(status);
  const panels = new Map();
  for (const step of integralSteps) {
    const panel = element('div', 'int-step-panel'); panel.id = `int-step-${step.id}`; panel.dataset.intModule = "1"; panel.hidden = true;
    panels.set(step.id, panel); lesson.append(panel);
  }
  const choices = new Map();
  function picker(step, items, labels) {
    const panel = panels.get(step), nav = element('nav', 'int-part-menu');
    nav.setAttribute('aria-label', `${integralSteps.find(s => s.id === step).title}: vælg del`);
    items.forEach((item, i) => {
      const part = integralSteps.find(s => s.id === step).parts[i];
      const a = link(integralRoute('1', step, part), labels[i], 'int-part-link');
      a.dataset.intPart = part; nav.append(a);
      item.dataset.intPartPanel = part;
    });
    panel.prepend(nav); choices.set(step, items);
  }
  const start = panels.get('start');
  const intro = get('int-modul-1');
  const goals = element('details', 'int-module-goals');
  const goalsSummary = element('summary'); goalsSummary.textContent = 'Det skal du kunne i denne undervisningsgang';
  goals.append(goalsSummary, intro); start.append(goals, get('int-start'));
  const foundationCards = [...get('int-start').querySelectorAll('[data-int-card]')];
  picker('start', foundationCards, ['Funktioner', 'Differentiation', 'Brøker', 'Fortegn', 'Potenser']);
  const basics = get('int-grundkort'), basicsDetails = element('details', 'int-foundation-help');
  const basicsSummary = element('summary'); basicsSummary.textContent = 'Grundhjælp · åbn det, du har brug for';
  basics.before(basicsDetails); basicsDetails.append(basicsSummary, basics);

  const theory = ['int-teori', 'int-konstant', 'int-potens', 'int-regler', 'int-cas-spor'].map(get);
  const examples = theory.flatMap(s => [...s.querySelectorAll('.example-card')]);
  const examplesIntro = element('section', 'lesson-section');
  examplesIntro.innerHTML = '<h2>Gennemregnede eksempler</h2><p>Følg ét eksempel ad gangen. Hvert regnetrin forklarer, hvorfor det foretages.</p>';
  panels.get('eksempler').append(examplesIntro);
  examples.forEach(example => examplesIntro.append(example));
  // The root example used to double as theory. Keep the principle beside its microexercise.
  const rootPrinciple = element('p');
  rootPrinciple.innerHTML = 'Omskriv først brøker og rødder som potenser. En negativ eksponent betyder en potens i nævneren. Kvadratroden har eksponent en halv; ved integration stiger den til tre halve, og koefficienten divideres med tre halve. Kontrollér altid ved differentiation.';
  theory[3].querySelector('.int-exercises').before(rootPrinciple);
  theory.forEach(s => panels.get('teori').append(s));
  picker('teori', theory, ['Stamfunktion', 'Konstanten', 'Potensreglen', 'Grundregler', 'CAS']);
  picker('eksempler', examples, examples.map((ex, i) => `Eksempel ${i + 1}`));
  panels.get('oevelser').append(get('int-traening'));
  const exerciseCards = [...get('int-traening').querySelectorAll('[data-int-card]')];
  picker('oevelser', exerciseCards, exerciseCards.map((_, i) => `Opgave ${i + 1}`));
  const errors = get('int-fejl'), errorDetails = element('details');
  const errorSummary = element('summary'); errorSummary.textContent = 'Typiske fejl · hjælp til dit næste regnetrin';
  errorDetails.append(errorSummary, errors); panels.get('oevelser').append(errorDetails);
  const end = get('int-slut');
  const summary = end.querySelector('.next-step-card'); summary.id = 'int-opsummering';
  panels.get('opsummering').append(summary, root.querySelector('.int-source'));
  panels.get('sluttjek').append(end);
  const finalCards = [...end.querySelectorAll('[data-int-card]')];
  picker('sluttjek', finalCards, finalCards.map((_, i) => `Spørgsmål ${i + 1}`));
  get("int-modul-2").remove();
  const graphLesson = createIntegralGraphLesson(lesson);
  get("int-modul-3").remove();
  const definiteLesson = createIntegralDefiniteLesson(lesson);
  get("int-modul-4").remove();
  const areasLesson = createIntegralAreasLesson(lesson);
  const lessons = new Map([["2", graphLesson], ["3", definiteLesson], ["4", areasLesson]]);
  const panelGroups = new Map([["1", panels], ...[...lessons].map(([id,l]) => [id,l.panels])]);
  const choiceGroups = new Map([["1", choices], ...[...lessons].map(([id,l]) => [id,l.choices])]);
  const plans = new Map();
  integralModules.slice(4).forEach(m => { const plan = get(m.section); plan.hidden = true; plans.set(moduleKey(m), plan); lesson.append(plan); });
  const pager = element('nav', 'int-page-controls'); pager.setAttribute('aria-label', 'Forrige og næste del'); lesson.append(pager);
  root.querySelectorAll('#int-session .section-heading h2').forEach(h => { h.textContent = h.textContent.replace(/^\d+\. /, ''); });
  const sections = new Map([
    ['int-forloeb', 'integration'], ['int-maal', 'integration'],
    ['int-modul-1', integralRoute('1', 'start')], ['int-start', integralRoute('1', 'start')],
    ['int-grundkort', integralRoute('1', 'start')], ['int-teori', integralRoute('1', 'teori', 'begreb')],
    ['int-konstant', integralRoute('1', 'teori', 'konstant')], ['int-potens', integralRoute('1', 'teori', 'potenser')],
    ['int-regler', integralRoute('1', 'teori', 'grundregler')], ['int-cas-spor', integralRoute('1', 'teori', 'cas')],
    ['int-traening', integralRoute('1', 'oevelser')], ['int-fejl', integralRoute('1', 'oevelser')],
    ['int-slut', integralRoute('1', 'sluttjek')], ['int-opsummering', integralRoute('1', 'opsummering')],
    ...graphLesson.sections,
    ...definiteLesson.sections,
    ...areasLesson.sections,
    ...integralModules.slice(4).map(m => [m.section, integralRoute(moduleKey(m))]),
  ]);
  function render(focus = false) {
    const route = parseIntegralRoute(location.hash);
    if (!route) return;
    // Canonicalize bad/incomplete routes without adding an extra history entry.
    if (location.hash !== `#${route.path}`) history.replaceState(null, '', `#${route.path}`);
    overview.hidden = Boolean(route.module); lesson.hidden = !route.module;
    const steps = stepsForIntegralModule(route.module);
    menu.hidden = !steps; status.hidden = !route.module;
    if (steps && menu.dataset.module !== route.module) {
      menu.dataset.module = route.module;
      menu.innerHTML = steps.map((s, i) => `<a href="#${integralRoute(route.module, s.id)}" data-int-step="${s.id}"><span>${i + 1}</span>${s.title}</a>`).join('');
    }
    for (const [id,l] of lessons) l.host.hidden = route.module !== id;
    for (const [module, group] of panelGroups) for (const [step, panel] of group) panel.hidden = route.module !== module || route.step !== step;
    for (const [id, plan] of plans) plan.hidden = route.module !== id;
    for (const [module, group] of choiceGroups) for (const [step, items] of group) items.forEach(el => { el.hidden = route.module !== module || route.step !== step || el.dataset.intPartPanel !== route.part; });
    root.querySelectorAll('[data-int-step]').forEach(a => {
      if (a.dataset.intStep === route.step) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
    root.querySelectorAll('[data-int-part]').forEach(a => {
      if (a.closest('.int-step-panel')?.dataset.intModule === route.module && a.closest('.int-step-panel')?.id.endsWith(`step-${route.step}`) && a.dataset.intPart === route.part) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const subject = document.querySelector('[data-page="subject"]');
    subject.classList.toggle('is-integral-session', Boolean(route.module));
    subject.classList.toggle('is-integral-overview', !route.module);
    subject.querySelector('.learning-steps').hidden = true;
    document.querySelector('#subjectFormula').hidden = Boolean(route.module);
    const m = integralModules.find(m => moduleKey(m) === route.module);
    document.querySelector('#subjectTitle').textContent = m?.title || 'Integralregning';
    document.querySelector('#subjectKicker').textContent = m ? `${route.module === 'repetition' ? 'Faglig mellemstation' : `Undervisningsgang ${route.module}`} · ${m.date}` : '06 · A-niveau';
    document.querySelector('#subjectDescription').textContent = m?.summary || 'Vælg en undervisningsgang. Du arbejder i korte trin og kan altid vende tilbage til oversigten.';
    document.title = m ? `${m.title} · Christians matematik` : 'Integralregning · Christians matematik';
    const step = steps?.find(s => s.id === route.step);
    status.textContent = steps ? `${step.title}${route.part ? ` · del ${step.parts.indexOf(route.part) + 1} af ${step.parts.length}` : ''}` : 'Planlagt · indholdet åbnes i en senere arbejdsgang';
    pager.replaceChildren(); pager.hidden = !route.module;
    if (steps) {
      const pages = pagesForIntegralModule(route.module);
      const index = pages.indexOf(route.path);
      const nextModule = moduleKey(integralModules[integralModules.indexOf(m) + 1]);
      const nextLabel = nextModule === 'repetition' ? 'Se planen for B-niveau-repetition →' : `${stepsForIntegralModule(nextModule) ? 'Åbn' : 'Se planen for'} undervisningsgang ${nextModule} →`;
      pager.append(link(index > 0 ? pages[index - 1] : 'integration', '← Forrige', 'secondary-button'));
      pager.append(link(index < pages.length - 1 ? pages[index + 1] : `integration/${nextModule}`, index < pages.length - 1 ? 'Næste →' : nextLabel, 'primary-button'));
    } else if (m) {
      const index = integralModules.indexOf(m);
      pager.append(link(integralRoute(moduleKey(integralModules[index - 1])), '← Forrige undervisningsgang', 'secondary-button'));
      pager.append(link(index < integralModules.length - 1 ? integralRoute(moduleKey(integralModules[index + 1])) : 'integration', index < integralModules.length - 1 ? 'Næste undervisningsgang →' : 'Til oversigten →', 'primary-button'));
    }
    if (focus) {
      const heading = document.querySelector('#subjectTitle'); heading.tabIndex = -1;
      window.scrollTo({ top: 0, behavior: 'instant' }); heading.focus({ preventScroll: true });
    }
  }
  window.openIntegralSection = id => {
    const path = sections.get(id) || 'integration';
    // Ground help should preserve the current start-question instead of resetting it.
    const route = parseIntegralRoute(location.hash);
    const targetPath = (id === 'int-grundkort' || id === 'int2-grundkort' || id === 'int3-grundkort' || id === 'int4-grundkort') && route?.step === 'start' && route.module === parseIntegralRoute(path)?.module ? route.path : path;
    window.showMathView(targetPath);
    render(true);
    const target = get(id);
    if (id === 'int-maal') goalDetails.open = true;
    if (id === 'int-grundkort') basicsDetails.open = true;
    if (id === 'int-modul-1') goals.open = true;
    if (target) for (let parent = target.parentElement; parent && parent !== root; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
    if (target && !target.hidden) { target.tabIndex = -1; target.focus({ preventScroll: true }); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };
  window.addEventListener('mathviewchange', e => { if (e.detail.view === 'integration') render(e.detail.focus); });
  render(false);
}
