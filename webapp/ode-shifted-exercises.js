import {shiftedTask,num,pick} from './tasks/bank/ode-shifted.js';
const q=(id,prompt,answer,help)=>shiftedTask(id,prompt,[typeof answer==='number'?num('answer','Dit svar',answer):pick('answer','Vælg svar',answer[0],answer[1])],help,{hint:help});
export const shiftedPre=[
 q('pre.parentheses','Beregn 0,1·(20 − 40).',-2,'Parentesen er minus 20. Gang derefter med 0,1.'),
 q('pre.equation','Løs 10 − 5y = 0. Hvad er y?',2,'Flyt fem gange y til den anden side og divider med fem.'),
 q('pre.exponential','Hvad er e opløftet til nul?',1,'En positiv base opløftet til nul giver én.'),
 q('pre.log','Hvis e opløftet til u er 2, hvad er u?',['ln',[['ln','ln(2)'],['two','2']]],'Den naturlige logaritme ophæver eksponentialfunktionen.'),
 q('pre.units','Temperaturen måles i °C og tiden i minutter. Hvad er enheden for den afledte?',['rate',[['rate','°C pr. minut'],['temperature','°C']]],'Den afledte angiver ændring i temperatur pr. tidsenhed.'),
];
export const shiftedMini=[
 q('mini.equilibrium','Find ligevægten i y′ = 12 − 3y.',4,'Sæt den afledte lig nul: 12 − 3y = 0.'),
 q('mini.constant','En løsning er y = 4 + C·e opløftet til −3x og y(0) = 10. Find C.',6,'Ved nul er eksponentialfaktoren én. Ti minus fire er seks.'),
 q('mini.point','En løsning er y = 4 + 6·e opløftet til −3(x − 2). Hvad er y(2)?',10,'Ved to er eksponenten nul. Derfor er værdien fire plus seks.'),
 q('mini.parameter','Temperaturforskellen til omgivelserne halveres på to timer. Hvilken positiv k passer i T′ = k·(L − T)?',['right',[['right','k = ln(2)/2'],['wrong','k = −ln(2)/2']]],'Forskellen aftager med eksponenten −kt. Derfor er k positiv.'),
 q('mini.limit','Begyndelsesværdien er under ligevægten, og k er positiv. Hvad sker der?',['rise',[['rise','Løsningen vokser mod ligevægten.'],['fall','Løsningen falder mod nul.'],['cross','Løsningen krydser ligevægten efter endelig tid.']]],'Afstanden til ligevægten bliver mindre, mens fortegnet bevares.'),
];
export const shiftedFinal=[
 q('final.equilibrium','Find ligevægten for y′ = 18 − 3y.',6,'Ligevægten er 18 divideret med tre.'),
 q('final.constant','I y = 6 + C·e opløftet til −3x er y(0) = 2. Find C.',-4,'Konstanten er begyndelsesværdien minus ligevægten: to minus seks.'),
 q('final.rearrange','Omskriv 2y′ + 6y = 12 til y′ = a − by. Hvad er b?',3,'Divider alle led med to: y′ = 6 − 3y.'),
 q('final.cooling','En temperatur følger T′ = 0,2·(20 − T). Find ændringshastigheden ved T = 30.',-2,'Forskellen er minus ti, så hastigheden er minus to temperaturgrader pr. tidsenhed.'),
 q('final.method','I hvilken ligning kan standardformen med konstante a og b anvendes direkte?',['constant',[['constant','y′ = 8 − 2y'],['variable','y′ = y·e opløftet til −x']]],'I den anden ligning afhænger koefficienten af argumentet. Det kræver en anden behandling.'),
];
export const shiftedTaskStep=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.id.includes('.mini.')?({equilibrium:'ligevaegt',constant:'familie',point:'begyndelse',parameter:'parameter',limit:'udforsk'}[t.id.split('.').at(-1)]):!t.aids?'oevelser':['ode5.bath','ode5.mexico','ode5.ball'].includes(t.id)?'udvidet':'modeller';
