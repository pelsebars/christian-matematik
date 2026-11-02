import {finishTask,num,pick,expr} from './tasks/bank/ode-finish.js';
const q=(id,goal,prompt,answer,help)=>finishTask(id,prompt,[typeof answer==='number'?num('answer','Dit svar',answer):pick('answer','Vælg svar',answer[0],answer[1])],help,{goal,hint:help});
export const finishPre=[
 q('pre.check','check','Hvad søger man, når en differentialligning løses?',['function',[['function','En funktion, der passer med sin afledte på et interval.'],['number','Altid ét enkelt tal.']]],'Den ukendte er en funktion; en begyndelsesbetingelse kan vælge én blandt flere.'),
 q('pre.exponential','exponential','En mængde følger y′ = 0,2y. Find hastigheden ved y = 10.',2,'Indsæt ti i højresiden.'),
 q('pre.local','local','Find hældningen i (2; 3), når y′ = x + y.',5,'Indsæt begge koordinater: to plus tre.'),
 q('pre.numerical','numerical','Hældningen er −2. Hvor stor er ændringen i et Euler-trin med h = 0,5?',-1,'Ændringen er skridtlængde gange hældning.'),
 q('pre.shifted','shifted','Find den konstante løsning til y′ = 10 − 2y.',5,'Sæt højresiden lig nul.'),
 q('pre.logistic','logistic','For y′ = 0,01y(80 − y): Ved hvilken funktionsværdi er højresiden størst?',40,'Parablens toppunkt ligger ved halvdelen af 80.'),
];
export const finishFinal=[
 q('final.check','check','To sider af en differentialligning er ens ved begyndelsespunktet. Er det tilstrækkelig løsningskontrol?',['no',[['no','Nej, ligheden skal gælde på hele det relevante interval.'],['yes','Ja, ét punkt er altid tilstrækkeligt.']]],'Kontrollér identiteten med funktionen og dens afledte samt begyndelsesbetingelsen særskilt.'),
 q('final.exponential','exponential','I y′ = ky er y(0) = 4 og y(2) = 4e⁶. Find k.',3,'Divider med fire: e opløftet til 2k er e opløftet til seks, så 2k = 6.'),
 finishTask('final.local','En løsning til y′ = 2x − y går gennem (1; 4). Find tangenten.',[expr('answer','Tangentens højreside','-2*x+6')],'Hældningen er 2 − 4 = −2. Tangenten er −2(x − 1) + 4 = −2x + 6.',{goal:'local',hint:'Indsæt punktet i højresiden og brug punkt-hældningsformen.'}),
 q('final.numerical','numerical','Tag ét Euler-trin med h = 0,2 fra (2; 1) i y′ = y − 2x. Find den nye højde.',.4,'Hældningen er 1 − 4 = −3. Ny højde er 1 + 0,2·(−3) = 0,4.'),
 q('final.shifted','shifted','En løsning til y′ = 15 − 3y har y(0) = 2. Find C i y = 5 + C·e opløftet til −3x.',-3,'Ved nul er eksponentialfaktoren én, så 2 = 5 + C.'),
 q('final.logistic','logistic','Find den største værdi af højresiden i y′ = 0,01y(60 − y) for 0 ≤ y ≤ 60.',9,'Ved y = 30 er højresiden 0,01·30·30 = 9.'),
];
export const finishTaskStep=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.aids?'med':'uden';
