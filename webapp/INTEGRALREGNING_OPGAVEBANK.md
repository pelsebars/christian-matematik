# Integralregning – revision af den fælles opgavebank

Revisionen omfatter alle syv undervisningssider, deres starttjek, teori, eksempler, øvelser og sluttjek samt de syv lokale kildeark i `Pensum/3. Integralregning/`. Læseplanen, undervisningsbeskrivelsen og forløbets læringsmål bruges til afgrænsning. Kilderne er lokale undervisningsmaterialer og publiceres ikke med appen.

## Resultat og integration

| Modul | Fokus | Før | Nu |
| --- | --- | ---: | ---: |
| 1 | Stamfunktion og ubestemt integral | 7 | 13 |
| 2 | Graf, punkt og tangent | 7 | 13 |
| 3 | Areal og bestemt integral | 7 | 14 |
| 4 | Arealberegninger og regneregler | 7 | 14 |
| 5 | Rumfang og kurvelængde | 7 | 16 |
| 6 | Substitution i ubestemte integraler | 7 | 10 |
| 7 | Bestemte integraler og opsamling | 7 | 11 |
| **I alt** | | **49** | **91** |

42 nye opgavetyper supplerer de 49 bevarede id’er. 46 af de 91 er seedede familier; resten er faste, gennemgåede opgaver. B-repetitionens syv selvstændige opgaver er bevaret. Den fælles bank har 200 opgaver på tværs af alle emner.

`tasks/bank/index.js` er fortsat integrationspunkt. `integration-complete.js` samler bankversioner af undervisningens syv oprindelige opgavepakker og tilføjelserne i `integration-sources.js`. Der er ingen ny produktionsafhængighed eller ændring af svarparseren. De nye katalogmål `int.perimeter` og `int.sub-area` gør omkreds og parameterarealer søgbare i den relevante sammenhæng.

## Dækning af undervisning og kildeark

Tabellen angiver opgavefamilier frem for én kopi pr. talvariant. U betyder opgaver uden hjælpemidler. Samme matematiske kompetence kan være dækket af en familie med andre, kontrollerede tal. En kildeopgave med flere delspørgsmål kan være fordelt på flere bankopgaver.

