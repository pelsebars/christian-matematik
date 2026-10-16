import { math, n, x, power } from "../math.js";

const pick = (random, values) => values[Math.floor(random() * values.length)];
const integer = (random, min, max) => min + Math.floor(random() * (max - min + 1));
const nonZero = (random, min, max) => {
  let value = 0;
  while (!value) value = integer(random, min, max);
  return value;
};
const signed = (value) =>
  value < 0
    ? `<mo>−</mo>${n(Math.abs(value))}`
    : `<mo>+</mo>${n(value)}`;
const polynomialBody = (terms) => {
  let result = "";
  for (const [coefficient, exponent] of terms) {
    if (!coefficient) continue;
    const absolute = Math.abs(coefficient);
    if (result) result += `<mo>${coefficient < 0 ? "−" : "+"}</mo>`;
    else if (coefficient < 0) result += "<mo>−</mo>";
    if (exponent === 0 || absolute !== 1) result += n(absolute);
    if (exponent === 1) result += x;
    if (exponent > 1) result += power(x, exponent);
  }
  return result || n(0);
};
const functionDefinition = (name, body) =>
  math(`<mi>${name}</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${body}`);
const derivativeDefinition = (name, body) =>
  math(`<msup><mi>${name}</mi><mo>′</mo></msup><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${body}`);
const interval = (left, right) =>
  math(`<mo>]</mo>${n(left)}<mo>;</mo>${n(right)}<mo>[</mo>`);
const closedInterval = (left, right) =>
  math(`<mo>[</mo>${n(left)}<mo>;</mo>${n(right)}<mo>]</mo>`);

const quotientChoice = {
  id: "diff1.quotient-form",
  version: 1,
  topic: "differentiation",
  module: "diff.1",
  goals: ["diff.quotient"],
  prerequisites: [],
  difficulty: 1,
  size: "short",
  minutes: 3,
  aids: false,
  prompt: `<p>To punkter på grafen har input ${math(x)} og ${math(`${x}<mo>+</mo><mi>h</mi>`)}. Hvilket udtryk giver hældningen på linjen gennem punkterne?</p>`,
  parts: [
    {
      id: "formula",
      label: "Vælg udtrykket",
      type: "choice",
      answer: "quotient",
      points: 2,
      options: [
        {
          id: "quotient",
          label: math(`<mfrac><mrow><mi>f</mi><mo>(</mo>${x}<mo>+</mo><mi>h</mi><mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo>${x}<mo>)</mo></mrow><mi>h</mi></mfrac>`),
        },
        {
          id: "difference",
          label: math(`<mi>f</mi><mo>(</mo>${x}<mo>+</mo><mi>h</mi><mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo>${x}<mo>)</mo>`),
        },
      ],
    },
  ],
  hints: [
    "En hældning sammenligner både en lodret og en vandret ændring.",
    `Den lodrette ændring er forskellen mellem funktionsværdierne. Den vandrette ændring er ${math(`<mi>h</mi>`)}.`,
  ],
  solution: `<ol><li>Den lodrette ændring er ${math(`<mi>f</mi><mo>(</mo>${x}<mo>+</mo><mi>h</mi><mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo>${x}<mo>)</mo>`)}.</li><li>Inputtet ændres med ${math(`<mi>h</mi>`)}.</li><li>Hældning er lodret ændring divideret med vandret ændring, så det første udtryk er korrekt. Når ${math(`<mi>h</mi>`)} nærmer sig nul, nærmer sekanten sig tangenten.</li></ol>`,
  errors: [
    {
      part: "formula",
      answer: "difference",
      feedback: "Du har fundet funktionens tilvækst, men en hældning kræver også division med inputtets tilvækst.",
    },
    {
      part: "formula",
      feedback: "Skriv ændring i output divideret med ændring i input.",
    },
  ],
};

const secantTemplate = {
  id: "diff1.secant-and-tangent",
  version: 1,
  generate(random) {
    const a = integer(random, 1, 4);
    const b = nonZero(random, -5, 5);
    const c = integer(random, -6, 6);
    const start = integer(random, -3, 3);
    const step = integer(random, 1, 3);
    const end = start + step;
    const value = (input) => a * input ** 2 + b * input + c;
    const secant = (value(end) - value(start)) / step;
    const tangent = 2 * a * start + b;
    const body = polynomialBody([[a, 2], [b, 1], [c, 0]]);
    return {
      id: "diff1.secant-and-tangent",
      version: 1,
      topic: "differentiation",
      module: "diff.1",
      goals: ["diff.quotient", "diff.value"],
      prerequisites: [],
      difficulty: 2,
      size: "medium",
      minutes: 7,
      aids: false,
      prompt: `<p>For ${functionDefinition("f", body)} skal du bestemme to hældninger ved inputtet ${math(n(start))}.</p>`,
      parts: [
        {
          id: "secant",
          label: `Hældningen mellem inputtene ${math(n(start))} og ${math(n(end))}`,
          type: "number",
          answer: String(secant),
          points: 2,
        },
        {
          id: "tangent",
          label: `Hældningen netop ved inputtet ${math(n(start))}`,
          type: "number",
          answer: String(tangent),
          points: 2,
        },
      ],
      hints: [
        "Den første hældning bruger to funktionsværdier. Den anden bruger den afledte funktion.",
        `Beregn først ${math(`<mfrac><mrow><mi>f</mi><mo>(</mo>${n(end)}<mo>)</mo><mo>−</mo><mi>f</mi><mo>(</mo>${n(start)}<mo>)</mo></mrow><mrow>${n(end)}<mo>−</mo>${n(start)}</mrow></mfrac>`)}.`,
        `Differentier derefter forskriften og indsæt ${math(n(start))}.`,
      ],
      solution: `<ol><li>${math(`<mi>f</mi><mo>(</mo>${n(start)}<mo>)</mo><mo>=</mo>${n(value(start))}`)} og ${math(`<mi>f</mi><mo>(</mo>${n(end)}<mo>)</mo><mo>=</mo>${n(value(end))}`)}.</li><li>Sekanthældningen er ${math(`<mfrac><mrow>${n(value(end))}<mo>−</mo>${n(value(start))}</mrow><mrow>${n(end)}<mo>−</mo>${n(start)}</mrow></mfrac><mo>=</mo>${n(secant)}`)}.</li><li>${derivativeDefinition("f", polynomialBody([[2 * a, 1], [b, 0]]))}.</li><li>Ved inputtet ${math(n(start))} er tangenthældningen ${math(n(tangent))}. De to tal behøver ikke være ens, fordi det første beskriver et helt interval.</li></ol>`,
      errors: [
        {
          part: "secant",
          answer: String(value(end) - value(start)),
          feedback: "Du har fundet ændringen i funktionsværdi, men mangler at dividere med ændringen i input.",
        },
        {
          part: "secant",
          feedback: "Brug funktionsværdierne ved begge ender og samme rækkefølge i tæller og nævner.",
        },
        {
          part: "tangent",
          answer: String(value(start)),
          feedback: "Du har beregnet grafens højde. Opgaven spørger efter den lokale hældning.",
        },
        {
          part: "tangent",
          feedback: "Bestem den afledte funktion først og indsæt derefter det angivne input.",
        },
      ],
      parameters: { a, b, c, start, step, end, secant, tangent },
    };
  },
};

const polynomialTemplate = {
  id: "diff1.polynomial",
  version: 1,
  generate(random) {
    const a = nonZero(random, -4, 4);
    const b = nonZero(random, -5, 5);
    const c = nonZero(random, -7, 7);
    const d = integer(random, -8, 8);
    const body = polynomialBody([[a, 3], [b, 2], [c, 1], [d, 0]]);
    const derivativeBody = polynomialBody([[3 * a, 2], [2 * b, 1], [c, 0]]);
    return {
      id: "diff1.polynomial",
      version: 1,
      topic: "differentiation",
      module: "diff.1",
      goals: ["diff.rules"],
      prerequisites: [],
      difficulty: 1,
      size: "short",
      minutes: 4,
      aids: false,
      prompt: `<p>Bestem den afledte funktion til ${functionDefinition("f", body)}.</p>`,
      parts: [
        {
          id: "expr",
          label: "Den afledte forskrift",
          type: "expression",
          answer: `${3 * a}*x^2+${2 * b}*x+${c}`,
          points: 3,
        },
      ],
      hints: [
        "Behandl hvert led for sig, og læg bidragene sammen bagefter.",
        "Flyt eksponenten ned som faktor, gør eksponenten én mindre, og lad konstantleddet forsvinde.",
      ],
      solution: `<ol><li>Det kubiske led giver ${math(polynomialBody([[3 * a, 2]]))}.</li><li>Andengradleddet giver ${math(polynomialBody([[2 * b, 1]]))}, og det lineære led giver ${math(n(c))}.</li><li>Konstanten giver nul. Derfor er ${derivativeDefinition("f", derivativeBody)}.</li></ol>`,
      errors: [
        {
          part: "expr",
          answer: `${a}*x^2+${b}*x+${c}`,
          feedback: "Eksponenterne er reduceret, men de gamle eksponenter mangler som faktorer foran leddene.",
        },
        {
          part: "expr",
          feedback: "Kontrollér hvert led: gammel eksponent bliver faktor, ny eksponent er én mindre, og konstanten forsvinder.",
        },
      ],
      parameters: { a, b, c, d },
    };
  },
};

