# Differentialligninger · implementeret forløb

## Kilder og afgrænsning

Primær kilde er `Pensum/Læseplan.pdf`, `Pensum/Undervisningsbeskrivelse.pdf` og alle seks DOCX-ark under `Pensum/4. Differentialligninger`. Kilderne er lokale og publiceres ikke med appen. PDF'erne er tekstudtrukket på ny. DOCX-arkene er gennemgået med både almindelig tekst og Office Math-indhold; brøker og eksponenter må ikke aflæses fra flad tekst alene.

Læseplanen placerer modul 1 og 2 den 28/10, modul 3 den 29/10, B8–9 den 30/10, modul 4 og 5 den 2/11 og modul 6 den 3/11 2026. Ark 3 indeholder både lokale tangentopgaver og mere omfattende CAS-modeller (varierende koefficienter, integrerede modeller og modelparametre); de må ikke forsvinde i senere arbejde. Ark 4 prioriterer hældningsfelter og løsningskurver og foreskriver ikke en bestemt trinvis numerisk algoritme. En sådan algoritme bliver et mærket supplement. Ark 5 dækker Newtons afkølingslov og forskudt eksponentiel vækst. Ark 6 dækker logistiske modeller og maksimal væksthastighed.

Beviserne henvises ifølge undervisningsbeskrivelsen til særskilte fotokopier. Modul 1 forklarer løsningskontrol ud fra definitionen og begrunder familien ved, at en funktion med afledt nul er konstant på et interval. Det fremstilles ikke som en gengivelse af ikke-tilgængelige bevisfotokopier.

## Læringsmålmatrix

Den fulde matrix er første gang oprettet i `ode-plan.js` før undervisningsindholdet. Den vises direkte i forløbsoversigten. U1–U7 følger undervisningsbeskrivelsens faglige mål, K1–K6 kernestoffet, A1–A7 præciserer de seks ark, og B8–B9 beskriver repetitionen. Hver række angiver introduktion, øvelse, kontrol og hjælpemidler. Kontrollerne omfatter nu også den implementerede afsluttende opsamling.

## Navigation og filer

- `#differentialEquations`: oversigt, alle statusser og foldbar læringsmålmatrix.
- `#differentialEquations/1/start`: mål og fem diagnostiske spørgsmål.
- `/1/teori`, `/1/eksempler`, `/1/oevelser`, `/1/sluttjek`, `/1/opsummering`: selvstændige undervisningstrin under samme hash-præfiks.
- `/2/start` og de ti øvrige M2-trin: implementeret undervisning (se nedenfor).
- `/3/start` og de ni øvrige M3-trin: implementeret undervisning (se nedenfor).
- `/repetition/start` og syv øvrige B8–9-trin: implementeret repetition (se nedenfor).
- `/4/start` og otte øvrige M4-trin: implementeret undervisning.
- `/5/start` og ti øvrige M5-trin: implementeret undervisning.
- `/6/start` og ti øvrige M6-trin: implementeret undervisning.
- `/opsamling/start`: separat afslutning med starttjek, overblik, opgaver uden og med hjælpemidler, sluttjek og opsummering.

`ode-routes.js` normaliserer ugyldige ruter. `ode.js` styrer oversigt og navigation. `ode-lesson.js` rummer kun modul 1. `ode-exercises.js` rummer diagnostik, mikroøvelser og sluttjek. De seks bankopgaver ligger i `tasks/bank/ode.js`. Matematik, opgaverendering, hints, sikker bedømmelse og versionskontrolleret lagring genbruges fra integralregning og fællessystemet. Fremtidige moduler skal have egne undervisningsfiler.

## Progression og lagring

Besvarelser, kontroller og hints gemmes på den indloggede konto med format `{version:1,cards:{...}}` i navnerummet `christian-matematik.ode.introduction.v1`. Lokal preview bruger enhedens lager. Defekte data eller blokeret lagring giver en synlig advarsel.

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

## Implementeret modul 2 · proportional differentialligning

