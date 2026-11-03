# Backlog: Fra opgavesprog til matematisk forståelse

Dato: 3. november 2026. Status: første lokale implementering er udført; rigtige modeltests og produktionsudgivelse mangler. Se status nedenfor.

## Mål og afgrænsning

Christian har bekræftet behovet: Han skal kunne vise et billede, indsætte tekst eller beskrive en opgave med egne ord og få en konkret retning — fx integralregning eller normalfordeling — med en kort forklaring på, hvilke tegn i opgaven der peger den vej. Han skal ikke kende emnet på forhånd. Første version prioriterer denne oversættelse over beregningshjælp.

**Ansvar:** Codex udfører alle backlogopgaver: finder kildemateriale, udvælger og fremstiller testopgaver, skriver eksempelsvar, kontrollerer matematikken, implementerer og evaluerer. Jacob skal ikke levere opgaveeksempler, skrive forventede svar eller godkende en pædagogisk prøvepakke for at arbejdet kan fortsætte. Feedback fra Christian er velkommen efter levering, men er ikke en afhængighed eller udgivelsesblokering. Faktisk læringseffekt kan ikke bekræftes gennem tekniske tests alene.

Implementeringen er igangsat efter Jacobs efterfølgende anmodning. Produktionsudgivelse er endnu ikke udført. Ved senere udførelse håndteres eventuel manglende API-adgang eller driftsadgang som en konkret teknisk afhængighed; simulerede svar må ikke præsenteres som verificerede rigtige modelkald.

Vejledningen har tre trin:

1. **Forstå opgaven:** konkrete ord, tal eller figurer → betydning i situationen → matematisk begreb → hvad skal findes?
2. **Find en vej:** begreb → relevant egenskab → mulig metode og dens betingelser.
3. **Regn videre:** konkret hjælp, som udgangspunkt ét trin ad gangen. En udtrykkelig anmodning om guidet gennemgang må føre gennem hele løsningen.

Trin 1 er standard og skal gerne navngive det relevante emne eller begreb med det samme, når opgaven giver grundlag for det. Eleven skal have en brugbar pointer uden først at gennemføre en spørgerunde. Eleven må frit bede om næste trin eller en enklere forklaring; systemet skal ikke kræve korrekte svar for at give hjælp. En direkte anmodning om trin 2 eller 3 skal respekteres.

Eksisterende fundament: `webapp/tutor.js`, `webapp/server/tutor.js` og `webapp/api/tutor.js` har en opgavebundet tekstchat. `webapp/README.md` beskriver kontekst, lagring, login og begrænsninger. Den eksisterende kode giver ikke visuel billedforståelse eller fælles pensumopslag. Drift og modelkonfiguration er ikke verificeret i denne plan.

## Leverancer og rækkefølge

| Milepæl | Indhold | Afsluttes når |
| --- | --- | --- |
| M0: Pædagogisk afklaring | B01–B03 | Codex har udvalgt opgaver fra materialet, skrevet forventede svar og fastlagt vurderingsrubrikken. |
| M1: Fagligt grundlag | B04–B06 | Pilotens opgavetyper har kontrollerede begrebsbroer, teori og links. |
| M2: Billede- og tekstpilot | B07–B09, B11–B13 | En intern pilot modtager billeder, opgavetekst og frie beskrivelser og giver en begrundet retning. |
| M3: Første brugbare version | B14–B16 | Codex har evalueret faktiske modelkald og brugerforløb, rettet fejl og opfyldt udgivelseskriterierne. |
| M4: Udvidelse | B10, B17–B19 | Udvides ud fra evalueringer og eventuel senere brugerfeedback. |

Prioritet P0 betyder nødvendig for første brugbare version. P1 er efterfølgende forbedring. Størrelse S/M/L er relativ arbejdsstørrelse, ikke et tidsestimat. Alle opgaver ejes og udføres af Codex. Ingen kræver opgaveeksempler eller deltagelse fra Jacob eller Christian. Hovedmenuens billed- og tekstindgang prioriteres før integration i blandede sæt.

## M0 — Beslut hvad god hjælp er

### B01 · P0 · M — Saml repræsentative problemer

**Leverance:** Codex udvælger 20–30 udviklingsopgaver fra `Pensum`, appens opgavebank og eksisterende blandede sæt med kilde, emner, formulering og forventet forståelsesproblem. Tilføj 8–10 særskilte evalueringsopgaver, som ikke bruges i instruktioner eller eksempelsamtaler. Fremstil selv tekstvarianter, beskrivelser med hverdagssprog og billedfixtures fra materialet; markér konstruerede varianter som sådanne. Ingen opgaver skal indsamles af Jacob.

