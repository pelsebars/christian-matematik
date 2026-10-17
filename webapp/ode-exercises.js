import { expressionMath } from './tasks/math.js';
import { math,n,x,power,plus,minus,eq,frac,fn,prime } from './integral-math.js';
import { choice,part,y,yp } from './tasks/bank/ode.js';
const q=(id,prompt,type,answer,help,options)=>({id,prompt:`<p>${prompt}</p>`,aids:false,parts:[part('answer','Dit svar',type,answer,options)],hints:[help,'Brug grundhjælpen på startsiden, og prøv derefter igen.'],solution:`<p>${help}</p><p>Facit: ${type==='choice'?options.find(o=>o.id===answer).label:type==='expression'?expressionMath(answer):math(n(Number(answer)))}.</p>`,errors:[{part:'answer',feedback:help.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')}]});
export const odePre=[
 q('ode.pre.function',`For ${math(fn('f')+eq+n(2)+x+plus+n(1))}: beregn ${math(fn('f',n(3)))}.`,'number','7','Funktionsnotation: indsæt tre på variablens plads. Gang med to og læg én til.'),
 q('ode.pre.derivative',`Differentier ${math(fn('f')+eq+power(x,2)+plus+n(4))}.`,'expression','2*x','Differentiation: eksponenten to ganges på, og eksponenten sænkes med én. Konstantens afledte er nul.'),
 q('ode.pre.sign',`Beregn ${math(n(3)+minus+'<mo>(</mo>'+n(-2)+'<mo>)</mo>')}.`,'number','5','Fortegn: at trække et negativt tal fra svarer til at lægge det positive tal til.'),
 q('ode.pre.fraction',`Beregn ${math(frac(n(6),n(3)))}.`,'number','2','Brøker: seks divideret med tre er to. Tæller og nævner er ikke to tal, der skal trækkes fra hinanden.'),
 q('ode.pre.power',`Beregn ${math(power(n(3),2))}.`,'number','9','Potenser: anden potens betyder tallet ganget med sig selv, altså tre gange tre.'),
];
export const odeMini=[
 q('ode.mini.notation',`Hvilket udtryk betegner ændringshastigheden for ${math(y)} som funktion af ${math(x)}?`,'choice','derivative','Den afledte måler lokal ændringshastighed. De tre notationer betyder det samme, når den afhængige variabel er funktionen af den uafhængige.',[choice('derivative',math(yp+eq+prime('f')+eq+frac('<mi>d</mi>'+y,'<mi>d</mi>'+x))),choice('value','Funktionsværdien alene.')]),
 q('ode.mini.check','To udtryk er ens ved ét enkelt argument. Har du dermed vist, at forslaget er en løsning på et helt interval?','choice','no','Nej. Ligheden skal gælde for alle argumenter på intervallet; ét punkt er ikke nok.',[choice('no','Nej, der kræves en identitet på hele intervallet.'),choice('yes','Ja, ét punkt er altid nok.')]),
 q('ode.mini.family',`Hvilket medlem af ${math(fn('f')+eq+power(x,2)+'<mo>+</mo><mi>C</mi>')} opfylder ${math(fn('f',n(0))+eq+n(4))}? Angiv konstanten.`,'number','4','Indsæt nul i forskriften. Kvadratleddet giver nul, så konstanten skal være fire.'),
];
export const odeFinal=[
 q('ode.final.function','Hvad er en løsning til en differentialligning?','choice','function','En løsning er en differentiabel funktion, der opfylder ligningen på et interval.',[choice('function','En funktion, der opfylder ligningen på et interval.'),choice('number','Kun et enkelt tal.')]),
 q('ode.final.derivative',`For ${math(fn('f')+eq+power(x,2)+plus+n(3))}: hvad er højresiden i ${math(yp+eq+n(2)+x)}, efter at forslaget er indsat?`,'expression','2*x','Højresiden indeholder kun den uafhængige variabel. Den ændres derfor ikke ved indsættelse af funktionen.'),
 q('ode.final.initial',`Familien ${math(fn('f')+eq+power(x,2)+'<mo>+</mo><mi>C</mi>')} skal opfylde ${math(fn('f',n(1))+eq+n(6))}. Bestem konstanten.`,'number','5','Kvadratet af én er én. Isolér konstanten i én plus konstanten lig seks.'),
 q('ode.final.identity','En kandidat opfylder begyndelsesbetingelsen, men dens afledte afviger fra højresiden andre steder. Er den en løsning til hele problemet?','choice','no','Både differentialligningen på intervallet og begyndelsesbetingelsen skal være opfyldt.',[choice('no','Nej, begge krav skal være opfyldt.'),choice('yes','Ja, begyndelsespunktet er nok.')]),
];
