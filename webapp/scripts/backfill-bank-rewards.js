import { createServices } from '../server/auth.js';
import { backfillBankState } from '../server/bank-rewards.js';
import { pointBalance } from '../server/shop.js';
import { BANK_NAMESPACE } from '../tasks/rewards.js';

export async function backfillBankRewards(pool) {
  const {rows}=await pool.query('SELECT user_id,value FROM learning_state WHERE namespace=$1',[BANK_NAMESPACE]);
  let added=0;
  for(const row of rows){
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      await client.query('SELECT id FROM "user" WHERE id=$1 FOR UPDATE',[row.user_id]);
      const before=await pointBalance(client,row.user_id);
      await backfillBankState(client,row.user_id,row.value);
      const after=await pointBalance(client,row.user_id);added+=after.rewardPoints-before.rewardPoints;
      await client.query('COMMIT');
    }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
  }
  return {accountsChecked:rows.length,pointsAdded:Math.round(added*1e6)/1e6};
}
if(process.argv[1]?.endsWith('/backfill-bank-rewards.js')){
 const services=createServices();
 try{console.log('Bank point upgrade:',await backfillBankRewards(services.pool));}finally{await services.pool.end();}
}
