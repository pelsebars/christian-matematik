# Fælles opgavebank

Opgavesystemet er en separat del af den statiske app. Der er ingen backend, byggetrin eller ny produktionsafhængighed. Åbn appen gennem en HTTP-server; ES-moduler virker ikke pålideligt via `file://`.

Banken har aktuelt **206 opgaver**, heraf **91 i integralmodul 1–7** og syv i B-repetitionen. Antal i de efterfølgende modulafsnit beskriver den historiske tilføjelse; den samlede integralrevision er dokumenteret i [webapp/INTEGRALREGNING_OPGAVEBANK.md](webapp/INTEGRALREGNING_OPGAVEBANK.md).

## Arkitektur og eksisterende indhold

`webapp/app.js` styrer fortsat hovednavigation og eksisterende undervisning. Den nye side hedder `#tasks`. `window.showMathView` forbinder repetitionsknapper med det rigtige emne; modulets eksisterende sektion bruges som rullemål.

| Fil                                 | Ansvar                                                |
| ----------------------------------- | ----------------------------------------------------- |
| `webapp/tasks/catalog.js`           | Hovedemner, moduler, læringsmål og repetitionsmål     |
| `webapp/tasks/schema.js`            | Formatversion og validering af opgaver                |
| `webapp/tasks/math.js`              | MathML, escaping og sikker polynomiumsparser          |
| `webapp/tasks/bank/index.js`        | **Integrationspunkt**, seed og instansiering          |
| `webapp/tasks/bank/algebra.js`      | Oprindelig ligning og andengrad                         |
| `webapp/tasks/bank/equations.js`    | Komplet ligningsbank med seedede familier og fejlanalyse |
| `webapp/tasks/bank/composite.js`    | Komplet bank om funktioner og sammensætning             |
| `webapp/tasks/bank/calculus.js`     | Oprindelig produktregel og haveoptimering             |
| `webapp/tasks/bank/differentiation.js` | Komplet differentialregningsbank på tværs af fem moduler |
| `webapp/tasks/bank/geometry.js`     | Komplet bank til plangeometri og vektorer             |
| `webapp/tasks/bank/integration-complete.js` | Samlet integralbank, neutrale versioner og seedede familier |
| `webapp/tasks/bank/integration-sources.js` | Supplerende integralopgaver fra kilder og læringsmål |
| `webapp/tasks/selection.js`         | Filtrering og balanceret sammensætning                |
| `webapp/tasks/grading.js`           | Point, delpoint, egen vurdering og målrettet feedback |
| `webapp/tasks/storage.js`           | Lokal lagring, formatkontrol og genoptagelse          |
| `webapp/tasks/ui.js` og `tasks.css` | Opsætning, træning, prøve og resultater               |

Alle eksisterende hovedemner har teori, eksempler og interaktive øvelser og er klar til opgaver. Registrerede moduler:

| Emne                     | Moduler                                                                                                             | Demonstrationsbank                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Ligninger                | `eq.basic`                                                                                                          | 10 opgaver om balance, fortegn, parenteser, brøker og kontrol   |
| Andengradsligninger      | `quad.basic`                                                                                                        | Antal reelle løsninger og de to løsninger                       |
| Sammensatte funktioner   | `comp.basic`                                                                                                        | 13 opgaver om notation, værdier, rækkefølge, domæne og modeller |
| Differentialregning      | `diff.1` differentialkvotient, `diff.2` produktregel, `diff.3` kæderegel, `diff.4` vendetangent, `diff.5` opsamling | Produktregel og haveoptimering                                  |
| Plangeometri og vektorer | `geo.1` vektorer, `geo.2` skalarprodukt, `geo.3` projektion/determinant, `geo.4` linjen, `geo.5` cirklen            | 30 opgaver på tværs af alle fem moduler                         |

Moduler uden demonstrationsopgaver er stadig registreret til fremtidige integrationer og som forudsætninger. De eksisterende undervisningsplaners mærkning af gennemførte moduler er ikke personlige resultater. Brugeren registrerer derfor selv sine gennemførte moduler i Opgaver.

## Format, version 1

Hver opgave har en primær placering i et hovedemne og modul. Delspørgsmålene udgør svarformatet og tilsammen opgavens point. Indhold kommer fra gennemgåede kildefiler, aldrig fra brugerens svar eller et eksternt HTML-feed. HTML og SVG i banken er betroet, håndskrevet indhold; brug aldrig brugerinput i disse felter.

### Obligatoriske opgavefelter

| Felt            | Type og betydning                                                                          |
| --------------- | ------------------------------------------------------------------------------------------ |
| `id`            | Globalt entydig, stabil streng, kun små bogstaver, cifre, bindestreg og punktum            |
| `version`       | Positivt heltal. Forøg ved ændring af spørgsmål, facit, generator eller bedømmelse         |
| `topic`         | Nøgle registreret i `topics`                                                               |
| `module`        | Nøgle i `modules`, som hører til opgavens hovedemne                                        |
| `goals`         | Ikke-tom liste over registrerede læringsmål i modulet                                      |
| `prerequisites` | Liste over modul-id'er; tom liste er tilladt                                               |
| `difficulty`    | 1 grundlæggende, 2 øvet eller 3 udfordrende                                                |
| `size`          | `short`, `medium` eller `complex`                                                          |
| `minutes`       | Positivt forventet tidsforbrug                                                             |
| `aids`          | Boolean: hjælpemidler tilladt eller ikke tilladt                                           |
| `prompt`        | Opgavetekst som HTML med MathML. Må ikke indeholde emnenavn, metodeanvisning eller løsning |
| `parts`         | Ikke-tom liste over entydige delspørgsmål, se nedenfor                                     |
| `hints`         | Ikke-tom liste af HTML-strenge, ordnet fra let støtte til konkret regnehjælp               |
| `solution`      | Gennemregnet løsning som HTML og MathML, inklusive relevante begrundelser og kontrol       |
| `errors`        | Ikke-tom liste af typiske fejl med målrettet feedback                                      |

### Valgfrie opgavefelter

| Felt         | Betydning                                                                            |
| ------------ | ------------------------------------------------------------------------------------ |
| `figure`     | Tilgængelig responsiv SVG/HTML-figur, uden metode- eller facitoplysninger            |
| `parameters` | Generatorens realiserede tal, til faglig kontrol og tests. Vises ikke før besvarelse |

Der bruges ikke et frit tekstfelt til opgavetitel under prøven: titler afslører ofte metoden. Brug neutral tekst i `prompt` og neutrale labels på delspørgsmål.

### Delspørgsmål og svarformat

Alle delspørgsmål skal have `id` (små bogstaver, cifre og bindestreg), `label` (HTML med eventuel MathML), `type` og `points` (positivt heltal).

