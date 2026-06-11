# SBC Tier List

A joke tier-list site for friends at `nayanramam.com/sbc`.

- **`/sbc`** — public tier list with a live activity feed
- **`/sbc/vote`** — username-only login and up/down voting
- **API** — Cloudflare Worker at `/api/sbc/*` backed by D1 + KV

## How voting works

- You must enter your username on `/sbc/vote` each visit (no auto-login)
- Each person gets **one vote per user** — either up or down, not both
- Click the same button again to **undo** your vote
- Vote counts are hidden from the UI; tier changes still appear in the activity feed
- When **5 total upvotes** accumulate on a person, they move up one tier (F→D→C→B→A→S)
- When **5 total downvotes** accumulate, they move down one tier (S→A→B→C→D→F)
- When a tier change happens, **all votes on that person are cleared** so everyone can vote fresh
- Tier caps at S (top) and F (bottom)

## Replacing placeholder people

1. Add photos to `sbc/assets/photos/` (jpg, png, or svg)
2. Edit `sbc/data/people.json` with real names, ids, photo paths, and starting tiers
3. Update the database — either edit `workers/sbc-api/seed.sql` and re-run seed, or insert rows directly:

```sql
INSERT OR REPLACE INTO people (id, name, photo_url, tier, pending_up, pending_down)
VALUES ('alice', 'Alice', '/sbc/assets/photos/alice.jpg', 'B', 0, 0);
```

## Cloudflare setup (one-time)

### 1. Install Worker dependencies

```bash
cd workers/sbc-api
npm install
```

### 2. Create D1 database

```bash
npx wrangler d1 create sbc-db
```

Copy the `database_id` from the output into `workers/sbc-api/wrangler.toml` (replace `REPLACE_WITH_YOUR_D1_DATABASE_ID`).

### 3. Create KV namespace for sessions

```bash
npx wrangler kv namespace create SESSIONS
```

Copy the `id` into `wrangler.toml` (replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`).

### 4. Configure allowed usernames

Edit `ALLOWED_USERS` in `wrangler.toml` (comma-separated, no spaces required but trimmed automatically):

```toml
ALLOWED_USERS = "nayan,sam,jake,alex"
```

### 5. Initialize and seed the database

```bash
npm run db:init
npm run db:seed
```

For local dev:

```bash
npm run db:init:local
npm run db:seed:local
```

### 6. Deploy the Worker

```bash
npm run deploy
```

### 7. Deploy static files + Pages Function

Push to your repo. Cloudflare Pages will deploy:
- `/sbc` and `/sbc/vote` (static HTML)
- `/api/sbc/*` (via `functions/api/sbc/[[path]].js`)

The root `wrangler.toml` wires D1/KV bindings into Pages. **Check that `name = "portfolio"` matches your Pages project name** in the Cloudflare dashboard — if not, update it.

If bindings don't apply automatically, add them manually in **Workers & Pages → your Pages project → Settings → Functions**:
- D1: `DB` → `sbc-db`
- KV: `SESSIONS` → your sessions namespace
- Variables: `ALLOWED_USERS`, `ALLOWED_ORIGINS`

> **Note:** The `*.workers.dev` URL from `npm run deploy` is only the standalone Worker. It returns `{"error":"Not found"}` at the root — that's normal. Your live site uses `nayanramam.com/api/sbc/*` via the Pages Function.

## Local development

You need **two things running** — the static pages and the API are separate:

**Terminal 1 — API (backend):**
```bash
cd workers/sbc-api
npm install                      # first time only
npm run db:init:local            # first time only
npm run db:seed:local            # first time only
npm run dev
```
This starts the API at `http://127.0.0.1:8787`.

**Terminal 2 — static site (frontend):**
```bash
# from the repo root, e.g.
python -m http.server 8000
```
Then open `http://localhost:8000/sbc/`.

On localhost, the pages automatically talk to the API on port 8787. If you see "Failed to load", the API terminal probably isn't running.

## API reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/sbc/state` | No | All people grouped by tier + last 10 activity items |
| POST | `/api/sbc/login` | No | `{ "username": "sam" }` → `{ "token", "username" }` |
| POST | `/api/sbc/vote` | Bearer token | `{ "person_id": "...", "direction": "up" \| "down" }` |
