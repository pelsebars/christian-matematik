# Vektorfunktioner · samlet plan, Modul 1–3 og B-repetition 12–13

Status 6. november 2026: **Hele vektorforløbet er implementeret: Modul 1–3, B-repetition 12–13 og opsamlingen**. Repetitionen er unummereret og indeholder to uafhængige spor. Opsamlingen er ikke en ekstra undervisningsgang. Opsamlingen er implementeret efter brugerens konkrete fortsættelse, inklusive statusoverblik i pointshoppen.

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

Den vises i Modul 3 som korrekt MathML: A = ½ · |∫ₐᵇ r⃗′(t) · r⃗̂(t) dt|. Med tværvektoren (−y; x) bliver det ækvivalent med ½ · |∫ₐᵇ (x(t)y′(t) − y(t)x′(t)) dt|. Tværvektorens orientering forklares udtrykkeligt. Ved en simpel lukket kurve, gennemløbet én gang mod uret, er det orienterede udtryk positivt; modsat omløb ændrer fortegnet. Flere løkker skal afgrænses og behandles særskilt, så modsat orienterede bidrag ikke fejlagtigt udligner geometriske arealer. En åben kurve kræver også beskrivelse af lukningen.

Ark 3, P18 angiver kurvelængden som integral af længden af den afledte vektor; P38/P55 viser koordinatformen med kvadratroden af summen af koordinatafledtes kvadrater. Skeln mellem rutelængde med gentagne gennemløb og længden af den geometriske punktmængde. Hele tidsintervallet kan tælle samme delstrækning flere gange.

Formlerne og deres betingelser er nu implementeret i Modul 3. Kilderne er genlæst fra originalernes XML, og de relevante indlejrede figurer er gennemset igen den 6. november 2026.

## Rækkefølge og omfang

| Afsnit | Læseplan | Bogside | Status |
| --- | --- | --- | --- |
| Modul 1 · Banekurver og skæringspunkter | 11. november 2026 | 84–87 | Implementeret |
| Modul 2 · Hastighed, acceleration og tangenter | 12. november 2026 | 88–91 | Implementeret |
| B-repetition 12–13 · Monotoniforhold og optimering | 13. november 2026 | – | Implementeret |
| Modul 3 · Areal og kurvelængde | 16. november 2026 | 88–91 | Implementeret |
| Opsamling · Opsamling | Efter Modul 3 | – | Implementeret |

Repetitionens to spor har egne starttjek og egne kontroller. Bestået starttjek giver adgang til en hurtigere vej til selvstændige opgaver og sluttjek. Et forkert starttjek tilbyder rolig genopbygning; en sidevisning må aldrig give gennemførelse. Monotonisporet: afledtes fortegn, voksende/aftagende, stationære punkter, lokale/globale ekstrema og definitionsinterval. Optimeringssporet: oversæt tekst, opstil målfunktion og interval, find kandidater og randpunkter, sammenlign, kontrollér og fortolk. Broer: maksimal højde som andenkoordinat; største afstand via afstandens kvadrat, når det bevarer maksimum.

## Læringsmålmatrix

Samme 32 rækker bruges i appens udfoldelige målskort via vector-plan.js. Alle introduktioner, øvelser og kontroller er implementeret. Opsamlingen tilføjer blandet kontrol og seks faglige delstatusser, som er kortlagt nedenfor.

