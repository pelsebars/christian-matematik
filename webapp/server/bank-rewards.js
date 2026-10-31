import { bankSessionReward } from '../tasks/rewards.js';
import { instantiate } from '../tasks/bank/index.js';

export async function awardBankSet(client, userId, reward) {
  if (!reward) return;
  const saved = await client.query(`INSERT INTO bank_set_reward(user_id,set_id,mode,definition,points)
    VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,set_id) DO UPDATE
    SET points=GREATEST(bank_set_reward.points,EXCLUDED.points),
        definition=COALESCE(bank_set_reward.definition,EXCLUDED.definition),updated_at=now()
    WHERE bank_set_reward.definition IS NULL OR bank_set_reward.definition=EXCLUDED.definition
    RETURNING set_id`, [userId,reward.id,reward.mode,reward.definition,reward.points]);
  if (!saved.rowCount) return; // A set ID cannot be reused with another seed/tasks.
  await client.query(`INSERT INTO bank_reward_legacy(user_id,exercise_id,set_id,points)
    SELECT user_id,exercise_id,$2,points_awarded FROM learning_completion
    WHERE user_id=$1 AND exercise_id=ANY($3::text[]) AND points_awarded>0
      AND first_correct_at>=to_timestamp($4::double precision/1000)
      AND first_correct_at<=to_timestamp($5::double precision/1000)+interval '30 seconds'
    ON CONFLICT DO NOTHING`,[userId,reward.id,reward.completionIds,reward.startedAt,reward.endedAt]);
  await client.query(`UPDATE bank_set_reward SET legacy_points=(
    SELECT COALESCE(SUM(points),0) FROM bank_reward_legacy WHERE user_id=$1 AND set_id=$2)
    WHERE user_id=$1 AND set_id=$2`, [userId,reward.id]);
}

// Only used by the explicit upgrade script, never from incoming API history.
// Old history retains automatic scores but no answers/seed. Bound its award by
// real task maxima and exclude the full self-assessed portion conservatively.
function historicReward(entry) {
  if (!entry || !Number.isSafeInteger(entry.id) || entry.id<=0 || !Number.isSafeInteger(entry.date) || !['training','exam'].includes(entry.mode) || !Array.isArray(entry.items) || entry.items.length>100) return null;
  let points=0; const ids=new Set(),completionIds=[];
  for(const item of entry.items){
    if(ids.has(item.id))return null;ids.add(item.id);
    if(!Number.isFinite(item.points)||item.points<0||!Number.isFinite(item.self??0)||(item.self||0)<0)return null;
    let task;try{task=instantiate(item.id,'reward-upgrade');}catch{return null;}
    const max=task.parts.reduce((sum,p)=>sum+(p.type==='text'?0:p.points),0);
    points+=Math.min(max,Math.max(0,item.points-(item.self||0)));
    completionIds.push(`bank:${task.id}:v${task.version}`);
  }
  return {id:typeof entry.rewardId==='string'&&/^[a-z0-9-]{1,80}$/i.test(entry.rewardId)?entry.rewardId:String(entry.id),mode:entry.mode,definition:null,points:Math.round(points*1e6)/1e6,startedAt:entry.id,endedAt:entry.date,completionIds};
}
export async function backfillBankState(client,userId,value) {
  const current=bankSessionReward(value?.session);
  const history=Array.isArray(value?.history)?value.history.slice(-30).sort((a,b)=>a.id-b.id):[];
  for(const entry of history){
    const past=historicReward(entry);
    if(past&&past.id!==current?.id&&String(entry.id)!==String(value?.session?.startedAt))await awardBankSet(client,userId,past);
  }
  await awardBankSet(client,userId,current);
}
