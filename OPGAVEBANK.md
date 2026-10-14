# Fælles opgavebank

Opgavesystemet er en separat del af den statiske app. Der er ingen backend, byggetrin eller ny produktionsafhængighed. Åbn appen gennem en HTTP-server; ES-moduler virker ikke pålideligt via `file://`.

## Arkitektur og eksisterende indhold

`webapp/app.js` styrer fortsat hovednavigation og eksisterende undervisning. Den nye side hedder `#tasks`. `window.showMathView` forbinder repetitionsknapper med det rigtige emne; modulets eksisterende sektion bruges som rullemål.

| Fil                                 | Ansvar                                                |
| ----------------------------------- | ----------------------------------------------------- |
| `webapp/tasks/catalog.js`           | Hovedemner, moduler, læringsmål og repetitionsmål     |
| `webapp/tasks/schema.js`            | Formatversion og validering af opgaver                |
| `webapp/tasks/math.js`              | MathML, escaping og sikker polynomiumsparser          |
| `webapp/tasks/bank/index.js`        | **Integrationspunkt**, seed og instansiering          |
| `webapp/tasks/bank/algebra.js`      | Ligninger, andengrad og sammensatte funktioner        |
| `webapp/tasks/bank/calculus.js`     | Produktregel og optimering                            |
| `webapp/tasks/bank/geometry.js`     | Vektorer, vinkler, linjer og cirkler                  |
| `webapp/tasks/selection.js`         | Filtrering og balanceret sammensætning                |
| `webapp/tasks/grading.js`           | Point, delpoint, egen vurdering og målrettet feedback |
| `webapp/tasks/storage.js`           | Lokal lagring, formatkontrol og genoptagelse          |
| `webapp/tasks/ui.js` og `tasks.css` | Opsætning, træning, prøve og resultater               |

Alle eksisterende hovedemner har teori, eksempler og interaktive øvelser og er klar til opgaver. Registrerede moduler:

| Emne                     | Moduler                                                                                                             | Demonstrationsbank                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Ligninger                | `eq.basic`                                                                                                          | Seedet ligning                                                  |
| Andengradsligninger      | `quad.basic`                                                                                                        | Antal reelle løsninger og de to løsninger                       |
| Sammensatte funktioner   | `comp.basic`                                                                                                        | Sammensat forskrift                                             |
| Differentialregning      | `diff.1` differentialkvotient, `diff.2` produktregel, `diff.3` kæderegel, `diff.4` vendetangent, `diff.5` opsamling | Produktregel og haveoptimering                                  |
| Plangeometri og vektorer | `geo.1` vektorer, `geo.2` skalarprodukt, `geo.3` projektion/determinant, `geo.4` linjen, `geo.5` cirklen            | Vektor/længde med SVG, vinkelvalg, afstand, fontæne med tangent |

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

Hvis browseren blokerer lagring, eller kvoten er fuld, vises en besked. Ugyldige data eller inkompatible opgaveversioner åbnes ikke som om de var gyldige. Der vises en besked og tilbydes et nyt sæt. Gamle opgavesnapshots og versionsmigration er ikke implementeret; bump derfor kun version ved reelle faglige ændringer. Resultathistorikken er kortfattet; fuld besvarelse og løsninger bevares for den seneste session, indtil et nyt sæt startes.

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

Kør `cd webapp && npm test`. Testene validerer alle opgaver, verificerer automatisk facit, point og delpoint, prøver sikre og afviste udtryk og gennemgår 1.000 seeds til ligningsgeneratoren. Tilføj selvstændige faglige kontroller til nye generatorer: indsæt facit i den oprindelige ligning, kontrollér domæne, ikke-nul nævnere, entydighed, afrunding, geometri og samtlige viste regnetrin. Et facit sammenlignet med sig selv er ikke tilstrækkelig faglig kontrol.

Til browserforløbet bruges Playwright uden produktionsafhængighed: installer Playwright lokalt og dets browser, og kør `npm run test:browser`. Alternativt kan `PLAYWRIGHT_MODULE_PATH` pege på Playwrights `index.mjs`; `BROWSER_CHANNEL=chrome` bruger en allerede installeret Chrome. Testen starter og lukker sin egen lokale HTTP-server.

Browsertesten dækker eksisterende sider og en eksisterende øvelse, prøvens skjulte metadata, svar ved navigation og genindlæsning, hints kun i træning, aflevering og genforsøg, delpoint, egen vurdering, repetition, MathML namespace, mobilbredde, tastaturfokus, blokeret localStorage og fravær af JavaScript-/konsolfejl. Screenshots gemmes i `/tmp/matematik-tasks-mobile.png` og `/tmp/matematik-tasks-desktop.png` til visuel kontrol.

## Integralregning, første arbejdsgang

Hovedemnet `integration` og `int.1`–`int.7` samt `int.rep` er registreret. `int.rep` er mellemstationen om B-niveau 6–7, ikke et nummereret integralmodul. Modul 1 er åbent; de øvrige sektioner viser deres plan. Læringsmålskort og kildeafgrænsning findes i `webapp/INTEGRALREGNING_PLAN.md`.

`webapp/tasks/bank/integration.js` tilføjer syv gennemgåede opgaver: kort stamfunktion/familie, ledvis integration, eksponentialfunktion, negativ potens, kontrol af et forkert forslag, en positionsmodel og en CAS-opgave. De har hints i niveauer, løsninger, typiske fejl og målrettet feedback. Alle prøvetekster er uden metodeoverskrift. Modeller og CAS-forklaringer kræver egen vurdering med tjekliste.

Forskriftsfelter til én stamfunktion med polynomiumsbedømmelse beder eksplicit om konstantled nul. Dermed afvises alternative integrationskonstanter ikke som fejl i en opgave, der ellers tillader dem. Eksponentialfunktioner og negative potenser benytter MathML-valg, fordi parseren ikke håndterer disse udtryk. Gennemførte moduler i Opgaver registreres fortsat manuelt.

Undervisningsmodulets egne starttjek, mikroøvelser og sluttjek gemmes under `christian-matematik.integration.v1`, uafhængigt af prøvesæt. Browserforløbet for integralregning ligger i `webapp/tests/integral.browser.test.js` og indgår i `npm run test:browser`.

Integralregning bruger nu separate undervisningssider: `#integration/1`–`#integration/7` og `#integration/repetition`. Oversigten er `#integration`. Repetitionsknapper bruger `window.openIntegralSection(section)` til at vise den rigtige side. Sektions-id'er, opgaveversioner og lagringsformat bevares. Modul 1 viser ét spørgsmål eller én teoridel/ét eksempel ad gangen og har Forrige/Næste samt frit valg af trin.
