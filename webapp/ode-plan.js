// Teaching order from Læseplan.pdf; dates are teaching dates, not deadlines.
export const odeModules = [
 {id:'1',title:'Hvad er en differentialligning?',date:'28/10',pages:'100–101',summary:'Læs notation, kontrollér løsninger og brug en begyndelsesbetingelse.',prerequisites:'Funktioner, den afledte, indsættelse, potenser og fortegn.',practice:'Kontrol ved differentiation og indsættelse; forskel på familie og valgt løsning.'},
 {id:'2',title:'Proportional differentialligning',date:'28/10',pages:'102–103 og 110',summary:'Forbind proportional ændringshastighed med eksponentiel vækst og aftagelse.',prerequisites:'Eksponentialfunktioner, begyndelsesbetingelser og kontrol fra modul 1.',practice:'Bestem parametre og partikulær løsning, fortolk enheder og dokumentér CAS.'},
 {id:'3',title:'Væksthastighed, tangent og linjeelement',date:'29/10',pages:'104–105',summary:'Find lokale hældninger, tangentligninger og linjeelementer uden hele løsningen.',prerequisites:'Punkter, hældning, tangentligning og indsættelse.',practice:'Lokale beregninger samt modeller med varierende koefficienter og CAS.'},
 {id:'repetition',title:'Logaritmer og binomialfordeling',date:'30/10',pages:'',summary:'Virtuel repetition B-niveau 8–9. To selvstændige spor med hvert sit diagnostiske tjek.',prerequisites:'Potenser, omvendte funktioner, sandsynlighed og uafhængige forsøg.',practice:'Gå hurtigt videre i det spor, du behersker. Logaritmer forbindes med eksponentialligninger; binomialfordelingen er selvstændig repetition.'},
 {id:'4',title:'Hældningsfelt og numerisk løsning',date:'2/11',pages:'106–107',summary:'Forbind hældningsfelt, begyndelsespunkt og løsningskurve; sammenlign med numeriske løsninger.',prerequisites:'Linjeelementer, koordinater og begyndelsesbetingelser.',practice:'Skitsér kurver og tegn hældningsfelt med digitale værktøjer. En trinvis numerisk metode bliver et tydeligt mærket pædagogisk supplement.'},
 {id:'5',title:'Forskudt eksponentiel vækst',date:'2/11',pages:'120–121',summary:'Arbejd med ligevægt, Newtons afkølingslov og lineære modeller af første orden.',prerequisites:'Eksponentialfunktioner, logaritmer, parenteser og fortegn.',practice:'Opstil modeller fra tekst, bestem og kontrollér løsning, fortolk ligevægt og langsigtet udvikling.'},
 {id:'6',title:'Logistisk vækst',date:'3/11',pages:'108–109',summary:'Beskriv begrænset vækst, bærekapacitet, ligevægt og maksimal væksthastighed.',prerequisites:'Eksponentialfunktioner, brøker, begyndelsesbetingelser og modeltolkning.',practice:'Opstil og vurder modeller, bestem parametre, løsninger, vendepunkt og maksimal væksthastighed.'},
 {id:'opsamling',title:'Samlet repetition og blandede opgaver',date:'Efter modul 6',pages:'',summary:'Vælg metode på tværs af modeller og forklar dine regnetrin.',prerequisites:'De seks moduler og relevant B-repetition.',practice:'Blandede prøver uden metodeafsløring, mindstekrav, ræsonnementer og dokumenteret CAS.'},
];
export const odeLabel = m => m.id === 'repetition' ? 'B-repetition 8–9' : m.id === 'opsamling' ? 'Opsamling' : `Modul ${m.id}`;
// [goal, introduced, practised, checked, aids]. Later checks remain planned.
export const odeGoals = [
 ['U1 · Forskellige løsningsmetoder','1: kontrol; 2, 5, 6: analytisk; 4: numerisk','1–6','1: sluttjek; 2–6 og opsamling (planlagt)','Begge'],
 ['U2 · Symbolbehandling og problemløsning med CAS','1: dokumenteret kontrol','1: CAS-opgave; 2–6','1: CAS-tjek; opsamling (planlagt)','Med'],
 ['U3 · Matematiske ræsonnementer og beviser','1: identitet på et interval','1: begrund begge sider; 2, 5, 6: løsninger','1: sluttjek; opsamling (planlagt)','Begge'],
 ['U4 · Matematikanvendelse','1: mængde og ændringshastighed','1: modelopgave; 2, 3, 5, 6','1: modelopgave; opsamling (planlagt)','Begge'],
 ['U5 · Fagets metoder og identitet','1: skeln model, funktion og kontrol','1: metodevalg; 4: numerisk kontra analytisk','1: sluttjek; opsamling (planlagt)','Begge'],
 ['U6 · Diskret matematik','B8–9: binomialmodel; 4: endelige regnetrin','B8–9 og 4','B8–9: eget sluttjek; opsamling (planlagt)','Begge'],
 ['U7 · Mindstekrav og grundlæggende færdigheder','1: forudsætningstjek og grundkort','Alle moduler med målrettet hjælp','1: mikroøvelser og sluttjek; øvrige (planlagt)','Uden'],
 ['K1 · Opstille differentialligninger ud fra tekst','1: ændringshastighed','1: modelopgave; 2, 5, 6','1: modelopgave; opsamling (planlagt)','Begge'],
 ['K2 · Differentialligningsmodeller og fortolkning','1: variable og enheder','2, 3, 5, 6','1: modelopgave; øvrige (planlagt)','Begge'],
 ['K3 · Lineære differentialligninger af første orden','1: genkendelse; 2: proportional; 5: forskudt','2 og 5; 3: bredere CAS-modeller','2, 3, 5 og opsamling (planlagt)','Begge'],
 ['K4 · Logistiske differentialligninger','6: begrænset vækst','6: parametre, ligevægt og vendepunkt','6 og opsamling (planlagt)','Begge'],
 ['K5 · Opgaver uden hjælpemidler','1: notation og løsningskontrol','1–6','1: fire afsluttende spørgsmål; øvrige (planlagt)','Uden'],
 ['K6 · CAS','1: afledt, substitution, interval og konklusion','1: CAS-opgave; 2–6','1: egen dokumentation og automatisk kontrol; øvrige (planlagt)','Med'],
 ['A1 · Ukendt funktion og afledt notation','1: første teoribid','1: mikroøvelser og opgaver','1: sluttjek','Uden'],
 ['A2 · Generel og partikulær løsning, begyndelsesbetingelse','1: familier og punkter','1: konstantopgave; 2, 5, 6','1: sluttjek; øvrige (planlagt)','Uden og med ved sværere udtryk'],
 ['A3 · Differentiering, indsættelse og gyldigt interval','1: kontrol i tre trin','1: polynomier og eksponentialfunktioner','1: kontrolopgaver og sluttjek','Begge'],
 ['A4 · Proportional model og eksponentiel vækst','2','2 og 3','2 og opsamling (planlagt)','Begge'],
 ['A5 · Væksthastighed, tangentligning og linjeelement','3','3 og 4','3 og 4 (planlagt)','Begge'],
 ['A6 · Hældningsfelt og numeriske løsninger','4','4: kurver og sammenligning','4 og opsamling (planlagt)','Skitse uden; numerisk med'],
 ['A7 · Ligevægt og langsigtet adfærd','5','5 og 6','5 og 6 (planlagt)','Begge'],
 ['B8 · Logaritmeregler, eksponentialligninger og domæne','B-repetition: eget starttjek','B-repetition; 2, 5, 6','B-repetition: eget sluttjek (planlagt)','Uden; digitale værktøjer ved talberegning'],
 ['B9 · Binomialforsøg, parametre, sandsynligheder og middelværdi','B-repetition: separat starttjek','B-repetition: enkelt- og intervalsandsynligheder','B-repetition: eget sluttjek (planlagt)','Begreber uden; beregninger med'],
];
