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
  quadraticLesson.hidden = view !== "quadratic";
  compositeLesson.hidden = view !== "composite";
  differentiationLesson.hidden = view !== "differentiation";
  subjectPlaceholder.hidden =
    view === "equations" ||
    view === "quadratic" ||
    view === "composite" ||
    view === "differentiation";

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
  let isCorrect = false;

  if (isChoice) {
    const selected = card.querySelector(".answer-choice.is-selected");
    if (!selected) {
      setFeedback(card, "incorrect", "Vælg først en mulighed.");
      return;
    }
    isCorrect = selected.dataset.value === card.dataset.answer;
  } else if (isRoots) {
    const inputs = [...card.querySelectorAll("input")];
    const answers = inputs.map((input) => parseAnswer(input.value));
    const expected = card.dataset.answer.split(",").map(Number).sort((a, b) => a - b);

    if (answers.some((answer) => !Number.isFinite(answer))) {
      setFeedback(card, "incorrect", "Skriv begge løsninger som tal.");
      return;
    }

    answers.sort((a, b) => a - b);
    isCorrect =
      answers.length === expected.length &&
      answers.every((answer, index) => Math.abs(answer - expected[index]) < 0.000001);
  } else {
    const input = card.querySelector("input");
    const answer = parseAnswer(input.value);
    const expected = Number(card.dataset.answer);

    if (!Number.isFinite(answer)) {
      setFeedback(card, "incorrect", "Skriv et tal, fx 3 eller −2.");
      return;
    }
    isCorrect = Math.abs(answer - expected) < 0.000001;
  }

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
  const validView = requestedView === "formulas" || subjects[requestedView] ? requestedView : "home";
  showView(validView, false);
});

const initialView = window.location.hash.slice(1) || "home";
showView(initialView === "formulas" || subjects[initialView] ? initialView : "home", false);
