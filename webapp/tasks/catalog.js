export const topics = {
  equations: "Løsning af ligninger",
  quadratic: "Andengradsligninger",
  composite: "Sammensatte funktioner",
  differentiation: "Differentialregning",
  planeGeometry: "Plangeometri og vektorer",
};
export const modules = {
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
  "eq.isolate": {
    module: "eq.basic",
    text: "Isolere den ukendte og kontrollere løsningen",
  },
  "quad.roots": {
    module: "quad.basic",
    text: "Bestemme diskriminant og alle reelle løsninger",
  },
  "comp.order": {
    module: "comp.basic",
    text: "Sammensætte funktioner i den rigtige rækkefølge",
  },
  "diff.product": {
    module: "diff.2",
    text: "Differentiere et produkt og forenkle resultatet",
  },
  "diff.optimize": {
    module: "diff.5",
    text: "Opstille en model og begrunde et globalt maksimum",
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
