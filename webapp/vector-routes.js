import {vectorModules} from './vector-plan.js';
export const vectorSteps=[['start','Mål og starttjek'],['parameter','Parameter og position'],['punkter','Punkter og akser'],['baner','Baneskæring og kollision'],['dobbeltpunkt','Dobbeltpunkter'],['former','Parabler og cirkler'],['modeller','Modeller og CAS'],['oevelser','Prøv selv'],['eksamen','Sammenhængende opgaver'],['sluttjek','Sluttjek'],['opsummering','Fast arbejdsmetode']];
export const vectorRoute=(module='',step='')=>['vectorFunctions',module,step].filter(Boolean).join('/');
export const vectorPages=vectorSteps.map(([step])=>vectorRoute('1',step));
export function parseVectorRoute(hash){
 const [topic,requested,step]=hash.replace(/^#/,'').split('/');if(topic!=='vectorFunctions')return null;
 const module=vectorModules.some(m=>m.id===requested)?requested:'';
 const resolved=module==='1'?(vectorSteps.some(s=>s[0]===step)?step:'start'):module&&module!=='opsamling'?'start':'';
 return {module,step:resolved,path:vectorRoute(module,resolved)};
}