| `type`       | Obligatoriske felter ud over ovenstående                                                          | Vurdering                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `number`     | `answer`: tal som streng, fx `"5"` eller `"1/2"`                                                  | Sikker beregning og absolut tolerance                                                  |
| `expression` | `answer`: polynomium som streng                                                                   | Koefficienterne sammenlignes, så udvidede og faktoriserede former accepteres           |
| `tuple`      | `answer`: liste af tal; `components`: tilsvarende liste af labels                                 | Koordinater eller vektorer; rækkefølgen betyder noget                                  |
| `set`        | `answer`: liste af tal; `components`: tilsvarende liste af labels                                 | Flere løsninger; rækkefølgen er ligegyldig, hver forventet løsning kan matches én gang |
| `choice`     | `options`: liste med entydige `{id,label}`; `answer`: id på korrekt valg                          | Eksakt valg                                                                            |
| `text`       | `checklist`: ikke-tom liste af faglige kriterier; `concepts`: ikke-tom liste af centrale begreber | Ingen automatisk pointtildeling                                                        |

Valgfrie felter på delspørgsmål:

- `tolerance`: ikke-negativt tal, standard `1e-9`. Ved tal/komponenter er tolerancen absolut; ved polynomier relativ pr. koefficient med minimumsskala 1. Vælg tolerance ud fra opgavens ønskede afrunding.
- `partial`: boolean, kun til `tuple`/`set`. Ved `true` gives `points × antal korrekte komponenter / antal komponenter`; ellers kræves alle komponenter. Vælg gerne point, der er delelige med komponentantallet.

Delpoint mellem regnetrin laves som separate delspørgsmål: diskriminant, løsninger, model, optimum og begrundelse kan hver få egne point. Forkerte svar giver ikke minuspoint.

### Begrænsninger for automatisk bedømmelse

Parseren accepterer tal med dansk decimalkomma, brøker, regnearter, parenteser, variablen `x`, implicit multiplikation, potenser med heltalseksponent 0–8 og `sqrt` af ikke-negative konstante tal. Den kan fx acceptere både `(2*x+1)^2` og `4*x^2+4*x+1`.

Den bruger et afgrænset syntakstræ/polynomiumsregning, ingen `eval`, `Function`, dynamisk kode eller tilfældig punktprøvning. Den har grænser for længde, grad og koefficientstørrelse. Division med variable, trigonometriske udtryk, logaritmer og andre funktioner understøttes ikke i første version. Sådanne indtastninger bliver **uafklarede**, frem for at blive erklæret forkerte.

Blankt svar er ubesvaret og giver nul point. En udfyldt fritekstbesvarelse eller et udtryk uden sikker bedømmelse har `points: null`, indtil brugeren eventuelt angiver sin egen vurdering. Oversigten viser de afventende point særskilt. Egen vurdering mærkes eksplicit og må ikke fremstilles som automatisk eller ekstern bedømmelse. Centrale begreber er vejledning, ikke en søgeordsbaseret karaktergivning.

## Registrering af læringsmål og nye emner

1. Tilføj et nyt hovedemne i `topics`, hvis nødvendigt. Tilføj tilsvarende emneside i den eksisterende app; opgavesystemet behøver ingen særlig branche for emnet.
2. Tilføj modulet i `modules` med `{topic,name,section}`. `section` skal være en eksisterende sektions-id på emnesiden, så repetitionsknappen virker.
3. Tilføj læringsmål med stabilt id og `{module,text}`. Teksten skal beskrive en konkret kompetence. Brug navnerum som `diff.product` for at undgå sammenblanding af planernes lokale F1/F2-koder.
4. Referér målene via `goals` i opgaven. En opgave kan have flere mål. Resultater under flere mål overlapper; de skal ikke lægges sammen til den samlede score.

## Tilføjelse af en fast opgave

Lav en emnefil i `webapp/tasks/bank/`, eksportér en liste af opgaver, og importér listen i `bank/index.js`. Føj listen til `bank` med spread. Kopiér eksemplet nedenfor, giv det et nyt id, og gennemregn det selv. `validateTask` køres på alle opgaver ved opstart og afviser forkerte id'er, facittyper og relationer. Den kontrollerer formatet; den kan ikke bevise den matematiske kvalitet af en tekst eller løsning.

## Tilføjelse af en seedet skabelon

En skabelon i banken er `{id,version,generate(random)}`. `generate` skal returnere en **komplet opgave** med samme id og version som skabelonen. Brug kun den indgivne `random`-funktion til variation. Ingen `Math.random`, datoer, netværk eller ekstern tilstand i generatoren.

`instantiate(id,seed)` kombinerer sættets seed, opgavens id og version i en deterministisk PRNG. Forøg versionen, hvis generatorlogikken ændres. Begræns talrummet fagligt: fx vælger `eq.balance` først heltallig koefficient, positiv heltallig løsning og konstantled og beregner så højresiden. Derfor er spørgsmålet entydigt, og facit altid pænt. Gem tallene i `parameters` til kontrol.

Skabelonvarianten af eksemplet kan skrives sådan (brug kun én af de to varianter i banken):

```js
export const tasks = [
  {
    id: "eq.example",
    version: 1,
    generate(random) {
      const root = 1 + Math.floor(random() * 8);
      return {
        ...fixedExample,
        prompt: `<p>Find den ukendte: ${math(`${n(3)}${x}<mo>+</mo>${n(2)}<mo>=</mo>${n(3 * root + 2)}`)}.</p>`,
        parts: [
          {
            id: "x",
            label: "Den ukendtes værdi",
            type: "number",
            answer: String(root),
            points: 2,
          },
        ],
        solution: `<ol><li>Træk to fra på begge sider: ${math(`${n(3)}${x}<mo>=</mo>${n(3 * root)}`)}.</li><li>Divider begge sider med tre: ${math(`${x}<mo>=</mo>${n(root)}`)}.</li><li>Kontrol: ${math(`${n(3)}<mo>·</mo>${n(root)}<mo>+</mo>${n(2)}<mo>=</mo>${n(3 * root + 2)}`)}.</li></ol>`,
        parameters: { root, coefficient: 3, constant: 2 },
      };
    },
  },
];
```

Sørg for, at **alle** afhængige tekster, hints, typiske fejl og løsninger passer til hver talvariant. I eksemplet er hints og generel fejlfeedback uafhængige af den variable løsning.

## Hints og målrettet feedback

Hints skal begynde med en idé eller observation og derefter give et konkret næste skridt. De vises ét ad gangen i træning; prøven render ingen hints eller løsningsforslag før aflevering.

