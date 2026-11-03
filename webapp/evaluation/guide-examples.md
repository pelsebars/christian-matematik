# Eksempler på ønsket vejledning

Disse er håndskrevne referenceforløb, ikke observerede modelsvar. De følger udviklingsopgaverne i `guide-cases.js`. Evalueringsopgaverne med split `holdout` bruges ikke som prompt-eksempler.

| Opgave | Trin 1: forstå og genkend | Trin 2: find en vej | Trin 3: ved ønske om beregningshjælp |
| --- | --- | --- | --- |
| Kuglens største højde | »Højest« betyder toppen af højdegrafen: et maksimum. »Hvornår« betyder, at svaret skal være et tidspunkt. Differentialregning er relevant. | På en glat indre top er hældningen 0. Find kandidater med h′(t)=0, og sammenlign med endepunkter. | Differentier ét led ad gangen. Lad eleven prøve næste led, eller vis det hvis eleven ikke ved det. |
| Andel æg mellem 55 og 70 g | »Normalmodel« og »mellem« peger på sandsynligheden i et interval i normalfordelingen. Det er en andel, ikke en vægt, der efterspørges. | Fordelingsfunktionen samler sandsynligheden op fra venstre. Træk sandsynligheden under 55 fra sandsynligheden under 70. | Hjælp med F(70)−F(55), modellens parametre og eventuel CAS-indtastning. |
| Vand tilført over fem minutter | Funktionen fortæller liter pr. minut; opgaven spørger om liter i alt. Små tilførsler skal samles: et bestemt integral. | Integrér tilførselshastigheden fra starttid til sluttid. Startbeholdning er kun nødvendig, hvis den samlede beholdning spørges efter. | Find en stamfunktion og indsæt grænserne ét trin ad gangen. |
| Areal mellem to grafer | »Mellem graferne« betyder hele området imellem dem. Det peger på integralregning. | Find skæringerne og undersøg, hvilken graf der ligger øverst. | Hjælp først med skæringsligningen og derefter integralet af øvre minus nedre. |
| Vinkel mellem vektorer | To retninger skal sammenlignes. Skalarproduktet forbinder vektorer med vinklen mellem dem. | Find skalarprodukt og begge længder, og brug cosinusrelationen. | Beregn én af størrelserne og lad eleven prøve den næste; udeluk nulvektorer. |
| Kontrollér y=3exp(2x) i y′=2y | »Kontrollér løsning« betyder, at der allerede er et forslag. En differentialligning forbinder funktionen og dens ændring. | Differentier forslaget, og sammenlign med højresiden efter indsættelse. | Vis brugen af kædereglen og sammenlign de to udtryk. |
| Perioden i 3sin(2x)+1 | Sinus gentager sit mønster. Perioden er afstanden mellem gentagelser; det er trigonometriske funktioner. | Tallet foran x bestemmer perioden; tallet foran sinus bestemmer amplituden. | Brug 2π/|ω| med ω=2, og hold det adskilt fra amplituden 3. |
| Stationære punkter for f(x,y) | Der er to input. Et stationært punkt har ingen førsteordens ændring i nogen af koordinatretningerne. Det er funktioner af to variable. | Find begge partielle afledte og løs dem lig 0 samtidig. | Hold den anden variabel fast ved hver differentiation. Undersøg derefter typen; stationær betyder ikke automatisk maksimum. |

## Når eleven fortsat er forvirret

Ved »hvad betyder maksimum?«: »Det er den største højde i det område, opgaven handler om — toppen på grafen.« Undlad at gentage hele metodeopskriften.

Ved »jeg ved ikke hvordan«: vis et konkret næste trin i stedet for endnu et gættespørgsmål. Ved »guid mig hele vejen«: gennemgå opgaven i små trin, også helt frem til resultatet hvis eleven ønsker det.

Ved uklar billedtekst: »Jeg kan ikke se, om der står x² eller x³. Kan du skrive udtrykket?« Ved manglende figur: bed om figuren; opfind ikke dens form.

## Faglige kontrolpunkter

- Stationære punkter kan være vendepunkter eller saddelpunkter; endepunkter kan give globale ekstrema.
- Areal mellem x og x² på [0,1] er ∫(x−x²)dx, da x≥x² på dette interval.
- Vægte i et normalfordelingsinterval kræver en forskel af fordelingsfunktionsværdier, ikke tætheder.
- Integral af hastighed giver forskydning; integral af fart giver tilbagelagt længde.
- To baner kan krydse uden kollision; kollision kræver samme tidspunkt.
- Trigonometriske funktioner, to variable og polære koordinater er med i oversigten, men mangler egne appmoduler. Ingen opdigtede apphenvisninger.
