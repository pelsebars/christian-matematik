import {math,n,mi,op,mu,sigma,X,distribution,frac,fn} from './normal-math.js';
import {z,Z,Phi} from './normal-standard-math.js';
import {choice} from './tasks/bank/normal.js';
import {standardPart as part} from './tasks/bank/normal-standard.js';
const q=(id,prompt,type,answer,help,options)=>({id,aids:false,prompt:`<p>${prompt}</p>`,parts:[part('answer','Dit svar',type,answer,options)],hints:[help,'Se det gennemregnede eksempel eller åbn grundhjælpen. Prøv derefter igen.'],solution:`<p>${help}</p><p>Facit: ${type==='choice'?options.find(o=>o.id===answer).label:math(Number(answer)<0?op('−')+n(String(Math.abs(Number(answer))).replace('.',',')):n(String(answer).replace('.',',')))}.</p>`,errors:[{part:'answer',feedback:help.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')}]});
export const standardPre=[
 q('norm2.pre.sign',`Beregn ${math(n(106)+op('−')+n(100))}.`,'number','6','Subtraktion: træk 100 fra 106. Du finder forskellen, ikke forholdet mellem tallene.'),
 q('norm2.pre.negative',`Beregn ${math(n(98)+op('−')+n(100))}.`,'number','-2','Fortegn: et mindre tal minus et større tal giver en negativ forskel.'),
 q('norm2.pre.fraction',`Beregn ${math(frac(n(-6),n(3)))}.`,'number','-2','Brøkregning: divider seks med tre og bevar det negative fortegn.'),
 q('norm2.pre.decimal',`Beregn ${math(n('1,95')+op('−')+n(2))}.`,'number','-0.05','Decimalregning: skriv 2 som 2,00. 1,95 minus 2,00 er minus 0,05.'),
 q('norm2.pre.parameter',`Hvad er spredningen i ${math(distribution(n(100),n(2)))}?`,'number','2','Notation: materialets anden parameter er spredningen. Du skal ikke tage kvadratroden af den.'),
 q('norm2.pre.complement','Et venstre areal er 0,8. Hvad er den resterende sandsynlighed til højre?','number','0.2','Sandsynlighed: venstre og højre område dækker tilsammen én. Træk 0,8 fra én.'),
 q('norm2.pre.area','Hvad på en tæthedsgraf beskriver en sandsynlighed?','choice','area','Tæthed er højde. Sandsynlighed er et areal under kurven.',[choice('area','Et areal under kurven.'),choice('height','Kurvens højde ved en enkelt værdi.')]),
 q('norm2.pre.equation',`Løs ligningen ${math(n(100)+op('+')+n(2)+mi('u')+op('=')+n(106))}.`,'number','3','Ligninger: træk 100 fra begge sider og divider derefter begge sider med to.'),
];
export const standardMini=[
 q('norm2.mini.unit','Hvad betyder det at måle en afstand i antal spredninger?','choice','relative','Spredningen bruges som ny måleenhed. To spredninger betyder en afstand på to gange modellens spredning.',[choice('relative','At sammenligne afstanden til centrum med spredningens størrelse.'),choice('percent','At gøre afstanden til en procentandel.')]),
 q('norm2.mini.positive','Målingen er 106, middelværdien 100 og spredningen 3. Bestem den standardiserede værdi.','number','2','Afstanden til centrum er seks. Divider den med tre for at få antal spredninger.'),
 q('norm2.mini.negative','Målingen er 96, middelværdien 100 og spredningen 2. Bestem den standardiserede værdi med fortegn.','number','-2','Afstanden er minus fire. Divider med spredningen to; minusfortegnet viser under centrum.'),
 q('norm2.mini.reverse',`Middelværdien er 50, spredningen er 6, og ${math(z+op('=')+n('0,5'))}. Find observationen i oprindelig skala.`,'number','53','En halv spredning er tre oprindelige enheder. Læg de tre til middelværdien 50.'),
 q('norm2.mini.compare','En observation ligger én spredning over sit centrum. En anden ligger to spredninger over sit centrum. Hvilken har den højeste relative placering?','choice','second','Sammenlign placeringerne i spredninger; de to oprindelige måleenheder behøver ikke være ens.',[choice('second','Den anden observation.'),choice('first','Den første observation.')]),
 q('norm2.mini.shape','Gør standardisering automatisk et skævt datasæt normalfordelt?','choice','no','Nej. Standardisering flytter og skalerer. Fordelingens form ændres ikke til en klokke, hvis den ikke allerede har den form.',[choice('no','Nej, det ændrer ikke fordelingens grundlæggende form.'),choice('yes','Ja, alle standardiserede data er normalfordelte.')]),
 q('norm2.mini.normal',`En normalmodel har middelværdi 8 og spredning 5. Hvad er den øvre grænse i normalintervallet?`,'number','18','Normalintervallet går to spredninger på hver side af centrum. Øvre grænse er otte plus to gange fem.'),
 q('norm2.mini.boundary','En observation ligger præcis tre spredninger over middelværdien. Er den exceptionel efter materialets konvention?','choice','no','Exceptionelt kræver mere end tre spredninger. Præcis tre er uden for normalintervallet, men er ikke exceptionelt.',[choice('no','Nej.'),choice('yes','Ja, fordi den er uden for normalintervallet.')]),
 q('norm2.mini.coverage','Hvor mange procent ligger cirka inden for to spredninger af centrum i en normalfordeling?','number','95.45','Tabellen viser cirka 95,45 procent i området to spredninger på hver side af centrum.'),
 q('norm2.mini.tail',`Du må bruge ${math(Phi(n(1))+op('≈')+n('0,8413'))}. Find sandsynligheden for, at standardvariablen er over én. Brug den oplyste afrunding.`,'number','0.1587','Phi giver venstre areal. Højre hale er én minus det oplyste venstre areal.'),
 q('norm2.mini.quantile',`En fraktil i standardmodellen er ${math(z+op('=')+op('−')+n('0,5'))}. Den oprindelige model har middelværdi 10 og spredning 2. Hvad er fraktilen i oprindelig skala?`,'number','9','Gang minus en halv med spredningen to og læg middelværdien ti til.'),
];
export const standardFinal=[
 q('norm2.final.sign',`Hvad betyder ${math(z+op('=')+op('−')+n('1,5'))}?`,'choice','below','Fortegnet viser siden af centrum; tallets størrelse angiver antal spredninger.',[choice('below','Halvanden spredning under middelværdien.'),choice('above','Halvanden spredning over middelværdien.'),choice('probability','En sandsynlighed på minus halvanden.')]),
 q('norm2.final.sd','Hvad er spredningen i standardnormalfordelingen?','number','1','Standardnormalfordelingen har middelværdi nul og spredning én. Anden parameter er stadig spredningen.'),
 q('norm2.final.reverse',`Middelværdien er 100, spredningen 2 og ${math(z+op('=')+n(2))}. Bestem observationen.`,'number','104','To spredninger er fire oprindelige enheder. Læg dem til middelværdien.'),
 q('norm2.final.boundary','En observation ligger præcis to spredninger under centrum. Er den i normalintervallet?','choice','yes','Normalintervallet inkluderer begge grænser, som ligger to spredninger fra centrum.',[choice('yes','Ja, grænsen er med.'),choice('no','Nej, alle grænseværdier er exceptionelle.')]),
 q('norm2.final.tail',`Du får ${math(Phi(n(2))+op('≈')+n('0,9772'))}. Find højre hale over to i standardmodellen ud fra den oplyste afrunding.`,'number','0.0228','Træk det oplyste venstre areal fra én. Den standardiserede grænse to er ikke selv sandsynligheden.'),
 q('norm2.final.shape','Er en standardiseret observation nok til at bevise, at de oprindelige data er normalfordelte?','choice','no','En ændring af centrum og måleenhed er ikke en kontrol af dataenes form. Normalmodellen skal begrundes særskilt.',[choice('no','Nej, normalantagelsen skal stadig undersøges.'),choice('yes','Ja, standardisering er altid et bevis for normalfordeling.')]),
];
