# Integralregning – læringsmål og progression

Første arbejdsgang: modul 1 er implementeret. Modul 2–7 og den unummererede mellemstation har struktur og mål, men ingen færdige undervisningsforløb endnu.

## Læringsmålskort

| Læringsmål | Introduktion | Øves | Kontrolleres | Hjælpemidler |
| --- | --- | --- | --- | --- |
| U1 · Anvende forskellige fortolkninger af stamfunktionsbegrebet | 1 | 1–3: algebra, graf og akkumuleret ændring | 1: begreb; 2: graf; 3: fortolkning | Begge |
| U2 · Anvende matematiske værktøjsprogrammer til symbolbehandling og problemløsning | 1 | 1–7: opsætning, CAS-resultat og kontrol | 1: CAS-kontrol; 7: dokumenteret løsning | Med |
| U3 · Operere med og redegøre for matematiske ræsonnementer og beviser | 1 | 1: kontrol og konstant; 3: hovedsætning; 4: regneregler; 6: kæderegel | 1: begrundelse; 3/6: bevis; 7: opsamling | Begge |
| U4 · Demonstrere viden om matematikanvendelse inden for udvalgte områder | 1 | 1: hastighed; 3/4: energi og vandstand; 5: geometri; 6/7: transport | 1: model; 5/7: tekstbaserede opgaver | Begge |
| U5 · Demonstrere viden om fagets metoder og identitet | 1 | 1–7: metodevalg, antagelser, domæne og kontrol | 1: metodeforklaring; 7: sammenlign metoder | Begge |
| U6 · Anvende begreber og metoder fra diskret matematik inden for udvalgte områder | 4 | 4: endelige rektangel- og trapezsummer fra tabeldata | 4: numerisk overslag; 7: vurder nøjagtighed | Begge |
| U7 · Beherske mindstekrav: grundlæggende matematiske færdigheder og kompetencer | 1 | Alle modulers forudsætningstjek og korte færdighedsopgaver | Sluttjek i hvert modul og blandet opsamling i 7 | Uden først |
| K1 · Bestemme ubestemte integraler og samtlige stamfunktioner | 1 | 1: grundregler; 6: substitution | 1: træning og sluttjek; 6: kontrol | Begge |
| K2 · Beregne og fortolke bestemte integraler | 3 | 3–5 og 7: grænser, ændring og enheder | 3: sluttjek; 7: blandede opgaver | Begge |
| K3 · Integrere ved substitution | 6 | 6: ubestemte; 7: bestemte | 6/7: variabel, differential og grænser | Begge |
| K4 · Beregne rumfang af omdrejningslegemer | 5 | 5: skiver og skiver med hul; 7: kombinerede opgaver | 5: model og enheder; 7: opsamling | Begge |
| K5 · Udføre numerisk integration | 4 | 4: trapezsummer; 5/7: CAS og sammenligning | 4: tabelopgave; 7: nøjagtighed | Begge |
| K6 · Løse opgaver uden hjælpemidler | 1 | 1–7: særskilt håndregningsspor | Hvert moduls sluttjek | Uden |
| K7 · Bruge CAS relevant og kontrollere resultatet | 1 | 1–7: giv forskrift, variabel, domæne og kontrol | 1: produkt og logaritme; 7: dokumentation | Med |
| A1 · Forbinde differentiation og integration | 1 | 1: kontrol; 2: hældning; 3: hovedsætning; 6: kæderegel | 1: afledt forskrift; 3/6: ræsonnement | Begge |
| A2 · Beregne areal ved skæringer og intervalopdeling | 3 | 3/4: fortegn, to grafer, delte områder; 7: sammensat problem | 4: sluttest; 7: opsamling | Begge |
| A3 · Beregne kurvelængde med enheder og modelantagelser | 5 | 5: bue, lamel og kabel; 7: samlet geometrisk problem | 5: opstilling og kontrol; 7: opsamling | Med; simpel opstilling uden |
| A4 · Opstille og vurdere matematiske modeller | 1 | 1: bevægelse; 3/4: energi/vandstand; 5: rumfang/længde | 1: begyndelsesværdi og enhed; 5/7: vurdering | Begge |
| B6 · Anvende potensregneregler med negative og rationale eksponenter | Repetition | Repetition og 5–7; kort støtte allerede i 1 | Repetitionens diagnostiske tjek og sluttest | Uden |
| B7 · Bestemme og fortolke omvendte funktioner | Repetition | Repetition: en-til-en, domæne, spejling, eksponential/logaritme | Repetitionens diagnostiske tjek og sluttest | Begge |

