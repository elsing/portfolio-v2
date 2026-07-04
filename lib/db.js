/**
 * Shared SQLite storage — folio-ai prompt logs.
 * (Click heatmaps are handled by Umami's session replay/heatmap feature.)
 *
 * Env vars:
 *   DB_PATH       → absolute path to the sqlite file (in Docker: /app/data/portfolio.sqlite,
 *                   backed by the /opt/portfolio/data bind mount)
 *   IP_HASH_SALT  → random string; IPs are only ever stored as sha256(ip + salt)
 *
 * The `globalThis` cache keeps one Database instance across Next.js dev
 * hot-reloads, same reasoning as the shared rateLimits Map in lib/rateLimit.js.
 * WAL mode lets the admin app read the same file while this process writes.
 */

import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'portfolio.sqlite');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = globalThis.__portfolioDb ?? new Database(DB_PATH);
if (process.env.NODE_ENV !== 'production') globalThis.__portfolioDb = db;

db.pragma('journal_mode = WAL');

db.exec(`
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

export function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT ?? '';
  return crypto.createHash('sha256').update(`${ip}${salt}`).digest('hex');
}

export function logAiExchange({ ip, userMessages, aiReply, remainingQuota, error }) {
  try {
    db.prepare(`
      INSERT INTO ai_prompt_logs (ts, ip_hash, user_messages, ai_reply, remaining_quota, error)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      Date.now(),
      hashIp(ip),
      JSON.stringify(userMessages),
      aiReply,
      remainingQuota ?? null,
      error ?? null,
    );
  } catch (err) {
    console.error('[folio-ai] failed to log exchange:', err.message);
  }
}

export default db;