| Mål | Introduceres | Øves | Kontrolleres | Hjælpemidler og kilde |
| --- | --- | --- | --- | --- |
| U1 · Problemløsning med vektorfunktioner | M1 · position og baner | M1 · punkt og akser; M2 · bevægelse, tangent og højde; Rep. · højde og afstand; M3 | M1–M3 og Rep. · selvstændige opgaver og sluttjek | Begge · undervisningsbeskrivelse s. 7 |
| U2 · Værktøjsprogrammer til symbolbehandling og problemløsning | M1 · CAS og kontrol | M1 · tennis og dobbeltpunkt; M2; Rep. · alle kandidater; M3 | M1 · numerisk model; M2 · CAS-produkt og trigonometrisk tangent; Rep. · global CAS-kontrol; M3 · kildeintegraler og numerisk kontrol | CAS · ark 1, opg. 2 og 4 |
| U3 · Matematikanvendelse inden for udvalgte områder | M1 · sport og køretøjer | M1 · fodbold og ruter; M2 · basketball, fly og pil; Rep. · hegn og pindsvin; M3 | M1–M3 og Rep. · modelinterval, bevægelse og enheder | Begge · ark 1, opg. 4 og 6 |
| U4 · Fagets metoder og identitet | M1 · parameter, geometri og kontrol | M1 · nødvendig/tilstrækkelig kontrol; M2 · tangentbetingelser og globale kandidater; Rep. · nødvendig/tilstrækkelig betingelse | M1 · punktkontrol; M2 · nulvektor, kollision og CAS-kontrol; Rep. · lokale/globale udsagn; M3 · lukning, orientering og geometrisk areal | Begge · undervisningsbeskrivelse s. 7 |
| U5 · Grundlæggende færdigheder i kernestoffet | M1 · diagnostik og grundhjælp | M1 · koordinater og ligninger; M2 · differentiation, hældning og længde; Rep. · fortegn og modelopstilling | M1–M3 og Rep. · små kontroller og sluttjek | Uden · undervisningsbeskrivelse s. 7 |
| K1 · Banekurve og dobbeltpunkter | M1 · parameter og dobbeltpunkt | M1 · kurvelaboratorium; M2 · begge hastigheder i dobbeltpunkt | M1 · alle parameterværdier og samme punkt | Begge · ark 1 |
| K2 · Tangent, hastighed, fart og acceleration | M2 · koordinatvis differentiation | M2 · bevægelse og tangent | M2 · selvstændige opgaver/sluttjek | Begge · ark 2 |
| K3 · Opgaver uden hjælpemidler | M1 · punkt, akser, cirkel | M1–M2 og Rep. · håndregning; M3 | M1–M3 og Rep. · selvstændig del og sluttjek | Uden · alle tre ark |
| K4 · Relevant, dokumenteret CAS | M1 · model, ligning, interval, output, kontrol | M1–M2 og Rep. · egne værktøjsnoter; M3 | M1–M3 og Rep. · kontrollerede resultater; egne noter selvvurderes | CAS · alle tre ark |
| A1 · Vektorfunktion og koordinatfunktioner | M1 · parameter og position | M1 · indsættelse i begge koordinater | M1 · position og sluttjek | Uden · ark 1 |
| A2 · Parameter, punkt og banekurve | M1 · tre forskellige objekter | M1 · tabel og interaktiv figur | M1 · begrebskontrol og sluttjek | Uden · ark 1, eksempel 1 |
| A3 · Position ved bestemt parameter | M1 · gennemregnet eksempel | M1 · guidet position og model | M1 · selvstændig position | Uden · ark 1, kuglestød |
| A4 · Punkt på kurve: samme parameter i begge koordinater | M1 · punktkontrol | M1 · både gyldigt punkt og falsk kandidat | M1 · selvstændigt punkt og sluttjek | Uden · ark 1, u3 |
| A5 · Skæringer med begge akser | M1 · nul i den rigtige koordinat | M1 · alle rødder og intervalkontrol | M1 · to akseopgaver og sluttjek | Uden · ark 1, u2 og u5 |
| A6 · Baneskæring kontra samtidig kollision | M1 · to parametre, fælles tid | M1 · ruter; M2 · fly og pil | M1–M2 · selvstændig kollision og begrundelse | Begge · ark 1, bue/pil; ark 2, fly i M2 |
| A7 · Dobbeltpunkt og forskellige parametre | M1 · løkke og fuld indsættelseskontrol | M1 · begge parameterværdier og koordinater | M1 · dobbeltpunkt og sluttjek | Begge · ark 1, opg. 2 |
| A8 · Eliminering med domæne | M1 · parabel | M1 · interval og valg af gren | M1 · selvstændig elimination og interval | Uden · ark 1, eksempel 3 |
| A9 · Cirkler, radianer og gennemløb | M1 · centrum, radius og vinkel | M1 · cirkelforskrift og laboratoriet | M1 · centrum, radius og periode | Uden · ark 1, eksempel 2/4 og u4 |
| A10 · Bevægelsesmodeller, definitionsinterval og enheder | M1 · tennis og fodbold | M1–M2 · landing og højde; M3 | M1–M3 · fysisk rod, enheder og modelbegrænsning | Begge · ark 1, opg. 4/6 |
| A11 · Komponentvis differentiation og hastighedsvektor | M2 · teori | M2 · polynomier og trigonometriske baner | M2 · håndregning og CAS | Begge · ark 2 |
| A12 · Fart som skalar og acceleration | M2 · vektorlængde og anden afledt | M2 · fart, acceleration og enheder | M2 · model og sluttjek | Begge · ark 2 |
| A13 · Tangentretning og tangentligning | M2 · punkt og retningsvektor | M2 · vandret/lodret tangent; nulvektor kræver særskilt analyse | M2 · tangent og sluttjek | Begge · ark 2 |
| A14 · Vinkler og hastigheder i dobbeltpunkt | M2 · skalarprodukt | M2 · to parametre, to retninger | M2 · vinkel og kontrol | Begge · ark 2 |
| A15 · Maksimal højde og bevægelsesfortolkning | M2 · højde som koordinatfunktion | M2 · stationære punkter og randpunkter; Rep. · optimeringsspor | M2 · maksimum med fysisk interval; Rep. · selvstændig højde og sluttjek | CAS · ark 2, basketball |
| B12 · Afledtes fortegn og monotoniforhold | Rep. · eget starttjek | Rep. · fortegnstabel, voksende/aftagende | Rep. · selvstændig kontrol | Begge · læseplan s. 3 |
| B12a · Stationære punkter og lokale/globale ekstrema | Rep. · monotonispor | Rep. · fortegnsskift og definitionsinterval | Rep. · klassifikation og randpunkter | Begge · læseplan s. 3 |
| B13 · Tekst til optimeringsfunktion og interval | Rep. · eget starttjek | Rep. · største afstand, brug evt. kvadreret afstand | Rep. · selvstændig model | Begge · ark 1, pindsvin opg. 9c som bro |
| B13a · Kontrol, randpunkter og fortolkning | Rep. · optimeringsspor | Rep. · kandidatværdier og fysisk betydning | Rep. · globalt resultat med enhed | Begge · læseplan s. 3 |
| A16 · Kurvelængde som integral af farten | M3 · integralstarttjek og teori | M3 · bil, projektil og rute | M3 · længde, interval og enheder | CAS · ark 3 |
| A17 · Areal, tværvektor og koordinatform | M3 · kildeformel | M3 · orienteret integral og geometrisk areal | M3 · fortegn, orientering og positivt areal | CAS · ark 3, eksempel 1 |
| A18 · Dobbeltpunkter og korrekt områdeafgrænsning | M3 · lukkede delkurver | M3 · opdeling af områder og omløb | M3 · dobbeltpunkt, grænser og areal | CAS · ark 3, opg. 3 |
| A19 · CAS-integraler, numerik og grafisk kontrol | M3 · dokumentation | M3 · præcist integral og afrunding | M3 · reproducerbar løsning og rimelighed | CAS · ark 3 |

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
- #vectorFunctions/2/start
- #vectorFunctions/2/afledte
- #vectorFunctions/2/bevaegelse
- #vectorFunctions/2/tangenter
- #vectorFunctions/2/akser
- #vectorFunctions/2/vinkler
- #vectorFunctions/2/dobbeltpunkt
- #vectorFunctions/2/hoejde
- #vectorFunctions/2/vaerktoej
- #vectorFunctions/2/oevelser
- #vectorFunctions/2/eksamen
- #vectorFunctions/2/sluttjek
- #vectorFunctions/2/opsummering
- #vectorFunctions/repetition/start
- #vectorFunctions/repetition/monotoni
- #vectorFunctions/repetition/stationaere
- #vectorFunctions/repetition/globale
- #vectorFunctions/repetition/model
- #vectorFunctions/repetition/hoejde
- #vectorFunctions/repetition/afstand
- #vectorFunctions/repetition/vaerktoej
- #vectorFunctions/repetition/oevelser
- #vectorFunctions/repetition/eksamen
- #vectorFunctions/repetition/sluttjek
- #vectorFunctions/repetition/opsummering
- #vectorFunctions/3/start
- #vectorFunctions/3/fart
- #vectorFunctions/3/laengde
- #vectorFunctions/3/interval
- #vectorFunctions/3/areal
- #vectorFunctions/3/orientering
- #vectorFunctions/3/loekker
- #vectorFunctions/3/modeller
- #vectorFunctions/3/vaerktoej
- #vectorFunctions/3/oevelser
- #vectorFunctions/3/eksamen
- #vectorFunctions/3/sluttjek
- #vectorFunctions/3/opsummering
- #vectorFunctions/opsamling/start
- #vectorFunctions/opsamling/overblik
- #vectorFunctions/opsamling/metode
- #vectorFunctions/opsamling/uden
- #vectorFunctions/opsamling/med
- #vectorFunctions/opsamling/modelkontrol
- #vectorFunctions/opsamling/sluttjek
- #vectorFunctions/opsamling/opsummering

