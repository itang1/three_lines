import { supabaseAdmin } from '@/lib/supabase-admin'

// Server-only. Backed by the rate_limits table via the check_rate_limit RPC so
// the window is shared across serverless instances and survives cold starts.

// Prefer x-real-ip: on Vercel it is set to the actual client IP and cannot be
// spoofed. The leftmost x-forwarded-for entry is client-controlled, so an
// attacker could rotate it to defeat every per-IP cap; only fall back to the
// rightmost (closest-hop) x-forwarded-for segment when x-real-ip is absent.
export function clientIp(req: Request): string {
  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',')
    const last = parts[parts.length - 1]?.trim()
    if (last) return last
  }
  return 'unknown'
}

// Returns true if the call is within the limit, false if it should be blocked.
// On an infra error it fails open by default (a transient DB blip shouldn't take
// a route down). Callers guarding a paid external quota can pass
// { failClosed: true } so a limiter outage cannot be used to drain that quota.
export async function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
  opts?: { failClosed?: boolean },
): Promise<boolean> {
  const { data, error } = await supabaseAdmin().rpc('check_rate_limit', {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  })
  if (error) return !opts?.failClosed
  return data !== false
}
