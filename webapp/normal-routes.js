import { normalModules } from './normal-plan.js';
export const normalIntroSteps=[['start','Hvorfor statistik?'],['maalinger','Målinger og klokken'],['areal','Sandsynlighed som område'],['fordeling','Andel eller grænse'],['standard','En fælles målestok'],['parametre','Find centrum og spredning'],['algebra','Hvad hjælper algebra med?'],['normalplot','Passer modellen?'],['regression','To størrelser følges ad'],['residualer','Afstande til linjen'],['usikkerhed','Et skøn kan flytte sig'],['interval','Konfidensinterval'],['omformning','En anden skala'],['overblik','Saml hele historien']];
export const normalSteps=[['start','Mål og forudsætninger'],['model','Fra måling til model'],['taethed','Tæthed og areal'],['fordeling','Fordelingsfunktionen'],['vaerktoej','Beregn og find en grænse'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const standardSteps=[['start','Mål og forudsætninger'],['standard','Mål i spredninger'],['tilbage','Tilbage og sammenligning'],['udfald','Normale og exceptionelle'],['sandsynlighed','Sandsynligheder'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const parameterSteps=[['start','Mål og forudsætninger'],['oplysninger','Kendte og ukendte'],['spredning','Find spredningen'],['middelvaerdi','Find middelværdien'],['begge','Find begge parametre'],['taethed','En tæthedsbetingelse'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const algebraSteps=[['start','To starttjek'],['kvadrater','Kvadratet af en sum'],['fortegn','Minus og modsatte fortegn'],['faktorisering','Faktorisering og kontrol'],['loesningspar','Et fælles løsningspar'],['substitution','Indsættelse'],['elimination','Kombinér ligninger'],['metode','Metodevalg og modeller'],['oevelser','Opgaver i to spor'],['sluttjek','To sluttjek'],['opsummering','Opsummering']];
export const plotSteps=[['start','Mål og forudsætninger'],['data','Målinger og stikprøve'],['plot','Fra rang til plot'],['aflaesning','Læs akser og parametre'],['vurdering','Vurder hele mønstret'],['estimation','Beregn estimater'],['vaerktoej','Model og dokumentation'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const regressionSteps=[['start','Mål og forudsætninger'],['regression','Linje og hældning'],['residualer','Residualer og spredning'],['modelkontrol','Undersøg antagelserne'],['usikkerhed','Stikprøver og usikkerhed'],['interval','Konfidensinterval'],['fortolkning','95 % og nul'],['omformning','Omformede modeller'],['vaerktoej','Dokumentér værktøjsbrug'],['oevelser','Opgaver'],['sluttjek','Forståelsestjek'],['opsummering','Opsummering']];
export const normalFinishSteps=[['start','Mål og starttjek'],['overblik','Din værktøjskasse'],['metode','Vælg fremgangsmåde'],['uden','Blandet uden hjælpemidler'],['med','Blandet med hjælpemidler'],['modelkontrol','Vurder konklusioner'],['sluttjek','Forståelsestjek'],['opsummering','Dit overblik']];
export const normalImplemented=['1','2','3','repetition','4','5','opsamling'];
export const stepsForNormalModule=module=>({'intro':normalIntroSteps,'1':normalSteps,'2':standardSteps,'3':parameterSteps,'repetition':algebraSteps,'4':plotSteps,'5':regressionSteps,'opsamling':normalFinishSteps}[module]||[]);
export const normalRoute=(module='',step='')=>['normalDistribution',module,step].filter(Boolean).join('/');
export const pagesForNormalModule=module=>stepsForNormalModule(module).map(([step])=>normalRoute(module,step));
export function parseNormalRoute(hash){
 const [topic,requested,step]=hash.replace(/^#/,'').split('/');if(topic!=='normalDistribution')return null;
 const module=requested==='intro'||normalModules.some(m=>m.id===requested)?requested:'',steps=stepsForNormalModule(module);
 const resolved=steps.length?(steps.some(s=>s[0]===step)?step:'start'):'';
 return {module,step:resolved,path:normalRoute(module,resolved)};
}
// Preserve the original public export and all existing module-1 links.
export const normalPages=pagesForNormalModule('1');
