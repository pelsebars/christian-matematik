import {math,n,mi,op,frac,power} from './normal-math.js';
import {normalSection as section,normalExample as example,normalImportant as important} from './normal-lesson-support.js';
import {regressionPre,regressionMini,regressionFinal} from './normal-regression-exercises.js';
import {normalRegressionTasks} from './tasks/bank/normal-regression.js';
import {renderExercises} from './integral-exercises.js';
import {regressionLabMarkup,regressionCheckMarkup,regressionIntervalMarkup,regressionCoverageMarkup} from './normal-regression-graphs.js';
import {regressionSvg,slopeIntervalSvg,regressionTypography} from './normal-regression-figures.js';
import {linearRegression,transformedRegression,reciprocalPairs,squaredPairs} from './normal-regression-math.js';
const panel=(step,body)=>`<div data-normal-step="${step}" hidden>${body}</div>`;
const a=mi('a'),b=mi('b'),x=mi('x'),y=mi('y'),i=mi('i'),count=mi('n'),e=mi('e'),s=mi('s'),A=mi('A'),margin=op('Δ')+a;
const sub=(symbol,index)=>`<msub>${symbol}<mrow>${index}</mrow></msub>`,hatY='<mover><mi>y</mi><mo>^</mo></mover>',xi=sub(x,i),yi=sub(y,i),ei=sub(e,i),hatYi=sub(hatY,i),se=sub(s,a),sxx=sub(mi('S'),x+x);
const mini=index=>renderExercises([regressionMini[index]]);
const worked=(id,title)=>{const task=normalRegressionTasks.find(t=>t.id==='norm5.'+id);return example(title,task.prompt+(task.figure||'')+task.solution);};
const toy=linearRegression([[1,3],[2,4],[3,8],[4,9]]);
export function regressionContent(){return regressionTypography(`<p data-lesson-warning role="status" hidden></p>
${panel('start',section('Det skal du kunne',`
 <p>En ret linje kan beskrive en tendens, selv om målingerne ikke ligger præcis på linjen. Nu undersøger vi både afvigelserne og usikkerheden på den beregnede hældning.</p>
 <ul><li>Fortolke hældning og enheder i en lineær model.</li><li>Beregne residualer og skelne residualspredning fra usikkerhed på hældningen.</li><li>Undersøge residualplot, normalplot og modelantagelser.</li><li>Skelne et beregnet estimat fra den faste, ukendte modelparameter.</li><li>Beregne og fortolke et 95 %-konfidensinterval for hældningen.</li><li>Vurdere nul i intervallet og undgå at slutte for sikkert.</li><li>Bruge materialets omformede modeller og dokumentere en digital undersøgelse.</li></ul>
 <p>Mål: A9–A11, U1–U5, U7 og K4–K6. Datakilder: 56 kornår, 100 kronblade, 18 Phillipsår og 106 Unibrew-serier samt arkets to korte tabeller med omformet respons.</p>
`)+section('Forudsætningstjek',`
 <p>De otte spørgsmål undersøger grundregning og statistiske begreber hver for sig. Fejl giver konkret hjælp. Alle trin er åbne.</p><p data-regression-pre-status role="status"></p>${renderExercises(regressionPre)}
 <div id="regression-basics" tabindex="-1"><h3>Grundhjælp</h3>
 <details data-regression-basic="function"><summary>Lineær funktion og indsættelse</summary><p>Gang input med hældningen, og læg skæringen til. Hældningen beskriver ændring pr. vandret enhed; skæringen er modelværdi ved nul.</p></details>
 <details data-regression-basic="sign"><summary>Fortegn og forskel</summary><p>Observeret minus model er positivt over linjen og negativt under linjen. 51 minus 43 er otte.</p><a href="#normalDistribution/repetition/fortegn">Genlæs fortegn</a></details>
 <details data-regression-basic="reverse"><summary>Tilbage til observationen</summary><p>Modelværdi plus residual giver observeret værdi. En observation fem under 20 er 15.</p></details>
 <details data-regression-basic="root"><summary>Kvadrat og kvadratrod</summary><p>Kvadrering gør begge fortegn positive eller nul. Spredning er kvadratroden af varians, i den oprindelige enhed.</p><a href="#normalDistribution/repetition/kvadrater">Genlæs kvadrater</a></details>
 <details data-regression-basic="interval"><summary>Minus og plus en margin</summary><p>Nedre grænse fås ved subtraktion, øvre ved addition. Margin er afstanden fra centrum til én grænse, ikke hele bredden.</p></details>
 <details data-regression-basic="zero"><summary>Ligger nul indenfor?</summary><p>Sæt grænserne på en tallinje. Nul er med, når den nedre grænse er mindre end eller lig nul og den øvre større end eller lig nul. Grænserne tæller med.</p></details>
 <details data-regression-basic="sample"><summary>Stikprøve og estimat</summary><p>Målingerne er stikprøven. Hældningen beregnet fra dem er et skøn over en underliggende parameter. En ny stikprøve kan give et andet skøn.</p></details>
 <details data-regression-basic="plot"><summary>Plot og modelvurdering</summary><p>Et normalplot, der omtrent følger en ret linje, støtter en tilnærmelse. Det er ikke et bevis. Et residualplot og et normalplot undersøger forskellige mønstre.</p><a href="#normalDistribution/4/vurdering">Genlæs normalplot</a></details>
 </div>
`))}
${panel('regression',section('En ret linje beskriver en tendens',`
 <p>Store produktionsserier tager typisk længere tid end små. Det betyder ikke, at alle serier ligger præcis på den samme linje. Hældningen fortæller, hvor meget <em>modeltiden</em> ændres pr. ekstra mængdeenhed.</p><p>Vælg et datasæt i figuren. Se både målingerne, linjen og de lodrette afvigelser. Skift derefter til residualplot eller normalplot. En række kan markeres med piletaster på skyderen.</p>${regressionLabMarkup()}
 <dl class="normal-symbols"><dt>${math(x)}</dt><dd>Den vandrette forklarende værdi; eksempelvis produktionsmængde i hl.</dd><dt>${math(y)}</dt><dd>Den observerede respons; eksempelvis produktionstid i timer.</dd><dt>${math(a)}</dt><dd>Den hældning, regressionen beregner fra data. Enhed: responsens enhed pr. vandret enhed.</dd><dt>${math(b)}</dt><dd>Den beregnede skæring, dvs. modelværdi ved vandret værdi nul.</dd><dt>${math(hatY)}</dt><dd>Modelværdien, læst »y-hat«. Hatten skelner modelværdi fra målt respons.</dd></dl>
 <p>Den tilpassede linje er ${math(hatY+op('=')+a+x+op('+')+b)}. Arket skriver også ${math(mi('f')+op('(')+x+op(')')+op('=')+a+x+op('+')+b)}. Regressionen vælger de to koefficienter, så summen af de kvadrerede lodrette afvigelser bliver mindst.</p>
 ${worked('slope','Gennemregnet: ændring er hældning gange ændring')}${mini(0)}
 ${important('Hældning beskriver en ændring i modellens respons pr. vandret enhed. En positiv hældning i stikprøven er ikke alene nok til at fastslå den underliggende tendens eller en årsagssammenhæng.')}
`))}
${panel('residualer',section('Hvor langt ligger målingen fra modellen?',`
 <p>For hver vandret værdi sammenlignes den målte respons med linjens modelværdi. Forskellen kaldes et residual. Et positivt residual betyder over linjen, et negativt under linjen.</p><figure class="normal-concepts">${regressionSvg(toy,{xLabel:'Vandret øveværdi',yLabel:'Observeret øverespons'})}<figcaption>Eget øvesæt med fire talpar. De lodrette linjestykker er afvigelser fra den tilpassede model.</figcaption></figure>
 <dl class="normal-symbols"><dt>${math(i)}</dt><dd>Rækkenummer i datasættet.</dd><dt>${math(xi)}</dt><dd>Den vandrette værdi i række i.</dd><dt>${math(yi)}</dt><dd>Den observerede respons i samme række.</dd><dt>${math(hatYi)}</dt><dd>Modellens respons ved netop denne vandrette værdi.</dd><dt>${math(ei)}</dt><dd>Residualet, beregnet som ${math(yi+op('−')+hatYi)}.</dd></dl>
 ${worked('residual','Gennemregnet: statsgæld og procentpoint')}${mini(1)}
 ${worked('salmon','Gennemregnet: gå fra model og residual til observation')}${mini(2)}
`)+section('Residualplot og residualspredning',`
 <p>Et residualplot bruger samme vandrette værdier, men viser residualet lodret. Linjen nul betyder, at model og måling er ens. Vi ser efter ujævne afvigelser omkring nul og nogenlunde samme lodrette spredning.</p><figure class="normal-concepts">${regressionSvg(toy,{mode:'residual',xLabel:'Vandret øveværdi'})}<figcaption>Samme fire talpar vist som residualer. Punkter over nul svarer til målinger over linjen.</figcaption></figure>
 <p>Residualspredning er en samlet størrelse for afvigelsernes variation. Den måles i responsens enhed. Den er ikke det samme som responsværdiernes spredning omkring deres gennemsnit.</p>
 <p>Her betyder ${math(count)} antal talpar, ${math(s)} residualspredning og ${math(op('∑'))} summen over alle rækker. For en linje med estimeret hældning og skæring bruger vi ${math(s+op('=')+'<msqrt>'+frac(op('∑')+power(ei,2),count+op('−')+n(2))+'</msqrt>')}. Nævneren er antal minus to, fordi to linjekoefficienter er estimeret.</p>
 ${worked('residual-spread','Gennemregnet: kvadratsum, nævner og rod')}${mini(3)}
 ${important('Residualspredning beskriver variationen omkring linjen i responsens enhed. Hældningens standardfejl beskriver usikkerhed på en hældning og har hældningens enhed. De to tal må ikke byttes om.')}
`))}
${panel('modelkontrol',section('Undersøg modellen før intervallet bruges',`
 <p>Et værktøj kan beregne et interval, selv om modellen er dårlig. Derfor skal data, plot og indsamling vurderes. Her undersøges residualerne fra den tilpassede linje, ikke blot de rå responsværdier.</p>${regressionCheckMarkup()}
 <ul><li><strong>Lineær middelmodel:</strong> residualerne bør ikke have et gennemgående buet mønster.</li><li><strong>Nogenlunde ens fejlspredning:</strong> tydelig tragtform rejser tvivl om den sædvanlige beregning.</li><li><strong>Uafhængige fejl:</strong> viden om udvælgelse, tid og forsøgsdesign er nødvendig. Plot beviser ikke uafhængighed.</li><li><strong>Normaltilnærmelse for fejlene:</strong> residualernes normalplot bør være omtrent retlinjet. Det er støtte, ikke et bevis.</li><li><strong>Enkeltpunkter og datakvalitet:</strong> undersøg usædvanlige målinger uden automatisk sletning.</li></ul>
 <p>Fejl er de ukendte afvigelser fra den underliggende middelmodel. Residualer er de beregnede afvigelser fra den estimerede linje. Residualerne bruges til at undersøge fejlmodellen; de er ikke selv uafhængige observerede fejl.</p>
 ${worked('checks','Gennemregnet: pænt normalplot kan ikke ophæve en bue')}${mini(4)}
 ${example('Gennemregnet: Korn som i materialet','<ol><li>Lav regression med år efter 1961 og produktion.</li><li>Se residualerne omkring nul, og sammenhold residualspredning cirka 5,4920 mio. ton med produktionens størrelsesorden og formålet.</li><li>Det omtrent retlinjede normalplot støtter materialets normaltilnærmelse for afvigelserne.</li><li>År følger hinanden i tid. Uafhængighed kræver særskilt omtanke; figurerne alene afgør den ikke.</li></ol>')}
 ${important('Normalantagelsen angår variationen omkring den lineære middelmodel ved givne vandrette værdier. Hverken et højt forklaringstal eller et pænt normalplot godkender alle modellens antagelser.')}
`))}
${panel('usikkerhed',section('Et nyt udvalg kan give en ny linje',`
 <p>Forestil dig at gentage den samme undersøgelse med nye målinger. Punkterne flytter sig lidt, og den beregnede hældning ændrer sig. Den underliggende hældning i den tænkte model kan stadig være den samme.</p>${regressionCoverageMarkup()}
 <dl class="normal-symbols"><dt>${math(a)}</dt><dd>Den beregnede hældning i én stikprøve, som i materialet.</dd><dt>${math(A)}</dt><dd>Her bruger vi stort A om den faste, ukendte underliggende hældning for at holde den adskilt fra det beregnede a. Dette er appens begrebshjælp, ikke en ny notation pålagt kilden.</dd></dl>
 ${worked('estimate','Gennemregnet: to stikprøver, samme tænkte parameter')}${mini(5)}
 <p>Flere målinger ved samme vandrette spænd og mindre fejlvariation vil typisk gøre et hældningsinterval smallere. Også spredningen i de vandrette værdier betyder noget. En større stikprøve er ikke automatisk mere repræsentativ.</p>
 ${important('Usikkerhed handler om, at en beregning fra et udvalg kan ændre sig, hvis vi måler igen. Flere decimaler i værktøjet fjerner ikke denne stikprøveusikkerhed.')}
`))}
${panel('interval',section('Beregn et konfidensinterval for hældningen',`
 <p>En hældning fortæller, hvor linjen ligger i denne stikprøve. Et konfidensinterval beskriver usikkerheden omkring skønnet med en metode, hvis dækningsniveau er valgt på forhånd. Her bruger vi et tosidet 95 %-interval.</p>${regressionIntervalMarkup()}
 <dl class="normal-symbols"><dt>${math(margin)}</dt><dd>Fejlmarginen: afstanden fra den beregnede hældning til hver grænse. Delta betyder her ændring eller margin.</dd><dt>${math(se)}</dt><dd>Standardfejlen på hældningen. Indekset a fortæller, hvilken koefficient usikkerheden handler om.</dd><dt>${math(mi('t'))}</dt><dd>En faktor fra Student-fordelingen. Ved 95 %-niveau vælges dens 97,5 %-fraktil, fordi der er 2,5 % i hver hale.</dd><dt>${math(count+op('−')+n(2))}</dt><dd>Antal frihedsgrader ved den estimerede rette linje. Det bestemmer t-faktoren.</dd></dl>
 <p>Materialets interval skrives ${math(op('[')+a+op('−')+margin+op(';')+a+op('+')+margin+op(']'))}. Fejlmarginen findes som ${math(margin+op('=')+mi('t')+op('·')+se)}. Faktoren er ikke altid 1,96; få talpar kræver en større t-faktor.</p>
 ${worked('interval','Gennemregnet: fra hældning og fejlmargin til grænser')}
 <details><summary>Ekstra forklaring: hvor kommer standardfejlen fra?</summary><p>Lad ${math(sxx)} betegne summen af de kvadrerede vandrette afvigelser fra deres gennemsnit. De to x-er i indekset peger på den vandrette kvadratsum. Så er ${math(se+op('=')+frac(s,'<msqrt>'+sxx+'</msqrt>'))}. Stor lodret fejlvariation øger standardfejlen; et større vandret spænd kan mindske den. Standardfejlens enhed er responsenhed pr. vandret enhed.</p></details>
 ${worked('standard-error','Gennemregnet: residualspredning er ikke fejlmargin')}${mini(6)}${mini(7)}
 <p>Blomsterdata giver beregnet hældning cirka 0,8071795, standardfejl cirka 0,1585765 og t-faktor cirka 1,9844675. Fejlmargin cirka 0,3146900 giver interval [0,4925; 1,1219].</p>
 ${important('Skriv altid, hvilken parameter intervallet gælder, hvilket niveau der er brugt, og hvilken enhed grænserne har. Et hældningsinterval er ikke et interval for enkelte målinger.')}
`))}
${panel('fortolkning',section('Hvad betyder 95 %?',`
 <p>Tænk tilbage på de mange gentagne stikprøver: hver giver sin egen hældning og sit eget interval. Under modelantagelserne vil metoden ved mange gentagelser dække den samme faste sande hældning i cirka 95 % af tilfældene.</p><figure class="normal-concepts">${slopeIntervalSvg({lower:.5,upper:1.1,slope:.8})}<figcaption>Ét beregnet interval. Den underliggende hældning kendes ikke; den er ikke en ny tilfældig observation, der udtrækkes fra dette interval.</figcaption></figure>
 ${worked('coverage','Gennemregnet: genkend den korrekte intervalfortolkning')}${mini(8)}
 <p>Det er ikke korrekt at sige, at 95 % af datapunkterne ligger mellem hældningsgrænserne. Det klassiske interval tildeler heller ikke efter beregningen en sandsynlighed på 95 % til den faste parameter i netop dette interval.</p>
 ${important('De 95 % beskriver intervalmetodens dækning ved gentagne stikprøver under antagelserne. De beskriver hverken en andel af datapunkterne eller en garanti for dette ene interval.')}
`)+section('Hvorfor er nul vigtigt?',`
 <p>Hældning nul betyder en vandret <em>lineær middelmodel</em>. Se på hele intervallet, før du vurderer retningen.</p>
 <ul><li>Begge grænser strengt positive: støtte til voksende lineær sammenhæng under antagelserne.</li><li>Begge grænser strengt negative: støtte til aftagende lineær sammenhæng under antagelserne.</li><li>Nul indgår, også på en grænse: retningen er ikke fastslået ved dette niveau.</li></ul>
 ${worked('zero','Gennemregnet: en negativ hældning kan have et interval med nul')}${mini(9)}${mini(10)}${mini(11)}
 ${example('Gennemregnet: Blomster og Phillipsdata','<ol><li>Blomsternes interval [0,4925; 1,1219] er helt positivt og støtter biologernes formodning om voksende lineær sammenhæng.</li><li>Phillipsdata giver interval cirka [−0,5640; 0,0616]. Den beregnede hældning er negativ, men nul indgår.</li><li>En aftagende lineær sammenhæng er derfor ikke fastslået ved dette niveau. Det er ikke et bevis for ingen sammenhæng.</li><li>Begge fortolkninger er betinget af modelantagelser og fortæller ikke i sig selv noget om årsag.</li></ol>')}
`))}
${panel('omformning',section('Først ændres responsen, så regresseres den',`
 <p>Nogle opgaver bruger en ret linje for en <em>omformet</em> respons. Så skal den nye kolonne oprettes før regressionen. Koefficienterne tilhører den omformede skala.</p>
 <dl class="normal-symbols"><dt>${math(frac(n(1),y))}</dt><dd>Den reciprokke respons: én divideret med den oprindelige værdi. Nul kan ikke bruges i nævneren.</dd><dt>${math(power(y,2))}</dt><dd>Responsen i anden: den oprindelige værdi ganget med sig selv.</dd></dl>
 ${example('Fra data til graf på den nye skala','<ol><li>Arkets reciprokke eksempel har oprindelig respons 0,0706 ved første input én. Den nye lodrette værdi er cirka 14,1643.</li><li>Håndboldens hastighed 3,2 m/s bliver 10,24 i kvadreret hastighed.</li><li>Plot de nye lodrette værdier mod de oprindelige vandrette værdier. Det er denne sammenhæng, der skal være tilnærmet lineær.</li></ol>')}
 <figure class="normal-concepts">${regressionSvg(transformedRegression(reciprocalPairs,'reciprocal'),{xLabel:'Oprindelig vandret værdi',yLabel:'Reciprok respons'})}<figcaption>Arkets seks talpar, med én divideret med responsen på den lodrette akse. De omformede punkter følger omtrent en ret linje.</figcaption></figure>
 ${worked('reciprocal','Gennemregnet: reciprok respons og en ligning')}${mini(12)}
 <figure class="normal-concepts">${regressionSvg(transformedRegression(squaredPairs,'squared'),{xLabel:'Højde (m)',yLabel:'Kvadreret hastighed (m²/s²)'})}<figcaption>Arkets håndbolddata med kvadreret hastighed lodret. Den lineære model gælder denne skala.</figcaption></figure>
 ${worked('squared','Gennemregnet: kvadreret hastighed og tilbage med en rod')}${mini(13)}
 <p>I disse to opgaver beder materialet om koefficienter og tilbageberegning, ikke et nyt konfidensinterval. En eventuel intervalberegning på en omformet skala skal vurderes på den skala og kan ikke automatisk tolkes som et interval for den oprindelige respons' konstante hældning.</p>
 ${important('Koefficienterne gælder den størrelse, som faktisk blev regresseret. Når du går tilbage med reciprok eller kvadratrod, ændres modellens form og domæne. Markér ekstrapolation uden for de målte værdier.')}
`))}
${panel('vaerktoej',section('Dokumentér hele undersøgelsen',`
 <p>Du kan bruge modulets figurer og talpar eller et statistikværktøj med samme matematiske valg. Kildearket fastlægger ikke et bestemt produkt eller entydige kommandonavne.</p>
 <ol><li>Angiv kilde, antal sammenhørende par, variable og enheder. Korn bruger år efter 1961; Phillips bruger arbejdsløshed og inflation, ikke årstal som regressor.</li><li>Importér hele parrede datasættet. Sortér ikke de to kolonner hver for sig.</li><li>Vælg lineær regression med hældning og skæring, og gem koefficienterne med ekstra cifre.</li><li>Beregn residualer som observation minus model. Vis residualplot og normalplot af residualer, og beskriv mønster og usædvanlige værdier.</li><li>Angiv residualspredning med nævner antal minus to. Vurder også dataindsamling, uafhængighed og ens fejlspredning.</li><li>Vælg et tosidet 95 %-interval for <em>hældningen</em>. Gem standardfejl, t-faktor, frihedsgrader og grænser med enheder.</li><li>Se, om nul indgår, og skriv en forsigtig konklusion om den lineære sammenhæng under antagelserne.</li></ol>
 ${worked('workflow','Gennemregnet: vælg en fuld dokumentation')}
 <details><summary>Kildekontrol og afrunding</summary><p>Blomster og Unibrew genskaber arkets facit. Phillipsdataenes uafrundede øvre intervalgrænse er cirka 0,0615523; arket skriver 0,06159. Appen bruger alle talpar og det genberegnede resultat. Begge indeholder nul. Originalfilerne er uændrede.</p><p>Opgavearket er den primære faglige kilde. Supplerende metodekontrol: <a href="https://itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noreferrer">NIST om konfidensintervaller</a> og <a href="https://stat.ethz.ch/R-manual/R-devel/library/stats/html/confint.html" target="_blank" rel="noreferrer">R-dokumentation om t-baserede intervaller for lineære modeller</a>.</p></details>
`))}
${panel('oevelser',section('Opgaver i stigende sværhedsgrad',`
 <p>Begynd med ændring, residualer og fortolkning uden hjælpemidler. Fortsæt med fejlmargin, de fire originale datasæt og omformede modeller. Alle nødvendige talpar er vedlagt opgaverne.</p>${renderExercises(normalRegressionTasks)}<a href="#tasks">Åbn den fælles opgavebank</a>
`)+section('Typiske misforståelser',`
 <ul><li>Residual med forkert fortegn: brug observeret minus model.</li><li>Residualspredning bruges som hældningens fejlmargin: beregn først standardfejl og t-faktor.</li><li>Negativ beregnet hældning bruges som sikker negativ konklusion: undersøg hele intervallet.</li><li>Nul i intervallet læses som bevis for ingen sammenhæng: resultatet fastslår ikke nul.</li><li>95 % læses som en andel af målingerne: intervallet gælder en parameter.</li><li>Et pænt normalplot bruges som bevis for alle antagelser: vurder også residualmønster og indsamling.</li></ul>
`)+section('Dine værktøjsnoter',`
 <p>Notér kilde, variable, enheder, parring, eventuel omformning, koefficienter, residualkontrol, intervalmetode, grænser og konklusion. Egne formuleringer vurderes med tjeklisten; appen bedømmer de konkrete svarfelter og valg.</p><label for="regression-notes">Min dokumentation</label><textarea id="regression-notes" rows="7"></textarea>
 <details><summary>Tjek din egen forklaring</summary><ul><li>Er det tydeligt, hvilken hældning intervallet handler om?</li><li>Har du adskilt residualspredning, standardfejl og fejlmargin?</li><li>Er antagelserne undersøgt og begrænsninger beskrevet?</li><li>Er nul vurderet, og er de 95 % forklaret korrekt?</li><li>Undgår du sikkerhed om enkelte observationer, fremtid og årsag?</li></ul></details>
`))}
${panel('sluttjek',section('Afsluttende forståelsestjek',`<p>Kontrollér residualer, grænser, nul, antagelser, enheder og intervalfortolkning. Starttjekket er diagnostisk; mikroøvelser, bankopgaver og disse otte slutkort indgår i modulstatus.</p><p data-regression-final-status role="status"></p>${renderExercises(regressionFinal)}`))}
${panel('opsummering',section('Det skal du tage med',`
 <p>En regression giver en beregnet linje. Residualerne viser målingernes afvigelser fra den. Et hældningsinterval beskriver usikkerhed på en underliggende modelparameter under bestemte antagelser.</p>${important('Se på hele intervallet og på den model, der ligger bag. Et tal beregnet af et værktøj er ikke i sig selv en faglig konklusion.')}
 <p data-regression-next role="status"></p><ul><li>Regnefejl: gå til grundhjælp og gennemregnede residualer.</li><li>Begrebsfejl: genlæs usikkerhed, 95 % og nul i intervallet.</li><li>Modeltvivl: genbesøg residualplot, normalplot og dataindsamling.</li></ul>
 <p>Næste side er den åbne opsamling med blandede opgaver og et samlet forståelsestjek.</p><a href="#normalDistribution/opsamling/start">Fortsæt til opsamlingen</a> · <a href="#normalDistribution">Forløbsoversigt</a> · <a href="#tasks">Opgavebank</a>
`))}`);}
