# Normalfordeling og statistisk analyse · modul 1–3 og B10–11

## Kilder og afgrænsning

Læst før implementering: `Pensum/Læseplan.pdf` (især side 2–3), `Pensum/Undervisningsbeskrivelse.pdf` (side 5), alle fem Word-ark under `Pensum/5. Normalfordeling`, alle otte medfølgende Excel-filer samt appens navigation, integralforløb, differentialligningsforløb, opgavekontrakt og kontolagring. Word-tekst, matematik i Office Math og indlejrede figurer indgår i kildekontrollen. Originalerne er kun læst. Data er transskriberet i `normal-data.js` med kildefil, ark, kolonnenavne og alle numeriske rækker.

Modul 1–3 og B10–11 er implementeret. Modul 4–5 og opsamlingen er eksplicit planlagte. B-repetitionen ligger mellem modul 3 og 4 og tæller som den sjette undervisningsgang, uden et normalmodulnummer. Opsamlingen er en separat afsluttende side og er ikke en syvende undervisningsgang.

## Notationskontrol og kildefund

- Arkene skriver normalfordeling med middelværdi først og **spredning som anden parameter**. Det fremgår af de eksplicitte sigma-angivelser, tæthedsfunktionen i ark 1 og facit, eksempelvis ark 1 opgave 2: middelværdi 12, spredning 1,2 og areal fra 7 til 11 cirka 0,20. En varianskonvention ville give et andet resultat. Appen bruger konsekvent denne spredningskonvention. Semikolon mellem parametrene undgår sammenblanding med dansk decimalkomma.
- Populationsspredning og stikprøvespredning er forskellige. Rumfang har 100 værdier, gennemsnit 0,98492 liter, populationsspredning cirka 0,055242 og stikprøvespredning cirka 0,055520. Ark 4 angiver 0,0555 og peger dermed på stikprøvespredning ved estimering. Det følges i Modul 4; modellens sigma er stadig en modelparameter.
- Ark 2 arbejder også med normale udfald (to spredninger fra centrum) og exceptionelle udfald (uden for tre spredninger), inklusive grænsetilfælde. Disse opgavetyper skal med, selv om de ikke fylder i den foreløbige prompt.
- Ark 3 indeholder ikke kun kendte fraktiler og symmetri: en tæthedsbetingelse giver to mulige middelværdier. Den kommer først efter grundlæggende parameterbestemmelse.
- Ark 4 anvender fraktilplot, qq-plot, estimering og efterfølgende modelberegning. Højde-opgave 3 er et negativt eksempel med systematiske afvigelser; det må ikke behandles som normalfordelt automatisk.
- Ark 5 begynder med lineær regression, residualer, residualplot, residualspredning og normalvurdering af residualer før konfidensintervaller. Også omformede modeller med reciprok respons og kvadreret respons er med i arket og skal indgå efter grundidéen.
- Ark 5 betegner regressionshældningen med a og viser et interval skrevet som a minus/plus en fejlmargin. I Modul 5 skal beregnet a og den underliggende populationshældning forklares særskilt. Gentagne stikprøvers dækningsfrekvens er grundlaget for den korrekte intervalfortolkning. Arkets enkelte formulering om »95 % sikkerhed« må ikke omformes til en sandsynlighed for en fast parameter efter beregningen.
- Ingen af de fem ark fastlægger et bestemt statistikprogram eller entydige kommandonavne. Værktøjsvejledning skal derfor dokumentere den matematiske operation, input, output, enheder og konklusion; et bestemt CAS-produkt opfindes ikke.
- Ark 1 skifter fejlagtigt mellem nikkel og fosfor i samme eksempel. Appens valgte beregningsopgaver bruger de entydige mælke-, øl- og ægeksempler. Originalarket ændres ikke. Modelantagelsen om uafhængighed tilføjes eksplicit ved produktet for alle 20 kartoner.
- Undervisningsbeskrivelsen henviser til separate bevisfotokopier. De er ikke identificeret som fuldt dækket af disse fem ark. Appens korte areal- og symmetribegrundelser er egne forklaringer, ikke påståede gengivelser af de fotokopier.

## Datasætkontrol

| Ark1 fra kildefil | Antal observationer/par | Anvendelse |
| --- | ---: | --- |
| Eksempel 1. Gulerødder.xlsx | 400 | Modul 1: modelandel kontra målt andel; Modul 4: positivt ploteksempel og estimation |
| Opgave 1. Rumfang.xlsx | 100 | Modul 4: normalplot, estimater, over én liter |
| Opgave 2. Højde.xlsx | 40 | Modul 4: omtrent retlinjet plot |
| Opgave 3. Højde.xlsx | 200 | Modul 4: systematiske afvigelser, afvis normalantagelse |
| Eksempel 1. Korndata.xlsx | 56 | Modul 5: år 1961–2016, regres med år efter 1961 og kornproduktion |
| Opgave 1. Blomsterdata.xlsx | 100 | Modul 5: bredde/længde og positivt interval |
| Opgave 2. phillip.xlsx | 18 | Modul 5: arbejdsløshed/inflation; interval indeholder nul |
| Opgave 3. Unibrew.xlsx | 106 | Modul 5: produktionsmængde/tid, positivt interval |

Gulerødder: gennemsnit 400,432 g; stikprøvespredning 9,481107768 g; 121 af 400 er under 396 g. Målt andel er 0,3025; en foreløbig normalmodel med disse estimater giver cirka 0,3201. Forskellen er tilsigtet undervisning i model kontra data; normalantagelsen undersøges først i Modul 4.

