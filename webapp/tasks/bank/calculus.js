import { math, n, x, power } from "../math.js";
export const calculusTasks = [
  {
    id: "diff.product",
    version: 1,
    topic: "differentiation",
    module: "diff.2",
    goals: ["diff.product"],
    prerequisites: ["diff.1"],
    difficulty: 2,
    size: "medium",
    minutes: 6,
    aids: false,
    prompt: `<p>Bestem den afledte funktion til ${math(`<mi>f</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${x}<mo>(</mo>${x}<mo>+</mo>${n(3)}<mo>)</mo>`)}.</p>`,
    parts: [
      {
        id: "expr",
        label: "Den afledte forskrift",
        type: "expression",
        answer: "2*x+3",
        points: 3,
      },
    ],
    hints: [
      "Begge faktorer afhænger af den ukendte.",
      `Differentier én faktor ad gangen og læg bidragene sammen. Du kan også først gange parentesen ud.`,
    ],
    solution: `<ol><li>Faktorerne er ${math(`<mi>u</mi><mo>=</mo>${x}`)} og ${math(`<mi>v</mi><mo>=</mo>${x}<mo>+</mo>${n(3)}`)}. Begge afledte er ${math(n(1))}.</li><li>Produktreglen giver ${math(`<msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(1)}<mo>·</mo><mo>(</mo>${x}<mo>+</mo>${n(3)}<mo>)</mo><mo>+</mo>${x}<mo>·</mo>${n(1)}<mo>=</mo>${n(2)}${x}<mo>+</mo>${n(3)}`)}.</li><li>Kontrol: Udvid først til ${math(`${power(x, 2)}<mo>+</mo>${n(3)}${x}`)} og differentier ledvis. Det giver samme resultat.</li></ol>`,
    errors: [
      {
        part: "expr",
        answer: "1",
        feedback:
          "Produktet af de afledte er ikke den afledte af produktet. Der skal være to bidrag.",
      },
      {
        part: "expr",
        feedback:
          "Husk begge faktorers bidrag, eller gang parentesen ud og differentier led for led.",
      },
    ],
  },
  {
    id: "diff.garden",
    version: 1,
    topic: "differentiation",
    module: "diff.5",
    goals: ["diff.optimize"],
    prerequisites: ["eq.basic", "diff.1"],
    difficulty: 3,
    size: "complex",
    minutes: 14,
    aids: true,
    prompt: `<p>Christian vil indhegne en rektangulær have op ad en lige mur. Muren udgør den ene side, og der er 20 meter hegn til de tre andre sider. Der skal bruges hegn på begge sider vinkelret på muren og på siden overfor muren. Lad ${math(x)} være længden i meter af hver side vinkelret på muren. Alle sider skal have positiv længde.</p><p>Find den indretning, der giver det største areal. Vis beregninger, og forklar hvorfor dit resultat er et maksimum.</p>`,
    parts: [
      {
        id: "model",
        label: "a. Skriv arealet som funktion af sidelængden",
        type: "expression",
        answer: "x*(20-2*x)",
        points: 2,
      },
      {
        id: "width",
        label: "b. Optimal sidelængde vinkelret på muren, i meter",
        type: "number",
        answer: "5",
        points: 2,
      },
      {
        id: "area",
        label: "c. Største areal, i kvadratmeter",
        type: "number",
        answer: "50",
        points: 2,
      },
      {
        id: "reason",
        label: "d. Begrund, at arealet er størst",
        type: "text",
        points: 3,
        checklist: [
          "Angiv det mulige interval for sidelængden.",
          "Find den afledte og dens nulpunkt.",
          "Vis fortegnsskift fra positiv til negativ, eller brug negativ anden afledte sammen med intervallet.",
          "Knyt konklusionen til areal og enheder.",
        ],
        concepts: [
          "definitionsinterval",
          "afledt",
          "maksimum",
          "fortegnsskift",
        ],
      },
    ],
    hints: [
      "Hegnet skal dække to lige lange sider og siden overfor muren.",
      `Siden langs muren er ${math(`${n(20)}<mo>−</mo>${n(2)}${x}`)}. Arealet er produktet af de to sidelængder.`,
      `Find den afledtes nulpunkt, og undersøg dens fortegn på begge sider.`,
    ],
    solution: `<ol><li>Positiv længde kræver ${math(`${n(0)}<mo>&lt;</mo>${x}<mo>&lt;</mo>${n(10)}`)}. Den tredje side er ${math(`${n(20)}<mo>−</mo>${n(2)}${x}`)}.</li><li>Arealet er ${math(`<mi>A</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${x}<mo>(</mo>${n(20)}<mo>−</mo>${n(2)}${x}<mo>)</mo><mo>=</mo>${n(20)}${x}<mo>−</mo>${n(2)}${power(x, 2)}`)}.</li><li>${math(`<msup><mi>A</mi><mo>′</mo></msup><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(20)}<mo>−</mo>${n(4)}${x}<mo>=</mo>${n(0)}<mo>⇔</mo>${x}<mo>=</mo>${n(5)}`)}.</li><li>Den afledte er positiv før fem og negativ efter fem på hele intervallet. Derfor er dette det globale maksimum. Alternativt er anden afledte konstant negativ.</li><li>Sidelængderne er 5 og 10 meter. Arealet er ${math(`${n(5)}<mo>·</mo>${n(10)}<mo>=</mo>${n(50)}<mtext> m²</mtext>`)}.</li></ol>`,
    errors: [
      {
        part: "model",
        answer: "x*(20-x)",
        feedback: "Der er to sider vinkelret på muren. Begge bruger hegn.",
      },
      {
        part: "width",
        answer: "10",
        feedback:
          "Denne længde efterlader intet hegn til den tredje side. Undersøg et indre maksimum.",
      },
      {
        part: "area",
        feedback:
          "Beregn arealet med begge sidelængder fra den optimale indretning.",
      },
      {
        part: "reason",
        feedback:
          "Et nulpunkt for den afledte er en kandidat. Forklar også fortegnsskiftet eller krumningen og det mulige interval.",
      },
    ],
  },
];