M2 er åbent på `#differentialEquations/2/start`. Elleve trin følger ark 2 og sider 102–103 samt 110: grundtjek, proportional hastighed, fuldstændig løsningsfamilie, begyndelsesværdi ved nul, andet begyndelsespunkt, ukendt vækstkonstant, interaktiv undersøgelse, opgaver uden hjælpemidler, modeller/CAS, sluttjek og opsummering.

28 kort: 5 diagnostiske, 6 mikroøvelser, 12 bankopgaver og 5 sluttjek. De 23 ikke-diagnostiske kort kræves for gennemført. CAS-noter, egne grafer og forklaringer vurderes særskilt. Alle trin kan åbnes frit. Bankmodul `ode.2` kræver `ode.1` ved filtrering på gennemførte moduler. Eksisterende opgaver, id'er og versioner er bevaret.

Kildedækning: eksempel 1 giver familie og begge begyndelsespunkter; bakteriemodellen forbinder værdi med hastighed; eksempel 3 og u6 giver eksakt vækstkonstant. Opgaver u1–u5 dækker familie, begyndelsesbetingelser, aftagelse og tekst til ligning. Befolkningsmodellen, to-punktsopgaven og skibsmodellen dækker logaritmer, modelvalg, enheder og CAS. Skibsopgavens fart er knob; facitarkets km/t er en enhedsfejl og bruges ikke. Tønden, figur, grundtjek og sluttjek er pædagogiske tilpasninger. Fuldstændighedsargumentet bruger produktreglen uden division med løsningen og bevarer nul-løsningen.

Lagring: `christian-matematik.ode.proportional.v1` og `christian-matematik.ode.proportional-notes.v1`. M1's `introduction.v1` er uændret. Kontoens resultater mærkes Modul 2 og linker til det relevante M2-trin. Ingen databaseændringer, nulstillinger eller genberegning af point.

Verifikation: `npm run test:ode` kontrollerer matematik, bankfilter, alle 28 svarkort, alle 12 bankopgaver, prøve/repetition, MathML, mobil, graf, noter/hints og bevarelse af M1. En lokal PostgreSQL-kompatibel fixture tester to konti og to enheder samt historiske resultater efter ændring af et korrekt svar. `npm test` dækker den samlede bank; `npm run build` bygger produktionsfilerne.

## Implementeret modul 3 · væksthastighed, tangent og linjeelement

M3 er åbent på `#differentialEquations/3/start` med ti trin: grundtjek, væksthastighed, tangent, linjeelement, interaktiv figur, opgaver uden hjælpemidler, mængde/hastighed i modeller, udvidet CAS, sluttjek og opsummering. Næste undervisningsgang er B8–9, ikke M4 direkte.

32 kort: 5 diagnostiske, 5 mikroøvelser, 17 bankopgaver og 5 sluttjek. De 27 ikke-diagnostiske kort kræves for gennemført. Egne noter, tegninger og mundtlige forklaringer vurderes separat. Bankmodulet `ode.3` kræver M1 og M2 ved filtrering på gennemførte moduler. De syv mål med præfiks `ode3.` dækker hældning, tangent, linjeelement, domæne, enheder, modeller og CAS.

Kildedækning: alle fire opgaver uden hjælpemidler fra ark 3 er med. De elleve opgaver med hjælpemidler er med som kaniner (begge forsøg), græs, koncentration, verdensbefolkning, bil, infusion, beton, variabel koefficient, havkat, trigonometri og Mexico. De brede CAS-modeller er bevaret og tydeligt mærket som udvidelser ud over M2-formlen. Den senere systematiske teori om forskudt vækst forbliver i M5. Forskrifter, parenteser og eksponenter er læst fra DOCX-filens Office Math, ikke kun flad tekst. Den alternative kaninforskrift og den alternative Mexico-potensform i facit gengives ikke; de korrekte eksponentialformer er kontrolleret uafhængigt. Den variable koefficient giver hele parentesen `(ln(x)+4)` ganget med argumentet.

