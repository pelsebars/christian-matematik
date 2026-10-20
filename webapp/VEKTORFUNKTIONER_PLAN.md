# Vektorfunktioner · samlet plan og første levering

Status 20. oktober 2026: **kun Modul 1 er implementeret**. Modul 2, B-repetition 12–13, Modul 3 og opsamlingen er planlagte. Opsamlingen er ikke en ekstra undervisningsgang. Fortsættelse kræver brugerens næste besked om den konkrete undervisningsgang.

## Kilder og kildekontrol

Før implementeringen er følgende læst:

- OVERBLIK.md: Christians usikre forudsætninger, rolig voksen tone, diagnose, graduerede hints, metodevalg og selvstændig kontrol.
- Pensum/Læseplan.pdf, alle sider; rækkefølge og datoer fra side 3.
- Pensum/Undervisningsbeskrivelse.pdf, alle sider; emnets fem faglige mål og fire kernestofpunkter fra side 7. Vektorfunktioner er titel 6 dér, men hovedemne 09 i appen.
- Alle tre Word-ark under Pensum/7. Vektorfunktioner, inklusive Office Math og ark 1's indlejrede kurvefigurer. Originalerne er kun læst.
- Integralforløbets ruter, indholdsopdeling, øvelsesrenderer og kontoadapter; differentialligningernes plan og Modul 1; normalfordelingens moduler, selvstændige repetition, læringsmålskort og testmønstre. Opgavebankens kontrakt, udvælgelse, bedømmelse og versionsgenoptagelse er gennemgået.

Office Math er undersøgt i ZIP-arkivernes word/document.xml med namespace-bevidst XML-læsning. Ark 1 har 132 oMath-elementer, ark 2 har 106, ark 3 har 105. Koordinatsøjlerne ligger især i m:d/m:e/m:eqArr med én m:e pr. koordinat. Brøker, eksponenter, afgrænsninger, vektorpile, tværvektor og integralgrænser blev læst strukturelt. Flad tekst uden koordinatgrænser er ikke brugt til at rekonstruere forskrifter. Lokale udtræk under tmp/vector-sources er ignorerede arbejdsfiler og publiceres ikke.

Kontrollerede forskrifter og deres anvendelse i Modul 1 (afsnitsnumre er nulbaserede w:p i dokumentets body, også inde i tabeller):

| Ark 1 / afsnit | Kontrolleret Office Math | Anvendelse |
| --- | --- | --- |
| Eksempel 2, P17 | Første koordinat −2 + 5 cos(3t); anden 3 + 5 sin(3t) | Gennemregnet cirkel, radius og omløb |
| Eksempel 3, P24 | Første t + 2; anden t² + 4t + 3 | Eliminering til y = x² − 1, også med begrænset interval |
| Med hjælpemidler, eksempel 3, P72 | Første t² − 2t + 2; anden t³ − 4t + 1 | Dobbeltpunkt (2; 1) ved 0 og 2 |
| u2/u3, P89/P95 | Første t² + 4t; anden t + 1 | Andenakse og punktkontrol |
| u4, P101 | Første 4 + 3 cos(2t); anden 3 + 3 sin(2t) | Cirkelligning, radius 3 og parameterperiode π |
| u5, P107 | Første t² + 4; anden t² + 4t | Førsteakse: (4; 0) og (20; 0) |
| u6, P112 | Første t² − 5t + a; anden t + 1 | Parameterkonstant a = 4 |
| Med hjælpemidler, opgave 2, P127 | Første t² − t; anden t³ − 3t + 1 | Dobbeltpunkt (2; 3), parametre −1 og 2, figur og CAS-kontrol |
| Opgave 4, P154 | Første 14,8t; anden −4,9t² + 3,3t + 1,1 | Tennis: 0,9180091987 s og 13,5865361410 m, afrundet 0,92 s og 13,59 m |
| Opgave 6, P178 | Første kt; anden 12t − 3t², 0 < k < 10 | Landing 4 s; 30 meter giver k = 7,5 m/s |

