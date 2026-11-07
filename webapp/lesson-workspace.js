// Keep inactive courses out of the live document. Moving the original nodes
// preserves form values, graph controls, listeners and the controllers' state.
const lessons = new Map();
const currentRoute = () => location.hash.slice(1) || 'home';

function showLesson(route) {
  for (const [name, { root, parked }] of lessons) {
    if (route === name || route.startsWith(name + '/')) root.append(parked);
    else while (root.firstChild) parked.append(root.firstChild);
  }
}

// Restore before the course controllers handle the navigation event.
window.addEventListener('mathviewchange', () => showLesson(currentRoute()), { capture: true });

export function parkInactiveLesson(view, selector, modules = {}) {
  const root = document.querySelector(selector);
  lessons.set(view, { root, parked: document.createDocumentFragment() });
  for (const [id, hostId] of Object.entries(modules)) {
    lessons.set(`${view}/${id}`, { root: root.querySelector('#' + hostId), parked: document.createDocumentFragment() });
  }
  showLesson(currentRoute());
}