## Tidligere kombinatorik og binomialfordeling

Appens differentialligningsforløb har kun en **planlagt** B8–9-side om logaritmer og binomialfordeling. Den fælles opgavebank har ikke et færdigt kombinatorik- eller binomialmodul. De to kernestofområder er derfor ikke allerede tilstrækkeligt dækket. De skal udvikles i den eksisterende planlagte B8–9-repetition, så der ikke kommer dobbeltundervisning her. Modul 1 giver nødvendig grundhjælp om sandsynlighed og uafhængighed og en kort bro: kontinuert rumfang kontra diskret antal over en grænse. Dette er ikke en påstand om fuld binomialdækning.

## Navigation og progression

Ruter følger appens eksisterende hash-navigation: `#normalDistribution` er oversigten; `#normalDistribution/1` kanoniseres til `#normalDistribution/1/start`; øvrige sider er `/2`, `/3`, `/repetition`, `/4`, `/5` og `/opsamling`. Modul 1 har otte direkte adresserbare trin: start, model, taethed, fordeling, vaerktoej, oevelser, sluttjek og opsummering. Alle trin har forrige/næste og adgang til oversigten. Sidste trin i Modul 1 fører til Modul 2. Første trin i Modul 2 kan gå tilbage til sidste trin i Modul 1; sidste trin går til Modul 3/start. Modul 3 har ni trin, og sidste trin går videre til den særskilte B-repetition med 11 trin. Browserens tilbage/frem virker. Modul 4–5 udvikles i senere beskeder.

Status baseres på svar: Modul 1 har 10 mikroøvelser + 12 opgaver + 5 slutspørgsmål = 27 obligatoriske kontroller. Modul 2 har 11 mikroøvelser + 15 opgaver + 6 slutspørgsmål = 32 obligatoriske kontroller. Modul 3 har 12 mikroøvelser + 16 opgaver + 7 slutspørgsmål = 35 obligatoriske kontroller. Starttjekkets 10 spørgsmål i Modul 1 og 8 spørgsmål i hvert af Modul 2–3 er diagnostiske. Åbning af siden gennemfører intet. Ændring af et korrekt svar ophæver dets aktive kontrol og eventuel gennemført modulstatus, som i de andre nye moduler. Personligt historikoverblik bevarer tidligere korrekte løsninger efter det fælles system.

Modul 1-svar, kontroller og hinttrin bruger `accountStorage` under `christian-matematik.normal.introduction.v1`; værktøjsnoter bruger `christian-matematik.normal.notes.v1`. Begge synkroniseres gennem eksisterende konto/API og følger brugerens profil. Lokal preview bruger kun lokal lagring. Korrekte løsninger tilknyttes emnet Normalfordeling i det personlige overblik. Ingen ny anonym import eller særskilt progressionsdatabase.

## Fagligt og teknisk design

`normal-plan.js` og `normal-routes.js` ejer mål og navigation; `normal-content.js` ejer de korte undervisningsafsnit; `normal-lesson.js` binder de eksisterende øvelseskomponenter til progression; `normal-math.js` og `normal-graphs.js` ejer beregninger og figurer; `normal-data.js` bevarer dataafskrifterne; `tasks/bank/normal.js` er den fælles bankpakke. Der er ingen nye produktionsafhængigheder.

Sandsynligheder beregnes fra normalfordelingens tæthed med adaptiv Simpson-integration og direkte haleberegning; fraktiler findes med bisektion og fremadrettet kontrol. Den farvede polygon bruger samme tæthed og grænser; numerisk arealkontrol sammenligner polygonens trapezareal med den viste sandsynlighed. Ved otte spredninger er det udeladte visuelle haleareal under 0,0000000000000013 og påvirker ingen af de fire viste decimaler. Figurteksten forklarer de fortsættende haler. En omvendt grænserækkefølge giver en synlig fejl og skjuler grafen frem for at vise et misvisende positivt areal.

Alle matematiske udtryk vises som MathML. Valgmuligheder vises med fuld typografi ved siden af neutrale HTML-select-valg. Figurer er SVG med titler, dynamiske beskrivelser, tekstresultater og indbyggede tastaturstyrede kontroller. Der er tekstlige forklaringer også uden interaktion.

## Læringsmålmatrix

U1–U7 og K1–K6 følger samtlige relevante mål og kernestofpunkter på undervisningsbeskrivelsens side 5. A-mål konkretiserer læseplan og opgaveark; B-mål er den særskilte repetition. Kontroller i ikke-implementerede moduler er planlagte.

