import {math,n,x,power,op} from './normal-math.js';
import {choice} from './tasks/bank/normal.js';
import {standardPart as part} from './tasks/bank/normal-standard.js';
import {systemPrompt,algebraSquareTasks,algebraSystemTasks} from './tasks/bank/normal-algebra.js';
export const algebraNumber=(id,label,answer)=>part(id,label,'number',String(answer));
export const algebraChoice=(id,label,answer,options)=>part(id,label,'choice',answer,options.map(([key,label])=>choice(key,label)));
const q=(id,prompt,parts,help)=>({id,aids:false,prompt:`<p>${prompt}</p>`,parts,hints:[help,'Se det gennemregnede eksempel og prøv det samme regnetrin igen.'],solution:`<p>${help}</p>`,errors:parts.map(p=>({part:p.id,feedback:help.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')}))});
const num=(id,prompt,answer,help)=>q(id,prompt,[algebraNumber('answer','Dit svar',answer)],help);
const choose=(id,prompt,answer,options,help)=>q(id,prompt,[algebraChoice('answer','Vælg svar',answer,options)],help);
export const algebraPreSquare=[
 num('b1011.pre.sign',`Beregn ${math(n(-3)+op('·')+n(-2))}.`,6,'Fortegnsregning: negativt gange negativt er positivt. Tre gange to er seks.'),
 num('b1011.pre.power',`Beregn ${math(power(n(-3),2))}.`,9,'Parenteser og potenser: hele minus tre ganges med sig selv. Resultatet er positivt ni.'),
 choose('b1011.pre.distribute',`Hvilket udtryk er lig ${math(n(2)+op('(')+x+op('+')+n(3)+op(')'))}?`,'whole',[['whole',math(n(2)+x+op('+')+n(6))],['part',math(n(2)+x+op('+')+n(3))]],'Parentesregning: to skal ganges med hvert led. To gange x plus to gange tre giver to gange x plus seks.'),
 num('b1011.pre.recognize',`Hvad er koefficienten foran første potens, når ${math(power(x+op('+')+n(2),2))} ganges ud?`,4,'Blandet led: der er to produkter med x og to. Tilsammen giver de fire gange x.'),
];
export const algebraPreSystem=[
 num('b1011.pre.linear',`Løs ${math(n(3)+x+op('+')+n(6)+op('=')+n(12))}.`,2,'Ligningsregning: træk seks fra på begge sider og divider derefter begge sider med tre. x er to.'),
 num('b1011.pre.insert','Indsæt x lig tre og y lig én i udtrykket to gange x minus y.',5,'Indsættelse: to gange tre minus én er fem. Bevar fortegnet foran hele y-leddet.'),
 choose('b1011.pre.pair',`Skal det samme par passe i begge ligninger i ${systemPrompt([[1,1,4],[2,-1,5]])}?`,'both',[['both','Ja, begge betingelser skal gælde samtidig.'],['one','Nej, ét par må vælges til hver ligning.']],'Et løsningspar er to tal, som passer samtidig i begge oprindelige ligninger. Parret tre og én passer her.'),
 choose('b1011.pre.operation',`Hvad bliver y-leddene ved addition af ${systemPrompt([[1,1,4],[1,-1,2]])}?`,'zero',[['zero','De ophæver hinanden.'],['two','Der bliver to gange y.']],'Addition: y og minus y summerer til nul. Hele ligningerne lægges sammen, inklusive højresiderne.'),
];
export const algebraMiniSquare=[
 num('b1011.mini.plus',`Hvad er koefficienten foran første potens i ${math(power(x+op('+')+n(3),2))}?`,6,'De to blandede produkter er hver tre gange x. Koefficienten bliver seks.'),
 num('b1011.mini.minus',`Hvad er koefficienten foran første potens i ${math(power(x+op('−')+n(3),2))}?`,-6,'Begge blandede produkter er negative: minus tre gange x plus minus tre gange x giver minus seks gange x.'),
 num('b1011.mini.conjugate',`Hvad er konstantleddet i ${math(op('(')+x+op('+')+n(5)+op(')')+op('(')+x+op('−')+n(5)+op(')'))}?`,-25,'Fem ganget med minus fem er minus 25. De blandede produkter ophæver hinanden.'),
 choose('b1011.mini.factor',`Hvilken form svarer til ${math(power(x,2)+op('−')+n(16))}?`,'product',[['product',math(op('(')+x+op('−')+n(4)+op(')')+op('(')+x+op('+')+n(4)+op(')'))],['square',math(power(x+op('−')+n(4),2))]],'Forskellen mellem to kvadrater bliver produktet af en forskel og en sum. Udvid produktet og kontrollér, at mellemleddene forsvinder.'),
];
export const algebraMiniSystem=[
 choose('b1011.mini.pair','Hvad betyder en løsning til to ligninger med to ubekendte?','both',[['both','Et og samme par opfylder begge ligninger.'],['one','To tal, som tilsammen opfylder mindst én ligning.']],'Begge ligninger er samtidige krav. Den samme x-værdi og y-værdi skal bruges i begge.'),
 num('b1011.mini.substitute','Første ligning siger, at y er fem minus x. Den fundne x-værdi er fire. Hvad er y?',1,'Indsæt fire for x i hele udtrykket: fem minus fire er én.'),
 num('b1011.mini.eliminate','Efter addition af to hele ligninger får du to gange x lig seks. Hvad er x?',3,'Divider begge sider med to. x er tre. Find derefter den anden ubekendte i en oprindelig ligning.'),
 choose('b1011.mini.scale','Du ganger en ligning med minus to. Hvilke dele skal ganges med minus to?','all',[['all','Alle led på begge sider.'],['x','Kun leddet med x.'],['left','Kun venstresiden.']],'En ligning er en balance. Faktoren skal ramme alle led på begge sider for at bevare de samme løsninger.'),
 choose('b1011.mini.method','I den ene ligning står y alene med koefficient én. Hvilken metode kan være en enkel start?','sub',[['sub','Isolér y og indsæt hele udtrykket i den anden ligning.'],['drop','Slet y fra begge ligninger uden videre.']],'Substitution er ofte enkel ved en koefficient på én. Elimination kan også være korrekt; vælg en gyldig vej og kontrollér begge betingelser.'),
 choose('b1011.mini.cases','To ligninger beskriver præcis den samme linje. Har de én entydig fælles løsning?','many',[['many','Nej, alle punkter på linjen passer.'],['one','Ja, to ligninger giver altid ét par.']],'To ens betingelser giver ikke ny information. Her passer uendeligt mange par; parallelle forskellige linjer har derimod ingen fælles løsning.'),
];
export const algebraFinalSquare=[
 q('b1011.final.plus',`Bestem mellemled og konstant i udvidelsen af ${math(power(x+op('+')+n(3),2))}.`,[algebraNumber('linear','Koefficient foran første potens',6),algebraNumber('constant','Konstantled',9)],'Udvid to ens parenteser: de to blandede produkter giver seks gange x; tre gange tre giver ni.'),
 q('b1011.final.minus',`Bestem koefficienterne i ${math(power(n(2)+x+op('−')+n(3),2))}.`,[algebraNumber('quadratic','Koefficient foran anden potens',4),algebraNumber('linear','Koefficient foran første potens',-12),algebraNumber('constant','Konstantled',9)],'De fire produkter giver fire gange x i anden, minus seks gange x, minus seks gange x og plus ni.'),
 q('b1011.final.conjugate',`Bestem koefficient og konstant i ${math(op('(')+x+op('+')+n(5)+op(')')+op('(')+x+op('−')+n(5)+op(')'))}.`,[algebraNumber('quadratic','Koefficient foran anden potens',1),algebraNumber('constant','Konstantled',-25)],'De blandede produkter ophæver hinanden. Tilbage står x i anden minus 25.'),
 choose('b1011.final.factor',`Vælg den faktoriserede form af ${math(power(x,2)+op('−')+n(10)+x+op('+')+n(25))}.`,'square',[['square',math(power(x+op('−')+n(5),2))],['product',math(op('(')+x+op('−')+n(5)+op(')')+op('(')+x+op('+')+n(5)+op(')'))]],'Mellemleddet minus ti gange x er det dobbelte produkt med minus fem. Derfor er formen kvadratet af parentesen x minus fem.'),
];
export const algebraFinalSystem=[
 q('b1011.final.substitution',`Bestem begge tal i ${systemPrompt([[1,1,5],[2,-1,4]])}, og vælg en gyldig start.`,[algebraNumber('x','x',3),algebraNumber('y','y',2),algebraChoice('method','Gyldig start','isolate',[['isolate','Isolér y i den første og indsæt hele udtrykket i den anden.'],['erase','Slet y i begge ligninger uden at ændre resten.']])],'Første ligning giver y lig fem minus x. Indsættelse i anden giver tre gange x minus fem lig fire. Dermed x lig tre og y lig to; begge ligninger passer.'),
 q('b1011.final.elimination',`Bestem begge tal i ${systemPrompt([[2,3,11],[3,-2,10]])}.`,[algebraNumber('x','x',4),algebraNumber('y','y',1)],'Gang hele første ligning med to og hele anden med tre. Ved addition forsvinder y, og 13 gange x er 52. Dermed x er fire og y én; begge betingelser passer.'),
 q('b1011.final.verify',`Parret x lig to og y lig tre foreslås som løsning til ${systemPrompt([[1,1,5],[2,-1,7]])}. Beregn anden venstreside og vurder parret.`,[algebraNumber('second','Anden venstreside',1),algebraChoice('fits','Løser parret systemet?','no',[['no','Nej, kun første ligning passer.'],['yes','Ja, den første ligning er nok.']])],'Anden venstreside er to gange to minus tre, altså én. Det er ikke syv. Første ligning passer, men begge skal være opfyldt.'),
 q('b1011.final.cases',`A: ${systemPrompt([[1,1,4],[2,2,10]])}. B: ${systemPrompt([[1,1,4],[2,2,8]])}. Vælg antallet af løsninger i hvert system.`,[algebraChoice('a','A','none',[['none','Ingen.'],['one','Én.'],['many','Uendeligt mange.']]),algebraChoice('b','B','many',[['none','Ingen.'],['one','Én.'],['many','Uendeligt mange.']])],'Fordobl første ligning. I A får samme venstreside to forskellige højresider: ingen løsning. I B bliver ligningerne ens: uendeligt mange løsninger.'),
 q('b1011.final.model','En voksenbillet koster 12 kr., og en børnebillet 8 kr. Der købes tre billetter til i alt 28 kr. Hvor mange af hver type er der?',[algebraNumber('adult','Antal voksenbilletter',1),algebraNumber('child','Antal børnebilletter',2)],'Lad antallene opfylde summen tre og prissummen 28. Én voksen og to børn giver tre billetter og 12 plus 16 lig 28 kr. Begge betingelser og ikke-negative hele antal passer.'),
];
export const algebraPre=[...algebraPreSquare,...algebraPreSystem];
export const algebraMini=[...algebraMiniSquare,...algebraMiniSystem];
export const algebraFinal=[...algebraFinalSquare,...algebraFinalSystem];
export const algebraTracks=[
 {id:'square',label:'B10 · Kvadratsætninger',pre:algebraPreSquare,practice:[...algebraMiniSquare,...algebraSquareTasks],final:algebraFinalSquare,route:'kvadrater'},
 {id:'system',label:'B11 · To ligninger',pre:algebraPreSystem,practice:[...algebraMiniSystem,...algebraSystemTasks],final:algebraFinalSystem,route:'loesningspar'},
];
export function algebraTrackProgress(complete){return algebraTracks.map(track=>{const pre=track.pre.filter(complete).length,practice=track.practice.filter(complete).length,final=track.final.filter(complete).length,fast=pre===track.pre.length,mastered=final===track.final.length&&(fast||practice===track.practice.length);return {...track,preCount:pre,practiceCount:practice,finalCount:final,fast,mastered};});}
