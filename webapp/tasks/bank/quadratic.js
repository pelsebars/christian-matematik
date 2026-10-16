import { math, n, power, x } from "../math.js";

const base = {
  version: 1,
  topic: "quadratic",
  module: "quad.basic",
  prerequisites: ["eq.basic"],
  aids: false,
};

const integer = (random, minimum, maximum) =>
  minimum + Math.floor(random() * (maximum - minimum + 1));

const nonZeroInteger = (random, minimum, maximum) => {
  let value = 0;
  while (value === 0) value = integer(random, minimum, maximum);
  return value;
};

const parentheses = (body) => `<mo>(</mo>${body}<mo>)</mo>`;
const equation = (left, right = n(0)) => math(`${left}<mo>=</mo>${right}`);
const square = (value) => power(n(value), 2);

const term = (coefficient, degree, first) => {
  if (coefficient === 0) return "";
  const magnitude = Math.abs(coefficient);
  const sign = first
    ? coefficient < 0
      ? "<mo>−</mo>"
      : ""
    : `<mo>${coefficient < 0 ? "−" : "+"}</mo>`;
  if (degree === 0) return `${sign}${n(magnitude)}`;
  const coefficientBody = magnitude === 1 ? "" : n(magnitude);
  return `${sign}${coefficientBody}${degree === 1 ? x : power(x, degree)}`;
};

const polynomialBody = (a, b, c) => {
  const values = [
    [a, 2],
    [b, 1],
    [c, 0],
  ];
  let first = true;
  return values
    .map(([coefficient, degree]) => {
      const body = term(coefficient, degree, first);
      if (body) first = false;
      return body;
    })
    .join("");
};

const linearBody = (coefficient, constant = 0) => {
  let first = true;
  const linear = term(coefficient, 1, first);
  if (linear) first = false;
  return `${linear}${term(constant, 0, first)}` || n(0);
};

const coefficientsMath = (a, b, c) =>
  math(
    `<mi>a</mi><mo>=</mo>${n(a)}<mo>,</mo><mi>b</mi><mo>=</mo>${n(b)}<mo>,</mo><mi>c</mi><mo>=</mo>${n(c)}`,
  );

const discriminantBody = (a, b, c, d) =>
  `<mi>d</mi><mo>=</mo>${square(b)}<mo>−</mo>${n(4)}<mo>·</mo>${parentheses(n(a))}<mo>·</mo>${parentheses(n(c))}<mo>=</mo>${n(d)}`;

const formulaBody = (a, b, d) =>
  `${x}<mo>=</mo><mfrac><mrow><mo>−</mo>${parentheses(n(b))}<mo>±</mo><msqrt>${n(d)}</msqrt></mrow><mrow>${n(2)}<mo>·</mo>${parentheses(n(a))}</mrow></mfrac>`;

const substitutionBody = (a, b, c, value) => {
  const inserted = value < 0 ? parentheses(n(value)) : n(value);
  const linear = `<mo>${b < 0 ? "−" : "+"}</mo>${n(Math.abs(b))}<mo>·</mo>${inserted}`;
  const constant = `<mo>${c < 0 ? "−" : "+"}</mo>${n(Math.abs(c))}`;
  return `${n(a)}<mo>·</mo>${power(inserted, 2)}${linear}${constant}<mo>=</mo>${n(0)}`;
};

const automaticCountOptions = [
  { id: "two", label: "To forskellige reelle værdier" },
  { id: "one", label: "Én reel værdi" },
  { id: "none", label: "Ingen reelle værdier" },
];

const rootsFromRandom = (random) => {
  const first = nonZeroInteger(random, -6, 5);
  let second = nonZeroInteger(random, -5, 6);
  while (second === first) second = nonZeroInteger(random, -5, 6);
  return [Math.min(first, second), Math.max(first, second)];
};

