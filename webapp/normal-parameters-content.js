import { math,n,mi,op,mu,sigma,X,frac,fn,distribution,densityFormula } from './normal-math.js';
import { z,Phi } from './normal-standard-math.js';
import { parameterLabMarkup,densityLabMarkup } from './normal-parameters-graphs.js';
import { normalSection as section,normalExample as example,normalImportant as important } from './normal-lesson-support.js';
import { parameterPre,parameterMini,parameterFinal } from './normal-parameters-exercises.js';
import { normalParameterTasks } from './tasks/bank/normal-parameters.js';
import { renderExercises } from './integral-exercises.js';
const panel=(step,body)=>`<div data-normal-step="${step}" hidden>${body}</div>`;
const mini=i=>renderExercises([parameterMini[i]]);
const worked=(id,title)=>{const t=normalParameterTasks.find(t=>t.id==='norm3.'+id);return example(title,t.prompt+(t.figure||'')+t.solution);};
const sub=(name,index)=>`<msub><mi>${name}</mi><mn>${index}</mn></msub>`;
const b=mi('b'),p=mi('p'),zp='<msub><mi>z</mi><mi>p</mi></msub>';
export function parameterContent(){return `<p data-lesson-warning role="status" hidden></p>
${panel('start',section('Det skal du kunne',`
 <p>I Modul 2 var modelparametrene kendt. Nu vender vi spørgsmålet om: hvilke parametre får en normalmodel til at passe med de oplyste sandsynligheder?</p>
 <ul><li>Skelne kendte oplysninger fra ukendte parametre og vurdere, om oplysningerne er tilstrækkelige.</li><li>Omsætte højre hale, venstre hale og mellemområde korrekt.</li><li>Bestemme en ukendt spredning, når middelværdien er kendt, eller en ukendt middelværdi, når spredningen er kendt.</li><li>Bestemme begge parametre ud fra to passende grænseoplysninger.</li><li>Kontrollere positiv spredning, enheder og alle oprindelige sandsynligheder.</li><li>Skelne en tæthedsbetingelse fra en sandsynlighedsbetingelse og finde alle mulige løsninger.</li></ul>
 <p>Mål: især A6, med fortsat træning af A2–A5, U1–U5, U7 og K4–K6. Her bestemmes modelparametre fra givne betingelser. Beregning af stikprøvens gennemsnit og spredning ud fra et helt datasæt kommer i Modul 4.</p>
`)+section('Forudsætningstjek',`
 <p>De otte spørgsmål undersøger regning og statistik hver for sig. Brug grundhjælpen ved det konkrete spørgsmål; et forkert svar låser ingen sider.</p><p data-parameter-pre-status role="status"></p>${renderExercises(parameterPre)}
 <div id="parameter-basics" tabindex="-1"><h3>Grundhjælp · vælg det trin, der driller</h3>
 <details data-parameter-basic="sign"><summary>Fortegn og forskelle</summary><p>${math(n(2)+op('−')+n(5)+op('=')+n(-3))}. En grænse under centrum giver en negativ afstand. Det gør ikke spredningen negativ.</p><a href="#normalDistribution/2/standard">Genlæs standardisering med fortegn</a></details>
 <details data-parameter-basic="fraction"><summary>Division og brøker</summary><p>Negativt divideret med negativt er positivt. ${math(frac(n(-3),op('−')+n('1,5'))+op('=')+n(2))}. Nævneren må ikke være nul. Undersøg, hvad oplysningerne betyder, før du forsøger at dividere med en standardiseret værdi på nul.</p><a href="#equations">Øv regnetrin og ligninger</a></details>
 <details data-parameter-basic="tail"><summary>Haler, intervaller og procent</summary><p>30 % til højre svarer til 70 % til venstre. Et mellemområde er forskellen mellem to opsamlede arealer. Procent omregnes til decimaltal ved division med 100.</p><a href="#normalDistribution/1/fordeling">Genlæs de tre områdetyper</a></details>
 <details data-parameter-basic="equation"><summary>Isolering af en ukendt</summary><p>Gør det samme på begge sider. Hvis en grænse er middelværdi plus et kendt bidrag, trækkes bidraget fra grænsen for at finde middelværdien. Hvis den samme ukendte indgår i to ligninger, kan subtraktion fjerne den.</p><a href="#equations">Øv ligninger</a><p>B-repetition 10–11 uddyber senere ligningssystemer og kvadratsætninger.</p></details>
 <details data-parameter-basic="parameter"><summary>Modelparameter, observation og estimat</summary><p>Middelværdi og spredning beskriver modellen. En observation er én registreret måling. Et estimat er et beregnet skøn fra data. I dette modul er oplysninger om modellen givet på forhånd; beregning fra hele stikprøven er en anden opgave.</p><a href="#normalDistribution/1/model">Genlæs de tre begreber</a></details>
 <details data-parameter-basic="cdf"><summary>Tæthed og fordelingsfunktion</summary><p>Lille f angiver kurvehøjde. Stort F angiver opsamlet venstre areal. Et areal på 0,10 må ikke indsættes som en tæthedshøjde på 0,10.</p><a href="#normalDistribution/1/taethed">Genlæs tæthed og areal</a></details>
 <details data-parameter-basic="square"><summary>Kvadrering og to fortegn</summary><p>Et tal og dets negative har samme kvadrat. Minus to ganget med minus to giver fire, ligesom to ganget med to. Derfor kan en betingelse om en kvadreret afstand nogle gange give to løsninger.</p><a href="#normalDistribution/repetition">Se den planlagte B-repetition</a></details>
 <details data-parameter-basic="tool"><summary>CAS og omvendt normalberegning</summary><p>En standardfraktil findes fra et venstre areal i en normalmodel med centrum nul og spredning én. Ved en ligning i en ukendt parameter skal CAS have netop denne parameter som den ukendte. Gem input, output og din kontrol.</p><a href="#normalDistribution/2/sandsynlighed">Genlæs standardfraktiler og værktøjsbrug</a></details>
 </div>
`))}
${panel('oplysninger',section('Hvad ved vi, og hvad leder vi efter?',`
 <p>Tænk på en klokke, der kan flyttes og gøres bredere. Middelværdien flytter centrum, og spredningen ændrer bredden. En oplysning om en sandsynlighed er et krav til et bestemt areal under klokken.</p>
 ${parameterLabMarkup()}
 <div class="int-table" tabindex="0" role="region" aria-label="Kendte oplysninger og ukendte parametre"><table><thead><tr><th>Det ved vi</th><th>Det mangler</th><th>Hvilken ekstra oplysning bruges?</th></tr></thead><tbody><tr><td>Middelværdi</td><td>Spredning</td><td>Et passende areal ved en kendt grænse væk fra centrum</td></tr><tr><td>Spredning</td><td>Middelværdi</td><td>Et areal ved en kendt grænse</td></tr><tr><td>Ingen af parametrene</td><td>Begge</td><td>To forskellige grænser med passende, forskellige opsamlede arealer</td></tr></tbody></table></div>
 <p>Symbolerne ${math(mu)} og ${math(sigma)} betegner stadig middelværdi og spredning. En parameter kan være kendt i én opgave og ukendt i en anden.</p>
 ${example('Gennemregnet: én betingelse kan passe til flere klokker','<ol><li>Vi kender kun et areal ved én grænse. Begge parametre er ukendte.</li><li>En ændring af centrum kan ofte opvejes af en ændring af bredden, så samme areal stadig passer.</li><li>Vi har derfor ikke generelt bestemt én model. Vi behøver en ekstra uafhængig oplysning.</li></ol>')}${mini(0)}
 ${important('Find først de kendte og ukendte størrelser. To tal i teksten er ikke automatisk to uafhængige betingelser. En gentagelse af samme oplysning giver ikke en ny ligning.')}
`)+section('Aflæs centrum og bredde i en fordelingsgraf',`
 <p>En normalfordelings middelværdi ligger der, hvor halvdelen af arealet er samlet op. Bredden kræver en ekstra aflæsning væk fra centrum.</p>
 ${worked('read-cdf','Gennemregnet: to aflæsninger i en fordelingsgraf')}${mini(1)}
 <p>Aflæsning giver den nøjagtighed, grafen tillader. Du skal ikke udgive en grov aflæsning for et resultat med mange sikre decimaler.</p>
`)+section('Omsæt først til venstre areal',`
 <p>Standardnormalfordelingens omvendte beregning bruger normalt arealet til venstre. Et oplyst højre areal skal derfor omsættes, før du finder den standardiserede grænse.</p>
 ${example('Gennemregnet: 10 % over en grænse','<ol><li>Hele arealet er én, og højre hale er 0,10.</li><li>Venstre areal er 1 minus 0,10, altså 0,90.</li><li>Find 90 %-grænsen i standardmodellen. Den er positiv, fordi grænsen ligger over centrum.</li></ol>')}${mini(2)}
 <p>Et mellemområde kræver en ekstra omregning: kender du den nedre grænses venstre areal, lægges mellemområdet til for at finde det samlede venstre areal ved den øvre grænse.</p>
`))}
${panel('spredning',section('Kendt centrum · find bredden',`
 <p>Når centrum er låst, kan et areal ved en anden grænse fortælle, hvor bred klokken skal være. I laboratoriets fosforeksempel er centrum 5 kg, men kun 10 % må ligge under 2 kg.</p>
 <p>Afstanden fra centrum til grænsen måles både i kg og i antal spredninger. Hvis vi ved, hvor mange spredninger afstanden svarer til, kan vi finde størrelsen af én spredning.</p>
 <dl class="normal-symbols"><dt>${math(b)}</dt><dd>Den kendte grænse på den oprindelige måleskala.</dd><dt>${math(p)}</dt><dd>Det oplyste venstre areal, skrevet som decimaltal mellem nul og én.</dd><dt>${math(zp)}</dt><dd>Standardfraktilen, der hører til venstre areal p. Det lille p står som indeks og fortæller, hvilket areal fraktilen tilhører.</dd><dt>${math(Phi(zp)+op('=')+p)}</dt><dd>Fordelingsfunktionen phi i standardmodellen har værdien p ved denne standardiserede grænse.</dd></dl>
 <p>Fra Modul 2 ved vi, at ${math(frac(b+op('−')+mu,sigma)+op('=')+zp)}. Gang først med spredningen og isolér den derefter:</p><p>${math(sigma+op('=')+frac(b+op('−')+mu,zp))} når standardfraktilen er forskellig fra nul.</p>
 ${worked('sd','Gennemregnet: fosfor med kendt middelværdi')}${mini(3)}
 ${important('Spredningen er en positiv størrelse i samme enhed som målingerne. To negative tal kan godt give en positiv spredning ved division. Et negativt resultat skal undersøges, ikke godkendes som en anden slags normalfordeling.')}
`)+section('Kontrollér, om oplysningerne kan passe',`
 <p>Et værktøj kan kun løse den ligning, du har givet det. Derfor skal du også kontrollere retning, område og modellens krav.</p>
 ${example('Gennemregnet: en umulig oplysning','<ol><li>Middelværdien siges at være 5, men kun 10 % skulle ligge under 6.</li><li>Ved 5 ligger allerede halvdelen til venstre. Ved den større grænse 6 må der ligge mere end halvdelen til venstre.</li><li>Oplysningerne er modstridende. En negativ spredning fra en forkert ligning gør dem ikke mulige.</li></ol>')}${mini(4)}
 <h3>Særtilfældet ved centrum</h3><p>Hvis venstre areal er en halv, er standardfraktilen nul. Når grænsen samtidig er den kendte middelværdi, passer alle positive spredninger. Der er ikke nok information om bredden, og man må ikke dividere med nul.</p>
 ${example('Ekstra kontrol fra arket: en anden udledning','<ol><li>Middelværdien er 15, og det venstre areal ved 6 er 0,10.</li><li>Afstanden er minus ni. Standardfraktilen er den samme negative 10 %-grænse som før.</li><li>Spredningen bliver cirka 7,0227. En fremadrettet beregning giver igen cirka 0,10 ved 6.</li></ol>')}
`))}
${panel('middelvaerdi',section('Kendt spredning · find centrum',`
 <p>Nu kender vi bredden, men klokken skal placeres. Grænsens standardfraktil siger, hvor mange spredninger grænsen ligger fra centrum.</p>
 <p>Tænk på en grænse ved 12, der ligger én spredning på to enheder over centrum. Så må centrum være 10. Vi går fra grænsen tilbage mod centrum.</p>
 <p>Symbolerne er de samme som før. Den kendte grænse er centrum plus dens afstand fra centrum:</p><p>${math(b+op('=')+mu+op('+')+sigma+op('·')+zp)}.</p><p>Isolér middelværdien: ${math(mu+op('=')+b+op('−')+sigma+op('·')+zp)}.</p>
 ${worked('mean','Gennemregnet: 30 % af kaffeposerne over 500 g')}${mini(5)}
 ${important('Når grænsen ligger over centrum, trækkes en positiv afstand fra grænsen. Når grænsen ligger under centrum, trækkes et negativt bidrag fra. Fortegnet skal passe med den placering, du forventer.')}
 <h3>En grænse under centrum</h3>${example('Gennemregnet: slikposer fra arket','<ol><li>Spredningen er 5 g, og 40 % ligger under 497 g.</li><li>40 %-fraktilen i standardmodellen er cirka minus 0,2533471.</li><li>Middelværdien er derfor 497 minus fem gange denne negative værdi, cirka 498,267 g.</li><li>Centrum ligger over 497 g, som det skal, når mindre end halvdelen ligger under grænsen.</li></ol>')}
 <p>Ved kontrol beregnes den oprindelige oplyste hale. Kaffens oplysning var 30 % over 500 g; det skal være denne højre hale, der genfindes.</p>
`))}
${panel('begge',section('To ukendte · begynd med lige store haler',`
 <p>Når halerne er lige store ved to grænser på hver side, ligger centrum midt imellem. Først finder vi dermed middelværdien ved symmetri; derefter bruges afstanden til at finde spredningen.</p>
 <div class="int-table" tabindex="0" role="region" aria-label="Olieeksemplets oplysninger"><table><thead><tr><th>Grænse</th><th>Oplyst område</th><th>Venstre areal</th></tr></thead><tbody><tr><td>90 liter</td><td>40 % under</td><td>0,40</td></tr><tr><td>110 liter</td><td>40 % over</td><td>0,60</td></tr></tbody></table></div>
 ${worked('oil','Gennemregnet: olie med to lige store haler')}${mini(6)}
 <p>Midtpunktet fortæller centrum. Afstanden fra centrum til en grænse er ikke automatisk én spredning; det afhænger af det oplyste areal.</p>
`)+section('To grænser giver to ligninger',`
 <p>Ved forskellige haler kan vi ikke bare tage midtpunktet. Men hver grænse kan stadig skrives som centrum plus et antal spredninger. Det giver to ligninger med de samme to ukendte.</p>
 <dl class="normal-symbols"><dt>${math(sub('b',1))} og ${math(sub('b',2))}</dt><dd>De to kendte grænser. Indekserne ét og to skelner mellem første og anden grænse.</dd><dt>${math(sub('z',1))} og ${math(sub('z',2))}</dt><dd>De standardfraktiler, som hører til de to grænsers venstre arealer.</dd></dl>
 <p>${math(sub('b',1)+op('=')+mu+op('+')+sigma+op('·')+sub('z',1))} og ${math(sub('b',2)+op('=')+mu+op('+')+sigma+op('·')+sub('z',2))}.</p>
 <p>Når den første ligning trækkes fra den anden, forsvinder den samme middelværdi. Afstanden i oprindelige enheder svarer til spredningen gange afstanden i antal spredninger.</p>
 <p>${math(sigma+op('=')+frac(sub('b',2)+op('−')+sub('b',1),sub('z',2)+op('−')+sub('z',1)))}. Find derefter ${math(mu+op('=')+sub('b',1)+op('−')+sigma+op('·')+sub('z',1))}.</p>
 ${example('Gennemregnet med enkle afstande','<ol><li>To grænser ligger 12 enheder fra hinanden.</li><li>Deres standardiserede placeringer ligger tre spredninger fra hinanden.</li><li>Én spredning er derfor fire oprindelige enheder: tolv divideret med tre.</li><li>Indsæt spredningen ved én af de kendte grænser for at finde centrum.</li></ol>')}${mini(7)}
 ${worked('asymmetric','Gennemregnet: to forskellige ydre haler')}
 ${important('Midtpunktmetoden kræver symmetri. Metoden med to ligninger bruger begge grænser og begge venstre arealer og virker også, når de ydre haler ikke er lige store.')}
`)+section('Kontrollér begge betingelser',`
 <p>Gå tilbage til den fundne normalmodel og beregn hver af de oprindelige sandsynligheder. Kontrollér også spredningens fortegn og de konkrete enheder.</p>
 ${example('Gennemregnet: kontrol af teposernes model','<ol><li>10 % ligger under 245 g, og 10 % over 255 g.</li><li>Symmetri giver middelværdi 250 g. Beregningen giver spredning cirka 3,9015207 g.</li><li>Med de uafrundede værdier genberegnes venstre hale ved 245 g og højre hale ved 255 g. Begge er cirka 0,10.</li><li>Hvis kun den ene betingelse passer, er modellen ikke tilstrækkeligt kontrolleret.</li></ol>')}${mini(8)}
 <p>Bevar flere cifre, mens du regner. Afrund først det endelige svar til det efterspurgte antal decimaler. En grov tidlig afrunding af en meget lille spredning kan påvirke en senere sandsynlighed mærkbart.</p>
`))}
${panel('taethed',section('En tæthedsbetingelse er en anden opgavetype',`
 <p>Hidtil var betingelserne arealer. Nu giver materialet en kurvehøjde ved en bestemt måleværdi. Med kendt spredning kan en klokke i samme afstand til venstre eller højre have samme højde ved denne måleværdi.</p>
 ${densityLabMarkup()}
 <dl class="normal-symbols"><dt>${math(fn('f',n(1)))}</dt><dd>Tæthedens højde ved måleværdien 1. Det er ikke sandsynligheden for den præcise værdi.</dd><dt>${math(fn('F',n(1)))}</dt><dd>Det opsamlede sandsynlighedsareal til venstre for 1. Dette er en anden betingelse.</dd></dl>
 ${example('Gennemregnet: oversæt betingelsen først',`<ol><li>${math(fn('f',n(1))+op('=')+n('0,05'))} siger, at tæthedsgrafen har højde 0,05 ved 1.</li><li>Det siger ikke, at 5 % ligger under 1.</li><li>Derfor bruges tæthedsfunktionen fra Modul 1, ikke den omvendte fordelingsfunktion.</li></ol>`)}${mini(9)}
 ${important('Lille f giver en højde. Stort F giver et venstre areal. Du skal vælge ligningen ud fra den faktisk oplyste størrelse; ellers kan værktøjet løse den forkerte opgave helt korrekt.')}
`)+section('Hvorfor kan to middelværdier passe?',`
 <p>Afstanden fra måleværdien til centrum indgår i anden potens i tæthedsfunktionen. En positiv og en negativ afstand med samme størrelse får samme kvadrat.</p>
 <p>Her skal CAS løse ${math(densityFormula(mu,n(3)).replaceAll('<mi>x</mi>',n(1))+op('=')+n('0,05'))} med middelværdien som den ukendte. Formlens pi, eksponentialtal og kvadrerede afstand er de samme som i Modul 1.</p>
 ${worked('density','Gennemregnet: spredning 3 og tæthed 0,05 ved 1')}${mini(10)}
 <p>En negativ middelværdi er ikke i sig selv ulovlig i en model uden en begrænsning til positive målinger. Spredningen skal derimod altid være positiv. I denne opgave er variablen ikke knyttet til en størrelse, som kræver positiv middelværdi.</p>
 <h3>Ikke altid to løsninger</h3><p>Hvis den oplyste højde er større end den højest mulige top ved den kendte spredning, findes ingen middelværdi, der passer. Hvis højden er netop toppen, skal måleværdien ligge i centrum, og de to muligheder falder sammen til én.</p>
 <p>Brug CAS til selve tæthedsligningen. Skriv spredningen og måleværdien ind i den fulde tæthedsfunktion fra Modul 1 og vælg middelværdien som den ukendte. En mere avanceret manuel isolering med logaritmer er ikke nødvendig for at forstå denne opgavetype.</p>
`)+section('Dokumentér værktøjsmetode og kontrol',`
 <ol><li>Beskriv den stokastiske variabel og enheden.</li><li>Skriv, hvilke parametre der er kendte, og hvad der søges.</li><li>Oversæt teksten til et korrekt areal eller en korrekt tæthedsbetingelse.</li><li>Vis standardfraktiler og ligninger, eller vis den direkte parameterligning i CAS.</li><li>Gem indtastning og output. Kontrollér alle fundne modeller i de oprindelige betingelser.</li><li>Forklar i ord, hvad middelværdi og spredning betyder i sammenhængen.</li></ol>
 ${example('Gennemregnet: en kontrol skal bruge originalbetingelsen','<ol><li>I kaffens eksempel var der 30 % over 500 g.</li><li>Efter beregningen genberegnes højre hale med den fundne middelværdi og spredning 5 g.</li><li>At få et passende billede af en klokke er ikke nok. Det krævede areal skal være cirka 0,30.</li><li>I tæthedsopgaven genberegnes derimod højden ved 1 for begge middelværdier.</li></ol>')}${mini(11)}
`))}
${panel('oevelser',section('Opgaver · vælg metode og forklar resultatet',`
 <p>Begynd med begreber og grafaflæsning. Fortsæt med én ukendt parameter, to ukendte, kontrol og den særlige tæthedsbetingelse. Hints åbnes ét ad gangen. Brug de givne modeloplysninger og hold enhederne adskilt.</p>
 ${renderExercises(normalParameterTasks)}
 <details><summary>Typiske fejl og målrettet næste skridt</summary><ul><li>Forkert fraktil: højre hale skal omsættes til venstre areal.</li><li>Negativ spredning: kontrollér fortegn og om oplysningerne overhovedet kan passe.</li><li>Kun grænsen bruges som middelværdi: find dens afstand til centrum.</li><li>Midtpunkt uden symmetri: sammenlign de to ydre haler først.</li><li>Én betingelse glemmes: kontrollér alle oprindelige sandsynligheder.</li><li>Lille f læses som stort F: vælg tæthedsligning frem for arealligning.</li><li>Kun én middelværdi findes: undersøg, om en lige stor afstand på den anden side også passer.</li><li>Modelparameter tages som direkte dataestimat: se, hvilke oplysninger beregningen faktisk bygger på.</li></ul></details><a class="text-button" href="#tasks">Åbn den fælles opgavebank</a>
`)+section('Mine værktøjsnoter og konklusioner',`
 <p>Dokumentér mindst en parameterbestemmelse og en kontrol i den oprindelige model. Ved tæthedsopgaven skal begge mulige middelværdier med.</p><label for="parameter-notes">Mine ligninger, input, output og kontroller<textarea id="parameter-notes" rows="5" maxlength="10000"></textarea></label>
 <p><strong>Egen vurdering:</strong> Er ukendte og kendte parametre tydelige? Er det rigtige område eller den rigtige højde brugt? Er enheder og alle løsninger med? Er spredningen positiv? Kan en anden genskabe din beregning? Noterne gemmes på din konto, men bedømmes ikke automatisk.</p>
`))}
${panel('sluttjek',section('Afsluttende forståelsestjek',`
 <p>Svar uden hjælpemidler. Prøv igen efter at have brugt den konkrete feedback. En ændring i et tidligere korrekt svar ophæver den aktive kontrol.</p>${renderExercises(parameterFinal)}<p data-parameter-final-status role="status"></p>
 <details><summary>Forklar selv: hvorfor er svaret ikke altid én model?</summary><p>Forklar forskellen på for få oplysninger, modstridende oplysninger og en tæthedsbetingelse med to mulige middelværdier.</p><p><strong>Egen vurdering:</strong> Brug et eksempel med halvdelen ved centrum, et eksempel med en umulig hale på den forkerte side og symmetrien omkring måleværdien i tæthedsopgaven. Appen bedømmer ikke denne forklaring automatisk.</p></details>
`))}
${panel('opsummering',section('Det tager du med',`
 <ul><li>Find først de kendte oplysninger og de ukendte parametre.</li><li>Et areal omsættes til en standardiseret placering, før den ukendte parameter isoleres.</li><li>Én kendt parameter og en passende ekstra betingelse kan bestemme den anden.</li><li>To forskellige grænser med passende venstre arealer kan bestemme begge parametre.</li><li>Symmetri kan give centrum, men midtpunktet virker ikke ved vilkårlige haler.</li><li>Positiv spredning og alle oprindelige betingelser skal kontrolleres.</li><li>En tæthedshøjde er ikke et areal og kan give to mulige middelværdier.</li></ul>
 <p data-parameter-next role="status"></p><p>Gennemført kræver alle 12 mikroøvelser, 16 opgaver og 7 forståelsesspørgsmål korrekt kontrolleret. De otte grundspørgsmål er diagnostiske. Egne forklaringer og værktøjsnoter vurderes med tjeklisterne. Sider gennemføres ikke ved at blive åbnet.</p>
 <p><a href="#normalDistribution/2/opsummering">Genlæs Modul 2</a> · <a href="#normalDistribution/repetition">Næste undervisningsgang: B-repetition 10–11 · planlagt</a></p>
 <p class="int-source">Kilder: Læseplan.pdf, 5. november 2026; Undervisningsbeskrivelse.pdf, side 5; ark 3 »Beregning af middelværdi og spredning«, alle fire eksempler og u1–u4 samt opgave 1–8. Centrale opgavetyper er fordelt på forklaring, mikroøvelse og bank; ensartede grænseberegninger fra Modul 1–2 genbruges som forudsætninger. Grafaflæsningen er genoptegnet fra arkets første eksempel. Gulerodsopgaven bruger Ark1 A2 og de oplyste modelplaceringer fra Modul 2. Ekstra eksempler, forklaringer og visualiseringer er pædagogiske tilpasninger. Originalfilerne er uændrede.</p>
`))}`;}
