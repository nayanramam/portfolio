const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'];
const TIER_UP = { F: 'D', D: 'C', C: 'B', B: 'A', A: null };
const TIER_DOWN = { S: 'A', A: 'B', B: 'C', C: 'D', D: 'F', F: null };

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function getAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || 'https://nayanramam.com,http://localhost:8788,http://127.0.0.1:8788';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = getAllowedOrigins(env);
  if (origin && allowed.includes(origin)) {
    return { ...CORS_HEADERS, 'Access-Control-Allow-Origin': origin };
  }
  if (allowed.length > 0) {
    return { ...CORS_HEADERS, 'Access-Control-Allow-Origin': allowed[0] };
  }
  return CORS_HEADERS;
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request, env))) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

function parseAllowedUsers(env) {
  const raw = env.ALLOWED_USERS || '';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function publicPerson(person) {
  return {
    id: person.id,
    name: person.name,
    photo_url: person.photo_url,
    tier: person.tier,
  };
}

async function getSession(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const raw = await env.SESSIONS.get(match[1]);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    if (!session?.username) return null;
    return session;
  } catch {
    return null;
  }
}

async function getMyVotes(env, username) {
  const { results } = await env.DB.prepare(
    'SELECT person_id, direction FROM votes WHERE username = ?'
  ).bind(username.toLowerCase()).all();

  const myVotes = {};
  for (const row of results) {
    myVotes[row.person_id] = row.direction;
  }
  return myVotes;
}

async function handleState(env, session) {
  const { results: people } = await env.DB.prepare(
    'SELECT id, name, photo_url, tier FROM people ORDER BY name ASC'
  ).all();

  const tiers = Object.fromEntries(TIERS.map((t) => [t, []]));
  for (const person of people) {
    if (tiers[person.tier]) tiers[person.tier].push(publicPerson(person));
  }

  const { results: activity } = await env.DB.prepare(
    `SELECT person_name, direction, from_tier, to_tier, triggered_by, created_at
     FROM activity
     ORDER BY id DESC
     LIMIT 10`
  ).all();

  const payload = { tiers, activity };
  if (session) {
    payload.my_votes = await getMyVotes(env, session.username);
  }

  return json(payload);
}

async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const username = String(body.username || '').trim();
  if (!username) return json({ error: 'Username is required' }, 400);

  const allowed = parseAllowedUsers(env);
  if (!allowed.includes(username.toLowerCase())) {
    return json({ error: 'Username not allowed' }, 403);
  }

  const token = crypto.randomUUID();
  await env.SESSIONS.put(
    token,
    JSON.stringify({ username }),
    { expirationTtl: 86400 }
  );

  return json({ token, username });
}

function applyTierChanges(tier, pendingUp, pendingDown) {
  let currentTier = tier;
  const fromTier = tier;
  let tierChanged = false;
  let toTier = tier;
  let changeDirection = null;

  if (pendingUp >= 5) {
    const next = TIER_UP[currentTier];
    if (next) {
      currentTier = next;
      toTier = next;
      pendingUp = 0;
      tierChanged = true;
      changeDirection = 'up';
    }
  } else if (pendingDown >= 5) {
    const next = TIER_DOWN[currentTier];
    if (next) {
      currentTier = next;
      toTier = next;
      pendingDown = 0;
      tierChanged = true;
      changeDirection = 'down';
    }
  }

  return {
    tier: currentTier,
    pendingUp,
    pendingDown,
    tierChanged,
    fromTier,
    toTier,
    changeDirection,
  };
}

async function handleVote(request, env, session) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const personId = String(body.person_id || '').trim();
  const direction = body.direction;
  const username = session.username.toLowerCase();

  if (!personId) return json({ error: 'person_id is required' }, 400);
  if (direction !== 'up' && direction !== 'down') {
    return json({ error: 'direction must be "up" or "down"' }, 400);
  }

  const person = await env.DB.prepare(
    'SELECT id, name, photo_url, tier, pending_up, pending_down FROM people WHERE id = ?'
  ).bind(personId).first();

  if (!person) return json({ error: 'Person not found' }, 404);

  const existing = await env.DB.prepare(
    'SELECT direction FROM votes WHERE person_id = ? AND username = ?'
  ).bind(personId, username).first();

  let pendingUp = person.pending_up;
  let pendingDown = person.pending_down;
  let yourVote = null;
  let action = 'added';
  const statements = [];

  if (existing?.direction === direction) {
    statements.push(
      env.DB.prepare('DELETE FROM votes WHERE person_id = ? AND username = ?')
        .bind(personId, username)
    );
    if (direction === 'up') pendingUp = Math.max(0, pendingUp - 1);
    else pendingDown = Math.max(0, pendingDown - 1);
    yourVote = null;
    action = 'removed';
  } else if (existing) {
    return json({ error: 'Remove your current vote first' }, 400);
  } else {
    statements.push(
      env.DB.prepare(
        'INSERT INTO votes (person_id, username, direction) VALUES (?, ?, ?)'
      ).bind(personId, username, direction)
    );
    if (direction === 'up') pendingUp += 1;
    else pendingDown += 1;
    yourVote = direction;
    action = 'added';
  }

  const tierResult = applyTierChanges(person.tier, pendingUp, pendingDown);

  if (tierResult.tierChanged) {
    tierResult.pendingUp = 0;
    tierResult.pendingDown = 0;
    statements.push(
      env.DB.prepare('DELETE FROM votes WHERE person_id = ?').bind(personId)
    );
    statements.push(
      env.DB.prepare(
        `INSERT INTO activity (person_id, person_name, direction, from_tier, to_tier, triggered_by)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        personId,
        person.name,
        tierResult.changeDirection,
        tierResult.fromTier,
        tierResult.toTier,
        session.username
      )
    );
  }

  statements.push(
    env.DB.prepare(
      'UPDATE people SET tier = ?, pending_up = ?, pending_down = ? WHERE id = ?'
    ).bind(
      tierResult.tier,
      tierResult.pendingUp,
      tierResult.pendingDown,
      personId
    )
  );

  await env.DB.batch(statements);

  return json({
    person: publicPerson({
      id: person.id,
      name: person.name,
      photo_url: person.photo_url,
      tier: tierResult.tier,
    }),
    your_vote: tierResult.tierChanged ? null : yourVote,
    action,
    tier_changed: tierResult.tierChanged,
    from_tier: tierResult.tierChanged ? tierResult.fromTier : null,
    to_tier: tierResult.tierChanged ? tierResult.toTier : null,
  });
}

export async function handleApiRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }

  let response;

  try {
    if (path === '/api/sbc/state' && request.method === 'GET') {
      const session = await getSession(request, env);
      response = await handleState(env, session);
    } else if (path === '/api/sbc/login' && request.method === 'POST') {
      response = await handleLogin(request, env);
    } else if (path === '/api/sbc/vote' && request.method === 'POST') {
      const session = await getSession(request, env);
      if (!session) {
        response = json({ error: 'Unauthorized' }, 401);
      } else {
        response = await handleVote(request, env, session);
      }
    } else {
      response = json({ error: 'Not found' }, 404);
    }
  } catch (err) {
    console.error(err);
    response = json({ error: 'Internal server error' }, 500);
  }

  return withCors(response, request, env);
}
