import { normalModules } from './normal-plan.js';
export const normalSteps=[['start','Mål og forudsætninger'],['model','Fra måling til model'],['taethed','Tæthed og areal'],['fordeling','Fordelingsfunktionen'],['vaerktoej','Beregn og find en grænse'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const standardSteps=[['start','Mål og forudsætninger'],['standard','Mål i spredninger'],['tilbage','Tilbage og sammenligning'],['udfald','Normale og exceptionelle'],['sandsynlighed','Sandsynligheder'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const normalImplemented=['1','2'];
export const stepsForNormalModule=module=>({'1':normalSteps,'2':standardSteps}[module]||[]);
export const normalRoute=(module='',step='')=>['normalDistribution',module,step].filter(Boolean).join('/');
export const pagesForNormalModule=module=>stepsForNormalModule(module).map(([step])=>normalRoute(module,step));
export function parseNormalRoute(hash){
 const [topic,requested,step]=hash.replace(/^#/,'').split('/');if(topic!=='normalDistribution')return null;
 const module=normalModules.some(m=>m.id===requested)?requested:'',steps=stepsForNormalModule(module);
 const resolved=steps.length?(steps.some(s=>s[0]===step)?step:'start'):'';
 return {module,step:resolved,path:normalRoute(module,resolved)};
}
// Preserve the original public export and all existing module-1 links.
export const normalPages=pagesForNormalModule('1');
