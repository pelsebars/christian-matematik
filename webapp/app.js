const subjects = {
  differentialEquations: { kicker: "07 · A-niveau", title: "Differentialligninger", description: "Fra ændringshastighed til funktioner og modeller.", understand: "Find en funktion, hvis afledte opfylder en given sammenhæng.", formula: `<math><mrow><msup><mi>y</mi><mo>′</mo></msup><mo>=</mo><mn>2</mn><mi>x</mi></mrow></math>` },
  integration: { kicker: "06 · A-niveau", title: "Integralregning", description: "Fra stamfunktioner til areal, rumfang og substitution. Byg forståelsen ét modul ad gangen.", understand: "Find en funktion ud fra dens afledte, og kontrollér dit resultat ved at differentiere.", formula: `<math display="block"><mrow><msup><mi>F</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></math>` },
  equations: {
    kicker: "01 · Grundlag",
    title: "Løsning af ligninger",
    description:
      "En ligning er en balance. Målet er at få den ukendte alene uden at ændre balancen.",
    understand:
      "Se hvad lighedstegnet betyder, og lær hvorfor den samme handling skal udføres på begge sider.",
    formula: `
      <math display="block" aria-label="Tre x plus fem er lig med tyve">
        <mrow><mn>3</mn><mi>x</mi><mo>+</mo><mn>5</mn><mo>=</mo><mn>20</mn></mrow>
      </math>`,
  },
  quadratic: {
    kicker: "02 · Algebra",
    title: "Løsning af andengradsligninger",
    description:
      "En andengradsligning indeholder et led med den ukendte i anden potens og kan have to, én eller ingen reelle løsninger.",
    understand:
      "Lær at skrive ligningen på standardform, beregne diskriminanten og bruge den til at finde løsningerne.",
    formula: `
      <math display="block" aria-label="x i anden minus fem x plus seks er lig med nul">
        <mrow>
          <msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>5</mn><mi>x</mi>
          <mo>+</mo><mn>6</mn><mo>=</mo><mn>0</mn>
        </mrow>
      </math>`,
  },
  composite: {
    kicker: "03 · Funktioner",
    title: "Sammensatte funktioner",
    description:
      "Når funktioner sættes sammen, bliver resultatet fra den ene funktion input til den næste.",
    understand:
      "Lær at finde den indre og den ydre funktion og at holde styr på den rækkefølge, de bruges i.",
    formula: `
      <math display="block" aria-label="f af g af x">
        <mrow><mi>f</mi><mo>(</mo><mi>g</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>)</mo></mrow>
      </math>`,
  },
  differentiation: {
    kicker: "04 · A-niveau",
    title: "Differentialregning",
    description:
      "Den afledte fortæller, hvor hurtigt en funktion ændrer sig i et bestemt punkt.",
    understand:
      "Genkend funktionstypen, vælg den relevante differentiationsregel og kontroller dit resultat.",
    formula: `
      <math display="block" aria-label="Den afledte af x i anden er to x">
        <mrow>
          <mfrac><mi>d</mi><mrow><mi>d</mi><mi>x</mi></mrow></mfrac>
          <mo>(</mo><msup><mi>x</mi><mn>2</mn></msup><mo>)</mo>
          <mo>=</mo><mn>2</mn><mi>x</mi>
        </mrow>
      </math>`,
  },
  planeGeometry: {
    kicker: "05 · A-niveau",
    title: "Plangeometri og vektorer",
    description:
      "Vektorer forbinder koordinater og geometri. Du lærer at regne med retning og længde og bruger det senere til linjer og cirkler.",
    understand:
      "Skeln mellem punkter og vektorer, se regningerne i koordinatsystemet, og byg videre mod vinkler, linjer og cirkler.",
    formula: `
      <math display="block" aria-label="Vektoren fra A til B er B minus A">
        <mrow>
          <mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>→</mo></mover><mo>=</mo>
          <mo>(</mo><mtable><mtr><mtd><msub><mi>x</mi><mi>B</mi></msub><mo>−</mo><msub><mi>x</mi><mi>A</mi></msub></mtd></mtr><mtr><mtd><msub><mi>y</mi><mi>B</mi></msub><mo>−</mo><msub><mi>y</mi><mi>A</mi></msub></mtd></mtr></mtable><mo>)</mo>
        </mrow>
      </math>`,
  },
};

const mainContent = document.querySelector("#mainContent");
const homeView = document.querySelector('[data-page="home"]');
const subjectView = document.querySelector('[data-page="subject"]');
const formulaView = document.querySelector('[data-page="formulas"]');
const navigationButtons = document.querySelectorAll("[data-view]");
const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector("#menuButton");
const backdrop = document.querySelector("#backdrop");
const equationLesson = document.querySelector("#equationLesson");
const quadraticLesson = document.querySelector("#quadraticLesson");
const compositeLesson = document.querySelector("#compositeLesson");
const differentiationLesson = document.querySelector("#differentiationLesson");
const planeGeometryLesson = document.querySelector("#planeGeometryLesson");
const subjectPlaceholder = document.querySelector("#subjectPlaceholder");
const exerciseCards = document.querySelectorAll(".exercise-card");

