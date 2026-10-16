import { math, n, x, power } from "../math.js";

const y = "<mi>y</mi>";
const pick = (random, values) => values[Math.floor(random() * values.length)];
const integer = (random, min, max) => min + Math.floor(random() * (max - min + 1));
const nonzero = (random, min = -6, max = 6) => {
  let value = 0;
  while (!value) value = integer(random, min, max);
  return value;
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const primitive = ([a, b]) => {
  const d = gcd(a, b);
  return [a / d, b / d];
};
const clean = (value, digits = 10) => Number(value.toFixed(digits));
const mnum = (value) => `<mn>${String(value).replace(".", ",")}</mn>`;
const coordBody = ([a, b]) => `<mo>(</mo><mtable><mtr><mtd>${n(a)}</mtd></mtr><mtr><mtd>${n(b)}</mtd></mtr></mtable><mo>)</mo>`;
const coord = (values) => math(coordBody(values));
const point = (name, [a, b]) => math(`<mi>${name}</mi><mo>(</mo>${n(a)}<mo>;</mo>${n(b)}<mo>)</mo>`);
const vec = (name) => `<mover><mi>${name}</mi><mo>→</mo></mover>`;
const vector = (name, values) => math(`${vec(name)}<mo>=</mo>${coordBody(values)}`);
const arrow = (from, to) => `<mover><mrow><mi>${from}</mi><mi>${to}</mi></mrow><mo>→</mo></mover>`;
const frac = (top, bottom) => `<mfrac><mrow>${top}</mrow><mrow>${bottom}</mrow></mfrac>`;
const root = (body) => `<msqrt><mrow>${body}</mrow></msqrt>`;
const abs = (body) => `<mo>|</mo>${body}<mo>|</mo>`;
const firstTerm = (value, body) => `${value < 0 ? "<mo>−</mo>" : ""}${Math.abs(value) === 1 ? "" : n(Math.abs(value))}${body}`;
const signed = (value, body = "") => value === 0 ? "" : `${value < 0 ? "<mo>−</mo>" : "<mo>+</mo>"}${Math.abs(value) === 1 && body ? "" : n(Math.abs(value))}${body}`;
const lineBody = (a, b, c = 0) => `${firstTerm(a, x)}${signed(b, y)}${signed(c)}<mo>=</mo>${n(0)}`;
const difference = (variable, center) => center === 0 ? variable : `${variable}${center > 0 ? "<mo>−</mo>" : "<mo>+</mo>"}${n(Math.abs(center))}`;
const circleBody = (h, k, r2) => `${power(difference(x, h), 2)}<mo>+</mo>${power(difference(y, k), 2)}<mo>=</mo>${n(r2)}`;
const expandedCircleBody = (h, k, r) => `${power(x, 2)}<mo>+</mo>${power(y, 2)}${signed(-2 * h, x)}${signed(-2 * k, y)}${signed(h * h + k * k - r * r)}<mo>=</mo>${n(0)}`;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const det = (a, b) => a[0] * b[1] - a[1] * b[0];
const len = (a) => Math.hypot(a[0], a[1]);
const base = (module, goals, difficulty, size = "short", minutes = 4, aids = false) => ({
  topic: "planeGeometry", module, goals,
  prerequisites: module === "geo.1" ? [] : module === "geo.2" ? ["geo.1"] : module === "geo.3" ? ["geo.1", "geo.2"] : module === "geo.4" ? ["geo.1", "geo.2", "geo.3"] : ["geo.1", "geo.4"],
  difficulty, size, minutes, aids,
});
const feedback = (part, text) => ({ part, feedback: text });
const choice = (id, label, options, answer, points = 2) => ({ id, label, type: "choice", options, answer, points });
const tuplePart = (id, label, answer, points = 2) => ({ id, label, type: "tuple", components: ["Første koordinat", "Anden koordinat"], answer, partial: true, points });
const numberPart = (id, label, answer, points = 2, tolerance) => ({ id, label, type: "number", answer: String(answer), points, ...(tolerance === undefined ? {} : { tolerance }) });

const pointOrVector = {
  ...base("geo.1", ["geo.point-vector"], 1), id: "geo.point-or-vector", version: 1,
  prompt: `<p>Et objekt skrives ${math(`${vec("v")}<mo>=</mo>${coordBody([3, -2])}`)}. Hvilken fortolkning passer?</p>`,
  parts: [choice("meaning", "Vælg den præcise betydning", [{ id: "move", label: "En flytning tre mod højre og to ned" }, { id: "place", label: "Et fast punkt i planen" }, { id: "length", label: "En længde på én enhed" }], "move")],
  hints: ["Se på symbolet over bogstavet.", "En pil angiver både retning og størrelse; et punkt navngives normalt med et stort bogstav."],
  solution: `<ol><li>Pilen viser, at objektet er en vektor.</li><li>Første koordinat giver tre mod højre, og anden koordinat giver to ned.</li></ol>`,
  errors: [feedback("meaning", "Koordinaterne alene afgør ikke betydningen. Pilen over bogstavet viser, at dette er en flytning.")],
};

const walk = { id: "geo.walk", version: 2, generate(random) {
  const start = [integer(random, -5, 4), integer(random, -5, 4)];
  const triple = pick(random, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]);
  const delta = [pick(random, [-1, 1]) * triple[0], pick(random, [-1, 1]) * triple[1]];
  const end = [start[0] + delta[0], start[1] + delta[1]];
  return { ...base("geo.1", ["geo.vector", "geo.length"], 2, "medium", 6), id: "geo.walk", version: 2,
    prompt: `<p>To punkter er ${point("A", start)} og ${point("B", end)}. Bestem flytningen fra det første punkt til det andet og dens længde.</p>`,
    parts: [tuplePart("vector", "Flytningens koordinater", delta), numberPart("length", "Flytningens længde", triple[2])],
    hints: ["Sammenlign slutpunktet med startpunktet i hver koordinat.", "Træk startpunktet fra slutpunktet, og brug derefter Pythagoras på de to koordinater."],
    solution: `<ol><li>${math(`${arrow("A", "B")}<mo>=</mo>${coordBody(end)}<mo>−</mo>${coordBody(start)}<mo>=</mo>${coordBody(delta)}`)}.</li><li>Længden er ${math(`${root(`${power(n(delta[0]), 2)}<mo>+</mo>${power(n(delta[1]), 2)}`)}<mo>=</mo>${n(triple[2])}`)}.</li></ol>`,
    errors: [feedback("vector", "Brug slutpunkt minus startpunkt i begge koordinater; omvendt rækkefølge vender pilen."), { part: "length", answer: String(triple[2] ** 2), feedback: "Du har fundet længdens kvadrat. Tag også kvadratroden." }, feedback("length", "Kvadrér begge koordinater, læg sammen, og tag kvadratroden af hele summen.")],
    parameters: { start, end, delta, length: triple[2] } };
}};