| Læringsmål | Introduceres | Øves | Kontrolleres | Hjælpemidler | Datasæt/eksempel |
| --- | --- | --- | --- | --- | --- |
| U1 · Statistiske og sandsynlighedsteoretiske modeller til beskrivelse af data | 1: model og måling | 1: mælk, øl, data; 2: fiskefoder; 3: fosfor, kaffe og olie; 4–5 (planlagt) | 1–3: modelopgaver og sluttjek; 4–5 og opsamling (planlagt) | Begge | Mælk; Gulerødder |
| U2 · Værktøjsprogrammer, symbolbehandling og problemløsning | 1: normalberegning og fraktil | 1–3: værktøjsopgaver; B10–11: algebraisk kontrol; 4–5 (planlagt) | 1–3 og B10–11: tal og valg kontrolleres; egne værktøjsnoter vurderes med tjekliste | Med | Øl, mælk; senere alle otte regneark |
| U3 · Matematiske ræsonnementer og beviser | 1: symmetri og enkeltværdi | 1: areal og komplement; 2: skala og grænser; 3: symmetri og kontrol; B10–11: identiteter og ligninger | 1–3 og B10–11: sluttjek og ræsonnementsopgaver; 4–5 (planlagt) | Begge | Arket: eksempel 3 og u4; egne korte begrundelser |
| U4 · Matematikanvendelse | 1: enheder og modelantagelser | 1–3: tekst og data; B10–11: areal, priser og antal; 4–5 (planlagt) | 1–3 og B10–11: teksttunge opgaver; opsamling (planlagt) | Begge | Fyldemaskiner, gulerødder; korn og Unibrew |
| U5 · Fagets metoder og identitet | 1: model kontra observation | 1–3: metodevalg og modelbegrænsninger; B10–11: identitet, ligning og kontrol | 1–3 og B10–11: metodeopgaver; 4–5 (planlagt) | Begge | Modelandel kontra målt andel |
| U6 · Begreber og metoder fra diskret matematik | Tidligere B8–9 (kun planlagt); 1: uafhængige gentagelser | 1: alle 20 kartoner; B8–9 (planlagt) | 1: sandsynlighedsprodukt; kombinatorik/binomial kræver særskilt udvikling | Begge | Mælk: ark 1, eksempel 4 med hjælpemidler |
| U7 · Mindstekrav og grundlæggende færdigheder | 1: diagnostik og grundhjælp | Alle moduler; B10–11 | 1–3: mikroøvelser og sluttjek; B10–11: to separate start- og sluttjek; senere (planlagt) | Uden | Procent, funktioner, areal og ligninger |
| K1 · Kombinatorik | B8–9 skal udbygges; endnu ikke dækket | Planlagt binomialrepetition, uden dobbeltundervisning her | Planlagt separat kontrol; ingen fuld dækning endnu | Begge | Antal placeringer af succeser i gentagne forsøg |
| K2 · Stokastisk variabel | 1: før og efter måling | 1: mikroøvelse og bank | 1: sluttjek | Uden | En tilfældigt valgt mælkekarton |
| K3 · Binomialfordeling | B8–9 findes kun som plan; 1: kort begrebsbro | 1: alle 20 som særtilfælde; fuldt forløb i B8–9 (planlagt) | 1: uafhængighed; binomialberegning kontrolleres senere | Begge | Antal kartoner over en grænse kontra rumfang |
| K4 · Normalfordeling | 1: klokkeform og parametre | 1–4 | 1–3: begreb, areal, standardisering og parametre; senere (planlagt) | Begge | Gødning, mælk og øl |
| K5 · Opgaver uden hjælpemidler | 1: symmetri og notation | 1–5 og B10–11 | 1–3 og B10–11: slutspørgsmål; senere (planlagt) | Uden | Ark 1: eksempel 3 og u4 |
| K6 · CAS og statistikværktøjer | 1: model, input, output og konklusion | 1–3: beregning/fraktil og parametre; 4–5 (planlagt) | 1–3: talfelter; dokumentation ved egen vurdering | Med | Arket angiver ikke et bestemt program eller kommandonavn |
| A1 · Tæthed, sandsynlighed og enkeltværdi | 1: tæthed og areal | 1: graf og mikroøvelser | 1: density-opgave og sluttjek | Begge | Gødning: tæthed kan overstige én |
| A2 · Fordelingsfunktion, haler, interval og fraktil | 1: opsamlet areal | 1: graf, aflæsning, regning og invers; 3: parameterbetingelser og intervalgrænse | 1: cdf-, tails- og quantile-opgaver; 3: halevalg og intervalgrænse | Begge | Arket: eksempler med og uden hjælpemidler |
| A3 · Middelværdi og spredning; ens notation | 1: placering og bredde | 1–4; 3: ukendte parametre | 1: graf/parameter; 3: parameteropgaver og sluttjek; 4 (planlagt) | Begge | Anden parameter er spredning; Rumfang bruger stikprøvespredning |
| A4 · Standardisering og oprindelig skala | 2: graf, skalaændring og to regneretninger | 2: mikroøvelser, sammenligning og data; 3: parameterligninger | 2–3: mikroøvelser, bank og sluttjek; opsamling (planlagt) | Begge | Fiskefoder og flødeboller |
| A5 · Normale og exceptionelle udfald | 2: centrale arealer og materialets grænser | 2: intervaller, figurer og grænsetilfælde; 3: tungmetal; 4–5 (planlagt) | 2: mikroøvelser, bank og sluttjek; 3: tungmetal; 4–5 (planlagt) | Begge | Ark 2–5; følg materialets grænsekonvention |
| A6 · Parameterbestemmelse og kontrol af muligheder | 3: kendte og ukendte, areal og tæthed | 3: én/to parametre, kontrol og to tæthedsløsninger; B10–11 støtter algebra | 3: 12 mikroøvelser, 16 bankopgaver og 7 slutspørgsmål; opsamling (planlagt) | Begge | Olie, te, kaffe; tæthedsbetingelse med to løsninger |
| A7 · Data, population, stikprøve og estimat | 1: begrebsskel; 4: beregninger | 1: Gulerødder; 3: givne modelplaceringer; 4: alle fire datasæt | 1 og 3: data-/modelopgave; 4 (planlagt) | Begge | 400, 100, 40 og 200 målinger |
| A8 · Normalfordelingsplot og forsigtig modelvurdering | 4 | 4: ret linje, krumning og outliers | 4 og opsamling (planlagt) | Aflæsning uden; egne plot med | Gulerødder, Rumfang og begge Højde-ark |
| A9 · Regression, residualer og residualspredning | 5 før intervalberegning | 5: også normalplot af residualer | 5 (planlagt) | Begge | 56 kornår; 100 blomsterpar; 18 Phillipsår; 106 Unibrew-par |
| A10 · Stikprøvevariation, hældningsestimat og konfidensinterval | 5 | 5: fortolkning, nul og antagelser | 5 og opsamling (planlagt) | Med; fortolkning uden | Blomster, Phillipsdata og Unibrew |
| A11 · Omformede regressionsmodeller | 5 efter lineær grundidé | 5: reciprok respons og kvadreret respons | 5 (planlagt) | Med | Ark 5: eksempel 2 og opgave 4 |
| B10 · De tre kvadratsætninger og faktorisering | B10–11: eget diagnostisk spor | 4 mikroøvelser og 8 bankopgaver; direkte sluttjek ved bestået starttjek | 4 slutkort plus starttjek eller træning | Uden; værktøjskontrol i anvendelse | De tre regler, faktorisering, modeksempel og terrasseareal |
| B11 · To ligninger med to ubekendte | B10–11: separat diagnostisk spor | 6 mikroøvelser og 8 bankopgaver; direkte sluttjek ved bestået starttjek | 5 slutkort plus starttjek eller træning; kontrol i begge ligninger | Uden; værktøj som kontrol | Linjer, kvitteringer, billetter og parameterbro |

