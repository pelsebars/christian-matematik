import { task,num,pick } from './tasks/bank/ode-proportional.js';
import { math,N,x,exp,eq,fn,formula } from './ode-proportional-math.js';
const q=(id,prompt,parts,help)=>task(id,prompt,parts,help,{hint:help});
export const proportionalPre=[
 q('pre.exponential',`Beregn ${math(exp(N(0)))}.`,[num('answer','Værdi',1)],'Et positivt tal i nulte potens er én.'),
 q('pre.point',`Hvad betyder punktet ${math('<mo>(</mo>'+N(2)+'<mo>;</mo>'+N(7)+'<mo>)</mo>')} på grafen?`,[pick('answer','Betydning','a',[['a',math(fn('f',N(2))+eq+N(7))],['b','Hældningen ved to er syv.']])],'Et punkt oplyser funktionsværdien; det oplyser ikke den afledte.'),
 q('pre.derivative',`Differentier ${math(exp(N(3)+x))}.`,[pick('answer','Afledt','a',[['a',math(N(3)+exp(N(3)+x))],['b',math(exp(N(3)+x))]])],'Kædereglen: gang med den indre funktions afledte, som er tre.'),
 q('pre.algebra',`Bestem konstanten i ${math(N(4)+'<mi>C</mi>'+eq+N(12))}.`,[num('answer','Konstant',3)],'Divider begge sider med fire.'),
 q('pre.log',`Bestem ${math('<mi>a</mi>')}, når ${math(exp('<mi>a</mi>')+eq+exp(N(5)))}.`,[num('answer','Eksponent',5)],'Eksponentialfunktionen er entydig: ens funktionsværdier giver ens eksponenter.'),
];
export const proportionalMini=[
 q('mini.rate','En beholder rummer 80 liter. Afløbet fjerner hvert øjeblik 0,1 gange den aktuelle vandmængde pr. minut.',[num('answer','Vandmængdens ændringshastighed lige nu (liter pr. minut)',-8)],'Afløbet gør ændringen negativ. Minus 0,1 gange 80 er minus otte.'),
 q('mini.family','En løsning til den proportionale differentialligning har begyndelsesværdi nul. Hvilken løsning får du?',[pick('answer','Løsning','a',[['a','Nulfunktionen.'],['b','Eksponentialfunktionen med begyndelsesværdi én.']])],'Begyndelsesværdien ganges på eksponentialfaktoren. Nul gange enhver faktor er nul.'),
 q('mini.initial',`En løsning er ${math('<mi>C</mi>'+exp(N(4)+x))} og har værdi tre ved nul.`,[num('answer','Konstanten',3)],'Ved nul er eksponentialfaktoren én, så konstanten er tre.'),
 q('mini.shift',`Hvilken forskrift opfylder ${math(fn('f',N(1))+eq+N(3))} og har proportionalitetskonstant fire?`,[pick('answer','Forskrift','a',[['a',math(formula(3,4,1))],['b',math(formula(3,4))]])],'Tidsforskellen skal være nul i det oplyste punkt. Træk derfor én fra argumentet.'),
 q('mini.parameter',`En positiv løsning har forholdet ${math('<mfrac><mrow>'+fn('f',N(2))+'</mrow><mrow>'+fn('f',N(0))+'</mrow></mfrac>'+eq+exp(N(6)))}.`,[num('answer','Proportionalitetskonstant',3)],'Over to tidsenheder bliver eksponenten to gange konstanten. To gange konstanten er seks.'),
 q('mini.sign','En positiv begyndelsesværdi ganges med en eksponentialfaktor med negativ proportionalitetskonstant.',[pick('answer','Udvikling','a',[['a','Mængden aftager, men forbliver positiv.'],['b','Mængden bliver negativ.']])],'Eksponentialfaktoren er altid positiv. Et negativt fortegn i eksponenten giver aftagende positive værdier.'),
];
export const proportionalFinal=[
 q('final.family','Hvor står den vilkårlige konstant i løsningsfamilien?',[pick('answer','Placering','a',[['a','Den ganges på eksponentialfunktionen.'],['b','Den lægges til eksponentialfunktionen.']])],'Differentiering og indsættelse skal give samme faktor gange den samme funktion.'),
 q('final.point',`Løsningen ${math('<mi>C</mi>'+exp(N(2)+x))} har værdi ${math(N(5)+exp(N(2)))} ved én.`,[num('answer','Konstant',5)],'Indsæt én og divider begge sider med eksponentialfaktoren.'),
 q('final.rate','En mængde på 60 gram aftager med en øjeblikkelig relativ hastighed på 0,2 pr. time.',[num('answer','Ændringshastighed (gram pr. time)',-12)],'Hastigheden er minus 0,2 gange 60 gram pr. time.'),
 q('final.zero','Når proportionalitetskonstanten er nul, og begyndelsesværdien er syv, hvad er værdien efter ti tidsenheder?',[num('answer','Værdi',7)],'Afledt nul betyder konstant funktion. Begyndelsesværdien bevares.'),
 q('final.assumption','Du bruger en eksponentiel model for bakterievækst. Hvad skal du være opmærksom på?',[pick('answer','Vurdering','a',[['a','Konstant relativ væksthastighed er en antagelse; mangel på næring kan gøre modellen uegnet senere.'],['b','To datapunkter beviser, at modellen gælder til alle tider.']])],'En matematisk løsning opfylder ligningen, men modellens antagelser skal også passe til virkeligheden.'),
];

export const proportionalTaskStep=t=>t.id.includes('.pre.')?'start':t.id.includes('.final.')?'sluttjek':t.id.includes('.mini.')?({rate:'proportional',family:'familie',initial:'begyndelse',shift:'punkt',parameter:'parameter',sign:'udforsk'}[t.id.split('.').at(-1)]):t.aids?'modeller':'oevelser';