Figuren viser punkt, tangent og linjeelement for tre ligninger. Den lineære model kan også vise sin analytiske løsningskurve. Ugyldige punkter ved kvadratrod/nævner giver forklaring og ingen falsk tangent. En tangent fremstilles ikke som en hel løsning.

Lagring: `christian-matematik.ode.local.v1` og `christian-matematik.ode.local-notes.v1`. Historik mærkes Modul 3 med korrekt rute. Tidligere M1- og M2-nøgler og opgaveversioner er uændrede.

Tests: `tests/ode-local.test.js` kontrollerer de faktisk renderede MathML-forskrifter ved uafhængige afledte, begyndelsesværdier, modelberegninger, inverse problemer, maksimum og numerisk integration af bilens hastighed. Browsertesten gennemfører alle 32 kort og 17 bankopgaver, prøve/repetition, alle ruter, mobil, domænegrænser, tastatur og noter/hints. Kontotesten bruger midlertidig lokal database og to brugere/enheder og kontrollerer adskilt fremdrift, vedvarende historik og M1. M1/M2-browserregression og samlet `npm test` køres før udgivelse.

## Implementeret B-repetition 8–9 · logaritmer og binomialfordeling

To uafhængige spor på `#differentialEquations/repetition/start`. Otte sider: separate starttjek, logaritmeteori, logaritmeopgaver, binomialteori, interaktiv sandsynlighedsfigur, binomialopgaver, separate sluttjek og opsummering/noter.

Der er 30 kort. Hvert spor har tre diagnostiske kort, tre mikroøvelser, seks bankopgaver og tre slutkort. Et spor kræver alle tre slutkort og enten alle tre startkort eller alle ni træningskort. Begge spor skal være gennemført for at fuldføre undervisningsgangen. En forkert redigering fjerner kun gennemførelsen, hvis den nuværende besvarelse ikke længere opfylder nogen af de to veje. Den anden spors status påvirkes ikke. Historiske point og resultater bevares.

B8 dækker ln og titalslogaritme, inverse funktioner, produkt/kvotient/potens, positive argumenter, falske summeringsregler, eksponentialligninger, forkastede algebraiske kandidater og halveringstid. B9 dækker faste uafhængige forsøg, konstant sandsynlighed, kombinationstal, præcis/højst/mindst, inklusive intervaller, middelværdi, varians, spredning og kritisk modelvurdering. Figuren viser sandsynlighedsmasser og valgte hændelser inklusive randtilfældene nul og én. Forklaringer og værktøjsnoter vurderes separat.

Kildegrundlaget er læseplanens angivelse af emnerne den 30/10/2026. Der findes ikke et lokalt særskilt B8–9-ark; indhold og opgaver er derfor egne tilpasninger. Binomialfordelingen præsenteres som et selvstændigt repetitionsspor, ikke som en differentialligningsmetode.

Bankmodul `ode.repetition` har ingen modulforudsætninger: sporene er diagnostisk styret. Tolv version 1-opgaver er tilføjet med præfikset `odeb.` og otte mål. Lagring bruger `christian-matematik.ode.review.v1` og `christian-matematik.ode.review-notes.v1`. Kontoens historik mærkes B-repetition 8–9; den blandes ikke sammen med integralrepetition eller Normalfordelings B10–11. Ingen eksisterende data eller opgaveversioner ændres.

Verifikation: binomiale masser kontrolleres mod eksplicit enumeration af Bernoulli-følger; totalmasse, middelværdi, varians, randtilfælde, intervalgrænser og logaritmeløsninger kontrolleres uafhængigt. Begge gennemførelsesveje testes og redigering prøves særskilt. Browserforløbet dækker alle 30 kort, alle 12 bankopgaver, prøve/repetition, tastaturgenveje, figuren, MathML, mobil og lagring. Kontotesten dækker to brugere/enheder, korrekt historikmærkning, noter, hints og bevarelse af tidligere resultater.