const vectorArithmetic = { id: "geo.vector-arithmetic", version: 1, generate(random) {
  const a = [nonzero(random, -5, 5), nonzero(random, -5, 5)], b = [nonzero(random, -5, 5), nonzero(random, -5, 5)];
  const scale = pick(random, [-3, -2, 2, 3]);
  const sum = [a[0] + b[0], a[1] + b[1]], differenceVector = [a[0] - b[0], a[1] - b[1]], combination = [scale * a[0] + b[0], scale * a[1] + b[1]];
  return { ...base("geo.1", ["geo.vector-arithmetic"], 2, "medium", 7), id: "geo.vector-arithmetic", version: 1,
    prompt: `<p>Givet ${vector("a", a)} og ${vector("b", b)}. Bestem de tre viste udtryk.</p>`,
    parts: [tuplePart("sum", math(`${vec("a")}<mo>+</mo>${vec("b")}`), sum), tuplePart("difference", math(`${vec("a")}<mo>−</mo>${vec("b")}`), differenceVector), tuplePart("combination", math(`${n(scale)}${vec("a")}<mo>+</mo>${vec("b")}`), combination)],
    hints: ["Arbejd én koordinatplads ad gangen.", `I det sidste udtryk skal begge koordinater i ${math(vec("a"))} først ganges med ${math(n(scale))}.`],
    solution: `<ol><li>Summen er ${coord(sum)}.</li><li>Differensen er ${coord(differenceVector)}.</li><li>Linearkombinationen er ${coord(combination)}.</li></ol>`,
    errors: [feedback("sum", "Læg kun koordinater på samme plads sammen."), feedback("difference", "Minustegnet gælder begge koordinater i den anden vektor."), feedback("combination", "Gang skalaren på begge koordinater, før vektorerne lægges sammen.")],
    parameters: { a, b, scale, sum, difference: differenceVector, combination } };
}};

const midpoint = { id: "geo.midpoint", version: 1, generate(random) {
  const answer = [integer(random, -5, 5), integer(random, -5, 5)], offset = [nonzero(random, -5, 5), nonzero(random, -5, 5)];
  const p = [answer[0] - offset[0], answer[1] - offset[1]], q = [answer[0] + offset[0], answer[1] + offset[1]];
  return { ...base("geo.1", ["geo.midpoint"], 1), id: "geo.midpoint", version: 1,
    prompt: `<p>Punkterne er ${point("P", p)} og ${point("Q", q)}. Bestem punktet præcis halvvejs mellem dem.</p>`,
    parts: [tuplePart("point", "Punktets koordinater", answer)],
    hints: ["Halvvejs betyder gennemsnittet på hver akse.", "Læg de to vandrette koordinater sammen og divider med to; gentag lodret."],
    solution: `<ol><li>Vandret fås ${math(`${frac(`${n(p[0])}<mo>+</mo>${n(q[0])}`, n(2))}<mo>=</mo>${n(answer[0])}`)}.</li><li>Lodret fås ${math(`${frac(`${n(p[1])}<mo>+</mo>${n(q[1])}`, n(2))}<mo>=</mo>${n(answer[1])}`)}.</li><li>Punktet er ${coord(answer)}.</li></ol>`,
    errors: [feedback("point", "Brug gennemsnittet på hver koordinatplads. Forskellen mellem punkterne er ikke midtpunktet.")], parameters: { p, q, midpoint: answer } };
}};

const parallelScale = { id: "geo.parallel-scale", version: 1, generate(random) {
  const a = primitive([nonzero(random, -5, 5), nonzero(random, -5, 5)]), factor = pick(random, [-4, -3, -2, 2, 3, 4]);
  const b = [factor * a[0], factor * a[1]], direction = factor > 0 ? "same" : "opposite";
  return { ...base("geo.1", ["geo.vector-reasoning", "geo.vector-arithmetic"], 2), id: "geo.parallel-scale", version: 1,
    prompt: `<p>Givet ${vector("a", a)} og ${vector("b", b)}. Bestem ${math("<mi>k</mi>")}, så ${math(`${vec("b")}<mo>=</mo><mi>k</mi>${vec("a")}`)}, og angiv retningen.</p>`,
    parts: [numberPart("factor", math("<mi>k</mi>"), factor), choice("direction", "Vektorernes retning", [{ id: "same", label: "Samme retning" }, { id: "opposite", label: "Modsat retning" }], direction, 1)],
    hints: ["Sammenlign én koordinat i de to vektorer.", "Kontrollér samme faktor på den anden koordinat; en negativ faktor vender retningen."],
    solution: `<ol><li>Begge koordinater giver faktoren ${math(n(factor))}.</li><li>${math(`${vec("b")}<mo>=</mo>${n(factor)}${vec("a")}`)}.</li><li>Faktoren er ${factor > 0 ? "positiv, så retningen bevares" : "negativ, så retningen vendes"}.</li></ol>`,
    errors: [feedback("factor", "Den samme faktor skal omdanne begge koordinater. Husk fortegnet."), feedback("direction", "En positiv faktor bevarer retningen; en negativ faktor vender den.")], parameters: { a, b, factor, direction } };
}};

const dotProduct = { id: "geo.dot", version: 1, generate(random) {
  const a = [nonzero(random), nonzero(random)], b = [nonzero(random), nonzero(random)], answer = dot(a, b);
  return { ...base("geo.2", ["geo.dot"], 1), id: "geo.dot", version: 1,
    prompt: `<p>Givet ${vector("a", a)} og ${vector("b", b)}. Bestem ${math(`${vec("a")}<mo>·</mo>${vec("b")}`)}.</p>`, parts: [numberPart("value", "Værdien", answer)],
    hints: ["Gang koordinater på samme plads.", "Læg de to produkter sammen, og vær særligt opmærksom på negative fortegn."],
    solution: `<ol><li>${math(`${vec("a")}<mo>·</mo>${vec("b")}<mo>=</mo>${n(a[0])}<mo>·</mo>${n(b[0])}<mo>+</mo>${n(a[1])}<mo>·</mo>${n(b[1])}`)}.</li><li>Resultatet er ${math(n(answer))}.</li></ol>`, errors: [feedback("value", "Gang første koordinater med hinanden og anden koordinater med hinanden; læg produkterne sammen.")], parameters: { a, b, dot: answer } };
}};

