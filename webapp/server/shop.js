import { shopCatalog, skinIds } from '../shop-catalog.js';

export async function pointBalance(db, userId) {
  const { rows } = await db.query(`SELECT
    ((SELECT COALESCE(SUM(points_awarded),0) FROM learning_completion WHERE user_id=$1) +
     (SELECT COALESCE(SUM(GREATEST(0,points-legacy_points)),0) FROM bank_set_reward WHERE user_id=$1))::double precision AS earned,
    (SELECT COALESCE(SUM(price),0)::integer FROM shop_purchase WHERE user_id=$1) AS spent`, [userId]);
  return { earnedPoints: rows[0].earned, spentPoints: rows[0].spent, rewardPoints: rows[0].earned - rows[0].spent };
}
export async function shopState(db, userId) {
  const balance = await pointBalance(db, userId);
  const { rows: purchases } = await db.query('SELECT request_id AS id,item_id,kind,name,price,purchased_at,redeemed_at FROM shop_purchase WHERE user_id=$1 ORDER BY purchased_at DESC,request_id', [userId]);
  const { rows } = await db.query('SELECT active_skin FROM shop_profile WHERE user_id=$1', [userId]);
  return { ...balance, activeSkin: rows[0]?.active_skin || 'default', purchases, catalog: shopCatalog };
}
const reply = (value, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export async function handleShop(request, pool, userId) {
  if (request.method === 'GET') return reply(await shopState(pool, userId));
  if (!['POST','PUT'].includes(request.method)) return reply({message:'Metoden understøttes ikke.'},405);
  const raw = await request.text();
  if (raw.length > 2000) return reply({message:'Forespørgslen er for stor.'},413);
  const body = JSON.parse(raw);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({message:'Ugyldigt køb.'},400);
  const item = shopCatalog.find(item => item.id === body.itemId);
  if (request.method === 'POST' && (!item || !uuid(body.requestId))) return reply({message:'Vælg en gyldig vare.'},400);
  if (request.method === 'PUT' && !['activate','redeem'].includes(body.action)) return reply({message:'Ugyldig handling.'},400);
  if (body.action === 'activate' && !skinIds.includes(body.skinId)) return reply({message:'Ukendt skin.'},400);
  if (body.action === 'redeem' && !uuid(body.purchaseId)) return reply({message:'Ugyldig voucher.'},400);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialize spending per account, even when two devices buy at once.
    await client.query('SELECT id FROM "user" WHERE id=$1 FOR UPDATE', [userId]);
    if (request.method === 'POST') {
      const prior = await client.query('SELECT item_id FROM shop_purchase WHERE user_id=$1 AND request_id=$2', [userId,body.requestId]);
      if (prior.rowCount) {
        if (prior.rows[0].item_id !== item.id) { await client.query('ROLLBACK'); return reply({message:'Købsnummeret er allerede brugt.'},409); }
      } else {
        const owned = item.kind === 'skin' && (await client.query('SELECT 1 FROM shop_purchase WHERE user_id=$1 AND item_id=$2 AND kind=$3', [userId,item.id,'skin'])).rowCount;
        if (owned) { await client.query('ROLLBACK'); return reply({message:'Du ejer allerede dette skin.'},409); }
        const {rewardPoints} = await pointBalance(client,userId);
        if (rewardPoints < item.price) { await client.query('ROLLBACK'); return reply({message:'Du har ikke nok point endnu.'},409); }
        await client.query('INSERT INTO shop_purchase(user_id,request_id,item_id,kind,name,price) VALUES($1,$2,$3,$4,$5,$6)', [userId,body.requestId,item.id,item.kind,item.name,item.price]);
      }
    } else if (body.action === 'activate') {
      const owned = body.skinId === 'default' || (await client.query('SELECT 1 FROM shop_purchase WHERE user_id=$1 AND item_id=$2 AND kind=$3', [userId,body.skinId,'skin'])).rowCount;
      if (!owned) { await client.query('ROLLBACK'); return reply({message:'Køb dette skin, før du aktiverer det.'},403); }
      await client.query('INSERT INTO shop_profile(user_id,active_skin) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET active_skin=EXCLUDED.active_skin', [userId,body.skinId]);
    } else {
      const redeemed = await client.query("UPDATE shop_purchase SET redeemed_at=COALESCE(redeemed_at,now()) WHERE user_id=$1 AND request_id=$2 AND kind='reward' RETURNING request_id", [userId,body.purchaseId]);
      if (!redeemed.rowCount) { await client.query('ROLLBACK'); return reply({message:'Voucheren blev ikke fundet.'},404); }
    }
    const state = await shopState(client,userId);
    await client.query('COMMIT');
    return reply(state);
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
