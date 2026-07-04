/**
 * Terminal chat route handler — folio-ai @ singer.systems
 *
 * Env vars (.env.local):
 *   OLLAMA_URL         → http://YOUR_WIREGUARD_IP:11434
 *   OLLAMA_MODEL       → e.g. phi3.5
 *   FOLIO_PROMPT_FILE  → absolute path to system-prompt.txt (required)
 *
 * The system prompt lives in system-prompt.txt — never in source code.
 * Add system-prompt.txt to .gitignore to keep it private.
 * Edit the file and restart Next.js to update folio-ai.
 */

import fs   from 'fs';
import path from 'path';
import { getRemainingRequests, consumeRequest } from '@/lib/rateLimit';
import { logAiExchange } from '@/lib/db';

// Read once at module load — stays in memory for the process lifetime.
// If the file is missing the module still loads, but requests will fail
// gracefully rather than crashing the server.
function loadPrompt() {
  const filePath = process.env.FOLIO_PROMPT_FILE;

  if (!filePath) {
    console.error('[folio-ai] FOLIO_PROMPT_FILE is not set — folio-ai is offline');
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) throw new Error('file is empty');
    return content;
  } catch (err) {
    const dir = path.dirname(filePath);
    let dirContents = '(could not read directory)';
    try {
      dirContents = fs.readdirSync(dir).join(', ') || '(empty)';
    } catch {}
    console.error(
      `[folio-ai] Failed to load prompt from: ${filePath}\n` +
      `[folio-ai] Reason: ${err.message}\n` +
      `[folio-ai] Files in ${dir}: ${dirContents}`
    );
    return null;
  }
}

const SYSTEM_PROMPT = loadPrompt();

function buildPrompt(ipRemaining, sessionRemaining) {
  // ipRemaining is post-consume (already decremented for this request)
  // sessionRemaining from client is pre-consume, so subtract 1 to align
  const sessionAfter = sessionRemaining !== null
    ? Math.max(0, sessionRemaining - 1)
    : null;
  const remaining = sessionAfter !== null
    ? Math.min(ipRemaining, sessionAfter)
    : ipRemaining;
  return `${SYSTEM_PROMPT}\n\nAfter this response, the user has ${remaining} message${remaining === 1 ? '' : 's'} remaining this hour. This is exact. Do not second-guess it.`;
}

async function queryOllama(messages, ipRemaining, sessionRemaining) {
  const url   = process.env.OLLAMA_URL;
  const model = process.env.OLLAMA_MODEL;

  if (!url || !model) {
    throw new Error('OLLAMA_URL or OLLAMA_MODEL is not set');
  }

  const res = await fetch(`${url}/api/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream:     false,
      keep_alive: -1,
      messages: [
        { role: 'system', content: buildPrompt(ipRemaining, sessionRemaining) },
        ...messages,
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.message?.content?.trim() ?? 'no response';
}

export async function POST(request) {
  // Refuse requests if the prompt never loaded
  if (!SYSTEM_PROMPT) {
    return Response.json(
      { error: 'folio-ai is offline — system prompt not configured' },
      { status: 503 }
    );
  }

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

    const remaining = getRemainingRequests(ip);
    if (remaining === 0) {
      return Response.json(
        { error: 'rate limited — try again later', remaining: 0 },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return Response.json({ error: 'invalid request' }, { status: 400 });
    }

    // Reject if any user message exceeds 60 chars
    const hasOversizedMessage = body.messages.some(
      m => m.role === 'user' && typeof m.content === 'string' && m.content.length > 60
    );
    if (hasOversizedMessage) {
      return Response.json({ error: 'message too long' }, { status: 400 });
    }

    // Reject if total conversation history exceeds 4000 chars
    const totalChars = body.messages.reduce(
      (sum, m) => sum + (typeof m.content === 'string' ? m.content.length : 0), 0
    );
    if (totalChars > 4000) {
      return Response.json(
        { error: 'conversation history too long — try starting a new session with clear' },
        { status: 400 }
      );
    }

    const sessionRemaining = typeof body.sessionRemaining === 'number'
      ? Math.max(0, body.sessionRemaining)
      : null;

    const sanitised = body.messages
      .filter(m => m.role && m.content)
      .slice(-10)
      .map(m => ({
        role:    m.role === 'assistant' ? 'assistant' : 'user',
        content: m.role === 'user' ? String(m.content).slice(0, 60) : String(m.content),
      }));

    consumeRequest(ip);
    const remainingAfter = getRemainingRequests(ip);

    let reply;
    let ollamaError = null;
    try {
      reply = await queryOllama(sanitised, remainingAfter, sessionRemaining);
    } catch (err) {
      console.error('[terminal] Ollama error:', err.message);
      ollamaError = err.message;
      reply = 'cluster is having a moment — try again shortly.';
    }

    logAiExchange({
      ip,
      userMessages: sanitised.filter(m => m.role === 'user').map(m => m.content),
      aiReply: reply,
      remainingQuota: remainingAfter,
      error: ollamaError,
    });

    return Response.json({ reply, remaining: remainingAfter });

  } catch (err) {
    console.error('[terminal/route]', err);
    return Response.json(
      { error: 'something went sideways on the backend' },
      { status: 500 }
    );
  }
}