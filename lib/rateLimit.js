/**
 * Shared in-memory rate limiter.
 * Imported by both /api/terminal/route.js and /api/terminal/remaining/route.js.
 * Next.js module caching ensures both routes share the same Map instance
 * within a single server process — which is always the case for self-hosted Docker.
 */

export const RATE_LIMIT  = 10; // per IP per hour, shared across all sessions
export const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export const rateLimits = new Map();

export function getRateData(ip) {
  const now  = Date.now();
  const data = rateLimits.get(ip);
  if (!data || now - data.start > RATE_WINDOW) {
    const fresh = { count: 0, start: now };
    rateLimits.set(ip, fresh);
    return fresh;
  }
  return data;
}

export function getRemainingRequests(ip) {
  return Math.max(0, RATE_LIMIT - getRateData(ip).count);
}

export function consumeRequest(ip) {
  const data = getRateData(ip);
  if (data.count >= RATE_LIMIT) return false;
  data.count++;
  return true;
}