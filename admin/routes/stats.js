const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

// GET /api/stats — folio-ai usage overview
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const aiPerDay = db.prepare(`
      SELECT strftime('%Y-%m-%d', ts / 1000, 'unixepoch') AS day, COUNT(*) AS n
      FROM ai_prompt_logs
      WHERE ts > (strftime('%s','now') - 30 * 86400) * 1000
      GROUP BY day ORDER BY day
    `).all();

    const aiTotals = db.prepare(`
      SELECT COUNT(*)                                                    AS total,
             COUNT(DISTINCT ip_hash)                                     AS unique_visitors,
             COALESCE(SUM(CASE WHEN error IS NOT NULL THEN 1 ELSE 0 END), 0) AS errors
      FROM ai_prompt_logs
    `).get();

    res.json({ aiPerDay, aiTotals });
  } catch (err) {
    console.error('[admin/stats]', err.message);
    res.status(500).json({ error: 'query failed' });
  }
});

module.exports = router;
