import {vectorModules,vectorLabel} from './vector-plan.js';
// Read-only presentation state, supplied by the lesson controllers' own graders.
// Nothing here writes answers, completions, points or purchases.
const progress=new Map();
export function setVectorProgress(id,status,count,total){const old=progress.get(id);if(old&&old.status===status&&old.count===count&&old.total===total)return;progress.set(id,{status,count,total});if(typeof window!=='undefined')window.dispatchEvent(new Event('vector-progress'));}
export const vectorProgressRows=()=>vectorModules.map(m=>({id:m.id,label:vectorLabel(m),title:m.title,route:`vectorFunctions/${m.id}/start`,status:'Ikke begyndt',count:0,total:0,...progress.get(m.id)}));
