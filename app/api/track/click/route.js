/**
 * Click-heatmap ingestion — fire-and-forget beacon target.
 *
 * POST /api/track/click
 * Body: { path, x, y, viewportW, viewportH, pageH }
 *   x/y are fractions 0..1 (y against full document height).
 *
 * Always responds 204 (even for filtered/limited requests) so bots and
 * abusers get no signal, and a failed beacon never surfaces to a visitor.
 * Bot filtering is best-effort UA matching — not perfect, good enough
 * for a personal-site heatmap.
 */

import { consumeClick } from '@/lib/rateLimit';
import { logClickEvent } from '@/lib/db';

const BOT_UA = /bot|crawler|spider|headless|curl|wget|python-requests|scrapy|facebookexternalhit|slackbot|discordbot|telegrambot|preview|monitor|uptime|pingdom|lighthouse|phantomjs|puppeteer|playwright/i;

const MAX_PATH_LEN = 200;
const MAX_DIM      = 20000;

function isValidFraction(n) {
  return typeof n === 'number' && Number.isFinite(n) && n >= -0.1 && n <= 1.5;
}

function isValidDim(n) {
  return Number.isInteger(n) && n > 0 && n < MAX_DIM;
}

export async function POST(request) {
  try {
    const ua = request.headers.get('user-agent') ?? '';
    if (!ua || BOT_UA.test(ua)) {
      return new Response(null, { status: 204 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (!consumeClick(ip)) {
      return new Response(null, { status: 204 });
    }

    const body = await request.json().catch(() => null);
    if (!body) return new Response(null, { status: 204 });

    const { path, x, y, viewportW, viewportH, pageH } = body;

    if (
      typeof path !== 'string' || !path.startsWith('/') || path.length > MAX_PATH_LEN ||
      !isValidFraction(x) || !isValidFraction(y) ||
      !isValidDim(viewportW) || !isValidDim(viewportH) || !isValidDim(pageH)
    ) {
      return new Response(null, { status: 204 });
    }

    logClickEvent({ ip, ua: ua.slice(0, 300), path, x, y, viewportW, viewportH, pageH });
    return new Response(null, { status: 204 });

  } catch (err) {
    console.error('[track/click]', err.message);
    return new Response(null, { status: 204 });
  }
}
