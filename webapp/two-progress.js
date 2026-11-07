import {twoModules} from './two-plan.js';
const progress=new Map();
export function setTwoProgress(id,status,count,total){progress.set(id,{status,count,total});globalThis.window?.dispatchEvent(new Event('two-progress'));}
export const twoProgressRows=()=>twoModules.map(m=>({...m,status:'Ikke begyndt',count:0,total:0,...progress.get(m.id)}));