Kildearket indeholder også opgaver, der kræver senere stof. Pindsvinets største afstand (opgave 9c) placeres i repetitionens optimeringsspor. Maksimal højde placeres i Modul 2 med efterfølgende genopbygning i repetitionen. De tre undervisningsark skal ikke ukritisk afgrænse målene eller deres didaktiske placering. Egne indledende eksempler og rute/kollisionsmodeller er matematisk kontrollerede og skelnes fra kildearkets tal.

### Verificeret arealformel til Modul 3

Ark 3, eksempel 1, P27 indeholder strukturen **en halv gange absolutværdien af integralet fra a til b af den afledte stedvektor skalarprikket med stedvektorens tværvektor**. XML har m:f med 1 og 2, m:d med lodrette streger rundt om integralet, m:nary med nedre grænse a og øvre grænse b, afledt m:sSup og en ydre m:acc omkring den vektor-markerede r. Formlen er dermed tværvektorformlen, ikke blot integral af højden.

Den skal i Modul 3 vises som korrekt MathML: A = ½ · |∫ₐᵇ r⃗′(t) · r⃗̂(t) dt|. Med tværvektoren (−y; x) bliver det ækvivalent med ½ · |∫ₐᵇ (x(t)y′(t) − y(t)x′(t)) dt|. Introducér tværvektorens orientering udtrykkeligt. Ved en simpel lukket kurve, gennemløbet én gang mod uret, er det orienterede udtryk positivt; modsat omløb ændrer fortegnet. Flere løkker skal afgrænses og behandles særskilt, så modsat orienterede bidrag ikke fejlagtigt udligner geometriske arealer. En åben kurve kræver også beskrivelse af lukningen.

Ark 3, P18 angiver kurvelængden som integral af længden af den afledte vektor; P38/P55 viser koordinatformen med kvadratroden af summen af koordinatafledtes kvadrater. Skeln mellem rutelængde med gentagne gennemløb og længden af den geometriske punktmængde. Hele tidsintervallet kan tælle samme delstrækning flere gange.

Dette er planlægning og kildekontrol. Modul 3 har endnu ingen undervisning, øvelser eller fremdrift i appen.

## Rækkefølge og omfang

| Afsnit | Læseplan | Bogside | Status |
| --- | --- | --- | --- |
| Modul 1 · Banekurver og skæringspunkter | 11. november 2026 | 84–87 | Implementeret |
| Modul 2 · Hastighed, acceleration og tangenter | 12. november 2026 | 88–91 | Planlagt |
| B-repetition 12–13 · Monotoniforhold og optimering | 13. november 2026 | – | Planlagt |
| Modul 3 · Areal og kurvelængde | 16. november 2026 | 88–91 | Planlagt |
| Opsamling · Opsamling | Efter Modul 3 | – | Planlagt |

Repetitionens to spor får egne starttjek og egne kontroller. Bestået starttjek skal give adgang til en hurtigere vej til selvstændige opgaver og sluttjek. Et forkert starttjek skal tilbyde rolig genopbygning; en sidevisning må aldrig give gennemførelse. Monotonisporet: afledtes fortegn, voksende/aftagende, stationære punkter, lokale/globale ekstrema og definitionsinterval. Optimeringssporet: oversæt tekst, opstil målfunktion og interval, find kandidater og randpunkter, sammenlign, kontrollér og fortolk. Broer: maksimal højde som andenkoordinat; største afstand via afstandens kvadrat, når det bevarer maksimum.

## Læringsmålmatrix

Samme 32 rækker bruges i appens udfoldelige målskort via vector-plan.js. Senere introduktioner, øvelser og kontroller er eksplicit planlagte.

