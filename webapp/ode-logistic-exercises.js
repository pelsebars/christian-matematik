import {logisticTask,num,pick} from './tasks/bank/ode-logistic.js';
const q=(id,prompt,answer,help)=>logisticTask(id,prompt,[typeof answer==='number'?num('answer','Dit svar',answer):pick('answer','Vælg svar',answer[0],answer[1])],help,{hint:help});
export const logisticPre=[
 q('pre.product','Beregn 0,01·10·(100 − 10).',9,'Parentesen er 90. Gang derefter alle tre faktorer.'),
 q('pre.fraction','Beregn 100/(1 + 9).',10,'Beregn hele nævneren først: én plus ni er ti.'),
 q('pre.exponential','Hvad er e opløftet til nul?',1,'En positiv base opløftet til nul giver én.'),
 q('pre.log','Hvis C·e opløftet til −rt = 1, med C og r positive, hvad er t?',['right',[['right','ln(C)/r'],['wrong','−ln(C)/r']]],'Divider med C, tag logaritmen og divider med −r. Det giver ln(C)/r.'),
 q('pre.rate','En bestand er 100, og dens afledte er 9 pr. uge. Hvad fortæller tallet ni?',['rate',[['rate','Den øjeblikkelige ændring i antal pr. uge.'],['amount','Det aktuelle antal individer.']]],'Den afledte er hastigheden, ikke funktionsværdien.'),
];
export const logisticMini=[
 q('mini.model','En plante vokser proportionalt med både højden y og afstanden til 100 cm. Konstanten er 0,01. Hvilken model passer?',['right',[['right','y′ = 0,01·y·(100 − y)'],['shifted','y′ = 0,01·(100 − y)']]],'Logistisk vækst har begge faktorer: den aktuelle størrelse og afstanden til grænsen.'),
 q('mini.constant','For M = 100 og y(0) = 4: Find C i y = M/(1 + C·e opløftet til −aMt).',24,'C = M/y(0) − 1 = 100/4 − 1 = 24.'),
 q('mini.maximum','En logistisk model har M = 80 og positiv a. Ved hvilken funktionsværdi er højresiden størst?',40,'Parablen a·y·(M − y) har toppunkt ved y = M/2.'),
 q('mini.parameter','En model er y′ = y·(0,02 − ay) med øvre grænse 22. Hvilket udtryk giver a?',['right',[['right','0,02/22'],['wrong','0,02·22']]],'Den positive ligevægt findes ved 0,02 − ay = 0, så 22 = 0,02/a.'),
 q('mini.interval','I en logistisk model er M = 100 og y(0) = 80. Hvornår er væksthastigheden størst for t ≥ 0?',['start',[['start','Ved start. Bestanden er allerede over halvdelen af grænsen.'],['future','Senere, når bestanden er 50.']]],'Bestanden vokser fra 80 mod 100. Den var 50 før modellens start, så væksthastigheden aftager efter start.'),
];
export const logisticFinal=[
 q('final.exponent','I y′ = 0,002·y·(100 − y): Hvad er det positive tal r i eksponenten −rt?',.2,'Gang a med M: 0,002 gange 100 er 0,2.'),
 q('final.constant','M = 100 og y(0) = 20. Find C i den logistiske løsningsform.',4,'C = 100/20 − 1 = 4.'),
 q('final.maximum','For y′ = 0,002·y·(100 − y): Hvad er den maksimale værdi af højresiden?',5,'Indsæt y = 50: 0,002 gange 50 gange 50 er fem.'),
 q('final.zero','Er y = 0 en løsning til y′ = a·y·(M − y)?',['yes',[['yes','Ja, begge sider er nul.'],['no','Nej, fordi standardformlen med M/y(0) ikke kan bruges.']]],'Kontrollér i selve differentialligningen. En division med y kan skjule nulfunktionen.'),
 q('final.inverse','En positiv væksthastighed er mindre end aM²/4. Hvor mange funktionsværdier mellem nul og M giver denne hastighed?',['two',[['two','To, én på hver side af M/2.'],['one','Altid kun én.']]],'En vandret linje under parablens toppunkt og over nul skærer parablen to steder.'),
];
export const logisticTaskStep=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.id.includes('.mini.')?({model:'model',constant:'loesning',maximum:'maksimum',parameter:'parameter',interval:'udforsk'}[t.id.split('.').at(-1)]):!t.aids?'oevelser':['ode6.harvest','ode6.soup'].includes(t.id)?'udvidet':'modeller';
