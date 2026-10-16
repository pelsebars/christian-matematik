import { math, n, x, power } from "../math.js";
const base = {
  version: 1,
  aids: false,
  prerequisites: [],
  difficulty: 1,
  size: "short",
  minutes: 3,
};
export const algebraTasks = [
  {
    id: "eq.balance",
    version: 1,
    generate(random) {
      const a = 2 + Math.floor(random() * 5),
        root = 1 + Math.floor(random() * 8),
        b = 1 + Math.floor(random() * 9),
        c = a * root + b;
      return {
        ...base,
        id: "eq.balance",
        topic: "equations",
        module: "eq.basic",
        goals: ["eq.isolate"],
        prompt: `<p>Find den ukendte i ${math(`${n(a)}${x}<mo>+</mo>${n(b)}<mo>=</mo>${n(c)}`)}.</p>`,
        parts: [
          {
            id: "x",
            label: "Den ukendtes værdi",
            type: "number",
            answer: String(root),
            points: 2,
            tolerance: 1e-9,
          },
        ],
        hints: [
          "Gør den samme ændring på begge sider.",
          `Træk ${math(n(b))} fra på begge sider, og divider derefter med ${math(n(a))}.`,
        ],
        solution: `<ol><li>Træk konstantleddet fra: ${math(`${n(a)}${x}<mo>=</mo>${n(c - b)}`)}.</li><li>Divider begge sider: ${math(`${x}<mo>=</mo><mfrac>${n(c - b)}${n(a)}</mfrac><mo>=</mo>${n(root)}`)}.</li><li>Kontrol: ${math(`${n(a)}<mo>·</mo>${n(root)}<mo>+</mo>${n(b)}<mo>=</mo>${n(c)}`)}.</li></ol>`,
        errors: [
          {
            part: "x",
            answer: String(c - b),
            feedback:
              "Du har fjernet konstantleddet. Husk også at dividere begge sider med koefficienten.",
          },
          {
            part: "x",
            feedback:
              "Fjern først konstantleddet på begge sider. Divider derefter, og kontrollér ved indsættelse.",
          },
        ],
        parameters: { a, b, c, root },
      };
    },
  },
  {
    ...base,
    id: "quad.two-roots",
    topic: "quadratic",
    module: "quad.basic",
    goals: ["quad.roots"],
    difficulty: 2,
    size: "medium",
    minutes: 6,
    prerequisites: ["eq.basic"],
    prompt: `<p>Undersøg og løs ${math(`${power(x, 2)}<mo>−</mo>${n(5)}${x}<mo>+</mo>${n(6)}<mo>=</mo>${n(0)}`)}.</p>`,
    parts: [
      {
        id: "d",
        label: "a. Hvor mange forskellige reelle løsninger findes der?",
        type: "number",
        answer: "2",
        points: 2,
      },
      {
        id: "roots",
        label: "b. Angiv alle reelle løsninger",
        type: "set",
        components: ["Første løsning", "Anden løsning"],
        answer: [2, 3],
        partial: true,
        points: 2,
      },
    ],
    hints: [
      "Skriv koefficienterne ned med deres fortegn.",
      `Brug ${math(`${power("<mi>b</mi>", 2)}<mo>−</mo>${n(4)}<mi>a</mi><mi>c</mi>`)}. En positiv værdi giver to reelle løsninger.`,
    ],
    solution: `<ol><li>Koefficienterne er ${math(`<mi>a</mi><mo>=</mo>${n(1)}<mo>,</mo><mi>b</mi><mo>=</mo>${n(-5)}<mo>,</mo><mi>c</mi><mo>=</mo>${n(6)}`)}.</li><li>Diskriminanten er ${math(`${power(n(-5), 2)}<mo>−</mo>${n(4)}<mo>·</mo>${n(1)}<mo>·</mo>${n(6)}<mo>=</mo>${n(1)}`)}.</li><li>${math(`${x}<mo>=</mo><mfrac><mrow>${n(5)}<mo>±</mo><msqrt>${n(1)}</msqrt></mrow>${n(2)}</mfrac><mo>∈</mo><mo>{</mo>${n(2)}<mo>;</mo>${n(3)}<mo>}</mo>`)}.</li><li>Kontrol: ${math(`${n(4)}<mo>−</mo>${n(10)}<mo>+</mo>${n(6)}<mo>=</mo>${n(0)}`)} og ${math(`${n(9)}<mo>−</mo>${n(15)}<mo>+</mo>${n(6)}<mo>=</mo>${n(0)}`)}.</li></ol>`,
    errors: [
      {
        part: "d",
        feedback:
          "Antallet afhænger af diskriminantens fortegn. En positiv diskriminant giver to forskellige reelle løsninger.",
      },
      {
        part: "roots",
        feedback:
          "Der er to forskellige reelle løsninger. Kontrollér begge ved indsættelse.",
      },
    ],
  },
];
