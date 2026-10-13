import { math, n, x, power, tuple } from "../math.js";
const base = {
  version: 1,
  topic: "planeGeometry",
  prerequisites: ["geo.1"],
  difficulty: 2,
  size: "short",
  minutes: 3,
  aids: false,
};
export const geometryTasks = [
  {
    ...base,
    id: "geo.walk",
    module: "geo.1",
    goals: ["geo.vector"],
    prerequisites: [],
    size: "medium",
    minutes: 6,
    prompt: `<p>To punkter er ${math(`<mi>A</mi><mo>=</mo><mo>(</mo>${n(1)}<mo>;</mo>${n(1)}<mo>)</mo>`)} og ${math(`<mi>B</mi><mo>=</mo><mo>(</mo>${n(4)}<mo>;</mo>${n(5)}<mo>)</mo>`)}. Bestem flytningen fra det første punkt til det andet og dens længde.</p>`,
    figure: `<figure class="task-figure"><svg viewBox="0 0 360 280" role="img" aria-label="Koordinatsystem med A ved en, en og B ved fire, fem. En pil går fra A til B."><path d="M40 15V240H340" fill="none" stroke="#536078" stroke-width="2"/><path d="M85 200L220 40L211 65M220 40L197 52" fill="none" stroke="#1f6feb" stroke-width="3"/><circle cx="85" cy="200" r="5" fill="#147d69"/><circle cx="220" cy="40" r="5" fill="#147d69"/><text x="66" y="217">A</text><text x="230" y="40">B</text><text x="331" y="261">x</text><text x="20" y="20">y</text>${[1, 2, 3, 4, 5, 6].map((i) => `<text x="${40 + i * 45}" y="261">${i}</text>`).join("")}${[1, 2, 3, 4, 5].map((i) => `<text x="20" y="${245 - i * 40}">${i}</text>`).join("")}</svg><figcaption>Pilen viser flytningen fra det første punkt til det andet.</figcaption></figure>`,
    parts: [
      {
        id: "vector",
        label: "a. Flytningens to koordinater",
        type: "tuple",
        components: ["Vandret koordinat", "Lodret koordinat"],
        answer: [3, 4],
        partial: true,
        points: 2,
      },
      {
        id: "length",
        label: "b. Flytningens længde",
        type: "number",
        answer: "5",
        points: 2,
        tolerance: 1e-8,
      },
    ],
    hints: [
      "Træk startpunktets koordinater fra slutpunktets.",
      `Længden findes med Pythagoras på den vandrette og lodrette flytning.`,
    ],
    solution: `<ol><li>Træk koordinaterne fra: ${math(`<mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>→</mo></mover><mo>=</mo><mo>(</mo>${n(4)}<mo>−</mo>${n(1)}<mo>;</mo>${n(5)}<mo>−</mo>${n(1)}<mo>)</mo>`)}. Det giver ${tuple([3, 4])}.</li><li>Længden er ${math(`<msqrt><mrow>${power(n(3), 2)}<mo>+</mo>${power(n(4), 2)}</mrow></msqrt><mo>=</mo><msqrt>${n(25)}</msqrt><mo>=</mo>${n(5)}`)}.</li></ol>`,
    errors: [
      {
        part: "vector",
        feedback:
          "Brug slutpunkt minus startpunkt i begge koordinater. Den modsatte rækkefølge vender pilen.",
      },
      {
        part: "length",
        answer: "25",
        feedback: "Du har fundet længdens kvadrat. Tag også kvadratroden.",
      },
      {
        part: "length",
        feedback: "Kvadrér hver koordinat, læg sammen og tag kvadratroden.",
      },
    ],
  },
  {
    ...base,
    id: "geo.angle",
    module: "geo.2",
    goals: ["geo.angle"],
    difficulty: 1,
    prompt: `<p>To vektorer har koordinaterne ${tuple([2, 1])} og ${tuple([-1, 3])}. Hvilken type er vinklen mellem dem?</p>`,
    parts: [
      {
        id: "angle",
        label: "Vælg vinklens type",
        type: "choice",
        options: [
          { id: "acute", label: "Spids" },
          { id: "right", label: "Ret" },
          { id: "obtuse", label: "Stump" },
        ],
        answer: "acute",
        points: 2,
      },
    ],
    hints: [
      "Beregn ét tal ved at gange de vandrette koordinater og de lodrette koordinater parvis og lægge sammen.",
      "Fortegnet på skalarproduktet fortæller, om vinklen er spids, ret eller stump.",
    ],
    solution: `<ol><li>Skalarproduktet er ${math(`${n(2)}<mo>·</mo>${n(-1)}<mo>+</mo>${n(1)}<mo>·</mo>${n(3)}<mo>=</mo>${n(1)}`)}.</li><li>Det er positivt. Da begge vektorer er forskellige fra nulvektoren, er cosinus positiv, og vinklen er spids.</li></ol>`,
    errors: [
      {
        part: "angle",
        answer: "right",
        feedback:
          "En ret vinkel kræver, at skalarproduktet er nul. Her er det positivt.",
      },
      {
        part: "angle",
        feedback:
          "Det samlede skalarprodukt bestemmer vinklen, ikke fortegnet på en enkelt koordinat.",
      },
    ],
  },
  {
    ...base,
    id: "geo.distance",
    module: "geo.4",
    goals: ["geo.line"],
    prerequisites: ["geo.1", "geo.2"],
    minutes: 4,
    prompt: `<p>Find den korteste afstand fra origo til linjen ${math(`${n(3)}${x}<mo>+</mo>${n(4)}<mi>y</mi><mo>−</mo>${n(10)}<mo>=</mo>${n(0)}`)}.</p>`,
    parts: [
      {
        id: "distance",
        label: "Den korteste afstand",
        type: "number",
        answer: "2",
        points: 3,
        tolerance: 0.001,
      },
    ],
    hints: [
      "Korteste afstand måles vinkelret på linjen.",
      "Brug punkt–linje-formlen. Nævneren er længden af normalvektoren.",
    ],
    solution: `<ol><li>Normalvektoren har koordinaterne ${tuple([3, 4])} og længden ${math(`<msqrt><mrow>${power(n(3), 2)}<mo>+</mo>${power(n(4), 2)}</mrow></msqrt><mo>=</mo>${n(5)}`)}.</li><li>Indsæt origos koordinater i afstandsformlen: ${math(`<mi>d</mi><mo>=</mo><mfrac><mrow><mo>|</mo>${n(3)}<mo>·</mo>${n(0)}<mo>+</mo>${n(4)}<mo>·</mo>${n(0)}<mo>−</mo>${n(10)}<mo>|</mo></mrow>${n(5)}</mfrac><mo>=</mo>${n(2)}`)}.</li></ol>`,
    errors: [
      {
        part: "distance",
        answer: "-2",
        feedback:
          "En afstand kan ikke være negativ. Brug absolutværdien i tælleren.",
      },
      {
        part: "distance",
        feedback:
          "Divider absolutværdien af linjeudtrykket i punktet med normalvektorens længde.",
      },
    ],
  },
  {
    ...base,
    id: "geo.fountain",
    module: "geo.5",
    goals: ["geo.circle"],
    prerequisites: ["geo.1", "geo.4"],
    difficulty: 3,
    size: "complex",
    minutes: 12,
    aids: true,
    prompt: `<p>En rund fontæne skal tegnes på en plan med koordinater i meter. Kanten beskrives af ${math(`${power(`${x}<mo>−</mo>${n(2)}`, 2)}<mo>+</mo>${power("<mi>y</mi><mo>+</mo>" + n(1), 2)}<mo>=</mo>${n(25)}`)}. En lige gang skal røre kanten i det østligste punkt og må ikke gå ind over fontænen.</p><p>Find centrum og radius. Find derefter gangens placering som en lodret linje, og begrund hvorfor den netop rører kanten.</p>`,
    parts: [
      {
        id: "center",
        label: "a. Fontænens centrum",
        type: "tuple",
        components: ["Vandret koordinat", "Lodret koordinat"],
        answer: [2, -1],
        partial: true,
        points: 2,
      },
      {
        id: "radius",
        label: "b. Radius i meter",
        type: "number",
        answer: "5",
        points: 2,
      },
      {
        id: "line",
        label: "c. Gangens faste vandrette koordinat",
        type: "number",
        answer: "7",
        points: 2,
      },
      {
        id: "reason",
        label: "d. Begrund gangens placering",
        type: "text",
        points: 2,
        checklist: [
          "Bestem det østligste punkt ud fra centrum og radius.",
          "Forklar, at radius til punktet er vandret.",
          "Forklar, at gangen står vinkelret på radius og kun har ét fælles punkt med cirklen.",
        ],
        concepts: ["radius", "tangent", "vinkelret", "røringspunkt"],
      },
    ],
    hints: [
      "Ligningen angiver afstand til centrum. Radius er kvadratroden af højresiden.",
      "Det østligste punkt ligger én radius til højre for centrum. En tangent står vinkelret på radius.",
    ],
    solution: `<ol><li>Centrum er ${tuple([2, -1])}. Fortegnet i parentesen er modsat centrumkoordinaten.</li><li>Radius er ${math(`<msqrt>${n(25)}</msqrt><mo>=</mo>${n(5)}`)} meter.</li><li>Det østligste punkt er ${tuple([7, -1])}, da ${math(`${n(2)}<mo>+</mo>${n(5)}<mo>=</mo>${n(7)}`)}.</li><li>Radius er vandret, så tangenten er lodret: ${math(`${x}<mo>=</mo>${n(7)}`)}. Indsættelse giver ${math(`${n(25)}<mo>+</mo>${power("<mi>y</mi><mo>+</mo>" + n(1), 2)}<mo>=</mo>${n(25)}`)}, altså kun ${math(`<mi>y</mi><mo>=</mo>${n(-1)}`)}. Gangen har præcis ét fælles punkt med kanten.</li></ol>`,
    errors: [
      {
        part: "center",
        feedback:
          "Centrum har modsat fortegn af konstantleddet i hver parentes.",
      },
      {
        part: "radius",
        answer: "25",
        feedback: "Højresiden er radius i anden. Tag kvadratroden.",
      },
      {
        part: "line",
        feedback:
          "Gå én radius til højre fra centrum for at finde det østligste punkt.",
      },
      {
        part: "reason",
        feedback:
          "Forbind den vandrette radius med den lodrette tangent, og forklar hvorfor der kun er ét røringspunkt.",
      },
    ],
  },
];
