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

// Overridable via env; falls back to the original hardcoded sheet so existing
// deployments keep working without new configuration.
const SPREADSHEET_ID =
  process.env.GOOGLE_SHEETS_ID?.trim() || '1zk1Gz-0LUhgbovOxTH-uUSTelI1fteBOL3P2tVlSyAE'

// Module-level cache — survives within a serverless container instance so we
// don't exchange a new token on every request when the function stays warm.
let _cached: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string | null> {
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

const HEADERS: Record<'Feedback' | 'Visits', string[]> = {
  Feedback: ['Timestamp', 'Email', 'What worked', 'What could be improved', 'Anything else', 'IP', 'Country', 'Region', 'City', 'Timezone', 'Language', 'Page', 'Referrer', 'Session duration', 'Screen', 'Viewport', 'User Agent'],
  Visits:   ['Timestamp', 'IP', 'Page', 'Country', 'Region', 'City', 'Timezone', 'Language', 'Referrer', 'User Agent'],
}

// Column letter for a 1-based index (1 -> A). Header rows never exceed 26 cols.
function colLetter(n: number): string {
  return String.fromCharCode(64 + n)
}

// Maps a tab title to its numeric sheetId (gid), needed for structural edits
// like inserting a row. Cached per container since gids never change.
const _sheetIds: Record<string, number> = {}
async function getSheetId(sheet: string, token: string): Promise<number | null> {
  if (sheet in _sheetIds) return _sheetIds[sheet]
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties(sheetId,title)`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  const json = await res.json() as { sheets?: { properties: { sheetId: number; title: string } }[] }
  for (const s of json.sheets ?? []) _sheetIds[s.properties.title] = s.properties.sheetId
  return _sheetIds[sheet] ?? null
}

// Guarantees the tab's first row is the expected header — exactly once per tab.
// If row 1 already matches, does nothing. If the tab is empty, writes the header
// in place. If row 1 holds other data (e.g. rows written before headers existed),
// inserts a fresh top row and fills it, so existing data is preserved below.
// Tabs whose header has been confirmed present in this container. Once verified,
// ensureHeader can skip its Google round trip on every subsequent append, so the
// hot path is just the (token-cached) append itself.
const _headerEnsured = new Set<string>()

async function ensureHeader(sheet: 'Feedback' | 'Visits', token: string): Promise<void> {
  if (_headerEnsured.has(sheet)) return
  const headers = HEADERS[sheet]
  const range = encodeURIComponent(`${sheet}!A1:${colLetter(headers.length)}1`)
  const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`

  const res = await fetch(valuesUrl, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return
  const firstRow = ((await res.json() as { values?: string[][] }).values?.[0]) ?? []

  if (headers.every((h, i) => firstRow[i] === h)) { _headerEnsured.add(sheet); return }

  if (firstRow.length === 0) {
    // Empty tab: write the header directly into row 1.
    await putHeader(range, headers, token)
    return
  }

  // Tab has non-header data in row 1: insert a blank top row, then fill it.
  const sheetId = await getSheetId(sheet, token)
  if (sheetId == null) return
  const ok = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        requests: [{
          insertDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
            inheritFromBefore: false,
          },
        }],
      }),
    },
  )
  if (ok.ok) await putHeader(range, headers, token)
  else console.error('[sheets] header insert failed:', await ok.text())
}

async function putHeader(range: string, headers: string[], token: string): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ values: [headers] }),
    },
  )
  if (!res.ok) console.error('[sheets] header write failed:', await res.text())
}

// Append one row to the named sheet tab. Ensures the header row exists first
// (written once per tab), then appends the data row beneath it.
export async function appendRow(
  sheet: 'Feedback' | 'Visits',
  values: (string | number | null)[],
): Promise<void> {
  const token = await getAccessToken()
  if (!token) return

  await ensureHeader(sheet, token)

  const range = encodeURIComponent(`${sheet}!A1`)
  const appendUrl = [
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`,
    `/values/${range}:append`,
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
  ].join('')

  const res = await fetch(appendUrl, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify({ values: [values] }),
  })

  if (!res.ok) console.error('[sheets] append failed:', await res.text())
}