**Dækning:** Repræsentér alle hovedområder i pensumkortet, herunder integraler, normalfordeling og differentialregning, samt centrale fundamentopgaver. Billedfixtures skal omfatte læsbare sider, beskæring, rotation og sløring; syntetiske billeder må ikke fremstilles som test af Christians faktiske fotos eller håndskrift.

**Acceptkriterier:** Samlingen rummer tekst, grafer, symbolopgaver, flere delspørgsmål og opgaver med flere mulige metoder. Medtag samme ord med forskellig betydning, fx maksimum i forskellige sammenhænge, og forskellen mellem tidspunkt og funktionsværdi. Marker ukendte oplysninger om Christians vanskeligheder som hypoteser.

**Afhængigheder:** Ingen.

### B02 · P0 · M — Skriv eksempelsamtaler på tre trin

**Leverance:** 8–10 fagligt kontrollerede samtaler med et godt første svar, enklere forklaring, metodehjælp og guidet gennemgang. Medtag kanonkugleeksemplet og mindst én opgave uden hverdagssprog.

**Acceptkriterier:** Første svar udpeger faktiske tegn i opgaven, forklarer betydningen og præciserer målet. Det angiver en konkret faglig retning, når der er grundlag for det, og springer ikke automatisk til en beregningsopskrift. Fagord forklares. Eleven får højst ét spørgsmål ad gangen, og hjælpen bliver mere konkret, når eleven stadig er forvirret. Tonen er voksen og uden vurderinger som »det er nemt«.

**Afhængigheder:** B01.

### B03 · P0 · S — Fastlæg kvalitetsrubrik og pilotmål

**Leverance:** En rubric med 0–2 point på hver af: korrekt opgavelæsning, konkrete tegn, forståelig oversættelse, korrekt mål og passende hjælpetrin. Registrer separat faktuelle fejl, opdigtede oplysninger/links og utilsigtet udlevering af hele løsningen.

**Acceptkriterier:** Et svar består ved mindst 8/10 og ingen kritisk fejl. Foreslået udgivelsesgrænse: mindst 90 % beståede svar på det adskilte evalueringssæt over tre kørsler og ingen kritiske fejl i disse kørsler. Dette er en intern kvalitetsgrænse, ikke dokumentation for læringseffekt. Codex vurderer, om svaret forklarer, hvad der skal findes, giver en begrundet faglig retning og peger på et muligt første skridt; korrekt slutsvar er ikke det primære mål. Om Christian faktisk får et aha-øjeblik, er senere brugerfeedback og ikke et kriterium, Codex kan erklære opfyldt på hans vegne.

**Afhængigheder:** B02.

## M1 — Forbind opgaver med pensum

### B04 · P0 · M — Kortlæg faktisk tilgængeligt pensum og appindhold

**Leverance:** Register over emner, kilder, konkrete teoriafsnit og gyldige appdestinationer. Brug `OVERBLIK.md`, undervisningsmateriale og appens indhold; adskil planlagt pensum fra implementeret indhold.

**Acceptkriterier:** Alle hovedområder i pensumkortet har en emnebeskrivelse og verificerede kilder; eksisterende appdestinationer kontrolleres. Manglende teori og forklaringer registreres som huller. Ingen henvisning hævder, at et afsnit findes i appen, hvis det ikke gør.

**Afhængigheder:** B01.

### B05 · P0 · L — Skriv begrebsbroer til pilotens opgavetyper

**Leverance:** Strukturerede kort med tegn i opgaven, situationsbetydning, matematisk begreb, ønsket størrelse/enhed, mulige metoder, betingelser, forudsætninger, forvekslinger og teorihenvisninger. Start med ca. 15–20 opgavetyper udvalgt fra B01 med mindst én begrebsbro pr. hovedområde, så første version kan give retning på tværs af pensum. Udvid antal efter behov for at dække evalueringsopgaverne.

**Acceptkriterier:** Kortene dækker pilotopgaverne og indeholder modeksempler, så nøgleord ikke alene bestemmer metoden. Fx er en vandret tangent ikke nødvendigvis et maksimum; endepunkter kan være relevante. Flere metoder og flere trin kan repræsenteres. Codex kontrollerer forklaringerne mod kildematerialet og efterprøver relevante beregninger uafhængigt af de genererede svar; kilden og kontrollen registreres.

**Afhængigheder:** B02, B04.