const angleType = { id: "geo.angle", version: 2, generate(random) {
  const expected = pick(random, ["acute", "right", "obtuse"]), a = pick(random, [[1, 0], [2, 1], [1, 2], [3, -1]]), perpendicularVector = [-a[1], a[0]];
  const along = expected === "right" ? 0 : expected === "acute" ? integer(random, 1, 3) : -integer(random, 1, 3), side = nonzero(random, -3, 3);
  const b = [along * a[0] + side * perpendicularVector[0], along * a[1] + side * perpendicularVector[1]], product = dot(a, b);
  return { ...base("geo.2", ["geo.dot", "geo.angle"], 1), id: "geo.angle", version: 2,
    prompt: `<p>To vektorer er ${vector("a", a)} og ${vector("b", b)}. Hvilken type er vinklen mellem dem?</p>`, parts: [choice("angle", "Vælg vinklens type", [{ id: "acute", label: "Spids" }, { id: "right", label: "Ret" }, { id: "obtuse", label: "Stump" }], expected)],
    hints: ["Beregn ét tal ved at gange tilsvarende koordinater og lægge sammen.", "Positivt giver en spids vinkel, nul en ret vinkel og negativt en stump vinkel."],
    solution: `<ol><li>Skalarproduktet er ${math(`${n(a[0])}<mo>·</mo>${n(b[0])}<mo>+</mo>${n(a[1])}<mo>·</mo>${n(b[1])}<mo>=</mo>${n(product)}`)}.</li><li>Vinklen er ${expected === "acute" ? "spids" : expected === "right" ? "ret" : "stump"}.</li></ol>`, errors: [feedback("angle", "Brug fortegnet på det samlede skalarprodukt, ikke fortegnet på en enkelt koordinat.")], parameters: { a, b, dot: product, expected } };
}};

const orthogonalParameter = { id: "geo.orthogonal-parameter", version: 1, generate(random) {
  const a = [pick(random, [-4, -3, -2, 2, 3, 4]), pick(random, [-1, 1])], answer = integer(random, -5, 5), q = -a[0] * answer / a[1];
  return { ...base("geo.2", ["geo.orthogonal"], 2), id: "geo.orthogonal-parameter", version: 1,
    prompt: `<p>Givet ${vector("a", a)} og ${math(`${vec("b")}<mo>=</mo><mo>(</mo><mtable><mtr><mtd><mi>t</mi></mtd></mtr><mtr><mtd>${n(q)}</mtd></mtr></mtable><mo>)</mo>`)}. Bestem ${math("<mi>t</mi>")}, så vinklen mellem vektorerne er ${math(`${n(90)}<mo>°</mo>`)}.</p>`, parts: [numberPart("parameter", math("<mi>t</mi>"), answer, 3)],
    hints: ["Ved en ret vinkel bliver skalarproduktet nul.", `Opstil ${math(`${n(a[0])}<mi>t</mi><mo>+</mo>${n(a[1])}<mo>·</mo>${n(q)}<mo>=</mo>${n(0)}`)}, og isolér parameteren.`],
    solution: `<ol><li>Vinkelkravet giver ${math(`${n(a[0])}<mi>t</mi><mo>+</mo>${n(a[1])}<mo>·</mo>${n(q)}<mo>=</mo>${n(0)}`)}.</li><li>Det giver ${math(`<mi>t</mi><mo>=</mo>${n(answer)}`)}.</li><li>Indsættelse giver skalarprodukt nul.</li></ol>`, errors: [feedback("parameter", "Sæt skalarproduktet lig nul, bevar fortegnene, og kontrollér løsningen ved indsættelse.")], parameters: { a, q, root: answer } };
}};

const angleMeasure = { id: "geo.angle-measure", version: 1, generate(random) {
  const a = pick(random, [[3, 4], [4, -3], [5, 12], [8, 15]]), b = pick(random, [[1, 0], [0, 1], [1, 1], [2, -1]]);
  if (!det(a, b)) return angleMeasure.generate(random);
  const answer = clean(Math.acos(dot(a, b) / (len(a) * len(b))) * 180 / Math.PI, 1);
  return { ...base("geo.2", ["geo.angle-measure"], 3, "medium", 7, true), id: "geo.angle-measure", version: 1,
    prompt: `<p>Bestem den mindste vinkel mellem ${vector("a", a)} og ${vector("b", b)}. Angiv svaret i grader med én decimal.</p>`, parts: [numberPart("angle", "Vinklen i grader", answer, 3, 0.1)],
    hints: ["Sammenlign skalarproduktet med produktet af de to længder.", "Isolér vinklen med invers cosinus, og kontrollér at værktøjet står på grader."],
    solution: `<ol><li>Skalarproduktet er ${math(n(dot(a, b)))}.</li><li>Længderne findes med Pythagoras.</li><li>${math(`<mi>v</mi><mo>=</mo><msup><mi mathvariant="normal">cos</mi><mrow><mo>−</mo>${n(1)}</mrow></msup><mo>(</mo>${frac(n(dot(a, b)), `${root(n(dot(a, a)))}<mo>·</mo>${root(n(dot(b, b)))}`)}<mo>)</mo><mo>≈</mo>${mnum(answer)}<mo>°</mo>`)}.</li></ol>`, errors: [feedback("angle", "Brug hele produktet af længderne i nævneren, vælg invers cosinus, og regn i grader.")], parameters: { a, b, dot: dot(a, b), angle: answer } };
}};

