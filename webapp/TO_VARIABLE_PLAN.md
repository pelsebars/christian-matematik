# Funktioner af to variable

Fire moduler følger arkene i `Pensum/8. Funktioner af to variable`:
1. Funktionsværdier, niveaukurver og snitkurver.
2. Partielt afledede og gradienter.
3. Dobbelt afledede og stationære punkter.
4. Optimering.

Hvert modul har starttjek, teori med gennemregnede eksempler, interaktiv undersøgelse med tabelalternativ, øvelser, modeller/CAS med gemte noter og sluttjek. Samme versionerede opgaver findes i opgavebanken. Pointbutikken viser aktuelle korrekt kontrollerede svar; ændrede svar trækker status tilbage, men tidligere optjente point og køb bevares.

## Modul 1
15 opgaver med 24 svarfelter: indsættelse, cirkler ved kvadratkomplettering, tomme niveauer, snitretning, BMI, windchill, indhegning, vindmølle, jordtemperatur, vandrutsjebanens kurvelængde og lampeskærm. Interaktivt niveau- og snitdiagram for en paraboloide, også negative niveauer.

Validering: enhedstests, hele eksisterende npm-testpakken, build og browser med lokal isoleret PGlite-database: alle svar, kontogemning på tværs af sessioner, point, svarredigering, kontoadskillelse, opgavebank, mobil og tastaturbetjening. Produktionsdatabasen berøres ikke af tests.

Git-status er gennemgået: `standalone/` og `webapp/tests/normal-start-rewards.browser.test.js` er eksisterende, uafhængige lokale filer; de medtages ikke. Udgivelse sker via Git main og Vercel. Railway appservice og database ændres ikke.
