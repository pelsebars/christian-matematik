import { math,n,mi,op,mu,sigma,X,x,frac,distribution,P,betweenEvent,leftEvent,fn } from './normal-math.js';
import { Z,z,standardFormula,reverseFormula,standardDistribution,Phi } from './normal-standard-math.js';
import { standardLabMarkup } from './normal-standard-graphs.js';
import { normalSection as section,normalExample as example,normalImportant as important } from './normal-lesson-support.js';
import { standardPre,standardMini,standardFinal } from './normal-standard-exercises.js';
import { normalStandardTasks } from './tasks/bank/normal-standard.js';
import { renderExercises } from './integral-exercises.js';
const panel=(step,body)=>`<div data-normal-step="${step}" hidden>${body}</div>`;
const mini=i=>renderExercises([standardMini[i]]);
const worked=(id,title)=>{const task=normalStandardTasks.find(t=>t.id==='norm2.'+id);return example(title,task.prompt+(task.figure||'')+task.solution);};
export function standardContent(){return `<p data-lesson-warning role="status" hidden></p>
${panel('start',section('Det skal du kunne',`
 <p>I Modul 1 var spørgsmålet: hvor stort er arealet under kurven? Nu lærer du at beskrive en målings placering med en fælles målestok: antal spredninger fra centrum.</p>
 <ul><li>Forklare standardisering som flytning af centrum og skift af måleenhed.</li><li>Beregne og fortolke en standardiseret værdi med korrekt fortegn.</li><li>Regne tilbage til den oprindelige måleskala og sammenligne relative placeringer.</li><li>Bestemme normale og exceptionelle udfald efter materialets grænser.</li><li>Bevare sandsynlighedsarealer ved standardisering og bruge standardnormalfordelingen til haler, mellemområder og fraktiler.</li><li>Dokumentere værktøjsbrug og skelne modelantagelse fra en måling.</li></ul>
 <p>Mål: især A4–A5, U1–U5 og U7 samt K4–K6 i læringsmålskortet. Opgaverne genbruger begreberne fra Modul 1; parameterbestemmelse udvikles i Modul 3.</p>
`)+section('Forudsætningstjek · find det regnetrin, der driller',`
 <p>De otte spørgsmål skiller fortegn, division, decimaler, ligninger og statistiske begreber ad. Brug grundhjælpen ved det konkrete spørgsmål. Fejl låser ingen sider.</p><p data-standard-pre-status role="status"></p>${renderExercises(standardPre)}
 <div id="standard-basics" tabindex="-1"><h3>Tilbage til grundbegreberne</h3>
 <details data-standard-basic="sign"><summary>Forskelle og fortegn</summary><p>${math(n(98)+op('−')+n(100)+op('=')+n(-2))}. En negativ forskel betyder, at den første værdi ligger under den anden. Det gør ikke selve målingen negativ.</p><a href="#equations">Øv regnetrin og fortegn</a></details>
 <details data-standard-basic="fraction"><summary>Brøker, division og enheder</summary><p>${math(frac(n(-6),n(3))+op('=')+n(-2))}. Et negativt tal divideret med et positivt tal er negativt. Når en afstand i gram divideres med en spredning i gram, bortfalder enheden: du tæller spredninger.</p><a href="#normalDistribution/1/start">Se Modul 1's grundhjælp om brøker og procent</a></details>
 <details data-standard-basic="decimal"><summary>Decimaler</summary><p>Skriv samme antal decimaler, når det hjælper: ${math(n('1,95')+op('−')+n('2,00')+op('=')+op('−')+n('0,05'))}. Først findes forskellen; derefter divideres den. Brug ikke procent, medmindre feltet beder om procent.</p></details>
 <details data-standard-basic="parameter"><summary>Middelværdi og spredning</summary><p>Middelværdien placerer centrum; spredningen måler variation i samme enhed som målingerne. I ${math(distribution(n(100),n(2)))} er spredningen 2. Anden parameter er spredningen, ikke variansen.</p><a href="#normalDistribution/1/model">Genlæs måling, model og parametre</a></details>
 <details data-standard-basic="area"><summary>Sandsynlighed og areal</summary><p>Et venstre areal på 0,8 efterlader 0,2 til højre. Arealer under tæthedskurven er sandsynligheder; kurvehøjden ved en enkelt værdi er tæthed.</p><a href="#normalDistribution/1/fordeling">Genlæs fordelingsfunktionen og halerne</a></details>
 <details data-standard-basic="equation"><summary>Ligninger og regning tilbage</summary><p>I ${math(n(100)+op('+')+n(2)+mi('u')+op('=')+n(106))} trækkes 100 først fra begge sider, og derefter divideres med to. Omvendt kan en kendt værdi ganges med to og få 100 lagt til.</p><a href="#equations">Øv ligninger</a></details>
 <details data-standard-basic="tool"><summary>Lommeregner og statistikværktøj</summary><p>Brug parentes omkring hele forskellen i tælleren. Ved standardnormalberegning er middelværdien nul og spredningen én. Vælg venstre hale, højre hale eller mellemområde før indtastningen.</p><a href="#normalDistribution/1/vaerktoej">Genlæs værktøjsdokumentation</a></details>
 </div>
`))}
${panel('standard',section('En fælles målestok for afstande',`
 <p>En afstand på seks gram kan være stor i en præcis maskine og lille i en maskine med stor variation. Derfor spørger vi: hvor mange af modellens spredninger passer ind i afstanden til centrum?</p>
 <div class="int-table" tabindex="0" role="region" aria-label="Afstand og spredning i to modeller"><table><thead><tr><th>Måling</th><th>Centrum</th><th>Spredning</th><th>Afstand</th><th>Antal spredninger</th></tr></thead><tbody><tr><td>106 g</td><td>100 g</td><td>3 g</td><td>6 g</td><td>2</td></tr><tr><td>106 g</td><td>100 g</td><td>6 g</td><td>6 g</td><td>1</td></tr></tbody></table></div>
 <p>Samme afstand i gram har altså forskellig betydning i de to modeller.</p>
 ${example('Gennemregnet uden formel: hvor mange skridt?', '<ol><li>Vi måler 106 g og sammenligner med et centrum på 100 g. Afstanden er seks gram.</li><li>Hvis én spredning er tre gram, passer der to spredninger i afstanden.</li><li>Vi siger: observationen ligger to spredninger over centrum. Vi har skiftet måleenhed, ikke observation.</li></ol>')}${mini(0)}
`)+section('Flyt centrum til nul og mål i spredninger',`
 <p>Standardisering udfører to handlinger: først trækkes centrum fra, så centrum bliver nul. Derefter divideres med spredningen, så én spredning bliver én ny enhed.</p>
 ${standardLabMarkup('standard-scale')}
 <dl class="normal-symbols"><dt>${math(x)}</dt><dd>Den konkrete observation på den oprindelige skala.</dd><dt>${math(mu)}</dt><dd>Modellens middelværdi: det centrum, observationen sammenlignes med.</dd><dt>${math(sigma)}</dt><dd>Modellens positive spredning. Den er den nye målestok.</dd><dt>${math(z)}</dt><dd>Den standardiserede værdi: antal spredninger fra centrum, med fortegn. Den har ingen fysisk enhed.</dd></dl>
 <p>${math(z+op('=')+standardFormula)}</p>
 ${important('Træk først centrum fra. Divider derefter hele forskellen med spredningen. Resultatet siger, hvor langt fra centrum observationen ligger målt i spredninger. Det er ikke en sandsynlighed.')}
 ${example('Gennemregnet: en måling over centrum',`<ol><li>Observationen er 112, middelværdien 100 og spredningen 4.</li><li>Afstanden er ${math(n(112)+op('−')+n(100)+op('=')+n(12))}.</li><li>Antal spredninger er ${math(z+op('=')+frac(n(12),n(4))+op('=')+n(3))}.</li><li>Observationen ligger tre spredninger over centrum. Kontrol: tre gange fire er tolv.</li></ol>`)}${mini(1)}
`)+section('Et minus viser en side af centrum',`
 <p>En positiv standardiseret værdi betyder over centrum. En negativ værdi betyder under centrum. Nul betyder lige ved middelværdien.</p>
 ${example('Gennemregnet: en positiv vægt med negativ placering',`<ol><li>En pose vejer 98 g. Centrum er 100 g og spredningen 2 g.</li><li>Afstanden fra centrum er minus 2 g.</li><li>${math(z+op('=')+frac(n(-2),n(2))+op('=')+n(-1))}. Posen ligger én spredning under centrum.</li><li>Vægten er stadig 98 g. Den negative standardiserede værdi er ikke en negativ vægt eller en negativ sandsynlighed.</li></ol>`)}${mini(2)}
 <h3>Den nye stokastiske variabel</h3><p>Før målingen kan den oprindelige variabel antage forskellige værdier. Hvis samme flytning og skalering anvendes på hele den normalfordelte variabel, får vi en ny stokastisk variabel.</p>
 <dl class="normal-symbols"><dt>${math(X)}</dt><dd>Den oprindelige normalfordelte variabel, før observationen er kendt.</dd><dt>${math(Z)}</dt><dd>Den standardiserede stokastiske variabel. Det store bogstav beskriver mulige standardiserede værdier; lille z er én konkret værdi.</dd></dl>
 <p>${math(Z+op('=')+frac(X+op('−')+mu,sigma))} og ${math(standardDistribution)}.</p><p>Standardnormalfordelingen har centrum nul og spredning én. Hvis observationen rammer middelværdien, bliver den standardiserede værdi nul. Den oprindelige og standardiserede model er begge normalfordelinger, blot på forskellige skalaer.</p>
`))}
${panel('tilbage',section('Tilbage til den oprindelige måleskala',`
 <p>Du kan gå tilbage: et antal spredninger ganges først med spredningens størrelse. Det giver afstanden i oprindelige enheder. Derefter lægges centrum til.</p>
 <div class="normal-important"><p>Antal spredninger → afstand i oprindelige enheder → oprindelig observation.</p></div>
 <p>Symbolerne er de samme som før: den konkrete observation, middelværdien, spredningen og den standardiserede værdi.</p><p>${math(x+op('=')+reverseFormula)}</p>
 ${example('Gennemregnet: halvanden spredning under centrum',`<ol><li>Middelværdien er 100 g, spredningen 2 g og placeringen minus halvanden spredning.</li><li>Afstanden er minus 3 g, fordi halvanden gange to er tre.</li><li>${math(x+op('=')+n(100)+op('−')+n(3)+op('=')+n(97))} g.</li><li>Kontrol: 97 minus 100 giver minus 3; divideret med to giver det minus halvanden.</li></ol>`)}${mini(3)}
 ${important('Der er to retninger. Fra en observation til antal spredninger: træk fra og divider. Tilbage til observationen: gang og læg til. Kontrollér svaret ved at gå den modsatte vej.')}
`)+section('Sammenlign relative placeringer',`
 <p>To rå tal kan ikke sammenlignes meningsfuldt, når de måles på forskellige skalaer. Efter standardisering kan du sammenligne, hvor højt de ligger i forhold til hver deres centrum.</p>
 ${example('Gennemregnet: to forskellige modeller', '<ol><li>En højde på 174 cm sammenlignes med centrum 170 cm og spredning 4 cm. Den ligger én spredning over centrum.</li><li>Et resultat på 86 point sammenlignes med centrum 80 point og spredning 3 point. Det ligger to spredninger over centrum.</li><li>Testresultatet har den højeste relative placering i sin egen model. Det er ikke de rå tal 174 og 86, vi sammenligner.</li></ol>')}${mini(4)}
 <h3>En ændret skala er ikke en ny form</h3><p>Standardisering flytter og strækker eller sammenpresser tallinjen. Den fjerner ikke skævhed eller to tydelige grupper i data.</p>
 ${example('Gennemregnet: to grupper bliver ved med at være to grupper', '<ol><li>Forestil dig målinger samlet i to adskilte grupper med et tomt område mellem dem.</li><li>Når samme tal trækkes fra alle målinger, flyttes begge grupper.</li><li>Når alle forskelle divideres med samme positive tal, ændres afstandene. Men der er stadig to grupper.</li><li>Kun når den oprindelige variabel antages normalfordelt, bliver den standardiserede variabel standardnormalfordelt.</li></ol>')}${mini(5)}
`))}
${panel('udfald',section('Normale og exceptionelle udfald er forskellige grænser',`
 <p>I materialet betyder et normalt udfald: højst to spredninger fra centrum, inklusive begge ender. Et exceptionelt udfald ligger mere end tre spredninger fra centrum. Det gælder på begge sider.</p>
 <p>Der findes derfor et område imellem: mere end to og højst tre spredninger fra centrum er uden for normalintervallet, men er ikke exceptionelt efter materialets konvention.</p>
 ${standardLabMarkup('standard-bands')}
 <dl class="normal-symbols"><dt>${math(op('[')+mu+op('−')+n(2)+sigma+op(';')+mu+op('+')+n(2)+sigma+op(']'))}</dt><dd>Normalintervallet. Kantede parenteser indad betyder, at de to ender er med.</dd><dt>${math(x+op('&lt;')+mu+op('−')+n(3)+sigma)}</dt><dd>Exceptionelt på den lave side: strengt under middelværdien minus tre spredninger.</dd><dt>${math(x+op('&gt;')+mu+op('+')+n(3)+sigma)}</dt><dd>Exceptionelt på den høje side: strengt over middelværdien plus tre spredninger.</dd></dl>
 <p>Tegnet ${math(op('∞'))} betyder uendelig. ${math(op('∪'))} betyder, at to områder samles. Åbne intervalender udelader grænsen. Uendelig er ikke et bestemt tal og kan ikke være med som en endeværdi.</p>
 ${worked('ranges','Gennemregnet: centrum 10 og spredning 3')}${mini(6)}
 ${important('Uden for normalintervallet betyder ikke automatisk exceptionelt. Præcis to spredninger er normalt. Præcis tre spredninger er ikke exceptionelt. Det kræver mere end tre.')}
 ${example('Gennemregnet: præcis på en grænse','<ol><li>Centrum er 2 kg, og spredningen er 0,025 kg.</li><li>1,95 kg ligger to spredninger under centrum og er med i normalintervallet.</li><li>1,925 kg ligger præcis tre spredninger under centrum. Den er uden for normalintervallet, men ikke exceptionel.</li><li>1,924 kg ligger længere end tre spredninger fra centrum og er exceptionel.</li></ol>')}${mini(7)}
`)+section('Hvor meget ligger inden for én, to og tre spredninger?',`
 <p>Alle normalfordelinger har samme relative arealer, når afstande måles i spredninger. Brug laboratoriets tre knapper til at se områderne på begge skalaer.</p>
 <div class="int-table" tabindex="0" role="region" aria-label="Arealer inden for spredninger"><table><thead><tr><th>Afstand fra centrum</th><th>Centralt areal i normalmodellen</th><th>Resterende areal i begge haler</th></tr></thead><tbody><tr><td>Højst én spredning</td><td>Cirka 68,27 %</td><td>Cirka 31,73 %</td></tr><tr><td>Højst to spredninger</td><td>Cirka 95,45 %</td><td>Cirka 4,55 %</td></tr><tr><td>Højst tre spredninger</td><td>Cirka 99,73 %</td><td>Cirka 0,27 %</td></tr></tbody></table></div>
 ${example('Gennemregnet: fra centrum til én spredning', '<ol><li>Området inden for én spredning på begge sider er cirka 68,27 %.</li><li>Symmetri deler det i to lige store halvdele.</li><li>Fra centrum til én spredning over centrum er der cirka 34,135 %, når vi bruger den afrundede tabelværdi.</li><li>En beregning uden tabellens tidlige afrunding giver cirka 34,1345 %. Små forskelle i sidste decimal kan komme fra afrunding.</li></ol>')}${mini(8)}
 <p>Procenterne beskriver modelarealer, ikke garanterede optællinger i et bestemt datasæt. En exceptionel observation er sjælden under modellen, men ikke umulig og ikke alene et bevis for en fejl.</p>
`))}
${panel('sandsynlighed',section('Samme sandsynlighed på to skalaer',`
 <p>En observation over en grænse er stadig over den tilsvarende grænse efter standardisering. Vi ændrer etiketterne på tallinjen, ikke hvilken del af modellen spørgsmålet handler om. En positiv spredning sikrer, at rækkefølgen af værdierne bevares.</p>
 <p>I laboratoriet kan den samme blå flade derfor beskrives i oprindelige enheder og i antal spredninger. De lodrette tæthedstal ændres, så det samlede areal stadig er én.</p>
 <dl class="normal-symbols"><dt>${math(Phi(z))}</dt><dd>Stort græsk phi, læst »fi«, er fordelingsfunktionen for standardnormalfordelingen. Den giver sandsynligheden til venstre for den standardiserede grænse.</dd><dt>${math(fn('F',x))}</dt><dd>Stort F fra Modul 1 er fordelingsfunktionen på den oprindelige skala. De to funktioner kan give samme sandsynlighed ved de tilsvarende grænser.</dd></dl>
 <p>${math(Phi(z)+op('=')+P(Z+op('≤')+z))}.</p>
 ${worked('fish-probability','Gennemregnet: fiskefoder under 0,9 kg')}
 <p>For en højre hale bruges én minus det opsamlede venstre areal. For et mellemområde trækkes det nedre opsamlede areal fra det øvre. Det er de samme arealregler som i Modul 1.</p>
 ${example('Gennemregnet: en højre hale i standardmodellen',`<ol><li>Du får det afrundede venstre areal ${math(Phi(n(1))+op('≈')+n('0,8413'))}.</li><li>Det samlede areal er én.</li><li>Højre hale er derfor cirka ${math(n(1)+op('−')+n('0,8413')+op('=')+n('0,1587'))}.</li></ol>`)}${mini(9)}
 ${important('En standardiseret værdi er en placering. Phi omsætter en placering til et opsamlet areal. En placering på to er ikke en sandsynlighed på to.')}
 <h3>To grænser skal begge ændres</h3>
 ${example('Gennemregnet: området fra 48 til 55',`<ol><li>Modellen har middelværdi 50 og spredning 6.</li><li>Nedre grænse bliver ${math(frac(n(48)+op('−')+n(50),n(6))+op('=')+frac(n(-1),n(3)))}.</li><li>Øvre grænse bliver ${math(frac(n(55)+op('−')+n(50),n(6))+op('=')+frac(n(5),n(6)))}.</li><li>Træk det opsamlede standardareal ved den nedre grænse fra det ved den øvre. Resultatet er cirka 0,4282.</li><li>De samme 42,82 % ligger mellem 48 og 55 på den oprindelige skala. Bevar brøkerne indtil den sidste beregning.</li></ol>`)}
`)+section('Fra kendt areal til en ukendt grænse',`
 <p>Ved et omvendt spørgsmål kender du sandsynlighedsarealet og søger en grænse. Find først grænsen i standardmodellen og regn derefter tilbage til den oprindelige skala.</p>
 ${worked('quantile','Gennemregnet: 30 %-grænsen i en model med centrum 10 og spredning 2')}${mini(10)}
 <h3>Dokumentér dit statistikværktøj</h3><ol><li>Skriv den oprindelige model med enhed, middelværdi og spredning.</li><li>Skriv grænserne og vis deres omregning til antal spredninger.</li><li>Vælg venstre hale, højre hale, mellemområde eller omvendt normalberegning.</li><li>Ved standardnormalberegning bruger værktøjet middelværdi nul og spredning én.</li><li>Gem indtastning og output. Kontrollér svaret i den oprindelige model, og skriv, hvad det betyder.</li></ol>
 <p>Programmer kan have forskellige kommandonavne og parameterkonventioner. Kontrollér, at du bruger spredning korrekt; opfind ikke et kommandonavn ud fra bogstaverne i formlen. Arkets opgaver kræver også graftegning: tegn derfor både tætheds- eller fordelingsgraf i dit sædvanlige værktøj, og markér de relevante grænser.</p>
`))}
${panel('oevelser',section('Opgaver · fra færdighed til fortolkning',`
 <p>Begynd med de korte spørgsmål om ny målestok og fortegn. Fortsæt med tilbageberegning, sammenligning, intervaller, figurer og sandsynligheder. De sidste opgaver kræver en samlet fortolkning af en model eller faktiske data.</p>
 ${renderExercises(normalStandardTasks)}
 <details><summary>Typiske misforståelser og næste regnetrin</summary><ul><li>Kun målingen divideres: træk middelværdien fra først.</li><li>Fortegnet forsvinder: en observation under centrum skal give en negativ placering.</li><li>Afstand og observation blandes: læg middelværdien til, når du regner tilbage.</li><li>Spredning og varians blandes: anden parameter er spredningen i materialet.</li><li>Uden for normalintervallet kaldes straks exceptionelt: kontrollér grænsen på mere end tre spredninger.</li><li>Kun én intervalgrænse standardiseres: begge grænser skal ændres på samme måde.</li><li>En tæthed bruges som sandsynlighed: kontrollér areal og områdevalg.</li><li>Standardisering tages som bevis for normalfordeling: normalantagelsen skal undersøges særskilt.</li></ul></details>
 <a class="text-button" href="#tasks">Åbn den fælles opgavebank</a>
`)+section('Mine værktøjsnoter og forklaringer',`
 <p>Notér et eksempel med grænser i begge skalaer. Dokumentér også en tætheds- eller fordelingsgraf fra dit værktøj og en kontrol i den oprindelige model.</p><label for="standard-notes">Mine beregninger, grafnoter og konklusion<textarea id="standard-notes" rows="5" maxlength="10000"></textarea></label>
 <p><strong>Egen vurdering:</strong> Er begge parametre og enheder med? Er grænserne standardiseret uden fortegnsfejl? Kan en anden genskabe dit værktøjsresultat? Gælder konklusionen et modelareal, et interval eller en konkret måling? Noterne gemmes på din konto, men bedømmes ikke automatisk.</p>
`))}
${panel('sluttjek',section('Afsluttende forståelsestjek',`
 <p>Svar uden hjælpemidler. Brug den målrettede feedback, hvis et regnetrin eller begreb driller, og prøv derefter igen. Ændring af et tidligere korrekt svar ophæver den aktive kontrol.</p>
 ${renderExercises(standardFinal)}<p data-standard-final-status role="status"></p>
 <details><summary>Forklar selv: hvad ændres, og hvad bevares?</summary><p>Forklar med egne ord, hvorfor centrum bliver nul og spredningen én. Forklar derefter, hvorfor et markeret område får samme sandsynlighed på begge skalaer, selv om tæthedskurvernes højder er forskellige.</p><p><strong>Egen vurdering:</strong> Nævn flytning, ny måleenhed og areal. Tilføj, hvorfor standardisering ikke i sig selv gør et vilkårligt datasæt normalfordelt. Din egen forklaring bedømmes ikke automatisk.</p></details>
`))}
${panel('opsummering',section('Det tager du med',`
 <ul><li>Standardisering måler en observations afstand fra centrum i antal spredninger.</li><li>Fortegnet viser siden af centrum. En standardiseret værdi er ikke en sandsynlighed.</li><li>Standardnormalfordelingen har middelværdi nul og spredning én, når den oprindelige variabel er normalfordelt.</li><li>Tilbage til oprindelig skala: gang med spredningen og læg middelværdien til.</li><li>Normale udfald er højst to spredninger fra centrum. Exceptionelle udfald er mere end tre spredninger væk.</li><li>Samme hændelse har samme sandsynlighedsareal på begge skalaer.</li><li>Standardisering er en skalaændring, ikke et bevis for normalfordeling.</li></ul>
 <p data-standard-next role="status"></p><p>Gennemført kræver alle 11 mikroøvelser, alle 15 opgaver og alle 6 forståelsesspørgsmål korrekt kontrolleret. De otte startspørgsmål er diagnostiske. Egne forklaringer, grafnoter og værktøjsdokumentation vurderer du med tjeklisterne; besøg på sider gennemfører ikke modulet.</p>
 <p><a href="#normalDistribution/1/opsummering">Genlæs Modul 1</a> · <a href="#normalDistribution/3">Se næste modul: middelværdi og spredning</a></p>
 <p class="int-source">Kilder: Læseplan.pdf, 4. november 2026; Undervisningsbeskrivelse.pdf, side 5; ark 2 »Standardnormalfordelingen«, begge eksempler uden hjælpemidler, u1–u6 og opgave 1–4 med hjælpemidler. De to centrale figurer er genoptegnet fra u1 og u4. Gulerodsopgaven bruger Ark1, A2, med de foreløbige estimater fra Modul 1. Forklaringerne om standardisering, visualiseringen, mikroøvelserne og de ekstra sammenligningsopgaver er pædagogiske tilpasninger. Originalfilerne er uændrede.</p>
`))}`;}
