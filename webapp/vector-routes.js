import {vectorModules} from './vector-plan.js';
export const vectorSteps=[['start','Mål og starttjek'],['parameter','Parameter og position'],['punkter','Punkter og akser'],['baner','Baneskæring og kollision'],['dobbeltpunkt','Dobbeltpunkter'],['former','Parabler og cirkler'],['modeller','Modeller og CAS'],['oevelser','Prøv selv'],['eksamen','Sammenhængende opgaver'],['sluttjek','Sluttjek'],['opsummering','Fast arbejdsmetode']];
export const dynamicsSteps=[['start','Mål og starttjek'],['afledte','Koordinatvis differentiation'],['bevaegelse','Hastighed, fart og acceleration'],['tangenter','Tangentens ligning'],['akser','Vandret, lodret og nulvektor'],['vinkler','Vektorer og tangentvinkler'],['dobbeltpunkt','To hastigheder i ét punkt'],['hoejde','Maksimal højde og interval'],['vaerktoej','CAS og dokumentation'],['oevelser','Prøv selv'],['eksamen','Sammenhængende opgaver'],['sluttjek','Sluttjek'],['opsummering','Fast arbejdsmetode']];
export const vectorImplemented=['1','2'];
export const stepsForVectorModule=module=>({'1':vectorSteps,'2':dynamicsSteps}[module]||[]);
export const vectorRoute=(module='',step='')=>['vectorFunctions',module,step].filter(Boolean).join('/');
export const pagesForVectorModule=module=>stepsForVectorModule(module).map(([id])=>vectorRoute(module,id));
export const vectorPages=pagesForVectorModule('1');
export const dynamicsPages=pagesForVectorModule('2');
export function parseVectorRoute(hash){
 const [topic,requested,step]=hash.replace(/^#/,'').split('/');if(topic!=='vectorFunctions')return null;
 const module=vectorModules.some(m=>m.id===requested)?requested:'',steps=stepsForVectorModule(module);
 const resolved=steps.length?(steps.some(s=>s[0]===step)?step:'start'):module&&module!=='opsamling'?'start':'';
 return {module,step:resolved,path:vectorRoute(module,resolved)};
}