const derivativeValueTemplate = {
  id: "diff1.derivative-value",
  version: 1,
  generate(random) {
    const a = nonZero(random, -5, 5);
    const b = nonZero(random, -6, 6);
    const c = integer(random, -8, 8);
    const input = integer(random, -4, 5);
    const derivative = 2 * a * input + b;
    const functionValue = a * input ** 2 + b * input + c;
    return {
      id: "diff1.derivative-value",
      version: 1,
      topic: "differentiation",
      module: "diff.1",
      goals: ["diff.value", "diff.rules"],
      prerequisites: [],
      difficulty: 1,
      size: "short",
      minutes: 4,
      aids: false,
      prompt: `<p>Det er givet, at ${functionDefinition("f", polynomialBody([[a, 2], [b, 1], [c, 0]]))}. Bestem ${math(`<msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo>`)}.</p>`,
      parts: [
        {
          id: "value",
          label: "Den søgte værdi",
          type: "number",
          answer: String(derivative),
          points: 2,
        },
      ],
      hints: [
        "Mærket ved funktionsnavnet betyder, at du først skal finde den afledte forskrift.",
        `Den afledte er ${math(polynomialBody([[2 * a, 1], [b, 0]]))}. Indsæt nu ${math(n(input))}.`,
      ],
      solution: `<ol><li>${derivativeDefinition("f", polynomialBody([[2 * a, 1], [b, 0]]))}.</li><li>Indsættelse giver ${math(`<msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo><mo>=</mo>${n(2 * a)}<mo>·</mo><mo>(</mo>${n(input)}<mo>)</mo>${signed(b)}<mo>=</mo>${n(derivative)}`)}.</li><li>Tallet er grafens tangenthældning ved dette input.</li></ol>`,
      errors: [
        {
          part: "value",
          answer: String(functionValue),
          feedback: "Du har beregnet funktionsværdien og dermed grafens højde. Her spørges efter tangentens hældning.",
        },
        {
          part: "value",
          feedback: "Differentier hele forskriften først, og indsæt først inputtet bagefter.",
        },
      ],
      parameters: { a, b, c, input, derivative, functionValue },
    };
  },
};

const mixedRules = {
  id: "diff1.mixed-rules",
  version: 1,
  topic: "differentiation",
  module: "diff.1",
  goals: ["diff.rules"],
  prerequisites: [],
  difficulty: 2,
  size: "medium",
  minutes: 5,
  aids: false,
  prompt: `<p>Det er givet, at ${functionDefinition("f", `${n(2)}<mi>sin</mi><mo>(</mo>${x}<mo>)</mo><mo>+</mo>${power(x, -3)}`)}. Vælg den korrekte afledte.</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "correct",
      points: 3,
      options: [
        {
          id: "correct",
          label: derivativeDefinition("f", `${n(2)}<mi>cos</mi><mo>(</mo>${x}<mo>)</mo><mo>−</mo>${n(3)}${power(x, -4)}`),
        },
        {
          id: "wrong-exponent",
          label: derivativeDefinition("f", `${n(2)}<mi>cos</mi><mo>(</mo>${x}<mo>)</mo><mo>+</mo>${n(3)}${power(x, -2)}`),
        },
      ],
    },
  ],
  hints: [
    "Arbejd med de to led hver for sig.",
    `Sinus bliver cosinus. For potensen flyttes ${math(n(-3))} ned som faktor, og eksponenten bliver ${math(n(-4))}.`,
  ],
  solution: `<ol><li>${math(`<mfrac><mi>d</mi><mrow><mi>d</mi>${x}</mrow></mfrac><mo>(</mo>${n(2)}<mi>sin</mi><mo>(</mo>${x}<mo>)</mo><mo>)</mo><mo>=</mo>${n(2)}<mi>cos</mi><mo>(</mo>${x}<mo>)</mo>`)}.</li><li>${math(`<mfrac><mi>d</mi><mrow><mi>d</mi>${x}</mrow></mfrac>${power(x, -3)}<mo>=</mo><mo>−</mo>${n(3)}${power(x, -4)}`)}.</li><li>Bidragene lægges sammen, så det første svar er korrekt.</li></ol>`,
  errors: [
    {
      part: "derivative",
      answer: "wrong-exponent",
      feedback: "Ved en negativ potens skal den gamle eksponent både blive faktor og mindskes med én. Fortegnet ændres ikke til plus.",
    },
    {
      part: "derivative",
      feedback: "Kontrollér trigonometrien og potensleddet hver for sig.",
    },
  ],
};

const rateInterpretation = {
  id: "diff1.rate-interpretation",
  version: 1,
  topic: "differentiation",
  module: "diff.1",
  goals: ["diff.interpret"],
  prerequisites: [],
  difficulty: 1,
  size: "short",
  minutes: 3,
  aids: false,
  prompt: `<p>En gryde har temperaturen ${math(`<mi>T</mi><mo>(</mo><mi>t</mi><mo>)</mo>`)} målt i grader Celsius, hvor ${math(`<mi>t</mi>`)} måles i minutter. Det er beregnet, at ${math(`<msup><mi>T</mi><mo>′</mo></msup><mo>(</mo>${n(5)}<mo>)</mo><mo>=</mo><mo>−</mo><mn>3,67</mn>`)}. Hvilken konklusion passer?</p>`,
  parts: [
    {
      id: "meaning",
      label: "Vælg fortolkningen",
      type: "choice",
      answer: "rate",
      points: 2,
      options: [
        { id: "rate", label: "Efter fem minutter falder temperaturen med cirka 3,67 grader Celsius pr. minut." },
        { id: "value", label: "Efter fem minutter er temperaturen minus 3,67 grader Celsius." },
      ],
    },
  ],
  hints: [
    "En afledt værdi beskriver ændring pr. inputenhed.",
    "Minusset fortæller retningen, og inputtet fortæller tidspunktet.",
  ],
  solution: `<ol><li>Output måles i grader Celsius, og input måles i minutter.</li><li>Den afledte har derfor enheden grader Celsius pr. minut.</li><li>Det negative fortegn betyder, at temperaturen falder. Den første fortolkning har både tidspunkt, retning, størrelse og enhed.</li></ol>`,
  errors: [
    {
      part: "meaning",
      answer: "value",
      feedback: "Du læser den afledte som en almindelig funktionsværdi. Den beskriver en ændringshastighed, ikke temperaturen selv.",
    },
    { part: "meaning", feedback: "Medtag tidspunkt, retning og outputenhed pr. inputenhed." },
  ],
};

const productRecognition = {
  id: "diff2.structure",
  version: 1,
  topic: "differentiation",
  module: "diff.2",
  goals: ["diff.product-structure"],
  prerequisites: ["diff.1"],
  difficulty: 1,
  size: "short",
  minutes: 3,
  aids: false,
  prompt: `<p>Hvilken af forskrifterne består af to funktioner, som er ganget sammen?</p>`,
  parts: [
    {
      id: "structure",
      label: "Vælg forskriften",
      type: "choice",
      answer: "product",
      points: 2,
      options: [
        { id: "product", label: functionDefinition("f", `${power(x, 2)}<mo>·</mo><mi>ln</mi><mo>(</mo>${x}<mo>)</mo>`) },
        { id: "sum", label: functionDefinition("f", `${power(x, 2)}<mo>+</mo><mi>ln</mi><mo>(</mo>${x}<mo>)</mo>`) },
      ],
    },
  ],
  hints: [
    "Se på det yderste regnetegn mellem de to større dele.",
    "Et produkt har et gangetegn; et plustegn deler en sum i led.",
  ],
  solution: `<p>I den første forskrift er faktorerne ${math(power(x, 2))} og ${math(`<mi>ln</mi><mo>(</mo>${x}<mo>)</mo>`)}. I den anden forskrift er de samme dele lagt sammen. Derfor er den første et produkt.</p>`,
  errors: [
    { part: "structure", answer: "sum", feedback: "Plustegnet deler forskriften i to led. Kig efter et gangetegn mellem funktionerne." },
    { part: "structure", feedback: "Identificér det yderste regnetegn mellem de to funktionsdele." },
  ],
};

const polynomialProductTemplate = {
  id: "diff2.polynomial-product",
  version: 1,
  generate(random) {
    const a = nonZero(random, -4, 4);
    const b = nonZero(random, -6, 6);
    const c = nonZero(random, -4, 4);
    const d = nonZero(random, -6, 6);
    const first = polynomialBody([[a, 1], [b, 0]]);
    const second = polynomialBody([[c, 1], [d, 0]]);
    const quadratic = a * c;
    const linear = a * d + b * c;
    const derivative = `${2 * quadratic}*x+${linear}`;
    return {
      id: "diff2.polynomial-product",
      version: 1,
      topic: "differentiation",
      module: "diff.2",
      goals: ["diff.product", "diff.product-structure"],
      prerequisites: ["diff.1"],
      difficulty: 2,
      size: "medium",
      minutes: 6,
      aids: false,
      prompt: `<p>Bestem den afledte funktion til ${functionDefinition("f", `<mo>(</mo>${first}<mo>)</mo><mo>(</mo>${second}<mo>)</mo>`)}.</p>`,
      parts: [
        { id: "expr", label: "Den afledte forskrift", type: "expression", answer: derivative, points: 4 },
      ],
      hints: [
        "Begge parenteser afhænger af inputtet, så begge kan bidrage til ændringen.",
        `Skriv første afledte gange anden oprindelige plus første oprindelige gange anden afledte.`,
        "Du kan kontrollere resultatet ved først at gange parenteserne ud.",
      ],
      solution: `<ol><li>Sæt ${math(`<mi>u</mi><mo>=</mo><mo>(</mo>${first}<mo>)</mo>`)} og ${math(`<mi>v</mi><mo>=</mo><mo>(</mo>${second}<mo>)</mo>`)}. Da er ${math(`<msup><mi>u</mi><mo>′</mo></msup><mo>=</mo>${n(a)}`)} og ${math(`<msup><mi>v</mi><mo>′</mo></msup><mo>=</mo>${n(c)}`)}.</li><li>De to bidrag er ${math(`${n(a)}<mo>(</mo>${second}<mo>)</mo><mo>+</mo><mo>(</mo>${first}<mo>)</mo><mo>·</mo>${n(c)}`)}.</li><li>Efter samling fås ${derivativeDefinition("f", polynomialBody([[2 * quadratic, 1], [linear, 0]]))}.</li></ol>`,
      errors: [
        { part: "expr", answer: String(a * c), feedback: "Du har ganget de to afledede sammen. Der skal være et bidrag fra ændringen i hver faktor." },
        { part: "expr", feedback: "Bevar én oprindelig faktor i hvert af de to bidrag, og saml først bagefter." },
      ],
      parameters: { a, b, c, d, quadratic, linear },
    };
  },
};

const logarithmProduct = {
  id: "diff2.log-product",
  version: 1,
  topic: "differentiation",
  module: "diff.2",
  goals: ["diff.product"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "medium",
  minutes: 5,
  aids: false,
  prompt: `<p>For ${functionDefinition("f", `${n(5)}${power(x, 2)}<mo>·</mo><mi>ln</mi><mo>(</mo>${x}<mo>)</mo>`)} med ${math(`${x}<mo>&gt;</mo>${n(0)}`)} skal du vælge den korrekte afledte.</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "full",
      points: 3,
      options: [
        { id: "full", label: derivativeDefinition("f", `${n(10)}${x}<mi>ln</mi><mo>(</mo>${x}<mo>)</mo><mo>+</mo>${n(5)}${x}`) },
        { id: "both", label: derivativeDefinition("f", `${n(10)}${x}<mo>·</mo><mfrac>${n(1)}${x}</mfrac>`) },
      ],
    },
  ],
  hints: [
    "Der skal være to bidrag i svaret.",
    `Skriv først ${math(`${n(10)}${x}<mo>·</mo><mi>ln</mi><mo>(</mo>${x}<mo>)</mo><mo>+</mo>${n(5)}${power(x, 2)}<mo>·</mo><mfrac>${n(1)}${x}</mfrac>`)}.`,
  ],
  solution: `<ol><li>Den første faktor har den afledte ${math(`${n(10)}${x}`)}, og logaritmen har den afledte ${math(`<mfrac>${n(1)}${x}</mfrac>`)}.</li><li>Begge bidrag giver ${math(`${n(10)}${x}<mi>ln</mi><mo>(</mo>${x}<mo>)</mo><mo>+</mo>${n(5)}${power(x, 2)}<mo>·</mo><mfrac>${n(1)}${x}</mfrac>`)}.</li><li>Det sidste led forkortes til ${math(`${n(5)}${x}`)}, så den første mulighed er korrekt.</li></ol>`,
  errors: [
    { part: "derivative", answer: "both", feedback: "Du har differentieret begge faktorer samtidig og mistet de oprindelige faktorer. Der skal være en sum med to bidrag." },
    { part: "derivative", feedback: "Differentier én faktor ad gangen og bevar den anden uændret." },
  ],
};

