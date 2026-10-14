// Stable routes for teaching sessions and their small learning steps.
export const integralSteps = [
  { id: 'start', title: 'Mål og starttjek', parts: ['1', '2', '3', '4', '5'] },
  { id: 'teori', title: 'Teori', parts: ['begreb', 'konstant', 'potenser', 'grundregler', 'cas'] },
  { id: 'eksempler', title: 'Eksempler', parts: ['1', '2', '3', '4', '5', '6'] },
  { id: 'oevelser', title: 'Øvelser', parts: ['1', '2', '3', '4', '5', '6', '7'] },
  { id: 'sluttjek', title: 'Forståelsestjek', parts: ['1', '2', '3', '4'] },
  { id: 'opsummering', title: 'Opsummering', parts: [] },
];
export const integralRoute = (module = '', step = '', part = '') =>
  ['integration', module, step, part].filter(Boolean).join('/');
export function parseIntegralRoute(hash) {
  const [topic, requestedModule, requestedStep, requestedPart] = hash.replace(/^#/, '').split('/');
  if (topic !== 'integration') return null;
  const module = ['1', '2', '3', '4', 'repetition', '5', '6', '7'].includes(requestedModule) ? requestedModule : '';
  if (module !== '1') return { module, step: '', part: '', path: integralRoute(module) };
  const definition = integralSteps.find(s => s.id === requestedStep) || integralSteps[0];
  const part = definition.parts.includes(requestedPart) ? requestedPart : definition.parts[0] || '';
  return { module, step: definition.id, part, path: integralRoute(module, definition.id, part) };
}
export const integralPages = integralSteps.flatMap(s =>
  s.parts.length ? s.parts.map(part => integralRoute('1', s.id, part)) : [integralRoute('1', s.id)],
);
