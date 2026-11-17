import {polarModules} from './polar-plan.js';
const progress=new Map();
export function setPolarProgress(id,status,count,total){progress.set(id,{status,count,total});globalThis.window?.dispatchEvent(new Event('polar-progress'));}
export const polarProgressRows=()=>polarModules.map(m=>({...m,status:'Ikke begyndt',count:0,total:0,...progress.get(m.id)}));
