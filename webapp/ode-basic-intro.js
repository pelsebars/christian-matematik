import { math, n, eq, minus, fn, prime, exp } from './integral-math.js';

const t = '<mi>t</mi>';
const amount = fn('V', t);
const rate = prime('V', t);
const tenth = '<mn>0,1</mn>';

export const odeBasicIntro = `
<section class="lesson-section" id="ode-basic-idea">
 <h2>1 · Helt fra bunden: hvad er en differentialligning?</h2>
 <p><strong>En differentialligning er en ligning, der fortæller, hvordan en størrelse ændrer sig.</strong> Den indeholder den afledte af en ukendt funktion. Den afledte fortæller, hvor hurtigt størrelsen ændrer sig lige nu, og ligningen forbinder denne hastighed med for eksempel tiden eller størrelsen selv.</p>
 <p>Ofte afhænger ændringshastigheden af selve størrelsen. Så møder vi både funktionen og dens egen afledte i samme ligning. Det er en sammenhæng mellem de to, vi kender — selve funktionen skal vi finde.</p>

 <h3>Tænk på vand, der løber ud af en tønde</h3>
 <p>Forestil dig en tønde med et afløb i bunden. Der kommer ikke nyt vand i. Når vandet står højt, presser det mere på ved afløbet, og vandet løber hurtigere ud. Når vandstanden falder, bliver udstrømningen langsommere.</p>
 <p>Vi vil gerne kunne svare på: <strong>Hvor meget vand er der tilbage efter et bestemt antal minutter?</strong> Men først kender vi kun en regel for, hvor hurtigt vandet løber ud.</p>
 <ul>
  <li>${math(amount)} er <strong>vandmængden</strong> efter ${math(t)} minutter, målt i liter.</li>
  <li>${math(rate)} er <strong>vandmængdens ændringshastighed</strong> på det tidspunkt, målt i liter pr. minut.</li>
 </ul>
 <p>Det lille mærke ved bogstavet betyder altså noget vigtigt: uden mærket taler vi om, hvor meget vand der er; med mærket taler vi om, hvor hurtigt mængden ændrer sig.</p>

 <h3>En enkel regel bliver til en ligning</h3>
 <p>Til dette regneeksempel vælger vi en forenklet model: <strong>Udstrømningshastigheden i liter pr. minut er en tiendedel af den aktuelle vandmængde i liter.</strong> Vi bruger reglen til at forstå idéen; den præcise sammenhæng for en virkelig tønde afhænger blandt andet af tøndens form og afløbet.</p>
 <ul>
  <li>Med 100 liter tilbage løber vandet ud med 10 liter pr. minut lige nu.</li>
  <li>Med 50 liter tilbage løber det ud med 5 liter pr. minut lige nu.</li>
  <li>Med 20 liter tilbage løber det ud med 2 liter pr. minut lige nu.</li>
 </ul>
 <p>Vandmængden bliver mindre, så dens ændringshastighed er negativ. Reglen skrives:</p>
 <div class="int-formula">${math(rate + eq + minus + tenth + '<mo>·</mo>' + amount)}</div>
 <p>Læs ligningen højt: <strong>»Vandmængdens ændringshastighed er minus en tiendedel af vandmængden.«</strong></p>
 <p>På venstre side står ændringshastigheden. På højre side står vandmængden, som bestemmer hastigheden. <strong>Derfor er det en differentialligning: funktionen og dens afledte er forbundet i én ligning.</strong></p>
 <p>For eksempel betyder ${math(rate + eq + n(-10))}, at vandmængden lige nu falder med 10 liter pr. minut. Det betyder ikke, at der er minus 10 liter i tønden. Og hastigheden holder ikke nødvendigvis hele det næste minut: den bliver mindre, efterhånden som vandet løber ud.</p>

 <h3>Hvad betyder det så at løse ligningen?</h3>
 <p>At løse den betyder at finde en funktion, som fortæller <strong>vandmængden til hvert tidspunkt</strong>, og som ændrer sig efter den regel, vi har skrevet.</p>
 <p>Vi skal også kende startmængden for at beskrive netop vores tønde. Hvis der er 100 liter ved start, skriver vi ${math(fn('V', n(0)) + eq + n(100))}. Differentialligningen giver ændringsreglen; startoplysningen fortæller, hvor forløbet begynder.</p>
 <details><summary>Se et eksempel på den færdige funktion</summary>
  <p>Med vores enkle regel og 100 liter ved start er løsningen ${math(amount + eq + n(100) + '<mo>·</mo>' + exp(minus + tenth + t))}.</p>
  <p>Du behøver ikke kunne finde denne formel endnu. Læg blot mærke til forskellen: Ligningen med den afledte beskrev ændringen; denne formel kan beregne vandmængden direkte. Efter cirka 6,9 minutter er der 50 liter tilbage, og udstrømningshastigheden er da cirka 5 liter pr. minut.</p>
 </details>
 <details><summary>Tænk selv: tømmes tønden lige hurtigt hele tiden?</summary>
  <p>Nej. I modellen falder udstrømningshastigheden sammen med vandmængden. Der løber altså færre liter ud pr. minut, efterhånden som tønden tømmes. Modellen nærmer sig en tom tønde uden at nå præcis nul på et endeligt tidspunkt.</p>
 </details>
 <p><strong>Det vigtigste at tage med:</strong> Vi kan kende en regel for ændringen, selv om vi endnu ikke kender funktionen. Differentialligningen er den regel skrevet med matematik.</p>
</section>`;