Hver regel i `errors` har obligatoriske `part` (delspørgsmålets id) og `feedback` (ren tekst). Valgfrit `answer` matcher et bestemt fejlsvar. Numeriske og polynomielle fejlsvar matches matematisk; choice matches efter id. Tuple/set bruger i første version generel feedback pr. delspørgsmål. Udelad `answer` for en fallback. Skriv hvilken fejl der skete, hvorfor og hvad brugeren kan gøre næste gang. MathML-holdige forklaringer hører i `solution`, da fejlfeedback vises som escaped tekst.

## Figurer og matematisk notation

Opgavetekst, labels, hints og løsning bruger native MathML. `math`, `n`, `x`, `power` og `tuple` i `math.js` er små hjælpefunktioner. Brug fx `mfrac`, `msqrt`, `msup`, `mover` og `mtable` til brøker, rødder, potenser og vektorer. ASCII er kun et indtastningsformat og internt facit; understøttede svar får en MathML-visning under feltet.

Brug `figure` til `<figure class="task-figure">` med SVG, `viewBox`, `role="img"`, fyldig `aria-label` og forklarende `figcaption`. Figuren må ikke vise opgavenavn, metode eller facit. Hold labels læselige på mobil; brug farver fra appens CSS-variabler og undgå nødvendig information kun via farve. Se `geo.walk` for et komplet eksempel.

## Sammensætning og historik

Opsætningen kan filtrere efter emner, gennemførte moduler inklusive forudsætninger, tid, sværhedsgrad og hjælpemidler. Standardønsket er 6 korte, 4 mellemstore og 2 komplekse opgaver. Sammensætningen overskrider ikke tidsbudget eller antal pr. størrelse og vælger aldrig samme opgave-id to gange i samme sæt.

Blandt mulige opgaver vægtes spredning i emner, mål og sværhedsgrader, størrelse, tidligere forekomst og tidligere fejl. Historikken er begrænset til 30 sæt, og de seneste 100 opgaveforekomster indgår i valget. Udvalget blandes derefter deterministisk. Ved valgt sværhedsgrad bruges kun denne; standarden spreder over de tre niveauer gennem de forskellige opgaver. Små banker kan ikke garantere ønsket fordeling; brugerfladen fortæller, når færre opgaver kunne vælges.

Samme seed, bankversioner, valg og historik giver samme sæt. Slå historik fra for at reproducere et delt sæt. Et igangværende sæt gemmer den faktiske rækkefølge, seed og version pr. opgave, så genindlæsning ikke genudvælger sættet.

## Lagring og prøvens adfærd

`localStorage`-nøglen er `christian-matematik.tasks.v1`. Den indeholder formatversion, selvregistrerede gennemførte moduler, kort resultathistorik og den seneste session. Sessionen gemmer svar pr. opgave og delspørgsmål, hints, markeringer, kontrollerede træningssvar, egen vurdering, rækkefølge, seed, tidspunkt og afleveringstilstand. Input gemmes med det samme. Der sendes ingen besvarelser til en server.

Tidtagning er valgfri i prøven og måler væguret, også ved genindlæsning eller når fanen er lukket. Den er vejledende og afleverer ikke automatisk. Aflevering kræver en særskilt bekræftelse, som viser helt ubesvarede og markerede opgaver. Træningssvar låses efter kontrol, så tidligere feedback og point hænger sammen; brug genforsøg for at svare igen.

Hvis browseren blokerer lagring, eller kvoten er fuld, vises en besked. Ugyldige data eller inkompatible opgaveversioner åbnes ikke som om de var gyldige. Der vises en besked og tilbydes et nyt sæt. Der er ingen generel snapshotlagring eller versionsmigration. De oprindelige 49 faste integralopgaver i version 1 bevares dog som uforanderlige undervisningsopgaver: `instantiate(id, seed, version)` kan genåbne dem med præcis oprindelig tekst og facit. Lagring og UI sender den gemte version med. Nye sæt bruger den aktuelle bankversion. Ukendte versioner afvises fortsat. Bump kun version ved reelle faglige ændringer. Resultathistorikken er kortfattet; fuld besvarelse og løsninger bevares for den seneste session, indtil et nyt sæt startes.

Prøvetilstanden skjuler oplysninger i brugerfladen, men er ikke en sikret eksamensplatform. Banken er statiske kildefiler i browseren.

## Komplet fast eksempel til kopiering

Gem i en ny fil under `webapp/tasks/bank/`, og importér `tasks` i bankens integrationspunkt.

```js
import { math, n, x } from "../math.js";

const fixedExample = {
  id: "eq.example",
  version: 1,
  topic: "equations",
  module: "eq.basic",
  goals: ["eq.isolate"],
  prerequisites: [],
  difficulty: 1,
  size: "short",
  minutes: 3,
  aids: false,
  prompt: `<p>Find den ukendte: ${math(`${n(3)}${x}<mo>+</mo>${n(2)}<mo>=</mo>${n(17)}`)}.</p>`,
  parts: [
    {
      id: "x",
      label: "Den ukendtes værdi",
      type: "number",
      answer: "5",
      tolerance: 1e-9,
      points: 2,
    },
  ],
  hints: [
    "Gør det samme på begge sider af lighedstegnet.",
    "Træk to fra på begge sider. Divider derefter med tre.",
  ],
  solution: `<ol><li>Træk to fra: ${math(`${n(3)}${x}<mo>=</mo>${n(15)}`)}.</li><li>Divider med tre: ${math(`${x}<mo>=</mo><mfrac>${n(15)}${n(3)}</mfrac><mo>=</mo>${n(5)}`)}.</li><li>Kontrol: ${math(`${n(3)}<mo>·</mo>${n(5)}<mo>+</mo>${n(2)}<mo>=</mo>${n(17)}`)}.</li></ol>`,
  errors: [
    {
      part: "x",
      feedback:
        "Fjern konstantleddet på begge sider, divider med koefficienten, og kontrollér svaret ved indsættelse.",
    },
  ],
};
export const tasks = [fixedExample];
```

## Test af nye opgaver

Kør `cd webapp && npm test`. Testene validerer alle opgaver, verificerer automatisk facit, point og delpoint, prøver sikre og afviste udtryk og gennemgår 1.000 seeds for hver seedet ligningsgenerator. Tilføj selvstændige faglige kontroller til nye generatorer: indsæt facit i den oprindelige ligning, kontrollér domæne, ikke-nul nævnere, entydighed, afrunding, geometri og samtlige viste regnetrin. Et facit sammenlignet med sig selv er ikke tilstrækkelig faglig kontrol.

Til browserforløbet bruges Playwright uden produktionsafhængighed: installer Playwright lokalt og dets browser, og kør `npm run test:browser`. Alternativt kan `PLAYWRIGHT_MODULE_PATH` pege på Playwrights `index.mjs`; `BROWSER_CHANNEL=chrome` bruger en allerede installeret Chrome. Testen starter og lukker sin egen lokale HTTP-server.