## Verifikation af første arbejdsgang

49 faglige/enhedstests og den selvstændige kontotest består. Hele browserpakken med 13 testforløb består, herunder alle tidligere sider og de 91 integralbankopgaver. Den udvidede kontobrowsertest består med normalfordelingssvar, korrekt emne/modul/rute i historikken, noter, genindlæsning, en anden enhed og en anden bruger.

Modul 1 er kontrolleret i Chrome med alle 37 kort, alle 27 obligatoriske kontroller, målrettet feedback, trinvis hints, forrige/næste, direkte ruter, browserhistorik, planlagte sider, MathML-struktur, numerisk grafareal, haler, omvendt beregning, tastatur og 390-pixel mobilvisning. Ændring af et tidligere korrekt svar tilbagetrækker gennemført status. Blokeret og defekt lagring giver synlig besked. Den fælles bank er testet med alle 12 opgaver i træning samt skjulte hints/løsninger i prøve og genåbning af modulet fra prøveresultatet. Desktop- og mobilskærmbilleder er gennemset; browserforløbene rapporterer ingen JavaScript- eller konsolfejl. Statisk produktionsbuild består.

## Modul 2 · standardnormalfordelingen

Den anden arbejdsgang følger A4–A5 og de relevante U/K-mål. Ark 2 er læst med notation, tekst, figurer og facit. Opgavearkets konvention er afgørende: normalintervallet inkluderer to spredninger på hver side; exceptionelle udfald ligger **strengt uden for tre spredninger**. Præcis tre er ikke exceptionelt. Mellem to og tre findes dermed udfald uden for normalintervallet, som ikke er exceptionelle. Fiskefoder-eksemplet og facit til u5 bekræfter grænserne. Appen bruger ingen alternativ to-spredningsdefinition af exceptionelle udfald.

Den ekstra forklaring af standardisering følger rækkefølgen idé i almindelige ord → tal og graf → symbolforklaring → gennemregnet eksempel → mikroøvelse → sammensat opgave. Der skelnes mellem stokastiske variable og konkrete observationer, mellem oprindelig måleenhed og antal spredninger, mellem fortegn og sandsynlighed samt mellem at antage normalfordeling og at undersøge den. Et skævt datasæt bliver ikke normalfordelt ved standardisering. Standardnormalfordelingens parametre er middelværdi nul og spredning én efter samme parameterkonvention som Modul 1.

Modul 2 har otte trin: `#normalDistribution/2/start`, `/standard`, `/tilbage`, `/udfald`, `/sandsynlighed`, `/oevelser`, `/sluttjek` og `/opsummering`. Ruten `/2` kanoniseres til `/2/start`. En fælles modulrouter vælger de rigtige trin, bevarer alle gamle Modul 1-ruter og forbinder de to moduler uden at genopbygge deres øvelsesformularer. Oversigten viser begge modulers status og antallet gennemførte af de seks planlagte undervisningsgange. Senere sider er stadig planlagte.

### Opdeling og lagring

- `normal-standard-math.js`: notation, standardisering, omvendt beregning, klassifikation og beregnede figurdata.
- `normal-standard-graphs.js`: responsive og tastaturstyrede figurer med tilsvarende observationer, grænser, tæthedshøjder og samme sandsynlighedsareal på begge skalaer.
- `normal-standard-figures.js`: genoptegnede centrale arealer fra arkets u1 og u4, med tekstligt alternativ. Figuren fungerer i både undervisning og bank uden dublerede HTML-id'er.
- `normal-standard-content.js`, `normal-standard-exercises.js` og `normal-standard-lesson.js`: korte teori- og hjælpelag, diagnostik, eksempler, mikroøvelser, træning, slutkontrol og opsummering.
- `normal-lesson-support.js`: fælles indholdskomponenter og kontolagring af noter; Modul 1 bruger samme noteadapter med sit oprindelige namespace.
- `tasks/bank/normal-standard.js`: 15 version 1-opgaver i `norm.2` med `norm.1` som forudsætning. Alle eksisterende bank-id'er, opgaveversioner og Modul 1-lagringsformater er bevaret.

