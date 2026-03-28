/**
 * GET /api/terminal/health
 * Checks Ollama is reachable. That's it.
 * The system prompt is loaded once at server startup in route.js —
 * if it failed to load, POST /api/terminal returns 503 automatically.
 */

export const revalidate = 30;

export async function GET() {
  const url = process.env.OLLAMA_URL;
  if (!url) return Response.json({ connected: false, error: 'OLLAMA_URL is not configured' });

  try {
    const res = await fetch(`${url}/api/tags`, {
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) throw new Error(`status ${res.status}`);

    return Response.json({ connected: true });

  } catch (err) {
    return Response.json({
      connected: false,
      error:     err.message,
    });
  }
}