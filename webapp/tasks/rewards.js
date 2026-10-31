import { loadState } from './storage.js';
import { instantiate } from './bank/index.js';
import { gradeTask } from './grading.js';

export const BANK_NAMESPACE = 'christian-matematik.tasks.v1';
export { formatRewardPoints } from '../reward-points.js';

// Reuse the same task versions, seeds, validation and grader as the UI. Never
// accept a client-supplied total or self-assessment as spendable points.
export function bankSessionReward(session) {
  if (!session || !Number.isSafeInteger(session.startedAt) || session.startedAt <= 0 || typeof session.seed !== 'string' || session.seed.length > 1000) return null;
  const { state, warning } = loadState({ getItem: () => JSON.stringify({ schema: 1, completed: [], history: [], session }) });
  if (warning || !state.session) return null;
  const s = state.session;
  if (s.rewardId !== undefined && (typeof s.rewardId !== 'string' || !/^[a-z0-9-]{1,80}$/i.test(s.rewardId))) return null;
  const items = s.items.map(ref => ({ id: ref.id, version: ref.version }));
  const points = items.reduce((total, ref) => {
    if (s.status !== 'submitted' && !(s.mode === 'training' && s.checked[ref.id] === true)) return total;
    const task = instantiate(ref.id, s.seed, ref.version);
    const answers = s.answers[task.id];
    return total + gradeTask(task, answers && typeof answers === 'object' && !Array.isArray(answers) ? answers : {}, {}).reduce((sum, part) => sum + (part.points ?? 0), 0);
  }, 0);
  return {
    id: s.rewardId || String(s.startedAt), mode: s.mode,
    definition: JSON.stringify({ mode: s.mode, seed: s.seed, items }),
    points: Math.round(points * 1e6) / 1e6,
    startedAt: s.startedAt,
    endedAt: Number.isSafeInteger(s.endedAt) ? s.endedAt : Date.now(),
    completionIds: items.map(ref => `bank:${ref.id}:v${ref.version}`),
  };
}
