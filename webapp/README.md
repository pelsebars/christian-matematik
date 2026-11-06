# Webapp

Første lokale version af Christians matematikapp.

## Indhold

- startside med ni emner;
- fast venstremenu på desktop og mobilmenu på små skærme;
- emneoversigter;
- komplette læringsforløb om lineære ligninger, løsning af andengradsligninger og sammensatte funktioner med teori, grundtjek, gennemregnede eksempler, hints og interaktive øvelser;
- samlet læringsplan for differentialregning samt fem komplette moduler om differentialkvotienten, produktreglen, kædereglen, vendetangenten og eksamensopsamling med starttjek, tastaturstyrede visualiseringer, monotoniforhold, optimering, modeller, dokumenteret CAS-brug og forståelsestjek;
- komplet læringsforløb i plangeometri og vektorer med fem moduler om vektorer, skalarprodukt/vinkler, projektion/tværvektor/determinant, linjen og cirklen med forudsætningstjek, grundkort, interaktive figurer, håndregning, CAS-spor og forståelsestjek;
- et trinvist andengradsforløb baseret på opgavearket, inklusive standardform, koefficienter, diskriminant, løsningsformel, indsættelseskontrol og blandet sluttest;
- side med formler og huskeregler;
- integralregning med foldbart læringsmålskort, separate sider for syv undervisningsgange og B-repetition samt komplet modul 1–7 og B-repetition 6–7 med seks trin og én del ad gangen om stamfunktioner, grundregler, grafiske sammenhænge, punkt- og tangentbetingelser, bestemte integraler, fortegnet integral/geometrisk areal, arealer mellem grafer, regneregler, trapezmetoden, potensregneregler, rødder, omvendte funktioner, domæner, skiver med og uden hul, rumfangsmodeller, kurvelængde, substitution i ubestemte og bestemte integraler, afsluttende blandede opgaver, CAS og modeller;
- differentialligninger med forløbsoversigt, læringsmålmatrix, seks modulruter, særskilt B-repetition 8–9 og afsluttende opsamling; komplet modul 1 med grundtjek, teori, eksempler, kurvefamilie, opgaver, hints, CAS og forståelsestjek; senere moduler er markeret planlagt;
- matematisk notation med indbygget MathML.

## Lokal visning

Loginversionen bruger Vercel Functions og PostgreSQL på Railway. Se [LOGIN_SETUP.md](LOGIN_SETUP.md) for opsætning, migrering, test og nulstilling af adgangskoder.

Kør `npm ci` og `npm run demo` for at afprøve hele appen med en midlertidig lokal database. Ved almindelig udvikling: konfigurér `.env`, kør `npm run db:migrate` og `npm run dev`.

En ren statisk webserver kan kun vise landing pagen; undervisningen kan afprøves lokalt med `?preview=1`, uden login og uden serversynkronisering.

## Fælles opgaver

Navigationens **Opgaver** åbner blandet træning og prøvesæt. Den separate bank har 477 gennemgåede opgaver fra alle ni hovedemner, MathML, seedet variation, delpoint, egen vurdering af forklaringer og personlig lagring. Integralmodul 1–7 har tilsammen 91 opgaver, heraf 46 seedede familier. Kildegennemgang og dækning er beskrevet i [INTEGRALREGNING_OPGAVEBANK.md](INTEGRALREGNING_OPGAVEBANK.md).

Format, integrationspunkt og eksempler er beskrevet i [OPGAVEBANK.md](../OPGAVEBANK.md). Nye emnepakker tilføjes i `tasks/bank/` og registreres i `tasks/bank/index.js`.

Kør `npm test` i denne mappe. `npm run test:browser` kræver Playwright som lokal testafhængighed; se opgavebankens dokumentation for alternative runtime-stier og Chrome.

Differentialligningernes kilder, ruter, fremdriftskrav og tests er beskrevet i [DIFFERENTIALLIGNINGER_PLAN.md](DIFFERENTIALLIGNINGER_PLAN.md).


