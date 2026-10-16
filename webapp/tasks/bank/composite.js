import { math, n, power, x } from "../math.js";

const base = {
  version: 1,
  topic: "composite",
  module: "comp.basic",
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

const parentheses = (body) => `<mo>(</mo>${body}<mo>)</mo>`;
const call = (name, argument) =>
  `<mi>${name}</mi><mo>(</mo>${argument}<mo>)</mo>`;
const definition = (name, body) => math(`${call(name, x)}<mo>=</mo>${body}`);

const xTerm = (coefficient) => {
  if (coefficient === 1) return x;
  if (coefficient === -1) return `<mo>−</mo>${x}`;
  return `${n(coefficient)}${x}`;
};

const signedNumber = (value) => {
  if (value === 0) return "";
  return `<mo>${value < 0 ? "−" : "+"}</mo>${n(Math.abs(value))}`;
};

const linear = (coefficient, constant = 0) =>
  `${xTerm(coefficient)}${signedNumber(constant)}`;

const asciiLinear = (coefficient, constant = 0) =>
  `${coefficient}*x${constant < 0 ? "-" : "+"}${Math.abs(constant)}`;

const substituted = (coefficient, input, constant = 0) =>
  `${n(coefficient)}<mo>·</mo>${input < 0 ? parentheses(n(input)) : n(input)}${signedNumber(constant)}`;

const functionTable = (...rows) =>
  `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mtable columnalign="left">${rows
    .map((row) => `<mtr><mtd>${row}</mtd></mtr>`)
    .join("")}</mtable></math>`;

export const compositeTasks = [
  {
    ...base,
    id: "comp.notation",
    goals: ["comp.notation"],
    difficulty: 1,
    size: "short",
    minutes: 2,
    prompt: `<p>Hvilken beskrivelse passer til ${math(call("g", n(3)))}?</p>`,
    parts: [
      {
        id: "meaning",
        label: "Vælg den præcise betydning",
        type: "choice",
        options: [
          {
            id: "input",
            label: `Tallet ${math(n(3))} bruges som input i forskriften for ${math("<mi>g</mi>")}.`,
          },
          {
            id: "multiply",
            label: `${math("<mi>g</mi><mo>·</mo><mn>3</mn>")}`,
          },
          {
            id: "equal",
            label: `${math("<mi>g</mi><mo>=</mo><mn>3</mn>")}`,
          },
        ],
        answer: "input",
        points: 1,
      },
    ],
    hints: [
      "Se på tallet mellem parenteserne som den værdi, der sendes ind i en regel.",
      `Hvis ${math(call("g", x))} er en forskrift med ${math(x)}, skal hvert ${math(x)} erstattes af ${math(n(3))}.`,
    ],
    solution: `<ol><li>Parentesen efter funktionsnavnet viser inputtet.</li><li>${math(call("g", n(3)))} betyder derfor, at ${math(n(3))} indsættes på alle ${math(x)}-pladser i forskriften for ${math("<mi>g</mi>")}.</li><li>Parentesen er hverken et gangetegn eller en ligning.</li></ol>`,
    errors: [
      {
        part: "meaning",
        answer: "multiply",
        feedback:
          "Parentesen efter et funktionsnavn er ikke et gangetegn. Den viser funktionens input.",
      },
      {
        part: "meaning",
        feedback:
          "Læs tallet i parentesen som inputtet, der skal indsættes i funktionens forskrift.",
      },
    ],
  },
  {
    id: "comp.value-linear",
    version: 1,
    generate(random) {
      const coefficient = integer(random, 2, 7);
      const constant = nonZeroInteger(random, -8, 8);
      const input = nonZeroInteger(random, -5, 6);
      const output = coefficient * input + constant;
      return {
        ...base,
        id: "comp.value-linear",
        goals: ["comp.notation", "comp.value"],
        difficulty: 1,
        size: "short",
        minutes: 2,
        prompt: `<p>Der er givet ${definition("f", linear(coefficient, constant))}. Bestem ${math(call("f", n(input)))}.</p>`,
        parts: [
          {
            id: "value",
            label: "Funktionsværdien",
            type: "number",
            answer: String(output),
            points: 2,
          },
        ],
        hints: [
          `Erstat hver ${math(x)}-plads med inputtet ${math(n(input))}.`,
          `Beregn ${math(substituted(coefficient, input, constant))}. Brug parentes om et negativt input.`,
        ],
        solution: `<ol><li>Indsæt inputtet på ${math(x)}-pladsen: ${math(`${call("f", n(input))}<mo>=</mo>${substituted(coefficient, input, constant)}`)}.</li><li>Udfør multiplikationen før addition eller subtraktion: ${math(`${call("f", n(input))}<mo>=</mo>${n(output)}`)}.</li><li>Kontrol: Forskriften modtager præcis inputtet ${math(n(input))}, og beregningen giver ${math(n(output))}.</li></ol>`,
        errors: [
          {
            part: "value",
            answer: String(coefficient * input),
            feedback:
              "Multiplikationen er udført, men konstantleddet i forskriften mangler.",
          },
          {
            part: "value",
            feedback:
              "Indsæt inputtet på alle variabelpladser, behold et eventuelt minus i parentes, og brug regnerækkefølgen.",
          },
        ],
        parameters: { coefficient, constant, input, output },
      };
    },
  },
  {
    id: "comp.value-power",
    version: 1,
    generate(random) {
      const magnitude = integer(random, 2, 6);
      const input = -magnitude;
      const constant = integer(random, 1, 7);
      const output = input ** 2 + constant;
      const signError = -(magnitude ** 2) + constant;
      return {
        ...base,
        id: "comp.value-power",
        goals: ["comp.value"],
        difficulty: 1,
        size: "short",
        minutes: 2,
        prompt: `<p>Der er givet ${definition("h", `${power(x, 2)}<mo>+</mo>${n(constant)}`)}. Bestem ${math(call("h", n(input)))}.</p>`,
        parts: [
          {
            id: "value",
            label: "Funktionsværdien",
            type: "number",
            answer: String(output),
            points: 2,
          },
        ],
        hints: [
          "Et negativt input skal stå i parentes, før potensen beregnes.",
          `Skriv ${math(`${power(n(input), 2)}<mo>+</mo>${n(constant)}`)} og beregn kvadratet først.`,
        ],
        solution: `<ol><li>Erstat ${math(x)} med hele det negative input: ${math(`${call("h", n(input))}<mo>=</mo>${power(n(input), 2)}<mo>+</mo>${n(constant)}`)}.</li><li>Kvadratet er positivt: ${math(`${power(n(input), 2)}<mo>=</mo>${n(magnitude ** 2)}`)}.</li><li>Dermed er ${math(`${call("h", n(input))}<mo>=</mo>${n(output)}`)}.</li><li>Kontrol: Parentesen viser, at potensen gælder hele det negative tal.</li></ol>`,
        errors: [
          {
            part: "value",
            answer: String(signError),
            feedback:
              "Minusset er endt uden for potensen. Sæt hele det negative input i parentes, før du kvadrerer.",
          },
          {
            part: "value",
            feedback:
              "Skriv det negative input i parentes, beregn potensen, og læg derefter konstantleddet til.",
          },
        ],
        parameters: { input, magnitude, constant, output },
      };
    },
  },
  {
    ...base,
    id: "comp.structure",
    goals: ["comp.notation", "comp.structure", "comp.order"],
    difficulty: 1,
    size: "short",
    minutes: 2,
    prompt: `<p>Betragt ${math(call("f", call("g", x)))}. Hvilken funktion modtager ${math(x)} direkte, og hvilken funktion bruges til sidst?</p>`,
    parts: [
      {
        id: "first",
        label: "Funktionen, der modtager inputtet først",
        type: "choice",
        options: [
          { id: "f", label: math("<mi>f</mi>") },
          { id: "g", label: math("<mi>g</mi>") },
        ],
        answer: "g",
        points: 1,
      },
      {
        id: "last",
        label: "Funktionen, der bruges til sidst",
        type: "choice",
        options: [
          { id: "f", label: math("<mi>f</mi>") },
          { id: "g", label: math("<mi>g</mi>") },
        ],
        answer: "f",
        points: 1,
      },
    ],
    hints: [
      `Begynd helt inde ved ${math(x)} og læs parenteserne udad.`,
      `Den lille fisk tættest på ${math(x)} er ${math("<mi>g</mi>")}; dens output sendes videre til ${math("<mi>f</mi>")}.`,
    ],
    solution: `<ol><li>I ${math(call("f", call("g", x)))} står ${math("<mi>g</mi>")} tættest på ${math(x)}. Derfor bruges ${math("<mi>g</mi>")} først.</li><li>Resultatet står derefter som input i ${math("<mi>f</mi>")}. Derfor bruges ${math("<mi>f</mi>")} sidst.</li><li>Kontrol med fiskereglen: Den lille ${math("<mi>g</mi>")}-fisk bliver spist først af den større ${math("<mi>f</mi>")}-fisk.</li></ol>`,
    errors: [
      {
        part: "first",
        feedback:
          "Læs indefra: Funktionen tættest på inputtet modtager værdien først.",
      },
      {
        part: "last",
        feedback:
          "Når den første funktion har leveret sit output, bruges funktionen yderst til sidst.",
      },
    ],
  },
  {
    id: "comp.numeric-chain",
    version: 1,
    generate(random) {
      const outerCoefficient = integer(random, 2, 6);
      const outerConstant = nonZeroInteger(random, -6, 6);
      const innerConstant = integer(random, 0, 5);
      const input = nonZeroInteger(random, -4, 4);
      const innerValue = input ** 2 + innerConstant;
      const output = outerCoefficient * innerValue + outerConstant;
      const parallelError =
        outerCoefficient * input + outerConstant + input ** 2 + innerConstant;
      return {
        ...base,
        id: "comp.numeric-chain",
        goals: ["comp.value", "comp.order"],
        difficulty: 1,
        size: "short",
        minutes: 3,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${linear(outerCoefficient, outerConstant)}`,
          `${call("g", x)}<mo>=</mo>${power(x, 2)}${signedNumber(innerConstant)}`,
        )}<p>Bestem ${math(call("f", call("g", n(input))))}.</p>`,
        parts: [
          {
            id: "value",
            label: "Den efterspurgte værdi",
            type: "number",
            answer: String(output),
            points: 3,
          },
        ],
        hints: [
          "Følg parenteserne indefra. Beregn kun den inderste parentes først.",
          `Begynd med ${math(`${call("g", n(input))}<mo>=</mo>${n(innerValue)}`)}.`,
          `Brug derefter ${math(n(innerValue))} som input i ${math("<mi>f</mi>")}.`,
        ],
        solution: `<ol><li>Den inderste beregning er ${math(`${call("g", n(input))}<mo>=</mo>${power(n(input), 2)}${signedNumber(innerConstant)}<mo>=</mo>${n(innerValue)}`)}.</li><li>Dette output bliver input i den anden funktion: ${math(`${call("f", n(innerValue))}<mo>=</mo>${n(outerCoefficient)}<mo>·</mo>${n(innerValue)}${signedNumber(outerConstant)}`)}.</li><li>Resultatet er ${math(`${call("f", call("g", n(input)))}<mo>=</mo>${n(output)}`)}.</li><li>Kontrol: Inputtet er kun brugt direkte i ${math("<mi>g</mi>")}; derefter bruges mellemresultatet i ${math("<mi>f</mi>")}.</li></ol>`,
        errors: [
          {
            part: "value",
            answer: String(parallelError),
            feedback:
              "De to funktionsværdier er lagt sammen. Brug i stedet outputtet fra den første som input i den næste.",
          },
          {
            part: "value",
            answer: String(innerValue),
            feedback:
              "Den inderste beregning er korrekt, men mellemresultatet skal stadig sættes ind i den yderste funktion.",
          },
          {
            part: "value",
            feedback:
              "Beregn den inderste parentes først, og brug kun dette mellemresultat som nyt input.",
          },
        ],
        parameters: {
          outerCoefficient,
          outerConstant,
          innerConstant,
          input,
          innerValue,
          output,
        },
      };
    },
  },
  {
    id: "comp.reverse-chain",
    version: 1,
    generate(random) {
      const coefficient = integer(random, 2, 5);
      const input = nonZeroInteger(random, -3, 4);
      const innerValue = integer(random, 1, 6);
      const constant = innerValue - coefficient * input;
      const radicandConstant = 2 * innerValue + 1;
      const output = innerValue + 1;
      return {
        ...base,
        id: "comp.reverse-chain",
        goals: ["comp.value", "comp.order"],
        difficulty: 2,
        size: "medium",
        minutes: 4,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${linear(coefficient, constant)}`,
          `${call("g", x)}<mo>=</mo><msqrt><mrow>${power(x, 2)}<mo>+</mo>${n(radicandConstant)}</mrow></msqrt>`,
        )}<p>Bestem ${math(call("g", call("f", n(input))))}.</p>`,
        parts: [
          {
            id: "value",
            label: "Den efterspurgte værdi",
            type: "number",
            answer: String(output),
            points: 3,
          },
        ],
        hints: [
          `Se på den funktion, der står tættest på tallet ${math(n(input))}.`,
          `Beregn først ${math(`${call("f", n(input))}<mo>=</mo>${n(innerValue)}`)}.`,
          `Sæt derefter ${math(n(innerValue))} ind alle steder, hvor der står ${math(x)} i forskriften for ${math("<mi>g</mi>")}.`,
        ],
        solution: `<ol><li>Først beregnes ${math(`${call("f", n(input))}<mo>=</mo>${substituted(coefficient, input, constant)}<mo>=</mo>${n(innerValue)}`)}.</li><li>Brug mellemresultatet som nyt input: ${math(`${call("g", n(innerValue))}<mo>=</mo><msqrt><mrow>${power(n(innerValue), 2)}<mo>+</mo>${n(radicandConstant)}</mrow></msqrt>`)}.</li><li>Under roden står ${math(`${n(innerValue ** 2)}<mo>+</mo>${n(radicandConstant)}<mo>=</mo>${n(output ** 2)}`)}, så resultatet er ${math(n(output))}.</li><li>Kontrol: ${math(`${power(n(output), 2)}<mo>=</mo>${n(output ** 2)}`)}.</li></ol>`,
        errors: [
          {
            part: "value",
            answer: String(innerValue),
            feedback:
              "Den første funktionsværdi er fundet, men den skal stadig bruges som input i den sidste funktion.",
          },
          {
            part: "value",
            feedback:
              "Læs udtrykket indefra, beregn den første funktionsværdi, og indsæt mellemresultatet i den næste forskrift.",
          },
        ],
        parameters: {
          coefficient,
          constant,
          input,
          innerValue,
          radicandConstant,
          output,
        },
      };
    },
  },
  {
    id: "comp.compose",
    version: 2,
    generate(random) {
      const coefficient = integer(random, 2, 5);
      const constant = nonZeroInteger(random, -4, 4);
      const outerConstant = integer(random, 1, 6);
      const answer = `(${asciiLinear(coefficient, constant)})^2+${outerConstant}`;
      const expanded = `${coefficient ** 2}*x^2${2 * coefficient * constant < 0 ? "-" : "+"}${Math.abs(2 * coefficient * constant)}*x+${constant ** 2 + outerConstant}`;
      const missingCrossTerm = `${coefficient ** 2}*x^2+${constant ** 2 + outerConstant}`;
      return {
        ...base,
        id: "comp.compose",
        version: 2,
        goals: ["comp.order", "comp.formula"],
        difficulty: 2,
        size: "medium",
        minutes: 5,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${power(x, 2)}<mo>+</mo>${n(outerConstant)}`,
          `${call("g", x)}<mo>=</mo>${linear(coefficient, constant)}`,
        )}<p>Bestem en forskrift for ${math(call("f", call("g", x)))}.</p>`,
        parts: [
          {
            id: "expr",
            label: "Forskriften",
            type: "expression",
            answer,
            points: 4,
          },
        ],
        hints: [
          "Resultatet fra funktionen tættest på inputtet skal indsættes som et samlet nyt input.",
          `Erstat ${math(x)} i forskriften for ${math("<mi>f</mi>")} med hele ${math(linear(coefficient, constant))}. Behold parentesen.`,
          `Før en eventuel udvidelse står der ${math(`${power(linear(coefficient, constant), 2)}<mo>+</mo>${n(outerConstant)}`)}.`,
        ],
        solution: `<ol><li>Funktionen ${math("<mi>g</mi>")} bruges først og giver ${math(linear(coefficient, constant))}.</li><li>Hele dette udtryk sættes ind på inputpladsen i ${math("<mi>f</mi>")}: ${math(`${call("f", call("g", x))}<mo>=</mo>${power(linear(coefficient, constant), 2)}<mo>+</mo>${n(outerConstant)}`)}.</li><li>Efter udvidelse fås ${math(`${call("f", call("g", x))}<mo>=</mo>${n(coefficient ** 2)}${power(x, 2)}${signedNumber(2 * coefficient * constant)}${x}${signedNumber(constant ** 2 + outerConstant)}`)}. Den parentesbevarede og den udvidede form er ækvivalente.</li><li>Kontrol: Koefficienterne i den udvidede form er ${math(`${n(coefficient ** 2)}<mo>,</mo>${n(2 * coefficient * constant)}<mo>,</mo>${n(constant ** 2 + outerConstant)}`)}.</li></ol>`,
        errors: [
          {
            part: "expr",
            answer: missingCrossTerm,
            feedback:
              "Midterleddet mangler. Når en sum eller forskel kvadreres, skal produktleddet også med.",
          },
          {
            part: "expr",
            feedback:
              "Sæt hele den første forskrift ind på inputpladsen i den næste, og behold parentesen om hele udtrykket.",
          },
        ],
        parameters: {
          coefficient,
          constant,
          outerConstant,
          expanded,
        },
      };
    },
  },
  {
    id: "comp.compare-order",
    version: 1,
    generate(random) {
      const coefficient = integer(random, 2, 5);
      const constant = nonZeroInteger(random, -4, 4);
      const squareConstant = integer(random, 1, 5);
      const fgConstant = coefficient * squareConstant + constant;
      const fg = `${coefficient}*x^2${fgConstant < 0 ? "-" : "+"}${Math.abs(fgConstant)}`;
      const gf = `(${asciiLinear(coefficient, constant)})^2+${squareConstant}`;
      return {
        ...base,
        id: "comp.compare-order",
        goals: ["comp.order", "comp.formula", "comp.compare"],
        difficulty: 2,
        size: "medium",
        minutes: 6,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${linear(coefficient, constant)}`,
          `${call("g", x)}<mo>=</mo>${power(x, 2)}<mo>+</mo>${n(squareConstant)}`,
        )}<p>Bestem begge de angivne forskrifter.</p>`,
        parts: [
          {
            id: "fg",
            label: math(call("f", call("g", x))),
            type: "expression",
            answer: fg,
            points: 3,
          },
          {
            id: "gf",
            label: math(call("g", call("f", x))),
            type: "expression",
            answer: gf,
            points: 3,
          },
        ],
        hints: [
          "Behandl de to udtryk hver for sig; parenteserne bestemmer rækkefølgen.",
          `I det første udtryk skal hele ${math(`${power(x, 2)}<mo>+</mo>${n(squareConstant)}`)} indsættes i den lineære forskrift.`,
          `I det andet udtryk skal hele ${math(linear(coefficient, constant))} kvadreres, før konstantleddet lægges til.`,
        ],
        solution: `<ol><li>For ${math(call("f", call("g", x)))} indsættes ${math(call("g", x))} i ${math("<mi>f</mi>")}: ${math(`${n(coefficient)}${parentheses(`${power(x, 2)}<mo>+</mo>${n(squareConstant)}`)}${signedNumber(constant)}<mo>=</mo>${n(coefficient)}${power(x, 2)}${signedNumber(coefficient * squareConstant + constant)}`)}.</li><li>For ${math(call("g", call("f", x)))} indsættes ${math(call("f", x))} i ${math("<mi>g</mi>")}: ${math(`${power(linear(coefficient, constant), 2)}<mo>+</mo>${n(squareConstant)}`)}.</li><li>Kontrol: De to forskrifter har normalt forskellige koefficienter og er derfor ikke den samme funktion.</li></ol>`,
        errors: [
          {
            part: "fg",
            answer: gf,
            feedback:
              "De to rækkefølger er byttet om. Se hvilken funktion der står yderst i det første udtryk.",
          },
          {
            part: "fg",
            feedback:
              "Indsæt hele den funktion, der står inderst, i inputpladsen for den funktion, der står yderst.",
          },
          {
            part: "gf",
            answer: fg,
            feedback:
              "De to rækkefølger er byttet om. I dette udtryk skal den lineære forskrift bruges først.",
          },
          {
            part: "gf",
            feedback:
              "Behold parentesen om hele den lineære forskrift, når den sættes ind i kvadratet.",
          },
        ],
        parameters: { coefficient, constant, squareConstant },
      };
    },
  },
  {
    id: "comp.domain-cancellation",
    version: 1,
    generate(random) {
      const boundary = integer(random, 1, 8);
      return {
        ...base,
        id: "comp.domain-cancellation",
        goals: ["comp.formula", "comp.domain"],
        difficulty: 2,
        size: "medium",
        minutes: 4,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${power(x, 2)}<mo>+</mo>${n(boundary)}`,
          `${call("g", x)}<mo>=</mo><msqrt><mrow>${x}<mo>−</mo>${n(boundary)}</mrow></msqrt><mo>,</mo><mspace width="0.5em"/>${x}<mo>≥</mo>${n(boundary)}`,
        )}<p>Vælg den fulde beskrivelse af ${math(call("f", call("g", x)))}.</p>`,
        parts: [
          {
            id: "formula",
            label: "Forskrift med betingelse",
            type: "choice",
            options: [
              {
                id: "x-domain",
                label: math(`${x}<mo>,</mo><mspace width="0.4em"/>${x}<mo>≥</mo>${n(boundary)}`),
              },
              { id: "x-all", label: math(x) },
              {
                id: "x-plus",
                label: math(`${x}<mo>+</mo>${n(boundary)}`),
              },
            ],
            answer: "x-domain",
            points: 3,
          },
          {
            id: "minimum",
            label: "Mindste tilladte input",
            type: "number",
            answer: String(boundary),
            points: 1,
          },
        ],
        hints: [
          "Indsæt hele rodudtrykket i kvadratet, men gem betingelsen ved siden af.",
          `Kvadrat og kvadratrod ophæver hinanden på det tilladte område: ${math(`${power(`<msqrt><mrow>${x}<mo>−</mo>${n(boundary)}</mrow></msqrt>`, 2)}<mo>=</mo>${x}<mo>−</mo>${n(boundary)}`)}.`,
          `Læg derefter ${math(n(boundary))} til, og behold kravet fra rodudtrykket.`,
        ],
        solution: `<ol><li>Indsæt den anden forskrift i den første: ${math(`${call("f", call("g", x))}<mo>=</mo>${power(`<msqrt><mrow>${x}<mo>−</mo>${n(boundary)}</mrow></msqrt>`, 2)}<mo>+</mo>${n(boundary)}`)}.</li><li>På det tilladte område forsvinder kvadratet og kvadratroden: ${math(`${x}<mo>−</mo>${n(boundary)}<mo>+</mo>${n(boundary)}<mo>=</mo>${x}`)}.</li><li>Betingelsen ${math(`${x}<mo>≥</mo>${n(boundary)}`)} følger stadig med. Den mindste tilladte inputværdi er derfor ${math(n(boundary))}.</li><li>Kontrol ved grænsen: Rodens indhold er ${math(n(0))}, så grænseværdien er tilladt.</li></ol>`,
        errors: [
          {
            part: "formula",
            answer: "x-all",
            feedback:
              "Selve udtrykket er reduceret korrekt, men definitionsbetingelsen fra kvadratroden skal bevares.",
          },
          {
            part: "formula",
            feedback:
              "Reducer først kvadratet af kvadratroden, og behold samtidig kravet om et ikke-negativt rodindhold.",
          },
          {
            part: "minimum",
            feedback:
              "Sæt rodens indhold større end eller lig nul, og find grænseværdien for inputtet.",
          },
        ],
        parameters: { boundary },
      };
    },
  },
  {
    id: "comp.solve",
    version: 1,
    generate(random) {
      const coefficient = integer(random, 2, 5);
      const center = nonZeroInteger(random, -4, 5);
      const step = integer(random, 1, 4);
      const innerConstant = -coefficient * center;
      const outerConstant = integer(random, 1, 6);
      const level = coefficient * step;
      const target = level ** 2 + outerConstant;
      const roots = [center - step, center + step];
      return {
        ...base,
        id: "comp.solve",
        goals: ["comp.order", "comp.equation"],
        prerequisites: ["eq.basic"],
        difficulty: 3,
        size: "complex",
        minutes: 7,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${power(x, 2)}<mo>+</mo>${n(outerConstant)}`,
          `${call("g", x)}<mo>=</mo>${linear(coefficient, innerConstant)}`,
        )}<p>Find alle reelle værdier af ${math(x)}, der opfylder ${math(`${call("f", call("g", x))}<mo>=</mo>${n(target)}`)}.</p>`,
        parts: [
          {
            id: "levels",
            label: `De mulige værdier af ${math(call("g", x))}`,
            type: "set",
            components: ["Første værdi", "Anden værdi"],
            answer: [-level, level],
            partial: true,
            points: 2,
          },
          {
            id: "roots",
            label: `Alle løsninger for ${math(x)}`,
            type: "set",
            components: ["Første løsning", "Anden løsning"],
            answer: roots,
            partial: true,
            points: 4,
          },
        ],
        hints: [
          "Sæt først den ene forskrift ind i den anden, og fjern derefter konstantleddet omkring kvadratet.",
          `Efter konstantleddet er fjernet, står der ${math(`${power(linear(coefficient, innerConstant), 2)}<mo>=</mo>${n(level ** 2)}`)}. Et kvadrat kan komme fra to modsatte tal.`,
          `Løs derfor både ${math(`${linear(coefficient, innerConstant)}<mo>=</mo>${n(level)}`)} og ${math(`${linear(coefficient, innerConstant)}<mo>=</mo>${n(-level)}`)}.`,
        ],
        solution: `<ol><li>Indsæt forskriften: ${math(`${power(linear(coefficient, innerConstant), 2)}<mo>+</mo>${n(outerConstant)}<mo>=</mo>${n(target)}`)}.</li><li>Træk ${math(n(outerConstant))} fra: ${math(`${power(linear(coefficient, innerConstant), 2)}<mo>=</mo>${n(level ** 2)}`)}.</li><li>Dermed kan ${math(call("g", x))} være både ${math(n(-level))} og ${math(n(level))}.</li><li>De to lineære ligninger giver ${math(`${x}<mo>=</mo>${n(roots[0])}`)} og ${math(`${x}<mo>=</mo>${n(roots[1])}`)}.</li><li>Kontrol: Begge løsninger giver ${math(call("g", x))} lig et tal med størrelse ${math(n(level))}; kvadratet bliver derfor ${math(n(level ** 2))}, og venstresiden bliver ${math(n(target))}.</li></ol>`,
        errors: [
          {
            part: "levels",
            feedback:
              "Når et kvadrat har en positiv værdi, skal både den positive og den negative kvadratrod med.",
          },
          {
            part: "roots",
            feedback:
              "Brug begge mulige mellemresultater og løs de to lineære ligninger hver for sig.",
          },
        ],
        parameters: {
          coefficient,
          center,
          step,
          innerConstant,
          outerConstant,
          level,
          target,
          roots,
        },
      };
    },
  },
  {
    ...base,
    id: "comp.model",
    goals: ["comp.order", "comp.model"],
    difficulty: 3,
    size: "complex",
    minutes: 7,
    prompt: `<p>Et føls vægt efter ${math("<mi>t</mi>")} måneder beskrives ved ${math(`${call("g", "<mi>t</mi>")}<mo>=</mo><mn>40</mn><mo>+</mo><mn>22</mn><msup><mrow><mi>t</mi></mrow><mrow><mn>0,8</mn></mrow></msup>`)} kilogram. Den daglige fodermængde ved vægten ${math("<mi>w</mi>")} er ${math(`${call("f", "<mi>w</mi>")}<mo>=</mo><mn>0,005</mn><mi>w</mi>`)} kilogram. Vælg den forskrift, der giver fodermængden direkte ud fra tiden, og forklar sammenhængen mellem enhederne.</p>`,
    parts: [
      {
        id: "formula",
        label: "Forskriften",
        type: "choice",
        options: [
          {
            id: "model",
            label: math(`${call("h", "<mi>t</mi>")}<mo>=</mo><mn>0,2</mn><mo>+</mo><mn>0,11</mn><msup><mrow><mi>t</mi></mrow><mrow><mn>0,8</mn></mrow></msup>`),
          },
          {
            id: "reverse",
            label: math(`${call("h", "<mi>t</mi>")}<mo>=</mo><mn>40</mn><mo>+</mo><mn>22</mn><msup><mrow><mo>(</mo><mn>0,005</mn><mi>t</mi><mo>)</mo></mrow><mrow><mn>0,8</mn></mrow></msup>`),
          },
          {
            id: "add",
            label: math(`${call("h", "<mi>t</mi>")}<mo>=</mo>${call("f", "<mi>t</mi>")}<mo>+</mo>${call("g", "<mi>t</mi>")}`),
          },
        ],
        answer: "model",
        points: 3,
      },
      {
        id: "units",
        label: "Forklar med ord, hvad input og output betyder i hvert led",
        type: "text",
        checklist: [
          "Tiden i måneder bruges først som input i vægtmodellen.",
          "Vægtmodellens output i kilogram bruges som input i fodermodellen.",
          "Det endelige output er kilogram foder pr. dag.",
        ],
        concepts: ["måneder", "kropsvægt", "fodermængde", "input", "output"],
        points: 3,
      },
    ],
    hints: [
      "Følg enhederne fra den oplysning, du starter med, til den størrelse, du skal ende med.",
      "Tiden giver først en kropsvægt. Kropsvægten bruges derefter til at finde fodermængden.",
      `Sæt hele ${math(`${n(40)}<mo>+</mo>${n(22)}<msup><mrow><mi>t</mi></mrow><mrow><mn>0,8</mn></mrow></msup>`)} ind på ${math("<mi>w</mi>")}-pladsen og gang begge led med ${math("<mn>0,005</mn>")}.`,
    ],
    solution: `<ol><li>Inputtet er tid i måneder, så vægtmodellen bruges først: ${math(call("g", "<mi>t</mi>"))} måles i kilogram kropsvægt.</li><li>Vægten bliver input i fodermodellen: ${math(`${call("h", "<mi>t</mi>")}<mo>=</mo>${call("f", call("g", "<mi>t</mi>"))}`)}.</li><li>Indsæt og gang ind: ${math(`${call("h", "<mi>t</mi>")}<mo>=</mo><mn>0,005</mn>${parentheses(`<mn>40</mn><mo>+</mo><mn>22</mn><msup><mrow><mi>t</mi></mrow><mrow><mn>0,8</mn></mrow></msup>`)}<mo>=</mo><mn>0,2</mn><mo>+</mo><mn>0,11</mn><msup><mrow><mi>t</mi></mrow><mrow><mn>0,8</mn></mrow></msup>`)}.</li><li>Kontrol med enheder: måneder → kilogram kropsvægt → kilogram foder pr. dag.</li></ol>`,
    errors: [
      {
        part: "formula",
        answer: "reverse",
        feedback:
          "Rækkefølgen er vendt. Tiden skal først omsættes til kropsvægt, før fodermængden kan findes.",
      },
      {
        part: "formula",
        feedback:
          "Følg enhederne og brug outputtet fra vægtmodellen som input i fodermodellen.",
      },
      {
        part: "units",
        feedback:
          "Forklar alle tre led: startinputtets enhed, mellemresultatets enhed og det endelige outputs enhed.",
      },
    ],
  },
  {
    id: "comp.three-stage",
    version: 1,
    generate(random) {
      const shift = nonZeroInteger(random, -4, 4);
      const scale = integer(random, 2, 5);
      const outerConstant = integer(random, 1, 6);
      const input = nonZeroInteger(random, -3, 4);
      const afterH = input + shift;
      const afterG = scale * afterH;
      const output = afterG ** 2 + outerConstant;
      return {
        ...base,
        id: "comp.three-stage",
        goals: ["comp.value", "comp.order", "comp.structure"],
        difficulty: 3,
        size: "medium",
        minutes: 5,
        prompt: `<p>Der er givet funktionerne</p>${functionTable(
          `${call("f", x)}<mo>=</mo>${power(x, 2)}<mo>+</mo>${n(outerConstant)}`,
          `${call("g", x)}<mo>=</mo>${n(scale)}${x}`,
          `${call("h", x)}<mo>=</mo>${x}${signedNumber(shift)}`,
        )}<p>Bestem ${math(call("f", call("g", call("h", n(input)))))}.</p>`,
        parts: [
          {
            id: "value",
            label: "Den efterspurgte værdi",
            type: "number",
            answer: String(output),
            points: 4,
          },
        ],
        hints: [
          "Arbejd fra den inderste parentes og skriv ét mellemresultat ad gangen.",
          `De to første led i kæden giver ${math(`${call("h", n(input))}<mo>=</mo>${n(afterH)}`)} og derefter ${math(`${call("g", n(afterH))}<mo>=</mo>${n(afterG)}`)}.`,
          `Brug til sidst ${math(n(afterG))} som input i ${math("<mi>f</mi>")}.`,
        ],
        solution: `<ol><li>Først: ${math(`${call("h", n(input))}<mo>=</mo>${n(input)}${signedNumber(shift)}<mo>=</mo>${n(afterH)}`)}.</li><li>Dernæst: ${math(`${call("g", n(afterH))}<mo>=</mo>${n(scale)}<mo>·</mo>${n(afterH)}<mo>=</mo>${n(afterG)}`)}.</li><li>Til sidst: ${math(`${call("f", n(afterG))}<mo>=</mo>${power(n(afterG), 2)}<mo>+</mo>${n(outerConstant)}<mo>=</mo>${n(output)}`)}.</li><li>Kontrol: Rækkefølgen følger parenteserne fra ${math("<mi>h</mi>")} til ${math("<mi>g</mi>")} og derefter ${math("<mi>f</mi>")}.</li></ol>`,
        errors: [
          {
            part: "value",
            answer: String(afterH),
            feedback:
              "Det første mellemresultat er korrekt, men der mangler endnu to funktioner i kæden.",
          },
          {
            part: "value",
            answer: String(afterG),
            feedback:
              "De to inderste trin er udført, men mellemresultatet skal stadig bruges i den yderste funktion.",
          },
          {
            part: "value",
            feedback:
              "Læs parenteserne indefra og skriv et separat mellemresultat efter hver funktion.",
          },
        ],
        parameters: {
          shift,
          scale,
          outerConstant,
          input,
          afterH,
          afterG,
          output,
        },
      };
    },
  },
  {
    ...base,
    id: "comp.first-error",
    goals: ["comp.formula", "comp.compare"],
    difficulty: 2,
    size: "medium",
    minutes: 4,
    prompt: `<p>Funktionerne er ${definition("f", `${power(x, 2)}<mo>+</mo>${n(1)}`)} og ${definition("g", `${n(2)}${x}<mo>−</mo>${n(3)}`)}. En udregning er vist nedenfor. Vælg den første linje, der ikke følger af den foregående.</p><ol><li>${math(call("f", call("g", x)))}</li><li>${math(`${power(`${n(2)}${x}<mo>−</mo>${n(3)}`, 2)}<mo>+</mo>${n(1)}`)}</li><li>${math(`${n(4)}${power(x, 2)}<mo>−</mo>${n(9)}<mo>+</mo>${n(1)}`)}</li><li>${math(`${n(4)}${power(x, 2)}<mo>−</mo>${n(8)}`)}</li></ol>`,
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
      "Kontrollér én overgang ad gangen; en senere linje kan godt følge korrekt af en tidligere forkert linje.",
      `Ved kvadrering af ${math(`${n(2)}${x}<mo>−</mo>${n(3)}`)} skal der være tre led, herunder et produktled med ${math(x)}.`,
    ],
    solution: `<ol><li>Linje 2 er korrekt, fordi hele forskriften for ${math("<mi>g</mi>")} er sat ind i kvadratet.</li><li>Kvadratet skal udvikles som ${math(`${power(`${n(2)}${x}<mo>−</mo>${n(3)}`, 2)}<mo>=</mo>${n(4)}${power(x, 2)}<mo>−</mo>${n(12)}${x}<mo>+</mo>${n(9)}`)}.</li><li>Linje 3 mangler derfor midterleddet og er den første ugyldige linje.</li><li>Den korrekte forskrift er ${math(`${n(4)}${power(x, 2)}<mo>−</mo>${n(12)}${x}<mo>+</mo>${n(10)}`)}. En kontrol med et valgt input giver samme værdi i den oprindelige og den udvidede form.</li></ol>`,
    errors: [
      {
        part: "line",
        answer: "2",
        feedback:
          "Linje 2 er korrekt: Hele den ene forskrift er sat ind på inputpladsen i den anden.",
      },
      {
        part: "line",
        answer: "4",
        feedback:
          "Linje 4 følger af den allerede forkerte linje 3. Find den første overgang, hvor et led forsvinder.",
      },
      {
        part: "line",
        feedback:
          "Udvid parenteskvadratet med alle tre led, og sammenlign derefter linjerne én overgang ad gangen.",
      },
    ],
  },
];