## Modul 4 · Hældningsfelt og numerisk løsning

M4 har ni trin: start, felt, hastighedsgraf, numerisk, udforsk, øvelser, modeller, sluttjek og opsummering. Fire diagnostiske spørgsmål, fire mikroøvelser, 13 bankopgaver og fire sluttjek giver 25 kort; 21 er obligatoriske. Alle seks opgaver uden hjælpemidler og fem med hjælpemidler fra ark 4 er med. De to ekstra bankopgaver om Euler og numerisk kontrol er mærkede supplementer. Originale skitse- og hastighedsfigurer er medtaget som seks PNG-udsnit; selve kildearkene publiceres ikke. Skitser vurderes særskilt, ikke automatisk.

Den interaktive figur viser fem modeller, valgfrit begyndelsespunkt, tre Euler-skridtlængder pr. model og en finere RK4-reference. Begge kurver er tydeligt numeriske. Beregningen stopper ved ugyldigt domæne eller for store værdier frem for at opfinde en fortsættelse. Cellemodellen er kontrolleret mod en uafhængig eksakt løsning. Sinusopgaven bruger sinus til hele summen, kontrolleret i Office Math. Karrets grænse gælder udviklingen fra tomt kar og er ikke en øvre grænse for alle begyndelsesværdier.

Svar og hints bruger `christian-matematik.ode.field.v1`; noter bruger `christian-matematik.ode.field-notes.v1`. Kontoresultater registreres på Modul 4. Redigering af korrekt svar trækker aktuel gennemførsel tilbage, men sletter ikke historiske resultater. Bankens manuelt valgte gennemførte moduler forbliver uafhængige.

Verifikation: uafhængig numerisk kontrol af Euler, RK4, begyndelsesværdier, ligevægte, baglæns trin og domænestop; alle kort gennemført i browser og bank; prøvetilstand, noter, hints, mobil, MathML, navigation og kontosynkronisering mellem to enheder med brugeradskillelse.

## Modul 5 · Forskudt eksponentiel vækst

M5 har elleve trin med ligevægt, løsningsfamilie, begyndelsespunkt, parameterbestemmelse, interaktiv figur, opgaver, modeller, udvidede anvendelser og sluttjek. Fem startspørgsmål, fem mikroøvelser, 13 bankopgaver og fem sluttjek giver 28 kort; 23 er obligatoriske. Alle fem opgaver uden hjælpemidler og otte med hjælpemidler fra ark 5 indgår. Den oprindelige grafmatch-figur er medtaget som PNG-udsnit.

Teorien begrunder familien ved forskydningen z = y − a/b og kontrollerer ved differentiation. Den konstante løsning bevares. Tilfældene b = 0 og b < 0 adskilles fra den stabile ligevægt ved b > 0. Parameterbestemmelse bruger afstandene til ligevægten og kræver et positivt forhold. Figuren viser opvarmning, afkøling, ligevægt, tangent og halvering af afstanden.

Arkets Mexico-model har en tidsafhængig koefficient og er tydeligt markeret som en anden modeltype med referencefelt og kontrolleret analytisk kurve. Badekarrets minimumstilførsel er kontrolleret over hele tidsintervallet og mod lidt mindre/større tilførsel. Boldens afstand findes ved integration og sammenholdes med bassinets dybde. Barnets højde anvendes kun inden for kildens 0–48 måneder. Numeriske svar bruger uafrundede parametre.

Lagring: `christian-matematik.ode.shifted.v1` og `christian-matematik.ode.shifted-notes.v1`. Kontoresultater hører til Modul 5. Prøvetilstand og bankens manuelle modulvalg følger fællessystemet. Kontrollen omfatter uafhængigt evalueret MathML, numeriske afledte, begyndelsesbetingelser, måledata, integral, modelinterval og minimumsbetingelse samt browser- og kontotest.

## Modul 6 · Logistisk vækst