| Kilde og kompetence | Dækning i banken |
| --- | --- |
| Ark 1: definition, integrationskonstant, grundregler og ledvis integration | `int.check`, `int.sum`, `int.polynomial` og `int1.constant-family`; skel mellem en stamfunktion, alle stamfunktioner og kontrol ved differentiation |
| Ark 1: eksponentialled, blandede led, reciprokke potenser, rødder og koefficienter | `int.exponential`, `int.negative`, `int1.mixed-exponential`, `int1.reciprocal-sum`, `int1.root`, `int1.scaled-negative` |
| Ark 1: modeller og CAS-eksempler, herunder produkter og logaritme | `int.motion`, `int.cas`, `int1.logarithm`; familie, domæne og differentieringskontrol |
| Ark 2: grafiske sammenhænge, fortegn, stationære steder og lodret forskydning | `int2.sign`, `int2.condition`, `int2.shift`, `int2.flat-contact`; også vandret tangent uden ekstremum |
| Ark 2: polynomier, punktbetingelser og tangentbetingelser | `int2.point`, `int2.tangent`, `int2.two-tangencies`, `int2.derivative-and-primitive`, `int2.tangent-restriction` |
| Ark 2: eksponential- og logaritmebetingelser samt bevægelsesmodel | `int2.cas-point`, `int2.cart`, `int2.exponential-point`, `int2.logarithmic-point` |
| Ark 3: hovedsætning, stamfunktionstabel, grænser, positive og negative områder | `int3.basic`, `int3.table`, `int3.polynomial`, `int3.signed`, `int3.exponential`, `int3.negative-interval` |
| Ark 3: kubisk område, rodkurve med skrå afgrænsning og parameter i delingsgrænsen | `int3.bounded-cubic`, `int3.root-region`, `int3.parameter-boundary` |
| Ark 3: energi, ovn, tidsdeling og modelkritik | `int3.energy`, `int3.partition`, `int3.oven`, `int3.split-time`, `int3.sprinter-critique`; akkumulation, begyndelsesværdi og fysisk fortolkning |
| Ark 4: to grafer, flere skæringer og fortegnsdeling | `int4.between`, `int4.split`, `int4.cross-curves`; skæringer som uordnet sæt med delpoint |
| Ark 4: tabeller, linearitet, opdeling og omvendte grænser | `int4.table`, `int4.rules`, `int4.interval-rules`; `int4.product-claim` afviser en falsk produktregel med et modeksempel |
| Ark 4: måledata og vandstandsmodel | `int4.trapezoid`, `int4.water`; ens tidsafstande i generatoren, stykkevis lineær model og skel mellem præcis modelberegning og tilnærmet virkelighed |
| Ark 4: parameter, amplitudeskalering og tangent, der halverer et areal | `int4.parameter`, `int4.amplitude`, `int4.tangent-partition` |
| Ark 4: tre randkurver, berøring og arealdeling | `int4.three-boundaries`, `int4.touching-curves`; skift af nedre rand og forskel på berøring og fortegnsskift |
| Ark 5: skiver, hulrum, kabel og beholder | `int5.root`, `int5.washer`, `int5.cable`, `int5.bowl` |
| Ark 5: reciprok rod, logaritmisk radius og sammensat rod-/linjeprofil | `int5.reciprocal-radius`, `int5.log-radius`, `int5.joined-profile` |
| Ark 5: eksponentialprofiler, parabelprofil og fortegnsskift | `int5.exponential-cap`, `int5.exponential-body`, `int5.quadratic-body`, `int5.signed-body`; korrekt radiuskvadrat og randvalg |
| Ark 5: ret linje, rodkurve, sammensat omkreds og buemodel | `int5.line`, `int5.lamp`, `int5.carafe`, `int5.perimeter`, `int5.arch` |
| Ark 6: polynomiel indre funktion, eksponentialfunktion og trigonometriske potenser | `int6.linear`, `int6.power`, `int6.exponential`, `int6.trig`; både sinus og cosinus med korrekt fortegn |
| Ark 6: brøker af formen indre afledt / indre funktion, U5–U6 | `int6.log`; fælles logaritmefamilie med absolutværdi og særskilte definitionsintervaller |
| Ark 6: punktbetingelse og bevægelsesmodel | `int6.point`, `int6.runner` |
| Ark 6: logaritmeprodukt, variabel faktor og øvrige blandede opgaver | `int6.log-product`, `int6.missing-factor`, `int6.width-parameter`; tangentbetingelsen fra arket ligger i `int2.tangent-restriction`, hvor den fagligt hører til |
| Ark 7: potens, eksponentialfunktion og trigonometriske udtryk med nye grænser | `int7.power`, `int7.exponential`, `int7.trig`, `int7.cosine-linear`; forskellige indre funktioner og orientering |
| Ark 7: parameter, geometri, numerisk kontrol og transportmodel | `int7.parameter`, `int7.geometry`, `int7.log`, `int7.transport` |
| Ark 7: tangentens arealdeling, rodprofil og domænekontrol | `int7.tangent-areas`, `int7.root-body`, `int7.domain-check` |

Starttjek og gentagne mikroøvelser er dækket af disse familier eller af bankens eksisterende grundopgaver i ligninger, funktioner og differentiation. De kopieres ikke som nye integralopgaver. Eksempelvis genbruges fortegnsargumenter og tangentkontrol på tværs af arkene, mens en ny kombination af betingelser får en selvstændig opgave.

## Faglige tilpasninger af kilder