const exponentialProduct = {
  id: "diff2.exponential-product",
  version: 1,
  topic: "differentiation",
  module: "diff.2",
  goals: ["diff.product"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "medium",
  minutes: 5,
  aids: false,
  prompt: `<p>Det er givet, at ${functionDefinition("f", `${n(2)}${power(x, 3)}<msup><mi>e</mi>${x}</msup>`)}. Hvilken af de to forskrifter er korrekt?</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "sum",
      points: 3,
      options: [
        { id: "sum", label: derivativeDefinition("f", `${n(6)}${power(x, 2)}<msup><mi>e</mi>${x}</msup><mo>+</mo>${n(2)}${power(x, 3)}<msup><mi>e</mi>${x}</msup>`) },
        { id: "product", label: derivativeDefinition("f", `${n(6)}${power(x, 2)}<msup><mi>e</mi>${x}</msup>`) },
      ],
    },
  ],
  hints: [
    "Både polynomiet og eksponentialfaktoren ændrer sig.",
    "Det ene bidrag differentierer polynomiet; det andet differentierer eksponentialfunktionen.",
  ],
  solution: `<ol><li>${math(`<mfrac><mi>d</mi><mrow><mi>d</mi>${x}</mrow></mfrac><mo>(</mo>${n(2)}${power(x, 3)}<mo>)</mo><mo>=</mo>${n(6)}${power(x, 2)}`)}.</li><li>${math(`<mfrac><mi>d</mi><mrow><mi>d</mi>${x}</mrow></mfrac><msup><mi>e</mi>${x}</msup><mo>=</mo><msup><mi>e</mi>${x}</msup>`)}.</li><li>Summen af de to produktbidrag er den første mulighed. Den kan også faktoriseres som ${math(`${n(2)}${power(x, 2)}<msup><mi>e</mi>${x}</msup><mo>(</mo>${x}<mo>+</mo>${n(3)}<mo>)</mo>`)}.</li></ol>`,
  errors: [
    { part: "derivative", answer: "product", feedback: "Du har kun medtaget ændringen i polynomiet. Eksponentialfaktoren bidrager også." },
    { part: "derivative", feedback: "Sørg for, at hver faktor differentieres én gang i hvert sit bidrag." },
  ],
};

const productValueTemplate = {
  id: "diff2.product-value",
  version: 1,
  generate(random) {
    const u = nonZero(random, -6, 6);
    const du = nonZero(random, -5, 5);
    const v = nonZero(random, -6, 6);
    const dv = nonZero(random, -5, 5);
    const input = integer(random, -3, 4);
    const answer = du * v + u * dv;
    return {
      id: "diff2.product-value",
      version: 1,
      topic: "differentiation",
      module: "diff.2",
      goals: ["diff.product-value", "diff.product"],
      prerequisites: ["diff.1"],
      difficulty: 2,
      size: "short",
      minutes: 4,
      aids: false,
      prompt: `<p>Ved inputtet ${math(n(input))} gælder ${math(`<mi>u</mi><mo>(</mo>${n(input)}<mo>)</mo><mo>=</mo>${n(u)}<mo>,</mo><mspace width="0.4em"/><msup><mi>u</mi><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo><mo>=</mo>${n(du)}<mo>,</mo><mspace width="0.4em"/><mi>v</mi><mo>(</mo>${n(input)}<mo>)</mo><mo>=</mo>${n(v)}<mo>,</mo><mspace width="0.4em"/><msup><mi>v</mi><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo><mo>=</mo>${n(dv)}`)}. Bestem ${math(`<mo>(</mo><mi>u</mi><mi>v</mi><msup><mo>)</mo><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo>`)}.</p>`,
      parts: [
        { id: "value", label: "Den søgte værdi", type: "number", answer: String(answer), points: 3 },
      ],
      hints: [
        "Der kommer ét bidrag fra hver af de to funktioner.",
        `Indsæt værdierne i ${math(`<msup><mi>u</mi><mo>′</mo></msup><mi>v</mi><mo>+</mo><mi>u</mi><msup><mi>v</mi><mo>′</mo></msup>`)}.`,
      ],
      solution: `<ol><li>${math(`<mo>(</mo><mi>u</mi><mi>v</mi><msup><mo>)</mo><mo>′</mo></msup><mo>=</mo><msup><mi>u</mi><mo>′</mo></msup><mi>v</mi><mo>+</mo><mi>u</mi><msup><mi>v</mi><mo>′</mo></msup>`)}.</li><li>Ved det angivne input bliver det ${math(`${n(du)}<mo>·</mo>${n(v)}<mo>+</mo>${n(u)}<mo>·</mo>${n(dv)}<mo>=</mo>${n(answer)}`)}.</li></ol>`,
      errors: [
        { part: "value", answer: String(du * dv), feedback: "Du har ganget de to afledte værdier. Produktets afledte består af to bidrag med de oprindelige værdier." },
        { part: "value", feedback: "Brug rækkefølgen afledt gange oprindelig plus oprindelig gange afledt, og pas på fortegn." },
      ],
      parameters: { u, du, v, dv, input, answer },
    };
  },
};

const areaRateTemplate = {
  id: "diff2.area-rate",
  version: 1,
  generate(random) {
    const length = integer(random, 4, 12);
    const width = integer(random, 3, 9);
    const lengthRate = integer(random, 1, 4);
    const widthRate = -integer(random, 1, 3);
    const areaRate = lengthRate * width + length * widthRate;
    return {
      id: "diff2.area-rate",
      version: 1,
      topic: "differentiation",
      module: "diff.2",
      goals: ["diff.product-model", "diff.product-value"],
      prerequisites: ["diff.1"],
      difficulty: 3,
      size: "medium",
      minutes: 7,
      aids: false,
      prompt: `<p>Et rektangel ændrer form. På et bestemt tidspunkt er længden ${math(`${n(length)}<mtext> cm</mtext>`)} og bredden ${math(`${n(width)}<mtext> cm</mtext>`)}. Længden vokser med ${math(`${n(lengthRate)}<mtext> cm/s</mtext>`)}, mens bredden aftager med ${math(`${n(Math.abs(widthRate))}<mtext> cm/s</mtext>`)}. Bestem arealets ændringshastighed på dette tidspunkt.</p>`,
      parts: [
        { id: "rate", label: "Arealets ændring i kvadratcentimeter pr. sekund", type: "number", answer: String(areaRate), points: 3 },
        {
          id: "meaning",
          label: "Vælg den korrekte fortolkning",
          type: "choice",
          answer: areaRate >= 0 ? "grows" : "shrinks",
          points: 2,
          options: [
            { id: "grows", label: "Arealet vokser på det angivne tidspunkt." },
            { id: "shrinks", label: "Arealet aftager på det angivne tidspunkt." },
          ],
        },
      ],
      hints: [
        "Arealet er et produkt af to størrelser, som begge ændrer sig.",
        "Ét bidrag kommer fra længdens ændring, og ét kommer fra breddens ændring.",
        `Husk, at breddens ændringshastighed er negativ.`,
      ],
      solution: `<ol><li>Skriv ${math(`<mi>A</mi><mo>=</mo><mi>L</mi><mi>B</mi>`)}.</li><li>På tidspunktet er ${math(`<msup><mi>A</mi><mo>′</mo></msup><mo>=</mo><msup><mi>L</mi><mo>′</mo></msup><mi>B</mi><mo>+</mo><mi>L</mi><msup><mi>B</mi><mo>′</mo></msup><mo>=</mo>${n(lengthRate)}<mo>·</mo>${n(width)}<mo>+</mo>${n(length)}<mo>·</mo><mo>(</mo>${n(widthRate)}<mo>)</mo><mo>=</mo>${n(areaRate)}`)}.</li><li>Enheden er kvadratcentimeter pr. sekund. ${areaRate >= 0 ? "Det positive fortegn betyder, at arealet vokser." : "Det negative fortegn betyder, at arealet aftager."}</li></ol>`,
      errors: [
        { part: "rate", answer: String(lengthRate * widthRate), feedback: "Du har ganget ændringshastighederne sammen. Arealets ændring har to bidrag med de aktuelle sidelængder." },
        { part: "rate", feedback: "Medtag begge produktbidrag og brug en negativ værdi for den aftagende bredde." },
        { part: "meaning", feedback: "Fortolk fortegnet på ændringshastigheden, ikke på selve arealet." },
      ],
      parameters: { length, width, lengthRate, widthRate, areaRate },
    };
  },
};

const chainLayers = {
  id: "diff3.layers",
  version: 1,
  topic: "differentiation",
  module: "diff.3",
  goals: ["diff.chain-structure"],
  prerequisites: ["comp.basic", "diff.1"],
  difficulty: 1,
  size: "short",
  minutes: 3,
  aids: false,
  prompt: `<p>Betragt ${functionDefinition("f", power(`${n(3)}${power(x, 2)}<mo>+</mo>${n(1)}`, 3))}. Hvilket par beskriver lagene korrekt?</p>`,
  parts: [
    {
      id: "layers",
      label: "Vælg indre og ydre funktion",
      type: "choice",
      answer: "correct",
      points: 2,
      options: [
        { id: "correct", label: math(`<mi>g</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(3)}${power(x, 2)}<mo>+</mo>${n(1)}<mo>,</mo><mspace width="0.5em"/><mi>h</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo>${power("<mi>t</mi>", 3)}`) },
        { id: "reversed", label: math(`<mi>g</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${power(x, 3)}<mo>,</mo><mspace width="0.5em"/><mi>h</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo>${n(3)}${power("<mi>t</mi>", 2)}<mo>+</mo>${n(1)}`) },
      ],
    },
  ],
  hints: [
    "Spørg, hvad inputtet rammer først.",
    "Hele parentesens indhold beregnes før den yderste tredje potens.",
  ],
  solution: `<ol><li>Inputtet sættes først ind i ${math(`<mi>g</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(3)}${power(x, 2)}<mo>+</mo>${n(1)}`)}.</li><li>Resultatet bliver derefter input til ${math(`<mi>h</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo>${power("<mi>t</mi>", 3)}`)}.</li><li>Dermed er ${math(`<mi>f</mi><mo>=</mo><mi>h</mi><mo>∘</mo><mi>g</mi>`)} og den første mulighed korrekt.</li></ol>`,
  errors: [
    { part: "layers", answer: "reversed", feedback: "Lagene er byttet. Det indre lag er hele udtrykket, der først beregnes inde i parentesen." },
    { part: "layers", feedback: "Find først parentesens indhold og brug en pladsholder til den yderste funktion." },
  ],
};

const chainPowerTemplate = {
  id: "diff3.power-chain",
  version: 1,
  generate(random) {
    const a = integer(random, 2, 5);
    const b = nonZero(random, -5, 5);
    const exponent = integer(random, 2, 4);
    const inside = polynomialBody([[a, 1], [b, 0]]);
    const answer = `${exponent * a}*(${a}*x+${b})^${exponent - 1}`;
    return {
      id: "diff3.power-chain",
      version: 1,
      topic: "differentiation",
      module: "diff.3",
      goals: ["diff.chain", "diff.chain-structure"],
      prerequisites: ["comp.basic", "diff.1"],
      difficulty: 2,
      size: "medium",
      minutes: 6,
      aids: false,
      prompt: `<p>Bestem den afledte funktion til ${functionDefinition("f", power(inside, exponent))}.</p>`,
      parts: [
        { id: "expr", label: "Den afledte forskrift", type: "expression", answer, points: 4 },
      ],
      hints: [
        "Bevar hele parentesen som én indre funktion.",
        `Differentier først den yderste potens og gang derefter med parentesens afledte ${math(n(a))}.`,
      ],
      solution: `<ol><li>Det indre lag er ${math(`<mi>g</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${inside}`)}, så ${math(`<msup><mi>g</mi><mo>′</mo></msup><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(a)}`)}.</li><li>Den ydre funktion er ${math(`<mi>h</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo>${power("<mi>t</mi>", exponent)}`)}, så ${math(`<msup><mi>h</mi><mo>′</mo></msup><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo>${n(exponent)}${power("<mi>t</mi>", exponent - 1)}`)}.</li><li>Derfor er ${derivativeDefinition("f", `${n(exponent * a)}${power(inside, exponent - 1)}`)}.</li></ol>`,
      errors: [
        { part: "expr", answer: `${exponent}*(${a}*x+${b})^${exponent - 1}`, feedback: "Den yderste potens er differentieret korrekt, men faktoren fra den indre lineære funktion mangler." },
        { part: "expr", feedback: "Bevar parentesen, reducer den ydre eksponent, og gang med den indre afledte." },
      ],
      parameters: { a, b, exponent },
    };
  },
};

const chainValueTemplate = {
  id: "diff3.power-value",
  version: 1,
  generate(random) {
    const constant = integer(random, 1, 5);
    const input = pick(random, [-2, -1, 1, 2]);
    const answer = 6 * input * (input ** 2 + constant) ** 2;
    return {
      id: "diff3.power-value",
      version: 1,
      topic: "differentiation",
      module: "diff.3",
      goals: ["diff.chain", "diff.chain-model"],
      prerequisites: ["diff.1"],
      difficulty: 2,
      size: "short",
      minutes: 5,
      aids: false,
      prompt: `<p>For ${functionDefinition("f", power(`${power(x, 2)}<mo>+</mo>${n(constant)}`, 3))} skal du bestemme ${math(`<msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo>`)}.</p>`,
      parts: [
        { id: "value", label: "Den søgte værdi", type: "number", answer: String(answer), points: 3 },
      ],
      hints: [
        "Differentier hele sammensætningen, før du indsætter tallet.",
        `Den afledte kan skrives ${math(`${n(3)}${power(`${power(x, 2)}<mo>+</mo>${n(constant)}`, 2)}<mo>·</mo>${n(2)}${x}`)}.`,
      ],
      solution: `<ol><li>Ydersiden giver ${math(`${n(3)}${power(`${power(x, 2)}<mo>+</mo>${n(constant)}`, 2)}`)}.</li><li>Indersiden giver faktoren ${math(`${n(2)}${x}`)}. Derfor er ${derivativeDefinition("f", `${n(6)}${x}${power(`${power(x, 2)}<mo>+</mo>${n(constant)}`, 2)}`)}.</li><li>Indsættelse af ${math(n(input))} giver ${math(n(answer))}.</li></ol>`,
      errors: [
        { part: "value", answer: String(3 * (input ** 2 + constant) ** 2), feedback: "Du har beregnet den ydre afledte, men faktoren fra indersiden mangler." },
        { part: "value", feedback: "Differentier både det ydre og indre lag, gang resultaterne, og indsæt først derefter inputtet." },
      ],
      parameters: { constant, input, answer },
    };
  },
};

const exponentialChain = {
  id: "diff3.exponential",
  version: 1,
  topic: "differentiation",
  module: "diff.3",
  goals: ["diff.chain"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "short",
  minutes: 4,
  aids: false,
  prompt: `<p>Det er givet, at ${functionDefinition("f", `<msup><mi>e</mi><mrow>${n(4)}${x}</mrow></msup>`)}. Vælg den korrekte afledte.</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "factor",
      points: 2,
      options: [
        { id: "factor", label: derivativeDefinition("f", `${n(4)}<msup><mi>e</mi><mrow>${n(4)}${x}</mrow></msup>`) },
        { id: "missing", label: derivativeDefinition("f", `<msup><mi>e</mi><mrow>${n(4)}${x}</mrow></msup>`) },
      ],
    },
  ],
  hints: ["Eksponentialfunktionen bevarer sin form.", `Eksponenten ${math(`${n(4)}${x}`)} har den afledte ${math(n(4))}.`],
  solution: `<p>Den ydre afledte er fortsat eksponentialfunktionen. Den skal ganges med eksponentens afledte, som er ${math(n(4))}. Derfor er den første mulighed korrekt.</p>`,
  errors: [
    { part: "derivative", answer: "missing", feedback: "Eksponentialfunktionen er bevaret, men faktoren fra eksponentens afledte mangler." },
    { part: "derivative", feedback: "Differentier eksponenten og skriv dens afledte som faktor." },
  ],
};

