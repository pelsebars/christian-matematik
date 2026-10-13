// A bounded polynomial parser. No code execution or numerical sampling.
export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const math = (body) =>
  `<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${body}</mrow></math>`;
export const n = (value) =>
  value < 0 ? `<mo>−</mo><mn>${Math.abs(value)}</mn>` : `<mn>${value}</mn>`;
export const x = "<mi>x</mi>";
export const power = (body, exponent) => {
  const base = /^<(mi|mn)>[^<]+<\/\1>$/.test(body)
    ? body
    : `<mo>(</mo>${body}<mo>)</mo>`;
  return `<msup><mrow>${base}</mrow><mrow>${n(exponent)}</mrow></msup>`;
};
export const tuple = (values) =>
  math(`<mo>(</mo>${values.map(n).join("<mo>;</mo>")}<mo>)</mo>`);
const trim = (p) => {
  while (p.length > 1 && p.at(-1) === 0) p.pop();
  return p;
};
const add = (a, b, sign = 1) =>
  trim(
    Array.from(
      { length: Math.max(a.length, b.length) },
      (_, i) => (a[i] || 0) + sign * (b[i] || 0),
    ),
  );
const mul = (a, b) => {
  if (a.length + b.length > 18) throw Error("Udtrykket har for høj grad.");
  const p = Array(a.length + b.length - 1).fill(0);
  a.forEach((v, i) => b.forEach((w, j) => (p[i + j] += v * w)));
  return trim(p);
};
export function polynomial(input) {
  const s = String(input)
    .trim()
    .replace(/−/g, "-")
    .replace(/·|×/g, "*")
    .replace(/,/g, ".")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\s+/g, "");
  if (!s || s.length > 200) throw Error("Skriv et kort tal eller polynomium.");
  const tokens = s.match(/\d*\.?\d+|x|sqrt|[()+*/^\-]/g) || [];
  if (tokens.join("") !== s || tokens.length > 100)
    throw Error("Dette udtryk kræver egen gennemgang.");
  let at = 0;
  function atom() {
    const t = tokens[at++];
    if (t === "(") {
      const p = sum();
      if (tokens[at++] !== ")") throw Error("Kontrollér parenteserne.");
      return p;
    }
    if (t === "x") return [0, 1];
    if (t === "sqrt") {
      if (tokens[at++] !== "(") throw Error("Brug parentes efter sqrt.");
      const p = sum();
      if (tokens[at++] !== ")" || p.length !== 1 || p[0] < 0)
        throw Error("Kun kvadratrødder af ikke-negative tal understøttes.");
      return [Math.sqrt(p[0])];
    }
    if (t && /^\d*\.?\d+$/.test(t)) return [Number(t)];
    throw Error("Kontrollér udtrykket.");
  }
  function exponent() {
    let p = atom();
    if (tokens[at] === "^") {
      at++;
      const e = tokens[at++];
      if (!/^[0-8]$/.test(e || ""))
        throw Error("Brug en hel potens fra nul til otte.");
      let result = [1];
      for (let i = 0; i < Number(e); i++) result = mul(result, p);
      p = result;
    }
    return p;
  }
  function unary() {
    if (tokens[at] === "+") {
      at++;
      return unary();
    }
    if (tokens[at] === "-") {
      at++;
      return unary().map((v) => -v);
    }
    return exponent();
  }
  function product() {
    let p = unary();
    while (at < tokens.length) {
      let op = tokens[at];
      if (op === "*" || op === "/") at++;
      else if (op === "x" || op === "(" || op === "sqrt") op = "*";
      else break;
      const q = unary();
      if (op === "/") {
        if (q.length !== 1 || q[0] === 0)
          throw Error(
            "Kun division med et tal forskelligt fra nul understøttes.",
          );
        p = p.map((v) => v / q[0]);
      } else p = mul(p, q);
    }
    return p;
  }
  function sum() {
    let p = product();
    while (tokens[at] === "+" || tokens[at] === "-") {
      const op = tokens[at++];
      p = add(p, product(), op === "+" ? 1 : -1);
    }
    return p;
  }
  const result = sum();
  if (
    at !== tokens.length ||
    result.some((v) => !Number.isFinite(v) || Math.abs(v) > 1e12)
  )
    throw Error("Udtrykket kan ikke vurderes automatisk.");
  return trim(result);
}
export function number(input) {
  const p = polynomial(input);
  if (p.length !== 1) throw Error("Skriv et tal.");
  return p[0];
}
export function equivalent(a, b, tolerance = 1e-9) {
  const p = polynomial(a),
    q = polynomial(b);
  return Array.from(
    { length: Math.max(p.length, q.length) },
    (_, i) =>
      Math.abs((p[i] || 0) - (q[i] || 0)) <=
      tolerance * Math.max(1, Math.abs(q[i] || 0)),
  ).every(Boolean);
}
export function expressionMath(input) {
  // Render supported input as MathML; never place input HTML in the DOM.
  try {
    const p = polynomial(input);
    let body = "";
    for (let i = p.length - 1; i >= 0; i--) {
      const v = p[i];
      if (v === 0 && p.length > 1) continue;
      if (body) body += `<mo>${v < 0 ? "−" : "+"}</mo>`;
      else if (v < 0) body += "<mo>−</mo>";
      if (!i || Math.abs(v) !== 1)
        body += `<mn>${escapeHTML(Number(Math.abs(v).toPrecision(10)).toLocaleString("da-DK"))}</mn>`;
      if (i) body += i === 1 ? x : power(x, i);
    }
    return math(body || n(0));
  } catch {
    return "";
  }
}
