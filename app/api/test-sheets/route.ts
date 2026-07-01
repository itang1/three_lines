import { NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/google-sheets'

const SPREADSHEET_ID = '1zk1Gz-0LUhgbovOxTH-uUSTelI1fteBOL3P2tVlSyAE'

// Temporary diagnostic endpoint — delete after confirming sheets work.
export async function GET() {
  const steps: string[] = []

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    steps.push('FAIL: GOOGLE_SERVICE_ACCOUNT_JSON is not set')
    return NextResponse.json({ ok: false, steps })
  }
  steps.push('OK: env var is set, length=' + raw.length)

  try {
    const parsed = JSON.parse(raw) as { client_email?: string }
    steps.push('OK: JSON parses — client_email: ' + parsed.client_email)
  } catch (e) {
    steps.push('FAIL: JSON.parse threw — ' + e)
    return NextResponse.json({ ok: false, steps })
  }

  let token: string | null = null
  try {
    token = await getAccessToken()
  } catch (e) {
    steps.push('FAIL: getAccessToken threw — ' + e)
    return NextResponse.json({ ok: false, steps })
  }
  if (!token) {
    steps.push('FAIL: getAccessToken returned null — check terminal for [sheets] error')
    return NextResponse.json({ ok: false, steps })
  }
  steps.push('OK: access token obtained')

  const range = encodeURIComponent('Visits!A1')
  const url = [
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`,
    `/values/${range}:append`,
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  ].join('')

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [['diagnostic-test', new Date().toISOString()]] }),
  })

  if (!res.ok) {
    const body = await res.text()
    steps.push(`FAIL: append returned ${res.status} — ${body}`)
    return NextResponse.json({ ok: false, steps })
  }

  steps.push('OK: row written to Visits tab — check your sheet')
  return NextResponse.json({ ok: true, steps })
}
