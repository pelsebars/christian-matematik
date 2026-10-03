const subjects = {
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
    title: "Andengradsligninger",
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
  subjectPlaceholder.hidden = view === "equations";

  setActiveNavigation(view);
  window.location.hash = view === "home" ? "" : view;
  closeMenu();

  if (shouldFocus) {
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

  return Number(normalized);
}

function updateExerciseProgress() {
  const solved = document.querySelectorAll('.exercise-card[data-solved="true"]').length;
  const score = document.querySelector("#exerciseScore");
  const total = document.querySelector("#exerciseTotal");
  const progressBar = document.querySelector("#exerciseProgressBar");

  score.textContent = String(solved);
  total.textContent = String(exerciseCards.length);
  progressBar.style.width = `${(solved / exerciseCards.length) * 100}%`;
}

function checkExercise(card) {
  const input = card.querySelector("input");
  const feedback = card.querySelector(".answer-feedback");
  const answer = parseAnswer(input.value);
  const expected = Number(card.dataset.answer);

  feedback.classList.remove("is-correct", "is-incorrect");

  if (!Number.isFinite(answer)) {
    feedback.textContent = "Skriv et tal, fx 3 eller −2.";
    feedback.classList.add("is-incorrect");
    return;
  }

  if (Math.abs(answer - expected) < 0.000001) {
    card.dataset.solved = "true";
    card.classList.add("is-correct");
    feedback.textContent = "Korrekt! Sæt gerne svaret ind i ligningen som kontrol.";
    feedback.classList.add("is-correct");
    updateExerciseProgress();
    return;
  }

  feedback.textContent = "Ikke helt endnu. Kontrollér dit seneste regnetrin, eller åbn hintet.";
  feedback.classList.add("is-incorrect");
}

exerciseCards.forEach((card) => {
  const button = card.querySelector(".check-answer");
  const input = card.querySelector("input");
  button.addEventListener("click", () => checkExercise(card));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkExercise(card);
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
  const validView = requestedView === "formulas" || subjects[requestedView] ? requestedView : "home";
  showView(validView, false);
});

const initialView = window.location.hash.slice(1) || "home";
showView(initialView === "formulas" || subjects[initialView] ? initialView : "home", false);
