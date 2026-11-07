import {trigModules} from './trig-plan.js';
const progress=new Map();
export function setTrigProgress(id,status,count,total){progress.set(id,{status,count,total});globalThis.window?.dispatchEvent(new Event('trig-progress'));}
export const trigProgressRows=()=>trigModules.map(m=>({...m,status:'Ikke begyndt',count:0,total:0,...progress.get(m.id)}));
