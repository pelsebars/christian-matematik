# Webapp

Første lokale version af Christians matematikapp.

## Indhold

- startside med otte emner;
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

Navigationens **Opgaver** åbner blandet træning og prøvesæt. Den separate bank har 233 gennemgåede opgaver fra alle otte hovedemner, MathML, seedet variation, delpoint, egen vurdering af forklaringer og personlig lagring. Integralmodul 1–7 har tilsammen 91 opgaver, heraf 46 seedede familier. Kildegennemgang og dækning er beskrevet i [INTEGRALREGNING_OPGAVEBANK.md](INTEGRALREGNING_OPGAVEBANK.md).

Format, integrationspunkt og eksempler er beskrevet i [OPGAVEBANK.md](../OPGAVEBANK.md). Nye emnepakker tilføjes i `tasks/bank/` og registreres i `tasks/bank/index.js`.

Kør `npm test` i denne mappe. `npm run test:browser` kræver Playwright som lokal testafhængighed; se opgavebankens dokumentation for alternative runtime-stier og Chrome.

Differentialligningernes kilder, ruter, fremdriftskrav og tests er beskrevet i [DIFFERENTIALLIGNINGER_PLAN.md](DIFFERENTIALLIGNINGER_PLAN.md).


Normalfordeling har forløbsoversigt, en læringsmålmatrix med 26 mål, fem modulruter, B-repetition 10–11 mellem modul 3 og 4 samt en særskilt opsamling. Modul 1 og 2 er komplette med hver otte korte undervisningstrin, henholdsvis 37 og 40 øvelseskort, interaktive figurer, fraktilberegning, i alt 27 fælles bankopgaver og separat personlig lagring. Modul 2 viser standardisering som skift af måleenhed, regning tilbage, relative placeringer, normale/exceptionelle udfald og de samme arealer på to skalaer. Modul 3–5, B-repetition og opsamlingen er planlagte. Se [NORMALFORDELING_PLAN.md](NORMALFORDELING_PLAN.md) for kildekontrol, notation, de otte regneark og progression. `npm run test:normal` kører de nye faglige og browserbaserede tests.
