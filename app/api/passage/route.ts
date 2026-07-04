import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { toApiBiblePassageId } from '@/lib/passage-ref'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET /api/passage?book=john&chapter=1&ref=John+1:1-18&translation=ESV
//
// ESV  -> Crossway API, fetched fresh every request (no local storage per their terms)
// All others -> API.Bible, cached in Supabase passages table, refreshed every 30 days

// API.Bible Bible IDs — find more at https://scripture.api.bible/lifechange/bibles
const BIBLE_API_IDS: Record<string, string> = {
  KJV: 'de4e12af7f28f599-02',
  NIV: '78a9f6124f344018-01',
  CEV: '9879dbb7cfe39e4d-01',
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' }

async function fetchESV(ref: string, verseNumbers: boolean): Promise<string | null> {
  const key = process.env.ESV_API_KEY
  if (!key) return null
  const vn = verseNumbers ? 'true' : 'false'
  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-headings=false&include-footnotes=false&include-verse-numbers=${vn}&include-short-copyright=false&include-passage-references=false`,
    { headers: { Authorization: `Token ${key}` } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.passages?.[0]?.trim() ?? null
}

async function fetchApiBible(ref: string, translation: string, verseNumbers: boolean): Promise<string | null> {
  const key       = process.env.BIBLE_API_KEY
  const bibleId   = BIBLE_API_IDS[translation]
  const passageId = toApiBiblePassageId(ref)
  if (!key || !bibleId || !passageId) return null
  const vn = verseNumbers ? 'true' : 'false'
  const res = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}?content-type=text&include-verse-numbers=${vn}&include-titles=false`,
    { headers: { 'api-key': key } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data?.data?.content?.trim() ?? null
}

export async function GET(req: Request) {
  // Block browser calls from other origins; pair with a per-IP cap so a direct
  // scraper cannot drain the ESV / API.Bible quota. Same-origin app calls and
  // direct navigation are never cross-site, so legitimate use is untouched.
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const ip = clientIp(req)
  // Fail closed: this route guards the paid ESV / API.Bible quota, so if the
  // limiter itself is unavailable we would rather reject than let it be drained.
  if (!(await rateLimit(`passage:${ip}`, 240, 60, { failClosed: true }))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const bookId        = searchParams.get('book')
  const chapter       = searchParams.get('chapter')
  const ref           = searchParams.get('ref')
  const translation   = (searchParams.get('translation') ?? 'ESV').toUpperCase()
  const verseNumbers  = searchParams.get('vn') === 'true'

  if (!bookId || !chapter || !ref) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  // ESV: always fetch fresh, never cache
  if (translation === 'ESV') {
    const text = await fetchESV(ref, verseNumbers)
    if (!text) return NextResponse.json({ error: 'Could not fetch ESV text' }, { status: 502 })
    return NextResponse.json({ text, cached: false }, { headers: CACHE_HEADERS })
  }

  // Verse-numbers-on: skip cache (Supabase only stores the no-numbers version)
  if (verseNumbers) {
    const text = await fetchApiBible(ref, translation, true)
    if (!text) return NextResponse.json({ error: `Could not fetch ${translation} text` }, { status: 502 })
    return NextResponse.json({ text, cached: false }, { headers: CACHE_HEADERS })
  }

  // All other translations, verse numbers off: check Supabase cache first
  const supabase = supabaseAdmin()
  const { data: cached } = await supabase
    .from('passages')
    .select('text, fetched_at')
    .eq('book_id', bookId)
    .eq('ref', ref)
    .eq('translation', translation)
    .single()

  const isStale = !cached?.fetched_at
    || Date.now() - new Date(cached.fetched_at).getTime() > THIRTY_DAYS_MS

  if (cached?.text && !isStale) {
    return NextResponse.json({ text: cached.text, cached: true }, { headers: CACHE_HEADERS })
  }

  // Fetch fresh from API.Bible and cache
  const text = await fetchApiBible(ref, translation, false)
  if (!text) {
    return NextResponse.json({ error: `Could not fetch ${translation} text` }, { status: 502 })
  }

  await supabase.from('passages').upsert({
    book_id:    bookId,
    chapter:    parseInt(chapter),
    ref,
    text,
    translation,
    fetched_at: new Date().toISOString(),
  }, { onConflict: 'book_id,ref,translation' })

  return NextResponse.json({ text, cached: false }, { headers: CACHE_HEADERS })
}