Gamle emners ruter bevares. #vectorFunctions/1 og #vectorFunctions/2 samt ukendte trin i disse moduler normaliseres til deres start. Alle fem afsnit er nu implementeret. Opsamlingen har sin egen status og tælles særskilt fra undervisningsgangene. Hashnavigation følger browserens historik; trinlinks og direkte genindlæsning virker. Sideoverskriften får fokus ved navigation. Venstremenuens fælles accordion viser M1, M2, Rep., M3 og Opsamling.

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

Hovedemne vectorFunctions har bankmoduler vf.1, vf.2, vf.repetition, vf.3 og vf.opsamling. Pakkerne leverer henholdsvis 16, 20, 16 og 20 faste, verificerede version 1-opgaver. Opsamlingens vf.opsamling tilføjer 16, i alt 88 vektoropgaver. Hele fællesbanken har 493 opgaver. Gamle id'er, versioner og gemte sæt er bevaret. Den eksisterende udvælgelse, bedømmelse og sessionskontrakt genbruges. Neutrale opgavetekster; metoder ligger i hints og løsninger. Særskilte delspørgsmål giver delpoint. Prøvetilstand skjuler hjælp til aflevering, og Gentag-modul linker til den relevante direkte startrute.

Kontonamespaces:

- christian-matematik.vector.introduction.v1 og christian-matematik.vector.notes.v1: Modul 1.
- christian-matematik.vector.dynamics.v1 og christian-matematik.vector.dynamics-notes.v1: Modul 2.
- christian-matematik.vector.repetition.v1 og christian-matematik.vector.repetition-notes.v1: B-repetition 12–13.
- christian-matematik.vector.measure.v1 og christian-matematik.vector.measure-notes.v1: Modul 3.
- christian-matematik.vector.finish.v1 og christian-matematik.vector.finish-notes.v1: Opsamling.

Øvelsesformatet er fortsat version 1 med svar, checked og hints pr. id. Den eksisterende accountStorage, revisionskontrol, synkroniseringskø og markCorrect/lessonCompletion genbruges. Første korrekt kontrollerede løsning registreres med vectorFunctions, det korrekte modul og konkret trinrute. Alle tre moduler og repetitionen har uafhængig aktiv fremdrift. Den permanente historik beholdes, mens den **aktive** status beregnes fra aktuelt kontrollerede svar. Enhver svarredigering fjerner checked, så aktiv gennemførelse trækkes tilbage også efter genindlæsning. Korrekt tekst i et ubekræftet felt tæller ikke. Besøg, noter og manuelt vurderet CAS-dokumentation tæller ikke. Ingen migrering af brugerdata er nødvendig.

## Første levering · kontrol og udgivelse

- npm test: 87 tests bestod under udviklingen; heraf 8 nye faglige/bank/rutetests.
- tests/vector.test.js beregner tennisroden ved uafhængig bisektion og evaluerer faktisk viste MathML-koordinater med en separat testparser. Tester geometri, cirkelperiode, aksevalg, dobbelte besøg, samtidighed, domæne, bankkontrakt, delpoint og specifik fejlfeedback.
- tests/vector.browser.test.js kontrollerer alle 37 kort og alle 16 bankopgaver, træning/prøve, præcis grundhjælp, hints/noter/svar efter genindlæsning, status og tilbagekaldelse, direkte ruter/historik, planlagte sider, MathML, labels, entydige id'er, tastatur, hele forløbet og alle 16 bankopgaver ved 390 pixels samt konsol.
- tests/vector.accounts.browser.test.js bruger isoleret midlertidig PGlite-database til kontolagring, anden enhed, modulstatus, historisk fremdrift, brugerisolation og bevarelse af tidligere normalsvar.
- Hele den eksisterende browser- og kontotestsuite samt produktionsbuild skal bestå før publicering. Endelig resultatlog og udgivelsesstatus tilføjes nedenfor.

### Første leverings verifikation · Modul 1

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

## Modul 2 · kilder, indhold og kontroller

### Kilden genlæst

Før denne udbygning blev hele ark 2, “Vektorfunktioner. Hastighed, acceleration og tangenter.docx”, genlæst. De anvendte forskrifter er kontrolleret i Office Math: m:eqArr afgrænser koordinater, m:sSup eksponenter, m:f brøken i u5, og m:func viser de trigonometriske argumenter. Arkets 11 PNG-figurer blev gennemset, inklusive de to hastighedspile i dobbeltpunktet. Appens figurer er nye beregnede SVG'er, ikke kopier af kildebillederne. De tre EMF-bilag er ikke anvendt som formelkilder. Der er ingen afskrift fra mangelfuld flad tekst.

| Ark 2 / afsnit | Kontrolleret forskrift eller opgave | Placering |
| --- | --- | --- |
| P6, eksempel 1 | (t³; t³ − 2t + 2) | Gennemregnet koordinatvis differentiation og pil fra positionen |
| P29, basketball | (4t; −4,91t² + 6t + 1,6) | Fart, maksimal højde, passage, interval og laboratoriet |
| P44, dobbeltpunkt | (t² − 4; t³ − 2t² − t + 3) | To hastigheder, vektorvinkel 153,43495° og mindste tangentvinkel 26,56505° |
| P55, trigonometrisk produkt | (cos(3t) cos(t); cos(3t) sin(t)), fra 0 til π | CAS, produkt-/kæderegel og tangent ved π/4 |
| P82, u3 | (t³ − 2t; 2t² − 3) | Symbolsk differentiation, hastighed og acceleration |
| P88, u4 | (3t² − 6t; t − 1) | Lodret tangent i (−3; 0) ved parameter 1 |
| P94, u5 | (t³ − 3t; ¼t⁴ − 2t³ + 4t² + 1) | Alle vandrette tangentparametre 0, 2 og 4, med kontrol af første komponent |
| P111, u7 | (t³ − 3t; t² − t + 1) | Dobbeltpunkt (2; 3), parametre −1 og 2, hastigheder (0; −3) og (9; 3) |
| P123, u8 | (t² − 8t + k; t² − 2t − 3) | Både retning og placering: andenaksen tangent kræver k = 16 |
| P137, med hjælpemidler 1 | (t²; t³ exp(t + 2)) | CAS-produktregel og symbolsk ækvivalenskontrol |
| P152, fly | (17 − 204t; 432t² − 72t + 3) og (2 + 70t; 140t²) | Timer/kilometer, landing, fart, baneskæring og samtidighed |
| P172, cirkel | (2 + 3 cos(t); 4 + 3 sin(t)), fra 0 til 2π | Hastighed, acceleration og konstant fart med skiftende retning |
| P182 og P194, pil og dyr | (25t; −4,91t² + 30t + 0,95), (8; −4,91t² + 12) | Starthastighedens vinkel og samtidighedskontrol |

