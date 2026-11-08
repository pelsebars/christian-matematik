import {math,n,mi,op,mu,sigma,X,x,P,fn,frac,power,distribution,densityFormula} from './normal-math.js';
import {normalIntroSteps} from './normal-routes.js';
import {introVisual,introRegressionFigure} from './normal-intro-figures.js';

export const normalIntroForModule={'1':'maalinger','2':'standard','3':'parametre','repetition':'algebra','4':'normalplot','5':'regression','opsamling':'overblik'};
const a=mi('a'),b=mi('b'),z=mi('z'),s=mi('s'),count=mi('n'),i=mi('i');
const sub=(body,index)=>`<msub>${body}<mrow>${index}</mrow></msub>`,hat=body=>`<mover>${body}<mo>^</mo></mover>`,bar=body=>`<mover>${body}<mo>¯</mo></mover>`;
const page=(id,title,body)=>`<div data-normal-step="${id}" hidden><section class="lesson-section normal-intro-reading"><h2>${title}</h2>${body}</section></div>`;
const idea=text=>`<aside class="normal-important"><h3>Tag denne idé med</h3><p>${text}</p></aside>`;
const formula=(title,body)=>`<details class="normal-intro-formula"><summary>${title}</summary>${body}</details>`;
const onward=(route,label)=>`<p class="normal-intro-onward">Når du er klar til at arbejde med stoffet: <a href="#normalDistribution/${route}">${label}</a>.</p>`;

