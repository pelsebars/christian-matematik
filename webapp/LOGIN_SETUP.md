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