Kildearkets ringpunkt (3,56; 3,05) er afrundet: modellen giver andenkoordinaten 3,050789 ved førstekoordinaten 3,56. Passagen defineres derfor præcist ved førstekoordinaten; højden beregnes af modellen. Der konstrueres ikke en falsk eksakt punkttest.

Flymodellen giver to algebraiske baneskæringer. Førstekoordinaten cirka 1,24785 kræver negativ tid for det lettende fly og udelades. Det relevante punkt er cirka (5,03476264; 0,26313669), nået ved henholdsvis 0,05865312 og 0,04335375 timer. Ved fælles tid 15/274 time er førstekoordinaterne ens, men højderne forskellige: ingen samtidig kollision. Begge beregningsveje indgår i løsningen. Landingstiden er 1/12 time, og hastighedens enhed er kilometer pr. time.

### Implementeret undervisning

- 13 separate trin med starttjek, koordinatvis differentiation, hastighed/fart/acceleration, tangentligning, aksetangenter/nulvektor, vinkler, dobbeltpunkt, højde, CAS, selvstændige opgaver, sammenhængende modeller, sluttjek og opsummering.
- 46 kort: 9 diagnostiske spørgsmål, 10 guidede kontroller, 20 bankopgaver og 7 sluttjek. De 37 ikke-diagnostiske kort skal være korrekt kontrolleret for aktiv gennemførelse.
- Særskilt grundhjælp for position, potensregel, konstant, vektorlængde, hældning, ligning, skalarprodukt, radianer og definitionsinterval. Fejl peger på den konkrete byggesten og eksisterende undervisning.
- Fire interaktive bevægelsesmodeller: kast, cirkel, løkke og nulvektor. Position, hastighed, fart og acceleration beregnes ved det valgte tidspunkt. Pilene bruger oplyst visningsfaktor og lige store akseenheder. Nulvektor giver særskilt besked og ingen automatisk tangentretning. Alle værdier kan læses i en tabel. En separat figur viser begge hastighedspile i dobbeltpunktet.
- Kriterier for vandret/lodret tangent kræver ikke-nul hastighed. Nulvektor udelukker ikke en tangent; den almindelige regel kan blot ikke afgøre den.
- Vektorvinkel og mindste linjevinkel holdes adskilt. Omvendte retninger kan give samme tangentlinje. Vinkler med nulvektorer afvises.
- Maksimal højde behandles konkret med fortegn, kandidater, randpunkter og interval. Den særskilte B-repetition blev efterfølgende implementeret som beskrevet nedenfor.
- Tre graduerede hints pr. opgave og specifik fejlfeedback, blandt andet koordinatsum kontra fart, fart i anden, ombyttede hældningskomponenter, vektor-/linjevinkel, konstantens afledte, rodvalg, tid og enheder.
- Eksterne CAS-noter og frie forklaringer selvvurderes og tæller ikke som automatisk korrekt. Begge undervisningsgange bruger eksisterende kontolagring og permanente versionsmærkede løsningshistorik.

### Opgavebank og tests

20 nye faste version 1-opgaver i vf.2. Bank-id'er: vf2.derivative, velocity, motion, tangent, vertical, horizontal, zero, angles, double, double-angle, circle, basketball, passage, aircraft, dart, cas-product, cas-trig, interval, parameter og units (alle med vf2.-præfiks). De bruger samme bankkontrakt, træning/prøve, delpoint, versionsgenoptagelse og modulgenvej som eksisterende opgaver. Hver del har verificeret svar og fejlfeedback. De 16 vf1.-opgaver og deres versioner er uændrede.

Nye tests:

- tests/vector-dynamics.test.js: 10 faglige/bank/rutetests. Evaluerer de viste MathML-koordinater med separat testparser; kontrollerer afledte med uafhængige endelige differenser, højde med bisektion, vektorvinkler med skalarprodukt, alle modelresultater, nulvektor, enheder, delpoint og fejlfeedback.
- tests/vector-dynamics.browser.test.js: alle 46 kort og 20 bankopgaver i UI, planlagte afsnit, 13 ruter, historik og direkte links, diagnostik, særskilt lagring/progression, gamle Modul 1-svar, diagrammer, tastatur, MathML, labels, 390 pixels og ingen konsol-/JavaScript-fejl.
- tests/vector-dynamics.accounts.browser.test.js: alle Modul 2-svar og korrekt emne/modul/rute på konto, anden enhed, svarredigering og aktiv tilbagekaldelse, varig historik, særskilte Modul 1-noter/svar, hints, brugerisolation og genoptaget gemning efter transportfejl. Kun midlertidig lokal database.

### Modul 2 · afsluttende verifikation

Alle kontroller bestod 20. oktober 2026:

| Kontrol | Resultat |
| --- | --- |
| npm test | 97 af 97 faglige/bank/rutetests; heraf 10 nye til Modul 2 |
| BROWSER_CHANNEL=chrome npm run test:browser | Alle 19 browserfiler bestod, inklusive de 18 tidligere forløb |
| npm run test:accounts | Konto-API, sessioner, isolation, adgangskoder og revisionskontrol bestod |
| BROWSER_CHANNEL=chrome npm run test:accounts:browser | Alle tre kontoforløb bestod: eksisterende app, Modul 1 og Modul 2 |
| Modul 2 i browser | Alle 46 kort og 20 bankopgaver kontrolleret gennem de faktiske svarfelter; korrekt delpoint, feedback og prøveprivatliv |
| Gemning og status | Egne Modul 2-namespaces, anden enhed, hints/noter, fejl i transport, genindlæsning, tilbagekaldelse af aktiv gennemførelse og bevaret historik bestod |
| Matematik | Uafhængig evaluering af viste formler, numeriske afledte, højder, tangenter, vinkler, fart, enheder, interval og samtidighed bestod |
| Tilgængelighed og mobil | MathML-struktur og namespace, labels, entydige id'er, fokus, tastatur, tabeller og alle sider/bankopgaver ved 390 pixels bestod |
| Fejl | Ingen JavaScript- eller konsolfejl i undervisnings- og opgavebankens browserforløb |
| Visuel kontrol | Desktop 1440 pixels og mobil 390 pixels: formler, afledte, tangenteksempel, dobbeltpunkt og nulvektor gennemset |
| npm run build og git diff --check | Bestået |

