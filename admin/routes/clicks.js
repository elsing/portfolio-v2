const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

// GET /api/clicks/paths — distinct paths, most-clicked first (heatmap dropdown)
router.get('/paths', (req, res) => {
  try {
    const rows = getDb().prepare(`
      SELECT path, COUNT(*) AS n FROM click_events GROUP BY path ORDER BY n DESC
    `).all();
    res.json(rows);
  } catch (err) {
    console.error('[admin/clicks]', err.message);
    res.status(500).json({ error: 'query failed' });
  }
});

// GET /api/clicks?path=/&from=<epoch-ms>&to=<epoch-ms>&device=mobile|tablet|desktop
router.get('/', (req, res) => {
  try {
    const pagePath = typeof req.query.path === 'string' ? req.query.path.slice(0, 200) : '/';
    const from = parseInt(req.query.from ?? '0', 10) || 0;
    const to   = parseInt(req.query.to ?? '0', 10) || Date.now();

    let deviceClause = '';
    if (req.query.device === 'mobile')  deviceClause = 'AND viewport_w < 768';
    if (req.query.device === 'tablet')  deviceClause = 'AND viewport_w >= 768 AND viewport_w < 1024';
    if (req.query.device === 'desktop') deviceClause = 'AND viewport_w >= 1024';

    const rows = getDb().prepare(`
      SELECT x, y, viewport_w, viewport_h, page_h, ts
      FROM click_events
      WHERE path = ? AND ts BETWEEN ? AND ? ${deviceClause}
      ORDER BY ts DESC LIMIT 10000
    `).all(pagePath, from, to);

    res.json(rows);
  } catch (err) {
    console.error('[admin/clicks]', err.message);
    res.status(500).json({ error: 'query failed' });
  }
});

module.exports = router;