const logarithmChain = {
  id: "diff3.logarithm",
  version: 1,
  topic: "differentiation",
  module: "diff.3",
  goals: ["diff.chain"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "medium",
  minutes: 5,
  aids: false,
  prompt: `<p>For ${functionDefinition("f", `<mi>ln</mi><mo>(</mo>${power(x, 4)}<mo>+</mo>${x}<mo>)</mo>`)} skal du vælge den korrekte afledte. Betragt kun input, hvor logaritmen er defineret.</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "full",
      points: 3,
      options: [
        { id: "full", label: derivativeDefinition("f", `<mfrac><mrow>${n(4)}${power(x, 3)}<mo>+</mo>${n(1)}</mrow><mrow>${power(x, 4)}<mo>+</mo>${x}</mrow></mfrac>`) },
        { id: "missing", label: derivativeDefinition("f", `<mfrac>${n(1)}<mrow>${power(x, 4)}<mo>+</mo>${x}</mrow></mfrac>`) },
      ],
    },
  ],
  hints: [
    "Logaritmens input bliver nævner i den afledte.",
    `Nævneren er den oprindelige inderside, mens tælleren er indersidens afledte.`,
  ],
  solution: `<ol><li>Den ydre regel giver den reciprokke værdi af indersiden.</li><li>Indersiden ${math(`${power(x, 4)}<mo>+</mo>${x}`)} har den afledte ${math(`${n(4)}${power(x, 3)}<mo>+</mo>${n(1)}`)}.</li><li>Den indre afledte placeres som faktor, her naturligt som tæller. Derfor er den første mulighed korrekt.</li></ol>`,
  errors: [
    { part: "derivative", answer: "missing", feedback: "Nævneren er rigtig, men tælleren fra indersidens afledte mangler." },
    { part: "derivative", feedback: "Brug indersiden i nævneren og dens afledte i tælleren." },
  ],
};

const sineChain = {
  id: "diff3.sine",
  version: 1,
  topic: "differentiation",
  module: "diff.3",
  goals: ["diff.chain"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "short",
  minutes: 4,
  aids: false,
  prompt: `<p>Det er givet, at ${functionDefinition("f", `<mi>sin</mi><mo>(</mo>${n(2)}${x}<mo>+</mo>${n(3)}<mo>)</mo>`)}. Vælg den korrekte afledte.</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "factor",
      points: 2,
      options: [
        { id: "factor", label: derivativeDefinition("f", `${n(2)}<mi>cos</mi><mo>(</mo>${n(2)}${x}<mo>+</mo>${n(3)}<mo>)</mo>`) },
        { id: "missing", label: derivativeDefinition("f", `<mi>cos</mi><mo>(</mo>${n(2)}${x}<mo>+</mo>${n(3)}<mo>)</mo>`) },
      ],
    },
  ],
  hints: ["Sinus bliver cosinus, mens indersiden bevares.", "Gang derefter med den lineære indersides afledte."],
  solution: `<p>Den ydre sinusfunktion giver cosinus af den samme inderside. Indersiden ${math(`${n(2)}${x}<mo>+</mo>${n(3)}`)} har den afledte ${math(n(2))}. Derfor skal cosinusudtrykket ganges med to.</p>`,
  errors: [
    { part: "derivative", answer: "missing", feedback: "Den ydre regel er rigtig, men faktoren fra den lineære inderside mangler." },
    { part: "derivative", feedback: "Bevar indersiden i cosinus og gang med indersidens afledte." },
  ],
};

