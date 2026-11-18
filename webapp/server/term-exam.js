import { termParts, termGrade } from '../term-exam-model.js';
// One permanent award per part in this fixed exam. Revisions change the award,
// never add another award. Existing purchases and other awards are untouched.
export async function awardTermExam(client,userId,state) {
 if(state.status!=='finished')return;
 for(const part of termParts) {
  const points=termGrade(part,state).points||0;
  await client.query(`INSERT INTO learning_completion(user_id,exercise_id,topic,module,label,route,points_awarded)
    VALUES($1,$2,'termExam','August 2026',$3,'termExam',$4)
    ON CONFLICT(user_id,exercise_id) DO UPDATE SET points_awarded=EXCLUDED.points_awarded`,
    [userId,`term:august2026:${part.id}`,`Termins opgave ${part.id}`,points]);
 }
}