| Mål | Introduceres | Øves | Kontrolleres | Hjælpemidler og kilde |
| --- | --- | --- | --- | --- |
| U1 · Problemløsning med vektorfunktioner | M1 · position og baner | M1 · punkt, akser, model; M2–M3 (planlagt) | M1 · selvstændige opgaver og sluttjek; M2–M3 (planlagt) | Begge · undervisningsbeskrivelse s. 7 |
| U2 · Værktøjsprogrammer til symbolbehandling og problemløsning | M1 · CAS og kontrol | M1 · tennis og dobbeltpunkt; M2–M3 (planlagt) | M1 · numerisk model og dokumentationsvalg | CAS · ark 1, opg. 2 og 4 |
| U3 · Matematikanvendelse inden for udvalgte områder | M1 · sport og køretøjer | M1 · fodbold og ruter; M2–M3 (planlagt) | M1 · modelinterval og enheder | Begge · ark 1, opg. 4 og 6 |
| U4 · Fagets metoder og identitet | M1 · parameter, geometri og kontrol | M1 · nødvendigt/tilstrækkeligt, modelgrænser | M1 · punktkontrol, kollision og CAS-kritik | Begge · undervisningsbeskrivelse s. 7 |
| U5 · Grundlæggende færdigheder i kernestoffet | M1 · diagnostik og grundhjælp | M1 · koordinater, indsættelse og ligninger | M1 · små kontroller og sluttjek; M2–M3 (planlagt) | Uden · undervisningsbeskrivelse s. 7 |
| K1 · Banekurve og dobbeltpunkter | M1 · parameter og dobbeltpunkt | M1 · kurvelaboratorium og opgaver | M1 · alle parameterværdier og samme punkt | Begge · ark 1 |
| K2 · Tangent, hastighed, fart og acceleration | M2 · koordinatvis differentiation (planlagt) | M2 · bevægelse og tangent (planlagt) | M2 · selvstændige opgaver/sluttjek (planlagt) | Begge · ark 2 |
| K3 · Opgaver uden hjælpemidler | M1 · punkt, akser, cirkel | M1 · håndregning; M2–M3 (planlagt) | M1 · selvstændig del og sluttjek | Uden · alle tre ark |
| K4 · Relevant, dokumenteret CAS | M1 · model, ligning, interval, output, kontrol | M1 · egne værktøjsnoter; M2–M3 (planlagt) | M1 · kontrollerede resultater; egne noter selvvurderes | CAS · alle tre ark |
| A1 · Vektorfunktion og koordinatfunktioner | M1 · parameter og position | M1 · indsættelse i begge koordinater | M1 · position og sluttjek | Uden · ark 1 |
| A2 · Parameter, punkt og banekurve | M1 · tre forskellige objekter | M1 · tabel og interaktiv figur | M1 · begrebskontrol og sluttjek | Uden · ark 1, eksempel 1 |
| A3 · Position ved bestemt parameter | M1 · gennemregnet eksempel | M1 · guidet position og model | M1 · selvstændig position | Uden · ark 1, kuglestød |
| A4 · Punkt på kurve: samme parameter i begge koordinater | M1 · punktkontrol | M1 · både gyldigt punkt og falsk kandidat | M1 · selvstændigt punkt og sluttjek | Uden · ark 1, u3 |
| A5 · Skæringer med begge akser | M1 · nul i den rigtige koordinat | M1 · alle rødder og intervalkontrol | M1 · to akseopgaver og sluttjek | Uden · ark 1, u2 og u5 |
| A6 · Baneskæring kontra samtidig kollision | M1 · to parametre, fælles tid | M1 · ruter og ændret starttid | M1 · selvstændig kollision og begrundelse | Begge · ark 1, bue/pil; ark 2, fly (senere) |
| A7 · Dobbeltpunkt og forskellige parametre | M1 · løkke og fuld indsættelseskontrol | M1 · begge parameterværdier og koordinater | M1 · dobbeltpunkt og sluttjek | Begge · ark 1, opg. 2 |
| A8 · Eliminering med domæne | M1 · parabel | M1 · interval og valg af gren | M1 · selvstændig elimination og interval | Uden · ark 1, eksempel 3 |
| A9 · Cirkler, radianer og gennemløb | M1 · centrum, radius og vinkel | M1 · cirkelforskrift og laboratoriet | M1 · centrum, radius og periode | Uden · ark 1, eksempel 2/4 og u4 |
| A10 · Bevægelsesmodeller, definitionsinterval og enheder | M1 · tennis og fodbold | M1 · landing; M2–M3 (planlagt) | M1 · fysisk rod, enheder og modelbegrænsning | Begge · ark 1, opg. 4/6 |
| A11 · Komponentvis differentiation og hastighedsvektor | M2 · teori (planlagt) | M2 · polynomier og trigonometriske baner (planlagt) | M2 · håndregning og CAS (planlagt) | Begge · ark 2 |
| A12 · Fart som skalar og acceleration | M2 · vektorlængde og anden afledt (planlagt) | M2 · fart, acceleration og enheder (planlagt) | M2 · model og sluttjek (planlagt) | Begge · ark 2 |
| A13 · Tangentretning og tangentligning | M2 · punkt og retningsvektor (planlagt) | M2 · vandret/lodret tangent; nulvektor kræver særskilt analyse (planlagt) | M2 · tangent og sluttjek (planlagt) | Begge · ark 2 |
| A14 · Vinkler og hastigheder i dobbeltpunkt | M2 · skalarprodukt (planlagt) | M2 · to parametre, to retninger (planlagt) | M2 · vinkel og kontrol (planlagt) | Begge · ark 2 |
| A15 · Maksimal højde og bevægelsesfortolkning | M2 · højde som koordinatfunktion (planlagt) | M2 og Rep. · stationære punkter og randpunkter (planlagt) | M2 og Rep. · maksimum med fysisk interval (planlagt) | CAS · ark 2, basketball |
| B12 · Afledtes fortegn og monotoniforhold | Rep. · eget starttjek (planlagt) | Rep. · fortegnstabel, voksende/aftagende (planlagt) | Rep. · selvstændig kontrol (planlagt) | Begge · læseplan s. 3 |
| B12a · Stationære punkter og lokale/globale ekstrema | Rep. · monotonispor (planlagt) | Rep. · fortegnsskift og definitionsinterval (planlagt) | Rep. · klassifikation og randpunkter (planlagt) | Begge · læseplan s. 3 |
| B13 · Tekst til optimeringsfunktion og interval | Rep. · eget starttjek (planlagt) | Rep. · største afstand, brug evt. kvadreret afstand (planlagt) | Rep. · selvstændig model (planlagt) | Begge · ark 1, pindsvin opg. 9c som bro |
| B13a · Kontrol, randpunkter og fortolkning | Rep. · optimeringsspor (planlagt) | Rep. · kandidatværdier og fysisk betydning (planlagt) | Rep. · globalt resultat med enhed (planlagt) | Begge · læseplan s. 3 |
| A16 · Kurvelængde som integral af farten | M3 · integralstarttjek og teori (planlagt) | M3 · bil, projektil og rute (planlagt) | M3 · længde, interval og enheder (planlagt) | CAS · ark 3 |
| A17 · Areal, tværvektor og koordinatform | M3 · kildeformel (planlagt) | M3 · orienteret integral og geometrisk areal (planlagt) | M3 · fortegn, orientering og positivt areal (planlagt) | CAS · ark 3, eksempel 1 |
| A18 · Dobbeltpunkter og korrekt områdeafgrænsning | M3 · lukkede delkurver (planlagt) | M3 · opdeling af områder og omløb (planlagt) | M3 · dobbeltpunkt, grænser og areal (planlagt) | CAS · ark 3, opg. 3 |
| A19 · CAS-integraler, numerik og grafisk kontrol | M3 · dokumentation (planlagt) | M3 · præcist integral og afrunding (planlagt) | M3 · reproducerbar løsning og rimelighed (planlagt) | CAS · ark 3 |

