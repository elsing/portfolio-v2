/**
 * Handle on the main app's SQLite file (shared Docker bind mount).
 *
 * Self-sufficient on purpose: creates the data directory and schema itself
 * (mirroring lib/db.js) rather than assuming the main app got there first —
 * on a fresh host, admin can start before anyone has ever hit /api/terminal
 * or /api/track/click, and the file wouldn't exist yet otherwise.
 *
 * Not opened with `readonly`: the DB is in WAL mode, and WAL readers must be
 * able to create/write the -shm shared-memory file, which a readonly handle
 * (or a :ro volume mount) breaks. The admin code only ever runs SELECTs.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'portfolio.sqlite');

let db = null;

function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS click_events (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        ts          INTEGER NOT NULL,
        path        TEXT    NOT NULL,
        x           REAL    NOT NULL,
        y           REAL    NOT NULL,
        viewport_w  INTEGER NOT NULL,
        viewport_h  INTEGER NOT NULL,
        page_h      INTEGER NOT NULL,
        ip_hash     TEXT,
        ua          TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_click_events_path ON click_events(path);
      CREATE INDEX IF NOT EXISTS idx_click_events_ts   ON click_events(ts);

      CREATE TABLE IF NOT EXISTS ai_prompt_logs (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        ts              INTEGER NOT NULL,
        ip_hash         TEXT,
        user_messages   TEXT NOT NULL,
        ai_reply        TEXT NOT NULL,
        remaining_quota INTEGER,
        error           TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_ai_prompt_logs_ts ON ai_prompt_logs(ts);
    `);
  }
  return db;
}

module.exports = { getDb };