Browsertesten dækker eksisterende sider og en eksisterende øvelse, prøvens skjulte metadata, svar ved navigation og genindlæsning, hints kun i træning, aflevering og genforsøg, delpoint, egen vurdering, repetition, MathML namespace, mobilbredde, tastaturfokus, blokeret localStorage og fravær af JavaScript-/konsolfejl. Screenshots gemmes i `/tmp/matematik-tasks-mobile.png` og `/tmp/matematik-tasks-desktop.png` til visuel kontrol.

## Differentialregning, komplet opgavebank

`tasks/bank/differentiation.js` supplerer de to oprindelige opgaver i `calculus.js` med 32 opgaver. Differentialregning har dermed 34 opgaver fordelt på `diff.1`–`diff.5`: seks om differentialkvotient og grundregler, syv om produkter, otte om sammensatte funktioner, seks om tangenter og vendepunkter samt syv om monotoni, ekstrema, optimering og CAS. Efter den komplette ligningsintegration har hele banken 99 opgaver.

Tretten af de nye opgaver er seedede skabeloner. De varierer blandt andet polynomier, sekant- og tangenthældninger, afledte produktværdier, sammensatte potenser, tangentlinjer, vendepunkter, fortegnsskemaer og rektangeloptimering. Hver generator gemmer sine realiserede tal i `parameters`.

Læringsmålene i `catalog.js` skelner mellem struktur, beregning og fortolkning. Opgaveteksterne nævner ikke navnet på den regel, der skal vælges; metoden kommer først i hints og løsninger. Ensartede spørgsmål fra undervisningsmodulets starttjek, øvelser og sluttjek er samlet i én opgavetype eller en seedet familie frem for at blive kopieret som dubletter.

`tests/differentiation.test.js` kontrollerer alle opgaver, mål, unikke tekster, MathML, point, delpoint, målrettet feedback og filtrering. For hver af de 13 generatorer gennemgås 1.000 seeds. Facit kontrolleres uafhængigt mod de oprindelige funktioner, produktberegninger, tangentbetingelser, fortegn, intervaller og optimeringsbetingelser. Den fælles browsertest gennemgår desuden differentialregning i trænings- og prøvetilstand på desktop og mobil.

## Integralregning, første arbejdsgang

Hovedemnet `integration` og `int.1`–`int.7` samt `int.rep` er registreret. `int.rep` er mellemstationen om B-niveau 6–7, ikke et nummereret integralmodul. Alle syv moduler og B-repetitionen er åbne. Afsnittene nedenfor dokumenterer deres oprindelige integration; den samlede bankrevision står til sidst. Læringsmålskort og kildeafgrænsning findes i `webapp/INTEGRALREGNING_PLAN.md`.

`webapp/tasks/bank/integration.js` tilføjer syv gennemgåede opgaver: kort stamfunktion/familie, ledvis integration, eksponentialfunktion, negativ potens, kontrol af et forkert forslag, en positionsmodel og en CAS-opgave. De har hints i niveauer, løsninger, typiske fejl og målrettet feedback. Alle prøvetekster er uden metodeoverskrift. Modeller og CAS-forklaringer kræver egen vurdering med tjekliste.

Forskriftsfelter til én stamfunktion med polynomiumsbedømmelse beder eksplicit om konstantled nul. Dermed afvises alternative integrationskonstanter ikke som fejl i en opgave, der ellers tillader dem. Eksponentialfunktioner og negative potenser benytter MathML-valg, fordi parseren ikke håndterer disse udtryk. Gennemførte moduler i Opgaver registreres fortsat manuelt.

Undervisningsmodulets egne starttjek, mikroøvelser og sluttjek gemmes under `christian-matematik.integration.v1`, uafhængigt af prøvesæt. Browserforløbet for integralregning ligger i `webapp/tests/integral.browser.test.js` og indgår i `npm run test:browser`.

Integralregning bruger nu separate undervisningssider: `#integration/1`–`#integration/7` og `#integration/repetition`. Oversigten er `#integration`. Repetitionsknapper bruger `window.openIntegralSection(section)` til at vise den rigtige side. Sektions-id'er, opgaveversioner og lagringsformat bevares. Modul 1 viser ét spørgsmål eller én teoridel/ét eksempel ad gangen og har Forrige/Næste samt frit valg af trin.

## Integralregning, modul 2

`tasks/bank/integration-graphs.js` tilføjer syv gennemgåede opgaver fra `int.2` med `int.1` som forudsætning: punkt, graf/fortegn, funktionsværdi, tangent, to tangentmuligheder, vognmodel og CAS med punktbetingelse. De har konkrete modulmål, flere hints, løsninger, fejlfeedback og egen vurdering af forklaringer. Banken har nu 23 opgaver.

Skriv begge røringssteder i den eksplicit angivne rækkefølge (mindste/største) i den sammensatte tangentopgave. Konstanter kan indtastes som brøker. CAS-opgaven bruger MathML-valg for logaritmeforskrifter, der ikke understøttes af polynomiumsparseren. Modul 2-svar gemmes separat fra modul 1 under `christian-matematik.integration.graphs.v1`.

Browserforløbet `tests/integral-graphs.browser.test.js` tester alle moduldele og de nye bankopgaver, grafkontroller, punkt-/tangentfeedback, mobillayout, MathML, lokal lagring, prøvebank og repetition. Det indgår i `npm run test:browser`.

## Integralregning, modul 3

`tasks/bank/integration-definite.js` tilføjer syv opgaver fra `int.3` med `int.1` og `int.2` som forudsætninger: positivt integral, stamfunktionstabel, grænseberegninger, fortegnet integral/areal, eksponentialfunktion, energi-/tidsmodel og parametergrænser. Banken har nu 30 opgaver. De nye mål er `int.definite`, `int.ftc`, `int.bounds`, `int.signed`, `int.accumulation` og `int.cas-definite`.

Forskellige fejlsvar udløser konkret feedback om potensregning, forkert række i en tabel, omvendte grænser, glemt nedre grænseværdi eller sammenblanding af integral og geometrisk areal. Energi- og parameterforklaringer kræver egen vurdering med tjekliste. CAS- og modelopgaver angiver domæne, enheder og afrunding; prøveteksterne har ingen metodeoverskrifter eller hints.

Modulets egne svar gemmes under `christian-matematik.integration.definite.v1`. `tests/integral-definite.browser.test.js` tester alle dele, figurens grænser og rektangler, MathML-grænser, fejlfeedback, hints, lokal lagring, mobil, bankprøver og repetition. Den indgår i `npm run test:browser`.

## Integralregning, modul 4