Modul 2 har 8 diagnostiske kort og 32 obligatoriske kontroller, altså 40 øvelseskort. Svar, kontrolflag og hinttrin gemmes under `christian-matematik.normal.standard.v1`; noter under `christian-matematik.normal.standard-notes.v1`. Korrekte løsninger registreres som Modul 2 i samme hovedemne og med en Modul 2-rute. Status kan aldrig blive gennemført ved åbning. En ændret korrekt besvarelse trækker den aktive status tilbage; historikoversigten beholder tidligere korrekte løsninger efter fælles regler. Noter og egne forklaringer bedømmes ikke automatisk.

### Kilde og opgavekort

| Bankopgave | Dækning | Kilde/tilpasning |
| --- | --- | --- |
| norm2.origin | Centrum nul og spredning én | Forklarende bro fra standardnormalbegrebet |
| norm2.distance | Fortegn og antal spredninger | Egen mikrostruktur, som forbereder fiskefoder og flødeboller |
| norm2.back | Observation ud fra relativ placering | Tilbageregning før fraktilopgaver |
| norm2.compare | Sammenlign forskellige skalaer | Egen opgave til A4 |
| norm2.ranges | Normalinterval og exceptionelle udfald | Ark 2, eksempel 2 uden hjælpemidler |
| norm2.fish-boundary | To og præcis tre spredninger | Ark 2, opgave 1a; ekstra grænsetilfælde |
| norm2.half-area | Symmetri og afrunding | Ark 2, u6 |
| norm2.read-two | Centrum/spredning fra 95,45 %-figur | Ark 2, u1, genoptegnet |
| norm2.read-one | Centrum/spredning fra 68,27 %-figur | Ark 2, u4, genoptegnet |
| norm2.fish-probability | Venstre hale via standardisering | Ark 2, opgave 1b |
| norm2.sweets | To højre haler og fortolkning | Ark 2, opgave 4 |
| norm2.interval | Begge grænser, samme areal | Ark 2, opgave 3 |
| norm2.quantile | Omvendt beregning, tilbage og kontrol | Ark 2, opgave 2 |
| norm2.model | Teksttung modelvurdering og metodevalg | Egen syntese med eksplicitte grænser og modelantagelser |
| norm2.data | Faktisk måling, estimater og relativ placering | Gulerødder.xlsx, Ark1 A2; model fra Modul 1 |

Arkets u2 og u3 genbruger symmetri og opsamlede arealer, der allerede er øvet i Modul 1; de centrale idéer gentages i teorien uden dubletter i den fælles bank. Afrundede tabelværdier markeres som tilnærmelser. Opgaven ud fra 68,27 % beder eksplicit om at bruge denne afrunding, så 34,135 % ikke udgives for en uafrundet beregning. Værktøjsopgaver bruger flere decimaler undervejs og en tolerance svarende til den efterspurgte slutafrunding.

### Verifikation af Modul 2

De faglige tests kontrollerer begge regneretninger, fortegn, to- og tre-spredningsgrænser, hele det mellemliggende område, centrale arealer, data og facit med selvstændige beregninger. På de to figurskalaer sammenlignes polygonernes integrerede arealer med hinanden og med sandsynligheden for alle tre områdetyper, inklusive decimalspredninger. Klassifikationen regner med en minimal flydende komma-margin i de oprindelige enheder, så eksempelvis 1,925 kg ved centrum 2 kg og spredning 0,025 kg ikke fejlagtigt bliver exceptionelt ved regneafrunding. Ugyldig spredning eller omvendte grænser giver hjælp og skjuler grafen.

Browserforløbet tester alle 40 kort og 15 bankopgaver, målrettet feedback for regne-, fortegns- og begrebsfejl, hints, direkte ruter, krydsnavigation, begge modulers uafhængige status og samlede fremdrift, noter, genindlæsning, gamle Modul 1-svar, MathML, tastatur, mobil, defekt og blokeret lagring samt prøvetilstand og repetition fra prøveresultatet. Kontotesten kontrollerer særskilt namespace, historikkens modul/rute, synkronisering til en anden enhed og isolation mellem brugere. Hele appens faglige tests, browserpakke og konto-/servertests køres før push og deployment.

Afsluttet validering: 56 faglige/enhedstests, den separate konto-/servertest, hele browserpakken med 14 forløb og den udvidede kontobrowsertest består. Begge moduler er testet på desktop og ved 390-pixel mobilbredde. Skærmbilleder af den dobbelte skala er gennemset. Browserforløbene rapporterer ingen JavaScript- eller konsolfejl. Produktionsbuild består.


## Modul 3 · beregning af middelværdi og spredning

Den tredje arbejdsgang implementerer A6 med fortsat træning af A2–A5, U1–U5, U7 og K4–K6. Ark 3 er gennemgået med tekst, Office Math, figurer og facit. Emnet er bestemmelse af **modelparametre fra givne betingelser**. Estimation af stikprøvens gennemsnit og spredning fra hele datasæt hører fortsat til Modul 4.

De ekstra teorilag bevares: idé i ord → klokke og opsamlet areal → kendte og ukendte → enkeltvis symbolforklaring → eksempel → mikroøvelse → sammensat opgave. Afsnittene »Det vigtigste at forstå« forklarer især tilstrækkelig information, positiv spredning, fortegn, symmetri, kontrol af begge betingelser og tæthed kontra areal. To ligninger introduceres efter én ukendt og lige store haler. Tæthedsligningen kommer sidst; CAS bruges til løsningen uden at kræve en ny manuel logaritmemetode. Materialet angiver intet bestemt CAS-program.

