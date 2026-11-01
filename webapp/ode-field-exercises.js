import {fieldTask,num,pick} from './tasks/bank/ode-field.js';
const q=(id,prompt,answer,help)=>fieldTask(id,prompt,[typeof answer==='number'?num('answer','Dit svar',answer):pick('answer','Vælg svar',answer[0],answer[1])],help,{hint:help});
export const fieldPre=[
 q('pre.coordinates','Et punkt har koordinaterne (2; 5). Hvad er funktionsværdien?',5,'Andenkoordinaten er funktionsværdien.'),
 q('pre.slope','I ligningen y′ = x + y: Hvad er hældningen i (2; 5)?',7,'Indsæt begge koordinater: to plus fem.'),
 q('pre.sign','En afledt er negativ. Hvordan bevæger grafen sig lokalt mod højre?',['down',[['down','Nedad.'],['up','Opad.']]],'Negativ hældning betyder faldende funktionsværdi lokalt.'),
 q('pre.step','En ret linje har hældning fire. Hvor meget stiger højden ved et vandret skridt på 0,5?',2,'Ændring i højde er hældning gange vandret ændring.'),
];
export const fieldMini=[
 q('mini.field','Hvad beskriver et hældningsfelt?',['directions',[['directions','Mulige løsningskurvers lokale retninger i mange punkter.'],['one','Én bestemt løsningskurves punkter.']]],'En begyndelsesbetingelse vælger en kurve; feltet giver retningerne.'),
 q('mini.rate','En hastighedsgraf har y vandret og y′ lodret. Hvilket tal bruges vandret for løsningspunktet (6; 1)?',1,'Brug funktionsværdien én, ikke argumentet seks.'),
 q('mini.euler','Brug ét Euler-trin i y′ = y fra (0; 1) med h = 0,5. Hvad bliver den nye højde?',1.5,'Ny højde er én plus 0,5 gange hældningen én.'),
 q('mini.check','To skridtlængder giver næsten samme resultat. Er resultatet dermed bevist eksakt?',['no',[['no','Nej, det er stadig en tilnærmelse.'],['yes','Ja.']]],'Sammenligning støtter den numeriske kontrol, men er ikke et bevis for eksakthed.'),
];
export const fieldFinal=[
 q('final.field','Skal en løsningskurve gennem alle feltets linjeelementer?',['no',[['no','Nej, den følger retningen i de punkter, den passerer.'],['yes','Ja.']]],'Feltet viser retninger for mange mulige kurver.'),
 q('final.rate','For y′ = 5y − y²: Hvad er ændringshastigheden ved y = 3?',6,'Fem gange tre minus ni er seks.'),
 q('final.euler','Brug ét Euler-trin i y′ = x + y fra (1; 2) med h = 0,2. Find den nye højde.',2.6,'Hældningen i det gamle punkt er tre, så højden bliver to plus 0,2 gange tre.'),
 q('final.window','En beregnet kurve forsvinder ud af grafvinduet. Er løsningen nødvendigvis ophørt?',['no',[['no','Nej. Undersøg både vindue og definitionsområde.'],['yes','Ja.']]],'Grafvinduet begrænser visningen, ikke automatisk løsningens domæne.'),
];
export const fieldTaskStep=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.id.includes('.mini.')?({field:'felt',rate:'hastighedsgraf',euler:'numerisk',check:'udforsk'}[t.id.split('.').at(-1)]):t.aids?'modeller':'oevelser';