M6 følger ark 6 med alle tre opgaver uden hjælpemidler og otte med hjælpemidler samt de gennemregnede eksempler. Elleve undervisningstrin indeholder fem diagnostiske spørgsmål, fem mikroøvelser, 11 bankopgaver og fem sluttjek: 26 kort i alt, hvoraf 21 er obligatoriske. Den samlede afsluttende opsamling er implementeret efter M6, se nedenfor.

Teorien forbinder y′ = ay(M − y) med r = aM, begrunder familien ved u = M/y − 1 og bevarer nul- og M-løsningerne. Kravet 0 < y < M adskilles fra differentialligningens andre løsninger. Maksimal væksthastighed aM²/4 ved M/2 kontrolleres i det relevante tidsinterval, herunder begyndelsesværdier over M/2. Den interaktive figur kobler løsningskurven med hastighedsparablen, ligevægte, start over grænsen og proportional sammenligning.

Den positive modelgren stopper matematisk ved nævnerens nulpunkt bagud i tid. Parameterbestemmelse, to mulige mængder ved en oplyst hastighed, ikke-nul begyndelsestid og enheder behandles eksplicit. Fortjenesten i gødningsopgaven kontrolleres i alle stationære punkter inden for 0–1000 kg samt begge endepunkter. En referencegraf kan åbnes efter elevens egen skitse.

Kildekontrol: Griseopgavens differentialligning angiver a = 0,000193 og M = 139,6. Derfor er eksponentkoefficienten 0,0269428. Arkets facit 0,026524 passer ikke og er ikke videreført. Bakteriesuppens mindste rod bevares uafrundet; C = 3 + 2√2 i formen med x − 40.

Svar/hints gemmes i `christian-matematik.ode.logistic.v1`, noter i `christian-matematik.ode.logistic-notes.v1`, og historiske resultater hører til Modul 6. Verifikation omfatter uafhængig evaluering af de viste MathML-forskrifter, numeriske afledte, begyndelsesbetingelser, alle kildeopgaver, inverse værdier, ligevægte, maksimum og fortjenestens globale maksimum på intervallet. Browser- og kontotest kontrollerer alle kort, bank og prøve, mobile ruter, kontosynkronisering, brugeradskillelse og bevaret historik.


## Forløbsafslutning

Seks trin på `/opsamling/start`, `/overblik`, `/uden`, `/med`, `/sluttjek` og `/opsummering` samler M1–M6. Seks diagnostiske spørgsmål, 12 nye blandede bankopgaver og seks sluttjek giver 24 kort. De 18 opgaver og sluttjek er obligatoriske; startspørgsmålene er diagnostiske. Seks faglige områder viser hver tre kontroller og målrettede links tilbage til undervisningen. Binomialfordelingen afsluttes i B-repetitionens eget spor.

Opgaverne træner løsningskontrol på et interval, eksponentielle modeller, lokal hældning og tangent, numeriske trin, forskudt vækst og logistisk vækst. Seks opgaver er uden hjælpemidler og seks med. Metodeoversigt, hints, feedback, løsningsforslag, dokumentationsnoter og egenvurdering følger de eksisterende moduler. Materialet er egenproduceret repetition, ikke et officielt eksamenssæt. Prøvesæt i den fælles bank skjuler feedback indtil aflevering og kan blande alle emnets opgaver.

Lagring bruger `christian-matematik.ode.finish.v1` og separate noter. Aktuel gennemførelse kræver alle 18 obligatoriske kort korrekte og går tilbage til I gang, hvis et korrekt svar ændres. Historiske resultater og tidligere modulers status bevares. Kontoresultater benævnes Opsamling. Der er ingen databaseændringer.

Verifikation: uafhængige matematiske beregninger, bankfiltrering og gennemførselslogik i enhedstests; browserkontrol af alle 24 kort og 12 bankopgaver, prøvetilstand, slutnavigation, målrettet repetition, mobilbredde, MathML og labels; kontotest med genindlæsning, anden enhed, brugeradskillelse og bevarelse af historik og M1.