Normalfordeling har fem modulruter, B-repetition 10–11 mellem modul 3 og 4 og en læringsmålmatrix med 26 mål. Modul 1–5 og B-repetitionen er komplette; opsamlingen er også implementeret. Modul 5 har 12 trin, 48 øvelseskort og 18 nye bankopgaver. Fire originale datasæt bruges til regression, residualer, modelkontrol og tosidede t-baserede 95 %-intervaller for hældningen. Simulationen viser faktisk stikprøvevariation og dækning. Reciprok og kvadreret respons følger arkets to tabeller. Forløbet skelner residualspredning, standardfejl, fejlmargin, estimat, fast parameter og observationsområde. Svar, hints og noter bruger eksisterende kontolagring; kun 40 relevante korrekt kontrollerede aktiviteter gennemfører Modul 5. Se `NORMALFORDELING_PLAN.md`. `npm run test:normal` tester hele normalforløbet og kontolagring. Opsamlingen har otte direkte trin, 34 øvelseskort, 28 obligatoriske aktiviteter og seks områder med målrettede genbesøgslinks. Dens status er særskilt fra de seks undervisningsgange. De 16 nye versionerede opsamlingsopgaver bringer normalbanken op på 109 opgaver.

Vektorfunktioner er hovedemne 09 med tre modulruter, særskilt B-repetition 12–13 mellem Modul 2 og 3 og en opsamling. Modul 1–3 og B-repetition 12–13 er implementeret. Modul 1 har 11 trin, 37 kort og 16 bankopgaver. Modul 2 har 13 trin, 46 kort og 20 nye bankopgaver om hastighed, fart, acceleration, tangenter, dobbeltpunkter, vektor-/linjevinkler, maksimal højde og dokumenteret CAS. Fire bevægelsesmodeller viser position, hastighed og acceleration med tastaturstyring og tabelalternativ. Hver undervisningsgang har egen kontolagring af svar, hints, noter og kontrolleret fremdrift. Repetitionen har to uafhængige spor, 12 trin, 40 kort og 16 nye bankopgaver. Hvert spor har sit eget starttjek, optjent genvej, træningsvej og selvstændige sluttjek. To figurer forbinder afledtes fortegn med monotoni og sammenligner globale kandidater inden for det valgte tidsinterval. Broerne er maksimal højde og største retlinjede afstand. Modul 3 har 13 trin, 45 kort og 20 nye bankopgaver om kurvelængde, areal, orientering, lukning og løkker. To interaktive figurer forbinder korder med længdeintegralet og viser orienterede bidrag over for geometriske delarealer. Kildearkets tværvektorformel og bevægelsesmodeller er genkontrolleret i Office Math og figurer. Opsamlingen er fortsat planlagt. Se [VEKTORFUNKTIONER_PLAN.md](VEKTORFUNKTIONER_PLAN.md) for kilder, Office Math-kontrol, 32 mål og ruter. `BROWSER_CHANNEL=chrome npm run test:vector` kører de tre modulers og repetitionens faglige tests, browsertests og isolerede kontotests.

