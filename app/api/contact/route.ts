import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_S = 10 * 60 // one submission per 10 minutes per IP

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

  // email is required for a message, optional for feedback
  const safeEmail = isString(email) ? email.trim() : ''
  if (safeEmail && (!EMAIL_RE.test(safeEmail) || safeEmail.length > 200)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  let subject: string
  let text: string
  let replyTo: string | undefined

  if (type === 'feedback') {
    const safeWorked = isString(worked) ? worked.trim() : ''
    const safeMissing = isString(missing) ? missing.trim() : ''
    if (
      (safeWorked.length === 0 && safeMissing.length === 0) ||
      safeWorked.length > 5000 || safeMissing.length > 5000
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    subject = 'Three Lines - feedback'
    text =
      `What worked well?\n${safeWorked || '(no answer)'}\n\n` +
      `What felt off or missing?\n${safeMissing || '(no answer)'}\n\n` +
      `Reply-to: ${safeEmail || '(not provided)'}`
    replyTo = safeEmail || undefined
  } else {
    const safeName = isString(name) ? name.trim() : ''
    const safeMessage = isString(message) ? message.trim() : ''
    if (
      safeName.length === 0 || safeName.length > 100 ||
      !safeEmail ||
      safeMessage.length === 0 || safeMessage.length > 5000
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    subject = `Three Lines - message from ${safeName}`
    text = `From: ${safeName} <${safeEmail}>\n\n${safeMessage}`
    replyTo = safeEmail
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.log('Contact form submission (no email sent, add RESEND_API_KEY):', { subject, text })
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
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
