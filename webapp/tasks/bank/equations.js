import { math, n, x } from "../math.js";

const base = {
  version: 1,
  topic: "equations",
  module: "eq.basic",
  prerequisites: [],
  aids: false,
};

const integer = (random, minimum, maximum) =>
  minimum + Math.floor(random() * (maximum - minimum + 1));

const nonZeroInteger = (random, minimum, maximum) => {
  let value = 0;
  while (value === 0) value = integer(random, minimum, maximum);
  return value;
};

const xTerm = (coefficient) => {
  if (coefficient === 1) return x;
  if (coefficient === -1) return `<mo>−</mo>${x}`;
  return `${n(coefficient)}${x}`;
};

const signedNumber = (value) => {
  if (value === 0) return "";
  return `<mo>${value < 0 ? "−" : "+"}</mo>${n(Math.abs(value))}`;
};

const signedX = (coefficient) => {
  if (coefficient === 0) return "";
  const magnitude = Math.abs(coefficient);
  return `<mo>${coefficient < 0 ? "−" : "+"}</mo>${magnitude === 1 ? "" : n(magnitude)}${x}`;
};

const linear = (coefficient, constant = 0) =>
  `${xTerm(coefficient)}${signedNumber(constant)}`;

const constantFirst = (constant, coefficient) =>
  `${n(constant)}${signedX(coefficient)}`;

const parentheses = (body) => `<mo>(</mo>${body}<mo>)</mo>`;
const equation = (left, right) => math(`${left}<mo>=</mo>${right}`);
const substitutedLinear = (coefficient, root, constant = 0) =>
  `${n(coefficient)}<mo>·</mo>${root < 0 ? parentheses(n(root)) : n(root)}${signedNumber(constant)}`;

const inverseInstruction = (constant) =>
  constant > 0
    ? `Træk ${math(n(constant))} fra på begge sider.`
    : `Læg ${math(n(Math.abs(constant)))} til på begge sider.`;

const fraction = (numerator, denominator) => {
  const divisor = Math.abs(numerator) % 2 === 0 && denominator === 2 ? 2 : 1;
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  return {
    answer:
      reducedDenominator === 1
        ? String(reducedNumerator)
        : `${reducedNumerator}/${reducedDenominator}`,
    math:
      reducedDenominator === 1
        ? n(reducedNumerator)
        : `<mfrac><mrow>${n(reducedNumerator)}</mrow><mrow>${n(reducedDenominator)}</mrow></mfrac>`,
    value: reducedNumerator / reducedDenominator,
  };
};

