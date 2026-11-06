import { bank } from '../tasks/bank/index.js';
const taskTopics = new Map(bank.map(task => [task.id, task.topic]));

// Definitions retain task identities but not individual awarded scores. Only
// attribute a set when every task belongs to the same known topic.
export function setTopic(definition) {
  try {
    const items = JSON.parse(definition)?.items;
    if (!Array.isArray(items) || !items.length) return 'unallocated';
    const topics = new Set(items.map(item => taskTopics.get(item.id)));
    return topics.size === 1 && !topics.has(undefined) ? [...topics][0] : 'unallocated';
  } catch { return 'unallocated'; }
}
export async function pointOverview(db, userId) {
  const { rows } = await db.query(`SELECT topic, COUNT(*)::integer AS solved,
    SUM(points_awarded)::double precision AS points FROM learning_completion
    WHERE user_id=$1 GROUP BY topic`, [userId]);
  const totals = new Map(rows.map(row => [row.topic, { ...row }]));
  const { rows: sets } = await db.query(`SELECT definition,
    GREATEST(0,points-legacy_points)::double precision AS points
    FROM bank_set_reward WHERE user_id=$1`, [userId]);
  for (const set of sets) {
    if (!set.points) continue;
    const topic = setTopic(set.definition);
    const row = totals.get(topic) || { topic, solved: 0, points: 0 };
    row.points += set.points;
    totals.set(topic, row);
  }
  return [...totals.values()];
}
