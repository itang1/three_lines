import { NextResponse } from 'next/server'
import { appendRow } from '@/lib/google-sheets'

// Temporary diagnostic endpoint — delete after confirming sheets work.
export async function GET() {
  const steps: string[] = []

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    steps.push('FAIL: GOOGLE_SERVICE_ACCOUNT_JSON is not set')
    return NextResponse.json({ ok: false, steps })
  }
  steps.push('OK: env var is set')

  let parsed: { client_email?: string }
  try {
    parsed = JSON.parse(raw)
    steps.push(`OK: JSON parses — client_email: ${parsed.client_email}`)
  } catch {
    steps.push('FAIL: JSON.parse threw — value is not valid JSON')
    return NextResponse.json({ ok: false, steps })
  }

  try {
    await appendRow('Visits', [new Date().toISOString(), 'test-ip', '/test-sheets', null, null, null, null, 'diagnostic'])
    steps.push('OK: appendRow completed without throwing')
  } catch (e) {
    steps.push(`FAIL: appendRow threw — ${e}`)
    return NextResponse.json({ ok: false, steps })
  }

  return NextResponse.json({ ok: true, steps })
}