`tasks/bank/integration-areas.js` tilføjer syv opgaver med `int.1`, `int.2` og `int.3` som forudsætninger. Banken har nu 37 opgaver. De nye mål er `int.intersections`, `int.between`, `int.split`, `int.area-rules`, `int.numeric`, `int.discrete`, `int.area-model` og `int.area-parameter`.

Opgaverne dækker areal mellem grafer, stamfunktionstabel, todelte områder, linearitet, diskrete data, historisk vandstandsmodel og en parameter. Forklaringer har egen vurdering; prøvetekster indeholder ingen hints eller metodeoverskrifter. Nye opgaver og eksisterende versioner bruger samme bankformat og sikker svarparser.

## B-repetition 6–7 i integralforløbet

`tasks/bank/integration-repetition.js` tilføjer syv selvstændige opgaver i `int.rep`, uden integralforudsætninger. Banken har nu 44 opgaver. Målene er `rep.powers`, `rep.roots`, `rep.inverse`, `rep.domain`, `rep.graph` og `rep.model`.

Potenser, fortegn, rødder, lineær omvending, domænebegrænset kvadratfunktion, eksponentialfunktion/logaritme og en temperaturmodel bruger fælles sikker bedømmelse. Rødder og logaritmiske forskrifter, som polynomiumsparseren ikke understøtter, stilles som valg; polynomielle inverse forskrifter accepterer ækvivalente udtryk. Forklaringer har egen vurdering. Prøvetekster har ingen metodeoverskrifter eller hints; repetitionslinket åbner den unummererede mellemstation.

## Integralregning, modul 5

`tasks/bank/integration-solids.js` tilføjer syv opgaver i `int.5` med `int.3`, `int.4` og `int.rep` som forudsætninger. Banken har nu 51 opgaver. Målene er `int.discs`, `int.washers`, `int.volume-units`, `int.volume-model`, `int.arc`, `int.length-units` og `int.length-model`.

Skiver og skiver med hul kan besvares med den præcise koefficient foran pi. En eksakt kurvelængde med kvadratrod stilles som valg, da polynomiumsparseren ikke understøtter rodudtryk. Skål, lampe, kabel og karaffel kræver dokumenteret modelkontrol; numeriske svar har angivne afrundinger og absolutte tolerancer. Forklaringer har egen vurdering. Prøvetekster indeholder ingen hints eller metodeoverskrifter.

## Integralregning, modul 6

`tasks/bank/integration-substitution.js` tilføjer syv opgaver i `int.6`, med `int.1` og `int.rep` som forudsætninger. Banken har nu 58 opgaver. Målene er `int.substitution`, `int.sub-factor`, `int.sub-power`, `int.sub-log`, `int.sub-domain`, `int.sub-trig`, `int.sub-check`, `int.sub-cas` og `int.sub-model`.

Familier med eksponentialfunktion, logaritme og trigonometri stilles som valg med integrationskonstant, da den fælles parser er begrænset til polynomier. Den lineære potensopgave har en punktbetingelse, så ækvivalente polynomielle svar kan kontrolleres entydigt. Logaritmeopgaven kræver absolutværdi på alle definitionsintervaller. CAS-punktopgaven bruger en præcis konstant; løbermodellen adskiller fart fra stamfunktionsforskelle og efterfølgende tidsinterval. Forklaringer har egen vurdering, og prøvetekster har ingen hints eller metodeoverskrifter.

## Ligninger, komplet opgavebank

`tasks/bank/equations.js` supplerer den oprindelige `eq.balance` med ni opgaver. Modulet `eq.basic` har dermed 10 opgaver: inverse regnearter ved addition og multiplikation, ukendte led på begge sider, negative koefficienter, én og to parenteser, talbrøker, kontrol af et løsningsforslag og analyse af det første ugyldige regnetrin.

Otte af de ni nye opgaver er seedede familier. De eksisterende opgaver fra undervisningsmodulet og `01. Ligninger.docx` er samlet efter matematisk struktur, så ensartede spørgsmål ikke ligger som dubletter. Familien med led på begge sider dækker blandt andet formerne fra `5x − 2 = 2x + 7`, `−x + 3 = −2x + 5` og `4x − 2 = x + 8`; parentesfamilierne dækker både én og to parenteser; brøkfamilien bevarer strukturen fra materialets opgave med nævnerne 3, 4 og 2.

Generatorerne vælger først en kontrolleret løsning og beregner derefter de afhængige konstanter. Derfor er koefficienten foran den ukendte aldrig nul, parentesopgaverne har én entydig løsning, og brøkopgaven har et eksakt heltals- eller halvtalsfacit. Alle realiserede tal gemmes i `parameters`.

Læringsmålene er `eq.balance`, `eq.inverse`, `eq.collect`, `eq.parentheses`, `eq.signs`, `eq.fractions`, `eq.check` og det eksisterende `eq.isolate`. Opgaveteksterne bruger neutrale formuleringer og nævner ikke løsningsmetoden. Hints går fra observation til konkret næste trin; løsningerne viser balancehandlinger og kontrol ved indsættelse. Kontrolopgaven har separate point for vurdering og korrekt værdi, så delvis faglig forståelse registreres uden minuspoint.

`tests/equations.test.js` kontrollerer antal, mål, unikke tekster, MathML, point, delpoint, feedback og modulfiltrering. For hver af de ni seedede ligningsgeneratorer gennemgås 1.000 seeds med uafhængig indsættelse i de oprindelige ligninger, kontrol af entydighed, determinisme, facitbedømmelse og variation.

## Sammensatte funktioner, komplet opgavebank

`tasks/bank/composite.js` samler undervisningsmodulets grundtjek og seks øvelser i 13 opgaver uden at kopiere ens strukturer som dubletter. Banken dækker funktionsnotation, indsættelse af positive og negative værdier, indre og ydre funktion, sammensatte funktionsværdier i begge rækkefølger, forskrifter, sammenligning af rækkefølger, definitionsbetingelser, ligninger, modeller med enheder, tre funktioner i kæde og fejlanalyse. Hele banken har dermed 111 opgaver.

Ni opgaver er seedede familier. Generatorerne vælger kontrollerede tal, så kvadratrødder giver hele værdier, ligninger har to forskellige heltalsløsninger, domænegrænser er gyldige, og alle viste mellemregninger passer til varianten. Den tidligere `comp.compose` er bevaret som stabilt id, flyttet fra `algebra.js`, gjort seedet og hævet til version 2.

Læringsmålene er `comp.notation`, `comp.value`, `comp.structure`, `comp.order`, `comp.formula`, `comp.compare`, `comp.domain`, `comp.equation` og `comp.model`. Prøveteksterne nævner ikke emnenavn eller løsningsmetode; metoden kommer først i hints og løsninger. Modelopgaven bruger egen vurdering af enhedsforklaringen, og ligningsopgaven giver delpoint for hver korrekt mellem- og slutværdi.