const triangleAngle = { ...base("geo.2", ["geo.angle-geometry", "geo.angle"], 2, "medium", 6), id: "geo.triangle-angle", version: 1,
  prompt: `<p>Tre punkter er ${point("P", [0, 0])}, ${point("Q", [3, 1])} og ${point("R", [-1, 3])}. Klassificér vinklen ved ${math("<mi>P</mi>")}.</p>`,
  parts: [choice("kind", "Vinklen ved punktet", [{ id: "acute", label: "Spids" }, { id: "right", label: "Ret" }, { id: "obtuse", label: "Stump" }], "right", 3)],
  hints: ["Dan to vektorer, som begge begynder i det angivne hjørne.", `Bestem ${math(`${arrow("P", "Q")}<mo>·</mo>${arrow("P", "R")}`)}.`],
  solution: `<ol><li>${math(`${arrow("P", "Q")}<mo>=</mo>${coordBody([3, 1])}`)} og ${math(`${arrow("P", "R")}<mo>=</mo>${coordBody([-1, 3])}`)}.</li><li>Skalarproduktet er nul, så vinklen er ret.</li></ol>`, errors: [feedback("kind", "Vektorerne skal begynde i samme hjørne. Beregn derefter hele skalarproduktet.")] };

const projection = { id: "geo.projection", version: 1, generate(random) {
  const b = pick(random, [[1, 0], [0, 1], [1, 1], [1, -1], [2, 1], [1, 2]]), perpendicularVector = [-b[1], b[0]], scale = nonzero(random, -4, 4), side = nonzero(random, -3, 3);
  const a = [scale * b[0] + side * perpendicularVector[0], scale * b[1] + side * perpendicularVector[1]], answer = [scale * b[0], scale * b[1]];
  return { ...base("geo.3", ["geo.projection"], 2, "medium", 6), id: "geo.projection", version: 1,
    prompt: `<p>Givet ${vector("a", a)} og ${vector("b", b)}. Bestem den del af ${math(vec("a"))}, som ligger i ${math(vec("b"))}'s retning.</p>`, parts: [tuplePart("vector", "Den søgte vektor", answer, 4)],
    hints: ["Resultatet skal være parallelt med den retning, der spørges efter.", `Find faktoren ${math(frac(`${vec("a")}<mo>·</mo>${vec("b")}`, dot(b, b)))} og gang den på ${math(vec("b"))}.`],
    solution: `<ol><li>Skalarproduktet er ${math(n(dot(a, b)))}, og den kvadrerede længde er ${math(n(dot(b, b)))}.</li><li>Faktoren er ${math(`${frac(n(dot(a, b)), n(dot(b, b)))}<mo>=</mo>${n(scale)}`)}.</li><li>Den søgte vektor er ${coord(answer)}.</li></ol>`, errors: [feedback("vector", "Brug retningsvektoren både i nævneren og som vektor til sidst. Resultatet skal være parallelt med den.")], parameters: { a, b, scale, side, projection: answer } };
}};

const projectionOrder = { ...base("geo.3", ["geo.projection"], 3, "medium", 8), id: "geo.projection-order", version: 1,
  prompt: `<p>Givet ${vector("a", [-4, 2])} og ${vector("b", [3, 1])}. Bestem først den del af ${math(vec("a"))}, der ligger i ${math(vec("b"))}'s retning, og derefter den del af ${math(vec("b"))}, der ligger i ${math(vec("a"))}'s retning.</p>`,
  parts: [tuplePart("first", "Første resultat", [-3, -1]), tuplePart("second", "Andet resultat", [2, -1])],
  hints: ["Rækkefølgen ændrer både nævneren og resultatets retning.", `Første resultat skal være parallelt med ${math(vec("b"))}; andet med ${math(vec("a"))}.`],
  solution: `<ol><li>Det fælles skalarprodukt er ${math(n(-10))}.</li><li>Første faktor er ${math(n(-1))}, så resultatet er ${coord([-3, -1])}.</li><li>Anden faktor er ${math(frac(n(-1), n(2)))}, så resultatet er ${coord([2, -1])}.</li></ol>`, errors: [feedback("first", "Det første resultat skal være parallelt med den anden vektor."), feedback("second", "Når rækkefølgen vendes, ændres både nævneren og resultatets retning.")] };

const perpendicular = { id: "geo.perpendicular", version: 1, generate(random) {
  const a = [nonzero(random), nonzero(random)], answer = [-a[1], a[0]];
  return { ...base("geo.3", ["geo.perpendicular"], 1), id: "geo.perpendicular", version: 1,
    prompt: `<p>Vektoren ${vector("a", a)} drejes ${math(`${n(90)}<mo>°</mo>`)} mod uret. Bestem den nye vektor.</p>`, parts: [tuplePart("vector", "Den drejede vektor", answer)],
    hints: ["En kvart omgang bytter koordinaternes roller.", "Den tidligere anden koordinat får modsat fortegn og bliver den nye første koordinat."],
    solution: `<ol><li>${math(`<mo>(</mo><mi>p</mi><mo>;</mo><mi>q</mi><mo>)</mo><mo>↦</mo><mo>(</mo><mo>−</mo><mi>q</mi><mo>;</mo><mi>p</mi><mo>)</mo>`)}.</li><li>Resultatet er ${coord(answer)}.</li><li>Skalarproduktet med den oprindelige vektor er nul.</li></ol>`, errors: [feedback("vector", "Byt koordinaterne, skift fortegn på den nye første koordinat, og kontrollér med skalarprodukt nul.")], parameters: { a, perpendicular: answer } };
}};

const determinantTask = { id: "geo.determinant", version: 1, generate(random) {
  const a = [nonzero(random), nonzero(random)], b = [nonzero(random), nonzero(random)], answer = det(a, b);
  return { ...base("geo.3", ["geo.determinant"], 1), id: "geo.determinant", version: 1,
    prompt: `<p>Givet ${vector("a", a)} og ${vector("b", b)}. Bestem ${math(`<mi mathvariant="normal">det</mi><mo>(</mo>${vec("a")}<mo>,</mo>${vec("b")}<mo>)</mo>`)}.</p>`, parts: [numberPart("value", "Værdien", answer)],
    hints: ["Gang diagonalt i de to retninger.", "Beregn første gange anden, og træk det modsatte produkt fra."],
    solution: `<ol><li>${math(`<mi mathvariant="normal">det</mi><mo>(</mo>${vec("a")}<mo>,</mo>${vec("b")}<mo>)</mo><mo>=</mo>${n(a[0])}<mo>·</mo>${n(b[1])}<mo>−</mo>${n(a[1])}<mo>·</mo>${n(b[0])}`)}.</li><li>Resultatet er ${math(n(answer))}.</li></ol>`, errors: [feedback("value", "Bevar rækkefølgen: første gange anden minus anden gange første.")], parameters: { a, b, determinant: answer } };
}};

