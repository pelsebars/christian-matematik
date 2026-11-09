# Login og personlige fremskridt

Produktionsadressen er:
https://christian-matematik-webapp.vercel.app

## Arkitektur

- Vercel serverer `dist/` og API-ruterne under `api/`.
- Railway kører PostgreSQL. Browseren modtager aldrig databaseadgang eller loginhemmeligheden.
- Better Auth kører i vores egen serverkode: brugernavn/adgangskode, scrypt-hashes, HttpOnly-sessioncookies, udløb, CSRF/origin-kontrol og databasebaseret begrænsning af loginforsøg.
- Better Auth kræver et internt email-felt. Serveren afleder en adresse under det reserverede `users.invalid` fra brugernavnet. Der indsamles ikke mailadresser og sendes ingen mails.
- `learning_state` indeholder brugerens svar, hints og aktuelle opgavesæt pr. lagringsområde. Revisioner stopper samtidige overskrivninger.
- `learning_completion` registrerer første korrekte løsning pr. bruger og versioneret opgave. En opgavefamilie i banken tæller én gang, uanset hvor mange seeds der øves.
- `learning_completion.points_awarded` gemmer undervisningens butikspoint pr. løsning: 1 første gang, 0 ved gentagelser. Nye opgavebank-løsninger registreres med 0 her, fordi deres point tildeles pr. sæt i `bank_set_reward`. Optjente point er summen af undervisningspoint og sættenes automatiske point; trænings- og prøvesæts resultatpoint ændres ikke. Beløbet accepteres ikke fra browseren. Den genkørbare migrering giver også eksisterende løsninger 1 point hver. Kør `npm run db:migrate` før deployment af denne version. Saldoen vises i Mit overblik efter synkronisering; lokal forhåndsvisning optjener ikke butikspoint. Butikken trækker køb fra saldoen uden at ændre løsninger eller optjente point.
- Alle læsninger og skrivninger afgrænses på serveren til den bruger, sessionen tilhører. Et indsendt bruger-ID har ingen virkning.
- Eksisterende lokale svar kopieres ikke automatisk til en konto. De gamle browserdata slettes heller ikke.

## Første produktionsopsætning

1. Opret et Railway-projekt, fx `christian-matematik`, med PostgreSQL og en europæisk region. Vælg/acceptér selv den ønskede prisplan og konfigurer backups.
2. Find databasens **offentlige** forbindelsesadresse (`DATABASE_PUBLIC_URL`/public connection string). Vercel kan ikke bruge Railways private `.railway.internal`-adresse. Bevar de TLS-indstillinger, Railway angiver. Slå ikke certifikatkontrol fra globalt.
3. I Vercel-projektet skal Root Directory være `webapp` ved deployment fra Git-repoet. Framework er Other, build-kommando er `npm run build`, og output er `dist` (defineret i `vercel.json`). En tidligere manuel override af den tomme build-kommando/output `.` skal fjernes eller opdateres. Brug Node 22 eller nyere, som Vercel understøtter.
4. Tilføj servermiljøvariablerne i Vercel:
   - `DATABASE_URL`: Railways offentlige Postgres-forbindelse.
   - `DATABASE_CA_CERT`: Railway-databasens offentlige CA-certifikat (`/certs/root.crt` på Postgres-volumen). Hentes via autentificeret Railway-adgang; aldrig den private nøgle. Indsæt hele PEM-certifikatet som en miljøvariabel.
   - `DATABASE_TLS_NAME`: `postgres.railway.internal` for den nuværende Railway-databases certifikat. Certifikatkæde og navn verificeres også gennem den offentlige TCP-proxy. Opdatér CA-certifikatet ved certifikatudskiftning.
   - `BETTER_AUTH_URL`: `https://christian-matematik-webapp.vercel.app`
   - `BETTER_AUTH_SECRET`: en tilfældig hemmelighed på mindst 32 tegn. Generér fx med `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Kopiér `.env.example` til en lokal `.env` og indsæt de samme værdier dér. Filen ignoreres af Git. Del aldrig forbindelsesstrenge eller hemmeligheder i chat eller commits.
6. Kør `npm ci` og `npm run db:migrate` fra `webapp`. Migreringen opretter Better Auth-tabellerne og fremskridtstabellerne; den er genkørbar og sletter ikke eksisterende data.
7. Deploy først, når migreringen er gennemført og servervariablerne er sat. Det almindelige build opretter ikke databasen og kræver ikke adgang til den.
8. Kontrollér på produktionsadressen: opret to testbrugere, løs en opgave som den første, log ud og kontrollér, at den anden har et tomt overblik. Log ind som den første fra en anden browser og kontrollér gendannelsen.

Preview-deployments skal have deres egen database og præcise `BETTER_AUTH_URL`. Undgå at dele produktionsdata med previews eller at tilføje brede wildcard-origins. Det lokale previewflag virker kun på localhost og giver aldrig API-adgang uden session.

## Lokal udvikling og test

Med en udviklingsdatabase: `.env` med `BETTER_AUTH_URL=http://127.0.0.1:3000`, derefter `npm run db:migrate` og `npm run dev`.

