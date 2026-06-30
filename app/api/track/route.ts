import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { appendRow } from '@/lib/google-sheets'

export async function POST(req: Request) {
  // One tracked visit per IP per 30 minutes to prevent floods
  const ip = clientIp(req)
  if (!(await rateLimit(`track:${ip}`, 1, 30 * 60))) {
    return NextResponse.json({ ok: true }) // silently swallow — not an error for the client
  }

  const body = await req.json()
  const page     = typeof body.page     === 'string' ? body.page.slice(0, 200)     : null
  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null
  const ua       = typeof body.ua       === 'string' ? body.ua.slice(0, 300)       : null

  // Vercel sets geography headers from its edge network.
  // These are absent in local dev (fall back to null).
  const country = req.headers.get('x-vercel-ip-country')
  const city    = decodeVercelHeader(req.headers.get('x-vercel-ip-city'))
  const region  = req.headers.get('x-vercel-ip-region')

  const ts = new Date().toISOString()

  // Visits tab: Timestamp | Page | Country | City | Region | Referrer | User Agent
  await appendRow('Visits', [ts, page, country, city, region, referrer, ua])

  return NextResponse.json({ ok: true })
}

// Vercel encodes city names with percent-encoding (e.g. "San%20Francisco")
function decodeVercelHeader(value: string | null): string | null {
  if (!value) return null
  try { return decodeURIComponent(value) } catch { return value }
}