const combinedRules = {
  id: "diff3.combined",
  version: 1,
  topic: "differentiation",
  module: "diff.3",
  goals: ["diff.chain-combine", "diff.chain"],
  prerequisites: ["diff.1", "diff.2"],
  difficulty: 3,
  size: "complex",
  minutes: 9,
  aids: false,
  prompt: `<p>For ${functionDefinition("f", `<mo>(</mo>${power(x, 2)}<mo>+</mo>${n(1)}<mo>)</mo><msup><mi>e</mi><mrow>${n(2)}${x}</mrow></msup>`)} skal du vælge den korrekte afledte.</p>`,
  parts: [
    {
      id: "derivative",
      label: "Vælg forskriften",
      type: "choice",
      answer: "full",
      points: 4,
      options: [
        { id: "full", label: derivativeDefinition("f", `${n(2)}${x}<msup><mi>e</mi><mrow>${n(2)}${x}</mrow></msup><mo>+</mo>${n(2)}<mo>(</mo>${power(x, 2)}<mo>+</mo>${n(1)}<mo>)</mo><msup><mi>e</mi><mrow>${n(2)}${x}</mrow></msup>`) },
        { id: "multiplied", label: derivativeDefinition("f", `${n(2)}${x}<mo>·</mo>${n(2)}<msup><mi>e</mi><mrow>${n(2)}${x}</mrow></msup>`) },
      ],
    },
    {
      id: "explain",
      label: "Forklar kort, hvorfor svaret har to bidrag, og hvor faktoren to i det andet bidrag kommer fra",
      type: "text",
      points: 3,
      checklist: [
        "Forklar, at den samlede forskrift er et produkt med to ændrende faktorer.",
        "Beskriv de to produktbidrag.",
        "Knyt faktoren to til eksponentens afledte.",
      ],
      concepts: ["to faktorer", "to bidrag", "indre afledte", "eksponent"],
    },
  ],
  hints: [
    "Se først på det yderste regnetegn; derefter på eksponentialfaktorens eksponent.",
    "Skriv to produktbidrag. Differentier eksponentialfaktoren separat i det andet bidrag.",
    `Eksponenten ${math(`${n(2)}${x}`)} giver en ekstra faktor ${math(n(2))}.`,
  ],
  solution: `<ol><li>Sæt ${math(`<mi>u</mi><mo>=</mo>${power(x, 2)}<mo>+</mo>${n(1)}`)} og ${math(`<mi>v</mi><mo>=</mo><msup><mi>e</mi><mrow>${n(2)}${x}</mrow></msup>`)}.</li><li>Da er ${math(`<msup><mi>u</mi><mo>′</mo></msup><mo>=</mo>${n(2)}${x}`)} og ${math(`<msup><mi>v</mi><mo>′</mo></msup><mo>=</mo>${n(2)}<msup><mi>e</mi><mrow>${n(2)}${x}</mrow></msup>`)}.</li><li>De to produktbidrag giver den første svarmulighed. Faktoren to i det andet bidrag kommer fra eksponentens afledte.</li></ol>`,
  errors: [
    { part: "derivative", answer: "multiplied", feedback: "Du har ganget de to afledede sammen. Den ydre produktstruktur kræver en sum med to bidrag." },
    { part: "derivative", feedback: "Brug to produktbidrag, og differentier eksponentialfaktoren med dens indre eksponent." },
    { part: "explain", feedback: "Peg både på produktets to faktorer og på eksponentens indre afledte." },
  ],
};

