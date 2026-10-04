# Plan for hovedemnet Differentialregning

Planen bygger på `Pensum/Læseplan.pdf`, `Pensum/Undervisningsbeskrivelse.pdf` og de fire undervisningsark i `Pensum/1. Differentialregning`.

## Samlet læringsrækkefølge

1. **Differentialkvotient** — fra funktionsværdi, graf og hældning til sekant, tangent og differentialkvotient. Tretrinsreglen bruges som ræsonnement, hvorefter de grundlæggende afledningsregler trænes både uden hjælpemidler og med CAS-kontrol. Væksthastigheder fortolkes med fortegn og enheder.
2. **Produktreglen** *(implementeret)* — genkend produkter, navngiv de to faktorer og anvend produktreglen. Kombinér med grundregler, bestem funktionsværdier og væksthastigheder, og løs tangentopgaver med parallelle linjer.
3. **Kædereglen** *(implementeret)* — genkend indre og ydre funktion, differentier indefra og ud, og kombiner kædereglen med produktreglen. Arbejd med eksponential-, logaritme-, potens- og trigonometriske modeller.
4. **Vendetangent** *(implementeret)* — bestem tangentligninger, skæringer og parallelle tangenter. Undersøg vendepunkter og tidspunkter med størst eller mindst væksthastighed i modeller.
5. **Opsamling og eksamenstræning** — saml fortegnet for den afledte i monotoniforhold, ekstrema og optimering. Vælg bevidst mellem håndregning og CAS, og træn blandede opgaver med og uden hjælpemidler.

## Læringsmål fordelt på moduler

De formelle mål fra undervisningsbeskrivelsen er kodet sådan:

- **F1:** anvende funktionsudtryk og afledede funktioner i matematiske modeller;
- **F2:** anvende matematiske værktøjsprogrammer til symbolbehandling og problemløsning;
- **F3:** operere med og redegøre for matematiske ræsonnementer og beviser;
- **F4:** demonstrere viden om matematikanvendelse inden for udvalgte områder;
- **F5:** demonstrere viden om fagets metoder og identitet;
- **F6:** anvende begreber og metoder fra diskret matematik inden for udvalgte områder;
- **F7:** beherske mindstekrav og grundlæggende færdigheder inden for kernestoffet.

| Modul | Formelle mål | Kernestof og placering |
| --- | --- | --- |
| 1 · Differentialkvotient | F1–F7 | Tretrinsregel; grundlæggende opgaver uden hjælpemidler; CAS som kontrol. F6 dækkes ved at sammenligne ændring over diskrete tidsskridt med den kontinuerte, øjeblikkelige ændring. |
| 2 · Produktreglen | F1–F5, F7 | Produktregel, modelanvendelse, ræsonnement og opgaver med og uden hjælpemidler. |
| 3 · Kædereglen | F1–F5, F7 | Kædereglen, sammensatte modeller og CAS ved tung symbolbehandling. |
| 4 · Vendetangent | F1–F5, F7 | Tangenter, vendepunkter, størst væksthastighed og begyndende optimering. |
| 5 · Opsamling | F1–F7 | Monotoniforhold, fuld optimering, blandede opgaver uden hjælpemidler og dokumenteret CAS-brug. |

### Modul 1 · Differentialkvotient

- forstå den afledte som tangentens hældning og øjeblikkelig ændringshastighed;
- sammenligne ændring over diskrete skridt med den kontinuerte, øjeblikkelige ændring;
- opstille differenskvotienten og redegøre for tretrinsreglen;
- differentiere summer af konstanter, potens-, rod-, reciprok-, eksponential-, logaritme- og sinusfunktioner;
- bestemme både en afledt funktion og en afledt værdi;
- fortolke en afledt værdi med fortegn, tidspunkt og enhed i en model;
- løse grundlæggende opgaver uden hjælpemidler og kontrollere resultatet med CAS.

### Modul 2 · Produktreglen

