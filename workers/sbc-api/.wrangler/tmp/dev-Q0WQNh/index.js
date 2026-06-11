var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-uV5SoM/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/index.js
var TIERS = ["S", "A", "B", "C", "D", "F"];
var TIER_UP = { F: "D", D: "C", C: "B", B: "A", A: null };
var TIER_DOWN = { S: "A", A: "B", B: "C", C: "D", D: "F", F: null };
var CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders }
  });
}
__name(json, "json");
function getAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || "https://nayanramam.com,http://localhost:8788,http://127.0.0.1:8788";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
__name(getAllowedOrigins, "getAllowedOrigins");
function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = getAllowedOrigins(env);
  if (origin && allowed.includes(origin)) {
    return { ...CORS_HEADERS, "Access-Control-Allow-Origin": origin };
  }
  if (allowed.length > 0) {
    return { ...CORS_HEADERS, "Access-Control-Allow-Origin": allowed[0] };
  }
  return CORS_HEADERS;
}
__name(corsHeaders, "corsHeaders");
function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request, env))) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}
__name(withCors, "withCors");
function parseAllowedUsers(env) {
  const raw = env.ALLOWED_USERS || "";
  return raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}
__name(parseAllowedUsers, "parseAllowedUsers");
function publicPerson(person) {
  return {
    id: person.id,
    name: person.name,
    photo_url: person.photo_url,
    tier: person.tier
  };
}
__name(publicPerson, "publicPerson");
async function getSession(request, env) {
  const auth = request.headers.get("Authorization") || "";
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
__name(getSession, "getSession");
async function getMyVotes(env, username) {
  const { results } = await env.DB.prepare(
    "SELECT person_id, direction FROM votes WHERE username = ?"
  ).bind(username.toLowerCase()).all();
  const myVotes = {};
  for (const row of results) {
    myVotes[row.person_id] = row.direction;
  }
  return myVotes;
}
__name(getMyVotes, "getMyVotes");
async function handleState(env, session) {
  const { results: people } = await env.DB.prepare(
    "SELECT id, name, photo_url, tier FROM people ORDER BY name ASC"
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
__name(handleState, "handleState");
async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const username = String(body.username || "").trim();
  if (!username) return json({ error: "Username is required" }, 400);
  const allowed = parseAllowedUsers(env);
  if (!allowed.includes(username.toLowerCase())) {
    return json({ error: "Username not allowed" }, 403);
  }
  const token = crypto.randomUUID();
  await env.SESSIONS.put(
    token,
    JSON.stringify({ username }),
    { expirationTtl: 86400 }
  );
  return json({ token, username });
}
__name(handleLogin, "handleLogin");
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
      changeDirection = "up";
    }
  } else if (pendingDown >= 5) {
    const next = TIER_DOWN[currentTier];
    if (next) {
      currentTier = next;
      toTier = next;
      pendingDown = 0;
      tierChanged = true;
      changeDirection = "down";
    }
  }
  return {
    tier: currentTier,
    pendingUp,
    pendingDown,
    tierChanged,
    fromTier,
    toTier,
    changeDirection
  };
}
__name(applyTierChanges, "applyTierChanges");
async function handleVote(request, env, session) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const personId = String(body.person_id || "").trim();
  const direction = body.direction;
  const username = session.username.toLowerCase();
  if (!personId) return json({ error: "person_id is required" }, 400);
  if (direction !== "up" && direction !== "down") {
    return json({ error: 'direction must be "up" or "down"' }, 400);
  }
  const person = await env.DB.prepare(
    "SELECT id, name, photo_url, tier, pending_up, pending_down FROM people WHERE id = ?"
  ).bind(personId).first();
  if (!person) return json({ error: "Person not found" }, 404);
  const existing = await env.DB.prepare(
    "SELECT direction FROM votes WHERE person_id = ? AND username = ?"
  ).bind(personId, username).first();
  let pendingUp = person.pending_up;
  let pendingDown = person.pending_down;
  let yourVote = null;
  let action = "added";
  const statements = [];
  if (existing?.direction === direction) {
    statements.push(
      env.DB.prepare("DELETE FROM votes WHERE person_id = ? AND username = ?").bind(personId, username)
    );
    if (direction === "up") pendingUp = Math.max(0, pendingUp - 1);
    else pendingDown = Math.max(0, pendingDown - 1);
    yourVote = null;
    action = "removed";
  } else if (existing) {
    return json({ error: "Remove your current vote first" }, 400);
  } else {
    statements.push(
      env.DB.prepare(
        "INSERT INTO votes (person_id, username, direction) VALUES (?, ?, ?)"
      ).bind(personId, username, direction)
    );
    if (direction === "up") pendingUp += 1;
    else pendingDown += 1;
    yourVote = direction;
    action = "added";
  }
  const tierResult = applyTierChanges(person.tier, pendingUp, pendingDown);
  statements.push(
    env.DB.prepare(
      "UPDATE people SET tier = ?, pending_up = ?, pending_down = ? WHERE id = ?"
    ).bind(
      tierResult.tier,
      tierResult.pendingUp,
      tierResult.pendingDown,
      personId
    )
  );
  if (tierResult.tierChanged) {
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
  await env.DB.batch(statements);
  return json({
    person: publicPerson({
      id: person.id,
      name: person.name,
      photo_url: person.photo_url,
      tier: tierResult.tier
    }),
    your_vote: yourVote,
    action,
    tier_changed: tierResult.tierChanged,
    from_tier: tierResult.tierChanged ? tierResult.fromTier : null,
    to_tier: tierResult.tierChanged ? tierResult.toTier : null
  });
}
__name(handleVote, "handleVote");
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }
    let response;
    try {
      if (path === "/api/sbc/state" && request.method === "GET") {
        const session = await getSession(request, env);
        response = await handleState(env, session);
      } else if (path === "/api/sbc/login" && request.method === "POST") {
        response = await handleLogin(request, env);
      } else if (path === "/api/sbc/vote" && request.method === "POST") {
        const session = await getSession(request, env);
        if (!session) {
          response = json({ error: "Unauthorized" }, 401);
        } else {
          response = await handleVote(request, env, session);
        }
      } else {
        response = json({ error: "Not found" }, 404);
      }
    } catch (err) {
      console.error(err);
      response = json({ error: "Internal server error" }, 500);
    }
    return withCors(response, request, env);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-uV5SoM/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-uV5SoM/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
