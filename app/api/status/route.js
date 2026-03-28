/**
 * GET /api/status
 *
 * Server polls Uptime Kuma once per revalidate window.
 * All client requests are served from the cached response —
 * Kuma is never hit more than once per window regardless of traffic.
 *
 * revalidate: 300 = 5 min when called normally
 * The client re-fetches this endpoint every 2 min, but always gets
 * a cached response until the server decides to revalidate.
 *
 * Env vars:
 *   KUMA_URL  → e.g. http://10.10.X.X:3001
 *   KUMA_SLUG → status page slug, e.g. "public"
 */

export const revalidate = 300; // server re-fetches Kuma every 5 minutes

export async function GET() {
  const base = process.env.KUMA_URL;
  const slug = process.env.KUMA_SLUG ?? 'public';

  if (!base) {
    return Response.json(
      { allUp: true, up: 0, total: 0, reason: 'KUMA_URL not set' },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    );
  }

  try {
    const res = await fetch(`${base}/api/status-page/heartbeat/${slug}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`Kuma returned ${res.status}`);

    const data  = await res.json();
    const lists = data.heartbeatList ?? {};

    let up = 0, total = 0;
    for (const beats of Object.values(lists)) {
      if (!Array.isArray(beats) || beats.length === 0) continue;
      total++;
      if (beats[beats.length - 1].status === 1) up++;
    }

    const allUp = up === total && total > 0;

    return Response.json(
      { allUp, up, total },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    );

  } catch (err) {
    console.error('[status]', err.message);
    return Response.json(
      { allUp: true, up: 0, total: 0, error: err.message },
      { headers: { 'Cache-Control': 'public, max-age=60' } } // shorter cache on error
    );
  }
}