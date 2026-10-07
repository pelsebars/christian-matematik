# Plan for hovedemnet Plangeometri og vektorer

Planen bygger på `Pensum/Læseplan.pdf`, `Pensum/Undervisningsbeskrivelse.pdf` og alle fem undervisningsark i `Pensum/2. Plangeometri. Vektorer`.

## Samlet læringsrækkefølge

1. **Vektorer i planen** *(implementeret)* — skeln mellem punkt og vektor; aflæs koordinater; bestem vektoren mellem to punkter; regn med sum, differens, skalarmultiplikation og linearkombinationer; bestem længde og midtpunkt; fortolk regningerne i et koordinatsystem. Enkle parameteropgaver løses med håndregning og kontrolleres med CAS.
2. **Skalarprodukt og vinklen mellem to vektorer** *(implementeret)* — beregn skalarproduktet; afgør om en vinkel er spids, ret eller stump; undersøg ortogonalitet; bestem vinkler og ukendte parametre; anvend metoderne i geometriske problemer.
3. **Projektion, tværvektor og determinant** *(implementeret)* — tegn og beregn projektioner begge veje; bestem tværvektorer; beregn determinant og trekantsareal; undersøg parallelitet, ortogonalitet og orientering; kombinér begreberne i parameteropgaver.
4. **Linjen** *(implementeret)* — skift mellem ligning og parameterfremstilling; brug retnings- og normalvektor; opstil en linje gennem et punkt; bestem skæringspunkter, parallelitet, ortogonalitet, vinkler og punkt–linje-afstand; løs geometriske og enkle optimeringsprægede problemer.
5. **Cirklen** *(implementeret)* — aflæs og opstil cirklens ligning; brug kvadratkomplettering til centrum og radius; undersøg om et punkt ligger på cirklen; bestem skæringer med linjer og akser; opstil tangenter og løs blandede problemer med cirkler og linjer.

Progressionen er bevidst kumulativ: koordinater og længde fra Modul 1 bruges i alle senere moduler; skalarprodukt fra Modul 2 bruges til vinkler og ortogonalitet; tværvektor og determinant fra Modul 3 bliver arbejdsredskaber til linjer; Modul 4 leverer linjemetoderne til cirklens tangenter og skæringer i Modul 5.

## Formelle læringsmål

Undervisningsbeskrivelsens mål for temaet er kodet sådan:

- **F1:** anvende matematiske værktøjsprogrammer til symbolbehandling og problemløsning;
- **F2:** operere med og redegøre for matematiske ræsonnementer og beviser;
- **F3:** demonstrere viden om matematikanvendelse inden for udvalgte områder;
- **F4:** demonstrere viden om fagets metoder og identitet;
- **F5:** anvende begreber og metoder fra diskret matematik inden for udvalgte områder;
- **F6:** beherske mindstekrav og grundlæggende matematiske færdigheder og kompetencer inden for kernestoffet.

Kernestoffet er **vektorer**, **plangeometri**, **opgaver uden hjælpemidler** og **CAS**.

## Læringsmål fordelt på moduler

| Modul | Konkrete læringsmål | Formelle mål og kernestof |
| --- | --- | --- |
| 1 · Vektorer i planen | Punkt kontra vektor; koordinater; vektor mellem punkter; sum, differens, skalarmultiplikation og linearkombination; længde; midtpunkt; parameterbestemte vektorer; geometrisk fortolkning. | F1–F4, F6. Vektorer, plangeometri, håndregning og CAS-kontrol. |
| 2 · Skalarprodukt og vinkler | Skalarprodukt; ortogonalitet; spids/ret/stump vinkel; vinkel mellem vektorer; parameterbestemmelse; minimumslængde i en simpel parameteropgave. | F1–F4, F6. Ræsonnement via fortegnet for skalarproduktet og dokumenteret CAS ved trigonometriske ligninger. |
| 3 · Projektion, tværvektor og determinant | Projektion i begge retninger; tværvektor; determinant; parallelitet; orientering; areal af parallelogram og trekant; blandede parameteropgaver. | F1–F6. F5 placeres primært her gennem klassifikation efter determinantens fortegn og nul/ikke-nul samt systematisk opdeling i parallel/ikke-parallel og orientering. |
| 4 · Linjen | Linjens ligning og parameterfremstilling; retnings- og normalvektor; skæringer; parallelitet og ortogonalitet; afstand fra punkt til linje; vinkel med akser; geometriske problemer. | F1–F4, F6. Plangeometri, problemløsning, håndregning og CAS til ligningssystemer/parameteropgaver. |
| 5 · Cirklen | Centrum-radius-form; udvidet form og kvadratkomplettering; punktplacering; skæringer; tangenter; blandede linje–cirkel-problemer. | F1–F4, F6. Samlet matematisk argumentation, håndregning og CAS til skæringer og tunge systemer. |

### Tværgående mål