export const equationTasks = [
  {
    id: "eq.inverse-addition",
    version: 1,
    generate(random) {
      const root = nonZeroInteger(random, -7, 9);
      const b = nonZeroInteger(random, -9, 9);
      const c = root + b;
      return {
        ...base,
        id: "eq.inverse-addition",
        goals: ["eq.balance", "eq.inverse", "eq.isolate", "eq.check"],
        difficulty: 1,
        size: "short",
        minutes: 2,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(linear(1, b), n(c))}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: String(root),
            points: 1,
          },
        ],
        hints: [
          "Tænk på lighedstegnet som en balance: den samme ændring skal ske på begge sider.",
          inverseInstruction(b),
        ],
        solution: `<ol><li>${inverseInstruction(b)}</li><li>Dermed fås ${equation(x, n(root))}.</li><li>Kontrol: ${equation(`${n(root)}${signedNumber(b)}`, n(c))}.</li></ol>`,
        errors: [
          {
            part: "x",
            answer: String(c + b),
            feedback:
              "Konstantleddet er brugt med samme fortegn. Brug den modsatte regneart på begge sider.",
          },
          {
            part: "x",
            feedback:
              "Udfør den samme modsatte regneart på begge sider, og kontrollér resultatet ved indsættelse.",
          },
        ],
        parameters: { root, b, c },
      };
    },
  },
  {
    id: "eq.inverse-scaling",
    version: 1,
    generate(random) {
      const a = integer(random, 2, 9);
      const root = nonZeroInteger(random, -7, 8);
      const c = a * root;
      return {
        ...base,
        id: "eq.inverse-scaling",
        goals: ["eq.balance", "eq.inverse", "eq.isolate", "eq.check"],
        difficulty: 1,
        size: "short",
        minutes: 2,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(xTerm(a), n(c))}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: String(root),
            points: 1,
          },
        ],
        hints: [
          "Find den regneart, der ophæver tallet foran den ukendte.",
          `Divider begge sider med ${math(n(a))}.`,
        ],
        solution: `<ol><li>Divider begge sider med ${math(n(a))}: ${math(`${x}<mo>=</mo><mfrac><mrow>${n(c)}</mrow><mrow>${n(a)}</mrow></mfrac>`)}.</li><li>Dermed er ${equation(x, n(root))}.</li><li>Kontrol: ${equation(`${n(a)}<mo>·</mo>${n(root)}`, n(c))}.</li></ol>`,
        errors: [
          {
            part: "x",
            answer: String(c),
            feedback:
              "Højresiden er kopieret direkte. Divider begge sider med koefficienten foran den ukendte.",
          },
          {
            part: "x",
            feedback:
              "Ophæv multiplikationen ved at dividere begge sider med det samme tal.",
          },
        ],
        parameters: { a, root, c },
      };
    },
  },
  {
    id: "eq.both-sides",
    version: 1,
    generate(random) {
      let a;
      let c;
      do {
        a = integer(random, 2, 8);
        c = integer(random, 1, 7);
      } while (Math.abs(a - c) < 2);
      const root = nonZeroInteger(random, -6, 7);
      const b = nonZeroInteger(random, -9, 9);
      const d = (a - c) * root + b;
      const combined = a - c;
      const rightConstant = d - b;
      return {
        ...base,
        id: "eq.both-sides",
        goals: ["eq.balance", "eq.collect", "eq.isolate", "eq.check"],
        difficulty: 2,
        size: "medium",
        minutes: 4,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(linear(a, b), linear(c, d))}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: String(root),
            points: 3,
          },
        ],
        hints: [
          "Flyt først alle led med den ukendte til samme side uden at ændre balancen.",
          `Træk ${math(xTerm(c))} fra på begge sider. Fjern derefter konstantleddet ${math(n(b))}.`,
          `Når du har ${equation(xTerm(combined), n(rightConstant))}, skal begge sider divideres med ${math(n(combined))}.`,
        ],
        solution: `<ol><li>Træk ${math(xTerm(c))} fra på begge sider: ${equation(linear(combined, b), n(d))}.</li><li>${inverseInstruction(b)} Det giver ${equation(xTerm(combined), n(rightConstant))}.</li><li>Divider med ${math(n(combined))}: ${equation(x, n(root))}.</li><li>Kontrol: venstre side giver ${math(`${substitutedLinear(a, root, b)}<mo>=</mo>${n(a * root + b)}`)}, og højre side giver ${math(`${substitutedLinear(c, root, d)}<mo>=</mo>${n(c * root + d)}`)}.</li></ol>`,
        errors: [
          {
            part: "x",
            answer: String(rightConstant),
            feedback:
              "Konstantleddet er fjernet korrekt, men koefficienten foran den ukendte skal også divideres væk.",
          },
          {
            part: "x",
            feedback:
              "Saml først de ukendte led på én side og tallene på den anden. Kontrollér fortegn ved hvert flyt.",
          },
        ],
        parameters: { a, b, c, d, root },
      };
    },
  },
  {
    id: "eq.negative-coefficients",
    version: 1,
    generate(random) {
      const a = -integer(random, 1, 2);
      const c = -integer(random, 4, 6);
      const root = nonZeroInteger(random, -5, 6);
      const b = integer(random, 1, 9);
      const d = (a - c) * root + b;
      const combined = a - c;
      const rightConstant = d - b;
      return {
        ...base,
        id: "eq.negative-coefficients",
        goals: ["eq.signs", "eq.collect", "eq.isolate", "eq.check"],
        difficulty: 2,
        size: "medium",
        minutes: 4,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(linear(a, b), linear(c, d))}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: String(root),
            points: 3,
          },
        ],
        hints: [
          "Skriv fortegnene tydeligt. Et negativt led fjernes ved at lægge det modsatte led til på begge sider.",
          `Træk ${math(xTerm(c))} fra på begge sider; fordi koefficienten er negativ, svarer det til at lægge ${math(xTerm(Math.abs(c)))} til.`,
          `Fortsæt fra ${equation(linear(combined, b), n(d))}.`,
        ],
        solution: `<ol><li>Fjern leddet ${math(xTerm(c))} fra begge sider: ${equation(linear(combined, b), n(d))}.</li><li>Træk ${math(n(b))} fra på begge sider: ${equation(xTerm(combined), n(rightConstant))}.</li><li>Divider med ${math(n(combined))}: ${equation(x, n(root))}.</li><li>Kontrol: ${math(`${substitutedLinear(a, root, b)}<mo>=</mo>${n(a * root + b)}`)} og ${math(`${substitutedLinear(c, root, d)}<mo>=</mo>${n(c * root + d)}`)}.</li></ol>`,
        errors: [
          {
            part: "x",
            answer: String((d - b) / (a + c)),
            feedback:
              "De negative koefficienter er lagt sammen i stedet for at blive trukket fra hinanden. Skriv handlingen på begge sider før du reducerer.",
          },
          {
            part: "x",
            feedback:
              "Bevar hvert minusfortegn, og kontrollér den reducerede koefficient, før du dividerer.",
          },
        ],
        parameters: { a, b, c, d, root },
      };
    },
  },
  {
    id: "eq.parentheses-one-side",
    version: 1,
    generate(random) {
      const p = integer(random, 2, 5);
      const a = integer(random, 1, 4);
      const b = nonZeroInteger(random, -5, 5);
      let c = integer(random, 1, 8);
      while (c === p * a) c = integer(random, 1, 8);
      const root = nonZeroInteger(random, -5, 6);
      const d = p * (a * root + b) - c * root;
      const expandedCoefficient = p * a;
      const expandedConstant = p * b;
      const combined = expandedCoefficient - c;
      const rightConstant = d - expandedConstant;
      return {
        ...base,
        id: "eq.parentheses-one-side",
        goals: ["eq.parentheses", "eq.collect", "eq.isolate", "eq.check"],
        difficulty: 2,
        size: "medium",
        minutes: 5,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(`${n(p)}${parentheses(linear(a, b))}`, linear(c, d))}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: String(root),
            points: 4,
          },
        ],
        hints: [
          "Begynd med at omskrive udtrykket i parentesen uden at ændre højresiden.",
          `Gang ${math(n(p))} med begge led inde i parentesen.`,
          `Efter omskrivningen står der ${equation(linear(expandedCoefficient, expandedConstant), linear(c, d))}.`,
        ],
        solution: `<ol><li>Gang ind i hele parentesen: ${equation(linear(expandedCoefficient, expandedConstant), linear(c, d))}.</li><li>Saml de ukendte led: ${equation(linear(combined, expandedConstant), n(d))}.</li><li>Fjern konstantleddet: ${equation(xTerm(combined), n(rightConstant))}.</li><li>Divider med ${math(n(combined))}: ${equation(x, n(root))}.</li><li>Kontrol: venstre side giver ${math(`${n(p)}<mo>·</mo>${parentheses(substitutedLinear(a, root, b))}<mo>=</mo>${n(p * (a * root + b))}`)}, og højre side giver ${math(`${substitutedLinear(c, root, d)}<mo>=</mo>${n(c * root + d)}`)}.</li></ol>`,
        errors: [
          {
            part: "x",
            feedback:
              "Kontrollér først, at tallet foran parentesen er ganget med begge led. Saml derefter de ukendte led.",
          },
        ],
        parameters: { p, a, b, c, d, root },
      };
    },
  },
  {
    id: "eq.parentheses-both-sides",
    version: 1,
    generate(random) {
      let p;
      let q;
      let a;
      let b;
      let c;
      let d;
      let root;
      let attempts = 0;
      do {
        p = integer(random, 2, 4);
        q = integer(random, 2, 5);
        a = integer(random, 1, 6);
        b = nonZeroInteger(random, -4, 4);
        d = nonZeroInteger(random, -3, 3);
        root = nonZeroInteger(random, -4, 4);
        const numerator = p * (a + b * root) - q * d * root;
        c = numerator / q;
        attempts++;
      } while (
        attempts < 80 &&
        (!Number.isInteger(c) || Math.abs(c) > 12 || p * b === q * d)
      );
      if (!Number.isInteger(c) || Math.abs(c) > 12 || p * b === q * d) {
        [p, q, a, b, c, d, root] = [3, 4, 2, -3, 4, -1, -2];
      }
      const leftCoefficient = p * b;
      const leftConstant = p * a;
      const rightCoefficient = q * d;
      const rightConstant = q * c;
      const combined = leftCoefficient - rightCoefficient;
      const constantDifference = rightConstant - leftConstant;
      return {
        ...base,
        id: "eq.parentheses-both-sides",
        goals: ["eq.parentheses", "eq.signs", "eq.collect", "eq.check"],
        difficulty: 3,
        size: "complex",
        minutes: 7,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(`${n(p)}${parentheses(constantFirst(a, b))}`, `${n(q)}${parentheses(constantFirst(c, d))}`)}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: String(root),
            points: 5,
          },
        ],
        hints: [
          "Omskriv begge sider, før du samler led. Vær særlig opmærksom på negative led.",
          `Venstre side bliver ${math(linear(leftCoefficient, leftConstant))}, og højre side bliver ${math(linear(rightCoefficient, rightConstant))}.`,
          `Når de ukendte led og konstanterne er samlet, fås ${equation(xTerm(combined), n(constantDifference))}.`,
        ],
        solution: `<ol><li>Gang ind i begge parenteser: ${equation(linear(leftCoefficient, leftConstant), linear(rightCoefficient, rightConstant))}.</li><li>Saml de ukendte led på venstre side og tallene på højre: ${equation(xTerm(combined), n(constantDifference))}.</li><li>Divider med ${math(n(combined))}: ${equation(x, n(root))}.</li><li>Kontrol: venstre side giver ${math(`${n(p)}<mo>·</mo>${parentheses(`${n(a)}${signedX(b).replace(x, root < 0 ? parentheses(n(root)) : n(root))}`)}<mo>=</mo>${n(p * (a + b * root))}`)}, og højre side giver ${math(`${n(q)}<mo>·</mo>${parentheses(`${n(c)}${signedX(d).replace(x, root < 0 ? parentheses(n(root)) : n(root))}`)}<mo>=</mo>${n(q * (c + d * root))}`)}.</li></ol>`,
        errors: [
          {
            part: "x",
            feedback:
              "Gang først hvert tal foran en parentes med begge led. Skriv derefter en ny linje, før fortegnene samles.",
          },
        ],
        parameters: { p, q, a, b, c, d, root },
      };
    },
  },
  {
    id: "eq.fractions",
    version: 1,
    generate(random) {
      const b = integer(random, 1, 7);
      const e = integer(random, 2, 8);
      const numerator = 12 * e - 3 * b;
      const root = fraction(numerator, 2);
      const left = `<mfrac><mrow>${n(2)}${x}</mrow><mrow>${n(3)}</mrow></mfrac><mo>+</mo><mfrac><mrow>${n(b)}</mrow><mrow>${n(4)}</mrow></mfrac>`;
      const right = `<mfrac><mrow>${x}</mrow><mrow>${n(2)}</mrow></mfrac><mo>+</mo>${n(e)}`;
      return {
        ...base,
        id: "eq.fractions",
        goals: ["eq.fractions", "eq.collect", "eq.isolate", "eq.check"],
        difficulty: 3,
        size: "complex",
        minutes: 7,
        prompt: `<p>Bestem det tal, der får udsagnet til at passe: ${equation(left, right)}.</p>`,
        parts: [
          {
            id: "x",
            label: "Værdien af <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>",
            type: "number",
            answer: root.answer,
            points: 5,
          },
        ],
        hints: [
          "Find et tal, som alle nævnerne går op i, og bevar balancen.",
          `Gang hvert led på begge sider med ${math(n(12))}.`,
          `Efter omskrivningen står der ${equation(linear(8, 3 * b), linear(6, 12 * e))}.`,
        ],
        solution: `<ol><li>Gang hele udsagnet med ${math(n(12))}: ${equation(linear(8, 3 * b), linear(6, 12 * e))}.</li><li>Træk ${math(xTerm(6))} fra på begge sider: ${equation(linear(2, 3 * b), n(12 * e))}.</li><li>Træk ${math(n(3 * b))} fra: ${equation(xTerm(2), n(numerator))}.</li><li>Divider med ${math(n(2))}: ${math(`${x}<mo>=</mo>${root.math}`)}.</li><li>Kontrol efter multiplikation med ${math(n(12))}: venstre side giver ${math(`${n(8 * root.value)}<mo>+</mo>${n(3 * b)}<mo>=</mo>${n(8 * root.value + 3 * b)}`)}, og højre side giver ${math(`${n(6 * root.value)}<mo>+</mo>${n(12 * e)}<mo>=</mo>${n(6 * root.value + 12 * e)}`)}.</li></ol>`,
        errors: [
          {
            part: "x",
            answer: String(numerator),
            feedback:
              "Nævnerne og konstantleddene er håndteret, men det sidste resultat skal divideres med koefficienten to.",
          },
          {
            part: "x",
            feedback:
              "Gang alle led med det samme fælles multiplum. Kontrollér især at hvert konstantled også bliver ganget.",
          },
        ],
        parameters: { b, e, numerator, root: root.value },
      };
    },
  },
  {
    id: "eq.verify-proposal",
    version: 1,
    generate(random) {
      const a = integer(random, 2, 7);
      const root = nonZeroInteger(random, -6, 8);
      const b = nonZeroInteger(random, -8, 8);
      const c = a * root + b;
      const isCorrect = random() < 0.5;
      const candidate = isCorrect ? root : root + (random() < 0.5 ? -1 : 1);
      const candidateValue = a * candidate + b;
      return {
        ...base,
        id: "eq.verify-proposal",
        goals: ["eq.check", "eq.balance", "eq.isolate"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: `<p>For udsagnet ${equation(linear(a, b), n(c))} foreslås ${equation(x, n(candidate))}. Vurder forslaget, og angiv den værdi, der passer.</p>`,
        parts: [
          {
            id: "verdict",
            label: "Forslaget",
            type: "choice",
            options: [
              { id: "yes", label: "Passer" },
              { id: "no", label: "Passer ikke" },
            ],
            answer: isCorrect ? "yes" : "no",
            points: 1,
          },
          {
            id: "x",
            label: "Den værdi, der passer",
            type: "number",
            answer: String(root),
            points: 2,
          },
        ],
        hints: [
          "Erstat den ukendte med den foreslåede værdi, og beregn begge sider hver for sig.",
          `Med forslaget bliver venstre side ${math(n(candidateValue))}, mens højre side er ${math(n(c))}.`,
        ],
        solution: `<ol><li>Indsæt forslaget: venstre side bliver ${math(`${n(a)}<mo>·</mo>${n(candidate)}${signedNumber(b)}<mo>=</mo>${n(candidateValue)}`)}, mens højre side er ${math(n(c))}. Forslaget ${isCorrect ? "passer derfor" : "passer derfor ikke"}.</li><li>Den korrekte værdi findes ved at bevare balancen: ${equation(x, n(root))}.</li><li>Kontrol: ${equation(`${n(a)}<mo>·</mo>${n(root)}${signedNumber(b)}`, n(c))}.</li></ol>`,
        errors: [
          {
            part: "verdict",
            feedback:
              "Beregn venstre og højre side hver for sig med den foreslåede værdi. De skal være ens.",
          },
          {
            part: "x",
            answer: String(candidate),
            feedback:
              "Den foreslåede værdi er ikke nødvendigvis løsningen. Kontrollér den ved indsættelse, og løs derefter udsagnet.",
          },
          {
            part: "x",
            feedback:
              "Bevar balancen trin for trin, og kontrollér den fundne værdi i det oprindelige udsagn.",
          },
        ],
        parameters: { a, b, c, root, candidate, isCorrect },
      };
    },
  },
  {
    ...base,
    id: "eq.first-error",
    goals: ["eq.balance", "eq.signs", "eq.check"],
    difficulty: 2,
    size: "medium",
    minutes: 4,
    prompt: `<p>En udregning er vist nedenfor. Vælg den første linje, som ikke følger af linjen før.</p><ol><li>${equation(linear(5, -2), linear(2, 7))}</li><li>${equation(linear(3, -2), n(7))}</li><li>${equation(xTerm(3), n(5))}</li><li>${math(`${x}<mo>=</mo><mfrac><mrow>${n(5)}</mrow><mrow>${n(3)}</mrow></mfrac>`)}</li></ol>`,
    parts: [
      {
        id: "line",
        label: "Første ugyldige linje",
        type: "choice",
        options: [
          { id: "2", label: "Linje 2" },
          { id: "3", label: "Linje 3" },
          { id: "4", label: "Linje 4" },
          { id: "none", label: "Ingen af linjerne" },
        ],
        answer: "3",
        points: 3,
      },
    ],
    hints: [
      "Kontrollér én overgang ad gangen i stedet for kun at se på slutresultatet.",
      `Fra linje 2 skal konstantleddet ${math(n(-2))} ophæves med den modsatte regneart på begge sider.`,
    ],
    solution: `<ol><li>Overgangen til linje 2 er gyldig: ${math(xTerm(2))} er trukket fra på begge sider.</li><li>Fra ${equation(linear(3, -2), n(7))} skal der lægges ${math(n(2))} til på begge sider. Det giver ${equation(xTerm(3), n(9))}, ikke ${equation(xTerm(3), n(5))}.</li><li>Linje 3 er derfor den første ugyldige linje. Den korrekte afslutning er ${equation(x, n(3))}.</li></ol>`,
    errors: [
      {
        part: "line",
        answer: "2",
        feedback:
          "Linje 2 er gyldig, fordi det samme ukendte led er trukket fra på begge sider.",
      },
      {
        part: "line",
        answer: "4",
        feedback:
          "Linje 4 følger faktisk af den forkerte linje 3. Find den første overgang, hvor balancen brydes.",
      },
      {
        part: "line",
        feedback:
          "Sammenlign hver linje med den foregående, og kontrollér at præcis samme handling er udført på begge sider.",
      },
    ],
  },
];