`tests/composite.test.js` kontrollerer dækning, unikke opgaver, neutrale prøvetekster, MathML, hints, feedback, point, delpoint og modulforudsætninger. For hver af de ni generatorer gennemgås 1.000 seeds med uafhængig kontrol af funktionsværdier, rækkefølge, polynomielle forskrifter, domæne, ligningsløsninger, determinisme og variation.

## Plangeometri og vektorer, komplet opgavebank

`tasks/bank/geometry.js` samler modulernes eksisterende øvelsestyper i 30 opgaver uden at kopiere ens matematiske strukturer som dubletter. Banken fordeler sig med fem opgaver om vektorer, fem om skalarprodukt og vinkler, seks om projektion, tværvektor og determinant, syv om linjer og syv om cirkler. Hele banken har dermed 151 opgaver.

Fireogtyve opgaver er seedede familier. Generatorerne vælger kontrollerede punkter, vektorer, pythagoræiske taltripler, linjer og cirkler, så facit er entydige, afstande og skæringer er eksakte, og alle viste mellemregninger passer til varianten. De oprindelige id'er `geo.walk`, `geo.angle`, `geo.distance` og `geo.fountain` er bevaret; de tre første er udvidet til seedede familier og har fået ny version.

Læringsmålene dækker forskellen på punkt og vektor, vektorregning, længde, midtpunkt og retning; skalarprodukt, ortogonalitet og vinkelberegning; projektion, tværvektor, determinant, orientering og areal; linjeformer, retnings- og normalvektorer, skæringer, relationer og afstand; samt cirklens former, kvadratkomplettering, punktplacering, skæringer og tangenter. Prøveteksterne nævner ikke løsningsmetoden, hvor opgaven kan formuleres neutralt.

`tests/geometry.test.js` kontrollerer antal, dækning, unikke opgaver, neutrale prøvetekster, MathML, hints, feedback, point, delpoint og modulforudsætninger. For hver af de 24 seedede familier gennemgås 1.000 seeds med uafhængig kontrol af vektorer, vinkler, projektioner, determinanter, linjer, afstande, cirkler, skæringer og tangenter samt determinisme og variation.

## Integralregning, modul 7

`tasks/bank/integration-definite-substitution.js` tilføjer syv opgaver i `int.7`. Hele banken har nu 158 opgaver. Målene er `int.new-bounds`, `int.def-substitution`, `int.orientation`, `int.def-domain`, `int.capstone-area`, `int.capstone-geometry`, `int.capstone-numeric`, `int.capstone-model` og `int.capstone-reason`.

Fire håndregningsopgaver dækker nye grænser, eksponentialfunktion, logaritme med indre minimum og faldende cosinusgrænser. Tre større opgaver dækker parameterarealer, areal/rumfang/kurvelængde og transport med begyndelsesværdi. Præcise logaritme- og eksponentialresultater stilles som valg med MathML; tal og brøker bruger den sikre parser. Numeriske modeller afrundes til to decimaler og har absolutte tolerancer. Forklaringer har egen vurdering.

Forudsætningerne er `int.3` og `int.6`, suppleret med `int.4` for parameter og `int.4`/`int.5` for geometri. Eksisterende opgaveversioner bevares. Prøvetilstand skjuler hints, mål og løsninger, og repetitionslinket åbner modul 7 direkte.


## Samlet opgavebankrevision af integralmodul 1–7

Alle undervisningssider, eksisterende opgaver, eksempler og de syv kildeark er gennemgået. De 49 oprindelige id’er er bevaret, og 42 nye opgavetyper tilføjet. Integralbanken har 91 opgaver fordelt på 13, 13, 14, 14, 16, 10 og 11 i modul 1–7. 46 er seedede familier. B-repetitionens syv opgaver er uændrede. Tilsammen har hele banken 200 opgaver.

`integration-complete.js` samler undervisningens oprindelige opgaver, bankens neutrale versioner og de nye kildeopgaver fra `integration-sources.js`. Undervisningssiderne bruger fortsat deres oprindelige opgaver. Ændrede banktekster/generatorer har højere version; de oprindelige faste version 1-opgaver kan fortsat bruges af gemte sæt. Hver opgave har læringsmål, forudsætninger, point, flere hints, målrettet feedback og gennemregnet løsning. Forklaringer bruger tjeklister og egen vurdering. Rødder som et uordnet sæt har delpoint.

Ens regnetyper er samlet i familier; ukendte figurdata og tvetydige formler er erstattet med eksplicitte, kontrollerede betingelser. Kildekort, tilpasninger og faglige forbehold står i [INTEGRALREGNING_OPGAVEBANK.md](webapp/INTEGRALREGNING_OPGAVEBANK.md).

`tests/integration-bank.test.js` kontrollerer alle mål, id’er, neutral tekst, versioner, point og feedback samt determinisme og facit for 1.000 seeds pr. generator. De viste MathML-facit differentieres med en separat testfortolker, og distraktorer kontrolleres for utilsigtet gyldighed; numeriske integraler kontrollerer areal-, rumfangs- og længdefacit. Testfortolkeren er kun testkode. Produktionsparseren er uændret. `tests/integration-bank.browser.test.js` afprøver alle 91 opgaver med svar, bedømmelse, hints, genindlæsning, mobil, prøvefortrolighed og genoptagelse af et gammelt version 1-sæt. Begge indgår i de normale testkommandoer.


## Differentialligninger · modul 1

Seks nye opgaver i `webapp/tasks/bank/ode.js` er registreret under hovedemnet `differentialEquations`, modul `ode.1`, med målene `ode.notation`, `ode.check`, `ode.initial`, `ode.reason`, `ode.model` og `ode.cas`. De følger version 1-kontrakten med stigende sværhedsgrad, to hints, gennemregnede løsninger og målrettet fejlfeedback. Fem opgaver er uden hjælpemidler; én er med CAS. Eksponentialudtryk vises med MathML og kontrolleres som entydige valg, da polynomiumsparseren ikke understøtter dem.

Undervisningsstatus og besvarelser følger integralmodulernes lokale format; bankens manuelle registrering af gennemførte moduler og prøvetilstand bevares. Se [plan og kildekort](webapp/DIFFERENTIALLIGNINGER_PLAN.md) for den fulde afgrænsning, læringsmålmatrix, statuskrav og verifikation. Senere moduler er planlagte og har endnu ingen bankopgaver.

## Normalfordeling, første arbejdsgang

`tasks/bank/normal.js` tilføjer 12 opgaver i `norm.1`; banken har dermed 218 opgaver. Kun Modul 1 har færdige opgaver. Modul 2–5 og den særskilte B10–11-repetition er planlagte sider. Læringsmålmatrix, kilde- og notationskontrol samt datasæt er dokumenteret i `webapp/NORMALFORDELING_PLAN.md`.

