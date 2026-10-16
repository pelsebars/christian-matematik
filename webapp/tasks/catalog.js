import { integralModules } from "../integral-plan.js";
export const topics = {
  integration: "Integralregning",
  equations: "Løsning af ligninger",
  quadratic: "Andengradsligninger",
  composite: "Sammensatte funktioner",
  differentiation: "Differentialregning",
  planeGeometry: "Plangeometri og vektorer",
};
export const modules = {
  ...Object.fromEntries(integralModules.map(m => [m.id, {topic:"integration", name:m.title, section:m.section}])),
  "eq.basic": { topic: "equations", name: "Ligninger", section: "teori" },
  "quad.basic": {
    topic: "quadratic",
    name: "Andengradsligninger",
    section: "andengrad-form",
  },
  "comp.basic": {
    topic: "composite",
    name: "Sammensatte funktioner",
    section: "sammensaetning",
  },
  "diff.1": {
    topic: "differentiation",
    name: "Differentialkvotient",
    section: "diff-ide",
  },
  "diff.2": {
    topic: "differentiation",
    name: "Produktreglen",
    section: "diff-produktregel",
  },
  "diff.3": {
    topic: "differentiation",
    name: "Kædereglen",
    section: "diff-kaederegel",
  },
  "diff.4": {
    topic: "differentiation",
    name: "Vendetangent",
    section: "diff-vendetangent",
  },
  "diff.5": {
    topic: "differentiation",
    name: "Opsamling og optimering",
    section: "diff-opsamling",
  },
  "geo.1": {
    topic: "planeGeometry",
    name: "Vektorer i planen",
    section: "vektor-teori",
  },
  "geo.2": {
    topic: "planeGeometry",
    name: "Skalarprodukt og vinkler",
    section: "skalar-teori",
  },
  "geo.3": {
    topic: "planeGeometry",
    name: "Projektion og determinant",
    section: "projektion-teori",
  },
  "geo.4": { topic: "planeGeometry", name: "Linjen", section: "linje-teori" },
  "geo.5": { topic: "planeGeometry", name: "Cirklen", section: "cirkel-teori" },
};
export const goals = {
  "int.substitution": {module:"int.6",text:"Vælge indre funktion og omskrive hele differentialet"},
  "int.sub-factor": {module:"int.6",text:"Bevare konstantfaktorer og fortegn fra den indre afledte"},
  "int.sub-power": {module:"int.6",text:"Integrere potenser i ny variabel og substituere tilbage"},
  "int.sub-log": {module:"int.6",text:"Integrere en indre afledt divideret med funktionen"},
  "int.sub-domain": {module:"int.6",text:"Kontrollere nævnere, logaritmeargumenter og intervaller"},
  "int.sub-trig": {module:"int.6",text:"Brug substitution med sinus og cosinus i radianer"},
  "int.sub-check": {module:"int.6",text:"Begrunde substitution med kædereglen og kontrollere resultat"},
  "int.sub-cas": {module:"int.6",text:"Dokumentere CAS, punktbetingelse og præcise konstanter"},
  "int.sub-model": {module:"int.6",text:"Fortolke stamfunktion som strækning med tidsgrænser og enheder"},
  "int.discs": {module:"int.5",text:"Opstille rumfang med cirkelskiver og radius i anden"},
  "int.washers": {module:"int.5",text:"Beregne skiver med hul og medtage massive dele"},
  "int.volume-units": {module:"int.5",text:"Skelne mellem radius, diameter og volumen med enheder"},
  "int.volume-model": {module:"int.5",text:"Bestemme kapacitet, materiale og ukendt fyldehøjde"},
  "int.arc": {module:"int.5",text:"Beregne kurvelængde med den afledte"},
  "int.length-units": {module:"int.5",text:"Fortolke længde og kontrollere enheder og interval"},
  "int.length-model": {module:"int.5",text:"Dokumentere og kontrollere numerisk kurvelængde i en model"},
  "rep.powers": {module:"int.rep",text:"Bruge potensregneregler med korrekte fortegn og betingelser"},
  "rep.roots": {module:"int.rep",text:"Forbinde rødder med rationale og negative eksponenter"},
  "rep.inverse": {module:"int.rep",text:"Bestemme og kontrollere en omvendt funktion"},
  "rep.domain": {module:"int.rep",text:"Vælge domæne og værdimængde og kontrollere en-til-en"},
  "rep.graph": {module:"int.rep",text:"Forklare spejling og ombytning af koordinater"},
  "rep.model": {module:"int.rep",text:"Fortolke en omvendt model med enheder og begrænset domæne"},
  "int.intersections": {module:"int.4",text:"Bestemme relevante skæringer og nulpunkter til arealgrænser"},
  "int.between": {module:"int.4",text:"Beregne areal mellem grafer med øvre minus nedre"},
  "int.split": {module:"int.4",text:"Opdele intervallet når fortegn eller grafplacering ændrer sig"},
  "int.area-rules": {module:"int.4",text:"Anvende lineæritet og intervaladdition for bestemte integraler"},
  "int.numeric": {module:"int.4",text:"Udføre og vurdere numerisk integration med trapezmetoden"},
  "int.discrete": {module:"int.4",text:"Fortolke endelige summer fra diskrete måledata"},
  "int.area-model": {module:"int.4",text:"Fortolke integralmodeller og enheder med kontrol af antagelser"},
  "int.area-parameter": {module:"int.4",text:"Bestemme parametre ud fra arealbetingelser"},
  "int.definite": {module:"int.3",text:"Beregne bestemte integraler med korrekte grænser"},
  "int.ftc": {module:"int.3",text:"Forbinde det bestemte integral med stamfunktionsforskellen"},
  "int.bounds": {module:"int.3",text:"Indsætte grænser med korrekte potenser, parenteser og fortegn"},
  "int.signed": {module:"int.3",text:"Skelne mellem fortegnet integral og geometrisk areal"},
  "int.accumulation": {module:"int.3",text:"Fortolke akkumuleret ændring og arbejde med enheder"},
  "int.cas-definite": {module:"int.3",text:"Dokumentere CAS-grænser og kontrollere modeller og parametre"},
  "int.graph": {module:"int.2",text:"Forbinde funktionens fortegn med stamfunktionens vækst"},
  "int.shift": {module:"int.2",text:"Forstå lodret forskydning og integrationskonstant"},
  "int.stationary": {module:"int.2",text:"Skelne mellem vandret tangent og ekstremum"},
  "int.point": {module:"int.2",text:"Bestemme stamfunktion ud fra et punkt eller en funktionsværdi"},
  "int.tangent": {module:"int.2",text:"Bestemme stamfunktion med en given tangent"},
  "int.reasoning": {module:"int.2",text:"Begrunde graf- og modelkonklusioner og kontrollere alle muligheder"},
  "int.cas-point": {module:"int.2",text:"Bruge CAS og kontrollere domæne, afledt og punktbetingelse"},
  "int.definition": {module:"int.1",text:"Kontrollere en stamfunktion ved differentiation"},
  "int.family": {module:"int.1",text:"Skelne mellem én og samtlige stamfunktioner"},
  "int.rules": {module:"int.1",text:"Integrere med grundregler og korrekt domæne"},
  "int.model": {module:"int.1",text:"Fortolke stamfunktioner i en model med enheder"},
  "int.cas": {module:"int.1",text:"Dokumentere og kontrollere CAS-resultater"},
  "eq.isolate": {
    module: "eq.basic",
    text: "Isolere den ukendte og kontrollere løsningen",
  },
  "eq.balance": {
    module: "eq.basic",
    text: "Bevare ligheden ved at udføre samme handling på begge sider",
  },
  "eq.inverse": {
    module: "eq.basic",
    text: "Bruge modsatte regnearter til at frigøre den ukendte",
  },
  "eq.collect": {
    module: "eq.basic",
    text: "Samle ukendte led og konstantled med korrekte fortegn",
  },
  "eq.parentheses": {
    module: "eq.basic",
    text: "Gange korrekt ind i én eller flere parenteser",
  },
  "eq.signs": {
    module: "eq.basic",
    text: "Håndtere negative koefficienter og fortegn sikkert",
  },
  "eq.fractions": {
    module: "eq.basic",
    text: "Fjerne talnævnere uden at ændre ligheden",
  },
  "eq.check": {
    module: "eq.basic",
    text: "Kontrollere en foreslået eller beregnet løsning ved indsættelse",
  },
  "quad.roots": {
    module: "quad.basic",
    text: "Bestemme diskriminant og alle reelle løsninger",
  },
  "comp.order": {
    module: "comp.basic",
    text: "Sammensætte funktioner i den rigtige rækkefølge",
  },
  "diff.quotient": {
    module: "diff.1",
    text: "Forbinde differenskvotient, sekant og tangenthældning",
  },
  "diff.rules": {
    module: "diff.1",
    text: "Differentiere grundfunktioner og summer sikkert",
  },
  "diff.value": {
    module: "diff.1",
    text: "Bestemme og skelne mellem funktionsværdi og afledt værdi",
  },
  "diff.interpret": {
    module: "diff.1",
    text: "Fortolke fortegn, tidspunkt og enhed for en væksthastighed",
  },
  "diff.product-structure": {
    module: "diff.2",
    text: "Genkende produkter og forklare reglens to bidrag",
  },
  "diff.product": {
    module: "diff.2",
    text: "Differentiere et produkt og forenkle resultatet",
  },
  "diff.product-value": {
    module: "diff.2",
    text: "Bestemme en afledt produktværdi ud fra faktorernes værdier",
  },
  "diff.product-model": {
    module: "diff.2",
    text: "Fortolke og kontrollere produktbaserede vækstmodeller",
  },
  "diff.chain-structure": {
    module: "diff.3",
    text: "Identificere indre og ydre funktion i en sammensætning",
  },
  "diff.chain": {
    module: "diff.3",
    text: "Differentiere sammensatte funktioner med alle faktorer",
  },
  "diff.chain-combine": {
    module: "diff.3",
    text: "Kombinere kædereglen med produktreglen",
  },
  "diff.chain-model": {
    module: "diff.3",
    text: "Fortolke afledte værdier i sammensatte modeller",
  },
  "diff.tangent": {
    module: "diff.4",
    text: "Bestemme tangentligning ud fra punkt og afledt værdi",
  },
  "diff.inflection": {
    module: "diff.4",
    text: "Bestemme og kontrollere vendepunkter med anden afledte",
  },
  "diff.parallel": {
    module: "diff.4",
    text: "Bestemme andre tangenter med samme hældning",
  },
  "diff.intersection": {
    module: "diff.4",
    text: "Bestemme yderligere skæringer mellem graf og tangent",
  },
  "diff.greatest-growth": {
    module: "diff.4",
    text: "Forbinde vendepunkt med størst væksthastighed i en model",
  },
  "diff.monotonicity": {
    module: "diff.5",
    text: "Bestemme monotoniforhold ud fra den afledtes fortegn",
  },
  "diff.extrema": {
    module: "diff.5",
    text: "Bestemme og klassificere lokale ekstrema",
  },
  "diff.global": {
    module: "diff.5",
    text: "Bestemme globale ekstrema på et lukket interval",
  },
  "diff.optimize": {
    module: "diff.5",
    text: "Opstille en model og begrunde et globalt maksimum",
  },
  "diff.cas": {
    module: "diff.5",
    text: "Dokumentere CAS, afgrænse løsninger og fortolke resultatet",
  },
  "geo.vector": {
    module: "geo.1",
    text: "Bestemme vektor mellem punkter og længde",
  },
  "geo.angle": {
    module: "geo.2",
    text: "Forbinde skalarproduktets fortegn med vinklen",
  },
  "geo.line": {
    module: "geo.4",
    text: "Bestemme korteste afstand til en linje",
  },
  "geo.circle": {
    module: "geo.5",
    text: "Bestemme centrum, radius og en tangent",
  },
};