- genkende et produkt af funktioner og anvende produktreglen;
- kombinere produktreglen med grundreglerne;
- bestemme og fortolke funktionsværdier og væksthastigheder i modeller;
- opstille en enkel model ud fra data og bruge den afledte;
- argumentere for voksende funktioner og finde tangenter med en given hældning.

### Modul 3 · Kædereglen

- identificere indre og ydre funktion i et sammensat udtryk;
- anvende kædereglen på potens-, eksponential-, logaritme- og trigonometriske funktioner;
- kombinere kæde- og produktreglen;
- anvende afledede funktioner i vækst-, henfalds- og logistiske modeller;
- fortolke resultater og enheder og kontrollere komplekse udtryk med CAS.

### Modul 4 · Vendetangent

- bestemme tangentligningen ud fra et røringspunkt;
- finde skæringspunkter mellem tangent, graf og akser;
- finde parallelle tangenter ved at sammenligne hældninger;
- undersøge vendepunkter og vendetangenter;
- bestemme største og mindste væksthastighed i modeller;
- forbinde graf, afledt funktion og modelkontekst.

### Modul 5 · Opsamling

- opstille fortegnsskema og bestemme monotoniforhold;
- finde lokale og globale ekstrema;
- opstille og løse optimeringsproblemer;
- vælge og dokumentere en metode med eller uden hjælpemidler;
- bruge CAS til symbolbehandling, ligningsløsning og kontrol uden at erstatte den matematiske forklaring;
- anvende funktionsudtryk og afledede funktioner i matematiske modeller samt redegøre for ræsonnementer og fagets metoder.

## Navigation og progression

- Hovedemnet åbner med et moduloverblik, så hele forløbet er synligt fra begyndelsen.
- Modul 1–4 er åbne; den afsluttende opsamling vises som næste trin, så strukturen kan udbygges uden at ændre navigationen.
- En fast lokal indholdsnav fører til forløbsplan, starttjek, idé, regler, eksempler, øvelser og forståelsestjek.
- Hvert starttjek linker tilbage til relevante grundforløb om ligninger og sammensatte funktioner.
- Fremdrift vises særskilt for starttjek, træning og forståelsestjek. Et korrekt svar låses ikke; eleven kan altid prøve igen.

## Fælles modulskabelon

1. **Modulstart:** hvorfor stoffet er vigtigt, og hvilke læringsmål modulet har.
2. **Forudsætningstjek:** 3–5 korte spørgsmål om de nødvendige byggesten med direkte vej tilbage til grundstoffet.
3. **Kort teori:** én idé ad gangen, korrekt MathML og tydelig sammenhæng mellem symbol, graf og ord.
4. **Gennemregnede eksempler:** nummererede skridt, begrundelse for hvert skridt og en afsluttende kontrol eller fortolkning.
5. **Øvelser i niveauer:** genkend, udfør, anvend og forklar. Alle øvelser har valgfrit hint og specifik feedback ved fejl.
6. **Hjælpemiddelspor:** marker tydeligt hvad der forventes uden hjælpemidler, og hvordan CAS bruges som kontrol eller til tung symbolbehandling.
7. **Forståelsestjek:** blandede spørgsmål, hvor eleven selv vælger metode og fortolker resultatet.
8. **Opsummering:** en fast arbejdsgang, typiske fejl og et tydeligt næste modul.

## Kildespor

- Læseplanen placerer de fire undervisningsgange i rækkefølgen differentialkvotient, produktregel, kæderegel og vendetangent og har senere særskilt repetition af monotoniforhold og optimering.
- Undervisningsbeskrivelsen angiver tretrinsregel, monotoniforhold, optimering, opgaver uden hjælpemidler og CAS som kernestof samt modellering, værktøjsbrug, ræsonnementer og mindstekrav som faglige mål.
- Undervisningsarkene bestemmer funktionstyperne, opgavetyperne og vægten på fortolkning af afledede værdier med enheder.
