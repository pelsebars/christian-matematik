import {localTask,num,pick,expr} from './tasks/bank/ode-local.js';
import {math,N,x,eq,fn,y,yp,frac,power,point} from './ode-local-math.js';
const q=(id,prompt,parts,help)=>localTask(id,prompt,parts,help,{hint:help});
export const localPre=[
 q('pre.coordinates',`Punktet ${point(2,-3)} ligger på en graf. Hvad er funktionsværdien ved to?`,[num('answer','Funktionsværdi',-3)],'Andenkoordinaten er funktionsværdien; første koordinat er input.'),
 q('pre.substitution',`Beregn ${math(N(4)+x+'<mo>+</mo>'+y)} i punktet ${point(1,2)}.`,[num('answer','Værdi',6)],'Indsæt én for den vandrette koordinat og to for den lodrette. Gang før addition.'),
 q('pre.sign',`Beregn ${math(frac(N(4),N(-2)))}.`,[num('answer','Værdi',-2)],'Et positivt tal divideret med et negativt giver et negativt resultat.'),
 q('pre.line','En linje har hældning tre og går gennem punktet (1; 4).',[expr('answer','Linjen som funktion af x','3*x+1')],'Brug punktet: tre gange én plus skæringen med den lodrette akse skal give fire. Skæringen er én.'),
 q('pre.derivative',`Differentier ${math(power(x,2)+'<mo>+</mo>'+N(3)+x)}.`,[expr('answer','Afledt','2*x+3')],'Kvadratleddet giver to gange argumentet; det lineære led giver tre.'),
];
export const localMini=[
 q('mini.slope',`Hvad er hældningen for ${math(yp+eq+x+'<mo>+</mo>'+y)} i ${point(2,3)}?`,[num('answer','Hældning',5)],'Indsæt begge koordinater i højresiden: to plus tre er fem.'),
 q('mini.tangent','En løsningskurve går gennem (2; 5) og har hældningen tre dér.',[expr('answer','Tangentens højreside','3*x-1')],'Tangenten er tre gange forskellen fra to, plus fem. Det reduceres til tre gange argumentet minus én.'),
 q('mini.element','Hvad fortæller linjeelementet (2; 5; 3)?',[pick('answer','Betydning','a',[['a','Punktet er (2; 5), og den lokale hældning er tre.'],['b','Punktet er (2; 3), og hældningen er fem.'],['c','Løsningskurven har hældningen tre overalt.']])],'De første to tal angiver punktet. Det tredje angiver hældningen lige dér.'),
 q('mini.units','En population måles i millioner personer og tiden i år. Den afledte har værdien 0,5.',[num('answer','Antal personer pr. år',500000)],'En halv million personer pr. år er 500000 personer pr. år. Enheden følger både mængde og tidsvariabel.'),
 q('mini.cas','CAS giver en forskrift for et begyndelsesværdiproblem. Hvad kontrollerer du?',[pick('answer','Kontrol','a',[['a','Både differentialligningen på intervallet og begyndelsesbetingelsen.'],['b','Kun at grafen går gennem begyndelsespunktet.']])],'Differentier, indsæt i ligningen, reducer og kontrollér desuden begyndelsespunktet og domænet.'),
];
export const localFinal=[
 q('final.slope',`En løsning til ${math(yp+eq+y+'<mo>−</mo>'+N(2)+x)} går gennem ${point(1,5)}.`,[num('answer','Hældning i punktet',3)],'Funktionsværdi fem minus to gange argumentet én giver tre.'),
 q('final.tangent','En løsning går gennem (1; 5) og har hældning tre i punktet.',[expr('answer','Tangentens højreside','3*x+2')],'Tre gange forskellen fra én plus fem giver tre gange argumentet plus to.'),
 q('final.domain',`Kan ${math(yp+eq+frac(x,y))} give en hældning ved ${point(0,0)}?`,[pick('answer','Vurdering','no',[['no','Nej, udtrykket er ikke defineret.'],['yes','Ja, hældningen er nul.']])],'Nul divideret med nul er ikke defineret. Der kan ikke udledes en hældning ved indsættelse.'),
 q('final.model','En mængde på 80 gram ændres efter en proportional model med konstant −0,05 pr. time.',[num('answer','Fortegnet ændringshastighed (gram pr. time)',-4)],'Konstanten gange mængden er minus fire gram pr. time.'),
 q('final.local','Kan du bruge en tangent som den præcise løsningskurve over et helt interval?',[pick('answer','Vurdering','no',[['no','Ikke generelt. Tangenten beskriver den lokale retning og giver en lokal tilnærmelse.'],['yes','Ja, alle differentialligningers løsninger er rette linjer.']])],'En tangent deler punkt og hældning med kurven, men hældningen kan ændre sig videre langs kurven.'),
];
export const localTaskStep=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.id.includes('.mini.')?({slope:'hastighed',tangent:'tangent',element:'linjeelement',units:'modeller',cas:'cas'}[t.id.split('.').at(-1)]):!t.aids?'oevelser':['ode3.rabbits','ode3.grass','ode3.medicine'].includes(t.id)?'modeller':'cas';
