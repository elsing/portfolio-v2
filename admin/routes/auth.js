const crypto  = require('crypto');
const express = require('express');

const router = express.Router();

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // still burn constant time on a same-length dummy compare
    crypto.timingSafeEqual(bufB, bufB);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

router.post('/api/login', (req, res) => {
  const { password } = req.body ?? {};
  if (typeof password === 'string' && safeCompare(password, process.env.ADMIN_PASSWORD)) {
    req.session.authed = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'wrong password' });
});

router.post('/api/logout', (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

module.exports = router;
