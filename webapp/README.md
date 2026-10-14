# Webapp

Første lokale version af Christians matematikapp.

## Indhold

- startside med seks emner;
- fast venstremenu på desktop og mobilmenu på små skærme;
- emneoversigter;
- komplette læringsforløb om lineære ligninger, løsning af andengradsligninger og sammensatte funktioner med teori, grundtjek, gennemregnede eksempler, hints og interaktive øvelser;
- samlet læringsplan for differentialregning samt fem komplette moduler om differentialkvotienten, produktreglen, kædereglen, vendetangenten og eksamensopsamling med starttjek, tastaturstyrede visualiseringer, monotoniforhold, optimering, modeller, dokumenteret CAS-brug og forståelsestjek;
- komplet læringsforløb i plangeometri og vektorer med fem moduler om vektorer, skalarprodukt/vinkler, projektion/tværvektor/determinant, linjen og cirklen med forudsætningstjek, grundkort, interaktive figurer, håndregning, CAS-spor og forståelsestjek;
- et trinvist andengradsforløb baseret på opgavearket, inklusive standardform, koefficienter, diskriminant, løsningsformel, indsættelseskontrol og blandet sluttest;
- side med formler og huskeregler;
- integralregning med foldbart læringsmålskort, separate sider for syv undervisningsgange og B-repetition samt komplet modul 1, 2, 3 og 4 med seks trin og én del ad gangen om stamfunktioner, grundregler, grafiske sammenhænge, punkt- og tangentbetingelser, bestemte integraler, fortegnet integral/geometrisk areal, arealer mellem grafer, regneregler, trapezmetoden, CAS og modeller;
- matematisk notation med indbygget MathML.

## Lokal visning

Servér mappen med en lokal webserver, og åbn `index.html` gennem serverens adresse.

## Fælles opgaver

Navigationens **Opgaver** åbner blandet træning og prøvesæt. Den separate bank har 37 gennemgåede opgaver fra alle seks hovedemner, MathML, seedet variation, delpoint, egen vurdering af forklaringer og lokal lagring.

Format, integrationspunkt og eksempler er beskrevet i [OPGAVEBANK.md](../OPGAVEBANK.md). Nye emnepakker tilføjes i `tasks/bank/` og registreres i `tasks/bank/index.js`.

Kør `npm test` i denne mappe. `npm run test:browser` kræver Playwright som lokal testafhængighed; se opgavebankens dokumentation for alternative runtime-stier og Chrome.