U1–U7 er alle faglige mål i undervisningsbeskrivelsens Integralregning. K1–K7 er kernestoffet. A1–A4 præciserer anvendelser i kilderne og brugerens krav. Numeriske endelige summer konkretiserer det brede mål om diskret matematik; det er appens didaktiske placering.

## Navigation og progression

Integralregning er hovedemne 06 i sidebaren og på startsiden. Oversigten `#integration` viser undervisningsgangene og læringsmålskortet i en foldbar sektion. Hver undervisningsgang har en separat side/adresse: `#integration/1`–`#integration/7`; mellemstationen har `#integration/repetition`. Kun den valgte undervisningsgang er synlig.

Modul 1 har seks trin: Mål og starttjek, Teori, Eksempler, Øvelser, Forståelsestjek og Opsummering. Starttjek (fem spørgsmål), teori (fem dele), eksempler (seks), træning (syv opgaver) og forståelsestjek (fire spørgsmål) viser én del ad gangen. En trinmenu og delmenu samt Forrige/Næste giver fri navigation. En adresse som `#integration/1/teori/konstant` kan deles eller genåbnes direkte. Browserens Tilbage/Frem følger sideskiftene. `#integration/1` starter ved det første spørgsmål; svar og hints bevares under sideskift og genindlæsning.

Eksisterende MathML, grafik, former, svar og event handlers genbruges ved at flytte deres DOM-elementer til de nye paneler. LocalStorage-format og opgaveversioner er uændrede. Repetitionslinks fra opgavebanken åbner nu den rigtige undervisningsgang i stedet for at rulle i en lang emneside. Planlagte moduler beholder deres stabile sektions-id, forudsætninger og træningsbeskrivelse. De får den samme trinopdeling, når deres undervisningsindhold implementeres.

### Stamfunktion og det ubestemte integral

20. oktober 2026; Kernestof Mat 3, side 6–9. Sektion: int-modul-1.

Stamfunktioner, integrationskonstant, grundregler og kontrol ved differentiation.

Forudsætninger: Funktionsnotation, differentiation, brøker, fortegn og potenser.

Træning: Polynomier, eksponentialfunktioner, negative potenser og rødder; logaritmer og CAS.

### Grafen for en stamfunktion

21. oktober 2026; Kernestof Mat 3, side 12–13. Sektion: int-modul-2.

Grafiske sammenhænge og valg af stamfunktion ud fra punkt eller tangent.

Forudsætninger: Grafer, koordinater, funktionsværdier, ligninger og tangenthældning.

Træning: Lodret forskydning, fortegn og monotoniforhold; punkt- og tangentbetingelser.

### Areal og det bestemte integral

21. oktober 2026; Kernestof Mat 3, side 10–11. Sektion: int-modul-3.

Fortegnet integral, geometrisk areal og ændring i en stamfunktion.

Forudsætninger: Areal, enheder, funktionsværdier, interval og fortegn.

Træning: Grænser, stamfunktionstabeller, integralregningens hovedsætning og hastighedsmodeller.

### Arealberegninger og regneregler

22. oktober 2026; Kernestof Mat 3, side 24–25 og 32–33. Sektion: int-modul-4.

Skæringer, øvre minus nedre graf, intervalopdeling og numeriske summer.

Forudsætninger: Ligninger, nulpunkter, skæringspunkter, parenteser og fortegn.

Træning: To grafer, todelte områder, parameterbestemmelse, vandstandsmodel og trapezmetoden.

### Virtuel repetition B-niveau 6–7

23. oktober 2026; virtuel repetition. Sektion: int-repetition.

Potensregneregler og omvendte funktioner. En mellemstation uden integralmodulnummer.

Forudsætninger: Parenteser, brøker, eksponenter, funktioner og ligningsløsning.

Træning: Diagnostisk tjek med mulighed for hurtig videregang; målrettet repetition af potenser, rødder, definitions- og værdimængde, reciprok versus omvendt funktion og spejling i diagonalen.

### Rumfang af omdrejningslegemer og kurvelængde

26. oktober 2026; Kernestof Mat 3, side 26–27 og 35. Sektion: int-modul-5.

Skiver, skiver med hul, radius, enheder og længde af en graf.

Forudsætninger: Repetitionens potenser og rødder; areal, længde og afledte.

Træning: Keramikskål, karaffel, bue og brokabel; både håndregning og numerisk CAS-beregning.

### Substitution i ubestemte integraler

26. oktober 2026; Kernestof Mat 3, side 14–15 og 28–29. Sektion: int-modul-6.

