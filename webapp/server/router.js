const json = (value, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const allowedAuth = new Set(['/get-session', '/sign-up/email', '/sign-in/username', '/sign-out', '/change-password']);
const namespacePattern = /^christian-matematik\.[a-zA-Z0-9._-]{1,100}$/;
const string = (value, max) => typeof value === 'string' && value.length > 0 && value.length <= max;

export function createRouter({ auth, pool, origin }) {
  return async function handle(request) {
    const url = new URL(request.url);
    if (!['GET', 'POST', 'PUT'].includes(request.method)) return json({ message: 'Metoden understøttes ikke.' }, 405);
    if (request.method !== 'GET' && request.headers.get('origin') !== origin) return json({ message: 'Ugyldig afsender.' }, 403);
    try {
      if (url.pathname.startsWith('/api/auth/')) {
        const path = url.pathname.slice('/api/auth'.length);
        if (!allowedAuth.has(path)) return json({ message: 'Ikke fundet.' }, 404);
        if (path === '/sign-up/email') {
          const body = await request.json();
          if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ message: 'Ugyldig forespørgsel.' }, 400);
          const name = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
          if (!/^[a-z0-9_]{3,30}$/.test(name)) return json({ message: 'Brugernavn skal være 3–30 tegn: a–z, tal eller understregning.' }, 400);
          // Better Auth requires an email identifier. This reserved .invalid address
          // is generated on the server and is never used to send mail.
          request = new Request(request.url, { method: 'POST', headers: request.headers,
            body: JSON.stringify({ username: name, name, email: `${name}@users.invalid`, password: body.password }) });
        }
        const response = await auth.handler(request);
        response.headers.set('Cache-Control', 'no-store');
        return response;
      }
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) return json({ message: 'Log ind for at åbne dine fremskridt.' }, 401);
      const userId = session.user.id; // Never accept a user ID from the client.
      if (url.pathname === '/api/learning' && request.method === 'GET') {
        const [states, completions] = await Promise.all([
          pool.query('SELECT namespace, value, revision FROM learning_state WHERE user_id=$1', [userId]),
          pool.query('SELECT exercise_id AS id, topic, module, label, route, first_correct_at FROM learning_completion WHERE user_id=$1 ORDER BY first_correct_at DESC', [userId]),
        ]);
        return json({ user: { id: userId, username: session.user.username }, states: states.rows, completions: completions.rows });
      }
      if (url.pathname !== '/api/learning' || request.method !== 'PUT') return json({ message: 'Ikke fundet.' }, 404);
      const raw = await request.text();
      if (raw.length > 500000) return json({ message: 'Besvarelsen er for stor.' }, 413);
      const body = JSON.parse(raw);
      if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ message: 'Ugyldige fremskridtsdata.' }, 400);
      if (!namespacePattern.test(body.namespace) || !Number.isSafeInteger(body.revision) || body.revision < 0 || !body.value || typeof body.value !== 'object' || Array.isArray(body.value)) return json({ message: 'Ugyldige fremskridtsdata.' }, 400);
      const completions = body.completions ?? [];
      if (!Array.isArray(completions) || completions.length > 500 || completions.some(c => !c || typeof c !== 'object' || !string(c.id, 200) || !string(c.topic, 80) || !string(c.module, 120) || !string(c.label, 200) || !string(c.route, 180) || !/^[a-zA-Z0-9/_-]+$/.test(c.route))) return json({ message: 'Ugyldige opgavedata.' }, 400);
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const saved = body.revision === 0
          ? await client.query('INSERT INTO learning_state(user_id,namespace,value) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING revision', [userId, body.namespace, body.value])
          : await client.query('UPDATE learning_state SET value=$3,revision=revision+1,updated_at=now() WHERE user_id=$1 AND namespace=$2 AND revision=$4 RETURNING revision', [userId, body.namespace, body.value, body.revision]);
        if (!saved.rowCount) { await client.query('ROLLBACK'); return json({ message: 'Dette modul er ændret i en anden fane eller på en anden enhed. Genindlæs for at hente den gemte version.' }, 409); }
        for (const c of completions) await client.query('INSERT INTO learning_completion(user_id,exercise_id,topic,module,label,route) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING', [userId,c.id,c.topic,c.module,c.label,c.route]);
        await client.query('COMMIT');
        return json({ revision: saved.rows[0].revision });
      } catch (error) { await client.query('ROLLBACK'); throw error; }
      finally { client.release(); }
    } catch (error) {
      if (error instanceof SyntaxError) return json({ message: 'Ugyldig forespørgsel.' }, 400);
      console.error('Learning API failed:', error.code || error.name);
      return json({ message: 'Forbindelsen til databasen fejlede. Prøv igen om lidt.' }, 503);
    }
  };
}