De ni adresserbare trin er `#normalDistribution/3/start`, `/oplysninger`, `/spredning`, `/middelvaerdi`, `/begge`, `/taethed`, `/oevelser`, `/sluttjek` og `/opsummering`. `/3` og ukendte trin kanoniseres til `/3/start`. Første trin går tilbage til Modul 2/opsummering; sidste trin går til B-repetitionens starttjek. De gamle Modul 1–2-ruter og lagringsnøgler er uændrede.

### Opdeling, figurer og lagring

- `normal-parameters-math.js` beregner venstre areal, én eller to ukendte parametre, mulige middelværdier fra en tæthed og numeriske figurdata. Ved centrum er en oplysning om halvdelen utilstrækkelig til at bestemme spredningen. Modstridende oplysninger afvises; en negativ spredning accepteres aldrig.
- `normal-parameters-graphs.js` viser fosfor, kaffe, olie og te med låste kendte parametre og tastaturstyrede ukendte. En beregnet model kan sammenlignes med hver oplyst sandsynlighed. Tæthedens blå flade gælder kun første grænses venstre areal, mens fordelingsgrafen viser alle betingelser. Sandsynligheder beregnes for hele halen, og polygonarealer kontrolleres numerisk.
- Tæthedslaboratoriet viser to klokker gennem samme punkt, én løsning ved maksimalhøjden og en forklaring uden graf ved en umulig højde. Tæthedshøjde og areal navngives særskilt; figuren giver aldrig kurvehøjden som et sandsynlighedssvar.
- `normal-parameters-figures.js` genoptegner arkets første fordelingsgraf med aflæsningerne 8/0,5 og 11/cirka 0,8413. Tekstligt alternativ og genbrug i bank og undervisning kræver ingen dublerede HTML-id'er.
- `normal-parameters-content.js`, `normal-parameters-exercises.js` og `normal-parameters-lesson.js` bruger de fælles indholds-, bedømmelses-, note- og progressionskomponenter.
- `tasks/bank/normal-parameters.js` tilføjer 16 version 1-opgaver i `norm.3` med `norm.1` og `norm.2` som forudsætninger. Alle tidligere opgave-id'er og versioner bevares.

Der er 43 øvelseskort: 8 diagnostiske, 12 mikroøvelser, 16 bankopgaver og 7 slutspørgsmål. De sidste 35 kontroller kræves for »Gennemført«. Svar, kontrolflag og hinttrin bruger `christian-matematik.normal.parameters.v1`; noter bruger `christian-matematik.normal.parameters-notes.v1`. De registreres som Modul 3 under Normalfordeling med ruten `/3/start`. Konto-API, synkronisering og personlig historik genbruges. Åbning gennemfører intet, en rettelse ophæver aktiv korrektstatus, og egne begrundelser/værktøjsnoter vurderes med tjeklister.

### Kilde og opgavekort

| Bankopgave | Dækning | Kilde/tilpasning |
| --- | --- | --- |
| norm3.information | Halvdelen ved centrum bestemmer ikke bredden | Egen begrebsbro til A6 |
| norm3.tail | Højre hale omsættes til venstre areal | Forberedelse til kaffens oplysning |
| norm3.relation | Vælg korrekt parameterligning | Ark 3, fosforeksemplet; fortegns- og tæthedsdistraktorer |
| norm3.read-cdf | Centrum og spredning fra fordelingsgraf | Ark 3, eksempel uden hjælpemidler, genoptegnet |
| norm3.sd | Ukendt spredning | Ark 3, fosfor: middelværdi 5 og 10 % under 2 |
| norm3.mean | Ukendt middelværdi og højre hale | Ark 3, kaffe: spredning 5 og 30 % over 500 |
| norm3.oil | Begge parametre og lige store haler | Ark 3, olie: 40 % under 90 og 40 % over 110 |
| norm3.asymmetric | To ligninger og afvisning af midtpunktmetoden | Egen teksttung udvidelse med forskellige ydre haler |
| norm3.keg | Spredning og ny sandsynlighed | Ark 3, opgave 3 |
| norm3.candy | Middelværdi, ny hale og uafhængige poser | Ark 3, opgave 4; uafhængighed angivet eksplicit |
| norm3.heavy | Udfaldsklasse, interval og separat oliemodel | Ark 3, opgave 5; modeller og enheder holdes adskilt |
| norm3.density | Tæthedsligning og to mulige middelværdier | Ark 3, opgave 6 |
| norm3.tea | Begge parametre og kontrol af begge haler | Ark 3, opgave 8 |
| norm3.interval-bound | Mellemområde omsættes til samlet venstre areal | Ark 3, opgave 2 |
| norm3.data | Givet observation/placering bruges til at genfinde modelspredning | Gulerødder.xlsx, Ark1 A2; foreløbig model fra Modul 2 |
| norm3.consistency | Modstridende betingelser kan ikke give en normalmodel | Egen metode- og modelkontrol |

Arkets opgave 7 indgår som ekstra gennemregnet spredningskontrol med middelværdi 15 og venstre areal 0,10 ved 6. Den enkle fraktil i opgave 1 og grundidéerne i u1–u4 (centrum, bredde, symmetri, normalinterval og opsamlet areal) er allerede dækket i Modul 1–2 og genbruges som forudsætninger uden at kopiere ensartede opgaver. Alle originale kildefiler er uændrede. Beregninger afrundes først i slutsvaret; tolerancer følger de efterspurgte decimaler.

