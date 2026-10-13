import { bank, instantiate, seededRandom } from "./bank/index.js";
export function composeSet(options = {}, history = []) {
  const {
    seed = "christian",
    topics = [],
    completed = [],
    onlyCompleted = false,
    difficulty = 0,
    aids = "all",
    minutes = 60,
    distribution = { short: 6, medium: 4, complex: 2 },
  } = options;
  const random = seededRandom(`${seed}:selection`);
  const candidates = bank
    .map((t) => instantiate(t.id, seed))
    .filter(
      (t) =>
        (!topics.length || topics.includes(t.topic)) &&
        (!difficulty || t.difficulty === Number(difficulty)) &&
        (aids === "all" || t.aids === (aids === "yes")) &&
        (!onlyCompleted ||
          [t.module, ...t.prerequisites].every((m) => completed.includes(m))),
    );
  const chosen = [],
    topicCounts = {},
    goalCounts = {},
    difficultyCounts = {},
    sizeCounts = { short: 0, medium: 0, complex: 0 };
  let time = 0;
  const recent = history.flatMap((s) => s.items || []).slice(-100);
  const jitter = new Map(candidates.map((t) => [t.id, random()]));
  while (candidates.length) {
    const eligible = candidates.filter(
      (t) =>
        sizeCounts[t.size] < (distribution[t.size] || 0) &&
        time + t.minutes <= minutes,
    );
    if (!eligible.length) break;
    const score = (t) => {
      const seen = recent.filter((i) => i.id === t.id);
      const last = seen.at(-1);
      const weak =
        last &&
        !last.pending &&
        last.max > 0 &&
        last.points !== null &&
        last.points / last.max < 1;
      return (
        (topicCounts[t.topic] || 0) * 5 +
        (difficultyCounts[t.difficulty] || 0) * 1.5 +
        t.goals.reduce((s, g) => s + (goalCounts[g] || 0) * 2, 0) +
        (sizeCounts[t.size] / Math.max(1, distribution[t.size])) * 2 +
        seen.length * 0.7 -
        (weak ? 0.8 : 0) +
        jitter.get(t.id)
      );
    };
    eligible.sort((a, b) => score(a) - score(b) || a.id.localeCompare(b.id));
    const t = eligible[0];
    chosen.push(t);
    time += t.minutes;
    difficultyCounts[t.difficulty] = (difficultyCounts[t.difficulty] || 0) + 1;
    topicCounts[t.topic] = (topicCounts[t.topic] || 0) + 1;
    t.goals.forEach((g) => (goalCounts[g] = (goalCounts[g] || 0) + 1));
    sizeCounts[t.size]++;
    candidates.splice(candidates.indexOf(t), 1);
  }
  // Seeded shuffle of a balanced selection; no predictable topic sequence.
  for (let i = chosen.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
  }
  return {
    tasks: chosen,
    minutes: time,
    requested: Object.values(distribution).reduce((a, b) => a + b, 0),
    distribution: sizeCounts,
  };
}