const areaTask = { id: "geo.area", version: 1, generate(random) {
  const a = [nonzero(random, -7, 7), nonzero(random, -7, 7)], b = [nonzero(random, -7, 7), nonzero(random, -7, 7)], determinant = det(a, b);
  if (!determinant) return areaTask.generate(random);
  const answer = Math.abs(determinant) / 2;
  return { ...base("geo.3", ["geo.area", "geo.determinant"], 2, "medium", 5), id: "geo.area", version: 1,
    prompt: `<p>To sider fra samme hjørne i en trekant er ${vector("a", a)} og ${vector("b", b)}. Bestem trekantens areal.</p>`, parts: [numberPart("area", "Arealet", answer, 3)],
    hints: ["De to vektorer udspænder først et parallelogram.", "Absolutværdien af determinanten er parallelogrammets areal; trekanten fylder halvdelen."],
    solution: `<ol><li>Determinanten er ${math(n(determinant))}.</li><li>Parallelogrammets areal er ${math(n(Math.abs(determinant)))}.</li><li>Trekantens areal er ${math(`${frac(n(Math.abs(determinant)), n(2))}<mo>=</mo>${n(answer)}`)}.</li></ol>`, errors: [{ part: "area", answer: String(Math.abs(determinant)), feedback: "Du har fundet parallelogrammets areal. Trekanten udgør halvdelen." }, feedback("area", "Tag determinantens absolutværdi og divider med to; et areal kan ikke være negativt.")], parameters: { a, b, determinant, area: answer } };
}};

const orientationParallel = { ...base("geo.3", ["geo.orientation", "geo.parallel"], 2, "medium", 5), id: "geo.orientation-parallel", version: 1,
  prompt: `<p>Undersøg de to ordnede par ${math(`${coordBody([2, 1])}<mo>,</mo>${coordBody([-1, 3])}`)} og ${math(`${coordBody([3, -2])}<mo>,</mo>${coordBody([-6, 4])}`)}.</p>`,
  parts: [choice("orientation", "Drejningen i det første par", [{ id: "counterclockwise", label: "Mod uret" }, { id: "clockwise", label: "Med uret" }], "counterclockwise"), choice("relation", "Sammenhængen i det andet par", [{ id: "parallel", label: "Parallelle" }, { id: "orthogonal", label: "Vinkelrette" }, { id: "neither", label: "Ingen af delene" }], "parallel")],
  hints: ["Fortegnet på den ordnede determinant viser drejeretningen.", "En determinant på nul betyder, at det udspændte parallelogram er faldet sammen."],
  solution: `<ol><li>Første determinant er ${math(n(7))}; den er positiv, så drejningen går mod uret.</li><li>Anden determinant er nul, og den anden vektor er ${math(n(-2))} gange den første. De er parallelle.</li></ol>`, errors: [feedback("orientation", "Beregn determinanten i den viste rækkefølge; positivt svarer til mod uret."), feedback("relation", "Kontrollér determinant nul eller samme skaleringsfaktor i begge koordinater.")] };

const lineEquation = { id: "geo.line-equation", version: 1, generate(random) {
  const normal = primitive([nonzero(random), nonzero(random)]), p = [integer(random, -6, 6), integer(random, -6, 6)], c = -dot(normal, p);
  return { ...base("geo.4", ["geo.line-equation", "geo.line-vectors"], 1), id: "geo.line-equation", version: 1,
    prompt: `<p>En linje går gennem ${point("P", p)} og har normalvektoren ${coord(normal)}. I formen ${math(`${firstTerm(normal[0], x)}${signed(normal[1], y)}<mo>+</mo><mi>c</mi><mo>=</mo>${n(0)}`)}, bestem ${math("<mi>c</mi>")}.</p>`, parts: [numberPart("constant", math("<mi>c</mi>"), c, 3)],
    hints: ["Punktets koordinater skal gøre venstresiden lig nul.", "Indsæt begge koordinater i den viste form, og isolér konstanten."],
    solution: `<ol><li>Indsættelse giver ${math(`${n(normal[0])}<mo>·</mo>${n(p[0])}<mo>+</mo>${n(normal[1])}<mo>·</mo>${n(p[1])}<mo>+</mo><mi>c</mi><mo>=</mo>${n(0)}`)}.</li><li>${math(`<mi>c</mi><mo>=</mo>${n(c)}`)}.</li><li>Linjen er ${math(lineBody(normal[0], normal[1], c))}.</li></ol>`, errors: [feedback("constant", "Indsæt punktet i hele linjeudtrykket, sæt lig nul, og isolér konstanten med korrekt fortegn.")], parameters: { normal, point: p, c } };
}};

const lineDirection = { id: "geo.line-direction", version: 1, generate(random) {
  const normal = primitive([nonzero(random), nonzero(random)]), direction = [-normal[1], normal[0]], c = integer(random, -9, 9);
  return { ...base("geo.4", ["geo.line-form", "geo.line-vectors"], 1), id: "geo.line-direction", version: 1,
    prompt: `<p>En linje er givet ved ${math(lineBody(normal[0], normal[1], c))}. Angiv en retningsvektor.</p>`, parts: [tuplePart("direction", "En mulig retningsvektor", direction)],
    hints: ["Koefficienterne foran koordinaterne danner en vektor på tværs af linjen.", "Drej denne vektor en kvart omgang mod uret."],
    solution: `<ol><li>En normalvektor er ${coord(normal)}.</li><li>En kvart omgang giver ${coord(direction)}.</li><li>Skalarproduktet er nul, så vektoren ligger langs linjen.</li></ol>`, errors: [feedback("direction", "Koefficienterne giver en normalvektor. Drej normalen 90 grader og kontrollér skalarprodukt nul.")], parameters: { normal, direction, c } };
}};

