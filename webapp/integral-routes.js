// Stable routes for teaching sessions and their small learning steps.
export const integralSteps = [
  { id: 'start', title: 'Mål og starttjek', parts: ['1', '2', '3', '4', '5'] },
  { id: 'teori', title: 'Teori', parts: ['begreb', 'konstant', 'potenser', 'grundregler', 'cas'] },
  { id: 'eksempler', title: 'Eksempler', parts: ['1', '2', '3', '4', '5', '6'] },
  { id: 'oevelser', title: 'Øvelser', parts: ['1', '2', '3', '4', '5', '6', '7'] },
  { id: 'sluttjek', title: 'Forståelsestjek', parts: ['1', '2', '3', '4'] },
  { id: 'opsummering', title: 'Opsummering', parts: [] },
];
export const integralGraphSteps = integralSteps.map(s => s.id === 'teori'
  ? { ...s, parts: ['sammenhaeng', 'forskydning', 'fortegn', 'punkt', 'tangent'] }
  : { ...s, parts: [...s.parts] });
export const stepsForIntegralModule = module => ({ '1': integralSteps, '2': integralGraphSteps })[module];
export const integralRoute = (module = '', step = '', part = '') =>
  ['integration', module, step, part].filter(Boolean).join('/');
export function parseIntegralRoute(hash) {
  const [topic, requestedModule, requestedStep, requestedPart] = hash.replace(/^#/, '').split('/');
  if (topic !== 'integration') return null;
  const module = ['1', '2', '3', '4', 'repetition', '5', '6', '7'].includes(requestedModule) ? requestedModule : '';
  const steps = stepsForIntegralModule(module);
  if (!steps) return { module, step: '', part: '', path: integralRoute(module) };
  const definition = steps.find(s => s.id === requestedStep) || integralSteps[0];
  const part = definition.parts.includes(requestedPart) ? requestedPart : definition.parts[0] || '';
  return { module, step: definition.id, part, path: integralRoute(module, definition.id, part) };
}
export const pagesForIntegralModule = module => (stepsForIntegralModule(module) || []).flatMap(s =>
  s.parts.length ? s.parts.map(part => integralRoute(module, s.id, part)) : [integralRoute(module, s.id)],
);
export const integralPages = pagesForIntegralModule('1');
