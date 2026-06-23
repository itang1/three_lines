import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    // If no key configured yet, just log and return success so the form works in dev
    console.log('Contact form submission (no email sent — add RESEND_API_KEY):', { name, email, message })
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
      reply_to: email,
      subject: `Three Lines - message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