const lineParameter = { id: "geo.line-parameter", version: 1, generate(random) {
  const start = [integer(random, -6, 6), integer(random, -6, 6)], direction = [nonzero(random), nonzero(random)], answer = nonzero(random, -4, 4), target = [start[0] + answer * direction[0], start[1] + answer * direction[1]];
  return { ...base("geo.4", ["geo.line-form"], 2), id: "geo.line-parameter", version: 1,
    prompt: `<p>Et punkt på en linje beskrives ved ${math(`${coordBody(start)}<mo>+</mo><mi>t</mi>${coordBody(direction)}`)}. Punktet ${point("Q", target)} ligger på linjen. Bestem parameteren.</p>`, parts: [numberPart("parameter", math("<mi>t</mi>"), answer, 3)],
    hints: ["Sammenlign én koordinat ad gangen med det oplyste punkt.", "Bestem parameteren fra den ene koordinat, og kontrollér i den anden."],
    solution: `<ol><li>Første koordinat giver en lineær ligning med ${math("<mi>t</mi>")}.</li><li>Løsningen er ${math(`<mi>t</mi><mo>=</mo>${n(answer)}`)}.</li><li>Den anden koordinat giver samme værdi og kontrollerer punktet.</li></ol>`, errors: [feedback("parameter", "Brug samme parameter i begge koordinater. Bestem den fra den ene og kontrollér i den anden.")], parameters: { start, direction, t: answer, target } };
}};

const lineIntersection = { id: "geo.line-intersection", version: 1, generate(random) {
  const intersection = [integer(random, -5, 5), integer(random, -5, 5)], normals = pick(random, [[[1, 1], [1, -1]], [[2, 1], [1, -1]], [[1, 2], [-1, 1]], [[3, -1], [1, 1]]]);
  const c1 = -dot(normals[0], intersection), c2 = -dot(normals[1], intersection);
  return { ...base("geo.4", ["geo.line-intersection"], 2, "medium", 7), id: "geo.line-intersection", version: 1,
    prompt: `<p>Bestem det fælles punkt for linjerne ${math(lineBody(...normals[0], c1))} og ${math(lineBody(...normals[1], c2))}.</p>`, parts: [tuplePart("point", "Det fælles punkt", intersection, 4)],
    hints: ["Punktets koordinater skal opfylde begge ligninger samtidig.", "Eliminér én ubekendt ved at lægge passende multipla af ligningerne sammen."],
    solution: `<ol><li>Ligningerne behandles som et system.</li><li>Elimination giver ${math(`${x}<mo>=</mo>${n(intersection[0])}`)} og ${math(`${y}<mo>=</mo>${n(intersection[1])}`)}.</li><li>Indsættelse giver nul i begge ligninger.</li></ol>`, errors: [feedback("point", "Løs de to ligninger samtidigt. Et skæringspunkt skal opfylde begge linjer.")], parameters: { intersection, normals, c1, c2 } };
}};

const lineRelation = { ...base("geo.4", ["geo.line-relations", "geo.line-vectors"], 2), id: "geo.line-relation", version: 1,
  prompt: `<p>Tre linjer har retningsvektorerne ${coord([2, 1])}, ${coord([6, 3])} og ${coord([-1, 2])}. Sammenlign den første linje med hver af de to andre.</p>`,
  parts: [choice("second", "Første og anden linje", [{ id: "parallel", label: "Parallelle" }, { id: "orthogonal", label: "Vinkelrette" }, { id: "neither", label: "Ingen af delene" }], "parallel"), choice("third", "Første og tredje linje", [{ id: "parallel", label: "Parallelle" }, { id: "orthogonal", label: "Vinkelrette" }, { id: "neither", label: "Ingen af delene" }], "orthogonal")],
  hints: ["Undersøg først, om den ene retningsvektor er et multiplum af den anden.", "Hvis ikke, så beregn skalarproduktet; nul betyder en ret vinkel."],
  solution: `<ol><li>${coord([6, 3])} er tre gange ${coord([2, 1])}, så de første to linjer er parallelle.</li><li>${math(`${n(2)}<mo>·</mo>${n(-1)}<mo>+</mo>${n(1)}<mo>·</mo>${n(2)}<mo>=</mo>${n(0)}`)}, så første og tredje linje er vinkelrette.</li></ol>`, errors: [feedback("second", "Sammenlign forholdet mellem tilsvarende koordinater."), feedback("third", "Beregn skalarproduktet af retningsvektorerne.")] };

const distanceTask = { id: "geo.distance", version: 2, generate(random) {
  const triple = pick(random, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [8, 15, 17]]), a = pick(random, [-1, 1]) * triple[0], b = pick(random, [-1, 1]) * triple[1];
  const p = [integer(random, -5, 5), integer(random, -5, 5)], answer = integer(random, 1, 8), c = pick(random, [-1, 1]) * answer * triple[2] - a * p[0] - b * p[1];
  return { ...base("geo.4", ["geo.line"], 2, "medium", 5), id: "geo.distance", version: 2,
    prompt: `<p>Find den korteste afstand fra ${point("P", p)} til linjen ${math(lineBody(a, b, c))}.</p>`, parts: [numberPart("distance", "Den korteste afstand", answer, 3)],
    hints: ["Den korteste vej står vinkelret på linjen.", "Indsæt punktet i venstresiden, tag absolutværdien, og divider med normalvektorens længde."],
    solution: `<ol><li>Normalvektorens længde er ${math(n(triple[2]))}.</li><li>Tællerens absolutværdi er ${math(n(answer * triple[2]))}.</li><li>Afstanden er ${math(`${frac(n(answer * triple[2]), n(triple[2]))}<mo>=</mo>${n(answer)}`)}.</li></ol>`, errors: [{ part: "distance", answer: String(-answer), feedback: "En afstand kan ikke være negativ. Brug absolutværdien." }, feedback("distance", "Divider absolutværdien af linjeudtrykket i punktet med normalvektorens længde.")], parameters: { a, b, c, point: p, normalLength: triple[2], distance: answer } };
}};