export function normalIntroContent(){return `
<details class="normal-intro-outline"><summary>Vælg et af de 14 korte afsnit</summary><nav aria-label="Afsnit i den rolige introduktion">${normalIntroSteps.map(([id,label],index)=>`<a href="#normalDistribution/intro/${id}" data-intro-link><span>${index+1}</span> ${label}</a>`).join('')}</nav></details>
${page('start','Vi begynder med virkeligheden',`
 <p>En maskine skal fylde mælk i kartoner. Selv når maskinen fungerer, bliver indholdet ikke helt ens hver gang. En karton får lidt mere, en anden lidt mindre. Vi kan derfor ikke sige præcis, hvad den næste karton indeholder.</p>
 <p>Men vi vil stadig gerne vide noget nyttigt: Hvor meget varierer indholdet? Hvor tit bliver der fyldt for lidt i? Og hvordan kan nogle få målinger fortælle os noget om produktionen som helhed?</p>
 <p><strong>Det er den slags spørgsmål, statistik hjælper os med.</strong> Vi leder efter et mønster i variationen og undersøger, hvor meget vi kan stole på det.</p>
 <h3>To historier gennem hele introduktionen</h3>
 <p>Først følger vi <strong>indholdet i mælkekartoner</strong>. Her undersøger vi én størrelse ad gangen. Senere følger vi <strong>produktionsmængde og arbejdstid</strong>. Her undersøger vi, hvordan to størrelser hænger sammen. Det fører til regression og til usikkerheden på en hældning.</p>
 <h3>Sådan kan du læse</h3>
 <p>Læs ét afsnit ad gangen med “Næste afsnit” nederst. Du må gerne stoppe midtvejs og komme tilbage. Menuen ovenfor kan også føre dig direkte til den idé, du vil genlæse.</p>
 <p>Du skal ikke regne eller aflevere noget her. Figurerne kan skiftes med knapper, så du kan se en idé ændre sig. Formlerne ligger i felter, du selv kan åbne. Først forklarer vi med ord, hvad de skal bruges til.</p>
 <p>Rækkefølgen er den samme som i undervisningen: normalmodel og sandsynlighed, standardisering, ukendte parametre, algebra, normalplot og til sidst regression med konfidensintervaller.</p>
 ${idea('Du behøver ikke kunne formlerne for at begynde. Start med at forstå, hvilket spørgsmål vi prøver at besvare.')}
`)}
${page('maalinger','Mange forskellige målinger kan danne ét mønster',`
 <p>Forestil dig, at hver målt karton bliver til en prik på en lang linje. Lidt mælk ligger til venstre, meget mælk til højre. Hvis maskinen fylder nogenlunde stabilt, vil mange prikker ofte samle sig omkring et centrum.</p>
 <p>En <strong>normalfordeling</strong> er en bestemt, symmetrisk klokkeform, som vi nogle gange kan bruge til at beskrive sådan en variation. Omkring midten er der mest af mønstret. Langt fra midten er der mindre. Ordet “normal” er navnet på formen; det er ikke en vurdering af, hvad der er godt eller acceptabelt.</p>
 <h3>Der er to forskellige ting at holde øje med</h3>
 <p><strong>Middelværdien er klokkens centrum.</strong> Hvis maskinen begynder at fylde mere i alle kartoner, flytter centrum mod højre.</p>
 <p><strong>Spredningen beskriver variationens størrelse.</strong> En lille spredning betyder, at fyldmængderne ligger tæt samlet. En større spredning betyder større forskelle mellem kartonerne. Centrum kan godt være uændret, selv om variationen vokser.</p>
 ${introVisual('bell')}
 <h3>Prikkerne er målt. Klokken er en model.</h3>
 <p>En <strong>model</strong> er en forenklet beskrivelse, vi bruger til at tænke og beregne med. Prikkerne behøver ikke danne en perfekt klokke. Senere undersøger vi, om modellen er rimelig for de data og det formål, vi har.</p>
 <p>Alle de kartoner, vi vil udtale os om, kaldes <strong>populationen</strong>. De kartoner, vi faktisk undersøger, er en <strong>stikprøve</strong>. Hvis vi kun tager kartoner fra en særlig del af produktionen, kan billedet blive skævt.</p>
 ${formula('Læs modellen og de første bogstaver',`<p>${math(distribution())}</p><p>Læs: “Indholdet i en tilfældigt valgt karton beskrives som normalfordelt med et bestemt centrum og en bestemt spredning.”</p><ul><li>Stort X er den måling, vi endnu ikke kender. Lille x er en mulig eller allerede målt værdi.</li><li>μ udtales “my” og er modellens middelværdi.</li><li>σ udtales “sigma” og er modellens spredning. Den skal være positiv.</li></ul><p>Begge parametre har målingens enhed, for eksempel liter. I denne app er den anden parameter spredningen. Et andet program kan bede om variansen, som er spredningen i anden.</p>`)}
 ${idea('Centrum fortæller, hvor klokken ligger. Spredning fortæller, hvor bred den er. Målingerne afgør, om klokken overhovedet er en god beskrivelse.')}
 ${onward('1/model','Modul 1 · fra måling til model')}
`)}
${page('areal','En sandsynlighed fylder et område',`
 <p>Nu vil vi vide, hvor tit en karton ender under en bestemt fyldgrænse. Vi sætter et lodret “hegn” ved grænsen på måleskalaen. Det, vi leder efter, er den del af modellen, der ligger på den ønskede side af hegnet.</p>
 <p><strong>På klokkegrafen vises sandsynligheden som et areal.</strong> Forestil dig, at du farver området under kurven. Hele arealet regnes som én helhed, altså 100 %. Et delområde er en del af den helhed.</p>
 ${introVisual('area')}
 <h3>Hvorfor kan vi ikke bare bruge højden?</h3>
 <p>En høj top betyder, at modellen er tæt samlet omkring centrum. Det fortæller ikke alene, hvor stor en andel der ligger i et område. Områdets bredde betyder også noget. Et smalt område kan have lille sandsynlighed, selv om kurven er høj dér.</p>
 <p>Højden hedder <strong>tæthed</strong>. Den kan godt være større end én, fordi den ikke selv er en sandsynlighed. Det samlede areal under klokken er stadig én.</p>
 <h3>En helt præcis værdi har ingen bredde</h3>
 <p>I en kontinuert model kan indholdet ligge hvor som helst på måleskalaen. Én fuldstændig præcis værdi fylder ikke noget område og har derfor sandsynlighed nul. Det betyder ikke, at der ikke kan måles en karton. Enhver måling giver en værdi, og måleudstyret afrunder normalt.</p>
 <p>Når en vægt viser et bestemt tal, repræsenterer det typisk et lille interval af værdier, som er afrundet til samme visning. Et sådant interval har bredde og kan have positiv sandsynlighed.</p>
 ${formula('Hvad bruges tæthedsformlen til?',`<p>Tætheden skrives ${math(fn('f',x))}. Den giver kurvens højde ved en måleværdi. Normalfordelingens tæthedsformel er:</p><div class="int-formula">${math(fn('f',x)+op('=')+densityFormula())}</div><p>Den ser omfattende ud, men dens job er at tegne netop den klokke, som dit centrum og din spredning bestemmer. Udtrykket med forskellen til centrum styrer, hvor på klokken du er. Faktoren foran sørger for, at hele arealet er én.</p><p>Du bruger den, når en opgave spørger til selve tæthedsfunktionen eller en kurvehøjde. Når spørgsmålet er en andel under eller mellem grænser, skal du bruge et areal. Statistikværktøjet kan finde det uden, at du selv håndregner med hele tæthedsformlen.</p>`)}
 ${idea('På tæthedsgrafen er højden tæthed. Sandsynligheden er et helt område under kurven.')}
 ${onward('1/taethed','Modul 1 · tæthed og areal')}
`)}
${page('fordeling','Nogle gange søger vi en andel. Andre gange en grænse.',`
 <p>Forestil dig et gardin, der trækkes fra venstre mod højre under klokken. Jo længere vi trækker det, desto mere af arealet har vi samlet op.</p>
 <p><strong>Fordelingsfunktionen</strong> fortæller, hvor meget der er samlet op frem til en bestemt grænse. Den kaldes stort F. Lille f er tæthedens højde; stort F er den opsamlede sandsynlighed fra venstre.</p>
 <h3>Fra grænse til andel</h3>
 <p>Mejeriet fastsætter en minimumsgrænse for indholdet. Grænsen er kendt. Vi bruger modellen til at finde andelen under den. Søger vi i stedet andelen over grænsen, tager vi resten af helheden.</p>
 <p>Ved to fyldgrænser vil vi kun beholde området imellem dem. Først samler vi op til den øvre grænse. Så fjerner vi alt det, der allerede var samlet op ved den nedre grænse.</p>
 <h3>Fra andel til grænse</h3>
 <p>Mejeriet kan også spørge: “Hvor ligger den grænse, som kun en lille bestemt andel af kartonerne kommer under?” Nu er andelen kendt, og vi leder efter hegnets placering. Sådan en grænse kaldes en <strong>fraktil</strong>.</p>
 <p>Det er de samme oplysninger i den samme model, men vi går den anden vej. Et sandsynlighedssvar er en andel eller procent. En fraktil er en måleværdi med enhed, for eksempel liter.</p>
 ${formula('Sådan bruges stort F i formlerne',`<p>${math(fn('F',b)+op('=')+P(X+op('≤')+b))} betyder: “Andelen til venstre for grænsen b.” P står for sandsynlighed, og tegnet ≤ betyder “mindre end eller lig med”.</p><p>${math(P(X+op('>')+b)+op('=')+n(1)+op('−')+fn('F',b))} bruges til andelen over en grænse: hele arealet minus venstre del.</p><p>${math(P(a+op('≤')+X+op('≤')+b)+op('=')+fn('F',b)+op('−')+fn('F',a))} bruges til andelen mellem den nedre grænse a og den øvre b.</p><p>Ved en fraktil kender vi i stedet andelen p og søger grænsen k, så ${math(fn('F',mi('k'))+op('=')+mi('p'))}. Værktøjets omvendte normalfunktion finder grænsen. Kontrollér altid, om den oplyste andel ligger til venstre, til højre eller mellem to grænser.</p>`)}
 ${formula('Når flere kartoner skal opfylde kravet samtidig',`<p>At én karton er over en grænse, og at alle kartoner i et udvalg er over den, er forskellige hændelser. Hvis målingerne er uafhængige, kan sandsynlighederne for de enkelte hændelser ganges. Uafhængighed betyder her, at kendskab til én fyldning ikke ændrer sandsynligheden for de andre.</p><p>Hvis vi tæller, hvor mange kartoner der opfylder kravet, arbejder vi med et antal. Det er et andet spørgsmål end indholdet i én karton. Optælling og binomialfordeling har deres egen <a href="#differentialEquations/repetition/start">B-repetition 8–9</a>.</p>`)}
 ${idea('Sæt ord på det ukendte, før du vælger en formel: Leder du efter en andel eller efter en grænse på måleskalaen?')}
 ${onward('1/fordeling','Modul 1 · fordelingsfunktion og fraktiler')}
`)}
${page('standard','Mål afstanden med en målestok, der passer',`
 <p>En bestemt forskel fra centrum kan være meget i én produktion og lidt i en anden. Det afhænger af, hvor meget produktionen plejer at variere.</p>
 <p>Tænk på spredningen som længden af én passende målestok. <strong>Standardisering</strong> fortæller, hvor mange af disse målestokke en observation ligger fra centrum. Vi spørger altså ikke kun “hvor langt væk?”, men “hvor langt væk i forhold til variationen?”.</p>
 <h3>Sådan læses den nye placering</h3>
 <p>Centrum får placeringen nul. Over centrum giver en positiv placering; under centrum giver en negativ. En placering én spredning over centrum har samme betydning på standardskalaen, uanset om den oprindelige måling var liter, gram eller centimeter.</p>
 <p>Det gør forskellige normalmodeller sammenlignelige. Vi kan for eksempel sammenligne, hvor usædvanlig en fyldmængde er på to maskiner, selv om de fylder forskellige kartonstørrelser.</p>
 ${formula('Hvad gør standardiseringsformlen?',`<p>${math(z+op('=')+frac(x+op('−')+mu,sigma))}</p><p>Læs den i to handlinger: Find afstanden fra målingen til centrum. Mål derefter afstanden i spredninger. Resultatet z er uden enhed.</p><p>Den omvendte formel ${math(x+op('=')+mu+op('+')+sigma+z)} fører dig tilbage til den oprindelige måleskala. Den bruges for eksempel, når værktøjet har fundet en grænse på standardskalaen, og svaret skal gives i liter.</p><p>Efter standardisering har normalmodellen centrum nul og spredning én. Det er standardnormalfordelingen.</p>`)}
 <h3>“Normalt” og “exceptionelt” i opgaverne</h3>
 <p>For en normalmodel ligger cirka 95 % af arealet inden for to spredninger fra centrum. Materialet kalder dette normalintervallet. “Exceptionelt” bruges om udfald, der ligger <em>strengt mere end tre</em> spredninger fra centrum. Præcis tre er derfor ikke exceptionelt efter denne regel.</p>
 <p>Et usædvanligt udfald kan godt forekomme. Det er en grund til at undersøge målingen, ikke automatisk en grund til at slette den.</p>
 <p><strong>Dette interval handler om mulige målinger.</strong> Senere møder vi et konfidensinterval, som handler om usikkerheden på en parameter. De to intervaller svarer på forskellige spørgsmål.</p>
 ${idea('En afstand bliver forståelig, når vi sammenholder den med, hvor meget målingerne normalt varierer.')}
 ${onward('2/standard','Modul 2 · standardnormalfordelingen')}
`)}
${page('parametre','Hvad hvis vi ikke kender klokkens centrum eller bredde?',`
 <p>Indtil nu har vi forestillet os, at vi allerede kendte klokken. Men en opgave kan vende situationen om: Vi kender noget om andele eller grænser og skal finde den klokke, som passer til oplysningerne.</p>
 <p>Forestil dig to “pejlemærker” i produktionen. Vi ved, hvor en bestemt lille andel slutter, og hvor en anden, større andel slutter. Hvert pejlemærke fortæller noget om klokkens placering. Deres indbyrdes afstand fortæller noget om bredden.</p>
 <h3>Hvilke oplysninger hjælper med hvad?</h3>
 <p>Oplysningen “halvdelen ligger under denne værdi” udpeger centrum i en normalmodel. Den fortæller ikke, hvor bred klokken er. Både en smal og en bred klokke kan have samme centrum.</p>
 <p>Hvis centrum er kendt, kan en passende oplysning om en anden grænse og dens andel bestemme spredningen. Hvis både centrum og spredning er ukendte, skal der være tilstrækkelige forskellige oplysninger til at bestemme begge.</p>
 ${formula('Hvorfor dukker en ligning op?',`<p>En oplyst andel kan omsættes til en placering z på standardskalaen. Derefter knytter ${math(x+op('=')+mu+op('+')+sigma+z)} den kendte grænse x til det ukendte centrum eller den ukendte spredning.</p><p>Har vi to forskellige fraktiloplysninger, får vi to betingelser for den samme klokke. De løses sammen. Vi ændrer ikke en kendt måling; vi leder efter de parametre, som kan forklare begge oplysninger samtidig.</p>`)}
 <h3>Kontrollen er en del af svaret</h3>
 <p>Når parametrene er fundet, skal modellen kunne genskabe de oprindelige oplysninger. Spredningen skal også være positiv, og enhederne skal passe.</p>
 <p>En oplysning om en <em>tæthedshøjde</em> er anderledes end en oplysning om en andel. En klokke har to sider, så samme højde kan forekomme på hver sin side af centrum. Derfor kan nogle tæthedsopgaver give flere mulige løsninger, som alle skal undersøges.</p>
 ${idea('Ukendte parametre findes ved at få den samme model til at passe til alle de givne oplysninger. En enkelt oplysning bestemmer ikke nødvendigvis hele klokken.')}
 ${onward('3/oplysninger','Modul 3 · find middelværdi og spredning')}
`)}
${page('algebra','Algebra hjælper os med at holde styr på det ukendte',`
 <p>Her ligger en B-repetition om kvadratsætninger og to ligninger. Den kan virke som en afstikker, men den giver redskaber til de situationer, hvor et tal endnu ikke er kendt.</p>
 <p>Tænk på et ukendt tal som en tom plads med et navn. En ligning siger, hvilke krav tallet skal opfylde. Vi omskriver for at gøre den tomme plads lettere at finde, mens vi bevarer kravet.</p>
 <h3>En ligning er en balance</h3>
 <p>Vi må ikke ændre en side alene og stadig kalde det samme balance. Ved at udføre den samme tilladte handling på begge sider kan vi bevare løsningerne. Til sidst sætter vi vores fundne tal ind i den oprindelige ligning og ser, om kravet faktisk er opfyldt.</p>
 <h3>To oplysninger skal passe til det samme par</h3>
 <p>Når både centrum og spredning er ukendte, kan én oplysning efterlade flere muligheder. En anden oplysning kan indsnævre dem. En løsning skal være <strong>det samme par tal</strong>, som passer til begge betingelser.</p>
 <p>Indsættelse betyder, at vi beskriver den ene ukendte ved hjælp af den anden og bruger beskrivelsen i næste ligning. Elimination betyder, at vi kombinerer ligningerne, så én ukendt forsvinder fra et regnetrin. Begge metoder søger det samme fælles svar.</p>
 ${formula('Hvad hjælper kvadratsætningerne med?',`<p>${math(power(a+op('+')+b,2)+op('=')+power(a,2)+op('+')+n(2)+a+b+op('+')+power(b,2))}</p><p>En sum, som ganges med sig selv, indeholder også de blandede produkter. Reglen hjælper os med at skifte mellem en parentes og en udfoldet beskrivelse uden at miste led. Den gælder for alle værdier af bogstaverne og kaldes derfor en identitet.</p><p>En ligning, der skal løses, stiller derimod typisk et krav, som kun bestemte værdier opfylder. Kvadrater optræder senere blandt andet i spredninger og i afstande til regressionslinjen.</p>`)}
 ${idea('Bogstaver gør det muligt at arbejde med tal, vi endnu ikke kender. Kontrollen i de oprindelige krav viser, om svaret holder.')}
 ${onward('repetition/start','B-repetition 10–11 · algebra i dit eget tempo')}
`)}
${page('normalplot','Passer klokken egentlig til målingerne?',`
 <p>En model kan være nem at beregne med og samtidig passe dårligt til virkeligheden. Før vi bruger dens sandsynligheder til en konklusion, skal vi derfor se på målingerne og på, hvordan de er indsamlet.</p>
 <p>Et <strong>normalfordelingsplot</strong> hjælper os med at sammenligne målingernes mønster med en normalmodel. Navnet forkortes også til normalplot; et qq-plot er en måde at sammenligne fraktiler på.</p>
 <h3>Hvorfor leder vi pludselig efter en ret linje?</h3>
 <p>Vi sorterer målingerne fra mindst til størst og sammenholder deres placering i rækken med de placeringer, vi ville forvente i en normalmodel. Den nye graf er indrettet sådan, at en god overensstemmelse omtrent danner en ret linje.</p>
 <p>Linjen i normalplottet betyder altså ikke, at klokken er blevet til en ret linje på den oprindelige tæthedsgraf. Vi sammenligner de samme målingers placeringer på en anden måde. Akserne kan være vendt forskelligt i forskellige værktøjer, så læs altid deres navne.</p>
 <h3>Se på hele mønstret</h3>
 <p>Små ujævne afvigelser fra en ret linje er forventelige i en stikprøve. En vedvarende bue eller et tydeligt anderledes mønster i enderne kan være et tegn på, at normalmodellen er utilstrækkelig.</p>
 <p>At der ikke er ekstreme enkeltmålinger, er ikke nok til at godkende modellen. Et pænt plot beviser heller ikke, at udvalget repræsenterer hele produktionen. Målinger taget på ét særligt tidspunkt kan give et skævt billede.</p>
 ${formula('Fra modelparametre til skøn fra data',`<p>En models middelværdi μ og spredning σ er ikke automatisk kendt. Fra stikprøven beregner vi skøn: gennemsnittet ${math(bar(x))} og stikprøvespredningen ${math(s)}.</p><p>${math(bar(x)+op('=')+frac(op('∑')+sub(x,i),count))} samler målingerne og deler med deres antal. Tegnet ∑ betyder “læg alle de relevante led sammen”.</p><p>${math(s+op('=')+'<msqrt>'+frac(op('∑')+power(sub(x,i)+op('−')+bar(x),2),count+op('−')+n(1))+'</msqrt>')} måler variation omkring det beregnede gennemsnit. Indekset i betyder målingens nummer. Kvadrater samler afvigelsernes størrelse uden, at plus og minus ophæver hinanden; kvadratroden giver måleenheden tilbage.</p><p>Her bruges nævneren n−1, fordi gennemsnittet også er beregnet fra stikprøven. Et andet udvalg kan give andre skøn. I modulets plotaflæsninger kan skøn fra en tegnet linje desuden afvige lidt fra dem, der beregnes direkte fra alle data.</p>`)}
 ${idea('Et normalplot kan støtte en normalmodel eller give grund til tvivl. Det kan ikke alene bevise, at modellen og dataindsamlingen er i orden.')}
 ${onward('4/plot','Modul 4 · normalfordelingsplot')}
`)}
${page('regression','Nu undersøger vi to størrelser sammen',`
 <p>Indtil nu spurgte vi til indholdet i én karton. Nu skifter spørgsmålet: “Hvordan hænger mængden, der skal produceres, sammen med den tid, arbejdet tager?”</p>
 <p>Hver produktionsserie giver et <strong>talpar</strong>: mængde og arbejdstid fra den samme serie. På en graf bliver parret til én prik. Mængden ligger vandret; tiden ligger lodret.</p>
 <p>Store serier tager måske typisk længere tid, men to lige store serier behøver ikke tage præcis lige lang tid. Vi leder efter en tendens, som går gennem en sky af forskellige målinger.</p>
 <figure class="normal-concepts">${introRegressionFigure()}<figcaption>Skitse af tænkte produktionsserier. Den rette linje beskriver en tendens; prikkerne er de enkelte serier. Den markerede afstand bliver vigtig på næste side.</figcaption></figure>
 <h3>Hældningen beskriver en ændring</h3>
 <p><strong>Lineær regression</strong> tilpasser en ret linje til punkterne. Hældningen fortæller, hvor meget modellens arbejdstid ændrer sig pr. ekstra mængdeenhed. En positiv hældning betyder en stigende tendens; en negativ betyder en faldende.</p>
 <p>Linjen kan bruges til at skønne den typiske arbejdstid ved en bestemt mængde. Den lover ikke den præcise tid for den næste serie. Langt uden for de mængder, vi har målt, kan sammenhængen være anderledes.</p>
 ${formula('Læs regressionslinjen med ord',`<p>${math(hat(mi('y'))+op('=')+a+x+op('+')+b)}</p><ul><li>x er produktionsmængden, som vi giver modellen.</li><li>y med en lille hat er den arbejdstid, linjen giver som modelværdi. Uden hat er y den observerede tid.</li><li>a er hældningen: ændring i modeltid pr. ekstra mængdeenhed.</li><li>b er linjens modelværdi ved mængden nul. Den har ikke altid en meningsfuld praktisk fortolkning, især hvis nul ligger langt uden for data.</li></ul><p>Formlen bruges til modelværdier og ændringer. Enhederne er en hjælp: en hældning kan for eksempel have enheden timer pr. hektoliter.</p>`)}
 <p>En tydelig sammenhæng beviser ikke i sig selv årsag. Andre forhold kan spille ind. Hvor stærkt vi kan konkludere om årsager, afhænger også af, hvordan undersøgelsen er lavet.</p>
 ${idea('Regression beskriver en tendens mellem to størrelser. Linjen og de enkelte målinger er forskellige ting.')}
 ${onward('5/regression','Modul 5 · linje og hældning')}
`)}
${page('residualer','Afstandene til linjen fortæller også en historie',`
 <p>Tag én produktionsserie i grafen. Ved dens mængde giver linjen en modeltid. Den virkelige serie kan have taget længere eller kortere tid.</p>
 <p>Den lodrette forskel kaldes et <strong>residual</strong>. Vi tager den observerede tid og trækker modeltiden fra. Et punkt over linjen giver et positivt residual; et punkt under giver et negativt.</p>
 <h3>Hvorfor tegner vi endnu en graf?</h3>
 <p>I et residualplot beholder vi produktionsmængden vandret, men viser nu afvigelsen lodret. Linjen nul betyder “måling og model passer her”. Dermed bliver det lettere at opdage mønstre, som den stigende regressionslinje kan skjule.</p>
 <p>Ujævne punkter omkring nul uden et tydeligt mønster er forenelige med en lineær middelmodel. En bue tyder på, at en ret linje ikke fanger hele formen. En tragt tyder på, at variationen ændrer sig med produktionsmængden.</p>
 <h3>Hvor langt fra linjen ligger serierne typisk?</h3>
 <p><strong>Residualspredningen</strong> opsummerer størrelsen af afvigelserne omkring linjen. Den har samme enhed som arbejdstiden. Den er noget andet end spredningen i alle arbejdstider omkring deres fælles gennemsnit: regressionen tager højde for, at større serier kan have en anden modeltid.</p>
 ${formula('Hvad bruges residualformlerne til?',`<p>${math(sub(mi('e'),i)+op('=')+sub(mi('y'),i)+op('−')+sub(hat(mi('y')),i))} betyder “residual = observeret værdi minus modelværdi” for den samme serie i. Den bruges til at finde og tegne afvigelserne.</p><p>${math(s+op('=')+'<msqrt>'+frac(op('∑')+power(sub(mi('e'),i),2),count+op('−')+n(2))+'</msqrt>')} samler residualernes størrelse i én spredning. Afvigelserne kvadreres, så positive og negative ikke ophæver hinanden. Kvadratroden bringer enheden tilbage til tid.</p><p>Nævneren er antal talpar minus to i den sædvanlige model med beregnet hældning og skæring. Vi har brugt data til at bestemme to koefficienter. Denne residualspredning må ikke sættes direkte ind som fejlmargin på hældningen.</p>`)}
 <h3>Hvor kommer normalfordelingen ind igen?</h3>
 <p>I den klassiske regressionsmodel antager vi normalfordelte fejl omkring linjen ved en given produktionsmængde. Vi undersøger det med et normalplot af residualerne. Kravet er altså ikke, at alle produktionsmængder eller alle arbejdstider samlet skal være normalfordelte.</p>
 <p>Vi skal også overveje, om afvigelserne er uafhængige, og om spredningen er nogenlunde ens. Serier, der følger hinanden i tid, kan for eksempel påvirkes af samme driftsproblem. Et plot afgør ikke alene dette.</p>
 ${idea('Residualerne hjælper os med at vurdere linjens model. En beregnet linje er først nyttig, når vi også undersøger det, den ikke forklarer.')}
 ${onward('5/residualer','Modul 5 · residualer og modelkontrol')}
`)}
${page('usikkerhed','Et andet udvalg kan give en anden hældning',`
 <p>Forestil dig, at vi gentager undersøgelsen med andre produktionsserier under de samme forhold. Punkterne vil ikke ligge helt de samme steder. Den nye regressionslinje får derfor sandsynligvis en lidt anden hældning.</p>
 <p><strong>Den beregnede hældning er et skøn.</strong> Et skøn kaldes også et estimat. Det bygger på netop de data, vi har fået. Vi prøver at lære noget om en underliggende tendens, men vi har ikke adgang til alle tænkelige gentagelser.</p>
 <h3>Hold tre størrelser adskilt</h3>
 <ul><li><strong>Residualspredning:</strong> Hvor meget varierer målingerne omkring linjen? I historien måles den i tid.</li><li><strong>Standardfejl på hældningen:</strong> Hvor usikkert er skønnet for hældningen, fordi det bygger på en stikprøve? Den har hældningens enhed.</li><li><strong>Fejlmargin:</strong> Hvor langt går vi ud til hver side af hældningsskønnet, når vi bygger et bestemt konfidensinterval? Den afhænger også af det valgte dækningsniveau.</li></ul>
 <p>De handler alle om variation, men om forskellige ting. Målingerne kan variere meget, samtidig med at mange informative målinger giver et forholdsvis præcist skøn for tendensen.</p>
 <h3>Hvad kan gøre skønnet mere præcist?</h3>
 <p>Ved sammenlignelige undersøgelser kan flere uafhængige målinger og mindre variation omkring linjen mindske usikkerheden. Det betyder også noget, at produktionsmængderne spreder sig over et passende område. Hvis alle mængder næsten er ens, er det sværere at se, hvordan tiden ændrer sig med mængden.</p>
 <p>Et stort udvalg reparerer dog ikke automatisk en skæv udvælgelse eller en dårlig model. Og mange decimaler i værktøjets svar betyder ikke, at vores viden er lige så præcis.</p>
 ${formula('Hvorfor står der endnu en spredning i intervalformlen?',`<p>Standardfejlen betegnes her ${math(sub(s,a))}, læst “s med indeks a”. Indekset minder om, at det er usikkerheden på hældningen a.</p><p>I ${math(sub(s,a)+op('=')+frac(s,'<msqrt>'+sub(mi('S'),x+x)+'</msqrt>'))} kommer s fra residualspredningen. Størrelsen under kvadratroden samler, hvor meget x-værdierne spreder sig omkring deres gennemsnit.</p><p>Formlen gør to idéer konkrete: stor variation omkring linjen gør hældningen sværere at bestemme; større variation i de vandrette værdier kan gøre den lettere at bestemme. Statistikværktøjet beregner standardfejlen fra alle talparrene.</p>`)}
 ${idea('Der er forskel på, hvor meget de enkelte målinger varierer, og hvor præcist vi kender den underliggende hældning.')}
 ${onward('5/usikkerhed','Modul 5 · se gentagne stikprøver')}
`)}
${page('interval','Et konfidensinterval viser usikkerhed på hældningen',`
 <p>Ét hældningstal kan se mere sikkert ud, end det er. Derfor angiver vi ofte et interval omkring skønnet. Det kaldes et <strong>konfidensinterval</strong>.</p>
 <p>Vi tager den beregnede hældning som midte og går en fejlmargin til hver side. Et smalt interval viser større præcision inden for den valgte model. Et bredt interval viser, at de samme data efterlader større usikkerhed om hældningen.</p>
 ${formula('Sådan bruges intervalformlen',`<p>${math(op('[')+a+op('−')+mi('t')+op('·')+sub(s,a)+op(';')+a+op('+')+mi('t')+op('·')+sub(s,a)+op(']'))}</p><p>Læs den som “beregnet hældning minus en fejlmargin; beregnet hældning plus den samme fejlmargin”. Standardfejlen ${math(sub(s,a))} kommer fra data. Faktoren t tager højde for det valgte niveau og antallet af talpar.</p><p>I den sædvanlige lineære model bruges Student-fordelingen med n−2 frihedsgrader. Ved et tosidet 95 %-interval fordeles den resterende del på de to haler. Faktoren er ikke altid 1,96; med få talpar er den større.</p><p>Et værktøj kan give intervallet direkte. Du skal stadig kontrollere, at det er et interval for <em>hældningen</em>, og at enheder og modelantagelser passer.</p>`)}
 <h3>Hvad betyder de 95 %?</h3>
 <p>Forestil dig mange gentagelser af samme slags undersøgelse. Hver gang tager vi nye data og beregner et nyt interval på samme måde. Under modelantagelserne vil cirka 95 % af intervallerne dække den samme, faste underliggende hældning.</p>
 <p><strong>De 95 % beskriver metodens træfsikkerhed ved gentagelser.</strong> De betyder ikke, at 95 % af datapunkterne ligger i hældningsintervallet. Intervallets grænser har hældningens enhed, ikke målingernes enhed.</p>
 <p>For det ene interval, vi nu har beregnet, ved vi ikke, om det rammer den ukendte hældning. I den klassiske fortolkning tildeler vi ikke bagefter den faste parameter en sandsynlighed på 95 % for at ligge i netop dette interval.</p>
 <h3>Hvorfor ser vi efter nul?</h3>
 <p>Hældning nul betyder en vandret lineær tendens. Derfor gør det en forskel, om hele intervallet ligger over nul, under nul eller hen over nul. Se på hele intervallet i figuren.</p>
 ${introVisual('interval')}
 <p>Nul tæller også med, når det ligger præcis på en grænse. At intervallet rummer nul, beviser ikke, at der ingen sammenhæng er. Og et interval helt på én side af nul beviser ikke en årsagssammenhæng.</p>
 ${idea('Konfidensintervallet handler om usikkerheden på en hældning. Fortolkningen gælder under modelantagelserne og skal ses sammen med data og residualkontrol.')}
 ${onward('5/interval','Modul 5 · beregning og fortolkning af konfidensinterval')}
`)}
${page('omformning','Nogle sammenhænge bliver enklere på en anden skala',`
 <p>En ret linje passer ikke til alle sammenhænge. Nogle gange peger opgavens model eller den faglige viden på, at vi skal se på en ændret udgave af den lodrette størrelse.</p>
 <p>Det kan sammenlignes med at skifte, hvad en akse måler. Prikkerne bygger stadig på de samme observationer, men deres lodrette placering ændres efter en bestemt regel.</p>
 <h3>To eksempler fra forløbet</h3>
 <p>I én model bruger vi <strong>én divideret med responsen</strong>, som kaldes den reciprokke respons. I en anden bruger vi <strong>hastigheden i anden</strong> i stedet for hastigheden selv. En sammenhæng, der bøjer på den oprindelige skala, kan i sådanne modeller blive tilnærmet lineær på den ændrede skala.</p>
 <p>Det er ikke en tilladelse til at ændre data, indtil en graf ser pæn ud. Omformningen skal passe til den stillede model og det spørgsmål, vi vil besvare. Vi skal fortsat undersøge, om den tilpassede model er rimelig.</p>
 ${formula('Hvordan bruges formlerne på den nye skala?',`<p>En lineær model ${math(frac(n(1),mi('y'))+op('=')+a+x+op('+')+b)} beskriver den reciprokke respons. Den oprindelige respons kan findes ved at tage én divideret med modellens resultat. Responsen må ikke være nul, og den tilbageførte model er kun defineret, hvor dens nævner ikke er nul.</p><p>En model ${math(power(mi('y'),2)+op('=')+a+x+op('+')+b)} beskriver responsen i anden. Når responsen er en ikke-negativ hastighed, går vi tilbage ved at tage den positive kvadratrod. Modellens værdi under roden skal være ikke-negativ.</p><p>Hældningen beskriver ændringen på den <em>omformede</em> skala. Et eventuelt interval for den hældning kan derfor ikke uden videre læses som et interval for en konstant hældning på den oprindelige skala.</p>`)}
 <p>Det praktiske mønster er: Opret den ændrede størrelse, tilpas modellen på den nye skala, og gå om nødvendigt tilbage for at besvare det oprindelige spørgsmål. Bevar talparrene, enhederne og de begrænsninger, modellen har.</p>
 ${idea('Når vi skifter skala, skifter koefficienternes betydning med. Konklusionen skal altid fortælle, hvilken størrelse modellen faktisk beskriver.')}
 ${onward('5/omformning','Modul 5 · omformede modeller')}
`)}
${page('overblik','Hele forløbet begynder med et spørgsmål',`
 <p>Du behøver ikke holde alle formlerne i hovedet på én gang. Prøv først at genkende, hvad situationen handler om. Derefter kan du finde det redskab, der svarer til spørgsmålet.</p>
 <h3>Historien om mælkekartonerne</h3>
 <p>Vi begynder med forskellige fyldmængder. En normalmodel kan beskrive variationen med et centrum og en spredning. Modellen giver sandsynligheder for områder: under, over eller mellem fyldgrænser.</p>
 <p>Stort F samler areal fra venstre. En fraktil vender spørgsmålet om og finder en grænse fra en andel. Standardisering gør det muligt at læse placeringer i spredninger. Kender vi ikke parametrene, må vi finde dem ud fra tilstrækkelige oplysninger eller skønne dem fra data. Normalplottet hjælper os med at vurdere, om klokken er en rimelig model.</p>
 <h3>Historien om produktion og arbejdstid</h3>
 <p>Nu har hver serie både en mængde og en tid. Regression beskriver deres lineære tendens. Residualerne viser forskellene mellem målte tider og linjens modeltider. Deres mønster og spredning hjælper os med at undersøge modellen.</p>
 <p>En ny stikprøve kan give en anden hældning. Standardfejlen beskriver usikkerheden på skønnet. Et konfidensinterval gør den usikkerhed synlig og hjælper os med at vurdere, om retningen er fastslået ved det valgte niveau under antagelserne.</p>
 <h3>Tre spørgsmål at holde adskilt</h3>
 <dl class="normal-intro-questions"><dt>Hvad har vi målt?</dt><dd>Konkrete observationer i en stikprøve. De har enheder og kommer fra en bestemt indsamling.</dd><dt>Hvilken model bruger vi?</dt><dd>En beskrivelse med antagelser: for eksempel en normalfordeling eller en ret linje med variation omkring.</dd><dt>Hvor langt rækker konklusionen?</dt><dd>Til det, data, model og usikkerhed understøtter. En beregning kan ikke alene sikre, at udvalget er repræsentativt, eller at en sammenhæng er en årsag.</dd></dl>
 <p>Det er en god forklaring at kunne sige med almindelige ord, hvad et resultat gælder. De konkrete beregninger, værktøjer og opgaver ligger klar i modulerne. Herfra kan du begynde på dem eller genlæse én af idéerne fra menuen.</p>
 ${idea('Spørgsmål → data og model → passende redskab → kontrol → en konklusion med den rette grad af sikkerhed.')}
 <p><a class="primary-button" href="#normalDistribution/1/start">Begynd Modul 1</a></p><p><a href="#normalDistribution/opsamling/start">Gå til opsamlingen</a> · <a href="#normalDistribution">Se hele forløbet</a></p>
`)}
`;}