Butikken (`#shop`) tilbyder fire konto-gemte skins samt vouchers til frysepizza, en øl hos ÅBEN, DCS: F-4E Phantom II, en restaurant-wuaucha til WhiteHorses eller DOSA Bar og en Lamborghini Huracán for optjente butikspoint. Se [LOGIN_SETUP.md](LOGIN_SETUP.md#butik-og-skins) for priser, køb og test.

### Opgavechat

Den fælles vejleder ligger i `tutor.js` (panel, historik og kontekst) og
`server/tutor.js` (instruktioner og Responses API). Den er koblet på
`integral-exercises.js`, første integralmodul i `integral.js`, `tasks/ui.js` og de ældre `.exercise-card`-opgaver.
Prøvesæt har ikke chat. Samtaler gemmes via kontolagringen i en separat
namespace pr. opgave/version (og seed for opgavebanken). De seneste 40 beskeder
bevares, og de seneste 24 sendes med hvert kald. Ingen fælles elevhukommelse.

For at aktivere: indstil `OPENAI_API_KEY` og `OPENAI_TUTOR_MODEL` på serveren,
byg og genstart/deploy. Serveren opretter automatisk `tutor_usage` ved første
godkendte chatkald, så produktionshemmeligheder ikke skal eksporteres. Tabellen
indgår også i den almindelige `npm run db:migrate`.
Nøglen må aldrig ligge i frontend. Modelnavnet skal være en Responses API-model,
som projektet har adgang til. Uden konfiguration vises en forklaring med henvisning
til de almindelige hints. API'et kræver login og korrekt Origin, begrænser hver
bruger til 12 kald/minut og har 40 sekunders timeout. Ingen automatiske API-retries.
Provider-responser lagres ikke via Responses API (`store: false`).

Opgavens MathML, SVG og billedbeskrivelser indgår som tekst; billedfiler og
håndskrift analyseres ikke visuelt. Vejlederen instrueres i at spørge, hvis en
figur ikke kan forstås. Svar vises som sikker almindelig tekst med Unicode-matematik.

Kontrol: `npm run test:tutor` (servertests og browserforløb med simulerede
modelsvar). En rigtig samtale skal også afprøves efter serverkonfiguration.
API-reference: https://developers.openai.com/api/reference/resources/responses/methods/create

### Forstå en opgave (hovedmenu)

`#guide` giver en selvstændig billed- og tekstvejleder. `guide.js` håndterer input,
forhåndsvisning, rettelser, genforsøg og samtalen. `guide-curriculum.js` indeholder
24 kontrollerede begrebsbroer med teoriuddrag og verificerede destinationer.
Emner uden implementeret appmodul har teoriuddrag, men intet opdigtet link.
Kataloget er et pensumoverblik, ikke en fuld indeksering af alle kildedokumenter.

`POST /api/tutor` med `mode: "guide"` bruger instruktionerne og det strukturerede
svarformat i `server/guide.js`. Den eksisterende opgavechat fortsætter uden dette
mode. Modellen får hele det lille katalog og vælger højst to relevante kort;
serveren kontrollerer id'erne og leverer destinationer fra kataloget. Klienten
bruger sit eget katalog ved rendering og indsætter aldrig modeltekst som HTML.

Brug en model med billedinput og Structured Outputs. `OPENAI_GUIDE_MODEL` kan
vælge en separat model; ellers bruges `OPENAI_TUTOR_MODEL`. Samme servernøgle,
login, Origin-kontrol og fælles grænse på 12 kald/minut pr. bruger anvendes.
Ingen ny databasemigration, ingen ændring af besvarelser eller point.
Den konfigurerede produktionsmodels kompatibilitet skal verificeres før udgivelse.

Billeder op til 15 MB læses i browseren og omkodes til JPEG, længste side højst
2200 px og højst 2.800.000 tegn som data-URL. JPEG, PNG og WebP understøttes;
HEIC/HEIF virker kun, hvis browseren kan dekode dem, ellers vises en forklaring.
Serveren kontrollerer format/signatur og størrelse; kun `/api/tutor` får den større
transportgrænse på 3,1 MB. Billedet sendes igen ved opfølgende spørgsmål, så grafen
stadig er tilgængelig. Dette har en løbende tokenomkostning.

Den nye vejleders opgaver, billeder og samtaler lever kun i fanens hukommelse og
skrives ikke til kontolagringen, databasen eller applikationslogs. `Ny opgave`
rydder dem og annullerer ventende UI-svar. Navigation til teori bevarer dem;
genindlæsning/logout fjerner dem. `store:false` bruges hos OpenAI; dette er ikke
et løfte om nul opbevaring hos udbyderen. Udbyderens gældende dataregler gælder.

Verifikation:
- `npm run test:guide`: serverkontrakt, kildehenvisninger og 12 browserforløb.
  Browserforløbene bruger simulerede modelsvar og dokumenterer ikke AI-kvalitet.
- `npm run test:tutor`: regression for den eksisterende opgavechat.
- `npm test`: matematik og eksisterende opgavebank.
- Med tilgængelig API-nøgle: `node scripts/evaluate-guide.js --holdout --repeats=3`.
  Til billedafprøvning tilføjes `--images` (renderede opgavebilleder, ikke fotos).
  Resultater gemmes i ignoreret `.test-data/guide-evaluation/results.json`.
  Bedøm svarene efter backloggens rubric; korrekt referencevalg er ikke nok.

Kilder til API-kontrakten:
[OpenAI billedinput](https://developers.openai.com/api/docs/guides/images-vision) og
[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