const lineAngle = { id: "geo.line-angle", version: 1, generate(random) {
  const direction = pick(random, [[3, 4], [4, 3], [5, 12], [12, 5], [8, 15], [15, 8]]), answer = clean(Math.atan2(direction[1], direction[0]) * 180 / Math.PI, 1);
  return { ...base("geo.4", ["geo.line-relations"], 3, "medium", 6, true), id: "geo.line-angle", version: 1,
    prompt: `<p>En linje har retningsvektoren ${coord(direction)}. Bestem den spidse vinkel mellem linjen og førsteaksen med én decimal.</p>`, parts: [numberPart("angle", "Vinklen i grader", answer, 3, 0.1)],
    hints: ["Retningsvektoren danner en retvinklet trekant med akserne.", "Brug forholdet lodret ændring over vandret ændring, og regn i grader."],
    solution: `<ol><li>${math(`<mi mathvariant="normal">tan</mi><mo>(</mo><mi>v</mi><mo>)</mo><mo>=</mo>${frac(n(direction[1]), n(direction[0]))}`)}.</li><li>${math(`<mi>v</mi><mo>≈</mo>${mnum(answer)}<mo>°</mo>`)}.</li></ol>`, errors: [feedback("angle", "Brug lodret ændring over vandret ændring, vælg invers tangens, og regn i grader.")], parameters: { direction, angle: answer } };
}};

const circleRead = { id: "geo.circle-read", version: 1, generate(random) {
  const center = [integer(random, -6, 6), integer(random, -6, 6)], radius = integer(random, 1, 9);
  return { ...base("geo.5", ["geo.circle-form"], 1), id: "geo.circle-read", version: 1,
    prompt: `<p>En kurve er givet ved ${math(circleBody(center[0], center[1], radius * radius))}. Bestem centrum og radius.</p>`, parts: [tuplePart("center", "Centrum", center), numberPart("radius", "Radius", radius)],
    hints: ["Skriv hver parentes som koordinat minus centrumkoordinat.", "Højresiden er radius i anden, ikke radius."],
    solution: `<ol><li>Parenteserne viser centrum ${coord(center)}; fortegnet læses modsat.</li><li>Radius er ${math(`${root(n(radius * radius))}<mo>=</mo>${n(radius)}`)}.</li></ol>`, errors: [feedback("center", "Læs parenteserne som koordinat minus centrumkoordinat."), { part: "radius", answer: String(radius * radius), feedback: "Du har aflæst radius i anden. Tag kvadratroden." }, feedback("radius", "Radius er den positive kvadratrod af højresiden.")], parameters: { center, radius } };
}};

const circleComplete = { id: "geo.circle-complete", version: 1, generate(random) {
  const center = [integer(random, -6, 6), integer(random, -6, 6)], radius = integer(random, 2, 9);
  return { ...base("geo.5", ["geo.circle-complete", "geo.circle-form"], 2, "medium", 7), id: "geo.circle-complete", version: 1,
    prompt: `<p>En kurve er givet ved ${math(expandedCircleBody(center[0], center[1], radius))}. Bestem centrum og radius.</p>`, parts: [tuplePart("center", "Centrum", center), numberPart("radius", "Radius", radius)],
    hints: ["Saml først leddene med den samme variabel.", "Halvér hver lineær koefficient og kvadrér; tilføj de samme tal på begge sider."],
    solution: `<ol><li>Efter samme tilføjelser på begge sider fås ${math(circleBody(center[0], center[1], radius * radius))}.</li><li>Centrum er ${coord(center)}, og radius er ${math(n(radius))}.</li><li>Udvidelse af parenteserne giver den oprindelige ligning.</li></ol>`, errors: [feedback("center", "Halvér de lineære koefficienter og skift fortegn; kontrollér ved at udvide parenteserne."), feedback("radius", "Når de fulde kvadrater er dannet, er højresiden radius i anden.")], parameters: { center, radius, d: -2 * center[0], e: -2 * center[1], f: center[0] ** 2 + center[1] ** 2 - radius ** 2 } };
}};

const circlePosition = { id: "geo.circle-position", version: 1, generate(random) {
  const center = [integer(random, -5, 5), integer(random, -5, 5)], radius = pick(random, [3, 4, 5, 6]), expected = pick(random, ["inside", "on", "outside"]);
  const delta = expected === "on" ? [radius, 0] : expected === "inside" ? [1, 1] : [radius + 2, 1], p = [center[0] + delta[0], center[1] + delta[1]], d2 = dot(delta, delta);
  return { ...base("geo.5", ["geo.circle-position"], 1), id: "geo.circle-position", version: 1,
    prompt: `<p>En cirkel har centrum ${point("C", center)} og radius ${math(n(radius))}. Hvor ligger ${point("P", p)}?</p>`, parts: [choice("position", "Punktets placering", [{ id: "inside", label: "Inde i cirklen" }, { id: "on", label: "På cirklen" }, { id: "outside", label: "Uden for cirklen" }], expected)],
    hints: ["Sammenlign afstanden fra punktet til centrum med radius.", "Det er nok at sammenligne den kvadrerede afstand med radius i anden."],
    solution: `<ol><li>Forskellen mellem punkt og centrum er ${coord(delta)}.</li><li>Den kvadrerede afstand er ${math(n(d2))}, mens radius i anden er ${math(n(radius * radius))}.</li><li>Punktet ligger ${expected === "inside" ? "inde i cirklen" : expected === "on" ? "på cirklen" : "uden for cirklen"}.</li></ol>`, errors: [feedback("position", "Sammenlign den kvadrerede afstand til centrum med radius i anden: mindre, lig eller større.")], parameters: { center, radius, point: p, distanceSquared: d2, expected } };
}};

const circleAxis = { id: "geo.circle-axis", version: 1, generate(random) {
  const h = integer(random, -5, 5), leg = pick(random, [3, 4, 5, 6, 8]), k = pick(random, [-3, -2, -1, 0, 1, 2, 3]), r2 = leg * leg + k * k, roots = [h - leg, h + leg];
  return { ...base("geo.5", ["geo.circle-intersection"], 2), id: "geo.circle-axis", version: 1,
    prompt: `<p>Bestem de to vandrette koordinater, hvor ${math(circleBody(h, k, r2))} møder førsteaksen.</p>`, parts: [{ id: "roots", label: "De to koordinater", type: "set", components: ["Første værdi", "Anden værdi"], answer: roots, partial: true, points: 4 }],
    hints: ["På førsteaksen er den lodrette koordinat nul.", "Indsæt nul, isolér parenteskvadratet, og husk begge fortegn."],
    solution: `<ol><li>Sæt ${math(`${y}<mo>=</mo>${n(0)}`)}.</li><li>Da fås ${math(`${power(difference(x, h), 2)}<mo>=</mo>${n(leg * leg)}`)}.</li><li>De vandrette koordinater er ${math(n(roots[0]))} og ${math(n(roots[1]))}.</li></ol>`, errors: [feedback("roots", "Sæt den lodrette koordinat lig nul, og husk både den positive og negative kvadratrod.")], parameters: { center: [h, k], radiusSquared: r2, leg, roots } };
}};