- Word-formler kan have tvetydig gruppering af fortegn, koefficient og eksponent. Ark 1 U7 omskrives til en eksplicit parentes om hele den skalerede negative grundtalspotens. Facit er kontrolleret ved differentiation af netop den viste formel. Ark 2’s eksponentialopgave og ark 6’s eksempler med koefficienter i potenser repræsenteres tilsvarende med entydig gruppering; usikre eksponentgrænser kopieres ikke ukritisk.
- Logaritmefamilien i ark 6 bruger absolutværdi. Nulpunkterne i nævneren udelukkes, og integrationskonstanten er uafhængig på hvert sammenhængende interval. En kildeangivelse uden absolutværdi gælder ikke automatisk på alle intervaller.
- Sprintermodellen fra ark 3 giver værdien −1,88 ved nul. Banken beholder dette som en eksplicit modelkritik; negativ fart præsenteres ikke som en fysisk gyldig fart. Fortegnet hastighed og tilbagelagt strækning skal skelnes.
- Figurbaserede spørgsmål får egne, fuldt specificerede funktioner og afgrænsninger. En farve eller en ukendt indlejret figur er ikke tilstrækkelig opgaveinformation. Området mellem rodkurven og den skrå rand i ark 3 er opdelt ved nul; den sidste del afgrænses af aksen, så arealet er 101/6. Ark 4’s område med tre kurver har den største af de to nedre funktioner som rand og areal 224/3.
- I berøringsopgaven skelnes eksplicit mellem området fra aksen til sidste skæring og det lukkede område mellem skæringerne. En gentagen rod giver ikke automatisk et skift af øvre graf. Kun det sidstnævnte område halveres i delspørgsmålet om deling.
- Kabel- og beholdermodellernes nødvendige geometriske antagelser står i opgaven, herunder kabelminimum og massiv bund. Længde, areal, rumfang og diameter holdes adskilt.
- Sammensatte rotationsprofiler deles ved en gyldig skæring. Falske rødder fra kvadrering afvises i den oprindelige ligning. Hele radiusudtrykket kvadreres, inklusive dobbeltprodukt.
- Modelintegraler og arealdeling, der i kilden kræver CAS eller ekstra integrationsregler, bruger egne præcise data eller enklere kontrollerede varianter af samme læringsmål. Den tidsdelingsfamilie, der er tilføjet, varierer en lineær rate; den er ikke en kopi af kildens kubiske rate.
- Korrekt almindeligt bestemt integral kræver kontrol af hele intervallet. Et symmetrisk udtryk hen over en pol godkendes ikke som nul. Præcise værdier bruges før afrunding i modeller.

## Opgavetekst, bedømmelse og lagring

Prøvespørgsmålene indeholder data og det ønskede resultat, uden metodeoverskrifter eller valg af substitution på forhånd. Læringsmål, hjælp i mindst to niveauer og metoder findes i træningens hjælp og løsninger; de er skjult indtil aflevering i prøvetilstand.

Hver opgave har mål, forudsætninger, sværhedsgrad, størrelse, tid, hjælpemiddelmarkering, point, delspørgsmål, hints, gennemregnet løsning og feedback pr. delspørgsmål. Delpoint bruges, hvor svarformatet giver en fagligt meningsfuld opdeling. Skriftlige argumenter kræver egen vurdering med konkret tjekliste. Automatisk korrekthed hævdes ikke for fri argumentation.

Polynomier og tal bruger den eksisterende sikre parser. Eksponential-, logaritme-, rod- og trigonometriske funktionsfamilier bruger MathML-valg med faglige distraktorer. Numeriske modelresultater har angivet afrunding og tolerance. Ingen produktionskode bruger `eval` eller udvider den symbolske parser.

De oprindelige 49 undervisningsopgaver er uændrede som faste version 1-opgaver. Ændrede bankopgaver får version 2. `instantiate(id, seed, version)` genoptager kendte gamle integralversioner med deres oprindelige facit. Lagring og UI respekterer sessionens version. Svar, hints, historik, markeringer og selvregistrerede gennemførte moduler bevares. Ukendte versioner afvises fortsat. Dette er afgrænset støtte til de eksisterende integralopgaver, ikke en generel migrationsmekanisme for alle emner.

## Kontrol

`npm --prefix webapp test` omfatter `tests/integration-bank.test.js`:

- Alle 91 id’er, dækning af katalogets modulmål, unikke spørgsmål, neutral tekst, metadata, MathML, point, feedback og forudsætninger.
- 1.000 seeds for hver af de 46 familier: identiske seeds giver identiske opgaver, tal og facit. Alle familier giver flere forskellige tekster.
- Uafhængige beregninger af facit, herunder afledte, punkt- og tangentbetingelser, arealer, parameterbetingelser, rumfang og længder. Den separate MathML-testfortolker læser de faktisk viste valgmuligheder, differentierer numerisk og afviser utilsigtet gyldige distraktorer. Den er kun testkode og ændrer ikke appens bedømmelse.
- Delpoint for uordnede skæringer, målrettet feedback, filtrering, versionsforhøjelse og genoptagelse af oprindelige opgaver med gamle besvarelser.

`npm --prefix webapp run test:browser` omfatter både de otte eksisterende integral-/repetitionsforløb og `tests/integration-bank.browser.test.js`. Den nye test gennemgår samtlige 91 opgaver med korrekte svar, automatisk bedømmelse eller tjekliste, hints, genindlæsning, MathML og mobilbredde. Den opretter også et rigtigt prøvesæt gennem formularen og kontrollerer tidsbudget, skjulte hjælpemidler og genoptagelse af et allerede besvaret version 1-sæt. Appens øvrige bank- og geometriforløb indgår i regressionen.
