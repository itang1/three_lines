import { createClient } from '@supabase/supabase-js'

// Server-only. Backed by the rate_limits table via the check_rate_limit RPC so
// the window is shared across serverless instances and survives cold starts.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// Returns true if the call is within the limit, false if it should be blocked.
// Fails open on infra error so a transient DB blip doesn't take the route down.
export async function rateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  })
  if (error) return true
  return data !== false
}
