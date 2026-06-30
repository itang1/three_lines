// Server-only. Appends rows to a Google Sheet using a service account JWT,
// with no npm dependencies beyond Node's built-in crypto module.
//
// Setup required:
// 1. Google Cloud Console → create a Service Account → download JSON key
// 2. Share the spreadsheet with the service account email (Editor)
// 3. Set GOOGLE_SERVICE_ACCOUNT_JSON env var to the contents of the JSON key
// 4. In the spreadsheet, create two tabs named exactly "Feedback" and "Visits"
//
// The spreadsheet ID comes from the URL the owner shared.
import crypto from 'crypto'

const SPREADSHEET_ID = '1zk1Gz-0LUhgbovOxTH-uUSTelI1fteBOL3P2tVlSyAE'

// Module-level cache — survives within a serverless container instance so we
// don't exchange a new token on every request when the function stays warm.
let _cached: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string | null> {
  if (_cached && Date.now() < _cached.expiresAt - 60_000) return _cached.token

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    console.warn('[sheets] GOOGLE_SERVICE_ACCOUNT_JSON is not set')
    return null
  }

  let sa: { client_email: string; private_key: string }
  try {
    sa = JSON.parse(raw)
  } catch {
    console.error('[sheets] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON')
    return null
  }

  // Service account JSON files store newlines as literal \n sequences
  const privateKey = sa.private_key.replace(/\\n/g, '\n')
  const now = Math.floor(Date.now() / 1000)

  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss:   sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud:   'https://oauth2.googleapis.com/token',
    exp:   now + 3600,
    iat:   now,
  })).toString('base64url')

  const signer = crypto.createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  const signature = signer.sign(privateKey, 'base64url')

  const jwt = `${header}.${payload}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  })

  if (!res.ok) {
    console.error('[sheets] token exchange failed:', await res.text())
    return null
  }

  const json = await res.json() as { access_token: string }
  _cached = { token: json.access_token, expiresAt: Date.now() + 3_600_000 }
  return _cached.token
}

// Append one row to the named sheet tab. Values are written left-to-right
// starting at column A, at the first empty row.
export async function appendRow(
  sheet: 'Feedback' | 'Visits',
  values: (string | number | null)[],
): Promise<void> {
  const token = await getAccessToken()
  if (!token) return

  const range = encodeURIComponent(`${sheet}!A1`)
  const url = [
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`,
    `/values/${range}:append`,
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  ].join('')

  const res = await fetch(url, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ values: [values] }),
  })

  if (!res.ok) console.error('[sheets] append failed:', await res.text())
}
