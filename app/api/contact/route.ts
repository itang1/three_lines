import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { appendRow } from '@/lib/google-sheets'
import { requestGeo } from '@/lib/request-geo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_S = 10 * 60
const RATE_LIMIT_MAX = 5

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

// Trim a client-supplied string to a sane length, or null.
function clip(v: unknown, max: number): string | null {
  return isString(v) && v.trim() ? v.trim().slice(0, max) : null
}

// "5m 23s" / "47s" from a millisecond duration, or null if not a number.
function formatDuration(ms: unknown): string | null {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) return null
  const total = Math.round(ms / 1000)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

export async function POST(req: Request) {
  const ip = clientIp(req)
  if (!(await rateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_S))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const { email, worked, missing, comments, website, page, referrer, ua, screen, viewport, sessionMs } = body

  // honeypot: bots fill hidden fields, humans don't
  if (website) return NextResponse.json({ ok: true })

  const safeEmail = isString(email) ? email.trim() : ''
  if (safeEmail && (!EMAIL_RE.test(safeEmail) || safeEmail.length > 200)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const safeWorked   = isString(worked)   ? worked.trim()   : ''
  const safeMissing  = isString(missing)  ? missing.trim()  : ''
  const safeComments = isString(comments) ? comments.trim() : ''
  if (
    (safeWorked.length === 0 && safeMissing.length === 0 && safeComments.length === 0) ||
    safeWorked.length > 5000 || safeMissing.length > 5000 || safeComments.length > 5000
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { country, region, city, timezone, language } = requestGeo(req)
  const ts = new Date().toISOString()

  // Feedback tab: Timestamp | Email | What worked | What could be improved | Anything else
  //   | IP | Country | Region | City | Timezone | Language | Page | Referrer
  //   | Session duration | Screen | Viewport | User Agent
  await appendRow('Feedback', [
    ts, safeEmail || null, safeWorked || null, safeMissing || null, safeComments || null,
    ip, country, region, city, timezone, language,
    clip(page, 200), clip(referrer, 500), formatDuration(sessionMs),
    clip(screen, 20), clip(viewport, 20), clip(ua, 300),
  ])

  return NextResponse.json({ ok: true })
}
