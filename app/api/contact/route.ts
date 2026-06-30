import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { appendRow } from '@/lib/google-sheets'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_S = 10 * 60

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export async function POST(req: Request) {
  const ip = clientIp(req)
  if (!(await rateLimit(`contact:${ip}`, 1, RATE_LIMIT_WINDOW_S))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json()
  const { type, name, email, message, worked, missing, website } = body

  // honeypot: bots fill hidden fields, humans don't
  if (website) return NextResponse.json({ ok: true })

  const safeEmail = isString(email) ? email.trim() : ''
  if (safeEmail && (!EMAIL_RE.test(safeEmail) || safeEmail.length > 200)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const ts = new Date().toISOString()

  if (type === 'feedback') {
    const safeWorked  = isString(worked)  ? worked.trim()  : ''
    const safeMissing = isString(missing) ? missing.trim() : ''
    if (
      (safeWorked.length === 0 && safeMissing.length === 0) ||
      safeWorked.length > 5000 || safeMissing.length > 5000
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    // Feedback tab: Timestamp | Type | Email | What worked | What could be improved
    await appendRow('Feedback', [ts, 'Feedback', safeEmail || null, safeWorked || null, safeMissing || null])
  } else {
    const safeName    = isString(name)    ? name.trim()    : ''
    const safeMessage = isString(message) ? message.trim() : ''
    if (
      safeName.length === 0 || safeName.length > 100 ||
      !safeEmail ||
      safeMessage.length === 0 || safeMessage.length > 5000
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    // Contact tab: Timestamp | Type | Name | Email | Message
    await appendRow('Feedback', [ts, 'Contact', safeName, safeEmail, safeMessage])
  }

  return NextResponse.json({ ok: true })
}
