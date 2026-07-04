const express = require('express');
const { getDb } = require('../db');

const router = express.Router();
const PAGE_SIZE = 25;

// GET /api/logs?search=&page=0
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const search = typeof req.query.search === 'string' ? req.query.search.slice(0, 100) : '';
    const page   = Math.max(0, parseInt(req.query.page ?? '0', 10) || 0);

    const where  = search ? `WHERE user_messages LIKE ? OR ai_reply LIKE ?` : '';
    const params = search ? [`%${search}%`, `%${search}%`] : [];

    const total = db.prepare(`SELECT COUNT(*) AS n FROM ai_prompt_logs ${where}`).get(...params).n;
    const rows  = db.prepare(`
      SELECT id, ts, ip_hash, user_messages, ai_reply, remaining_quota, error
      FROM ai_prompt_logs ${where}
      ORDER BY id DESC LIMIT ? OFFSET ?
    `).all(...params, PAGE_SIZE, page * PAGE_SIZE);

    res.json({ total, page, pageSize: PAGE_SIZE, rows });
  } catch (err) {
    console.error('[admin/logs]', err.message);
    res.status(500).json({ error: 'query failed' });
  }
});

module.exports = router;
