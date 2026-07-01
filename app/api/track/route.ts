import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { appendRow } from '@/lib/google-sheets'
import { requestGeo } from '@/lib/request-geo'

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

  const { country, region, city, timezone, language } = requestGeo(req)

  const ts = new Date().toISOString()

  // Visits tab: Timestamp | IP | Page | Country | Region | City | Timezone | Language | Referrer | User Agent
  await appendRow('Visits', [ts, ip, page, country, region, city, timezone, language, referrer, ua])

  return NextResponse.json({ ok: true })
}
