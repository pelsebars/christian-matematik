import {math,n,x,power,mi,op,frac,mu,sigma} from './normal-math.js';
import {y} from './normal-algebra-math.js';
import {normalSection as section,normalExample as example,normalImportant as important} from './normal-lesson-support.js';
import {renderExercises} from './integral-exercises.js';
import {algebraPreSquare,algebraPreSystem,algebraMiniSquare,algebraMiniSystem,algebraFinalSquare,algebraFinalSystem} from './normal-algebra-exercises.js';
import {algebraSquareTasks,algebraSystemTasks,normalAlgebraTasks,systemPrompt} from './tasks/bank/normal-algebra.js';
import {algebraAreaMarkup,algebraSystemMarkup} from './normal-algebra-graphs.js';
const panel=(step,body)=>`<div data-normal-step="${step}" hidden>${body}</div>`;
const a=mi('a'),b=mi('b'),square=body=>power(body,2);
const worked=(id,title)=>{const t=normalAlgebraTasks.find(t=>t.id==='b1011.'+id);return example(title,t.prompt+t.solution);};
const mini=(track,index)=>renderExercises([(track==='square'?algebraMiniSquare:algebraMiniSystem)[index]]);
export function algebraContent(){return `<p data-lesson-warning role="status" hidden></p>
${panel('start',section('Det skal du kunne · B-repetition 10–11',`
 <p>Dette er en selvstændig algebrarepetition mellem Modul 3 og 4. B10 handler om kvadratsætninger; B11 handler om to ligninger med to ubekendte. Du vælger, hvor du har brug for træning.</p>
 <ul><li>Genkende de tre kvadratsætninger, gange parenteser ud og faktorisere.</li><li>Holde styr på fortegn og kontrollere en omskrivning.</li><li>Forstå et fælles løsningspar, bruge substitution og elimination og vælge en gyldig metode.</li><li>Kontrollere begge ligninger og opstille enkle ligninger fra en tekst eller tabel.</li></ul>
 <p>Mål: B10–B11 og støtte til U2–U5 og U7. Det er algebra, som blandt andet støtter parameterligningerne i Modul 3. Repetitionen indfører ikke et nyt normalfordelingsmodul.</p>
`)+section('Spor B10 · forudsætningstjek',`
 <p>Fire spørgsmål om fortegn, potenser, parenteser og blandede led. Brug feedbacken til at finde dit næste trin.</p>${renderExercises(algebraPreSquare)}<p data-algebra-pre="square" role="status"></p><a class="text-button" href="#normalDistribution/repetition/kvadrater">Træn kvadratsætninger</a> · <button class="text-button" type="button" data-algebra-shortcut="square">Gå direkte til B10-sluttjek</button>
`)+section('Spor B11 · forudsætningstjek',`
 <p>Fire andre spørgsmål om ligninger, indsættelse, fælles par og addition. Resultaterne vurderes uafhængigt af B10.</p>${renderExercises(algebraPreSystem)}<p data-algebra-pre="system" role="status"></p><a class="text-button" href="#normalDistribution/repetition/loesningspar">Træn to ligninger</a> · <button class="text-button" type="button" data-algebra-shortcut="system">Gå direkte til B11-sluttjek</button>
 <p>Et spor er gennemført, når dets sluttjek og enten hele starttjekket eller alle dets træningsopgaver er korrekt kontrolleret. Du behøver derfor ikke gentage træningen i et spor, du allerede kan. Alle sider er åbne, også efter fejlsvar.</p>
`)+section('Grundhjælp · vælg den konkrete regnefærdighed',`
 <div id="algebra-basics" tabindex="-1">
 <details data-algebra-basic="sign"><summary>Fortegn og parenteser</summary><p>Negativt gange negativt er positivt. Minus foran en hel parentes ændrer fortegnet på hvert led. Et minus kan ikke blot slettes.</p><p>${math(n(-2)+op('(')+x+op('−')+n(3)+op(')')+op('=')+n(-2)+x+op('+')+n(6))}.</p></details>
 <details data-algebra-basic="power"><summary>En sum i anden potens</summary><p>En parentes i anden betyder hele parentesen ganget med sig selv. Den betyder ikke, at hvert led kvadreres hver for sig. Hele minus tre i anden giver ni; minus foran tre i anden giver minus ni.</p></details>
 <details data-algebra-basic="distribute"><summary>Gang med alle led</summary><p>En faktor uden for en parentes rammer hvert led inde i parentesen. To parenteser med to led giver fire produkter. Saml først bagefter led af samme slags.</p></details>
 <details data-algebra-basic="recognize"><summary>Led og koefficienter</summary><p>En koefficient er talfaktoren foran en variabeldel. I tre gange x plus fem er koefficienten tre og konstantleddet fem. Led med første og anden potens er forskellige slags led og kan ikke lægges sammen til ét x-led.</p></details>
 <details data-algebra-basic="linear"><summary>Ligninger og brøker</summary><p>Gør det samme på begge sider af lighedstegnet. Fjern et konstantled med den modsatte regneoperation; divider derefter begge sider med koefficienten, hvis den ikke er nul. Svaret kan være en brøk.</p><a href="#equations">Genlæs ligningsforløbet</a></details>
 <details data-algebra-basic="insert"><summary>Indsæt hele værdien</summary><p>Brug samme x og y hele vejen. Ved et negativt tal eller et udtryk med flere led hjælper parenteser med at holde styr på, hvad der ganges eller trækkes fra.</p></details>
 <details data-algebra-basic="pair"><summary>Et par i begge ligninger</summary><p>Parret skrives med x først og y bagefter. Det beskriver én fælles mulighed. Test begge ligninger med præcis det samme par; to forskellige par løser ikke systemet sammen.</p></details>
 <details data-algebra-basic="operation"><summary>Læg hele ligninger sammen</summary><p>Læg venstreside til venstreside og højreside til højreside. Modsatte led ophæver hinanden. Ved en gangning skal alle led og højresiden med.</p></details>
 </div>
`))}
${panel('kvadrater',section('En hel parentes ganges med sig selv',`
 <p>Tænk på et kvadrat, hvis side består af to stykker. Arealet kan findes ved at gange hele siden med sig selv eller ved at lægge alle delarealerne sammen.</p>${algebraAreaMarkup()}
 <dl class="normal-symbols"><dt>${math(a)} og ${math(b)}</dt><dd>To størrelser. I figuren er de positive sidelængder; i regnereglerne kan de være alle reelle tal eller algebraiske udtryk.</dd><dt>${math(square(a+op('+')+b))}</dt><dd>Hele summen ganget med sig selv.</dd><dt>${math(n(2)+a+b)}</dt><dd>To gange a gange b. Det er de to blandede produkters samlede bidrag.</dd></dl>
 <p>Hvert led skal ganges med hvert led:</p><p>${math(square(a+op('+')+b)+op('=')+square(a)+op('+')+a+b+op('+')+a+b+op('+')+square(b))}.</p><p>Første kvadratsætning: ${math(square(a+op('+')+b)+op('=')+square(a)+op('+')+n(2)+a+b+op('+')+square(b))}.</p>
 ${example('Gennemregnet: et enkelt blandet led',`<ol><li>${math(square(x+op('+')+n(2)))} er to ens parenteser ganget sammen.</li><li>Produkterne er x i anden, to gange x, to gange x og fire.</li><li>Det samles til ${math(square(x)+op('+')+n(4)+x+op('+')+n(4))}.</li></ol>`)}${mini('square',0)}
 ${important('En sum i anden potens er ikke blot summen af de to kvadrater. De to blandede produkter skal med. Arealfiguren forklarer, hvor det dobbelte produkt kommer fra.')}
`))}
${panel('fortegn',section('Et minus i en parentes',`
 <p>En forskel i anden er også to ens parenteser. De to blandede produkter bliver negative, men det sidste produkt er positivt, fordi to negative tal ganges.</p><p>Brug de samme a og b som før. Anden kvadratsætning:</p><p>${math(square(a+op('−')+b)+op('=')+square(a)+op('−')+n(2)+a+b+op('+')+square(b))}.</p>
 ${example('Gennemregnet: x minus to i anden',`<ol><li>Gang ${math(op('(')+x+op('−')+n(2)+op(')'))} med samme parentes.</li><li>Produkterne er x i anden, minus to gange x, minus to gange x og plus fire.</li><li>Resultatet er ${math(square(x)+op('−')+n(4)+x+op('+')+n(4))}.</li></ol>`)}${mini('square',1)}
 ${important('Minustegnet giver et negativt mellemled. Det sidste kvadrat er stadig positivt. Kvadratet af en forskel er derfor ikke det samme som forskellen mellem to kvadrater.')}
`)+section('En sum ganget med en forskel',`
 <p>Nu har parenteserne modsatte fortegn. De to blandede produkter er lige store med hvert sit fortegn og forsvinder, når de samles.</p><p>Tredje kvadratsætning: ${math(op('(')+a+op('+')+b+op(')')+op('(')+a+op('−')+b+op(')')+op('=')+square(a)+op('−')+square(b))}.</p>
 ${example('Gennemregnet: x plus fire gange x minus fire',`<ol><li>De blandede produkter er minus fire gange x og plus fire gange x.</li><li>Konstantproduktet er fire gange minus fire, altså minus 16.</li><li>Derfor bliver resultatet ${math(square(x)+op('−')+n(16))}.</li></ol>`)}${mini('square',2)}
 <details><summary>Hvorfor gælder reglerne også med andre bogstaver eller flere led?</summary><p>a og b er pladsholdere. I bankopgaven med to gange x plus tre er a hele leddet to gange x. Også talfaktoren to skal derfor kvadreres. Reglerne følger almindelig multiplikation og gælder for alle reelle værdier.</p></details>
`))}
${panel('faktorisering',section('Læs reglen den anden vej',`
 <p>Ved udvidelse går vi fra produkt til sum. Ved faktorisering går vi fra sum til produkt. En god kontrol er at gange produktet ud igen og se, om alle oprindelige led kommer tilbage.</p><p>Et produkt er faktorer ganget sammen. Et konstantled er et led uden en variabel. Begge ord bruges i valgmulighederne.</p>
 ${example('Gennemregnet: genkend alle tre led',`<ol><li>I ${math(square(x)+op('+')+n(6)+x+op('+')+n(9))} er første kvadrat x i anden og sidste kvadrat tre i anden.</li><li>Mellemleddet er to gange x gange tre, så også det passer.</li><li>Faktoriseret form er ${math(square(x+op('+')+n(3)))}.</li><li>Med negativt mellemled ville den tilsvarende form have minus tre inde i parentesen.</li></ol>`)}
 ${example('Gennemregnet: to kvadrater med minus imellem',`<ol><li>${math(square(x)+op('−')+n(9))} er forskellen mellem x i anden og tre i anden.</li><li>Derfor er formen ${math(op('(')+x+op('−')+n(3)+op(')')+op('(')+x+op('+')+n(3)+op(')'))}.</li><li>Udvidelse får de to blandede produkter til at ophæve hinanden.</li></ol>`)}${mini('square',3)}
 ${important('Se efter hele mønstret. Første og sidste kvadrat er ikke nok til at genkende en kvadreret parentes; mellemleddet skal også passe. Et produkt med modsatte fortegn har derimod intet blandet led.')}
`)+section('Kontrol af en identitet',`
 <p>En identitet er en lighed, som gælder for alle tilladte værdier. Et enkelt modeksempel er nok til at vise, at en påstået identitet er forkert. Et enkelt matchende tal beviser den ikke.</p>${worked('error','Gennemregnet: find fejlen i en omskrivning')}
 <p>Den generelle kontrol består i at udvide eller faktorisere med gyldige regneregler. Brug gerne et enkelt tal til at opdage en fejl, men forklar også selve regnetrinnet.</p>
`))}
${panel('loesningspar',section('To samtidige betingelser',`
 <p>Én ligning med to ubekendte kan passe til mange par. En ekstra ligning indsnævrer mulighederne. Begge skal gælde på samme tid, så vi leder efter fælles par.</p>${algebraSystemMarkup()}
 <dl class="normal-symbols"><dt>${math(x)} og ${math(y)}</dt><dd>De to ukendte størrelser. De samme symboler betyder de samme størrelser i begge ligninger.</dd><dt>${math(op('(')+x+op(';')+y+op(')'))}</dt><dd>Et ordnet par: x først, y bagefter. Semikolon holder koordinaterne adskilt fra et dansk decimalkomma.</dd><dt>${math(n(2)+x+op('−')+y+op('=')+n(4))}</dt><dd>En betingelse: to gange den første værdi minus den anden skal give fire.</dd></dl>
 ${example('Gennemregnet: parret tre og to',`<ol><li>Vi undersøger ${systemPrompt([[1,1,5],[2,-1,4]])}.</li><li>Indsæt x lig tre og y lig to i første: tre plus to er fem.</li><li>Indsæt samme par i anden: seks minus to er fire.</li><li>Parret passer i begge og er en fælles løsning.</li></ol>`)}${mini('system',0)}
 ${important('En løsning er ét og samme par, der opfylder begge krav. At finde to tal, som kun passer i én ligning, er ikke nok.')}
`))}
${panel('substitution',section('Erstat en ukendt med et helt udtryk',`
 <p>Hvis én ligning fortæller, hvad y er, kan vi erstatte y i den anden ligning med det udtryk. Så er der kun én ubekendt tilbage. Metoden kaldes substitution, som betyder indsættelse.</p>
 <p>Eksempel: ${math(y+op('=')+n(5)+op('−')+x)}. Hver gang der står y, kan hele udtrykket fem minus x indsættes. Parenteser viser, hvad der erstattes.</p>
 ${example('Gennemregnet trin for trin',`<ol><li>Brug ${systemPrompt([[1,1,5],[2,-1,4]])}.</li><li>Isolér y i første: ${math(y+op('=')+n(5)+op('−')+x)}.</li><li>Indsæt i anden: ${math(n(2)+x+op('−')+op('(')+n(5)+op('−')+x+op(')')+op('=')+n(4))}.</li><li>Minus foran parentesen giver ${math(n(2)+x+op('−')+n(5)+op('+')+x+op('=')+n(4))}. Dermed er x tre.</li><li>Regn tilbage: y er fem minus tre, altså to.</li><li>Kontrollér begge oprindelige ligninger med parret tre og to.</li></ol>`)}${mini('system',1)}
 ${important('Du erstatter hele den ukendte med hele det isolerede udtryk. Bevar parentesen, indtil fortegn og faktorer er ganget korrekt ind. Find altid den anden ukendte til sidst.')}
 <details><summary>Hvilken ukendt skal isoleres?</summary><p>En koefficient på én eller minus én giver ofte færrest brøker. Det er en praktisk fordel, ikke en regel om, at andre korrekte valg er forbudt.</p></details>
`))}
${panel('elimination',section('Få en ukendt til at forsvinde',`
 <p>Når lige store led har modsatte fortegn, kan de ophæve hinanden ved addition. Det efterlader en ligning med én ubekendt. Metoden kaldes elimination.</p>
 ${example('Gennemregnet: modsatte y-led',`<ol><li>Brug ${systemPrompt([[1,1,5],[1,-1,1]])}.</li><li>Læg hele venstresiderne sammen og hele højresiderne sammen. y og minus y giver nul.</li><li>To gange x er seks, så x er tre.</li><li>Indsæt i første: y er to.</li><li>Kontrol: tre plus to er fem; tre minus to er én.</li></ol>`)}${mini('system',2)}
 ${important('Det er hele ligninger, der kombineres. Man må ikke slette to led, blot fordi de har samme bogstav. Deres koefficienter skal faktisk ophæve hinanden.')}
`)+section('Gang først, hvis koefficienterne ikke passer',`
 <p>Du kan gange en hel ligning med et tal forskelligt fra nul og bevare dens løsninger. Det kan skabe modsatte koefficienter. Faktoren skal ramme hvert led og højresiden.</p>${worked('scale','Gennemregnet: skab modsatte koefficienter')}${mini('system',3)}
 <p>Ved subtraktion skifter alle led i den ligning, der trækkes fra, fortegn. At lægge en negativ ganget ligning til er en tilsvarende måde at holde styr på tegnene.</p>
`))}
${panel('metode',section('Vælg en enkel og gyldig vej',`
 <p>Se på koefficienterne, før du begynder. Et isoleret led gør substitution enkel. Allerede modsatte koefficienter gør addition enkel. Begge metoder skal ende med det samme par, når der er én entydig løsning.</p>${worked('method','Gennemregnet: vælg en start uden at gætte')}${mini('system',4)}
`)+section('Ikke altid præcis én løsning',`
 <p>Den interaktive figur viser tre muligheder: to linjer skærer hinanden én gang, parallelle forskellige linjer mødes aldrig, eller to ligninger viser samme linje.</p>${worked('consistency','Gennemregnet: to betingelser kan være umulige eller ens')}${mini('system',5)}
 <p>Efter en korrekt omskrivning kan ${math(n(0)+op('=')+n(2))} vise en modstrid. ${math(n(0)+op('=')+n(0))} giver ingen ny betingelse; i eksemplet med samme linje er der uendeligt mange par. Man må ikke dividere med nul for at tvinge ét svar frem.</p>
`)+section('Fra tekst eller data til to ligninger',`
 <p>Navngiv først de ukendte og deres enheder. Skriv derefter én ligning pr. oplysning. Kontrollér, at samme bogstav betyder samme størrelse begge steder.</p>${worked('receipts','Gennemregnet: to kvitteringer med de samme stykpriser')}
 <p>Ved antal billetter skal løsningen desuden være ikke-negative hele tal. Ved priser skal enheden være kroner pr. stk. En algebraisk løsning skal fortolkes i den konkrete sammenhæng.</p>
`)+section('Hvor bruger vi det senere?',`
 <p>I Modul 3 blev to grænser skrevet som centrum plus et antal spredninger. Det gav to ligninger med samme centrum og bredde. Subtraktion fjernede centrum. Her er det de samme algebraiske principper, du har trænet.</p><p>Symbolerne ${math(mu)} og ${math(sigma)} er dér modelcentrum og positiv modelspredning. De er navne for de ukendte ligesom x og y; opgavernes oprindelige sandsynligheder kræver også en modelkontrol.</p><a href="#normalDistribution/3/begge">Se forbindelsen til parameterbestemmelse</a>
 <p><strong>Værktøj som kontrol:</strong> Skriv begge oprindelige ligninger ind med de samme ukendte. Gem input og output. Indsæt svaret i begge ligninger og forklar enhederne. Materialet kræver ikke et bestemt CAS-program eller kommandonavn.</p>
`))}
${panel('oevelser',section('B10 · fra korte regnestykker til kontrol og areal',`
 <p>Vælg mellem de tre kvadratsætninger, kontroller fortegn og faktoriser. Hints åbnes ét ad gangen. Valgopgaver om faktorisering kræver faktisk en produktform.</p>${renderExercises(algebraSquareTasks)}
`)+section('B11 · fra et fælles par til modeller og metodevalg',`
 <p>Begynd med indsættelse. Fortsæt med én metode ad gangen, skalering, valg af metode og tekst-/tabelopgaver. Brug hjælpemidler, hvor kortet angiver det.</p>${renderExercises(algebraSystemTasks)}<a href="#tasks">Åbn den fælles opgavebank</a>
`)+section('Typiske fejl og målrettet hjælp',`
 <ul><li>Glemt mellemled: tegn de fire delprodukter eller delarealer.</li><li>Minus i sidste kvadrat: regn negativt gange negativt særskilt.</li><li>Forkert faktorisering: gang produktet ud og kontrollér alle led.</li><li>Kun én ligning passer: indsæt hele parret i begge.</li><li>Forkert substitution: behold parentesen omkring hele det indsatte udtryk.</li><li>Kun ét led er ganget: skriv faktoren foran hele venstre- og højresiden.</li><li>Der kommer nul som koefficient: undersøg, om ligningerne er ens eller modstridende.</li></ul>
`)+section('Mine regnetrin, værktøjsnoter og forklaringer',`
 <label for="algebra-notes">Forklar én kvadratsætning og dokumentér ét løsningspar<textarea id="algebra-notes" rows="5" maxlength="10000"></textarea></label><p><strong>Egen vurdering:</strong> Har du alle fire produkter med? Gælder identiteten generelt? Har du gjort det samme på begge sider? Er begge tal og begge oprindelige kontroller med? Er enheder og eventuelt CAS-input/output tydelige? Noterne gemmes på din konto, men bedømmes ikke automatisk.</p>
`))}
${panel('sluttjek',section('B10 · selvstændigt forståelsestjek',`
 <div id="algebra-final-square" tabindex="-1"><p>Svar uden hjælpemidler. B10-tjekket indeholder alle tre kvadratsætninger og faktorisering.</p>${renderExercises(algebraFinalSquare)}<p data-algebra-final="square" role="status"></p></div>
`)+section('B11 · selvstændigt forståelsestjek',`
 <div id="algebra-final-system" tabindex="-1"><p>Vis, at du kan finde et par, vælge en gyldig start, kontrollere begge krav, genkende antallet af løsninger og bruge en enkel tekstmodel.</p>${renderExercises(algebraFinalSystem)}<p data-algebra-final="system" role="status"></p></div>
 <details><summary>Forklar selv: hvorfor virker metoderne?</summary><p>Forklar, hvor det dobbelte produkt kommer fra. Forklar også, hvorfor substitution og kombination af hele ligninger bevarer de fælles løsninger.</p><p><strong>Egen vurdering:</strong> Brug de fire produkter, samme værdi for en ukendt, samme operation på begge sider og en kontrol i de oprindelige ligninger. Talbedømmelsen erstatter ikke din forklaring.</p></details>
`))}
${panel('opsummering',section('To spor · hver sin status',`
 <div data-algebra-summary role="status"></div><p data-algebra-next role="status"></p>
 <ul><li>Kvadratet af en sum har et positivt dobbelt produkt.</li><li>Kvadratet af en forskel har et negativt dobbelt produkt og positivt sidste kvadrat.</li><li>En sum gange den tilsvarende forskel giver forskellen mellem kvadraterne.</li><li>Faktorisering læser en regneregel baglæns og kontrolleres ved udvidelse.</li><li>Et løsningspar skal opfylde begge oprindelige ligninger.</li><li>Substitution erstatter en ukendt med et helt udtryk. Elimination kombinerer hele ligninger.</li><li>To ligninger kan give én, ingen eller uendeligt mange løsninger.</li></ul>
 <p>Gennemført kræver begge spor. Hvert spor kræver hele sit sluttjek plus enten hele sit starttjek eller alle sine mikro- og bankopgaver. B10 har 4 startspørgsmål, 12 træningskort og 4 slutkort. B11 har 4 startspørgsmål, 14 træningskort og 5 slutkort. Svar skal være korrekt kontrolleret; sidebesøg og figurknapper gennemfører intet.</p>
 <p><a href="#normalDistribution/3/opsummering">Tilbage til Modul 3</a> · <a href="#normalDistribution/4">Næste undervisningsgang: normalfordelingsplot · planlagt</a></p>
 <p class="int-source">Kilder: Læseplan.pdf, side 3, fredag 6. november 2026: »Virtuel repetition B-niveau 10–11«, kvadratsætninger og to ligninger med to ubekendte. Undervisningsbeskrivelse.pdf bidrager med mål om symbolbehandling, ræsonnement, anvendelse, metoder og mindstekrav. Der er ikke et særskilt B10–11-ark i de lokale kilder; eksempler, tabeller, figurer og opgaver er egne pædagogiske tilføjelser. Parameterbroen støtter metoden fra ark 3. Originalfilerne er uændrede. B8–9, kombinatorik og binomialfordeling er fortsat en anden planlagt repetition.</p>
`))}`;}
