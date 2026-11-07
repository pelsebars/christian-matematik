export const trigModules = [
 {id:'1',title:'Cosinus og sinus · harmoniske svingninger',summary:'Enhedscirkel, radianer, amplitude, periode, fase og modeller med afledte og integraler.'},
 {id:'2',title:'Trigonometriske ligninger',summary:'Find begge løsningsgrene, gentag med perioden, og vælg alle løsninger i modellens interval.'}
];
export const trigSteps=[['start','Starttjek'],['teori','Forstå metoden'],['udforsk','Undersøg grafen'],['oevelser','Træn metoden'],['modeller','Modeller og CAS'],['slut','Sluttjek']];
export function parseTrigRoute(hash){
 const parts=hash.replace(/^#/,'').split('/');if(parts[0]!=='trigonometry')return null;
 const module=trigModules.some(m=>m.id===parts[1])?parts[1]:null;
 const step=trigSteps.some(s=>s[0]===parts[2])?parts[2]:'start';
 return {module,step,path:module?`trigonometry/${module}/${step}`:'trigonometry'};
}
