# Funktioner af to variable

Fire moduler følger arkene i `Pensum/8. Funktioner af to variable`:
1. Funktionsværdier, niveaukurver og snitkurver.
2. Partielt afledede og gradienter.
3. Dobbelt afledede og stationære punkter.
4. Optimering.

Hvert modul har starttjek, teori med gennemregnede eksempler, interaktiv undersøgelse med tabelalternativ, øvelser, modeller/CAS med gemte noter og sluttjek. Samme versionerede opgaver findes i opgavebanken. Pointbutikken viser aktuelle korrekt kontrollerede svar; ændrede svar trækker status tilbage, men tidligere optjente point og køb bevares.

## Modul 1
15 opgaver: indsættelse, cirkler ved kvadratkomplettering, tomme niveauer, snitretning, BMI, windchill, indhegning, vindmølle, jordtemperatur, vandrutsjebanens kurvelængde og lampeskærm. Interaktivt niveau- og snitdiagram for en paraboloide, også negative niveauer.

Validering: enhedstests, hele eksisterende npm-testpakken, build og browser med lokal isoleret PGlite-database: alle svar, kontogemning på tværs af sessioner, point, svarredigering, kontoadskillelse, opgavebank, mobil og tastaturbetjening. Produktionsdatabasen berøres ikke af tests.

Git-status er gennemgået: `standalone/` og `webapp/tests/normal-start-rewards.browser.test.js` er eksisterende, uafhængige lokale filer; de medtages ikke. Udgivelse sker via Git main og Vercel. Railway appservice og database ændres ikke.

## Modul 2
15 opgaver: partielle afledte med potens-, produkt-, kæde- og kvotientregler, gradient, tangentretning, nulgradient, bakke, taxa, BMI og kropsoverflade. Interaktiv niveaukurve med gradientpil og tangent, også i punktet med nulgradient. Numerisk differenskontrol af fire uafhængige forskrifter samt samme fulde browserforløb som modul 1.

Modul 1: commit a02f8ed, Vercel success, otte centrale produktionsfiler sammenlignet byte for byte med Git.

## Modul 3
14 opgaver: andenordensafledte, blandede afledte, ligningssystemer, stationære punkters tre koordinater, D-testen, parametre, flader med flere stationære punkter og chipsens saddelpunkt. Interaktivt trådnet for ax²+by² med akser og snittabel. Testen håndterer D=0 uden at påstå en klassifikation. Numeriske første- og andenordensafledte verificerer opgavepunkterne uafhængigt.

Modul 2: commit 3dc4788, Vercel success, fem centrale produktionsfiler sammenlignet med Git. Produktionsfrontendens browserkontrol indlæser de faktiske Vercel-filer, men sender samtlige API-kald til en isoleret lokal testdatabase, så produktionsdata bevares.
