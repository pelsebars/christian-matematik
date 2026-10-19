# Normalfordeling og statistisk analyse · modul 1–2

## Kilder og afgrænsning

Læst før implementering: `Pensum/Læseplan.pdf` (især side 2–3), `Pensum/Undervisningsbeskrivelse.pdf` (side 5), alle fem Word-ark under `Pensum/5. Normalfordeling`, alle otte medfølgende Excel-filer samt appens navigation, integralforløb, differentialligningsforløb, opgavekontrakt og kontolagring. Word-tekst, matematik i Office Math og indlejrede figurer indgår i kildekontrollen. Originalerne er kun læst. Data er transskriberet i `normal-data.js` med kildefil, ark, kolonnenavne og alle numeriske rækker.

Modul 1 og 2 er implementeret. Modul 3–5, B10–11 og opsamlingen er eksplicit planlagte. B-repetitionen ligger mellem modul 3 og 4 og tæller som den sjette undervisningsgang, uden et normalmodulnummer. Opsamlingen er en separat afsluttende side og er ikke en syvende undervisningsgang.

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

Ruter følger appens eksisterende hash-navigation: `#normalDistribution` er oversigten; `#normalDistribution/1` kanoniseres til `#normalDistribution/1/start`; øvrige sider er `/2`, `/3`, `/repetition`, `/4`, `/5` og `/opsamling`. Modul 1 har otte direkte adresserbare trin: start, model, taethed, fordeling, vaerktoej, oevelser, sluttjek og opsummering. Alle trin har forrige/næste og adgang til oversigten. Sidste trin i Modul 1 fører til Modul 2. Første trin i Modul 2 kan gå tilbage til sidste trin i Modul 1; sidste trin går til den tydeligt planlagte Modul 3-side. Browserens tilbage/frem virker. Modul 3–5 udvikles én ad gangen i senere beskeder.

Status baseres på svar: Modul 1 har 10 mikroøvelser + 12 opgaver + 5 slutspørgsmål = 27 obligatoriske kontroller. Modul 2 har 11 mikroøvelser + 15 opgaver + 6 slutspørgsmål = 32 obligatoriske kontroller. Starttjekkets 10 spørgsmål er diagnostiske. Åbning af siden gennemfører intet. Ændring af et korrekt svar ophæver dets aktive kontrol og eventuel gennemført modulstatus, som i de andre nye moduler. Personligt historikoverblik bevarer tidligere korrekte løsninger efter det fælles system.

Svar, kontroller og hinttrin bruger `accountStorage` under `christian-matematik.normal.introduction.v1`; værktøjsnoter bruger `christian-matematik.normal.notes.v1`. Begge synkroniseres gennem eksisterende konto/API og følger brugerens profil. Lokal preview bruger kun lokal lagring. Korrekte løsninger tilknyttes emnet Normalfordeling i det personlige overblik. Ingen ny anonym import eller særskilt progressionsdatabase.

## Fagligt og teknisk design

`normal-plan.js` og `normal-routes.js` ejer mål og navigation; `normal-content.js` ejer de korte undervisningsafsnit; `normal-lesson.js` binder de eksisterende øvelseskomponenter til progression; `normal-math.js` og `normal-graphs.js` ejer beregninger og figurer; `normal-data.js` bevarer dataafskrifterne; `tasks/bank/normal.js` er den fælles bankpakke. Der er ingen nye produktionsafhængigheder.

Sandsynligheder beregnes fra normalfordelingens tæthed med adaptiv Simpson-integration og direkte haleberegning; fraktiler findes med bisektion og fremadrettet kontrol. Den farvede polygon bruger samme tæthed og grænser; numerisk arealkontrol sammenligner polygonens trapezareal med den viste sandsynlighed. Ved otte spredninger er det udeladte visuelle haleareal under 0,0000000000000013 og påvirker ingen af de fire viste decimaler. Figurteksten forklarer de fortsættende haler. En omvendt grænserækkefølge giver en synlig fejl og skjuler grafen frem for at vise et misvisende positivt areal.

