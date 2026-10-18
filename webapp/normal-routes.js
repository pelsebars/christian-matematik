import { normalModules } from './normal-plan.js';
export const normalSteps=[['start','Mål og forudsætninger'],['model','Fra måling til model'],['taethed','Tæthed og areal'],['fordeling','Fordelingsfunktionen'],['vaerktoej','Beregn og find en grænse'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const normalRoute=(module='',step='')=>['normalDistribution',module,step].filter(Boolean).join('/');
export function parseNormalRoute(hash){const [topic,requested,step]=hash.replace(/^#/,'').split('/');if(topic!=='normalDistribution')return null;const module=normalModules.some(m=>m.id===requested)?requested:'';const resolved=module==='1'?(normalSteps.some(s=>s[0]===step)?step:'start'):'';return {module,step:resolved,path:normalRoute(module,resolved)};}
export const normalPages=normalSteps.map(s=>normalRoute('1',s[0]));
