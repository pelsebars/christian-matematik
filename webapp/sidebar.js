const groups = [...document.querySelectorAll('[data-nav-group]')];
let legacyCurrent = null;

function baseView(value = '') {
  return value.split('/')[0] || 'home';
}

function setExpanded(group, expanded) {
  const toggle = group.querySelector('.nav-expand');
  const submenu = group.querySelector('.nav-submenu');
  toggle.setAttribute('aria-expanded', String(expanded));
  submenu.hidden = !expanded;
  const label = toggle.querySelector('.sr-only');
  if (label) label.textContent = `${expanded ? 'Skjul' : 'Vis'} moduler i ${group.querySelector('.nav-item > span:last-child').textContent}`;
}

function expandOnly(selected) {
  groups.forEach(group => setExpanded(group, group === selected));
}

function closeMobileNavigation() {
  document.querySelector('#sidebar')?.classList.remove('is-open');
  document.querySelector('#backdrop')?.classList.remove('is-visible');
  document.querySelector('#menuButton')?.setAttribute('aria-expanded', 'false');
}

function syncCurrentRoute() {
  const route = location.hash.slice(1);
  const current = baseView(route);
  groups.forEach(group => group.classList.toggle('is-current', group.dataset.navGroup === current));

  document.querySelectorAll('.nav-submenu [aria-current="page"]').forEach(item => item.removeAttribute('aria-current'));
  if (legacyCurrent && legacyCurrent.dataset.sidebarView === current) {
    legacyCurrent.setAttribute('aria-current', 'page');
    return;
  }
  if (legacyCurrent && legacyCurrent.dataset.sidebarView !== current) legacyCurrent = null;
  const routeModule = route.split('/').slice(0, 2).join('/');
  const currentLink = [...document.querySelectorAll('.nav-submenu a')].find(link => {
    const target = link.hash.slice(1);
    return target === route || (route.includes('/') && target.split('/').slice(0, 2).join('/') === routeModule);
  });
  currentLink?.setAttribute('aria-current', 'page');
}

groups.forEach(group => {
  const toggle = group.querySelector('.nav-expand');
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    if (opening) expandOnly(group);
    else setExpanded(group, false);
  });

  group.querySelectorAll('[data-sidebar-view]').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.sidebarScroll;
      legacyCurrent = button;
      window.showMathView(button.dataset.sidebarView);
      document.querySelectorAll('.nav-submenu [aria-current="page"]').forEach(item => item.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'page');
      closeMobileNavigation();
      requestAnimationFrame(() => {
        const section = document.getElementById(target);
        if (!section) return;
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });

  group.querySelector('.nav-item').addEventListener('click', () => {
    legacyCurrent = null;
    syncCurrentRoute();
  });
});

document.querySelectorAll('.nav-submenu a').forEach(link => {
  link.addEventListener('click', () => {
    legacyCurrent = null;
    closeMobileNavigation();
  });
});

window.addEventListener('mathviewchange', event => {
  const group = groups.find(item => item.dataset.navGroup === event.detail.view);
  if (group) expandOnly(group);
  else if (['home', 'tasks', 'formulas'].includes(event.detail.view)) expandOnly(null);
  syncCurrentRoute();
});

window.addEventListener('hashchange', syncCurrentRoute);

const initial = groups.find(group => group.dataset.navGroup === baseView(location.hash.slice(1)));
if (initial) expandOnly(initial);
syncCurrentRoute();
document.documentElement.dataset.sidebarNavigation = 'ready';
