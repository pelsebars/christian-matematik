# Differentialligninger · første arbejdsgang

## Kilder og afgrænsning

Primær kilde er `Pensum/Læseplan.pdf`, `Pensum/Undervisningsbeskrivelse.pdf` og alle seks DOCX-ark under `Pensum/4. Differentialligninger`. Kilderne er lokale og publiceres ikke med appen. PDF'erne er tekstudtrukket på ny. DOCX-arkene er gennemgået med både almindelig tekst og Office Math-indhold; brøker og eksponenter må ikke aflæses fra flad tekst alene.

Læseplanen placerer modul 1 og 2 den 28/10, modul 3 den 29/10, B8–9 den 30/10, modul 4 og 5 den 2/11 og modul 6 den 3/11 2026. Ark 3 indeholder både lokale tangentopgaver og mere omfattende CAS-modeller (varierende koefficienter, integrerede modeller og modelparametre); de må ikke forsvinde i senere arbejde. Ark 4 prioriterer hældningsfelter og løsningskurver og foreskriver ikke en bestemt trinvis numerisk algoritme. En sådan algoritme bliver et mærket supplement. Ark 5 dækker Newtons afkølingslov og forskudt eksponentiel vækst. Ark 6 dækker logistiske modeller og maksimal væksthastighed.

Beviserne henvises ifølge undervisningsbeskrivelsen til særskilte fotokopier. Modul 1 forklarer løsningskontrol ud fra definitionen og begrunder familien ved, at en funktion med afledt nul er konstant på et interval. Det fremstilles ikke som en gengivelse af ikke-tilgængelige bevisfotokopier.

## Læringsmålmatrix

Den fulde matrix er første gang oprettet i `ode-plan.js` før undervisningsindholdet. Den vises direkte i forløbsoversigten. U1–U7 følger undervisningsbeskrivelsens faglige mål, K1–K6 kernestoffet, A1–A7 præciserer de seks ark, og B8–B9 beskriver repetitionen. Hver række angiver introduktion, øvelse, kontrol og hjælpemidler. Kommende kontroller er eksplicit planlagte.

## Navigation og filer

- `#differentialEquations`: oversigt, alle statusser og foldbar læringsmålmatrix.
- `#differentialEquations/1/start`: mål og fem diagnostiske spørgsmål.
- `/1/teori`, `/1/eksempler`, `/1/oevelser`, `/1/sluttjek`, `/1/opsummering`: selvstændige undervisningstrin under samme hash-præfiks.
- `/2`, `/3`, `/repetition`, `/4`, `/5`, `/6`: separate planlagte undersider.
- `/opsamling`: separat planlagt afslutning, ikke en ottende undervisningsgang.

`ode-routes.js` normaliserer ugyldige ruter. `ode.js` styrer oversigt og navigation. `ode-lesson.js` rummer kun modul 1. `ode-exercises.js` rummer diagnostik, mikroøvelser og sluttjek. De seks bankopgaver ligger i `tasks/bank/ode.js`. Matematik, opgaverendering, hints, sikker bedømmelse og versionskontrolleret lagring genbruges fra integralregning og fællessystemet. Fremtidige moduler skal have egne undervisningsfiler.

## Progression og lagring

Der er ingen brugerprofiler i den eksisterende app. Besvarelser, kontroller og hints gemmes som integralmodulerne med format `{version:1,cards:{...}}` i `christian-matematik.ode.introduction.v1` på den aktuelle enhed. Defekte data eller blokeret lagring giver en synlig advarsel.

Status beregnes på ny fra de gemte besvarelser: ingen svar betyder Ikke begyndt; en besvarelse betyder I gang. Gennemført kræver tre mikroøvelser, fem bankopgaver uden hjælpemidler og fire afsluttende spørgsmål korrekt kontrolleret (12 obligatoriske kort). Hvis et korrekt svar redigeres, trækkes gennemførslen straks tilbage indtil ny kontrol. Diagnostiske spørgsmål udelukker ikke fremdrift. CAS-noter og mundtlige/skriftlige begrundelser vurderes særskilt af eleven og får ikke automatiske point.

Fællesbanken bruger fortsat sit eksisterende format `christian-matematik.tasks.v1`, herunder træning, prøvetilstand, historik og manuel markering af gennemførte moduler. Undervisningsstatus overskriver ikke denne manuelle liste; samme adskillelse findes for integralregning. Fra bankens anbefalinger åbner repetition direkte modul 1.

## Modul 1-opgaver

| Opgave | Indhold | Kilde |
| --- | --- | --- |
| ode.notation | Ukendt funktion og interval | Egen begrebsopgave til ark 1 |
| ode.polynomial | Kontrol af et forkert polynomium i tre trin | Ark 1, u6 |
| ode.family | Familie, konstant og punkt | Egen bro til ark 2 |
| ode.exponential | Symbolsk kontrol og identitet | Ark 1, eksempel 1 |
| ode.model | Selvstændig fortolkning af tankmodel, variable og enheder | Egen modelopgave |
| ode.cas | Symbolsk kontrol, begyndelsesværdi og CAS-dokumentation | Egen tilpasning |

Der er kun opgaver til det implementerede modul. Planlagte moduler optræder ikke som klar opgavebankundervisning. Modulopgaverne er faste version 1-opgaver uden nye afhængigheder. Automatisk bedømmelse bruger kun de allerede understøttede tal, polynomier og entydige valg. Eksponentialudtryk bliver valg med MathML; der bruges ingen usikker fritekstbedømmelse.

## Verifikation

`npm test` inkluderer uafhængig kontrol af afledte polynomier, begyndelsespunkt, eksponentialidentitet, nettotilførsel og modelværdi samt bankintegration, feedback og ruter. `npm run test:browser` inkluderer alle eksisterende tests og `tests/ode.browser.test.js`: samtlige undervisningskort og bankopgaver, prøvetilstand, målrettet fejlfeedback, hints, grundhjælp, fremdrift, tilbagetrækning af gennemført status, genindlæsning, defekte data, blokeret lagring, alle modulsider, forrige/næste, MathML-struktur, tastatur, figur og 390-pixel mobilvisning. Produktion kontrolleres mod de publicerede filers indhold og med browser efter push.