### B06 · P0 · M — Design og evaluér pensumopslag

**Leverance:** En enkel mekanisme, der vælger relevante begrebsbroer og teoristykker ud fra opgaven. Start med et lille struktureret katalog; beslut først behov for semantisk søgning, når katalogets størrelse og fejl viser det.

**Acceptkriterier:** På evalueringsopgaverne findes mindst én fagligt passende bro blandt de højst tre foreslåede kort i mindst 90 % af tilfældene. Opgaver uden dækning giver tydelig usikkerhed frem for en tvungen matchning. Konkrete links vælges fra registret. Opgaveindhold behandles som data, også når det indeholder instruktioner til modellen.

**Afhængigheder:** B05.

## M2 — Byg en intern billede- og tekstpilot

### B07 · P0 · M — Afklar fælles kontekst og serverkontrakt

**Leverance:** Fælles format for ekstern opgave og appopgave: opgavetekst, oprindelse, delspørgsmål, valgt hjælpetrin, samtale, relevante kilder og eventuel billedfortolkning. Genbrug den eksisterende tutorserver, hvor det er hensigtsmæssigt.

**Acceptkriterier:** Ny opgave starter en separat samtale; kontekst fra tidligere opgaver blandes ikke ind. Eksisterende opgavechat fungerer fortsat. Kilder og appdestinationer valideres på serveren. Facit adskilles fra elevvendt vejledning. Login og eksisterende adgangskontrol bevares.

**Afhængigheder:** B02, B06.

### B08 · P0 · L — Implementér vejledningens tre trin

**Leverance:** Instruktioner og samtalestyring med trin 1 som standard samt eksplicit adgang til metodehjælp og guidet gennemgang.

**Acceptkriterier:** Første svar følger B02 og B03. Systemet kan forklare samme opgave enklere uden blot at gentage svaret. Direkte ønsker om metode eller gennemgang efterkommes. Et manglende eller tvetydigt delspørgsmål udløser en konkret afklaring. Instruktioner alene betragtes ikke som garanti; faktisk modeladfærd evalueres i B14.

**Afhængigheder:** B07.

### B09 · P0 · M — Tilføj indgang i hovedmenuen

**Leverance:** »Hjælp mig med at forstå opgaven« med tekstfelt, billedindgang fra B11 og samtale. Tekstfeltet accepterer både en præcis opgavetekst og en uformel beskrivelse som »noget med sandsynligheden for, at en højde ligger mellem to tal«. Vis hjælpetrinnene i almindeligt sprog, fx »Forklar enklere«, »Vis mig tegnene« og »Hvordan kommer jeg videre?«.

**Acceptkriterier:** Christian kan begynde uden at vælge emne eller kende fagord. Opgaven forbliver synlig under samtalen. Indsendelse, ventetid, fejl og nyt forsøg er tydelige; indtastet tekst mistes ikke. Mobilvisning og tastaturbetjening fungerer. Ved en ufuldstændig beskrivelse giver hjælperen en betinget retning, hvis muligt, og spørger kun efter de oplysninger, der er nødvendige for at komme videre; den opfinder ikke en opgave.

**Afhængigheder:** B08.

### B12 · P0 · M — Vis tegn og præcise teorihenvisninger

**Leverance:** Korte citater fra opgaven med tilknyttet forklaring og et relevant teoriuddrag/link. Begynd med citater; markering direkte oven på fotos er ikke nødvendig i første version.

**Acceptkriterier:** Tekstcitater kan findes i opgaven, og billedcitater adskilles fra bekræftet originaltekst. Matematiske udtryk vises læsbart og sikkert. Teorilinket åbner det relevante afsnit og bevarer samtalen. Der vises ikke en lang liste af emner som erstatning for vejledning.

**Afhængigheder:** B04, B08, B09.

### B13 · P0 · M — Afgræns lagring, forbrug og fejlforløb

**Leverance:** Beslutning om samtalers levetid, sletning, billedbehandling, modelvalg og forbrugsgrænser. Verificer den valgte udbyders aktuelle billed-, data- og API-egenskaber ved implementering. Genbrug serverbaserede nøgler og brugerbegrænsning.

**Acceptkriterier:** Originalbilleder gemmes ikke permanent som standard; faktisk behandling og opbevaring beskrives præcist. Brugere kan ikke læse hinandens samtaler. Der er grænser for billedstørrelse, beskeder og forbrug samt forståelige timeout- og kvotebeskeder. Diagnostik indeholder ikke rå billeder eller hele samtaler som standard. En fejl ændrer ikke point, køb eller opgavebesvarelser.