## Rutestruktur

- #vectorFunctions: oversigt og udfoldeligt målskort.
- #vectorFunctions/1/start
- #vectorFunctions/1/parameter
- #vectorFunctions/1/punkter
- #vectorFunctions/1/baner
- #vectorFunctions/1/dobbeltpunkt
- #vectorFunctions/1/former
- #vectorFunctions/1/modeller
- #vectorFunctions/1/oevelser
- #vectorFunctions/1/eksamen
- #vectorFunctions/1/sluttjek
- #vectorFunctions/1/opsummering
- #vectorFunctions/2/start: planlagt Modul 2.
- #vectorFunctions/repetition/start: planlagt selvstændig B-repetition 12–13.
- #vectorFunctions/3/start: planlagt Modul 3.
- #vectorFunctions/opsamling: planlagt opsamling uden undervisningsgangsnummer.

Gamle emners ruter bevares. #vectorFunctions/1 og ukendte trin i Modul 1 normaliseres til start. Planlagte moduler har ingen svarfelter og ingen gennemførelsesmarkering. Hashnavigation følger browserens historik; trinlinks og direkte genindlæsning virker. Sideoverskriften får fokus ved navigation. Venstremenuens fælles accordion viser M1, M2, Rep., M3 og Opsamling.

## Modul 1 · implementering

