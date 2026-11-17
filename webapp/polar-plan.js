export const polarModules=[{id:'1',title:'Polære koordinater',summary:'Afstand og vinkel, omregning begge veje, kvadranter og en enkel radarmodel.'}];
export const polarSteps=[['start','Starttjek'],['teori','Forstå metoden'],['udforsk','Undersøg punktet'],['oevelser','Træn metoden'],['modeller','Modeller og CAS'],['slut','Sluttjek']];
export function parsePolarRoute(hash){
 const parts=hash.replace(/^#/,'').split('/');if(parts[0]!=='polarCoordinates')return null;
 const module=polarModules.some(m=>m.id===parts[1])?parts[1]:null;
 const step=polarSteps.some(s=>s[0]===parts[2])?parts[2]:'start';
 return {module,step,path:module?`polarCoordinates/${module}/${step}`:'polarCoordinates'};
}