**Afhængigheder:** B07. Skal afsluttes før rigtige brugerforløb med billeder og modelkald.

### B11 · P0 · L — Understøt foto, skærmbillede og indsætning

**Leverance:** Upload og indsætning af billeder, forhåndsvisning, fjern/erstat billede samt mulighed for at rette den læste opgavetekst. Afklar relevante mobilformater og behov for konvertering.

**Acceptkriterier:** Afprøv trykt tekst, håndskrift, brøker, eksponenter, grafer og billeder med flere opgaver. Ved afgørende tvivl spørger hjælperen konkret frem for at gætte. Eleven kan vælge delopgave og korrigere aflæsningen; rettelsen bruges i næste svar. En læsbar opgave kræver ikke obligatorisk bekræftelse af hvert symbol. Store eller ikke-understøttede filer afvises forståeligt. Billeddata går gennem den godkendte serverløsning.

**Afhængigheder:** B07–B09, B13.

## M3 — Selvstændig kvalitetssikring og udgivelse

### B14 · P0 · L — Evaluér faglig kvalitet og faktiske brugerforløb

**Leverance:** Gentagelig evaluering på B01/B03 med rigtige modelkald og en kort fejlrapport. Supplér med målrettede automatiske tests for adgangskontrol, kontekstskift, kildevalidering og fejlforløb samt browserafprøvning af tekst og billeder.

**Acceptkriterier:** B03's kvalitetsgrænse er opfyldt. Testene inkluderer tvetydige opgaver, misvisende nøgleord, dårlig billedkvalitet og materiale uden for kataloget. Beregningstests eller simulerede modelsvar erstatter ikke vurdering af pædagogisk kvalitet. Mål svartid og forbrug på realistiske forløb; vælg model på baggrund af kvaliteten først og derefter hastighed/pris.

**Afhængigheder:** B06, B08–B09, B11–B13. B10 er ikke nødvendig for første version.

### B15 · P0 · M — Gennemfør realistiske forløb og ret problemer

**Leverance:** Codex gennemfører mindst 12 ende-til-ende-forløb i browseren: fire med billeder, fire med opgavetekst og fire med frie beskrivelser. Dæk flere fagområder, mobilvisning, fejlaflæsning, uklar beskrivelse, skift af opgave samt ønsker om mere eller mindre hjælp. Gem en kort rapport med observationer, rettelser og resterende begrænsninger.

**Acceptkriterier:** Hvert forløb giver en korrekt begrundet retning eller en nødvendig, konkret afklaring. Teorihenvisninger virker, og fejl kan rettes uden at begynde forfra. Kritiske fejl er rettet og de berørte forløb gentaget. Simulerede elevsvar bruges til at afprøve samtaleadfærd, ikke som bevis for Christians forståelse. Rapporten skelner mellem verificeret funktionalitet og antagelser om læring. Ingen elevsession eller godkendelse af eksempler kræves.

**Afhængigheder:** B14.

### B16 · P0 · M — Udgiv kontrolleret og verificér produktion

**Leverance:** Samlet Git-version, relevante tests/build og efterfølgende kontrol på produktionsadressen. Mulighed for at slå den nye indgang fra uden at fjerne eksisterende opgavechat eller elevdata.

**Acceptkriterier:** Hele Git-status inklusive nye filer er gennemgået, og afhængigheder til øvrigt arbejde er afklaret. Vercel bygger `webapp` fra `main`; resultat og berørte funktioner kontrolleres på https://christian-matematik-webapp.vercel.app efter push. Ingen direkte deploy må efterlade produktionen foran Git. Railway-appservicen gentilkobles ikke. PostgreSQL, volumen, konti, besvarelser, point og køb bevares. Eventuelle nødvendige skemaændringer er additive og særskilt gennemgået.

**Afhængigheder:** B14–B15 og lukning af kritiske fejl.

## M4 — Udvid efter evaluering og eventuel brugerfeedback

### B10 · P1 · M — Åbn hjælperen direkte fra blandede øvesæt

**Leverance:** »Forstå opgaven« på relevante blandede øveopgaver med automatisk overførsel af den valgte opgave og delspørgsmål. Kortlæg først hvilke sæt der er øvelse, og hvilke der er prøvesimulation.

**Acceptkriterier:** Christian skal ikke kopiere appens opgaver manuelt. Flere opgaver på samme side giver korrekt kontekst. Eksisterende prøvesimulationer får ikke stiltiende hjælp slået til; hvis de skal bruges med hjælp, etableres en tydelig øvetilstand. Chatten kan ikke give point eller markere en opgave som løst.

