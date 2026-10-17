import { odeModules } from './ode-plan.js';
export const odeSteps = [
 ['start','Mål og forudsætninger'],['teori','Teori og mikroøvelser'],['eksempler','Eksempler'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering'],
];
export const odeRoute = (module='',step='') => ['differentialEquations',module,step].filter(Boolean).join('/');
export function parseOdeRoute(hash) {
 const [topic,requested,step] = hash.replace(/^#/,'').split('/');
 if(topic !== 'differentialEquations') return null;
 const module = odeModules.some(m=>m.id===requested)?requested:'';
 const resolvedStep = module==='1' ? (odeSteps.some(s=>s[0]===step)?step:'start') : '';
 return {module,step:resolvedStep,path:odeRoute(module,resolvedStep)};
}
export const odePages = odeSteps.map(s=>odeRoute('1',s[0]));
