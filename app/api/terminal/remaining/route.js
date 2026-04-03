import { getRemainingRequests, RATE_LIMIT } from '@/lib/rateLimit';

export async function GET(request) {
  const ip        = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const remaining = getRemainingRequests(ip);
  return Response.json({ remaining, limit: RATE_LIMIT });
}