export const quadraticTasks = [
  {
    id: "quad.foundation-sign-root",
    version: 1,
    generate(random) {
      const value = integer(random, 2, 9);
      return {
        ...base,
        id: "quad.foundation-sign-root",
        goals: ["quad.foundation"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: "<p>Beregn de tre værdier.</p>",
        parts: [
          {
            id: "parenthesized-square",
            label: math(power(n(-value), 2)),
            type: "number",
            answer: String(value ** 2),
            points: 1,
          },
          {
            id: "negative-square",
            label: math(`<mo>−</mo>${power(n(value), 2)}`),
            type: "number",
            answer: String(-(value ** 2)),
            points: 1,
          },
          {
            id: "root",
            label: math(`<msqrt>${n(value ** 2)}</msqrt>`),
            type: "number",
            answer: String(value),
            points: 1,
          },
        ],
        hints: [
          "Se nøje på, om minustegnet står inde i eller uden for parentesen.",
          `I første udtryk ganges ${math(n(-value))} med sig selv. I det andet beregnes potensen før minustegnet.`,
          `Kvadratroden er det ikke-negative tal, hvis kvadrat er ${math(n(value ** 2))}.`,
        ],
        solution: `<ol><li>${math(`${power(n(-value), 2)}<mo>=</mo>${parentheses(n(-value))}<mo>·</mo>${parentheses(n(-value))}<mo>=</mo>${n(value ** 2)}`)}.</li><li>${math(`<mo>−</mo>${power(n(value), 2)}<mo>=</mo>${n(-(value ** 2))}`)}, fordi potensen beregnes før minustegnet.</li><li>${math(`<msqrt>${n(value ** 2)}</msqrt><mo>=</mo>${n(value)}`)}. Kontrol: ${math(`${power(n(value), 2)}<mo>=</mo>${n(value ** 2)}`)}.</li></ol>`,
        errors: [
          {
            part: "parenthesized-square",
            answer: String(-(value ** 2)),
            feedback:
              "Hele det negative tal står i parentes og ganges med sig selv, så resultatet er positivt.",
          },
          {
            part: "parenthesized-square",
            feedback:
              "Skriv potensen som to ens faktorer, og brug reglen for produktet af to negative tal.",
          },
          {
            part: "negative-square",
            answer: String(value ** 2),
            feedback:
              "Uden parentes hører minustegnet ikke med til potensens grundtal; beregn potensen først.",
          },
          {
            part: "negative-square",
            feedback:
              "Følg regnerækkefølgen: potensen beregnes før det foranstillede minustegn.",
          },
          {
            part: "root",
            answer: String(-value),
            feedback:
              "Kvadratrodstegnet alene betegner den ikke-negative kvadratrod.",
          },
          {
            part: "root",
            feedback:
              "Find det ikke-negative tal, der ganget med sig selv giver tallet under rodtegnet.",
          },
        ],
        parameters: { value },
      };
    },
  },
  {
    ...base,
    id: "quad.recognize",
    goals: ["quad.recognize"],
    difficulty: 1,
    size: "short",
    minutes: 2,
    prompt:
      "<p>Vælg det udsagn, hvor den højeste eksponent på den ukendte er to, og hvor leddet med denne eksponent ikke forsvinder.</p>",
    parts: [
      {
        id: "choice",
        label: "Vælg ét udsagn",
        type: "choice",
        answer: "second",
        points: 2,
        options: [
          { id: "linear", label: equation(linearBody(4, 2)) },
          {
            id: "second",
            label: equation(polynomialBody(3, -1, -7)),
          },
          {
            id: "third",
            label: equation(`${power(x, 3)}<mo>+</mo>${n(1)}`),
          },
        ],
      },
    ],
    hints: [
      "Se kun på eksponenterne først.",
      "Den højeste eksponent skal være præcis to; en eksponent på tre er for høj.",
    ],
    solution: `<p>I ${equation(polynomialBody(3, -1, -7))} er den højeste eksponent ${math(n(2))}, og tallet foran ${math(power(x, 2))} er ${math(n(3))}, som ikke er nul. Derfor er det det korrekte valg.</p>`,
    errors: [
      {
        part: "choice",
        answer: "linear",
        feedback:
          "Det valgte udsagn har kun første potens af den ukendte. Se efter et led med eksponent to.",
      },
      {
        part: "choice",
        answer: "third",
        feedback:
          "Det valgte udsagn har tredje potens som den højeste. Den ønskede højeste eksponent er to.",
      },
      {
        part: "choice",
        feedback: "Sammenlign den højeste eksponent i hvert udsagn.",
      },
    ],
  },
  {
    id: "quad.standard",
    version: 1,
    generate(random) {
      const a = nonZeroInteger(random, -4, 4);
      const canonicalB = nonZeroInteger(random, -8, 8);
      const canonicalC = nonZeroInteger(random, -9, 9);
      const rightB = nonZeroInteger(random, -4, 4);
      const rightC = nonZeroInteger(random, -6, 6);
      const leftB = canonicalB + rightB;
      const leftC = canonicalC + rightC;
      return {
        ...base,
        id: "quad.standard",
        goals: ["quad.standard"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: `<p>Skriv venstresiden som ét udtryk, når højresiden skal være ${math(n(0))}: ${equation(polynomialBody(a, leftB, leftC), linearBody(rightB, rightC))}.</p>`,
        parts: [
          {
            id: "expression",
            label: "Venstresiden",
            type: "expression",
            answer: `${a}*x^2+${canonicalB}*x+${canonicalC}`,
            points: 3,
          },
        ],
        hints: [
          "Udfør den samme ændring på begge sider, indtil højresiden er nul.",
          `Træk hele højresiden fra på begge sider. Vær især opmærksom på fortegnet foran ${math(linearBody(rightB, rightC))}.`,
          `Saml derefter led med ${math(power(x, 2))}, led med ${math(x)} og konstante led hver for sig.`,
        ],
        solution: `<ol><li>Træk højresiden fra på begge sider: ${equation(`${polynomialBody(a, leftB, leftC)}<mo>−</mo>${parentheses(linearBody(rightB, rightC))}`)}.</li><li>Saml ens led: ${equation(polynomialBody(a, canonicalB, canonicalC))}.</li><li>Kontrol: flyttes ${math(linearBody(rightB, rightC))} tilbage, fås det oprindelige udsagn.</li></ol>`,
        errors: [
          {
            part: "expression",
            answer: `${a}*x^2+${leftB + rightB}*x+${leftC + rightC}`,
            feedback:
              "Højresidens led er lagt til. For at få nul på højre side skal hele højresiden trækkes fra.",
          },
          {
            part: "expression",
            feedback:
              "Flyt hele højresiden med modsat fortegn, og saml derefter ens led.",
          },
        ],
        parameters: {
          a,
          canonicalB,
          canonicalC,
          leftB,
          leftC,
          rightB,
          rightC,
        },
      };
    },
  },
  {
    id: "quad.coefficients",
    version: 1,
    generate(random) {
      const a = nonZeroInteger(random, -5, 5);
      const missing = integer(random, 0, 2);
      let b = nonZeroInteger(random, -8, 8);
      let c = nonZeroInteger(random, -9, 9);
      if (missing === 1) b = 0;
      if (missing === 2) c = 0;
      return {
        ...base,
        id: "quad.coefficients",
        goals: ["quad.coefficients"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: `<p>For udsagnet ${equation(polynomialBody(a, b, c))} skal de tre markerede tal angives.</p>`,
        parts: [
          { id: "a", label: math("<mi>a</mi>"), type: "number", answer: String(a), points: 1 },
          { id: "b", label: math("<mi>b</mi>"), type: "number", answer: String(b), points: 1 },
          { id: "c", label: math("<mi>c</mi>"), type: "number", answer: String(c), points: 1 },
        ],
        hints: [
          "Læs ét led ad gangen, og lad fortegnet følge med tallet.",
          `Sammenlign med ${equation(`<mi>a</mi>${power(x, 2)}<mo>+</mo><mi>b</mi>${x}<mo>+</mo><mi>c</mi>`)}.`,
          "Hvis et led mangler, er tallet foran netop dette led nul.",
        ],
        solution: `<p>Leddene sammenlignes plads for plads. Derfor er ${coefficientsMath(a, b, c)}. ${b === 0 || c === 0 ? "Det manglende led har tallet nul." : "Alle tre led er synlige."}</p>`,
        errors: [
          {
            part: "a",
            answer: String(Math.abs(a)),
            feedback: "Fortegnet foran kvadratleddet er en del af tallet a.",
          },
          {
            part: "a",
            feedback: "Læs tallet foran leddet med anden potens, inklusive fortegnet.",
          },
          {
            part: "b",
            feedback: "Læs tallet foran leddet med første potens; et manglende led giver nul.",
          },
          {
            part: "c",
            feedback: "Det konstante led har intet x; et manglende konstantled giver nul.",
          },
        ],
        parameters: { a, b, c, missing },
      };
    },
  },
  {
    id: "quad.discriminant",
    version: 1,
    generate(random) {
      const a = nonZeroInteger(random, -4, 4);
      const b = nonZeroInteger(random, -9, 9);
      const c = nonZeroInteger(random, -7, 7);
      const d = b ** 2 - 4 * a * c;
      return {
        ...base,
        id: "quad.discriminant",
        goals: ["quad.coefficients", "quad.discriminant"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: `<p>Arbejd med udsagnet ${equation(polynomialBody(a, b, c))}.</p>`,
        parts: [
          { id: "d", label: math("<mi>d</mi>"), type: "number", answer: String(d), points: 2 },
        ],
        hints: [
          "Skriv først de tre tal ned med deres fortegn.",
          `Brug ${math(`<mi>d</mi><mo>=</mo>${power("<mi>b</mi>", 2)}<mo>−</mo>${n(4)}<mi>a</mi><mi>c</mi>`)}.`,
          `Sæt parentes om negative tal, før de opløftes i anden.`,
        ],
        solution: `<ol><li>${coefficientsMath(a, b, c)}.</li><li>${math(discriminantBody(a, b, c, d))}.</li><li>Kontrol: alle tre fortegn fra det oprindelige udsagn indgår i beregningen.</li></ol>`,
        errors: [
          {
            part: "d",
            answer: String(b ** 2 + 4 * a * c),
            feedback:
              "Der er lagt fire a c til. Formlen har et minus foran hele produktet fire a c.",
          },
          {
            part: "d",
            feedback:
              "Kontrollér fortegnene på a, b og c, og sæt negative tal i parentes før kvadrering.",
          },
        ],
        parameters: { a, b, c, d },
      };
    },
  },
  {
    id: "quad.solution-count",
    version: 1,
    generate(random) {
      const kind = integer(random, 0, 2);
      const a = integer(random, 1, 4);
      let b;
      let c;
      let expected;
      if (kind === 0) {
        const [r1, r2] = rootsFromRandom(random);
        b = -a * (r1 + r2);
        c = a * r1 * r2;
        expected = "two";
      } else if (kind === 1) {
        const root = nonZeroInteger(random, -5, 5);
        b = -2 * a * root;
        c = a * root ** 2;
        expected = "one";
      } else {
        const center = nonZeroInteger(random, -4, 4);
        const lift = integer(random, 1, 6);
        b = -2 * a * center;
        c = a * center ** 2 + lift;
        expected = "none";
      }
      const d = b ** 2 - 4 * a * c;
      return {
        ...base,
        id: "quad.solution-count",
        goals: ["quad.discriminant", "quad.classify"],
        difficulty: 2,
        size: "short",
        minutes: 4,
        prompt: `<p>Hvor mange forskellige reelle værdier får udsagnet ${equation(polynomialBody(a, b, c))} til at passe?</p>`,
        parts: [
          {
            id: "count",
            label: "Antal forskellige reelle værdier",
            type: "choice",
            answer: expected,
            options: automaticCountOptions,
            points: 2,
          },
        ],
        hints: [
          "Du behøver ikke finde selve værdierne for at afgøre antallet.",
          `Beregn ${math(`<mi>d</mi><mo>=</mo>${power("<mi>b</mi>", 2)}<mo>−</mo>${n(4)}<mi>a</mi><mi>c</mi>`)}.`,
          "En positiv værdi giver to, nul giver én, og en negativ værdi giver ingen reelle værdier.",
        ],
        solution: `<ol><li>${coefficientsMath(a, b, c)}.</li><li>${math(discriminantBody(a, b, c, d))}.</li><li>${d > 0 ? "Værdien er positiv, så der er to forskellige reelle værdier." : d === 0 ? "Værdien er nul, så de to formelgrene falder sammen til én reel værdi." : "Værdien er negativ, så der findes ingen reel kvadratrod og dermed ingen reelle værdier."}</li></ol>`,
        errors: [
          {
            part: "count",
            feedback:
              "Knyt diskriminantens fortegn til antallet: positiv giver to, nul giver én, negativ giver ingen.",
          },
        ],
        parameters: { a, b, c, d, expected },
      };
    },
  },
  {
    id: "quad.solve-general",
    version: 1,
    generate(random) {
      const a = nonZeroInteger(random, -3, 3);
      const [r1, r2] = rootsFromRandom(random);
      const b = -a * (r1 + r2);
      const c = a * r1 * r2;
      const d = b ** 2 - 4 * a * c;
      return {
        ...base,
        id: "quad.solve-general",
        goals: ["quad.coefficients", "quad.discriminant", "quad.formula", "quad.roots", "quad.check"],
        difficulty: 2,
        size: "medium",
        minutes: 7,
        prompt: `<p>Bestem alle reelle værdier, der får ${equation(polynomialBody(a, b, c))} til at passe.</p>`,
        parts: [
          { id: "d", label: math("<mi>d</mi>"), type: "number", answer: String(d), points: 2 },
          {
            id: "roots",
            label: "Alle reelle værdier",
            type: "set",
            components: ["Første værdi", "Anden værdi"],
            answer: [r1, r2],
            partial: true,
            points: 4,
          },
        ],
        hints: [
          "Sørg først for, at højresiden er nul, og skriv de tre tal ned med fortegn.",
          `Beregn ${math(`<mi>d</mi><mo>=</mo>${power("<mi>b</mi>", 2)}<mo>−</mo>${n(4)}<mi>a</mi><mi>c</mi>`)}.`,
          `Sæt tallene i ${math(`${x}<mo>=</mo><mfrac><mrow><mo>−</mo><mi>b</mi><mo>±</mo><msqrt><mi>d</mi></msqrt></mrow><mrow>${n(2)}<mi>a</mi></mrow></mfrac>`)} og regn én gang med hvert fortegn.`,
        ],
        solution: `<ol><li>${coefficientsMath(a, b, c)}.</li><li>${math(discriminantBody(a, b, c, d))}.</li><li>${math(formulaBody(a, b, d))}, hvilket giver ${math(`${x}<mo>∈</mo><mo>{</mo>${n(r1)}<mo>;</mo>${n(r2)}<mo>}</mo>`)}.</li><li>Kontrol: ${math(substitutionBody(a, b, c, r1))} og ${math(substitutionBody(a, b, c, r2))}.</li></ol>`,
        errors: [
          {
            part: "d",
            feedback:
              "Kontrollér alle fortegn og parentesen omkring b, før du bruger resultatet videre.",
          },
          {
            part: "roots",
            feedback:
              "Regn formelen én gang med minus og én gang med plus, og kontrollér begge værdier ved indsættelse.",
          },
        ],
        parameters: { a, b, c, d, r1, r2 },
      };
    },
  },
  {
    id: "quad.double-root",
    version: 1,
    generate(random) {
      const a = nonZeroInteger(random, -4, 4);
      const root = nonZeroInteger(random, -6, 6);
      const b = -2 * a * root;
      const c = a * root ** 2;
      const d = 0;
      return {
        ...base,
        id: "quad.double-root",
        goals: ["quad.discriminant", "quad.classify", "quad.formula", "quad.check"],
        difficulty: 2,
        size: "medium",
        minutes: 5,
        prompt: `<p>Bestem alle reelle værdier, der får ${equation(polynomialBody(a, b, c))} til at passe.</p>`,
        parts: [
          { id: "d", label: math("<mi>d</mi>"), type: "number", answer: "0", points: 2 },
          { id: "root", label: "Den reelle værdi", type: "number", answer: String(root), points: 3 },
        ],
        hints: [
          "Beregn først den størrelse, som står under kvadratroden i formlen.",
          "Når denne størrelse er nul, giver plus- og minusgrenen samme værdi.",
          `Kvadratrodsleddet forsvinder, så beregn ${math(`<mfrac><mrow><mo>−</mo><mi>b</mi></mrow><mrow>${n(2)}<mi>a</mi></mrow></mfrac>`)}.`,
        ],
        solution: `<ol><li>${coefficientsMath(a, b, c)}.</li><li>${math(discriminantBody(a, b, c, d))}.</li><li>Da værdien er nul, fås ${math(`${x}<mo>=</mo><mfrac><mrow><mo>−</mo>${parentheses(n(b))}</mrow><mrow>${n(2)}<mo>·</mo>${parentheses(n(a))}</mrow></mfrac><mo>=</mo>${n(root)}`)}.</li><li>Kontrol: ${math(substitutionBody(a, b, c, root))}.</li></ol>`,
        errors: [
          {
            part: "d",
            feedback:
              "Sæt negative tal i parentes og kontrollér, at hele produktet fire a c trækkes fra.",
          },
          {
            part: "root",
            feedback:
              "Når diskriminanten er nul, er der kun én forskellig reel værdi; brug minus b divideret med to a.",
          },
        ],
        parameters: { a, b, c, d, root },
      };
    },
  },
  {
    id: "quad.no-real",
    version: 1,
    generate(random) {
      const a = integer(random, 1, 4);
      const center = nonZeroInteger(random, -5, 5);
      const lift = integer(random, 1, 7);
      const b = -2 * a * center;
      const c = a * center ** 2 + lift;
      const d = -4 * a * lift;
      return {
        ...base,
        id: "quad.no-real",
        goals: ["quad.discriminant", "quad.classify", "quad.roots"],
        difficulty: 2,
        size: "short",
        minutes: 4,
        prompt: `<p>Hvor mange reelle værdier får ${equation(polynomialBody(a, b, c))} til at passe?</p>`,
        parts: [
          { id: "d", label: math("<mi>d</mi>"), type: "number", answer: String(d), points: 2 },
          {
            id: "count",
            label: "Antal reelle værdier",
            type: "choice",
            answer: "none",
            options: automaticCountOptions,
            points: 2,
          },
        ],
        hints: [
          "Find først fortegnet på værdien under kvadratroden.",
          `Beregn ${math(`<mi>d</mi><mo>=</mo>${power("<mi>b</mi>", 2)}<mo>−</mo>${n(4)}<mi>a</mi><mi>c</mi>`)}.`,
          "Et negativt tal har ingen reel kvadratrod.",
        ],
        solution: `<ol><li>${coefficientsMath(a, b, c)}.</li><li>${math(discriminantBody(a, b, c, d))}.</li><li>Resultatet er negativt, så ingen reelle værdier kan indsættes. Kontrol: udtrykket kan skrives som et positivt multiplum af et kvadrat plus ${math(n(lift))}, så det kan ikke blive nul.</li></ol>`,
        errors: [
          {
            part: "d",
            feedback:
              "Kontrollér minustegnet foran fire a c og parentesen omkring b.",
          },
          {
            part: "count",
            feedback:
              "En negativ diskriminant betyder, at kvadratroden ikke er reel, så der er ingen reelle værdier.",
          },
        ],
        parameters: { a, b, c, d, center, lift },
      };
    },
  },
  {
    id: "quad.missing-linear",
    version: 1,
    generate(random) {
      const a = integer(random, 1, 4);
      const root = integer(random, 2, 7);
      const b = 0;
      const c = -a * root ** 2;
      const d = 4 * a ** 2 * root ** 2;
      return {
        ...base,
        id: "quad.missing-linear",
        goals: ["quad.coefficients", "quad.formula", "quad.roots", "quad.check"],
        difficulty: 1,
        size: "medium",
        minutes: 5,
        prompt: `<p>Bestem alle reelle værdier, der får ${equation(polynomialBody(a, b, c))} til at passe.</p>`,
        parts: [
          { id: "b", label: math("<mi>b</mi>"), type: "number", answer: "0", points: 1 },
          {
            id: "roots",
            label: "Alle reelle værdier",
            type: "set",
            components: ["Første værdi", "Anden værdi"],
            answer: [-root, root],
            partial: true,
            points: 4,
          },
        ],
        hints: [
          "Et manglende led har tallet nul foran sig.",
          `Isolér gerne ${math(power(x, 2))}, eller brug den almindelige formel med ${math("<mi>b</mi><mo>=</mo><mn>0</mn>")}.`,
          "Når et positivt kvadrat er kendt, skal både den negative og den positive rod med.",
        ],
        solution: `<ol><li>Det manglende led med første potens giver ${math("<mi>b</mi><mo>=</mo><mn>0</mn>")}.</li><li>${equation(`${n(a)}${power(x, 2)}`, n(a * root ** 2))}, så ${equation(power(x, 2), n(root ** 2))}.</li><li>Dermed ${math(`${x}<mo>∈</mo><mo>{</mo>${n(-root)}<mo>;</mo>${n(root)}<mo>}</mo>`)}.</li><li>Kontrol: begge kvadrater er ${math(n(root ** 2))}.</li></ol>`,
        errors: [
          {
            part: "b",
            answer: String(c),
            feedback:
              "Konstantleddet er blevet læst som b. Det manglende led med første potens giver b lig nul.",
          },
          {
            part: "b",
            feedback: "Det manglende led med første potens har koefficienten nul.",
          },
          {
            part: "roots",
            feedback:
              "Når et positivt tal har et kvadrat, findes både en negativ og en positiv reel værdi.",
          },
        ],
        parameters: { a, b, c, d, root },
      };
    },
  },
  {
    id: "quad.missing-constant",
    version: 1,
    generate(random) {
      const a = nonZeroInteger(random, -4, 4);
      const nonZeroRoot = nonZeroInteger(random, -7, 7);
      const b = -a * nonZeroRoot;
      const c = 0;
      return {
        ...base,
        id: "quad.missing-constant",
        goals: ["quad.coefficients", "quad.roots", "quad.check"],
        difficulty: 1,
        size: "medium",
        minutes: 4,
        prompt: `<p>Bestem alle reelle værdier, der får ${equation(polynomialBody(a, b, c))} til at passe.</p>`,
        parts: [
          { id: "c", label: math("<mi>c</mi>"), type: "number", answer: "0", points: 1 },
          {
            id: "roots",
            label: "Alle reelle værdier",
            type: "set",
            components: ["Første værdi", "Anden værdi"],
            answer: [0, nonZeroRoot],
            partial: true,
            points: 4,
          },
        ],
        hints: [
          "Et manglende konstantled har værdien nul.",
          `Begge synlige led indeholder ${math(x)}, så en fælles faktor kan tages udenfor.`,
          "Et produkt er nul, når mindst én af faktorerne er nul.",
        ],
        solution: `<ol><li>Det manglende konstantled giver ${math("<mi>c</mi><mo>=</mo><mn>0</mn>")}.</li><li>Tag ${math(x)} udenfor: ${equation(`${x}${parentheses(linearBody(a, b))}`)}.</li><li>Faktorerne giver ${equation(x)} eller ${equation(linearBody(a, b))}. Derfor ${math(`${x}<mo>∈</mo><mo>{</mo>${n(0)}<mo>;</mo>${n(nonZeroRoot)}<mo>}</mo>`)}.</li><li>Kontrol: begge værdier gør produktet nul.</li></ol>`,
        errors: [
          {
            part: "c",
            feedback: "Der står intet konstantled, så c er nul.",
          },
          {
            part: "roots",
            feedback:
              "Husk løsningen nul. Når x er fælles faktor, giver hver faktor en mulig løsning.",
          },
        ],
        parameters: { a, b, c, nonZeroRoot },
      };
    },
  },
  {
    id: "quad.both-sides",
    version: 1,
    generate(random) {
      const a = integer(random, 1, 3);
      const [r1, r2] = rootsFromRandom(random);
      const canonicalB = -a * (r1 + r2);
      const canonicalC = a * r1 * r2;
      const rightB = nonZeroInteger(random, -4, 4);
      const leftB = canonicalB + rightB;
      const rightC = -canonicalC;
      const d = canonicalB ** 2 - 4 * a * canonicalC;
      return {
        ...base,
        id: "quad.both-sides",
        goals: ["quad.standard", "quad.coefficients", "quad.formula", "quad.check"],
        difficulty: 3,
        size: "complex",
        minutes: 9,
        prompt: `<p>Bestem alle reelle værdier, der får ${equation(polynomialBody(a, leftB, 0), linearBody(rightB, rightC))} til at passe.</p>`,
        parts: [
          { id: "a", label: math("<mi>a</mi>"), type: "number", answer: String(a), points: 1 },
          { id: "b", label: math("<mi>b</mi>"), type: "number", answer: String(canonicalB), points: 1 },
          { id: "c", label: math("<mi>c</mi>"), type: "number", answer: String(canonicalC), points: 1 },
          {
            id: "roots",
            label: "Alle reelle værdier",
            type: "set",
            components: ["Første værdi", "Anden værdi"],
            answer: [r1, r2],
            partial: true,
            points: 4,
          },
        ],
        hints: [
          "Få først nul alene på højre side ved at ændre begge sider ens.",
          `Efter samling skal venstresiden være ${math(polynomialBody(a, canonicalB, canonicalC))}.`,
          "Læs de tre tal med fortegn, og fortsæt derefter med den faste formel.",
        ],
        solution: `<ol><li>Træk hele højresiden fra: ${equation(polynomialBody(a, canonicalB, canonicalC))}.</li><li>${coefficientsMath(a, canonicalB, canonicalC)}.</li><li>${math(discriminantBody(a, canonicalB, canonicalC, d))}.</li><li>${math(formulaBody(a, canonicalB, d))}, så ${math(`${x}<mo>∈</mo><mo>{</mo>${n(r1)}<mo>;</mo>${n(r2)}<mo>}</mo>`)}.</li><li>Kontrol: indsættelse af hver værdi giver samme tal på de to oprindelige sider.</li></ol>`,
        errors: [
          { part: "a", feedback: "Kvadratleddet ændres ikke af leddene på højre side." },
          { part: "b", feedback: "Flyt højresidens led med første potens med modsat fortegn." },
          { part: "c", feedback: "Når højresidens konstant flyttes, skifter den fortegn." },
          {
            part: "roots",
            feedback:
              "Brug først tallene fra den samlede form, og kontrollér begge resultater i det oprindelige udsagn.",
          },
        ],
        parameters: { a, canonicalB, canonicalC, leftB, rightB, rightC, d, r1, r2 },
      };
    },
  },
  {
    id: "quad.verify",
    version: 1,
    generate(random) {
      const a = integer(random, 1, 4);
      const [r1, r2] = rootsFromRandom(random);
      const b = -a * (r1 + r2);
      const c = a * r1 * r2;
      let distractor = nonZeroInteger(random, -8, 8);
      while (distractor === r1 || distractor === r2)
        distractor = nonZeroInteger(random, -8, 8);
      const showFirst = random() < 0.5;
      const candidateOne = showFirst ? r1 : distractor;
      const candidateTwo = r2;
      const answer = showFirst ? "both" : "second";
      return {
        ...base,
        id: "quad.verify",
        goals: ["quad.check"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: `<p>Hvilke af værdierne ${math(`${n(candidateOne)}<mo>;</mo>${n(candidateTwo)}`)} får ${equation(polynomialBody(a, b, c))} til at passe?</p>`,
        parts: [
          {
            id: "choice",
            label: "Vælg resultatet af kontrollen",
            type: "choice",
            answer,
            points: 2,
            options: [
              { id: "first", label: `Kun ${math(n(candidateOne))}` },
              { id: "second", label: `Kun ${math(n(candidateTwo))}` },
              { id: "both", label: "Begge værdier" },
              { id: "none", label: "Ingen af værdierne" },
            ],
          },
        ],
        hints: [
          "Kontrollér værdierne én ad gangen.",
          `Erstat hver forekomst af ${math(x)} med den første værdi, regn venstresiden ud, og gentag med den anden.`,
        ],
        solution: `<ol><li>For ${math(`${x}<mo>=</mo>${n(candidateOne)}`)} bliver venstresiden ${math(n(a * candidateOne ** 2 + b * candidateOne + c))}.</li><li>For ${math(`${x}<mo>=</mo>${n(candidateTwo)}`)} bliver venstresiden ${math(n(a * candidateTwo ** 2 + b * candidateTwo + c))}.</li><li>En værdi er kun en løsning, når resultatet er ${math(n(0))}. Derfor er svaret ${showFirst ? "begge værdier" : `kun ${math(n(candidateTwo))}`}.</li></ol>`,
        errors: [
          {
            part: "choice",
            feedback:
              "Indsæt hver værdi i alle tre led. En værdi tæller kun, hvis hele venstresiden bliver nul.",
          },
        ],
        parameters: { a, b, c, r1, r2, distractor, candidateOne, candidateTwo, answer },
      };
    },
  },
  {
    ...base,
    id: "quad.sign-analysis",
    goals: ["quad.coefficients", "quad.discriminant"],
    difficulty: 2,
    size: "medium",
    minutes: 4,
    prompt: `<p>En elev arbejder med ${equation(polynomialBody(2, -6, 4))} og skriver:</p><ol><li>${coefficientsMath(2, -6, 4)}</li><li>${math(`<mi>d</mi><mo>=</mo><mo>−</mo>${power(n(6), 2)}<mo>−</mo>${n(4)}<mo>·</mo>${n(2)}<mo>·</mo>${n(4)}`)}</li><li>${math(`<mi>d</mi><mo>=</mo>${n(-68)}`)}</li></ol><p>Vælg den første linje, der ikke følger korrekt.</p>`,
    parts: [
      {
        id: "line",
        label: "Første forkerte linje",
        type: "choice",
        answer: "2",
        points: 3,
        options: [
          { id: "1", label: "Linje 1" },
          { id: "2", label: "Linje 2" },
          { id: "3", label: "Linje 3" },
          { id: "none", label: "Ingen af linjerne" },
        ],
      },
    ],
    hints: [
      "Kontrollér først, om de tre tal er læst med deres fortegn.",
      `Når ${math("<mi>b</mi><mo>=</mo><mo>−</mo><mn>6</mn>")}, skal hele det negative tal sættes i anden.`,
      `${math(power(n(-6), 2))} er positivt.`,
    ],
    solution: `<ol><li>Linje 1 er korrekt.</li><li>I linje 2 mangler parentesen om ${math(n(-6))}. Det korrekte trin er ${math(`<mi>d</mi><mo>=</mo>${power(n(-6), 2)}<mo>−</mo>${n(4)}<mo>·</mo>${n(2)}<mo>·</mo>${n(4)}`)}.</li><li>Dermed er ${math("<mi>d</mi><mo>=</mo><mn>4</mn>")}. Den første fejl er altså linje 2.</li></ol>`,
    errors: [
      {
        part: "line",
        answer: "3",
        feedback:
          "Linje 3 viderefører allerede fejlen. Find den første linje, hvor det negative b ikke kvadreres som et helt tal.",
      },
      {
        part: "line",
        feedback:
          "Læs linjerne i rækkefølge, og kontrollér især parentesen omkring et negativt tal i anden.",
      },
    ],
  },
];
