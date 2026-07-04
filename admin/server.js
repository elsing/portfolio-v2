/**
 * portfolio-admin — internal-only admin panel.
 *
 * SECURITY MODEL: the real boundary is network topology — this service is
 * never attached to the traefik_proxy Docker network and its port is bound
 * only to the homelab-internal interface (see docker-compose). The password
 * login below is defense-in-depth, not the primary control.
 *
 * Env vars:
 *   ADMIN_PASSWORD  → shared password (required)
 *   SESSION_SECRET  → cookie-signing secret (required)
 *   ADMIN_PORT      → listen port (default 9000)
 *   DB_PATH         → sqlite file (default ../data/portfolio.sqlite)
 */

const path          = require('path');
const express       = require('express');
const cookieSession = require('cookie-session');

const authRoutes  = require('./routes/auth');
const logsRoutes  = require('./routes/logs');
const statsRoutes = require('./routes/stats');
const clickRoutes = require('./routes/clicks');

const { ADMIN_PASSWORD, SESSION_SECRET } = process.env;
if (!ADMIN_PASSWORD || !SESSION_SECRET) {
  console.error('[admin] ADMIN_PASSWORD and SESSION_SECRET must be set — refusing to start');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');

app.use(express.json());
app.use(cookieSession({
  name:     'admin_session',
  secret:   SESSION_SECRET,
  httpOnly: true,
  sameSite: 'lax',
  maxAge:   12 * 60 * 60 * 1000, // 12h
}));

// ── Auth gate ────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session?.authed) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'unauthorised' });
  return res.redirect('/login.html');
}

// Login/logout, the login page, and its stylesheet are the only
// unauthenticated surfaces
app.use('/', authRoutes);
app.get('/login.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/admin.css', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'admin.css')));

app.use(requireAuth);

// ── Authenticated routes ─────────────────────────────────────
app.use('/api/logs',   logsRoutes);
app.use('/api/stats',  statsRoutes);
app.use('/api/clicks', clickRoutes);
app.use(express.static(path.join(__dirname, 'public')));

const port = parseInt(process.env.ADMIN_PORT ?? '9000', 10);
app.listen(port, () => console.log(`[admin] listening on :${port}`));