- `npm test`: matematisk korrekthed og opgavebank.
- `npm run test:accounts`: login, cookies, brugeradskillelse, adgangskodeskift, revisionskonflikt, adgangsbegrænsning og logout. Bruger en midlertidig PGlite-database over PostgreSQL-protokollen; ændrer ikke Railway.
- `BROWSER_CHANNEL=chrome npm run test:accounts:browser`: den samlede app med login, svar, synkronisering, brugerskift, anden enhed, netværksfejl og mobilvisning.
- `BROWSER_CHANNEL=chrome npm run test:browser`: eksisterende modulregressioner i eksplicit lokal forhåndsvisning (`?preview=1`).
- `npm run demo`: den fulde app med en midlertidig lokal testdatabase. Data forsvinder, når processen stoppes. Brug kun testkonti her.

Ved test med Playwrights egen Chromium kan `BROWSER_CHANNEL=chromium` bruges, efter browseren er installeret via Playwright.

## Adgangskoder og administration

Brugeren kan skifte sin adgangskode fra sidemenuen. Andre sessioner afsluttes ved skift. Glemt adgangskode håndteres af ejeren med databaseadgang, uden et offentligt reset-endpoint.

Fra zsh i `webapp`, med korrekt `.env`:

```zsh
read -rs 'math_reset_password?Ny midlertidig adgangskode (mindst 12 tegn): '
printf '%s' "$math_reset_password" | npm run user:reset -- BRUGERNAVN
unset math_reset_password
```

Adgangskoden læses fra stdin, gemmes som hash og bliver ikke et kommandolinjeargument. Alle brugerens eksisterende sessioner tilbagekaldes. Giv brugeren adgangskoden via en aftalt kanal, og bed vedkommende ændre den efter login. Der er endnu ikke en læreroversigt over alle brugere.

## Gemning og begrænsninger

Svarkontrol sker fortsat i browserens eksisterende matematikmotor. Registreringen er et læringsværktøj, ikke et manipulationssikkert eksamensbevis. Fritekst/egen vurdering tæller ikke som automatisk korrekt.

Ændringer sendes efter en kort pause; gemmestatus står i sidemenuen. Ikke-synkroniserede kladder gemmes i sessionStorage under den verificerede bruger. Ved netværksfejl: hold fanen åben, og brug **Gem igen**. Login skal kunne verificeres online, før brugerens svar åbnes.

En versionskonflikt stopper gemning frem for at overskrive andet arbejde. Brug **Hent kladde**, før du lukker en berørt fane. Kladdefilen indeholder personlige besvarelser og kan bruges ved manuel gendannelse; den importeres ikke automatisk. Hvis en gemt kladde er ældre end serverversionen ved genåbning, åbnes serverversionen, mens den gamle kladde bevares til eksport. Brug først **Hent kladde** til at bevare lokale ændringer som fil. **Åbn gemt version** åbner derefter serverens version og rydder den forældede lokale kø, efter brugerens bekræftelse i appen.

Opgave-ID'erne i HTML er nu eksplicitte. Bevar dem ved flytning/omformulering af samme opgave, og øg versionen ved en faglig ændring, der skal kræve en ny besvarelse. Nye moduler skal bruge `accountStorage` og kalde `markCorrect` efter automatisk korrekt svarkontrol.

## Butik og skins