**Afhængigheder:** B07–B09.

### B17 · P1 · L — Udbyg dybden på tværs af pensum

**Leverance:** Flere begrebsbroer, teoriuddrag og evalueringsopgaver, prioriteret efter mangler i evalueringen, eksisterende blandede sæt og eventuel brugerfeedback. Codex finder selv de supplerende opgaver i materialet.

**Acceptkriterier:** Hvert nyt område har faglig gennemgang og evaluering. Der er synligt overblik over dækkede og manglende områder; systemet påstår ikke fuld pensumdækning før den er verificeret.

**Afhængigheder:** B15.

### B18 · P1 · M — Tilbyd korte øvelser i at genkende opgavetyper

**Leverance:** Efter en samtale kan Christian frivilligt prøve en lignende opgave, hvor han kun skal identificere målet, tegnene eller metoden.

**Acceptkriterier:** Øvelsen kræver ikke hele beregningen. Feedback forklarer forbindelsen. Samme opgaveformulering genbruges ikke som eneste mål for forståelse. Øvelsen afbryder ikke hans igangværende opgave.

**Afhængigheder:** B15.

### B19 · P1 · L — Afprøv gradvis reduktion af støtte

**Leverance:** Enkle, gennemsigtige forslag om, at Christian selv prøver at udpege tegn eller metode, når han føler sig klar. Overvej først derefter en begrænset elevhukommelse.

**Acceptkriterier:** Hjælpen kan altid skrues op igen. Systemet antager ikke mestring ud fra ét rigtigt svar eller antal beskeder. Eventuel hukommelse har et klart formål, kan rettes/slettes og indeholder ikke unødvendige personlige vurderinger.

**Afhængigheder:** B15, B18.

## Første arbejdspakke

Codex starter med B01–B05: udtrækker selv opgaver fra projektet, skriver eksempelsvar, kontrollerer dem og etablerer et tværgående emnekort. Derefter fortsættes til pensumopslag og hovedmenuens billed- og tekstforløb uden at vente på, at Jacob leverer eller gennemgår eksempler. Materialet gemmes som reviewbare arbejdsartefakter, men review er ikke en særskilt brugerafhængighed.

Når implementering igangsættes, er rækkefølgen: B01–B05 → B06–B09 og B13 → B11–B12 → B14–B16. B10 og B17–B19 er senere udvidelser. Første version er først færdig, når både billeder og tekst/frie beskrivelser fungerer.

Udskudt fra første version: automatisk læringsplan, omfattende elevprofil, stemmesamtaler, finjustering af en model, ændringer i point/butik samt præcis grafisk markering oven på billeder. Ingen af disse er nødvendige for at afprøve den centrale begrebsbro.


## Implementeringsstatus — 3. november 2026

- Implementeret lokalt: hovedmenuindgang, tekst/frie beskrivelser, foto-upload og indsætning, aflæsning/rettelser, tre hjælpetrin, teoriuddrag og verificerede links, adskillelse fra eksisterende opgavechat, afgrænset billedtransport og hukommelsesbaseret samtale.
- Fagligt grundlag: 24 kuraterede begrebsbroer på tværs af pensum og fundament, 24 udviklingscases, 10 særskilte evalueringscases og otte håndskrevne referenceforløb. Cases er konstruerede varianter med kildehenvisning; de er ikke dokumentation for Christians konkrete fejl.
- Teknisk verificeret: 133 eksisterende tests, seks tutor-servertests, fem guide-servertests, eksisterende tutor-browserforløb og 12 nye browserforløb med simulerede svar. Build består. Billedrendering og mobilvisning er gennemgået visuelt.
- B14/B15 er kun delvist afsluttet: rigtige modelkald og pædagogisk vurdering mangler. Vercel bekræfter, at produktionsnøgle og model er konfigureret, men begge er beskyttede værdier, som ikke kan hentes lokalt. Ingen rigtig AI-evaluering er derfor udført eller bestået. Evalueringsscriptet afslår tydeligt at køre uden en brugbar nøgle.
- B16 er ikke udført: intet push eller deploy. Konti, besvarelser, point og køb er uberørte. Før udgivelse skal modellen verificeres for billeder og strukturerede svar, og rubric-grænsen skal opfyldes.
- B10 og B17–B19 er fortsat senere udvidelser. Kataloget er et kontrolleret pensumoverblik, ikke en fuld indeksering af alle pensumdokumenter.