Alle matematiske udtryk vises som MathML. Valgmuligheder vises med fuld typografi ved siden af neutrale HTML-select-valg. Figurer er SVG med titler, dynamiske beskrivelser, tekstresultater og indbyggede tastaturstyrede kontroller. Der er tekstlige forklaringer også uden interaktion.

## Læringsmålmatrix

U1–U7 og K1–K6 følger samtlige relevante mål og kernestofpunkter på undervisningsbeskrivelsens side 5. A-mål konkretiserer læseplan og opgaveark; B-mål er den særskilte repetition. Kontroller i ikke-implementerede moduler er planlagte.

| Læringsmål | Introduceres | Øves | Kontrolleres | Hjælpemidler | Datasæt/eksempel |
| --- | --- | --- | --- | --- | --- |
| U1 · Statistiske og sandsynlighedsteoretiske modeller til beskrivelse af data | 1: model og måling | 1: mælk, øl, data; 2: fiskefoder, flødeboller; 4–5 | 1–2: modelopgaver og sluttjek; 4–5 og opsamling (planlagt) | Begge | Mælk; Gulerødder |
| U2 · Værktøjsprogrammer, symbolbehandling og problemløsning | 1: normalberegning og fraktil | 1–2: værktøjsopgaver; 3–5 | 1–2: tal og valg kontrolleres; egne værktøjsnoter vurderes med tjekliste | Med | Øl, mælk; senere alle otte regneark |
| U3 · Matematiske ræsonnementer og beviser | 1: symmetri og enkeltværdi | 1: areal og komplement; 2: skala, grænser og modeltolkning | 1–2: sluttjek og ræsonnementsopgaver; 3–5 (planlagt) | Begge | Arket: eksempel 3 og u4; egne korte begrundelser |
| U4 · Matematikanvendelse | 1: enheder og modelantagelser | 1–2: tekst og data; 4–5 | 1–2: teksttunge opgaver; opsamling (planlagt) | Begge | Fyldemaskiner, gulerødder; korn og Unibrew |
| U5 · Fagets metoder og identitet | 1: model kontra observation | 1–2: metodevalg og modelbegrænsninger | 1–2: metodeopgaver; 4–5 (planlagt) | Begge | Modelandel kontra målt andel |
| U6 · Begreber og metoder fra diskret matematik | Tidligere B8–9 (kun planlagt); 1: uafhængige gentagelser | 1: alle 20 kartoner; B8–9 (planlagt) | 1: sandsynlighedsprodukt; kombinatorik/binomial kræver særskilt udvikling | Begge | Mælk: ark 1, eksempel 4 med hjælpemidler |
| U7 · Mindstekrav og grundlæggende færdigheder | 1: diagnostik og grundhjælp | Alle moduler; B10–11 | 1–2: mikroøvelser og sluttjek; senere kontroller (planlagt) | Uden | Procent, funktioner, areal og ligninger |
| K1 · Kombinatorik | B8–9 skal udbygges; endnu ikke dækket | Planlagt binomialrepetition, uden dobbeltundervisning her | Planlagt separat kontrol; ingen fuld dækning endnu | Begge | Antal placeringer af succeser i gentagne forsøg |
| K2 · Stokastisk variabel | 1: før og efter måling | 1: mikroøvelse og bank | 1: sluttjek | Uden | En tilfældigt valgt mælkekarton |
| K3 · Binomialfordeling | B8–9 findes kun som plan; 1: kort begrebsbro | 1: alle 20 som særtilfælde; fuldt forløb i B8–9 (planlagt) | 1: uafhængighed; binomialberegning kontrolleres senere | Begge | Antal kartoner over en grænse kontra rumfang |
| K4 · Normalfordeling | 1: klokkeform og parametre | 1–4 | 1–2: begreb, areal og standardisering; senere (planlagt) | Begge | Gødning, mælk og øl |
| K5 · Opgaver uden hjælpemidler | 1: symmetri og notation | 1–5 og B10–11 | 1–2: slutspørgsmål; senere (planlagt) | Uden | Ark 1: eksempel 3 og u4 |
| K6 · CAS og statistikværktøjer | 1: model, input, output og konklusion | 1–2: beregning/fraktil; 3–5 | 1–2: talfelter; dokumentation ved egen vurdering | Med | Arket angiver ikke et bestemt program eller kommandonavn |
| A1 · Tæthed, sandsynlighed og enkeltværdi | 1: tæthed og areal | 1: graf og mikroøvelser | 1: density-opgave og sluttjek | Begge | Gødning: tæthed kan overstige én |
| A2 · Fordelingsfunktion, haler, interval og fraktil | 1: opsamlet areal | 1: graf, aflæsning, regning og invers | 1: cdf-, tails- og quantile-opgaver | Begge | Arket: eksempler med og uden hjælpemidler |
| A3 · Middelværdi og spredning; ens notation | 1: placering og bredde | 1–4; 3: ukendte parametre | 1: graf/parameter; 3–4 (planlagt) | Begge | Anden parameter er spredning; Rumfang bruger stikprøvespredning |
| A4 · Standardisering og oprindelig skala | 2: graf, skalaændring og to regneretninger | 2: mikroøvelser, sammenligning, data og bank; 3 (planlagt) | 2: mikroøvelser, bank og sluttjek; opsamling (planlagt) | Begge | Fiskefoder og flødeboller |
| A5 · Normale og exceptionelle udfald | 2: centrale arealer og materialets grænser | 2: intervaller, figurer og grænsetilfælde; 3–5 (planlagt) | 2: mikroøvelser, bank og sluttjek; 3–5 (planlagt) | Begge | Ark 2–5; følg materialets grænsekonvention |
| A6 · Parameterbestemmelse og kontrol af muligheder | 3 | 3; B10–11 støtter algebra | 3 og opsamling (planlagt) | Begge | Olie, te, kaffe; tæthedsbetingelse med to løsninger |
| A7 · Data, population, stikprøve og estimat | 1: begrebsskel; 4: beregninger | 1: Gulerødder; 4: alle fire datasæt | 1: dataopgave; 4 (planlagt) | Begge | 400, 100, 40 og 200 målinger |
| A8 · Normalfordelingsplot og forsigtig modelvurdering | 4 | 4: ret linje, krumning og outliers | 4 og opsamling (planlagt) | Aflæsning uden; egne plot med | Gulerødder, Rumfang og begge Højde-ark |
| A9 · Regression, residualer og residualspredning | 5 før intervalberegning | 5: også normalplot af residualer | 5 (planlagt) | Begge | 56 kornår; 100 blomsterpar; 18 Phillipsår; 106 Unibrew-par |
| A10 · Stikprøvevariation, hældningsestimat og konfidensinterval | 5 | 5: fortolkning, nul og antagelser | 5 og opsamling (planlagt) | Med; fortolkning uden | Blomster, Phillipsdata og Unibrew |
| A11 · Omformede regressionsmodeller | 5 efter lineær grundidé | 5: reciprok respons og kvadreret respons | 5 (planlagt) | Med | Ark 5: eksempel 2 og opgave 4 |
| B10 · De tre kvadratsætninger og faktorisering | B10–11: eget diagnostisk spor | B10–11 (planlagt) | Eget sluttjek (planlagt) | Uden | Parenteser, fortegn og kontrol af omskrivning |
| B11 · To ligninger med to ubekendte | B10–11: separat diagnostisk spor | Substitution, elimination og tekstopgave (planlagt) | Kontrol i begge ligninger (planlagt) | Uden; værktøj som kontrol | Ligningssystem; støtte til senere parameterbestemmelse |

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