Butikken findes via **Butik** i menuen eller `#shop`. Military, Terminal og The Matrix koster 40 point, Machine 60 point, en frysepizza 40 point, en personlig ÅBEN-voucher 150 point, DCS: F-4E Phantom II 300 point, en wuaucha til WhiteHorses eller DOSA Bar 250 point, en wuawcha til GASOLINE GRILL 110 point og en Lamborghini Huracán 9.600.000 point. Bilprisen bruger cirka 0,50 kr. pr. point (pizza anslået til 20 kr., øl til 75 kr.) og en registreret nypris på cirka 4,8 mio. kr. ([prisreference](https://www.nummerplade.net/nummerplade/lambo.html)). Produkter og priser er defineret i `shop-catalog.js`; API'et bruger altid serverens pris. Det oprindelige skin er gratis og kan altid genaktiveres under Mine køb. Skins købes én gang pr. konto, mens vouchers kan købes flere gange.

`shop_purchase` gemmer hvert køb med pris og et idempotent købsnummer. En lås på brugerens række serialiserer køb fra flere faner/enheder, så saldoen ikke kan bruges to gange. `shop_profile` gemmer aktivt skin. Begge tabeller er brugerafgrænsede og slettes med kontoen. Genindsendelse af samme købsnummer trækker ikke flere point. Et voucherforbrug opdaterer kun den købte voucher og trækker ikke point igen.

`GET /api/shop` henter butik og saldo; `POST` køber; `PUT` aktiverer et ejet skin eller markerer egen voucher brugt. Muterende kald kræver session og samme origin som øvrig kontolagring. Voucherens belønning aftales med Jacob; den er ikke et gavekort eller en automatisk bestilling hos ÅBEN.

Temaerne består af CSS, fælles farvevariabler og en lille SVG-baggrund. MathML og bedømmelse ændres ikke. Originale farver bruges som fallback, og videnskabelige figurer beholder en lys plotflade i mørke skins. De genererede belønningsbilleder ligger lokalt som `shop-beer.jpg`, `shop-pizza.jpg`, `shop-phantom.jpg`, `shop-wuaucha.jpg`, `shop-gasoline.jpg` og `shop-lamborghini.jpg` og kræver ingen ekstern billedtjeneste. Forhåndsvisninger er bygget i HTML/CSS.

Lamborghini-billedet er genereret med den indbyggede imagegen og gemt som JPEG. Prompt:

> Create a polished photorealistic editorial product photograph for a Danish reward shop. A lime green Lamborghini Huracán sports coupe, front three-quarter view, parked on an understated concrete forecourt beside modern Scandinavian architecture. Warm golden late afternoon light, tasteful aspirational mood, subtle softly blurred background. Entire car visible with generous margins on all sides for cropping to a landscape 3:2 card, car centered, realistically accurate wheels and proportions. No people, no text, no price, no watermark, no graphic overlays. Landscape composition.

Kør `npm run test:shop` for API- og browsertest af saldo, samtidige køb, genforsøg, ejerskab, temaskift, vouchers, mobil og brugeradskillelse. Kør `npm run db:migrate` før deployment af shop-versionen. Test bruger midlertidig database, ikke Railway.

DCS-belønningen er modulet [DCS: F-4E Phantom II fra Heatblur](https://www.digitalcombatsimulator.com/en/shop/modules/phantom/). Den vises som en digital belønning, koster 300 point og bruger samme personlige voucher som de øvrige belønninger. Køb og platform aftales med Jacob.

Phantom-billedet er genereret med den indbyggede imagegen og gemt som `shop-phantom.jpg`. Prompt:

> Create a premium aviation simulator reward-shop illustration in photorealistic flight-simulator screenshot style. One accurately proportioned McDonnell Douglas F-4E Phantom II twin-engine fighter jet, recognizable long nose, twin intakes, single vertical tail and two-seat canopy, Vietnam-era green and tan camouflage, flying above a scenic coastline at golden hour. Front-side three-quarter view, entire aircraft including both wingtips visible, generous framing margins for a landscape 3:2 reward card crop. Beautiful restrained cinematic light, realistic aircraft geometry and materials, no combat, no weapons being fired, no explosions. No text, no UI, no watermark, no invented logos. Landscape composition. This image represents the F-4E aircraft module for the DCS World flight simulator.

Restaurantbelønningen er én wuaucha til 250 point: vælg brunch på WhiteHorses eller indisk på DOSA Bar og aftal besøget med Jacob. `voucherLabel` styrer den særlige stavemåde på netop denne vares købsknap, købshistorik og indløsningsdialog; øvrige varer bruger fortsat voucher.

Restaurantbilledet er en generisk madillustration genereret med den indbyggede imagegen, gemt som `shop-wuaucha.jpg`. Det forestiller ikke de konkrete restauranter. Prompt:

> Create a tasteful photorealistic editorial food photograph for a Danish restaurant reward-shop card, landscape 3:2. One inviting Scandinavian cafe table with two clear food choices arranged side by side: on the left a beautiful brunch plate with poached eggs on sourdough toast, avocado, small fruit bowl and cappuccino; on the right an appetizing authentic South Indian crispy golden dosa folded into a long roll, with small bowls of coconut chutney and sambar. Warm natural window light, pale oak tabletop, ceramic dishes, elegant relaxed restaurant mood, realistic appetizing food textures. Both meals fully visible with generous margins for cropping to a card. No people, no hands, no text, no logos, no brand names, no vouchers, no collage borders, no watermark. A generic illustration of the choice between brunch and Indian dining, not a photo of any specific restaurant.

Burgerbelønningen er en personlig wuawcha til GASOLINE GRILL for 110 point. Den giver en burger, som aftales med Jacob. `voucherLabel: 'wuawcha'` bruger brugerens ønskede stavemåde gennem køb og indløsning.

Burgerbilledet er en generisk illustration genereret med indbygget imagegen og gemt som `shop-gasoline.jpg`. Det er ikke et foto fra restauranten. Prompt:

> Create a premium photorealistic editorial food photograph for a Danish point reward shop, landscape 3:2. One delicious classic cheeseburger in a shiny golden potato bun, juicy smashed beef patty with crisp browned edges, melted yellow cheese, pickles and a little burger sauce, sitting on plain unbranded greaseproof paper on a stainless cafe counter. A few golden fries subtly in the background, warm inviting daylight, relaxed contemporary Copenhagen burger-bar atmosphere, shallow depth of field, realistic appetizing food textures. The complete burger is centered with generous margins so it survives a landscape shop-card crop. No hands, no people, no text, no watermark, no logos, no branded packaging. This is a generic burger illustration representing a personal reward for a visit to GASOLINE GRILL, not an actual restaurant photograph.

### Point fra opgavebankens sæt

Trænings- og prøvesæt giver alle automatisk bedømte resultatpoint som butikspoint, inklusive delpoint og tidligere løste opgaver. Et nyt sæt giver point igen. Under træning optjenes point efter Tjek besvarelse; i prøvesæt ved aflevering. Afslutning, genindlæsning, genforsøg på lagring og gentagne API-kald krediterer ikke samme sæt igen. Fritekst og egen vurdering giver ingen butikspoint.

Serveren rekonstruerer opgaverne ud fra seed og version og bruger den fælles grader. Den accepterer ikke browserens pointtotal. `bank_set_reward` gemmer højeste automatiske score pr. konto/sæt med en fast opgavedefinition. Nye sæt får et UUID; eksisterende sæt bruger deres starttid. `bank_reward_legacy` modregner gamle bankpoint i det tilhørende sæts score, så den gamle ene point ikke lægges oven i den nye fulde score. Eksisterende point reduceres ikke.

Ved opgradering: kør først `npm run db:migrate`, deploy derefter og kør `node --env-file-if-exists=.env scripts/backfill-bank-rewards.js`. Scriptet efterregulerer aktuelt gemt sæt og op til 30 afsluttede sæt i den centralt gemte historik. Det aktuelle sæt beregnes fra svarene; historik uden svar begrænses af opgavernes maksimum og fratrækkes egen vurdering konservativt. Det kan genkøres uden ekstra point og ændrer ikke besvarelser eller køb. Ældre sæt uden gemt historik kan ikke rekonstrueres.

`npm run test:bank-rewards` dækker bl.a. gentagelser, delpoint, skriftlige delopgaver, prøvesæt, konflikter, gamle point og scenariet 21/25 med 7 oprindelige butikspoint.

Korrekte løsninger sendes straks til serveren; kun almindelig indtastning bruger gemmepausen. Den viste saldo opdateres fra serverens svar. `GET /api/points` returnerer den indloggede kontos disponible saldo og konto-id med `Cache-Control: no-store`. Åbne faner henter saldoen ved fokus, tilbagevendende netforbindelse og hvert 30. sekund, mens fanen er synlig. Det ændrer ikke besvarelser eller lokale kladder. Et ældre saldosvar kan ikke overskrive en nyere bekræftet gemning eller et køb. `npm run test:live-points` tester dette i WebKit og Chrome, inklusive vektorfunktioner M1, flere enheder, fejl og genforsøg.

## Udgivelsesoprydning 31. oktober 2026

Vercel er den eneste app-host og bygger `webapp` fra `main`. Railway-appservicen
`christian-matematik` er frakoblet Git; den havde ingen kørende instanser eller
volumener og forsøgte fejlagtigt at bygge repoets rod. Postgres-servicen og dens
volumen er bevaret. Den gamle fejlede deployment kan stadig vises i historikken.

Point, butik, skins og opgavechat er nu versionsstyret sammen med undervisningen.
Kontrollér altid nye og ændrede filer før udgivelse, så en Git-udgivelse ikke
overskriver funktioner, som kun tidligere er deployet fra lokale filer.