- 11 separate trin, fra mål/starttjek til fast arbejdsmetode.
- 37 øvelseskort: 7 diagnostiske spørgsmål, 8 små guidede kontroller, 16 bankopgaver og 6 sluttjek.
- 30 obligatoriske kort: alle små kontroller, bankopgaver og sluttjek. Starttjek bruges diagnostisk og kræves ikke for modulstatus.
- Grundhjælp pr. konkret forudsætning: koordinater, fri vektor/stedvektor, funktion, ligning, fortegn/potens, parameter og enhedscirkel. Forkert diagnostik åbner den rigtige forklaring og relevante eksisterende emne.
- Kurvelaboratorium med parabel, dobbeltpunkt og cirkel; én parameter, korrekt beregnet position, retning for stigende parameter, lige store akseenheder og koordinattabel. Tastaturstyret skyder og almindeligt valgfelt.
- Håndregning og CAS, selvstændige opgaver uden synligt metodehint og to sammenhængende eksamenslignende opgaver. Tre graduerede hints pr. opgave, gennemregnet løsning og særskilt feedback pr. delspørgsmål; fejl i koordinatkontrol, fortegn, aksevalg, rodvalg, radius, interval, samtidighed og CAS-dokumentation skelnes.
- Noter til egne mellemregninger og CAS. Faktisk ekstern CAS-udførelse og frie forklaringer selvvurderes, og tæller ikke som automatisk korrekt.
- Alle formler i appens indhold, valgmuligheder, hints og løsninger er MathML. Tal kan skrives med dansk decimalkomma; ingen LaTeX-indtastning kræves.

## Bank, versioner og personlige data

Nyt hovedemne vectorFunctions og bankmodul vf.1. Ny pakke tasks/bank/vector.js med 16 faste, verificerede version 1-opgaver. De kan indgå i træning og prøvesæt med bankens eksisterende udvælgelse og sessionsformat. Neutrale opgavetekster; metoder ligger i hints og løsninger. Særskilte kontrollerede delspørgsmål giver delpoint. Prøvetilstand skjuler hints og løsninger til aflevering. Gentag-modul linker til #vectorFunctions/1/start.

Eksisterende 281 bankopgaver og deres id'er/versioner er bevaret; samlet bank er 297. Ingen eksisterende bankpakker, svarformater eller databasetabeller ændres. Nye namespaces:

- christian-matematik.vector.introduction.v1: fælles øvelsesformat version 1, med svar, checked og hints pr. id.
- christian-matematik.vector.notes.v1: egne noter.