Kædereglen baglæns: vælg ny variabel, omskriv og substituer tilbage.

Forudsætninger: Sammensatte funktioner, kædereglen, brøker og potensregler.

Træning: Eksponential-, potens-, logaritme- og trigonometriske udtryk; kontrol og løbermodel.

### Substitution i bestemte integraler

27. oktober 2026; Kernestof Mat 3, side 14–15 og 28–29. Sektion: int-modul-7.

Nye grænser, konsekvent variabelvalg og samlet anvendelse.

Forudsætninger: Modul 3 og 6: grænser, substitution og fortegn.

Træning: Håndregning og sammensatte areal-, rumfangs-, kurvelængde- og transportopgaver; afsluttende opsamling.

## Kildegennemgang

- Pensum/Læseplan.pdf: rækkefølge, datoer, bogsider og mellemstationens placering.
- Pensum/Undervisningsbeskrivelse.pdf: alle syv faglige mål og syv kernestofpunkter under Integralregning. Kurvelængde nævnes i læseplanen og ark 5 og 7. Bogens beviser er ikke pensum; bevisstof kommer fra fotokopier.
- Ark 1: polynomier, eksponentialfunktioner, reciprok, negative potenser, kontrol, CAS-produkt og CAS-logaritme. Eksempel 4 er reciprok plus den lineære variabel; rodeksemplet i appen er en særskilt støttetilføjelse. Eksempel 5 er en kontrolopgave med en forkert kandidat: tredje potens med koefficient fire giver afledt koefficient tolv, mens den givne funktion har otte. Det er bevaret som en afvisningsopgave.
- Ark 2: begyndelses-/punktbetingelser, tangenter, lodret forskydning og grafisk stamfunktion; ikke kun monotoni.
- Ark 3: bestemte integraler, stamfunktionstabeller, arealdeling, fart, energi og temperaturændring.
- Ark 4: to grafer, todelte områder, parametre og vandstandsmodel. Numerisk integration tilføjes her fra undervisningsbeskrivelsens kernestof.
- Ark 5: omdrejning om førsteaksen, geometri med indre/ydre radius, skål/karaffel og kurvelængde for bue, lamel og kabel.
- Ark 6: substitution i eksponential-, potens-, logaritme- og trigonometriske udtryk; sammensatte areal- og løberopgaver.
- Ark 7: bestemte substitutionsintegraler og blandede opgaver om areal, tangent, rumfang, kurvelængde og bilens bevægelse.

Word-kildernes formler er læst fra OMML, inklusive brøker, potenser og rødder; tabellerne i ark 3 og 4 indgår i planlægningen. Lokale kildedokumenter og udtræk offentliggøres ikke som del af appen. Notationen i ark 1 u7 har en afvigelse mellem potensens base i dokumentets struktur og facit. Den opgave er derfor ikke kopieret til den kvalitetssikrede bank.

## Modul 1 og kvalitet

Modulet har fem diagnostiske spørgsmål, grundkort, fire mikroøvelser, teori i små bidder, gennemregnede eksempler, integrationskonstantens graf, en kort begrundelse for stamfunktionsfamilien, syv bankopgaver med hints/fejlfeedback/løsninger og fire afsluttende spørgsmål samt egen vurdering af forklaringen.

De syv bankopgaver knytter konkrete mål til kontrol, familie, grundregler, model og CAS. Modellen er en egen tilpasning af materialets hastighedsfortolkning; fuld behandling af punktbetingelser kommer i modul 2. Negative potenser og rødder får tidlig støtte; den samlede B-repetition kommer efter modul 4.

Svar, kontroller og viste hints i undervisningen gemmes lokalt under christian-matematik.integration.v1. Forkerte svar giver konkret hjælp. Ændres et svar, bortfalder det tidligere kontrolresultat. Prøvebanken bruger sit eksisterende lagringsformat. Gennemførte moduler registreres fortsat manuelt i Opgaver.

Tal/polynomier kontrolleres med bankens sikre parser. Eksponential-, logaritme- og negative potenssvar bruger typesatte valg i dette modul. Fritekst kræver egen vurdering; uunderstøttede udtryk erklæres uafklarede.

## Verifikation

Kør npm test og npm run test:browser i webapp. Browserkontrollen omfatter hele modul 1, eksisterende appforløb, hints, målrettet fejlfeedback, genforsøg, MathML namespace og eksponentstruktur, lokal lagring, blokerede/ugyldige data, tastatur, graf, mobilvisning, prøvebank og konsol. Der kontrolleres også uafhængigt, at polynomiers afledte og modellens begyndelsesværdi passer.
