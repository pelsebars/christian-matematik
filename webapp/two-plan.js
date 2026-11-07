export const twoModules = [
 {id:'1',title:'Funktionsværdier, niveaukurver og snitkurver',summary:'To input, en højde: aflæs flader, fasthold en variabel og undersøg niveaukurver.'},
 {id:'2',title:'Partielt afledede og gradienter',summary:'Differentier i én variabel ad gangen, og forbind gradienten med niveaukurver og lokale ændringer.'},
];
export const twoSteps=[['start','Starttjek'],['teori','Forstå metoden'],['udforsk','Undersøg grafen'],['oevelser','Træn metoden'],['modeller','Modeller og CAS'],['slut','Sluttjek']];
export function parseTwoRoute(hash){
 const parts=hash.replace(/^#/,'').split('/');if(parts[0]!=='twoVariables')return null;
 const module=twoModules.some(m=>m.id===parts[1])?parts[1]:null;
 const step=twoSteps.some(s=>s[0]===parts[2])?parts[2]:'start';
 return {module,step,path:module?`twoVariables/${module}/${step}`:'twoVariables'};
}