Opgaverne dækker observation/stokastisk variabel, parametre, tæthed kontra sandsynlighed, symmetri, fordelingsfunktion, haler og mellemområder, fraktil, ukendt nedre grænse, uafhængige fyldninger, faktisk regnearksandel og en teksttung klassifikationsopgave med modeltolkning. De har 2–3 hints, gennemregnede løsninger, målrettet feedback, konkrete modulmål og korrekt MathML. Opgaveteksterne har ingen metodeoverskrifter; en oplyst normalmodel er nødvendig faglig information i de relevante spørgsmål. Hints, løsning og målmetadata er skjult indtil aflevering i prøvetilstand efter det fælles system.

Mål: `norm.model`, `norm.parameters`, `norm.density`, `norm.area`, `norm.cdf`, `norm.quantile`, `norm.reason`, `norm.tools` og `norm.data`. Tallene er faste, version 1. Sandsynlighedsfelter beder om decimaltal og angiver afrunding; tolerancer følger det efterspurgte antal decimaler. Sandsynligheden for alle 20 fyldninger kan skrives som brøken én divideret med 1.048.576. En potens med eksponent 20 vises typografisk i løsningen; den fælles indtastningsparser har en lavere eksponentgrænse, så opgaven beder ikke om potensindtastning.

Gulerodsopgaven bygger på 121 af 400 faktiske målinger under 396 g og sammenligner andelen 0,3025 med en foreløbig model. Den viser ikke data som et bevis for normalfordeling. Normalkurvens højde må aldrig bedømmes som et sandsynlighedssvar. Fraktilopgaver kontrolleres også ved fremadrettet sandsynlighedsberegning i de faglige tests.

Undervisningen genbruger `renderExercises` og `bindLessonExercises`. De 10 grundspørgsmål er diagnostiske; 10 mikroøvelser, 12 opgaver og 5 forståelsesspørgsmål udgør 27 obligatoriske kontroller. Svar, kontroller og hints bruger eksisterende kontolagring, og korrekt løste øvelser knyttes til Normalfordeling i brugerens overblik. Værktøjsnoter gemmes separat på samme konto og vurderes af eleven med en tjekliste; automatisk talbedømmelse udgiver sig ikke for at bedømme hele dokumentationen.

`tests/normal.test.js` kontrollerer referenceværdier, symmetri, fraktiler, ekstreme spredninger, polygonarealer, alle datasæts størrelser, selvstændigt beregnede facit, feedback og ruter. `tests/normal.browser.test.js` gennemgår alle 37 øvelseskort, hints, notation, forkert område, procentfejl, grundhjælp, direkte ruter, frem/tilbage, planlagte sider, de to grafer, omvendt beregning, opgavebankens træning og prøve, progression, genindlæsning, noter, defekt/blokeret lagring, mobil og tastatur. Kontobrowsertesten kontrollerer også synkronisering af normalfordelingssvar og noter til en anden enhed samt adskillelse mellem brugere.

## Normalfordeling · Modul 2

`tasks/bank/normal-standard.js` tilføjer 15 opgaver i `norm.2`, med `norm.1` som forudsætning. Hele banken har nu 233 opgaver; normalfordeling har 27. Alle tidligere id'er og versioner bevares. Opgaverne følger kontrakten med metadata, mål, stigende sværhedsgrad, 2–3 hints, gennemregnede løsninger, konkret fejlfeedback og MathML. Spørgsmål med nødvendige modeloplysninger har ingen metodeoverskrift; prøvetilstanden skjuler hints, løsninger og målmetadata indtil aflevering.

Målene `norm2.scale`, `norm2.z`, `norm2.interpret`, `norm2.reverse`, `norm2.compare`, `norm2.ranges`, `norm2.boundaries`, `norm2.coverage`, `norm2.graph`, `norm2.probability`, `norm2.reason`, `norm2.tools` og `norm2.data` dækker skalaændring, fortegn, tilbageberegning, sammenligning, normalinterval, exceptionelle udfald, ét/to/tre-spredningsarealer, figuropgaver, sandsynligheds- og fraktilberegning, metodevalg og en faktisk gulerodsmåling. Den teksttunge produktionsopgave kræver både klassifikation, sandsynlighed og en forsigtig modelkonklusion.

Materialets grænser følges præcist: normale udfald ligger højst to spredninger fra centrum; exceptionelle ligger mere end tre væk. Præcis tre er ikke exceptionelt. Feedback adskiller blandt andet glemt division, forkert fortegn, glemt centrum, forveksling af tæthed og sandsynlighed samt den fejlagtige påstand, at standardisering beviser normalfordeling.

De to figurer genoptegner ark 2's u1 og u4 med korrekte arealer, aksetal og tekstalternativer. Sandsynligheder har eksplicit svarformat og slutafrunding; begge intervalgrænser kan indtastes som brøker for at undgå tidlig afrunding. Egne CAS- og grafnoter gemmes på samme konto, men vurderes særskilt med tjekliste. Modulets 8 grundtjek er diagnostiske; 11 mikroøvelser, 15 opgaver og 6 slutspørgsmål udgør 32 obligatoriske kontroller. Ingen opgave til Modul 3–5 eller B10–11 er implementeret i denne arbejdsgang.

`tests/normal-standard.test.js` giver uafhængige faglige kontroller og bevarer gamle version 1-sæt. `tests/normal-standard.browser.test.js` tester alle nye kort og bankopgaver, prøvefortrolighed, repetition, figurer, grænser, feedback, hinttrin, begge modulers separate progression, noter, genindlæsning, direkte ruter, mobil, MathML, tastatur og lagringsfejl. Den samlede browserpakke inkluderer både Modul 1 og 2.


## Normalfordeling · Modul 3

`tasks/bank/normal-parameters.js` tilføjer 16 opgaver i `norm.3` med både `norm.1` og `norm.2` som forudsætninger. Banken har dermed 249 opgaver, heraf 43 i normalfordeling. Gamle id'er og version 1-sæt er bevaret. Pakken bruger den fælles kontrakt, MathML, 2–3 hints, gennemregnede løsninger og fejlfeedback til den enkelte del. Prøvetilstand skjuler hints, løsning og målmetadata; opgaverne har ingen metodeoverskrifter.

De 12 mål `norm3.information`, `translate`, `equation`, `graph`, `sd`, `mean`, `both`, `check`, `density`, `reason`, `tools` og `data` dækker tilstrækkelige oplysninger, hale- og områdevalg, parameterligninger, grafaflæsning, én/to ukendte parametre, positiv spredning, kontrol af oprindelige betingelser, tæthed med to mulige middelværdier, metodevalg og dokumentation. Alle mål har præfikset `norm3.`. Begrebsopgaver og korte regnestykker leder videre til teksttunge fosfor-, kaffe-, olie-, fustage-, slik- og teopgaver. En ekstra opgave med asymmetriske haler afviser den ukritiske midtpunktmetode.