### Verifikation af Modul 3

`tests/normal-parameters.test.js` kontrollerer genfinding af kendte parametre på tværs af fortegn, skalaer og haler; to asymmetriske betingelser; utilstrækkelig eller umulig information; tæthedens nul/én/to løsninger; numeriske arealer; alle facit med fremadrettede modelkontroller; afrunding, feedback, mål, forudsætninger, gamle opgaveversioner og ruter.

Browserforløbet gennemgår alle 43 kort og 16 bankopgaver, alle fire grafeksempler, tæthedslaboratoriet, fejlsvar, grundhjælp, hints, alle ni trin, forrige/næste, browserhistorik, MathML, tastatur, mobil, noter, genindlæsning, tilbagetrækning af gennemført status, tre uafhængige modulstatusser, gammel lagring, prøvetilstand og genåbning fra prøveresultatet. Kontoens browsertest er udvidet med Modul 3-svar, korrekt modul/rute i historikken, separate noter, anden enhed og isolation mellem brugere.

Afsluttet validering: alle 63 faglige/enhedstests, den separate konto-/servertest, alle 15 browserforløb og den udvidede kontobrowsertest består. De tre moduler er testet uafhængigt og sammen; alle 249 bankopgaver kan instansieres efter kontrakten. Desktop- og 390-pixel mobilfigurer er gennemset, og browserforløbene rapporterer ingen JavaScript- eller konsolfejl. Produktionsbuild og `git diff --check` består.


## Virtuel repetition B-niveau 10–11

Læseplanens side 3 placerer kvadratsætninger og to ligninger med to ubekendte fredag den 6. november 2026 mellem Modul 3 og 4. Der findes ikke et særskilt B10–11-opgaveark i de lokale kilder. Indholdet er derfor egne forklaringer, tabeller, visualiseringer og opgaver inden for de to angivne emner. Undervisningsbeskrivelsens mål om symbolbehandling, ræsonnement, anvendelse, metoder og mindstekrav understøttes. B-repetitionen er stadig unummereret og en selvstændig undervisningsgang; den er ikke et nyt normalfordelingsmodul. Originalfilerne er uændrede.

B10 forklarer først hele parentesen som et produkt og et kvadrat som fire delarealer. Symbolerne forklares enkeltvis, det dobbelte produkt udledes, og en mikroøvelse følger. Først derefter kommer de to andre kvadratsætninger, fortegn, faktorisering og generel identitetskontrol. Et modeksempel kan afkræfte en påstået identitet; ét matchende tal kan ikke bevise den. Valgopgaver kræver faktisk en faktoriseret form; koefficientfelter kræver de udvidede led og accepterer ikke blot den oprindelige parentes som en ækvivalent omskrivning.

B11 begynder med et fælles par og to linjer. Substitution forklares som erstatning med et helt udtryk; elimination som kombination af hele ligninger. Skalering kommer efter den enkle addition, og alle led samt højresiden ganges. Metodevalg følger begge grundmetoder. Dernæst undersøges én/ingen/uendeligt mange løsninger og modeller fra kvitteringer, billetter og en parameterbro til Modul 3. Determinanter indgår alene i figurens interne beregning og introduceres ikke som undervisningsmetode.

### Navigation og to uafhængige gennemførelsesveje

De 11 trin er `#normalDistribution/repetition/start`, `/kvadrater`, `/fortegn`, `/faktorisering`, `/loesningspar`, `/substitution`, `/elimination`, `/metode`, `/oevelser`, `/sluttjek` og `/opsummering`. `/repetition` og ukendte trin kanoniseres til `/repetition/start`. Første trin går tilbage til Modul 3/opsummering, og sidste trin går til den planlagte Modul 4-side. Tilbage fra Modul 4 går nu til repetitionens sidste trin. Forrige/næste, browserhistorik, tastaturfokus og forløbsoversigt følger den fælles router. Navigation og fremdrift bruger betegnelsen B-repetition 10–11, aldrig »Modul repetition«.

| Spor | Starttjek | Træning | Sluttjek | Gennemført |
| --- | ---: | ---: | ---: | --- |
| B10: kvadratsætninger | 4 kort | 4 mikroøvelser + 8 bankopgaver | 4 kort | Hele sluttjekket og enten hele starttjekket eller hele træningen |
| B11: to ligninger | 4 kort | 6 mikroøvelser + 8 bankopgaver | 5 kort | Hele sluttjekket og enten hele starttjekket eller hele træningen |

Der er i alt 43 kort. Den fulde træningsvej kræver 35 korrekt kontrollerede kort; genvejen kræver de 8 startkort og 9 slutkort. Sporene bedømmes separat: et godt B10-resultat må ikke skjule et hul i B11. Et sluttjek uden bestået starttjek eller fuld træning gennemfører intet. Starttjekket kan også tages igen efter træning. Alle sider er åbne fra start, og direkte sluttjekknapper flytter fokus til det valgte spor.

Begge spor skal være gennemført, før hele undervisningsgangen tæller med i de seks undervisningsgange. Status udledes af kontrollerede svar, uden særskilte »spring over«-flag eller sidebesøg. Ændring af et nødvendigt slutkort ophæver sporets aktive status. Ændring af et startkort ophæver genvejen, hvis træningsvejen ikke samtidig er opfyldt. Rettelser i valgfri træning ophæver ikke en stadig gyldig genvej. Egen forklaring og værktøjsdokumentation vurderes med tjeklister og udgives ikke for at være automatisk bedømt.