Kontotestene bruger kun midlertidige lokale databaser i den samme isolerede runtime med projektets uændrede låste afhængigheder. Ingen migreringer eller testskrivninger mod produktion. Alle 297 tidligere bankopgaver og alle eksisterende dataversioner bevares.

Udgivelsesvej: codex/vektorfunktioner-modul-2 → almindeligt fast-forward-push til GitHubs main → automatisk Vercel-produktionsdeployment. Produktionsmål: https://christian-matematik-webapp.vercel.app/#vectorFunctions/2/start. Den endelige produktionsstatus og commit bekræftes i chatten efter publicering.

## B-repetition 12–13 · implementering 5. november 2026

### Kilder og faglig kontrol

Læseplanens side 3 placerer monotoniforhold og optimering den 13. november mellem Modul 2 og Modul 3. Der findes ikke et særskilt lokalt B12–13-ark. Differentialkvotient-arket er genlæst med struktureret Office Math, især afledt som ændringshastighed. Ark 1 og 2 er genudtrukket fra originalernes XML med koordinatgrænser, eksponenter og fortegn bevaret.

- Ark 1, opgave 9, P219: pindsvinet har koordinater −2t² + 10t og t³ − 11t² + 30t på det lukkede interval fra 0 til 5 minutter. Begge akser er i meter, og reden er origo. Ved to minutter er positionen (12; 24), så afstanden er √720 ≈ 26,83281573 meter.
- Den kvadrerede afstand faktoriseres som t²(5−t)²(4+(6−t)²). Dens afledte er 2t(t−5)(3t³−40t²+170t−200). Der er præcis én indre stationær kandidat, t ≈ 1,9164223147. Den giver cirka 722,02209704 kvadratmeter, mens begge randværdier er nul. Globalt maksimum for den retlinjede afstand er derfor cirka 26,87046887 meter. Den kubiske faktors to vendepunkter for monotoni og dens fortegn beviser, at ingen flere rødder i intervallet er overset; dette kontrolleres uafhængigt i testen.
- Ark 2, basketball, P29: koordinater 4t og −4,91t² + 6t + 1,6. Det fysiske interval slutter ved den første positive gulvrod, cirka 1,4471702492 sekunder. Maksimal højde cirka 3,4329938900 meter nås efter cirka 0,6109979633 sekunder. Begge randhøjder indgår i kontrollen.
- Øvrige eksempler, fortegnstabeller, rektangel-/hegnsmodeller, tank og SVG-figurer er egne pædagogiske tilføjelser. Kildeoriginalerne er uændrede.

### Undervisning, opgavebank og gemning

12 direkte trin: to starttjek, funktion/afledt, stationære punkter, globale ekstrema, tekst til funktion, højde, afstand, CAS, selvstændige opgaver, teksttunge modeller, to sluttjek og arbejdsmetode. Der er 40 kort: otte diagnostiske, otte mikroøvelser, 16 bankopgaver og otte slutkort. Hvert spor har fire startkort, tolv træningskort og fire slutkort. Aktiv gennemførelse kræver hele sporets sluttjek plus enten hele starttjekket eller alle træningskort. Kort skal være korrekt kontrolleret. Et gennemført spor påvirker ikke det andet.

Den optjente genvej er kun aktiv ved fire korrekte startkort i det pågældende spor. En redigering kræver ny kontrol og kan fjerne genvej og aktiv gennemførelse, også efter genindlæsning. Hele træningen er en alternativ vej. Sidebesøg, figurbetjening og noter giver ingen automatisk gennemførelse. Først-korrekt-historik, optjente point og køb bevares.

Grundhjælpen knyttes til konkrete fejl i potensregel, fortegn, stationære punkter, globale kandidater, modelopstilling, interval, sammenligning og afstand. To tastaturbetjente figurer sammenholder funktion og afledt og viser maksimum i afkortede tidsintervaller for kast og pindsvin. Talstatus og tabeller giver alternativer til grafisk aflæsning. MathML bruges til alle synlige forskrifter, vektorer, brøker, potenser og rødder.

16 nye faste version 1-bankopgaver i modulet vf.repetition med præfiks b1213.: sign, table, flat, global, domain, corner, tank, cubic-cas, rectangle, endpoint, height, square-distance, distance, fence, basketball og hedgehog. Banken har nu 457 opgaver. Tidligere 441 opgaver, id'er, versioner og genoptagelse af gamle sæt er bevaret. Begge hjælpemiddeltyper, delpoint, målrettede fejl, træning, prøvetilstand og genbesøgslink er integreret.

Kontonamespaces: christian-matematik.vector.repetition.v1 og christian-matematik.vector.repetition-notes.v1. Eksisterende Modul 1- og Modul 2-namespaces er uændrede. Løsningshistorikken angiver Vektorfunktioner, B-repetition 12–13 og præcis rute. Der er ingen databaseændringer eller migreringer i leveringen.

### Verifikation

- tests/vector-repetition.test.js: seks uafhængige faglige/bank/rutetests. Viste MathML-funktioner evalueres separat; rødder, fortegn, kandidatværdier, tekstbetingelser, globale ekstrema, alle modelresultater og enheder kontrolleres. Begge veje til gennemførelse og deres tilbagekaldelse testes.
- tests/vector-repetition.browser.test.js: alle 40 kort og 16 bankopgaver, to uafhængige spor, optjente genveje, konkrete fejl, genindlæsning, hints/noter, gamle Modul 1/2-tilstande, figurer, alle 12 ruter, historik, direkte links, prøveprivatliv, MathML, labels, id'er, tastatur, 390 pixels og ingen konsolfejl.
- tests/vector-repetition.accounts.browser.test.js: alle svar på konto, anden enhed, brugeradskillelse, metadata, bevarede Modul 1/2-svar/noter, hints, historik, tilbagekaldt aktiv status og genoptagelse efter gemmefejl. Point og et køb kontrolleres uændrede efter svarredigering. Kun isoleret midlertidig lokal database.

Alle kontroller bestod 5. november 2026:

| Kontrol | Resultat |
| --- | --- |
| npm test | 146 af 146 faglige/bank/rutetests, heraf seks nye til repetitionen |
| Browserregression | Alle 29 filer fra test:browser bestod. De første 11 blev kørt i rækkefølge; de sidste 18 i tre uafhængige grupper |
| npm run test:accounts | Konto-API, isolation, sessioner, adgangskoder og revisionskontrol bestod |
| test:accounts:browser | Alle 13 kontoforløb bestod. Repetitionens kontotest blev også kørt mod den endelige appkode efter tilpasningen af eksakte svarmuligheder |
| Butik, point, vejleder og guide | test:shop, test:bank-rewards, test:tutor og test:guide bestod: 13 yderligere tests og fire browserforløb |
| Repetition i UI | Alle 40 kort og 16 bankopgaver kontrolleret; begge gennemførelsesveje og svarredigering, delpoint, feedback og prøveprivatliv bestod |
| Mobil og tilgængelighed | Alle 12 trin, bankopgaver samt åbnede løsninger ved 390 pixels; MathML, labels, id'er, fokus, tastatur og tabelalternativer bestod |
| Visuel kontrol | Desktop og mobil: funktion/afledt, stationært punkt uden ekstremum, kandidat- og randtabel, højde og afstand gennemset |
| JavaScript og konsol | Ingen fejl i repetitionens undervisnings- og bankforløb |
| Produktionsbuild og Git | npm run build og git diff --check bestod |

Kontotestene kørte i /tmp/christian-repetition-check med en frisk npm ci fra samme låsefil og en kildekopi af appen. De supplerende forløb brugte samme låste afhængigheder i en separat midlertidig mappe. Det undgår lokal offloading af afhængigheder; alle databaser er midlertidige. Ingen testskrivninger eller migreringer mod produktion. Den afsluttende Vercel-status og sammenligning af berørte produktionsfiler med det testede build bekræftes i chatten efter push.

Udgivelse følger AGENTS.md: hele Git-status gennemgås; det eksisterende ucommittede standalone-grafværksted er undersøgt og uafhængigt af appen. Det bevares uden at medtages. Git-commit på codex/vektorfunktioner-repetition pushes til main og bygges automatisk af Vercel. Railway-database og volumen bevares, og den bevidst frakoblede Railway-appservice ændres ikke.

## Næste arbejdsgang

Repetitionens stop blev efterfulgt af brugerens konkrete fortsættelse til Modul 3. Ark 3 er genlæst, og kontrollen er dokumenteret nedenfor. Stop efter Modul 3; opsamlingen er fortsat tydeligt planlagt.

## Modul 3 · implementering 6. november 2026

### Genlæsning og faglig kontrol

Hele ark 3 er genudtrukket fra den uændrede original. Office Math i P18, P27, P47, P71 og P83–85 er kontrolleret direkte i XML med brøk, norm, eksponent, koordinatgrænser og tværvektor. De indlejrede figurer for modelbil, dobbeltpunktsløkke, radial lukning, skiløbere, fire-spidset kurve og landevejsbil er gennemset. Opgave 4's formelbillede (image6.tmp, faktisk PNG) viser samme halverede integral med afledt stedvektor og tværvektor. Læseplan side 3 og undervisningsbeskrivelse side 7 er genlæst for placering og mål.

| Kildemodel | Kontrolleret resultat og betingelse |
| --- | --- |
| Modelbil: første koordinat sin(t)+2; anden 3sin(t/2)+1 | Hele intervallet 0 til 4π giver længde 15,4826515303 m. Øvre løkke 0 til 2π har areal 4 m²; de to løkker har samlet geometrisk areal 8 m² og orienteret sum nul. |
| Fire-spidset kurve: 4cos³(t), 4sin³(t) | Farten er 12 gange absolutværdien af produktet sin(t)cos(t); fire kvadranter giver længde 24. Nulfart i spidserne kræver stykkevis argumentation, ikke negativ fart. |
| Kanonkugle: 11,2t; −4,91t²+8,43t+1,7 | Første positive landing 1,8992077550 s; vandret rækkevidde 21,2711268561 m; banelængde 23,5732231569 m. Fortegnet og eksponenten er aflæst strukturelt i Word og kontrolleret mod arkets resultat. |
| Dobbeltpunktsløkke: t²−2t; t³−12t | Parametre −2 og 4 giver (8;16). Areal 129,6; længde 68,5198796563; spids tangentlinjevinkel 80,5376777920 grader. |
| Radial lukning: −t³+3t; t² | På −k til k, med 0<k<√3, er de to indre områder separate. Arealet k⁵/5+k³=6 giver k=1,5862586134. Radiale forbindelser gennem origo har nul bidrag. |
| Skiløbere | Sluttider 30 og 13,1607401295 s ved andenkoordinat −300 m. Rutelængder 300,2399040767 og 307,9835531964 m. Kortest tid er ikke kortest rute. |
| Landevejsbil: 12t; 0,001t³−0,1t²+2,4t | Fart ved ét sekund 12,2005413404 m/s; længde på 0 til 60 s er 721,9128877326 m; endepunktsafstand 720 m. |

Numeriske kilderesultater er kontrolleret med højpræcisionsberegning og med uafhængig sammensat Gauss–Legendre-kvadratur i testene. Testene evaluerer også de faktisk viste MathML-koordinater separat. De interaktive figurer bruger en særskilt Simpson-rutine, som ikke bruges som facitorakel i testene.

### Undervisning, bank og lagring

13 direkte trin: mål/starttjek, fart, længde, interval/gennemløb, kildearealformel, orientering, løkker, modeller, værktøj, øvelser, eksamen, sluttjek og arbejdsmetode. 45 kort består af ni diagnostiske spørgsmål, ni guidede mikroøvelser, 20 bankopgaver og syv sluttjek. Kun de 36 korrekt kontrollerede ikke-diagnostiske kort gennemfører modulet. Besøg, figurer, noter og ubekræftede korrekte felter gennemfører ikke. Svarredigering trækker aktiv status tilbage; permanent første-korrekt-historik og optjente point bevares.

Grundhjælpen følger den konkrete forudsætning: koordinatvis differentiation, vektornorm, absolutværdi, konstant integral, stamfunktion, grænser, orientering, lukning og radianer. Begge hjælpemiddeltyper indgår. Der er fuldt gennemregnede eksempler, trinvis hjælp, særskilte delpoint og specifik fejlfeedback. CAS-input og frie begrundelser gemmes som noter og selvvurderes; appen påstår ikke automatisk at kontrollere ekstern værktøjsbrug.

To tastaturbetjente SVG-laboratorier har samme målestok på akserne, beregnede kurver, gennemløbspile og tabelalternativ. Længdelaboratoriet sammenligner korder, integral og endepunktsafstand samt halve intervaller og gentagne cirkelomløb. Areallaboratoriet viser orienterede bidrag og positive delarealer, omvendt gennemløb og enkeltløkker. Halveringen er allerede med i tabellernes orienterede bidrag. Flere løkker, åbne kurvers angivne lukning og gentagne gennemløbs multiplicitet forklares særskilt.

