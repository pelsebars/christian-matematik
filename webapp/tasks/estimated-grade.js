// Our own indicative scale for practice sets, not official exam thresholds.
export const gradeScale = [
  { minimum: 95, grade: "12" },
  { minimum: 85, grade: "10" },
  { minimum: 65, grade: "7" },
  { minimum: 50, grade: "4" },
  { minimum: 35, grade: "02" },
  { minimum: 10, grade: "00" },
  { minimum: 0, grade: "−3" },
];

export function estimateGrade({ points, max, pending = 0 }) {
  if (!Number.isFinite(points) || !Number.isFinite(max) || max <= 0 ||
      points < 0 || points > max || !Number.isFinite(pending) || pending !== 0)
    return null;
  const percent = points / max * 100;
  return { percent, grade: gradeScale.find(({ minimum }) => points >= max * minimum / 100).grade };
}

const scaleHTML = () => `<details><summary>Se den vejledende karakterskala</summary><p>Appens egen skala, ikke officielle eksamensgrænser. Karakteren beregnes af pointandelen før afrunding. Procenten vises med højst to decimaler, rundet ned.</p><ul>${gradeScale.map(({ minimum, grade }, i) => `<li>${i === gradeScale.length - 1 ? "Under 10 %" : `Fra ${minimum} %`}: ${grade}</li>`).join("")}</ul></details>`;

export function estimatedGradeHTML(result) {
  const estimate = estimateGrade(result);
  if (!estimate)
    return `<section class="task-grade" aria-label="Estimeret karakter"><h3>Estimeret karakter</h3><p>Karakter og procent vises, når alle delspørgsmål er vurderet. Gennemgå svarene nedenfor og angiv de manglende point ved egen vurdering.</p>${scaleHTML()}</section>`;
  // Truncate only for display: rounding must never suggest the next grade band.
  const percent = (Math.floor(estimate.percent * 100) / 100).toLocaleString("da-DK", { maximumFractionDigits: 2 });
  return `<section class="task-grade" aria-label="Estimeret karakter"><p>${percent} % af sættets mulige point · ${result.max.toLocaleString("da-DK")} point = 100 %</p><h3>Estimeret karakter: <strong>${estimate.grade}</strong></h3><p>Vejledende karakter for dette sæt. Sværhedsgrad, emnevalg og brug af hjælp kan påvirke, hvor godt estimatet afspejler dit niveau.${result.self ? " Karakteren omfatter din egen vurdering af nogle svar." : ""}</p>${scaleHTML()}</section>`;
}
