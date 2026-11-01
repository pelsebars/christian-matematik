import { odeModules } from './ode-plan.js';
export const odeSteps = [
 ['start','Mål og forudsætninger'],['teori','Teori og mikroøvelser'],['eksempler','Eksempler'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering'],
];
export const proportionalSteps = [['start','Mål og forudsætninger'],['proportional','Proportional hastighed'],['familie','Løsningsfamilien'],['begyndelse','Begyndelsesværdi'],['punkt','Et andet begyndelsespunkt'],['parameter','Find vækstkonstanten'],['udforsk','Udforsk vækst og fald'],['oevelser','Uden hjælpemidler'],['modeller','Modeller og CAS'],['sluttjek','Sluttjek'],['opsummering','Opsummering']];
export const localSteps=[['start','Mål og forudsætninger'],['hastighed','Væksthastighed'],['tangent','Tangentligning'],['linjeelement','Linjeelement'],['udforsk','Udforsk lokal retning'],['oevelser','Uden hjælpemidler'],['modeller','Mængde og hastighed'],['cas','Udvidede CAS-modeller'],['sluttjek','Sluttjek'],['opsummering','Opsummering']];
export const reviewSteps=[['start','To starttjek'],['logaritmer','Logaritmer'],['log-opgaver','Logaritmeopgaver'],['binomial','Binomialfordeling'],['udforsk','Udforsk sandsynligheder'],['binomial-opgaver','Binomialopgaver'],['sluttjek','To sluttjek'],['opsummering','Opsummering']];
export const fieldSteps=[['start','Mål og forudsætninger'],['felt','Hældningsfelt'],['hastighedsgraf','Hastighedsgraf'],['numerisk','Numeriske trin'],['udforsk','Udforsk felt og kurver'],['oevelser','Skitser og opgaver'],['modeller','Digitale modeller'],['sluttjek','Sluttjek'],['opsummering','Opsummering']];
export const odeImplemented=['1','2','3','repetition','4'];
export const stepsForOdeModule = id => id==='1'?odeSteps:id==='2'?proportionalSteps:id==='3'?localSteps:id==='repetition'?reviewSteps:id==='4'?fieldSteps:[];
export const odeRoute = (module='',step='') => ['differentialEquations',module,step].filter(Boolean).join('/');
export function parseOdeRoute(hash) {
 const [topic,requested,step] = hash.replace(/^#/,'').split('/');
 if(topic !== 'differentialEquations') return null;
 const module = odeModules.some(m=>m.id===requested)?requested:'';
 const steps=stepsForOdeModule(module);
 const resolvedStep = steps.length ? (steps.some(s=>s[0]===step)?step:'start') : '';
 return {module,step:resolvedStep,path:odeRoute(module,resolvedStep)};
}
export const odePages = odeSteps.map(s=>odeRoute('1',s[0]));