### Filer, lagring og visualiseringer

- `normal-algebra-math.js` leverer koefficienter, delarealer, ligningsnotation, løsningstype, parkontrol og linjestykker klippet til koordinatsystemet. Lodrette og vandrette linjer understøttes også.
- `normal-algebra-graphs.js` viser fire præcise delarealer og to lige store rektangler. Positive sidelængder er en betingelse for arealmodellen; identiteterne gælder generelt for reelle tal. Linjefiguren bruger samme skala på begge akser og viser hver oprindelig ligning, det foreslåede par og begge venstresider. Eksemplerne dækker skærende, parallelle og sammenfaldende linjer. Tekstresultaterne giver samme faglige information som figurerne.
- `normal-algebra-content.js`, `normal-algebra-exercises.js` og `normal-algebra-lesson.js` bruger de fælles teori-, øvelses-, feedback- og notekomponenter. Vanskelige punkter har »Det vigtigste at forstå«. Hints åbnes trinvis.
- `tasks/bank/normal-algebra.js` bidrager med 16 version 1-opgaver i `norm.repetition`, med 14 konkrete mål. Algebrarepetitionen kræver ikke gennemførte normalmoduler; bankens forudsætningsliste er tom. Modulfilteret medtager kun opgaverne, hvis repetitionen vælges som gennemført, når dette filter er aktivt.

Svar, kontrolflag og hints gemmes under `christian-matematik.normal.algebra.v1`; noter under `christian-matematik.normal.algebra-notes.v1`. Kontoens eksisterende API og historik anvendes. Historikken viser B-repetition 10–11 i Normalfordeling med en `/repetition/…`-rute. Namespace og etiket er adskilt fra integralforløbets B6–7-repetition. Gamle normal-, integral- og opgavebankversioner er bevaret.

### Opgavekort og kildeafgrænsning

| Bank-id | Dækning |
| --- | --- |
| b1011.plus | Første kvadratsætning og alle blandede produkter |
| b1011.minus | Anden kvadratsætning og positive sidste kvadrat |
| b1011.conjugate | Tredje kvadratsætning og ophævede mellemled |
| b1011.factor-plus | Genkend hele mønstret i et sumkvadrat |
| b1011.factor-minus | Faktorisering med koefficienter og negativt mellemled |
| b1011.factor-difference | Forskel mellem kvadrater som produkt |
| b1011.error | Fejlfinding, identitet og modeksempel |
| b1011.area | Tekst- og tabelopgave om terrasseareal, enheder og manglende blandede led |
| b1011.pair | Samme par skal passe i begge ligninger |
| b1011.substitution | Isolering og indsættelse af et helt udtryk |
| b1011.elimination | Addition af hele ligninger og tilbageregning |
| b1011.scale | Skalering af alle led på begge sider |
| b1011.method | Gyldigt metodevalg og parentesfortegn |
| b1011.receipts | To kvitteringer, samme stykpriser, to ligninger og modelkonklusion |
| b1011.consistency | Ingen løsning eller uendeligt mange, frem for et tvunget entydigt svar |
| b1011.bridge | To modelparametre og fremadrettet kontrol i begge ligninger |

Alle opgaver er egne tilføjelser til læseplanens B10–11-emner. Kvitterings- og terrassetabellerne er undervisningseksempler, ikke afskrift af de statistiske regneark. Parameterbroen genbruger den algebraiske struktur fra Modul 3; den erstatter ikke kontrol af de oprindelige sandsynligheder. Kombinatorik og binomialfordeling udvikles fortsat i B8–9 og hævdes ikke dækket af denne repetition.

### Verifikation af B10–11

`tests/normal-algebra.test.js` kontrollerer de tre identiteter på tværs af fortegn, nul og koefficienter, arealopdeling, entydige og uentydige systemer, brøksvar, lodrette/vandrette figurlinjer og uafhængige facit. Alle korrekte og forkerte faktoriseringsvalg udvides i en separat testfortolkning. Begge gennemførelsesveje, nødvendige svarrettelser, delsporenes uafhængighed, alle mål, kontrakt, feedback, gammel versionsindlæsning, ruter og modulfilter testes.

`tests/normal-algebra.browser.test.js` afprøver alle 43 kort og 16 bankopgaver, regne-/fortegns-/begrebsfeedback, grundhjælp, hints, fuld træningsvej og genvej uden træningssvar, separate delstatusser, genindlæsning, noter, gamle Modul 1–3-svar, fire gennemførte af seks undervisningsgange, alle 11 trin, krydsnavigation, historik, tastatur, begge figurer, MathML, mobil, defekt/blokeret lagring samt prøvefortrolighed og genåbning fra prøveresultatet. Kontobrowsertesten er udvidet med repetitionens historiketiket, rute, separate noter, begge delstatusser, anden enhed og isolation mellem brugere.

Afsluttet validering: alle 71 faglige/enhedstests, konto-/servertesten, 16 browserforløb og den udvidede kontobrowsertest består. Alle 265 bankopgaver er instansieret og valideret. Fire undervisningsganges uafhængige status, gamle svar og de seks undervisningsgange er kontrolleret. Figurer på desktop og ved 390-pixel mobilbredde er gennemset. Browserforløbene rapporterer ingen JavaScript- eller konsolfejl. Produktionsbuild og `git diff --check` består.
