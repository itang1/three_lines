import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { appendRow } from '@/lib/google-sheets'

export async function POST(req: Request) {
  // One tracked visit per IP per 30 minutes to prevent floods
  const ip = clientIp(req)
  if (!(await rateLimit(`track:${ip}`, 1, 30 * 60))) {
    console.log('[track] rate-limited, skipping:', ip)
    return NextResponse.json({ ok: true })
  }

  const body = await req.json().catch(() => ({}))
  const page     = typeof body.page     === 'string' ? body.page.slice(0, 200)     : null
  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null
  const ua       = typeof body.ua       === 'string' ? body.ua.slice(0, 300)       : null

  // Vercel sets geography headers from its edge network.
  // These are absent in local dev (fall back to null).
  // Region is `x-vercel-ip-country-region` (ISO subdivision), not `x-vercel-ip-region`.
  const country  = req.headers.get('x-vercel-ip-country')
  const region   = req.headers.get('x-vercel-ip-country-region')
  const city     = decodeVercelHeader(req.headers.get('x-vercel-ip-city'))
  const timezone = req.headers.get('x-vercel-ip-timezone')
  // Preferred UI language, primary tag only (e.g. "en-US,en;q=0.9" -> "en-US").
  const language = req.headers.get('accept-language')?.split(',')[0]?.trim() || null

  const ts = new Date().toISOString()

  // Visits tab: Timestamp | IP | Page | Country | Region | City | Timezone | Language | Referrer | User Agent
  await appendRow('Visits', [ts, ip, page, country, region, city, timezone, language, referrer, ua])

  return NextResponse.json({ ok: true })
}

// Vercel encodes city names with percent-encoding (e.g. "San%20Francisco")
function decodeVercelHeader(value: string | null): string | null {
  if (!value) return null
  try { return decodeURIComponent(value) } catch { return value }
}