- **Matematisk ræsonnement:** hvert modul indeholder mindst én “vis/undersøg/forklar”-opgave, hvor et resultat skal begrundes og ikke blot beregnes.
- **Problemløsning og anvendelse:** metoderne bruges i ukendte eller blandede geometriske situationer, ikke kun i rene formeløvelser.
- **Uden hjælpemidler:** hvert modul har et tydeligt håndregningsspor med tal, der kan behandles eksakt.
- **CAS:** hvert modul viser, hvad eleven skal opstille selv, hvilken kommando eller ligning værktøjet må behandle, og hvordan output kontrolleres og fortolkes.
- **Metodebevidsthed:** eleven skal kunne forklare, hvorfor netop en vektor-, skalarprodukt-, determinant-, linje- eller cirkelmetode passer til problemet.

## Kontrol: alle mål er placeret

| Mål | Primær placering | Gentages i | Kontrolpunkt |
| --- | --- | --- | --- |
| F1 · Værktøjsprogrammer | Modul 1 | Modul 2–5 | CAS-spor med opstilling, output, kontrol og konklusion. |
| F2 · Ræsonnementer og beviser | Modul 2–3 | Modul 1, 4–5 | “Vis/undersøg/forklar” og begrundede klassifikationer. |
| F3 · Matematikanvendelse | Modul 4–5 | Modul 1–3 | Geometriske problemer, afstande, arealer, skæringer og tangenter. |
| F4 · Metoder og identitet | Modul 1 | Modul 2–5 | Metodevalg og skift mellem algebraisk og geometrisk repræsentation. |
| F5 · Diskret matematik | Modul 3 | Modul 2, 4 | Nul/ikke-nul, fortegn, orientering og systematiske tilfælde. |
| F6 · Mindstekrav | Modul 1 | Modul 2–5 | Forudsætningstjek og stigende opgaver med eksakt håndregning. |
| Vektorer | Modul 1–3 | Modul 4–5 | Fra koordinater til retnings-/normalvektorer og radiusvektorer. |
| Plangeometri | Modul 1 | Modul 2–5 | Koordinatsystem, afstand, vinkel, areal, linje og cirkel. |
| Uden hjælpemidler | Modul 1 | Modul 2–5 | Særskilt markerede opgaver i alle fem moduler. |
| CAS | Modul 1 | Modul 2–5 | Særskilt markerede hjælpemiddelopgaver i alle fem moduler. |

Der er dermed ingen uplacerede formelle mål eller kernestofpunkter. F5 har svagere direkte forbindelse til undervisningsarkene end de øvrige mål; placeringen i Modul 3 er den fagligt mest naturlige og suppleres med klassifikationsopgaver i senere moduler.

## Navigation og progression i appen

- Et nyt hovedemne får sin egen startside og et synligt femtrins-moduloverblik.
- Modul 1–4 markeres **gennemført**, og Modul 5 vises som **åbent nu**. Hele forløbet er implementeret, mens markeringen bevarer et tydeligt aktuelt trin i progressionen.
- En fast lokal navigationsbjælke fører til forløb, starttjek, grundlag, teori, eksempler, øvelser, CAS og forståelsestjek.
- Starttjekket låser ikke modulet. Specifik feedback peger på det relevante grundkort, og ligningsopgaver linker til appens eksisterende ligningsforløb.
- Fremdrift vises separat for starttjek, træning og forståelsestjek. Korrekte svar kan altid gennemgås igen.
- På mobil brydes figurer, tospaltede eksempler og svarfelter ned til én kolonne, mens den lokale navigation forbliver vandret scrollbar.

## Fælles modulskabelon

1. **Modulstart:** hovedidé, relevans og konkrete læringsmål.
2. **Kort forudsætningstjek:** 4–6 spørgsmål med specifik feedback og vej tilbage til koordinater, fortegn, brøker/ligninger, kvadrater/rødder, Pythagoras eller trigonometri.
3. **Grundkort efter behov:** ultrakorte genbesøg af de byggesten, modulet faktisk bruger.
4. **Kort teori:** én idé ad gangen med MathML, ord og en tydelig figur.
5. **Gennemregnede eksempler:** nummererede trin, begrundelse og geometrisk kontrol.
6. **Træning i niveauer:** aflæs/genkend, beregn, anvend og forklar. Hints afslører næste trin, ikke facit.
7. **Hjælpemiddelspor:** markeret skel mellem håndregning og CAS samt krav om kontrol og fortolkning.
8. **Afsluttende forståelsestjek:** blandede opgaver, hvor eleven selv vælger metode.
9. **Opsummering:** fast arbejdsgang, typiske fejl og næste modul.

## Kildespor

- Læseplanen fastlægger de fem undervisningsgange i rækkefølgen vektorer, skalarprodukt/vinkel, projektion/tværvektor/determinant, linjen og cirklen.
- Undervisningsbeskrivelsen fastlægger de seks formelle mål og kernestoffet vektorer, plangeometri, opgaver uden hjælpemidler og CAS.
- Undervisningsarkene fastlægger de konkrete opgavetyper, herunder midtpunkter og linearkombinationer i Modul 1, punkt–linje-afstand i Modul 4 samt kvadratkomplettering og tangenter i Modul 5.