Den eksisterende accountStorage, revisionskontrol, synkroniseringskø og markCorrect/lessonCompletion genbruges. Første korrekt kontrollerede løsning registreres med vectorFunctions, Modul 1 og konkret rute. Den permanente historik beholdes, mens den **aktive** modulstatus kun beregnes fra aktuelt kontrollerede svar. Enhver svarredigering fjerner checked, så aktiv gennemførelse trækkes tilbage også efter genindlæsning. Korrekt tekst i et ubekræftet felt tæller ikke. Besøg, noter og manuelt vurderet CAS-dokumentation tæller ikke. Ingen migrering af brugerdata er nødvendig.

## Kontrol og udgivelse

- npm test: 87 tests bestod under udviklingen; heraf 8 nye faglige/bank/rutetests.
- tests/vector.test.js beregner tennisroden ved uafhængig bisektion og evaluerer faktisk viste MathML-koordinater med en separat testparser. Tester geometri, cirkelperiode, aksevalg, dobbelte besøg, samtidighed, domæne, bankkontrakt, delpoint og specifik fejlfeedback.
- tests/vector.browser.test.js kontrollerer alle 37 kort og alle 16 bankopgaver, træning/prøve, præcis grundhjælp, hints/noter/svar efter genindlæsning, status og tilbagekaldelse, direkte ruter/historik, planlagte sider, MathML, labels, entydige id'er, tastatur, hele forløbet og alle 16 bankopgaver ved 390 pixels samt konsol.
- tests/vector.accounts.browser.test.js bruger isoleret midlertidig PGlite-database til kontolagring, anden enhed, modulstatus, historisk fremdrift, brugerisolation og bevarelse af tidligere normalsvar.
- Hele den eksisterende browser- og kontotestsuite samt produktionsbuild skal bestå før publicering. Endelig resultatlog og udgivelsesstatus tilføjes nedenfor.

### Endelig verifikation

Alle nedenstående kontroller bestod 20. oktober 2026:

| Kontrol | Resultat |
| --- | --- |
| npm test | 87 af 87 tests; heraf 8 nye vektortests |
| BROWSER_CHANNEL=chrome npm run test:browser | Alle 18 browserfiler bestod, inklusive hele den eksisterende suite og Modul 1 |
| npm run test:accounts | PostgreSQL-protokol, login, sessionsadskillelse, adgangskoder og revisionskonflikter bestod |
| BROWSER_CHANNEL=chrome npm run test:accounts:browser | Både eksisterende konto-flow og den nye vektortest bestod |
| npm run build | Produktionsbuild bestod |
| git diff --check | Ingen whitespace-fejl |
| Visuel kontrol | Desktop 1440 pixels og mobil 390 pixels: trinmenu, formler, koordinatsøjler, cirkel med ens akseenheder og svarfelter gennemset |
| Fejl og tilgængelighed | Ingen JavaScript- eller konsolfejl i browserforløbene; MathML-struktur, labels, id'er, fokus og tastatur kontrolleret |

Kontotestene bruger en isoleret midlertidig database. De kørte mod en identisk kildekopi i /tmp/christian-vector-test-runtime med en frisk npm ci fra projektets uændrede låsefil, fordi nogle lokale node_modules-filer var dataless/offloadede. Der er ikke kørt migreringer eller testskrivninger mod produktion.

Udgivelsesvej: commit på codex/vektorfunktioner-modul-1, almindeligt fast-forward-push til GitHubs main og projektets eksisterende automatiske Vercel-produktionsdeployment. Produktionsmål: https://christian-matematik-webapp.vercel.app/#vectorFunctions. Deployments endelige status og commit bekræftes i chatten efter publicering.

## Næste arbejdsgang

Stop efter denne levering. Ved brugerens besked om Modul 2: genlæs ark 2 og relevante mål, implementér kun Modul 2, tilføj dets bankopgaver, kontolagring, progression og tests, og opdatér planen. Ved repetition: brug læseplanens B12–B13, differentialregningens begreber samt kildearkenes højde-/afstandsmodeller; implementér netop de to spor i det ene repetitionsafsnit. Ved Modul 3: genlæs ark 3 og verificér især arealnotation, orientering, kurvelængde og dobbeltpunktgrænser på ny.