Bankmodul vf.3 har 20 nye faste version 1-opgaver: constant, integrand, backtrack, circle, repeat, ellipse, orientation, small-loop, cancellation, loop-bounds, loop-measure, closure, radial, model-car, astroid, cannon, road, skiers, convergence og time-scale. Alle 457 tidligere opgaver og deres id'er/versioner er bevaret; samlet bank er 477. Opgaverne har neutrale tekster, tre hints, løsninger og feedback pr. delspørgsmål og virker i både træning og prøvetilstand. Prøvetilstanden skjuler hjælp indtil aflevering. Gentag-modul åbner Modul 3.

Nye namespaces er christian-matematik.vector.measure.v1 og christian-matematik.vector.measure-notes.v1. Kontoens eksisterende kø, revisionskontrol og historik genbruges, med metadata Vektorfunktioner, Modul 3 og præcis trinrute. Modul 1, Modul 2 og B-repetitionens lagring er uændret. Ingen databasemigreringer eller ændringer i point-/købslogik er tilføjet.

### Kontrol og udgivelse

- tests/vector-measure.test.js: syv uafhængige matematiske, bank-, versions-, feedback- og rutetests. De viste koordinater differentieres numerisk og kontrolleres mod separat Gauss–Legendre-kvadratur og eksakte arealer. Løkker, radial/ret lukning, orientering, flere omløb, fysisk interval, enheder og alle kildemodeller indgår.
- tests/vector-measure.browser.test.js: alle 45 kort og 20 bankopgaver, diagnostik/grundhjælp, hints, notesvar efter genindlæsning, gennemførelse/tilbagekaldelse, bevarede Modul 1/2/repetitionsdata, begge laboratorier, 13 ruter, historik, prøveprivatliv, MathML-struktur, labels, id'er, tastatur, samtlige trin og bankopgaver ved 390 pixels samt ingen JavaScript-/konsolfejl.
- tests/vector-measure.accounts.browser.test.js: alle 45 svar, korrekte metadata, anden enhed, brugeradskillelse, tidligere Modul 1/2/repetitionssvar og noter, hints, historik, aktiv status og genoptagelse efter en afbrudt gemning. En lokal elev optjener 48 point fra 45 nye og tre tidligere kort, køber en pizza for 40, redigerer et korrekt svar og beholder både de otte point og købet. Kun en isoleret midlertidig database anvendes.
- Manuel billedkontrol af desktop og mobil: kildearealformel og tværvektor, begge laboratorier, løkkeskygger, retning, lige akseenheder, tabeller og typografi. Mobiltabeller og aksemærker er tilpasset efter første kontrol.

| Kontrol | Resultat |
| --- | --- |
| npm test | 153 af 153 tests består, heraf syv nye til Modul 3 |
| Filerne i npm run test:browser | 30 af 30 browserforløb består |
| npm run test:accounts | Én PostgreSQL/API-test består |
| Filerne i npm run test:accounts:browser | 14 af 14 kontoforløb består |
| test:shop, test:bank-rewards, test:tutor og test:guide | 16 supplerende tests og fire browserforløb består |
| npm run build | Rent produktionsbuild består; 477 bankopgaver, 45 nye kort og 36 obligatoriske kontroller verificeret i artefaktet |
| MathML, tastatur og 390 pixels | Alle nye trin og bankopgaver består; ingen JavaScript-/konsolfejl |

De samme testfiler som pakkens fulde scripts køres; uafhængige browserfiler fordeles mellem processer. Kontoforløb bruger særskilte kildekopier og midlertidige databaser, så deres builds ikke kolliderer. De låste afhængigheder er kopieret fra den friske npm ci, der blev brugt ved repetitionen. Ingen tests eller migreringer peger mod produktion. De 15 berørte JavaScript-/CSS-filer er sammenlignet byte for byte med det rene build.

Udgivelse følger AGENTS.md: hele Git-status, også nye filer, er gennemgået. De tre eksisterende standalone-filer er uafhængige af appen og bevares uden at medtages. Branch codex/vektorfunktioner-modul-3 udgives gennem Git til main og Vercel. Vercels Production-resultat og de berørte filer på produktionsadressen kontrolleres efter push. Railway-database, volumen og den bevidst frakoblede appservice ændres ikke.

Efter Modul 3 bad brugeren om opsamlingen og om opdatering af statusoverblikket i pointshoppen. Den levering beskrives nedenfor.


## Opsamling og pointshop · implementering 6. november 2026

### Fagligt grundlag

Der er ikke et særskilt opsamlingsark. Læseplanens side 3 og undervisningsbeskrivelsens side 7 er genlæst for rækkefølge, U1–U5 og K1–K4. De tre oprindelige Word-ark er genudtrukket strukturelt med Office Math. Ark 1 P17 (cirkel med centrum −2 og 3, radius fem og vinkel 3t) og ark 3 P126/P142 (u2 og u4) er kontrolleret direkte i XML med koordinatgrænser, fortegn og eksponenter bevaret. De øvrige opsamlingsspørgsmål er egne nye eksempler, som repeterer det eksisterende stof. De er ikke et officielt eksamenssæt eller en ekstra undervisningsgang.

De nye numeriske resultater er verificeret med højpræcisionskvadratur samt uafhængig midpoint-kvadratur og bisektion i testene. Testene evaluerer faktisk vist MathML separat:

| Model | Kontrolleret resultat |
| --- | --- |
| Kast: 5t; −2t²+8t+1 | Første positive landing 4,1213203436 s; rækkevidde 20,6066017178 m; banelængde 27,8437419216 m. |
| Største afstand: t; 6t−t², fra nul til seks | Største højde ni ved tre; største afstand 9,5147458593 ved 3,1771243445. Alle indre kandidater og begge randpunkter sammenlignes. |
| Ark 3 u2: t³−2t; t² | Punktet (4;4) har parameter to og hastighed (10;4). Den givne linje går gennem punktet og har parallel retning. Kurvelængde fra nul til to er 7,6674666347. |
| Ark 3 u4: t²; t³−t+1 | Parametrene minus én og én giver (1;1), hastigheder (−2;2) og (2;2), tangentvinkel 90 grader. Svar kontrolleres i forskriften. |
| Ark 1 cirkel | Centrum (−2;3), radius fem, fart 15 og ét omløb på intervallet nul til to tredjedele pi; areal 25 gange pi. |
| Interaktiv egen model: 2t; 4t−t² | På nul til fire er banelængden 11,8315428604, endepunktsafstanden otte og højden størst fire ved to. Lukning langs førsteaksen giver orienteret bidrag minus 64 tredjedele og geometrisk areal 64 tredjedele. |