function setActiveNavigation(view) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    const isActive = item.dataset.view === view;
    item.classList.toggle("is-active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

function closeMenu() {
  sidebar.classList.remove("is-open");
  backdrop.classList.remove("is-visible");
  menuButton.setAttribute("aria-expanded", "false");
}

function showView(view, shouldFocus = true) {
  const requestedPath = view;
  if (view.startsWith("integration/")) view = "integration";
  if (view.startsWith("differentialEquations/")) view = "differentialEquations";
  document.querySelector("[data-page=subject] .learning-steps").hidden = view === "integration" || view === "differentialEquations";
  document.querySelector("#subjectFormula").hidden = false;
  document.title = "Christians matematik";
  subjectView.classList.remove("is-integral-session", "is-integral-overview");
  document.querySelector("#tasksView").hidden = view !== "tasks";
  homeView.hidden = view !== "home";
  formulaView.hidden = view !== "formulas";
  subjectView.hidden = !subjects[view];

  if (subjects[view]) {
    const subject = subjects[view];
    document.querySelector("#subjectKicker").textContent = subject.kicker;
    document.querySelector("#subjectTitle").textContent = subject.title;
    document.querySelector("#subjectDescription").textContent = subject.description;
    document.querySelector("#understandText").textContent = subject.understand;
    document.querySelector("#subjectFormula").innerHTML = subject.formula;
  }

  equationLesson.hidden = view !== "equations";
  quadraticLesson.hidden = view !== "quadratic";
  compositeLesson.hidden = view !== "composite";
  differentiationLesson.hidden = view !== "differentiation";
  planeGeometryLesson.hidden = view !== "planeGeometry";
  document.querySelector("#integralLesson").hidden = view !== "integration";
  document.querySelector("#odeLesson").hidden = view !== "differentialEquations";
  subjectPlaceholder.hidden =
    view === "equations" ||
    view === "quadratic" ||
    view === "composite" ||
    view === "differentiation" ||
    view === "planeGeometry" || view === "integration" || view === "differentialEquations";

  setActiveNavigation(view);
  const hash = view === "home" ? "" : requestedPath;
  if (window.location.hash.slice(1) !== hash) window.location.hash = hash;
  closeMenu();
  window.dispatchEvent(new CustomEvent("mathviewchange", { detail: { view, focus: shouldFocus } }));

  if (shouldFocus && view !== "integration" && view !== "differentialEquations") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    mainContent.focus({ preventScroll: true });
  }
}

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.scrollTo}`).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const secantDemo = document.querySelector("#secantDemo");

if (secantDemo) {
  const hValues = [2, 1.5, 1, 0.75, 0.5, 0.25, 0.1, 0.05, 0.01];
  const initialHIndex = 2;
  let hIndex = initialHIndex;

  const graph = {
    left: 54,
    right: 700,
    top: 24,
    bottom: 330,
    xMin: -0.25,
    xMax: 3.25,
    yMin: -0.5,
    yMax: 10.5,
  };

  const curve = secantDemo.querySelector("#functionCurve");
  const tangentLine = secantDemo.querySelector("#tangentLine");
  const secantLine = secantDemo.querySelector("#secantLine");
  const fixedPoint = secantDemo.querySelector("#fixedPoint");
  const movingPoint = secantDemo.querySelector("#movingPoint");
  const fixedPointLabel = secantDemo.querySelector("#fixedPointLabel");
  const movingPointLabel = secantDemo.querySelector("#movingPointLabel");
  const liveReadout = secantDemo.querySelector("#secantLive");
  const observation = secantDemo.querySelector("#secantObservation");
  const graphSvg = secantDemo.querySelector("#secantGraph");
  const closerButton = secantDemo.querySelector("#secantCloser");
  const fartherButton = secantDemo.querySelector("#secantFarther");
  const resetButton = secantDemo.querySelector("#secantReset");

  const graphX = (value) =>
    graph.left + ((value - graph.xMin) / (graph.xMax - graph.xMin)) * (graph.right - graph.left);
  const graphY = (value) =>
    graph.bottom - ((value - graph.yMin) / (graph.yMax - graph.yMin)) * (graph.bottom - graph.top);

  function formatGraphNumber(value, maximumFractionDigits = 4) {
    return Number(value.toFixed(maximumFractionDigits)).toLocaleString("da-DK", {
      maximumFractionDigits,
    });
  }

  function setLine(line, slope, intercept) {
    line.setAttribute("x1", String(graphX(graph.xMin)));
    line.setAttribute("y1", String(graphY(slope * graph.xMin + intercept)));
    line.setAttribute("x2", String(graphX(graph.xMax)));
    line.setAttribute("y2", String(graphY(slope * graph.xMax + intercept)));
  }

  function positionPoint(point, label, x, y, labelOffsetX, labelOffsetY) {
    const cx = graphX(x);
    const cy = graphY(y);
    point.setAttribute("cx", String(cx));
    point.setAttribute("cy", String(cy));
    label.setAttribute("x", String(cx + labelOffsetX));
    label.setAttribute("y", String(cy + labelOffsetY));
  }

  function updateSecantDemo() {
    const h = hValues[hIndex];
    const qX = 1 + h;
    const qY = qX ** 2;
    const secantSlope = 2 + h;
    const secantIntercept = 1 - secantSlope;
    const hText = formatGraphNumber(h, 2);
    const qXText = formatGraphNumber(qX, 2);
    const qYText = formatGraphNumber(qY);
    const slopeText = formatGraphNumber(secantSlope, 2);

    setLine(tangentLine, 2, -1);
    setLine(secantLine, secantSlope, secantIntercept);
    positionPoint(fixedPoint, fixedPointLabel, 1, 1, -24, 25);
    positionPoint(movingPoint, movingPointLabel, qX, qY, 12, -12);

    liveReadout.innerHTML = `
      <div class="secant-values">
        <div><span>Afstanden mellem punkterne</span><math><mrow><mi>h</mi><mo>=</mo><mn>${hText}</mn></mrow></math></div>
        <div><span>Det bevægelige punkt</span><math><mrow><mi>Q</mi><mo>=</mo><mo>(</mo><mn>${qXText}</mn><mo>,</mo><mn>${qYText}</mn><mo>)</mo></mrow></math></div>
      </div>
      <div class="secant-equation-wrap">
        <span>Sekantens hældning</span>
        <math display="block" class="secant-equation">
          <mrow>
            <msub><mi>m</mi><mtext>sekant</mtext></msub><mo>=</mo>
            <mfrac><mrow><mn>${qYText}</mn><mo>−</mo><mn>1</mn></mrow><mrow><mn>${qXText}</mn><mo>−</mo><mn>1</mn></mrow></mfrac>
            <mo>=</mo><mn>${slopeText}</mn>
          </mrow>
        </math>
      </div>`;

    observation.innerHTML =
      h <= 0.05
        ? `Sekanten ligger nu næsten oven i tangenten. Vi stopper ved et lille positivt <math><mi>h</mi></math>, fordi differenskvotienten ikke kan beregnes med <math><mrow><mi>h</mi><mo>=</mo><mn>0</mn></mrow></math>.`
        : `Sekantens hældning er <math><mn>${hText}</mn></math> større end tangentens. Når <math><mi>h</mi></math> bliver mindre, bliver forskellen lige så meget mindre.`;

    graphSvg.setAttribute(
      "aria-label",
      `Graf for f af x lig x i anden. Punkt P er fast ved en komma en. Punkt Q er ved ${qXText} komma ${qYText}. Sekantens hældning er ${slopeText}, og tangentens hældning er to.`,
    );

    closerButton.disabled = hIndex === hValues.length - 1;
    fartherButton.disabled = hIndex === 0;
  }

  const curvePoints = Array.from({ length: 81 }, (_, index) => {
    const x = (3.2 * index) / 80;
    return `${index === 0 ? "M" : "L"}${graphX(x).toFixed(2)},${graphY(x ** 2).toFixed(2)}`;
  });
  curve.setAttribute("d", curvePoints.join(" "));

  closerButton.addEventListener("click", () => {
    hIndex = Math.min(hIndex + 1, hValues.length - 1);
    updateSecantDemo();
  });

  fartherButton.addEventListener("click", () => {
    hIndex = Math.max(hIndex - 1, 0);
    updateSecantDemo();
  });

  resetButton.addEventListener("click", () => {
    hIndex = initialHIndex;
    updateSecantDemo();
  });

  secantDemo.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      hIndex = Math.min(hIndex + 1, hValues.length - 1);
      updateSecantDemo();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      hIndex = Math.max(hIndex - 1, 0);
      updateSecantDemo();
    }
  });

  updateSecantDemo();
}

const productRuleBuilder = document.querySelector("#productRuleBuilder");

if (productRuleBuilder) {
  const live = productRuleBuilder.querySelector("#productBuilderLive");
  const previousButton = productRuleBuilder.querySelector("#productBuilderPrevious");
  const nextButton = productRuleBuilder.querySelector("#productBuilderNext");
  const resetButton = productRuleBuilder.querySelector("#productBuilderReset");
  const progressDots = [...productRuleBuilder.querySelectorAll(".product-builder-progress span")];
  let step = 0;

  const steps = [
    {
      label: "Trin 1 · Find faktorerne",
      math: `<math display="block"><mtable columnalign="left"><mtr><mtd><mi>u</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><msup><mi>x</mi><mn>2</mn></msup></mtd></mtr><mtr><mtd><mi>v</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mi mathvariant="normal">ln</mi><mo>(</mo><mi>x</mi><mo>)</mo></mtd></mtr></mtable></math>`,
      explanation: "Gangetegnet deler forskriften i to faktorer. Skriv dem hver for sig, før du differentierer.",
    },
    {
      label: "Trin 2 · Differentier hver faktor",
      math: `<math display="block"><mtable columnalign="left"><mtr><mtd><msup><mi>u</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>2</mn><mi>x</mi></mtd></mtr><mtr><mtd><msup><mi>v</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><mi>x</mi></mfrac></mtd></mtr></mtable></math>`,
      explanation: "Nu har du fire brikker: de to oprindelige faktorer og deres to afledede.",
    },
    {
      label: "Trin 3 · Sæt ind i produktreglen",
      math: `<math display="block"><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>2</mn><mi>x</mi><mo>·</mo><mi mathvariant="normal">ln</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>+</mo><msup><mi>x</mi><mn>2</mn></msup><mo>·</mo><mfrac><mn>1</mn><mi>x</mi></mfrac></mrow></math>`,
      explanation: "Første led ændrer den første faktor. Andet led ændrer den anden. Derfor er der et plustegn.",
    },
    {
      label: "Trin 4 · Forenkl sikkert",
      math: `<math display="block"><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>2</mn><mi>x</mi><mi mathvariant="normal">ln</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>+</mo><mi>x</mi></mrow></math>`,
      explanation: "Kun det sidste produkt forkortes. Nu er reglen stadig synlig i regnegangen, og svaret er ryddeligt.",
    },
  ];

  function updateProductBuilder() {
    const current = steps[step];
    live.innerHTML = `<span>${current.label}</span>${current.math}<p>${current.explanation}</p>`;
    progressDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === step);
      dot.classList.toggle("is-complete", index < step);
    });
    previousButton.disabled = step === 0;
    nextButton.disabled = step === steps.length - 1;
    nextButton.textContent = step === steps.length - 2 ? "Vis resultat →" : "Næste trin →";
    productRuleBuilder.setAttribute(
      "aria-label",
      `Produktreglen trin for trin. Viser trin ${step + 1} af ${steps.length}: ${current.label.replace(/^Trin \d · /, "")}.`,
    );
  }

  previousButton.addEventListener("click", () => {
    step = Math.max(0, step - 1);
    updateProductBuilder();
  });

  nextButton.addEventListener("click", () => {
    step = Math.min(steps.length - 1, step + 1);
    updateProductBuilder();
  });

  resetButton.addEventListener("click", () => {
    step = 0;
    updateProductBuilder();
  });

  productRuleBuilder.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step = Math.max(0, step - 1);
      updateProductBuilder();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      step = Math.min(steps.length - 1, step + 1);
      updateProductBuilder();
    }
  });

  updateProductBuilder();
}

const chainRuleBuilder = document.querySelector("#chainRuleBuilder");

if (chainRuleBuilder) {
  const live = chainRuleBuilder.querySelector("#chainBuilderLive");
  const previousButton = chainRuleBuilder.querySelector("#chainBuilderPrevious");
  const nextButton = chainRuleBuilder.querySelector("#chainBuilderNext");
  const resetButton = chainRuleBuilder.querySelector("#chainBuilderReset");
  const progressDots = [...chainRuleBuilder.querySelectorAll(".chain-builder-progress span")];
  let step = 0;

  const steps = [
    {
      label: "Trin 1 · Find de to lag",
      math: `<math display="block"><mtable columnalign="left"><mtr><mtd><mi>g</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>3</mn><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>1</mn></mtd><mtd><mtext>indre</mtext></mtd></mtr><mtr><mtd><mi>h</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo><msup><mi>t</mi><mn>3</mn></msup></mtd><mtd><mtext>ydre</mtext></mtd></mtr></mtable></math>`,
      explanation: "g er den indre funktion, fordi x sættes ind i g først. Resultatet g(x) sendes videre til den ydre funktion h, hvor pladsholderen t opløftes i tredje.",
    },
    {
      label: "Trin 2 · Differentier hvert lag",
      math: `<math display="block"><mtable columnalign="left"><mtr><mtd><msup><mi>g</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>6</mn><mi>x</mi></mtd></mtr><mtr><mtd><msup><mi>h</mi><mo>′</mo></msup><mo>(</mo><mi>t</mi><mo>)</mo><mo>=</mo><mn>3</mn><msup><mi>t</mi><mn>2</mn></msup></mtd></mtr></mtable></math>`,
      explanation: "Differentier g og h hver for sig: g′ hører til det indre lag, mens h′ hører til det ydre lag.",
    },
    {
      label: "Trin 3 · Sæt indersiden tilbage",
      math: `<math display="block"><mrow><msup><mi>h</mi><mo>′</mo></msup><mo>(</mo><mi>g</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>)</mo><mo>=</mo><mn>3</mn><msup><mrow><mo>(</mo><mn>3</mn><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup></mrow></math>`,
      explanation: "Den ydre afledte bestemmer formen. Hele den oprindelige parentes står stadig på t's plads.",
    },
    {
      label: "Trin 4 · Gang med den indre afledte",
      math: `<math display="block"><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mn>3</mn><msup><mrow><mo>(</mo><mn>3</mn><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup><mo>·</mo><mn>6</mn><mi>x</mi><mo>=</mo><mn>18</mn><mi>x</mi><msup><mrow><mo>(</mo><mn>3</mn><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup></mrow></math>`,
      explanation: "Nu er kæden komplet: ydre afledte gange indre afledte. Først til sidst samles de numeriske faktorer.",
    },
  ];

  function updateChainBuilder() {
    const current = steps[step];
    live.innerHTML = `<span>${current.label}</span>${current.math}<p>${current.explanation}</p>`;
    progressDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === step);
      dot.classList.toggle("is-complete", index < step);
    });
    previousButton.disabled = step === 0;
    nextButton.disabled = step === steps.length - 1;
    nextButton.textContent = step === steps.length - 2 ? "Vis resultat →" : "Næste trin →";
    chainRuleBuilder.setAttribute(
      "aria-label",
      `Kædereglen trin for trin. Viser trin ${step + 1} af ${steps.length}: ${current.label.replace(/^Trin \d · /, "")}.`,
    );
  }

  previousButton.addEventListener("click", () => {
    step = Math.max(0, step - 1);
    updateChainBuilder();
  });

  nextButton.addEventListener("click", () => {
    step = Math.min(steps.length - 1, step + 1);
    updateChainBuilder();
  });

  resetButton.addEventListener("click", () => {
    step = 0;
    updateChainBuilder();
  });

  chainRuleBuilder.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step = Math.max(0, step - 1);
      updateChainBuilder();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      step = Math.min(steps.length - 1, step + 1);
      updateChainBuilder();
    }
  });

  updateChainBuilder();
}

const functionPlotter = document.querySelector("#functionPlotter");

if (functionPlotter) {
  const functionInput = functionPlotter.querySelector("#plotFunctionInput");
  const derivativeInput = functionPlotter.querySelector("#plotDerivativeInput");
  const xMinInput = functionPlotter.querySelector("#plotXMin");
  const xMaxInput = functionPlotter.querySelector("#plotXMax");
  const functionError = functionPlotter.querySelector("#plotFunctionError");
  const derivativeError = functionPlotter.querySelector("#plotDerivativeError");
  const rangeError = functionPlotter.querySelector("#plotRangeError");
  const status = functionPlotter.querySelector("#functionPlotStatus");
  const derivativeCheck = functionPlotter.querySelector("#derivativeCheck");
  const plotDescription = functionPlotter.querySelector("#functionPlotDescription");
  const mainCurve = functionPlotter.querySelector("#functionPlotCurve");
  const derivativeCurve = functionPlotter.querySelector("#derivativePlotCurve");
  const derivativeLegend = functionPlotter.querySelector("#derivativePlotLegend");
  const gridGroup = functionPlotter.querySelector("#functionPlotGrid");
  const axesGroup = functionPlotter.querySelector("#functionPlotAxes");
  const svgNamespace = "http://www.w3.org/2000/svg";
  const bounds = { left: 64, right: 798, top: 20, bottom: 400 };

  const presets = {
    sine: { functionValue: "sin(x²)", derivativeValue: "2·x·cos(x²)", xMin: "−4", xMax: "4" },
    power: { functionValue: "(x² + 1)³", derivativeValue: "6·x·(x² + 1)²", xMin: "−2", xMax: "2" },
    exponential: { functionValue: "e^(0,5·x)", derivativeValue: "0,5·e^(0,5·x)", xMin: "−5", xMax: "5" },
  };

  const mathFunctions = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    ln: Math.log,
    log: Math.log10,
    sqrt: Math.sqrt,
    abs: Math.abs,
    exp: Math.exp,
  };

  function expressionError(message) {
    const error = new Error(message);
    error.name = "ExpressionError";
    return error;
  }

  function normalizeExpression(source) {
    if (source.length > 160) throw expressionError("Udtrykket er for langt. Del det op eller skriv en kortere form.");

    let normalized = source
      .trim()
      .replace(/^(?:f\s*[′']?\s*\(\s*x\s*\)|y)\s*=/i, "")
      .replace(/[−–—]/g, "-")
      .replace(/[·×]/g, "*")
      .replace(/÷/g, "/")
      .replace(/√/g, "sqrt")
      .replace(/π/g, "pi")
      .replace(/(\d),(?=\d)/g, "$1.")
      .replace(/\s+/g, "");

    const superscriptDigits = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
    normalized = normalized.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (sequence) => {
      const exponent = [...sequence].map((character) => superscriptDigits[character]).join("");
      return `^(${exponent})`;
    });

    return normalized;
  }

  function tokenizeExpression(source) {
    const tokens = [];
    let index = 0;

    while (index < source.length) {
      const character = source[index];

      if (/\d|\./.test(character)) {
        const match = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
        if (!match) throw expressionError("Tallet er ikke skrevet i en genkendelig form.");
        const value = Number(match[0]);
        if (!Number.isFinite(value)) throw expressionError("Et af tallene er for stort.");
        tokens.push({ type: "number", value });
        index += match[0].length;
        continue;
      }

      if (/[a-z]/i.test(character)) {
        const match = source.slice(index).match(/^[a-z]+/i);
        const name = match[0].toLowerCase();
        if (name === "x") tokens.push({ type: "variable" });
        else if (name === "e" || name === "pi") tokens.push({ type: "constant", value: name === "e" ? Math.E : Math.PI });
        else if (mathFunctions[name]) tokens.push({ type: "function", value: name });
        else throw expressionError(`“${match[0]}” er ikke et kendt navn. Brug fx sin, cos, ln eller sqrt.`);
        index += match[0].length;
        continue;
      }

      if ("+-*/^()".includes(character)) {
        const tokenTypes = { "(": "leftParenthesis", ")": "rightParenthesis" };
        tokens.push({ type: tokenTypes[character] || "operator", value: character });
        index += 1;
        continue;
      }

      throw expressionError(`Tegnet “${character}” kan ikke bruges her.`);
    }

    const withMultiplication = [];
    tokens.forEach((token) => {
      const previous = withMultiplication.at(-1);
      const previousCanEnd = previous && ["number", "variable", "constant", "rightParenthesis"].includes(previous.type);
      const currentCanStart = ["number", "variable", "constant", "function", "leftParenthesis"].includes(token.type);
      if (previousCanEnd && currentCanStart) withMultiplication.push({ type: "operator", value: "*" });
      withMultiplication.push(token);
    });
    withMultiplication.push({ type: "end" });
    return withMultiplication;
  }

  function compileExpression(source) {
    if (!source.trim()) throw expressionError("Skriv en funktion i feltet.");
    const tokens = tokenizeExpression(normalizeExpression(source));
    let position = 0;
    const current = () => tokens[position];
    const take = () => tokens[position++];

    function parsePrimary() {
      const token = take();
      if (token.type === "number") return () => token.value;
      if (token.type === "variable") return (x) => x;
      if (token.type === "constant") return () => token.value;

      if (token.type === "function") {
        if (current().type !== "leftParenthesis") throw expressionError(`Skriv ${token.value} med parentes om argumentet.`);
        take();
        const argument = parseExpression();
        if (current().type !== "rightParenthesis") throw expressionError("Der mangler en afsluttende parentes.");
        take();
        return (x) => mathFunctions[token.value](argument(x));
      }

      if (token.type === "leftParenthesis") {
        const expression = parseExpression();
        if (current().type !== "rightParenthesis") throw expressionError("Der mangler en afsluttende parentes.");
        take();
        return expression;
      }

      if (token.type === "end") throw expressionError("Udtrykket slutter for tidligt.");
      throw expressionError("Her forventede jeg et tal, en variabel eller en parentes.");
    }

    function parsePower() {
      const base = parsePrimary();
      if (current().type === "operator" && current().value === "^") {
        take();
        const exponent = parseUnary();
        return (x) => base(x) ** exponent(x);
      }
      return base;
    }

    function parseUnary() {
      if (current().type === "operator" && (current().value === "+" || current().value === "-")) {
        const operator = take().value;
        const operand = parseUnary();
        return operator === "-" ? (x) => -operand(x) : operand;
      }
      return parsePower();
    }

    function parseTerm() {
      let left = parseUnary();
      while (current().type === "operator" && (current().value === "*" || current().value === "/")) {
        const operator = take().value;
        const right = parseUnary();
        const previous = left;
        left = operator === "*" ? (x) => previous(x) * right(x) : (x) => previous(x) / right(x);
      }
      return left;
    }

    function parseExpression() {
      let left = parseTerm();
      while (current().type === "operator" && (current().value === "+" || current().value === "-")) {
        const operator = take().value;
        const right = parseTerm();
        const previous = left;
        left = operator === "+" ? (x) => previous(x) + right(x) : (x) => previous(x) - right(x);
      }
      return left;
    }

    const compiled = parseExpression();
    if (current().type === "rightParenthesis") throw expressionError("Der er en afsluttende parentes for meget.");
    if (current().type !== "end") throw expressionError("Udtrykket kan ikke læses færdigt. Kontrollér regnetegnene.");
    return compiled;
  }

  function parseRangeValue(value) {
    return Number(value.trim().replace(/[−–—]/g, "-").replace(",", "."));
  }

  function formatPlotNumber(value) {
    const rounded = Math.abs(value) < 0.0000001 ? 0 : value;
    return Number(rounded.toPrecision(4)).toLocaleString("da-DK", { maximumFractionDigits: 4 });
  }

  function setFieldError(input, element, message = "") {
    element.textContent = message;
    input.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function createSvgElement(name, attributes = {}, text = "") {
    const element = document.createElementNS(svgNamespace, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    return element;
  }

  function percentile(sortedValues, proportion) {
    if (!sortedValues.length) return 0;
    return sortedValues[Math.min(sortedValues.length - 1, Math.floor((sortedValues.length - 1) * proportion))];
  }

  function makeCurvePath(fn, xMin, xMax, yMin, yMax) {
    const samples = 720;
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const xToPixel = (x) => bounds.left + ((x - xMin) / (xMax - xMin)) * width;
    const yToPixel = (y) => bounds.bottom - ((y - yMin) / (yMax - yMin)) * height;
    let path = "";
    let drawing = false;
    let previousY = null;

    for (let index = 0; index <= samples; index += 1) {
      const x = xMin + (index / samples) * (xMax - xMin);
      const y = fn(x);
      const pixelY = yToPixel(y);
      const isVisible = Number.isFinite(y) && pixelY > bounds.top - height * 1.5 && pixelY < bounds.bottom + height * 1.5;
      const jumped = previousY !== null && Math.abs(pixelY - previousY) > height * 0.72;
      if (!isVisible || jumped) {
        drawing = false;
        previousY = isVisible ? pixelY : null;
        continue;
      }
      path += `${drawing ? "L" : "M"}${xToPixel(x).toFixed(2)},${pixelY.toFixed(2)}`;
      drawing = true;
      previousY = pixelY;
    }
    return path;
  }

  function drawCoordinateSystem(xMin, xMax, yMin, yMax) {
    gridGroup.replaceChildren();
    axesGroup.replaceChildren();
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const xToPixel = (x) => bounds.left + ((x - xMin) / (xMax - xMin)) * width;
    const yToPixel = (y) => bounds.bottom - ((y - yMin) / (yMax - yMin)) * height;
    const xAxisY = yMin <= 0 && yMax >= 0 ? yToPixel(0) : bounds.bottom;
    const yAxisX = xMin <= 0 && xMax >= 0 ? xToPixel(0) : bounds.left;

    for (let index = 0; index <= 8; index += 1) {
      const value = xMin + (index / 8) * (xMax - xMin);
      const x = xToPixel(value);
      gridGroup.append(createSvgElement("line", { class: "function-plot-gridline", x1: x, y1: bounds.top, x2: x, y2: bounds.bottom }));
      axesGroup.append(createSvgElement("text", { class: "function-plot-tick", x, y: bounds.bottom + 23, "text-anchor": "middle" }, formatPlotNumber(value)));
    }

    for (let index = 0; index <= 6; index += 1) {
      const value = yMin + (index / 6) * (yMax - yMin);
      const y = yToPixel(value);
      gridGroup.append(createSvgElement("line", { class: "function-plot-gridline", x1: bounds.left, y1: y, x2: bounds.right, y2: y }));
      axesGroup.append(createSvgElement("text", { class: "function-plot-tick", x: bounds.left - 10, y: y + 4, "text-anchor": "end" }, formatPlotNumber(value)));
    }

    axesGroup.append(createSvgElement("line", { class: "function-plot-axis", x1: bounds.left, y1: xAxisY, x2: bounds.right, y2: xAxisY }));
    axesGroup.append(createSvgElement("line", { class: "function-plot-axis", x1: yAxisX, y1: bounds.top, x2: yAxisX, y2: bounds.bottom }));
    axesGroup.append(createSvgElement("text", { class: "function-plot-axis-label", x: bounds.right - 8, y: xAxisY - 9 }, "x"));
    axesGroup.append(createSvgElement("text", { class: "function-plot-axis-label", x: yAxisX + 10, y: bounds.top + 16 }, "y"));
  }

  function assessDerivative(fn, candidate, xMin, xMax) {
    const errors = [];
    const step = Math.max((xMax - xMin) * 0.00001, 0.000001);
    for (let index = 1; index <= 19; index += 1) {
      const x = xMin + (index / 20) * (xMax - xMin);
      const left = fn(x - step);
      const right = fn(x + step);
      const candidateValue = candidate(x);
      const numericalDerivative = (right - left) / (2 * step);
      if (![left, right, candidateValue, numericalDerivative].every(Number.isFinite)) continue;
      const scale = 1 + Math.abs(numericalDerivative) + Math.abs(candidateValue);
      errors.push(Math.abs(numericalDerivative - candidateValue) / scale);
    }
    errors.sort((a, b) => a - b);
    if (errors.length < 6) return { kind: "neutral", message: "Der er for få brugbare punkter til en sikker numerisk sammenligning i dette interval." };
    const medianError = percentile(errors, 0.5);
    if (medianError < 0.006) return { kind: "positive", message: "Den numeriske kontrol tyder tydeligt på, at den violette graf er den afledte af den blå." };
    if (medianError < 0.04) return { kind: "neutral", message: "Graferne ligger forholdsvis tæt, men kontrollen er ikke entydig. Prøv også at kontrollere din differentiation i hånden." };
    return { kind: "negative", message: "Graferne ser ikke ud til at passe som funktion og afledt. Kontrollér især faktoren fra den indre funktion." };
  }

  function renderPlot() {
    setFieldError(functionInput, functionError);
    setFieldError(derivativeInput, derivativeError);
    rangeError.textContent = "";
    status.textContent = "";
    derivativeCheck.textContent = "";
    derivativeCheck.className = "derivative-check";

    let fn;
    let derivative = null;
    let hasError = false;
    try {
      fn = compileExpression(functionInput.value);
    } catch (error) {
      setFieldError(functionInput, functionError, error.message);
      hasError = true;
    }

    if (derivativeInput.value.trim()) {
      try {
        derivative = compileExpression(derivativeInput.value);
      } catch (error) {
        setFieldError(derivativeInput, derivativeError, error.message);
        hasError = true;
      }
    }

    const xMin = parseRangeValue(xMinInput.value);
    const xMax = parseRangeValue(xMaxInput.value);
    if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) {
      rangeError.textContent = "Skriv to gyldige tal som interval.";
      hasError = true;
    } else if (xMin >= xMax) {
      rangeError.textContent = "Den mindste x-værdi skal være mindre end den største.";
      hasError = true;
    } else if (Math.abs(xMin) > 1000000 || Math.abs(xMax) > 1000000 || xMax - xMin > 1000) {
      rangeError.textContent = "Vælg et interval med en bredde på højst 1.000 og værdier mellem −1.000.000 og 1.000.000.";
      hasError = true;
    }

    if (hasError) {
      status.innerHTML = "<strong>Grafen blev ikke ændret.</strong><span>Ret det markerede felt, og prøv igen.</span>";
      return;
    }

    const sampleVisibleValues = (curveFunction) => {
      const values = [];
      for (let index = 0; index <= 500; index += 1) {
        const x = xMin + (index / 500) * (xMax - xMin);
        const y = curveFunction(x);
        if (Number.isFinite(y) && Math.abs(y) < 1000000000) values.push(y);
      }
      return values;
    };
    const functionValues = sampleVisibleValues(fn);
    const derivativeValues = derivative ? sampleVisibleValues(derivative) : [];

    if (!functionValues.length) {
      setFieldError(functionInput, functionError, "Funktionen har ingen synlige, reelle værdier i det valgte interval.");
      status.innerHTML = "<strong>Ingen graf at vise.</strong><span>Prøv et andet interval eller kontrollér funktionen.</span>";
      return;
    }

    if (derivative && !derivativeValues.length) {
      setFieldError(derivativeInput, derivativeError, "Den mulige afledte har ingen synlige, reelle værdier i det valgte interval.");
      status.innerHTML = "<strong>Grafen blev ikke ændret.</strong><span>Prøv et andet interval eller kontrollér den mulige afledte.</span>";
      return;
    }

    const visibleValues = [...functionValues, ...derivativeValues];
    visibleValues.sort((a, b) => a - b);
    let yMin = Math.min(0, percentile(visibleValues, 0.02));
    let yMax = Math.max(0, percentile(visibleValues, 0.98));
    if (Math.abs(yMax - yMin) < 0.000001) {
      yMin -= 1;
      yMax += 1;
    } else {
      const padding = (yMax - yMin) * 0.12;
      yMin -= padding;
      yMax += padding;
    }

    drawCoordinateSystem(xMin, xMax, yMin, yMax);
    mainCurve.setAttribute("d", makeCurvePath(fn, xMin, xMax, yMin, yMax));
    derivativeCurve.setAttribute("d", derivative ? makeCurvePath(derivative, xMin, xMax, yMin, yMax) : "");
    derivativeLegend.hidden = !derivative;
    plotDescription.textContent = derivative
      ? "Et koordinatsystem med en blå funktionsgraf og en violet graf for den mulige afledte."
      : "Et koordinatsystem med en blå funktionsgraf.";

    const graphCount = derivative ? "To grafer" : "Én graf";
    status.innerHTML = `<strong>${graphCount} tegnet.</strong><span>Interval: ${formatPlotNumber(xMin)} til ${formatPlotNumber(xMax)}. Den lodrette skala tilpasses automatisk.</span>`;

    if (derivative) {
      const result = assessDerivative(fn, derivative, xMin, xMax);
      derivativeCheck.classList.add(`is-${result.kind}`);
      derivativeCheck.innerHTML = `<strong>${result.kind === "positive" ? "Godt match" : result.kind === "negative" ? "Mulig fejl" : "Kontrollér videre"}</strong><span>${result.message}</span>`;
    } else {
      derivativeCheck.classList.add("is-neutral");
      derivativeCheck.innerHTML = "<strong>Kun funktionen vises.</strong><span>Tilføj den afledte i det andet felt, hvis du vil sammenligne dem.</span>";
    }
  }

  functionPlotter.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPlot();
  });

  functionPlotter.querySelectorAll("[data-plot-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets[button.dataset.plotPreset];
      functionInput.value = preset.functionValue;
      derivativeInput.value = preset.derivativeValue;
      xMinInput.value = preset.xMin;
      xMaxInput.value = preset.xMax;
      renderPlot();
    });
  });

  renderPlot();
}

const turningTangentDemo = document.querySelector("#turningTangentDemo");

if (turningTangentDemo) {
  const xValues = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
  const initialIndex = 5;
  let xIndex = initialIndex;
  const graph = { left: 50, right: 720, top: 24, bottom: 356, xMin: -2.4, xMax: 2.4, yMin: -6, yMax: 6 };
  const curve = turningTangentDemo.querySelector("#turnFunctionCurve");
  const tangent = turningTangentDemo.querySelector("#turnTangentLine");
  const point = turningTangentDemo.querySelector("#turnPoint");
  const pointLabel = turningTangentDemo.querySelector("#turnPointLabel");
  const live = turningTangentDemo.querySelector("#turnLive");
  const observation = turningTangentDemo.querySelector("#turnObservation");
  const graphSvg = turningTangentDemo.querySelector("#turnGraph");
  const leftButton = turningTangentDemo.querySelector("#turnLeft");
  const rightButton = turningTangentDemo.querySelector("#turnRight");
  const resetButton = turningTangentDemo.querySelector("#turnReset");

  const graphX = (value) => graph.left + ((value - graph.xMin) / (graph.xMax - graph.xMin)) * (graph.right - graph.left);
  const graphY = (value) => graph.bottom - ((value - graph.yMin) / (graph.yMax - graph.yMin)) * (graph.bottom - graph.top);
  const f = (x) => x ** 3 - 3 * x;

  function formatTurnNumber(value) {
    const safe = Math.abs(value) < 0.000001 ? 0 : value;
    return Number(safe.toFixed(2)).toLocaleString("da-DK", { maximumFractionDigits: 2 });
  }

  function turnMathNumber(value) {
    const safe = Math.abs(value) < 0.000001 ? 0 : value;
    const magnitude = Math.abs(safe);
    const number = Number(magnitude.toFixed(2)).toLocaleString("da-DK", { maximumFractionDigits: 2 });
    return safe < 0 ? `<mrow><mo>−</mo><mn>${number}</mn></mrow>` : `<mn>${number}</mn>`;
  }

  function updateTurningTangent() {
    const x = xValues[xIndex];
    const y = f(x);
    const slope = 3 * x ** 2 - 3;
    const curvature = 6 * x;
    const intercept = y - slope * x;
    tangent.setAttribute("x1", String(graphX(graph.xMin)));
    tangent.setAttribute("y1", String(graphY(slope * graph.xMin + intercept)));
    tangent.setAttribute("x2", String(graphX(graph.xMax)));
    tangent.setAttribute("y2", String(graphY(slope * graph.xMax + intercept)));
    point.setAttribute("cx", String(graphX(x)));
    point.setAttribute("cy", String(graphY(y)));
    point.classList.toggle("is-at-inflection", x === 0);
    pointLabel.setAttribute("x", String(graphX(x) + 12));
    pointLabel.setAttribute("y", String(graphY(y) - 12));

    live.innerHTML = `<div><span>Røringspunkt</span><math><mrow><mi>P</mi><mo>=</mo><mo>(</mo>${turnMathNumber(x)}<mo>,</mo>${turnMathNumber(y)}<mo>)</mo></mrow></math></div><div><span>Hældning</span><math><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${turnMathNumber(x)}<mo>)</mo><mo>=</mo>${turnMathNumber(slope)}</mrow></math></div><div><span>Krumning</span><math><mrow><msup><mi>f</mi><mo>″</mo></msup><mo>(</mo>${turnMathNumber(x)}<mo>)</mo><mo>=</mo>${turnMathNumber(curvature)}</mrow></math></div>`;

    observation.innerHTML = x === 0
      ? `Her skifter <math><msup><mi>f</mi><mo>″</mo></msup></math> fortegn. Punktet er et vendepunkt, og den orange linje er vendetangenten <math><mrow><mi>y</mi><mo>=</mo><mo>−</mo><mn>3</mn><mi>x</mi></mrow></math>.`
      : curvature < 0
        ? `Anden afledte er negativ, så grafen er nedadkrummet her. Flyt punktet mod <math><mrow><mi>x</mi><mo>=</mo><mn>0</mn></mrow></math>.`
        : `Anden afledte er positiv, så grafen er opadkrummet her. Flyt punktet mod <math><mrow><mi>x</mi><mo>=</mo><mn>0</mn></mrow></math>.`;

    graphSvg.setAttribute("aria-label", `Graf for f af x lig x i tredje minus tre x. Røringspunktet har x-koordinat ${formatTurnNumber(x)}, tangentens hældning er ${formatTurnNumber(slope)}, og anden afledte er ${formatTurnNumber(curvature)}.`);
    leftButton.disabled = xIndex === 0;
    rightButton.disabled = xIndex === xValues.length - 1;
  }

  const curvePoints = Array.from({ length: 121 }, (_, index) => {
    const x = graph.xMin + ((graph.xMax - graph.xMin) * index) / 120;
    return `${index === 0 ? "M" : "L"}${graphX(x).toFixed(2)},${graphY(f(x)).toFixed(2)}`;
  });
  curve.setAttribute("d", curvePoints.join(" "));

  leftButton.addEventListener("click", () => { xIndex = Math.max(0, xIndex - 1); updateTurningTangent(); });
  rightButton.addEventListener("click", () => { xIndex = Math.min(xValues.length - 1, xIndex + 1); updateTurningTangent(); });
  resetButton.addEventListener("click", () => { xIndex = initialIndex; updateTurningTangent(); });
  turningTangentDemo.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); xIndex = Math.max(0, xIndex - 1); updateTurningTangent(); }
    if (event.key === "ArrowRight") { event.preventDefault(); xIndex = Math.min(xValues.length - 1, xIndex + 1); updateTurningTangent(); }
  });
  updateTurningTangent();
}

const recapMonotonyDemo = document.querySelector("#recapMonotonyDemo");

if (recapMonotonyDemo) {
  const sampleValues = [-2, 0, 2];
  const initialSample = 1;
  let sampleIndex = initialSample;
  const graph = { left: 50, right: 720, top: 24, bottom: 356, xMin: -2.5, xMax: 2.5, yMin: -6, yMax: 6 };
  const curve = recapMonotonyDemo.querySelector("#recapFunctionCurve");
  const guide = recapMonotonyDemo.querySelector("#recapGuide");
  const point = recapMonotonyDemo.querySelector("#recapPoint");
  const pointLabel = recapMonotonyDemo.querySelector("#recapPointLabel");
  const criticalPoints = recapMonotonyDemo.querySelectorAll(".recap-critical");
  const live = recapMonotonyDemo.querySelector("#recapLive");
  const observation = recapMonotonyDemo.querySelector("#recapObservation");
  const graphSvg = recapMonotonyDemo.querySelector("#recapGraph");
  const leftButton = recapMonotonyDemo.querySelector("#recapLeft");
  const rightButton = recapMonotonyDemo.querySelector("#recapRight");
  const resetButton = recapMonotonyDemo.querySelector("#recapReset");
  const graphX = (value) => graph.left + ((value - graph.xMin) / (graph.xMax - graph.xMin)) * (graph.right - graph.left);
  const graphY = (value) => graph.bottom - ((value - graph.yMin) / (graph.yMax - graph.yMin)) * (graph.bottom - graph.top);
  const f = (x) => x ** 3 - 3 * x;
  const derivative = (x) => 3 * x ** 2 - 3;

  function recapMathNumber(value) {
    const safe = Math.abs(value) < 0.000001 ? 0 : value;
    const number = Number(Math.abs(safe).toFixed(2)).toLocaleString("da-DK", { maximumFractionDigits: 2 });
    return safe < 0 ? `<mrow><mo>−</mo><mn>${number}</mn></mrow>` : `<mn>${number}</mn>`;
  }

  function updateRecapMonotony() {
    const x = sampleValues[sampleIndex];
    const y = f(x);
    const slope = derivative(x);
    const direction = slope > 0 ? "voksende" : "aftagende";
    guide.setAttribute("x1", String(graphX(x)));
    guide.setAttribute("x2", String(graphX(x)));
    point.setAttribute("cx", String(graphX(x)));
    point.setAttribute("cy", String(graphY(y)));
    pointLabel.setAttribute("x", String(graphX(x) + 12));
    pointLabel.setAttribute("y", String(graphY(y) - 12));
    live.innerHTML = `<div><span>Testtal</span><math><mrow><mi>x</mi><mo>=</mo>${recapMathNumber(x)}</mrow></math></div><div><span>Afledt værdi</span><math><mrow><msup><mi>f</mi><mo>′</mo></msup><mo>(</mo>${recapMathNumber(x)}<mo>)</mo><mo>=</mo>${recapMathNumber(slope)}</mrow></math></div><div><span>Grafens retning</span><strong>${direction}</strong></div>`;
    observation.innerHTML = sampleIndex === 0
      ? `Testtallet ligger før <math><mrow><mi>x</mi><mo>=</mo><mo>−</mo><mn>1</mn></mrow></math>. Den afledte er positiv, så grafen er voksende.`
      : sampleIndex === 1
        ? `Testtallet ligger mellem de to stationære punkter. Den afledte er negativ, så grafen er aftagende.`
        : `Testtallet ligger efter <math><mrow><mi>x</mi><mo>=</mo><mn>1</mn></mrow></math>. Den afledte er positiv, så grafen er voksende igen.`;
    graphSvg.setAttribute("aria-label", `Graf for f af x lig x i tredje minus tre x. Testtallet er ${x}, den afledte værdi er ${slope}, og grafen er ${direction}.`);
    leftButton.disabled = sampleIndex === 0;
    rightButton.disabled = sampleIndex === sampleValues.length - 1;
  }

  const curvePoints = Array.from({ length: 121 }, (_, index) => {
    const x = graph.xMin + ((graph.xMax - graph.xMin) * index) / 120;
    return `${index === 0 ? "M" : "L"}${graphX(x).toFixed(2)},${graphY(f(x)).toFixed(2)}`;
  });
  curve.setAttribute("d", curvePoints.join(" "));
  [-1, 1].forEach((x, index) => {
    criticalPoints[index].setAttribute("cx", String(graphX(x)));
    criticalPoints[index].setAttribute("cy", String(graphY(f(x))));
  });

  leftButton.addEventListener("click", () => { sampleIndex = Math.max(0, sampleIndex - 1); updateRecapMonotony(); });
  rightButton.addEventListener("click", () => { sampleIndex = Math.min(sampleValues.length - 1, sampleIndex + 1); updateRecapMonotony(); });
  resetButton.addEventListener("click", () => { sampleIndex = initialSample; updateRecapMonotony(); });
  recapMonotonyDemo.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); sampleIndex = Math.max(0, sampleIndex - 1); updateRecapMonotony(); }
    if (event.key === "ArrowRight") { event.preventDefault(); sampleIndex = Math.min(sampleValues.length - 1, sampleIndex + 1); updateRecapMonotony(); }
  });
  updateRecapMonotony();
}

const vectorPointLab = document.querySelector("#vectorPointLab");

if (vectorPointLab) {
  const points = vectorPointLab.querySelector("#vectorLabPoints");
  const arrow = vectorPointLab.querySelector("#vectorLabArrow");
  const components = vectorPointLab.querySelector("#vectorLabComponents");
  const stageText = vectorPointLab.querySelector("#vectorStageText");
  const buttons = [...vectorPointLab.querySelectorAll("[data-vector-stage]")];
  let stage = 0;

  const stages = [
    {
      title: "1 · Punkter",
      body: `<math><mi>A</mi></math> og <math><mi>B</mi></math> er to faste steder i planen.`,
    },
    {
      title: "2 · Vektoren",
      body: `Pilen viser flytningen fra <math><mi>A</mi></math> til <math><mi>B</mi></math>. Den kan flyttes parallelt uden at ændre sig.`,
    },
    {
      title: "3 · Koordinatdelene",
      body: `Fra <math><mi>A</mi></math> til <math><mi>B</mi></math> går vi <math><mn>5</mn></math> mod højre og <math><mn>3</mn></math> op.`,
    },
  ];

  function updateVectorLab() {
    points.toggleAttribute("hidden", stage !== 0);
    arrow.toggleAttribute("hidden", stage === 0);
    components.toggleAttribute("hidden", stage !== 2);
    stageText.innerHTML = `<strong>${stages[stage].title}</strong><p>${stages[stage].body}</p>`;
    buttons.forEach((button, index) => {
      const active = index === stage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stage = Number(button.dataset.vectorStage);
      updateVectorLab();
    });
  });

  vectorPointLab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stage = Math.max(0, stage - 1);
      updateVectorLab();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stage = Math.min(stages.length - 1, stage + 1);
      updateVectorLab();
    }
  });

  updateVectorLab();
}

const scalarAngleLab = document.querySelector("#scalarAngleLab");

if (scalarAngleLab) {
  const groups = [...scalarAngleLab.querySelectorAll("[data-angle-stage]")];
  const buttons = [...scalarAngleLab.querySelectorAll("[data-angle-target]")];
  const status = scalarAngleLab.querySelector("#scalarAngleStatus");
  const math = scalarAngleLab.querySelector("#scalarAngleMath");
  const stages = ["acute", "right", "obtuse"];
  let stageIndex = 0;

  const content = {
    acute: {
      title: "Spids vinkel",
      body: "Skalarproduktet er positivt, fordi cosinus til vinklen er positiv.",
      math: `<math display="block"><mrow><mover><mi>a</mi><mo>→</mo></mover><mo>·</mo><mover><mi>b</mi><mo>→</mo></mover><mo>=</mo><mn>12</mn><mo>&gt;</mo><mn>0</mn></mrow></math>`,
    },
    right: {
      title: "Ret vinkel",
      body: "Skalarproduktet er nul. Derfor er vektorerne ortogonale.",
      math: `<math display="block"><mrow><mover><mi>a</mi><mo>→</mo></mover><mo>·</mo><mover><mi>b</mi><mo>→</mo></mover><mo>=</mo><mn>0</mn></mrow></math>`,
    },
    obtuse: {
      title: "Stump vinkel",
      body: "Skalarproduktet er negativt, fordi cosinus til vinklen er negativ.",
      math: `<math display="block"><mrow><mover><mi>a</mi><mo>→</mo></mover><mo>·</mo><mover><mi>b</mi><mo>→</mo></mover><mo>=</mo><mo>−</mo><mn>12</mn><mo>&lt;</mo><mn>0</mn></mrow></math>`,
    },
  };

  function updateScalarAngleLab() {
    const activeStage = stages[stageIndex];
    groups.forEach((group) => group.toggleAttribute("hidden", group.dataset.angleStage !== activeStage));
    buttons.forEach((button) => {
      const active = button.dataset.angleTarget === activeStage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    status.innerHTML = `<strong>${content[activeStage].title}</strong><p>${content[activeStage].body}</p>`;
    math.innerHTML = content[activeStage].math;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stageIndex = stages.indexOf(button.dataset.angleTarget);
      updateScalarAngleLab();
    });
  });

  scalarAngleLab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stageIndex = Math.max(0, stageIndex - 1);
      updateScalarAngleLab();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stageIndex = Math.min(stages.length - 1, stageIndex + 1);
      updateScalarAngleLab();
    }
  });

  updateScalarAngleLab();
}

const projectionGeometryLab = document.querySelector("#projectionGeometryLab");

if (projectionGeometryLab) {
  const groups = [...projectionGeometryLab.querySelectorAll("[data-projection-stage]")];
  const buttons = [...projectionGeometryLab.querySelectorAll("[data-projection-target]")];
  const status = projectionGeometryLab.querySelector("#projectionLabStatus");
  const math = projectionGeometryLab.querySelector("#projectionLabMath");
  const stages = ["projection", "perpendicular", "determinant"];
  let stageIndex = 0;

  const content = {
    projection: {
      title: "Projektion",
      body: "Den stiplede linje falder vinkelret ned. Resultatet ligger altid langs den vektor, der projiceres på.",
      math: `<math display="block"><mrow><msub><mi mathvariant="normal">proj</mi><mover><mi>b</mi><mo>→</mo></mover></msub><mo>(</mo><mover><mi>a</mi><mo>→</mo></mover><mo>)</mo><mo>=</mo><mo>(</mo><mtable><mtr><mtd><mn>4</mn></mtd></mtr><mtr><mtd><mn>0</mn></mtd></mtr></mtable><mo>)</mo></mrow></math>`,
    },
    perpendicular: {
      title: "Tværvektor",
      body: "Tværvektoren er drejet 90° mod uret. Derfor er skalarproduktet mellem de to vektorer nul.",
      math: `<math display="block"><mrow><mover><mi>a</mi><mo>→</mo></mover><mo>·</mo><msup><mover><mi>a</mi><mo>→</mo></mover><mo>⊥</mo></msup><mo>=</mo><mn>0</mn></mrow></math>`,
    },
    determinant: {
      title: "Determinant",
      body: "Determinantens absolutværdi er parallelogrammets areal. Det positive fortegn viser drejning mod uret fra første til anden vektor.",
      math: `<math display="block"><mrow><mi mathvariant="normal">det</mi><mo>(</mo><mover><mi>a</mi><mo>→</mo></mover><mo>,</mo><mover><mi>b</mi><mo>→</mo></mover><mo>)</mo><mo>=</mo><mn>8</mn><mo>&gt;</mo><mn>0</mn></mrow></math>`,
    },
  };

  function updateProjectionGeometryLab() {
    const activeStage = stages[stageIndex];
    groups.forEach((group) =>
      group.toggleAttribute("hidden", group.dataset.projectionStage !== activeStage),
    );
    buttons.forEach((button) => {
      const active = button.dataset.projectionTarget === activeStage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    status.innerHTML = `<strong>${content[activeStage].title}</strong><p>${content[activeStage].body}</p>`;
    math.innerHTML = content[activeStage].math;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stageIndex = stages.indexOf(button.dataset.projectionTarget);
      updateProjectionGeometryLab();
    });
  });

  projectionGeometryLab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stageIndex = Math.max(0, stageIndex - 1);
      updateProjectionGeometryLab();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stageIndex = Math.min(stages.length - 1, stageIndex + 1);
      updateProjectionGeometryLab();
    }
  });

  updateProjectionGeometryLab();
}

function setupGeometryToolLab({ rootSelector, stageAttribute, targetAttribute, statusSelector, mathSelector, stages, content }) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const groups = [...root.querySelectorAll(`[${stageAttribute}]`)];
  const buttons = [...root.querySelectorAll(`[${targetAttribute}]`)];
  const status = root.querySelector(statusSelector);
  const math = root.querySelector(mathSelector);
  let stageIndex = 0;

  function update() {
    const activeStage = stages[stageIndex];
    groups.forEach((group) =>
      group.toggleAttribute("hidden", group.getAttribute(stageAttribute) !== activeStage),
    );
    buttons.forEach((button) => {
      const active = button.getAttribute(targetAttribute) === activeStage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    status.innerHTML = `<strong>${content[activeStage].title}</strong><p>${content[activeStage].body}</p>`;
    math.innerHTML = content[activeStage].math;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      stageIndex = stages.indexOf(button.getAttribute(targetAttribute));
      update();
    });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stageIndex = Math.max(0, stageIndex - 1);
      update();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stageIndex = Math.min(stages.length - 1, stageIndex + 1);
      update();
    }
  });

  update();
}

setupGeometryToolLab({
  rootSelector: "#lineGeometryLab",
  stageAttribute: "data-line-stage",
  targetAttribute: "data-line-target",
  statusSelector: "#lineLabStatus",
  mathSelector: "#lineLabMath",
  stages: ["normal", "parameter", "distance"],
  content: {
    normal: {
      title: "Normal og retning",
      body: "Normalvektoren står vinkelret på linjens retningsvektor. Derfor er skalarproduktet nul.",
      math: `<math display="block"><mrow><mover><mi>n</mi><mo>→</mo></mover><mo>·</mo><mover><mi>r</mi><mo>→</mo></mover><mo>=</mo><mn>0</mn></mrow></math>`,
    },
    parameter: {
      title: "Punkt og retning",
      body: "Når parameteren ændres, flyttes punktet frem og tilbage langs retningsvektoren — og bliver på den samme linje.",
      math: `<math display="block"><mrow><mover><mi>p</mi><mo>→</mo></mover><mo>=</mo><msub><mover><mi>p</mi><mo>→</mo></mover><mn>0</mn></msub><mo>+</mo><mi>t</mi><mover><mi>r</mi><mo>→</mo></mover></mrow></math>`,
    },
    distance: {
      title: "Korteste afstand",
      body: "Den korteste vej fra punktet til linjen går vinkelret på linjen og følger derfor normalens retning.",
      math: `<math display="block"><mrow><mi mathvariant="normal">dist</mi><mo>(</mo><mi>P</mi><mo>,</mo><mi>l</mi><mo>)</mo><mo>⊥</mo><mi>l</mi></mrow></math>`,
    },
  },
});

setupGeometryToolLab({
  rootSelector: "#circleGeometryLab",
  stageAttribute: "data-circle-stage",
  targetAttribute: "data-circle-target",
  statusSelector: "#circleLabStatus",
  mathSelector: "#circleLabMath",
  stages: ["center", "point", "tangent"],
  content: {
    center: {
      title: "Centrum og radius",
      body: "Alle punkter på cirklen ligger præcis radius fra centrum.",
      math: `<math display="block"><mrow><msup><mrow><mo>(</mo><mi>x</mi><mo>−</mo><mi>a</mi><mo>)</mo></mrow><mn>2</mn></msup><mo>+</mo><msup><mrow><mo>(</mo><mi>y</mi><mo>−</mo><mi>b</mi><mo>)</mo></mrow><mn>2</mn></msup><mo>=</mo><msup><mi>r</mi><mn>2</mn></msup></mrow></math>`,
    },
    point: {
      title: "Punktkontrol",
      body: "Punktet ligger på cirklen, når afstanden til centrum er lig radius. Mindre afstand er inde; større er udenfor.",
      math: `<math display="block"><mrow><mo>|</mo><mover><mrow><mi>C</mi><mi>P</mi></mrow><mo>→</mo></mover><mo>|</mo><mo>=</mo><mi>r</mi></mrow></math>`,
    },
    tangent: {
      title: "Tangent",
      body: "Radiusvektoren til røringspunktet er tangentens normalvektor, fordi de står vinkelret på hinanden.",
      math: `<math display="block"><mrow><mover><mrow><mi>C</mi><mi>P</mi></mrow><mo>→</mo></mover><mo>·</mo><mover><mi>r</mi><mo>→</mo></mover><mo>=</mo><mn>0</mn></mrow></math>`,
    },
  },
});

document.querySelectorAll(".hint-button").forEach((button) => {
  button.addEventListener("click", () => {
    const hint = button.closest(".exercise-body").querySelector(".hint");
    const willShow = hint.hidden;
    hint.hidden = !willShow;
    button.setAttribute("aria-expanded", String(willShow));
    button.textContent = willShow ? "Skjul hint" : "Vis hint";
  });
});

function parseAnswer(value) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^x\s*=\s*/, "")
    .replace(/\s/g, "")
    .replace(",", ".");

  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(normalized)) {
    const [numerator, denominator] = normalized.split("/").map(Number);
    return denominator === 0 ? Number.NaN : numerator / denominator;
  }

  return normalized === "" ? Number.NaN : Number(normalized);
}

function updateExerciseProgress(group) {
  const cards = document.querySelectorAll(`.exercise-card[data-progress-group="${group}"]`);
  const solved = document.querySelectorAll(
    `.exercise-card[data-progress-group="${group}"][data-solved="true"]`,
  ).length;
  const progress = document.querySelector(`.exercise-progress[data-progress-group="${group}"]`);

  if (progress) {
    const score = progress.querySelector(".progress-score") || progress.querySelector("#exerciseScore");
    const total = progress.querySelector(".progress-total") || progress.querySelector("#exerciseTotal");
    const progressBar = progress.querySelector(".progress-bar") || progress.querySelector("#exerciseProgressBar");

    score.textContent = String(solved);
    total.textContent = String(cards.length);
    progressBar.style.width = `${cards.length ? (solved / cards.length) * 100 : 0}%`;
  }

  if (group === "composite-foundation") {
    const status = document.querySelector("#foundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Grundlaget er på plads.</strong><span>Du er klar til at sætte funktioner sammen.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken og prøv igen på resten.</span>`;
  }

  if (group === "differentiation-foundation") {
    const status = document.querySelector("#differentiationFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Fortsæt til idéen bag differentialkvotienten.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, eller gå tilbage til et grundemne.</span>`;
  }

  if (group === "product-foundation") {
    const status = document.querySelector("#productFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at samle de to bidrag i produktreglen.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, eller gå tilbage til Modul 1.</span>`;
  }

  if (group === "chain-foundation") {
    const status = document.querySelector("#chainFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Lagene er på plads.</strong><span>Du er klar til at følge kædereglen indefra og ud.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, eller gå tilbage til sammensatte funktioner.</span>`;
  }

  if (group === "turn-foundation") {
    const status = document.querySelector("#turnFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at samle punkt, hældning og krumning.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, eller gå tilbage til afledningsregler og ligninger.</span>`;
  }

  if (group === "recap-foundation") {
    const status = document.querySelector("#recapFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Værktøjerne er på plads.</strong><span>Du er klar til at samle monotoni, ekstrema og optimering.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, eller genbesøg det relevante modul.</span>`;
  }

  if (group === "vector-foundation") {
    const status = document.querySelector("#vectorFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at forbinde koordinater med vektorer.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, eller genbesøg det relevante grundkort.</span>`;
  }

  if (group === "scalar-foundation") {
    const status = document.querySelector("#scalarFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at forbinde skalarprodukt og vinkel.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, grundkortene eller Modul 1.</span>`;
  }

  if (group === "projection-foundation") {
    const status = document.querySelector("#projectionFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at forbinde retning, vinkelrethed og areal.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, grundkortene eller Modul 1–2.</span>`;
  }

  if (group === "line-foundation") {
    const status = document.querySelector("#lineFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at skifte mellem linjens to beskrivelser.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, ligningsforløbet eller Modul 1–3.</span>`;
  }

  if (group === "circle-foundation") {
    const status = document.querySelector("#circleFoundationStatus");
    const ready = solved === cards.length;
    status.classList.toggle("is-ready", ready);
    status.innerHTML = ready
      ? "<strong>Byggestenene er på plads.</strong><span>Du er klar til at forbinde afstand, ligning og tangent.</span>"
      : `<strong>${solved} af ${cards.length} på plads.</strong><span>Brug feedbacken, grundkortene eller Modul 4.</span>`;
  }
}

function setFeedback(card, type, fallback) {
  const feedback = card.querySelector(".answer-feedback");
  const template = card.querySelector(`template.feedback-${type}`);

  feedback.classList.remove("is-correct", "is-incorrect");
  feedback.innerHTML = template ? template.innerHTML : fallback;
  feedback.classList.add(type === "correct" ? "is-correct" : "is-incorrect");
}

function checkExercise(card) {
  const isChoice = card.dataset.kind === "choice";
  const isRoots = card.dataset.kind === "roots";
  const isOrderedPair = card.dataset.kind === "ordered-pair";
  const isOrderedValues = card.dataset.kind === "ordered-values";
  const tolerance = Number(card.dataset.tolerance || 0.000001);
  let isCorrect = false;

  if (isChoice) {
    const selected = card.querySelector(".answer-choice.is-selected");
    if (!selected) {
      setFeedback(card, "incorrect", "Vælg først en mulighed.");
      return;
    }
    isCorrect = selected.dataset.value === card.dataset.answer;
  } else if (isRoots || isOrderedPair || isOrderedValues) {
    const inputs = [...card.querySelectorAll("input")];
    const answers = inputs.map((input) => parseAnswer(input.value));
    const expected = card.dataset.answer.split(",").map(Number);

    if (answers.some((answer) => !Number.isFinite(answer))) {
      setFeedback(
        card,
        "incorrect",
        isOrderedPair
          ? "Skriv begge koordinater som tal."
          : isOrderedValues
            ? "Skriv begge værdier som tal."
            : "Skriv begge løsninger som tal.",
      );
      return;
    }

    if (isRoots) {
      answers.sort((a, b) => a - b);
      expected.sort((a, b) => a - b);
    }
    isCorrect =
      answers.length === expected.length &&
      answers.every((answer, index) => Math.abs(answer - expected[index]) <= tolerance);
  } else {
    const input = card.querySelector("input");
    const answer = parseAnswer(input.value);
    const expected = Number(card.dataset.answer);

    if (!Number.isFinite(answer)) {
      setFeedback(card, "incorrect", "Skriv et tal, fx 3 eller −2.");
      return;
    }
    isCorrect = Math.abs(answer - expected) <= tolerance;
  }

  window.dispatchEvent(new CustomEvent("exercise-checked", { detail: { card, correct: isCorrect } }));
  if (isCorrect) {
    card.dataset.solved = "true";
    card.classList.add("is-correct");
    setFeedback(card, "correct", "Korrekt!");
    updateExerciseProgress(card.dataset.progressGroup);
    return;
  }

  setFeedback(
    card,
    "incorrect",
    "Ikke helt endnu. Kontrollér dit seneste regnetrin, eller åbn hintet.",
  );
}

exerciseCards.forEach((card) => {
  const button = card.querySelector(".check-answer");
  const inputs = card.querySelectorAll("input");
  button.addEventListener("click", () => checkExercise(card));
  inputs.forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkExercise(card);
    });
  });
});

document.querySelectorAll(".answer-choice").forEach((choice) => {
  choice.addEventListener("click", () => {
    const card = choice.closest(".exercise-card");
    card.querySelectorAll(".answer-choice").forEach((option) => {
      const selected = option === choice;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
  });
});

menuButton.addEventListener("click", () => {
  const willOpen = !sidebar.classList.contains("is-open");
  sidebar.classList.toggle("is-open", willOpen);
  backdrop.classList.toggle("is-visible", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
});

backdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("hashchange", () => {
  const requestedView = window.location.hash.slice(1) || "home";
  const validView = requestedView === "formulas" || requestedView === "tasks" || (subjects[requestedView] || requestedView.startsWith("integration/") || requestedView.startsWith("differentialEquations/")) ? requestedView : "home";
  showView(validView, validView === "integration" || validView.startsWith("integration/") || validView === "differentialEquations" || validView.startsWith("differentialEquations/"));
});

const initialView = window.location.hash.slice(1) || "home";
showView(initialView === "formulas" || initialView === "tasks" || (subjects[initialView] || initialView.startsWith("integration/") || initialView.startsWith("differentialEquations/")) ? initialView : "home", false);

// Shared navigation hook for targeted repetition from the task bank.
window.showMathView = showView;
