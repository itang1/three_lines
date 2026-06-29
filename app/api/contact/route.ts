import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_MS = 10 * 60 * 1000 // 10 minutes per IP
const seen = new Map<string, number>()

function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function rateLimited(ip: string): boolean {
  const last = seen.get(ip)
  if (last && Date.now() - last < RATE_LIMIT_MS) return true
  seen.set(ip, Date.now())
  // prune stale entries to avoid unbounded growth
  if (seen.size > 500) {
    for (const [k, v] of seen) {
      if (Date.now() - v > RATE_LIMIT_MS) seen.delete(k)
    }
  }
  return false
}

export async function POST(req: Request) {
  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json()
  const { name, email, message, website } = body

  // honeypot: bots fill hidden fields, humans don't
  if (website) return NextResponse.json({ ok: true })

  if (
    typeof name !== 'string' || name.trim().length === 0 || name.length > 100 ||
    typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200 ||
    typeof message !== 'string' || message.trim().length === 0 || message.length > 5000
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const safeName = name.trim()
  const safeEmail = email.trim()
  const safeMessage = message.trim()

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.log('Contact form submission (no email sent — add RESEND_API_KEY):', { name: safeName, email: safeEmail, message: safeMessage })
    return NextResponse.json({ ok: true })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Three Lines <onboarding@resend.dev>',
      to: 'theworkingcell+threelines@gmail.com',
      reply_to: safeEmail,
      subject: `Three Lines - message from ${safeName}`,
      text: `From: ${safeName} <${safeEmail}>\n\n${safeMessage}`,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