### Undervisning og mål

Otte trin indeholder seks diagnostiske spørgsmål, seks guidede mikroøvelser, 16 blandede bankopgaver og seks nye sluttjek: 34 kort, heraf 28 obligatoriske. Alle trin er direkte adresserbare og tastaturbetjente. Metodevalg trænes med samme model og seks forskellige spørgsmål i en beregnet SVG-figur med lige akseenheder og et fuldt tekstalternativ. Gennemregnede eksempler, modelkritik, flertrins-hints, specifik fejlfeedback, delpoint og egne CAS-noter følger appens fælles komponenter. Frie begrundelser og faktisk ekstern værktøjsbrug selvvurderes.

| Opsamlingsmål | Introduceres | Øves | Kontrolleres | Mål i det samlede forløb |
| --- | --- | --- | --- | --- |
| Parameter, punkter og baner | Starttjek og værktøjskasse | position, axes, passages, source-circle | final.position og svar i begge koordinater | K1, A1–A5, A7–A9 |
| Hastighed, acceleration og tangenter | Starttjek og værktøjskasse | tangent, zero, angles, passages, source-route | final.motion og særskilte delspørgsmål | K2, A11–A14 |
| Baneskæring og samtidig kollision | Starttjek og gennemregnet møde | clocks og mini.meeting | final.meeting og fysisk tid i begge modeller | A6, U1, U4 |
| Monotoni og optimering | Starttjek, værktøjskasse og figur | stationary, window, farthest | final.optimize, alle kandidater og randpunkter | A15, B12–B13a |
| Længde, areal og afgrænsning | Starttjek, kildeformel og figur | journey, turns, regions, flight, source-route | final.measure, multiple omløb og geometriske delarealer | A16–A18, U1, U5 |
| Modeller, enheder og CAS-kontrol | Værktøjskasse og dokumentation | flight, farthest, source-route og refleksionsrapporter | final.tools og konkrete modelresultater; faktisk CAS og fritekst selvvurderes | K3–K4, A10, A19, U2–U4 |

Opsamlingen gennemføres kun ved alle 28 korrekt kontrollerede aktiviteter. Svarredigering trækker aktiv gennemførelse tilbage. Seks faglige delstatusser viser målrettede links til tidligere grundlag. De tre moduler og B-repetitionen bevarer egne svar, noter og status. Forløbets nævner er fortsat fire undervisningsgange; opsamlingen tælles særskilt.

### Pointshop, bank og databevaring

Pointoverblikket i butikken har et nyt statusafsnit for alle fem vektorafsnit, inklusive Modul 3 og opsamlingen. Status og antal kommer direkte fra de eksisterende undervisningscontrolleres aktuelle bedømmelse via vector-progress.js. Der etableres ingen separat kopi af brugerens besvarelser eller ny vurderingsregel. Svarredigering opdaterer overblikket straks; genindlæsning og en anden enhed genopbygger det fra de gemte kontosvar. Optjente point og den aktuelle læringsstatus vises som forskellige størrelser.

Nye namespaces er christian-matematik.vector.finish.v1 og christian-matematik.vector.finish-notes.v1. Historikken angiver Vektorfunktioner, Opsamling og præcis trinrute. 16 nye faste version 1-opgaver har præfiks vfend. og modul vf.opsamling: position, axes, passages, clocks, tangent, zero, angles, stationary, window, journey, turns, regions, flight, farthest, source-route og source-circle. De virker i træning og prøvesæt med eksisterende kontrakt og korrekt genbesøgslink. Alle tidligere 477 opgaver og deres versioner/genoptagelse er bevaret; samlet bank 493.

Pointshoppens summering, køb, priser, historiske point og database er uændret. De nye statusrækker er kun en præsentation af den aktuelle fremdrift; der slettes eller genberegnes ingen point og køb. Eksisterende data og separate standalone-filer bevares.

### Verifikation og udgivelse

- Syv nye matematiske/bank/rute/status-tests består; npm test består med 160 tests.
- Ny kontobrowsertest består med alle 34 svar, hints/noter, anden enhed, brugeradskillelse, tidligere Modul 1/2/repetitions/Modul 3-svar og noter samt genoptagelse efter gemmefejl. Den midlertidige elev har 41 historiske point, køber for 40 og beholder restsaldo én, køb og pointoverblik efter svarredigering.
- Ny browsertest kontrollerer alle 34 kort, 16 bankopgaver, otte ruter, seks delstatusser, interaktivt metodevalg, pointshopstatus og tilbagekaldelse, MathML, labels, tastatur og 390 pixels.
- Billedkontrol af desktop og mobil er gennemført. Slutkontrollen af pointshoppen viser korrekt status for Modul 3 og opsamlingen, entydig opsamlingslabel, læsbare rækker ved 390 pixels og ingen sidefejl.

| Kontrol | Resultat |
| --- | --- |
| npm test | 160 af 160 tests består, heraf syv nye til opsamlingen |
| Filerne i test:browser | Alle 31 browserforløb består efter rettelse af ruteforventninger og separat genkørsel |
| Filerne i test:accounts:browser | Alle 15 kontoforløb består |
| test:accounts | Én PostgreSQL/API-test består |
| test:shop, test:bank-rewards, test:tutor og test:guide | 16 supplerende tests og fire browserforløb består |
| npm run build | Rent build består: 493 opgaver, 34 opsamlingskort og 28 obligatoriske kontroller verificeret i det byggede artefakt |
| JavaScript/CSS i build | Alle 18 berørte appfiler er identiske med den testede kildeversion |
| Tastatur, MathML, 390 pixels og konsol | Alle nye trin og bankopgaver består; ingen JavaScript-/konsolfejl |

Filerne fra de fulde pakkescripts køres i midlertidige kildekopier med samme låste afhængigheder. Kontotests har separate builds og isolerede PGlite-databaser. To tidligere rutetests er opdateret fra den planlagte opsamlingsadresse til den nu implementerede kanoniske startrute. Den første parallelle browserkørsel ramte desuden tidsgrænser i fire uændrede forløb; alle seks berørte testfiler består efter genkørsel med højst to samtidige browsere. Der ændres ingen testtidsgrænser eller produktionsfunktioner for at omgå disse kontroller. Ingen testdata, køb eller migreringer peger mod produktion.

Udgivelsen følger AGENTS.md via codex/vektorfunktioner-opsamling til main og Vercel. Hele Git-status gennemgås, og alle nødvendige appfiler medtages. Production-status og berørte filer på produktionsadressen kontrolleres efter push. Railway-database, volumen og den bevidst frakoblede appservice ændres ikke.
