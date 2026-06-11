CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('S', 'A', 'B', 'C', 'D', 'F')),
  pending_up INTEGER NOT NULL DEFAULT 0,
  pending_down INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS votes (
  person_id TEXT NOT NULL,
  username TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('up', 'down')),
  PRIMARY KEY (person_id, username)
);

CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id TEXT NOT NULL,
  person_name TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('up', 'down')),
  from_tier TEXT NOT NULL,
  to_tier TEXT NOT NULL,
  triggered_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_created ON activity (created_at DESC);