const circleLine = { id: "geo.circle-line", version: 1, generate(random) {
  const center = [integer(random, -5, 5), integer(random, -5, 5)], triple = pick(random, [[3, 4, 5], [4, 3, 5], [5, 12, 13]]), lineY = center[1] + triple[1], roots = [center[0] - triple[0], center[0] + triple[0]];
  return { ...base("geo.5", ["geo.circle-intersection"], 3, "medium", 8, true), id: "geo.circle-line", version: 1,
    prompt: `<p>Kurven ${math(circleBody(center[0], center[1], triple[2] ** 2))} og linjen ${math(`${y}<mo>=</mo>${n(lineY)}`)} har fælles punkter. Bestem deres vandrette koordinater.</p>`, parts: [{ id: "roots", label: "De to koordinater", type: "set", components: ["Første værdi", "Anden værdi"], answer: roots, partial: true, points: 4 }],
    hints: ["De fælles punkter skal opfylde begge ligninger.", "Indsæt linjens faste lodrette koordinat i kurvens ligning, og løs kvadratligningen."],
    solution: `<ol><li>Indsæt ${math(`${y}<mo>=</mo>${n(lineY)}`)}.</li><li>Efter forenkling fås ${math(`${power(difference(x, center[0]), 2)}<mo>=</mo>${n(triple[0] ** 2)}`)}.</li><li>De vandrette koordinater er ${math(n(roots[0]))} og ${math(n(roots[1]))}.</li><li>Begge kontrolleres i den oprindelige ligning.</li></ol>`, errors: [feedback("roots", "Indsæt linjens koordinat i cirkelligningen, løs kvadratligningen, og kontrollér begge værdier.")], parameters: { center, radius: triple[2], lineY, dx: triple[0], roots } };
}};

const circleTangent = { id: "geo.circle-tangent", version: 1, generate(random) {
  const center = [integer(random, -5, 5), integer(random, -5, 5)], radial = pick(random, [[3, 4], [4, 3], [-3, 4], [4, -3], [5, 12], [-5, 12]]), p = [center[0] + radial[0], center[1] + radial[1]], c = -dot(radial, p);
  return { ...base("geo.5", ["geo.circle-tangent"], 2, "medium", 6), id: "geo.circle-tangent", version: 1,
    prompt: `<p>En cirkel har centrum ${point("C", center)}, og ${point("P", p)} ligger på cirklen. En linje gennem ${math("<mi>P</mi>")} skrives ${math(`${firstTerm(radial[0], x)}${signed(radial[1], y)}<mo>+</mo><mi>c</mi><mo>=</mo>${n(0)}`)}. Bestem ${math("<mi>c</mi>")}, så linjen netop rører cirklen.</p>`, parts: [numberPart("constant", math("<mi>c</mi>"), c, 3)],
    hints: ["Forbind centrum med det oplyste punkt.", "Radiusvektoren er vinkelret på linjen og kan bruges som normalvektor; indsæt derefter punktet."],
    solution: `<ol><li>${math(`${arrow("C", "P")}<mo>=</mo>${coordBody(radial)}`)} er normal til linjen.</li><li>Indsættelse af punktet giver ${math(`<mi>c</mi><mo>=</mo>${n(c)}`)}.</li><li>Linjen går gennem punktet og står vinkelret på radius, så den er tangent.</li></ol>`, errors: [feedback("constant", "Brug radiusvektoren som normalvektor, og indsæt røringspunktet for at bestemme konstanten.")], parameters: { center, radial, point: p, c, radius: len(radial) } };
}};

const fountain = { ...base("geo.5", ["geo.circle", "geo.circle-tangent"], 3, "complex", 12, true), id: "geo.fountain", version: 1,
  prompt: `<p>En rund fontænes kant beskrives af ${math(circleBody(2, -1, 25))}. En lige gang skal røre kanten i det østligste punkt og må ikke gå ind over fontænen.</p><p>Find centrum, radius og gangens faste vandrette koordinat. Begrund placeringen.</p>`,
  parts: [tuplePart("center", "Centrum", [2, -1]), numberPart("radius", "Radius i meter", 5), numberPart("line", "Gangens faste vandrette koordinat", 7), { id: "reason", label: "Begrund placeringen", type: "text", points: 2, checklist: ["Bestem det østligste punkt ud fra centrum og radius.", "Forklar at radius til punktet er vandret.", "Forklar at gangen står vinkelret på radius og kun har ét fælles punkt med cirklen."], concepts: ["radius", "tangent", "vinkelret", "røringspunkt"] }],
  hints: ["Aflæs centrum og tag kvadratroden af højresiden.", "Det østligste punkt ligger én radius til højre for centrum; linjen gennem punktet står vinkelret på radius."],
  solution: `<ol><li>Centrum er ${coord([2, -1])}, og radius er ${math(`${root(n(25))}<mo>=</mo>${n(5)}`)}.</li><li>Det østligste punkt er ${point("P", [7, -1])}.</li><li>Radius er vandret, så tangenten er ${math(`${x}<mo>=</mo>${n(7)}`)}.</li><li>Indsættelse giver kun ${math(`${y}<mo>=</mo>${n(-1)}`)}, så linjen har ét fælles punkt med kanten.</li></ol>`, errors: [feedback("center", "Centrum har modsat fortegn af konstantleddet i hver parentes."), { part: "radius", answer: "25", feedback: "Højresiden er radius i anden. Tag kvadratroden." }, feedback("radius", "Tag den positive kvadratrod af højresiden."), feedback("line", "Gå én radius mod højre fra centrum."), feedback("reason", "Forbind den vandrette radius med den lodrette tangent, og forklar hvorfor der kun er ét røringspunkt.")] };

export const geometryTasks = [
  pointOrVector, walk, vectorArithmetic, midpoint, parallelScale,
  dotProduct, angleType, orthogonalParameter, angleMeasure, triangleAngle,
  projection, projectionOrder, perpendicular, determinantTask, areaTask, orientationParallel,
  lineEquation, lineDirection, lineParameter, lineIntersection, lineRelation, distanceTask, lineAngle,
  circleRead, circleComplete, circlePosition, circleAxis, circleLine, circleTangent, fountain,
];