Gulerodsopgaven bruger den faktiske første måling på 371,2 g og givne modelbetingelser til at genfinde modelspredningen. Den foregiver hverken at beregne en ny stikprøvespredning fra alle 400 målinger eller at bevise normalfordeling. Materialets tungmetalopgave bevarer forskellen på udfald uden for normalintervallet og exceptionelle udfald. Slikopgavens produkt kræver eksplicit uafhængighed. Tæthedsbetingelsen bruger lille f, og begge mulige middelværdier skal angives og kontrolleres.

Undervisningen har 8 diagnostiske kort og 35 obligatoriske kontroller: 12 mikroøvelser, 16 bankopgaver og 7 slutspørgsmål. Status og noter har separate kontonøgler, men genbruger samme bedømmelse, lagring og personlige historik. Se `webapp/NORMALFORDELING_PLAN.md` for kildekort, alle ni ruter, symbolforklaringer og visualiseringer.

`tests/normal-parameters.test.js` kontrollerer matematik, identifikation, fortegn, kontrol af alle betingelser, tæthedens nul/én/to løsninger, afrunding, mål og versionsbevarelse. `tests/normal-parameters.browser.test.js` afprøver alle nye kort og bankopgaver, feedback, hints, fire interaktive modeller, tæthedsfiguren, noter, genindlæsning, separat progression, prøvefortrolighed, repetition, direkte ruter, MathML, tastatur, mobil og lagringsfejl. Kontobrowsertesten kontrollerer Modul 3 på tværs af enheder og brugerprofiler. Alle tre normalmodulers tests indgår i de fælles testkommandoer.


## Virtuel repetition B-niveau 10–11

`tasks/bank/normal-algebra.js` tilføjer 16 version 1-opgaver i `norm.repetition`. Hele banken har nu 265 opgaver, heraf 59 i Normalfordelingsforløbet. Repetitionen er en unummereret mellemstation med selvstændig algebra, ikke Modul 4. Den har ingen forudsætning om gennemførte normalmoduler. Tidligere opgave-id'er, versioner og løsningsformater er uændrede.

De otte B10-opgaver dækker de tre kvadratsætninger, koefficienter, fortegn, faktorisering, modeksempel og en tekst-/tabelopgave om areal. De otte B11-opgaver dækker fælles par, substitution, elimination, skalering af hele ligninger, metodevalg, kvitteringsmodel, én/ingen/uendeligt mange løsninger og en parameterbro. Kvitterings- og terrassetabeller er egne undervisningseksempler. Alle opgaver følger kontrakten med MathML, mål, hints, trinvis løsning, konkret fejlfeedback, sværhedsgrad, tidsestimat og hjælpemiddelstatus. Prøvetilstand skjuler hints, løsning og målmetadata.

De 14 mål har præfikset `b1011.`: `recognize`, `expand`, `sign`, `factor`, `check`, `pair`, `substitute`, `eliminate`, `method`, `verify`, `solutions`, `model`, `apply` og `bridge`. Korrekt faktorisering vælges blandt faktiske produktformer. Udvidelse bedømmes via koefficienter; blot at gentage den oprindelige parentes opfylder ikke opgaven. Et løsningspar indtastes som to separate tal, så den samme sikre talbedømmer anvendes i undervisning og bank.

Undervisningen har to separate starttjek og sluttjek samt 43 kort i alt. B10 kræver sine fire slutkort og enten fire startkort eller alle 12 træningskort. B11 kræver sine fem slutkort og enten fire startkort eller alle 14 træningskort. Den fagligt begrundede genvej kræver således kontrollerede svar. Et spor kan gennemføres uafhængigt af det andet; hele undervisningsgangen kræver begge. Noter og egen begrundelse vurderes med tjekliste. Konto- og historikadapteren bruger B-repetition 10–11 og separate normal/algebra-nøgler, adskilt fra integralforløbets repetition.

Kildegrundlag, alle opgaver, ruter og progression er beskrevet i `webapp/NORMALFORDELING_PLAN.md`. Læseplanen angiver de to emner den 6. november; der findes ikke et særskilt lokalt B10–11-ark. De nye faglige tests kontrollerer identiteter, valg, fortegn, systemer, figurdata og gennemførelseslogik. Browserforløbet tester alle kort og bankopgaver, begge spor og veje, feedback, lagring, figurer, prøve/repetition, navigation, MathML, tastatur og mobil. Kontotesten dækker synkronisering mellem enheder og isolation mellem brugere.


## Normalfordeling · Modul 4

`tasks/bank/normal-plots.js` tilføjer 16 version 1-opgaver i `norm.4` med `norm.1` og `norm.2` som forudsætninger. Hele banken har 281 opgaver; Normalfordelingsforløbet har 75. Alle gamle id'er og versioner bevares. De 14 mål med præfikset `norm4.` er `data`, `sort`, `position`, `axes`, `read`, `estimate`, `variance`, `judge`, `outlier`, `probability`, `empirical`, `reason`, `tools` og `limits`.

Korte begrebs- og aflæsningsopgaver leder til fire faktiske datasæt, fuld estimation, teksttung modelvurdering og sammenligning mellem modelsandsynlighed og målt andel. Alle data er med i opgavebilagene: 400 gulerodsvægte, 100 rumfang, 40 personhøjder og 200 klubhøjder. Gentagelser og yderpunkter bevares. Bankens komplette databilag er også tilgængelige i prøvetilstand; hints, løsning og målmetadata er skjult indtil aflevering.

Kildens akseretning følges, og de skematiske aflæsningsfigurer skelnes fra plot beregnet på rådata. Appens rangregel og referencelinje er eksplicitte valg. Opgaverne skelner mellem teoretisk rangfraktil, standardiseret måling, spredning og varians, estimat og parameter, modelvurdering og bevis samt optælling og modelberegning. Klubhøjdernes systematiske afvigelser må ikke godkendes alene, fordi ingen målinger ligger uden for tre estimerede spredninger. Gulerøddernes to lave yderpunkter slettes ikke automatisk.

Modul 4 har 43 kort med 35 obligatoriske kontroller: 12 mikroøvelser, 16 bankopgaver og 7 slutkort. Otte startkort er diagnostiske. Den eksisterende grader, hints, MathML, kontolagring, historik og prøve/repetition genbruges. Egne plotundersøgelser og konklusioner vurderes med tjeklister og separate kontonoter. Se `webapp/NORMALFORDELING_PLAN.md` for alle ruter, kildekort, data, valg og tests.