const chainModel = {
  id: "diff3.model-meaning",
  version: 1,
  topic: "differentiation",
  module: "diff.3",
  goals: ["diff.chain-model"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "short",
  minutes: 4,
  aids: false,
  prompt: `<p>En radioaktiv masse ${math(`<mi>M</mi><mo>(</mo><mi>t</mi><mo>)</mo>`)} måles i gram, og tiden ${math(`<mi>t</mi>`)} måles i timer. En beregning giver ${math(`<msup><mi>M</mi><mo>′</mo></msup><mo>(</mo>${n(4)}<mo>)</mo><mo>≈</mo><mo>−</mo><mn>0,38</mn>`)}. Hvilken konklusion er korrekt?</p>`,
  parts: [
    {
      id: "meaning",
      label: "Vælg fortolkningen",
      type: "choice",
      answer: "decay",
      points: 2,
      options: [
        { id: "decay", label: "Efter fire timer aftager massen med cirka 0,38 gram pr. time." },
        { id: "mass", label: "Efter fire timer er massen cirka 0,38 gram." },
      ],
    },
  ],
  hints: ["Den afledte er en hastighed, ikke den oprindelige størrelse.", "Fortegn, tidspunkt og enhed skal alle med."],
  solution: `<p>Den afledte måles i gram pr. time. Minusset betyder aftagende masse, og inputtet fire angiver tidspunktet. Derfor er den første fortolkning korrekt.</p>`,
  errors: [
    { part: "meaning", answer: "mass", feedback: "Du har fortolket en afledt værdi som selve massen. En afledt har enheden gram pr. time." },
    { part: "meaning", feedback: "Læs værdien som ændring pr. tidsenhed og brug fortegnet til retningen." },
  ],
};

const tangentTemplate = {
  id: "diff4.tangent",
  version: 1,
  generate(random) {
    const a = nonZero(random, -3, 3);
    const b = nonZero(random, -5, 5);
    const c = integer(random, -7, 7);
    const input = integer(random, -3, 3);
    const y = a * input ** 2 + b * input + c;
    const slope = 2 * a * input + b;
    const intercept = y - slope * input;
    return {
      id: "diff4.tangent",
      version: 1,
      topic: "differentiation",
      module: "diff.4",
      goals: ["diff.tangent"],
      prerequisites: ["diff.1"],
      difficulty: 2,
      size: "medium",
      minutes: 7,
      aids: false,
      prompt: `<p>Grafen for ${functionDefinition("f", polynomialBody([[a, 2], [b, 1], [c, 0]]))} har en tangent ved inputtet ${math(n(input))}. Bestem tangentens forskrift på formen ${math(`<mi>y</mi><mo>=</mo><mi>m</mi>${x}<mo>+</mo><mi>k</mi>`)}.</p>`,
      parts: [
        { id: "slope", label: math(`<mi>m</mi>`), type: "number", answer: String(slope), points: 2 },
        { id: "intercept", label: math(`<mi>k</mi>`), type: "number", answer: String(intercept), points: 2 },
      ],
      hints: [
        "Du skal kende både røringspunktet og tangentens hældning.",
        `Beregn ${math(`<mi>f</mi><mo>(</mo>${n(input)}<mo>)</mo>`)} og ${math(`<msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${n(input)}<mo>)</mo>`)} hver for sig.`,
        `Brug derefter punkt-hældningsformen ${math(`<mi>y</mi><mo>=</mo><mi>m</mi><mo>(</mo>${x}<mo>−</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo><mo>+</mo><msub><mi>y</mi><mn>0</mn></msub>`)}.`,
      ],
      solution: `<ol><li>Røringspunktets højde er ${math(`<mi>f</mi><mo>(</mo>${n(input)}<mo>)</mo><mo>=</mo>${n(y)}`)}.</li><li>${derivativeDefinition("f", polynomialBody([[2 * a, 1], [b, 0]]))}, så hældningen er ${math(n(slope))}.</li><li>Punkt-hældningsformen giver ${math(`<mi>y</mi><mo>=</mo>${n(slope)}<mo>(</mo>${x}<mo>−</mo><mo>(</mo>${n(input)}<mo>)</mo><mo>)</mo>${signed(y)}`)}.</li><li>Efter omskrivning er tangenten ${math(`<mi>y</mi><mo>=</mo>${n(slope)}${x}${signed(intercept)}`)}.</li></ol>`,
      errors: [
        { part: "slope", answer: String(y), feedback: "Du har brugt funktionsværdien som hældning. Hældningen findes i den afledte funktion." },
        { part: "slope", feedback: "Differentier først og indsæt røringsstedets input i den afledte." },
        { part: "intercept", answer: String(y), feedback: "Funktionsværdien er punktets højde, men ikke nødvendigvis tangentens skæring med andenaksen." },
        { part: "intercept", feedback: "Indsæt røringspunkt og hældning i punkt-hældningsformen og isolér konstantleddet." },
      ],
      parameters: { a, b, c, input, y, slope, intercept },
    };
  },
};

const inflectionTemplate = {
  id: "diff4.inflection-tangent",
  version: 1,
  generate(random) {
    const a = pick(random, [-2, -1, 1, 2]);
    const root = integer(random, -3, 3);
    const slope = nonZero(random, -5, 5);
    const height = integer(random, -6, 6);
    const intercept = height - slope * root;
    const shifted = `${x}<mo>${root < 0 ? "+" : "−"}</mo>${n(Math.abs(root))}`;
    const body = `${n(a)}${power(shifted, 3)}${slope < 0 ? "<mo>−</mo>" : "<mo>+</mo>"}${n(Math.abs(slope))}<mo>(</mo>${shifted}<mo>)</mo>${height < 0 ? "<mo>−</mo>" : "<mo>+</mo>"}${n(Math.abs(height))}`;
    return {
      id: "diff4.inflection-tangent",
      version: 1,
      topic: "differentiation",
      module: "diff.4",
      goals: ["diff.inflection", "diff.tangent"],
      prerequisites: ["diff.1", "diff.3"],
      difficulty: 3,
      size: "complex",
      minutes: 11,
      aids: false,
      prompt: `<p>For ${functionDefinition("f", body)} skal du undersøge punktet, hvor grafens krumning skifter, og bestemme linjen, der rører grafen dér.</p>`,
      parts: [
        { id: "point", label: "Punktets koordinater", type: "tuple", answer: [root, height], components: [math(x), math(`<mi>y</mi>`)], partial: true, points: 2 },
        { id: "line", label: "Linjens forskrift", type: "expression", answer: `${slope}*x+${intercept}`, points: 4 },
        {
          id: "check",
          label: "Hvad skal kontrolleres omkring kandidaten?",
          type: "choice",
          answer: "sign",
          points: 2,
          options: [
            { id: "sign", label: "At den anden afledte skifter fortegn." },
            { id: "zero", label: "At den første afledte er nul." },
          ],
        },
      ],
      hints: [
        "Bestem først den anden afledte og dens nulpunkt.",
        `Den kubiske del er centreret omkring ${math(n(root))}. Ved dette input forsvinder alle led med parentesen.`,
        "Find punktets højde og den første afledte værdi, og brug derefter punkt-hældningsformen.",
      ],
      solution: `<ol><li>Den anden afledte er ${math(`${n(6 * a)}<mo>(</mo>${shifted}<mo>)</mo>`)}. Den er nul ved ${math(`${x}<mo>=</mo>${n(root)}`)} og skifter fortegn, fordi faktoren er lineær med ikke-nul koefficient.</li><li>Ved dette input er punktet ${math(`<mo>(</mo>${n(root)}<mo>;</mo>${n(height)}<mo>)</mo>`)}.</li><li>Den første afledte består af et kvadratisk led, der bliver nul i punktet, samt ${math(n(slope))}. Tangenthældningen er derfor ${math(n(slope))}.</li><li>Linjen er ${math(`<mi>y</mi><mo>=</mo>${n(slope)}<mo>(</mo>${x}<mo>−</mo><mo>(</mo>${n(root)}<mo>)</mo><mo>)</mo>${signed(height)}<mo>=</mo>${n(slope)}${x}${signed(intercept)}`)}.</li></ol>`,
      errors: [
        { part: "point", feedback: "Nulpunktet for anden afledte giver først inputkoordinaten; find derefter højden i den oprindelige funktion." },
        { part: "line", feedback: "Brug den første afledte til hældningen og selve funktionen til punktets højde." },
        { part: "check", answer: "zero", feedback: "En vendetangent behøver ikke være vandret. Det afgørende er skiftet i krumning." },
        { part: "check", feedback: "Et nulpunkt for anden afledte er kun en kandidat; kontrollér fortegn på begge sider." },
      ],
      parameters: { a, root, slope, height, intercept },
    };
  },
};

const inflectionCheck = {
  id: "diff4.inflection-check",
  version: 1,
  topic: "differentiation",
  module: "diff.4",
  goals: ["diff.inflection"],
  prerequisites: ["diff.1"],
  difficulty: 1,
  size: "short",
  minutes: 3,
  aids: false,
  prompt: `<p>En beregning giver ${math(`<msup><mi>f</mi><mo>″</mo></msup><mo>(</mo>${n(2)}<mo>)</mo><mo>=</mo>${n(0)}`)}. Hvilken yderligere oplysning dokumenterer, at grafen har et vendepunkt ved dette input?</p>`,
  parts: [
    {
      id: "condition",
      label: "Vælg betingelsen",
      type: "choice",
      answer: "sign",
      points: 2,
      options: [
        { id: "sign", label: "Den anden afledte skifter fortegn omkring inputtet." },
        { id: "height", label: "Funktionsværdien er også nul." },
      ],
    },
  ],
  hints: ["Et vendepunkt handler om en ændring i krumning.", "Undersøg anden afledte på hver side af kandidaten."],
  solution: `<p>Ligningen ${math(`<msup><mi>f</mi><mo>″</mo></msup><mo>(</mo>${n(2)}<mo>)</mo><mo>=</mo>${n(0)}`)} finder kun en kandidat. Et fortegnsskift i anden afledte viser, at grafen går fra opadkrummet til nedadkrummet eller omvendt. Punktets højde behøver ikke være nul.</p>`,
  errors: [
    { part: "condition", answer: "height", feedback: "Et vendepunkt kan ligge både over og under førsteaksen. Det er krumningen, der skal skifte." },
    { part: "condition", feedback: "Kontrollér fortegnet for anden afledte på begge sider af kandidaten." },
  ],
};

const parallelTangent = {
  id: "diff4.parallel",
  version: 1,
  topic: "differentiation",
  module: "diff.4",
  goals: ["diff.parallel"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "medium",
  minutes: 6,
  aids: false,
  prompt: `<p>Grafen for ${functionDefinition("f", `${power(x, 3)}<mo>−</mo>${n(3)}${power(x, 2)}<mo>+</mo>${x}`)} har ved inputtet ${math(n(0))} en tangent med hældning ${math(n(1))}. Bestem det andet input, hvor tangenten er parallel med denne.</p>`,
  parts: [
    { id: "input", label: "Det andet input", type: "number", answer: "2", points: 3 },
  ],
  hints: [
    "Parallelle tangenter har samme hældning.",
    `Bestem den afledte og løs ligningen ${math(`<msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(1)}`)}.`,
  ],
  solution: `<ol><li>${derivativeDefinition("f", `${n(3)}${power(x, 2)}<mo>−</mo>${n(6)}${x}<mo>+</mo>${n(1)}`)}.</li><li>Sæt hældningen lig én: ${math(`${n(3)}${power(x, 2)}<mo>−</mo>${n(6)}${x}<mo>+</mo>${n(1)}<mo>=</mo>${n(1)}`)}.</li><li>Det giver ${math(`${n(3)}${x}<mo>(</mo>${x}<mo>−</mo>${n(2)}<mo>)</mo><mo>=</mo>${n(0)}`)} og løsningerne ${math(`${x}<mo>=</mo>${n(0)}`)} og ${math(`${x}<mo>=</mo>${n(2)}`)}. Den første er kendt, så det andet input er to.</li></ol>`,
  errors: [
    { part: "input", answer: "0", feedback: "Dette er det allerede kendte røringssted. Ligningen har endnu en løsning." },
    { part: "input", feedback: "Løs ligningen for samme afledte værdi og fjern det røringssted, opgaven allerede giver." },
  ],
};

const secondIntersection = {
  id: "diff4.second-intersection",
  version: 1,
  topic: "differentiation",
  module: "diff.4",
  goals: ["diff.intersection", "diff.tangent"],
  prerequisites: ["eq.basic", "diff.1"],
  difficulty: 3,
  size: "complex",
  minutes: 9,
  aids: false,
  prompt: `<p>Linjen ${math(`<mi>y</mi><mo>=</mo>${n(8)}${x}<mo>−</mo>${n(16)}`)} rører grafen for ${functionDefinition("f", `${power(x, 3)}<mo>−</mo>${n(4)}${x}`)} ved inputtet ${math(n(2))}. Linjen og grafen mødes også ét andet sted. Bestem dette punkt.</p>`,
  parts: [
    { id: "point", label: "Det andet skæringspunkt", type: "tuple", answer: [-4, -48], components: [math(x), math(`<mi>y</mi>`)], partial: true, points: 4 },
  ],
  hints: [
    "I et skæringspunkt har grafen og linjen samme højde.",
    `Løs ${math(`${power(x, 3)}<mo>−</mo>${n(4)}${x}<mo>=</mo>${n(8)}${x}<mo>−</mo>${n(16)}`)}.`,
    `Den kendte løsning ${math(`${x}<mo>=</mo>${n(2)}`)} forekommer dobbelt, fordi linjen er tangent. Find den resterende faktor.`,
  ],
  solution: `<ol><li>Sæt forskrifterne lig hinanden: ${math(`${power(x, 3)}<mo>−</mo>${n(12)}${x}<mo>+</mo>${n(16)}<mo>=</mo>${n(0)}`)}.</li><li>Polynomiet faktoriseres som ${math(`<mo>(</mo>${x}<mo>−</mo>${n(2)}<msup><mo>)</mo><mn>2</mn></msup><mo>(</mo>${x}<mo>+</mo>${n(4)}<mo>)</mo><mo>=</mo>${n(0)}`)}.</li><li>Det nye input er ${math(`${x}<mo>=</mo><mo>−</mo>${n(4)}`)}. Linjen giver ${math(`<mi>y</mi><mo>=</mo>${n(8)}<mo>·</mo><mo>(</mo><mo>−</mo>${n(4)}<mo>)</mo><mo>−</mo>${n(16)}<mo>=</mo><mo>−</mo>${n(48)}`)}.</li><li>Det andet skæringspunkt er ${math(`<mo>(</mo><mo>−</mo>${n(4)}<mo>;</mo><mo>−</mo>${n(48)}<mo>)</mo>`)}.</li></ol>`,
  errors: [
    { part: "point", feedback: "Sæt linjens og grafens forskrifter lig hinanden, fjern den kendte dobbelte løsning, og beregn derefter højden." },
  ],
};

const greatestGrowth = {
  id: "diff4.greatest-growth",
  version: 1,
  topic: "differentiation",
  module: "diff.4",
  goals: ["diff.greatest-growth", "diff.inflection"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "short",
  minutes: 4,
  aids: false,
  prompt: `<p>En voksende logistisk model har et vendepunkt ved tiden ${math(`<mi>t</mi><mo>=</mo><msub><mi>t</mi><mn>0</mn></msub>`)}. Hvad beskriver tidspunktet?</p>`,
  parts: [
    {
      id: "meaning",
      label: "Vælg konklusionen",
      type: "choice",
      answer: "rate",
      points: 2,
      options: [
        { id: "rate", label: "Modellens væksthastighed er størst på dette tidspunkt." },
        { id: "value", label: "Modellen har sin største funktionsværdi på dette tidspunkt." },
      ],
    },
  ],
  hints: ["Ved vendepunktet skifter grafens krumning.", "Se på, hvad der sker med den første afledte før og efter tidspunktet."],
  solution: `<p>Før vendepunktet vokser hældningerne; efter vendepunktet aftager de. Den første afledte har derfor maksimum i vendepunktet. Selve modellen kan fortsætte med at vokse bagefter.</p>`,
  errors: [
    { part: "meaning", answer: "value", feedback: "Den logistiske funktion kan fortsætte med at vokse. Det er væksthastigheden, ikke nødvendigvis funktionsværdien, der topper i vendepunktet." },
    { part: "meaning", feedback: "Forbind krumningsskiftet med et maksimum for den første afledte." },
  ],
};

const monotonicityTemplate = {
  id: "diff5.monotonicity",
  version: 1,
  generate(random) {
    const first = integer(random, -5, 0);
    const second = integer(random, first + 2, 6);
    const factor = integer(random, 1, 4);
    const derivativeBody = `${n(factor)}<mo>(</mo>${x}<mo>${first < 0 ? "+" : "−"}</mo>${n(Math.abs(first))}<mo>)</mo><mo>(</mo>${x}<mo>${second < 0 ? "+" : "−"}</mo>${n(Math.abs(second))}<mo>)</mo>`;
    return {
      id: "diff5.monotonicity",
      version: 1,
      topic: "differentiation",
      module: "diff.5",
      goals: ["diff.monotonicity"],
      prerequisites: ["diff.1"],
      difficulty: 2,
      size: "medium",
      minutes: 6,
      aids: false,
      prompt: `<p>For en funktion gælder ${derivativeDefinition("f", derivativeBody)}. På hvilke intervaller er funktionen voksende?</p>`,
      parts: [
        {
          id: "intervals",
          label: "Vælg intervallerne",
          type: "choice",
          answer: "outside",
          points: 3,
          options: [
            { id: "outside", label: `${math(`<mo>]</mo><mo>−</mo><mi>∞</mi><mo>;</mo>${n(first)}<mo>[</mo>`)} og ${math(`<mo>]</mo>${n(second)}<mo>;</mo><mi>∞</mi><mo>[</mo>`)}` },
            { id: "inside", label: interval(first, second) },
          ],
        },
      ],
      hints: [
        "Nulpunkterne deler tallinjen i tre intervaller.",
        "Vælg ét testtal i hvert interval, og bestem fortegnet for de to faktorer.",
        "En positiv afledt betyder, at funktionen er voksende.",
      ],
      solution: `<ol><li>Den afledte er nul ved ${math(`${x}<mo>=</mo>${n(first)}`)} og ${math(`${x}<mo>=</mo>${n(second)}`)}.</li><li>Før den første rod er begge parenteser negative, så produktet er positivt. Mellem rødderne har parenteserne modsat fortegn, så produktet er negativt. Efter den anden rod er begge positive.</li><li>Funktionen er derfor voksende uden for de to rødder, som angivet i den første mulighed.</li></ol>`,
      errors: [
        { part: "intervals", answer: "inside", feedback: "Mellem rødderne har de to faktorer modsat fortegn, så den afledte er negativ dér." },
        { part: "intervals", feedback: "Lav tre fortegnskontroller og vælg de intervaller, hvor den afledte er positiv." },
      ],
      parameters: { first, second, factor },
    };
  },
};

const extremaTemplate = {
  id: "diff5.local-extrema",
  version: 1,
  generate(random) {
    const first = integer(random, -5, 0);
    const second = integer(random, first + 2, 6);
    const factor = integer(random, 1, 4);
    const derivativeBody = `${n(factor)}<mo>(</mo>${x}<mo>${first < 0 ? "+" : "−"}</mo>${n(Math.abs(first))}<mo>)</mo><mo>(</mo>${x}<mo>${second < 0 ? "+" : "−"}</mo>${n(Math.abs(second))}<mo>)</mo>`;
    return {
      id: "diff5.local-extrema",
      version: 1,
      topic: "differentiation",
      module: "diff.5",
      goals: ["diff.extrema", "diff.monotonicity"],
      prerequisites: ["diff.1"],
      difficulty: 2,
      size: "medium",
      minutes: 7,
      aids: false,
      prompt: `<p>For en funktion gælder ${derivativeDefinition("f", derivativeBody)}. Bestem de stationære input og deres typer.</p>`,
      parts: [
        { id: "roots", label: "De stationære input", type: "set", answer: [first, second], components: ["Første input", "Andet input"], partial: true, points: 2 },
        {
          id: "types",
          label: "Vælg den korrekte klassifikation",
          type: "choice",
          answer: "max-min",
          points: 3,
          options: [
            { id: "max-min", label: `${math(`${x}<mo>=</mo>${n(first)}`)} er lokalt maksimum, og ${math(`${x}<mo>=</mo>${n(second)}`)} er lokalt minimum.` },
            { id: "min-max", label: `${math(`${x}<mo>=</mo>${n(first)}`)} er lokalt minimum, og ${math(`${x}<mo>=</mo>${n(second)}`)} er lokalt maksimum.` },
          ],
        },
      ],
      hints: [
        "Stationære punkter findes, hvor den afledte er nul.",
        "Undersøg fortegnet før, mellem og efter de to rødder.",
        "Et skift fra positiv til negativ giver en top; det modsatte giver en bund.",
      ],
      solution: `<ol><li>Produktet er nul ved ${math(`${x}<mo>=</mo>${n(first)}`)} og ${math(`${x}<mo>=</mo>${n(second)}`)}.</li><li>Fortegnene er positiv, negativ, positiv i de tre intervaller.</li><li>Funktionen går derfor fra voksende til aftagende ved det første input og har lokalt maksimum. Ved det andet input går den fra aftagende til voksende og har lokalt minimum.</li></ol>`,
      errors: [
        { part: "roots", feedback: "Sæt hver af den afledtes faktorer lig nul. Begge løsninger skal med." },
        { part: "types", answer: "min-max", feedback: "Klassifikationen er vendt om. Positiv til negativ giver maksimum; negativ til positiv giver minimum." },
        { part: "types", feedback: "Lav et fortegnsskema for den afledte og læs grafens retning på hver side." },
      ],
      parameters: { first, second, factor },
    };
  },
};

const globalMaximum = {
  id: "diff5.global-maximum",
  version: 1,
  topic: "differentiation",
  module: "diff.5",
  goals: ["diff.global", "diff.extrema"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "medium",
  minutes: 7,
  aids: false,
  prompt: `<p>For ${functionDefinition("f", `${power(x, 3)}<mo>−</mo>${n(3)}${x}`)} betragtes kun intervallet ${closedInterval(0, 3)}. Bestem funktionens største værdi på intervallet.</p>`,
  parts: [
    { id: "value", label: "Den største funktionsværdi", type: "number", answer: "18", points: 3 },
    {
      id: "reason",
      label: "Forklar, hvilke input der skal sammenlignes, og hvorfor",
      type: "text",
      points: 3,
      checklist: [
        "Bestem stationære input i intervallet.",
        "Medtag begge endepunkter i sammenligningen.",
        "Sammenlign funktionsværdier og konkludér globalt.",
      ],
      concepts: ["stationære punkter", "endepunkter", "funktionsværdier", "globalt maksimum"],
    },
  ],
  hints: [
    "Et globalt ekstremum på et lukket interval kan ligge ved et endepunkt.",
    `Den afledte er ${math(`${n(3)}${power(x, 2)}<mo>−</mo>${n(3)}`)}. Find dens nulpunkter og behold dem, der ligger i intervallet.`,
    "Beregn funktionsværdien i alle kandidater og begge endepunkter.",
  ],
  solution: `<ol><li>${derivativeDefinition("f", `${n(3)}${power(x, 2)}<mo>−</mo>${n(3)}`)}. Nulpunkterne er ${math(`${x}<mo>=</mo><mo>−</mo>${n(1)}`)} og ${math(`${x}<mo>=</mo>${n(1)}`)}, men kun ét ligger i intervallet.</li><li>Sammenlign ${math(`<mi>f</mi><mo>(</mo>${n(0)}<mo>)</mo><mo>=</mo>${n(0)}`)}, ${math(`<mi>f</mi><mo>(</mo>${n(1)}<mo>)</mo><mo>=</mo><mo>−</mo>${n(2)}`)} og ${math(`<mi>f</mi><mo>(</mo>${n(3)}<mo>)</mo><mo>=</mo>${n(18)}`)}.</li><li>Den største værdi er derfor ${math(n(18))}, og den fås ved højre endepunkt.</li></ol>`,
  errors: [
    { part: "value", answer: "-2", feedback: "Du har valgt det stationære punkt, men et globalt maksimum kræver også kontrol af intervallets endepunkter." },
    { part: "value", feedback: "Sammenlign funktionsværdier i alle stationære kandidater inden for intervallet og ved begge endepunkter." },
    { part: "reason", feedback: "En fuld begrundelse skal både finde indre kandidater og kontrollere intervallets rand." },
  ],
};

const rectangleTemplate = {
  id: "diff5.rectangle",
  version: 1,
  generate(random) {
    const side = integer(random, 5, 14);
    const perimeter = 4 * side;
    const area = side ** 2;
    return {
      id: "diff5.rectangle",
      version: 1,
      topic: "differentiation",
      module: "diff.5",
      goals: ["diff.optimize", "diff.global"],
      prerequisites: ["eq.basic", "diff.1"],
      difficulty: 3,
      size: "complex",
      minutes: 12,
      aids: false,
      prompt: `<p>Et rektangel skal have omkreds ${math(`${n(perimeter)}<mtext> m</mtext>`)}. Lad ${math(x)} være længden af den ene side. Bestem de sidelængder, der giver det størst mulige areal, og begrund at løsningen er global.</p>`,
      parts: [
        { id: "model", label: "Arealet som funktion af sidelængden", type: "expression", answer: `x*(${2 * side}-x)`, points: 2 },
        { id: "sides", label: "De to sidelængder i meter", type: "tuple", answer: [side, side], components: ["Første side", "Anden side"], partial: true, points: 2 },
        { id: "area", label: "Det største areal i kvadratmeter", type: "number", answer: String(area), points: 2 },
        {
          id: "reason",
          label: "Begrund maksimum",
          type: "text",
          points: 3,
          checklist: [
            "Angiv det mulige interval for sidelængden.",
            "Find nulpunktet for arealfunktionens afledte.",
            "Vis fortegnsskift eller negativ anden afledte.",
            "Sammenhold med interval og enheder.",
          ],
          concepts: ["definitionsinterval", "målfunktion", "afledt", "globalt maksimum"],
        },
      ],
      hints: [
        "Skriv den anden side ud fra den halve omkreds.",
        `Hvis den ene side er ${math(x)}, er den anden ${math(`${n(2 * side)}<mo>−</mo>${x}`)}.`,
        "Find arealfunktionens stationære punkt, og kontrollér hele det mulige interval.",
      ],
      solution: `<ol><li>To nabosider udgør den halve omkreds, så den anden side er ${math(`${n(2 * side)}<mo>−</mo>${x}`)} og ${math(`${n(0)}<mo>&lt;</mo>${x}<mo>&lt;</mo>${n(2 * side)}`)}.</li><li>Arealet er ${math(`<mi>A</mi><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${x}<mo>(</mo>${n(2 * side)}<mo>−</mo>${x}<mo>)</mo>`)}.</li><li>${math(`<msup><mi>A</mi><mo>′</mo></msup><mo>(</mo>${x}<mo>)</mo><mo>=</mo>${n(2 * side)}<mo>−</mo>${n(2)}${x}`)} er nul ved ${math(`${x}<mo>=</mo>${n(side)}`)}.</li><li>Den afledte er positiv før og negativ efter dette input. Derfor fås det globale maksimum for et kvadrat med sidelængde ${math(`${n(side)}<mtext> m</mtext>`)} og areal ${math(`${n(area)}<mtext> m²</mtext>`)}.</li></ol>`,
      errors: [
        { part: "model", answer: `x*(${perimeter}-x)`, feedback: "Du har brugt hele omkredsen til kun to sider. To nabosider udgør halvdelen af omkredsen." },
        { part: "model", feedback: "Udtryk den anden side ved hjælp af den halve omkreds, og gang de to sidelængder." },
        { part: "sides", feedback: "Det stationære punkt giver den ene side; beregn derefter den anden fra omkredsbetingelsen." },
        { part: "area", answer: String(2 * area), feedback: "Kontrollér, at du beregner længde gange bredde og ikke ganger med to." },
        { part: "area", feedback: "Indsæt begge optimale sidelængder i arealformlen." },
        { part: "reason", feedback: "Et stationært punkt er kun en kandidat. Vis også, hvorfor arealet falder på den anden side eller brug krumning og interval." },
      ],
      parameters: { side, perimeter, area },
    };
  },
};

const casDomain = {
  id: "diff5.cas-domain",
  version: 1,
  topic: "differentiation",
  module: "diff.5",
  goals: ["diff.cas", "diff.optimize"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "short",
  minutes: 4,
  aids: true,
  prompt: `<p>En model gælder for ${closedInterval(0, 30)}. Et værktøj finder de stationære løsninger ${math(`${x}<mo>≈</mo><mo>−</mo><mn>3,54</mn>`)} og ${math(`${x}<mo>≈</mo><mn>23,54</mn>`)}. Hvilken videre behandling er fagligt korrekt?</p>`,
  parts: [
    {
      id: "decision",
      label: "Vælg konklusionen",
      type: "choice",
      answer: "relevant",
      points: 2,
      options: [
        { id: "relevant", label: "Behold kun den positive løsning som kandidat, og kontrollér den sammen med intervallets endepunkter." },
        { id: "both", label: "Brug begge løsninger i modellens konklusion, fordi værktøjet har fundet dem." },
      ],
    },
  ],
  hints: ["En algebraisk løsning er ikke automatisk gyldig i en model.", "Sammenhold alle løsninger med modellens interval, og husk randen ved globale ekstrema."],
  solution: `<p>Den negative løsning ligger uden for modellens definitionsinterval og forkastes med en begrundelse. Den positive løsning er en kandidat, men ved et globalt ekstremum på et lukket interval skal dens funktionsværdi også sammenlignes med værdierne ved begge endepunkter.</p>`,
  errors: [
    { part: "decision", answer: "both", feedback: "Værktøjet løser ligningen uden at kende modellens gyldige interval. Den negative løsning kan ikke bruges i modellen." },
    { part: "decision", feedback: "Kontrollér først definitionsintervallet og derefter alle relevante kandidater og endepunkter." },
  ],
};

const casDocumentation = {
  id: "diff5.cas-documentation",
  version: 1,
  topic: "differentiation",
  module: "diff.5",
  goals: ["diff.cas"],
  prerequisites: ["diff.1"],
  difficulty: 2,
  size: "medium",
  minutes: 5,
  aids: true,
  prompt: `<p>En beregning i et digitalt værktøj giver et decimaltal for en modelopgave. Hvilken dokumentation gør besvarelsen fagligt efterprøvbar?</p>`,
  parts: [
    {
      id: "report",
      label: "Vælg den bedste besvarelse",
      type: "choice",
      answer: "complete",
      points: 2,
      options: [
        { id: "complete", label: "Vis den afledte funktion, den løste ligning, relevant output, kontrol og en konklusion med enhed." },
        { id: "number", label: "Skriv kun det afrundede tal, som værktøjet viser." },
      ],
    },
    {
      id: "explain",
      label: "Forklar kort, hvorfor et korrekt tal ikke alene er tilstrækkeligt",
      type: "text",
      points: 3,
      checklist: [
        "Angiv, at læseren skal kunne se, hvad der er beregnet eller løst.",
        "Nævn kontrol af interval eller matematisk relevans.",
        "Knyt resultatet til modellens betydning og enhed.",
      ],
      concepts: ["dokumentation", "kontrol", "definitionsinterval", "enhed", "fortolkning"],
    },
  ],
  hints: [
    "Et værktøj kender ikke automatisk modellens betydning eller gyldige interval.",
    "En anden person skal kunne følge både input, matematisk beslutning og konklusion.",
  ],
  solution: `<p>Den første mulighed er fagligt fuldstændig. Et decimaltal alene viser ikke, hvilken ligning der er løst, om løsningen ligger i modellens interval, om den giver maksimum eller minimum, eller hvilken praktisk betydning og enhed resultatet har.</p>`,
  errors: [
    { part: "report", answer: "number", feedback: "Et isoleret tal viser hverken metode, relevans, kontrol eller modellens betydning." },
    { part: "report", feedback: "Vælg den besvarelse, hvor både beregning, kontrol og konklusion kan efterprøves." },
    { part: "explain", feedback: "Forklar både den matematiske efterprøvning og forbindelsen tilbage til modellen." },
  ],
};

export const differentiationTasks = [
  quotientChoice,
  secantTemplate,
  polynomialTemplate,
  derivativeValueTemplate,
  mixedRules,
  rateInterpretation,
  productRecognition,
  polynomialProductTemplate,
  logarithmProduct,
  exponentialProduct,
  productValueTemplate,
  areaRateTemplate,
  chainLayers,
  chainPowerTemplate,
  chainValueTemplate,
  exponentialChain,
  logarithmChain,
  sineChain,
  combinedRules,
  chainModel,
  tangentTemplate,
  inflectionTemplate,
  inflectionCheck,
  parallelTangent,
  secondIntersection,
  greatestGrowth,
  monotonicityTemplate,
  extremaTemplate,
  globalMaximum,
  rectangleTemplate,
  casDomain,
  casDocumentation,
];
