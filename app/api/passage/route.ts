import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/passage?book=john&chapter=1&ref=John+1:1-18&translation=ESV
//
// ESV  -> Crossway API, fetched fresh every request (no local storage per their terms)
// All others -> API.Bible, cached in Supabase passages table, refreshed every 30 days

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// API.Bible Bible IDs — find more at https://scripture.api.bible/lifechange/bibles
const BIBLE_API_IDS: Record<string, string> = {
  KJV: 'de4e12af7f28f599-02',
  NIV: '78a9f6124f344018-01',
  CEV: '9879dbb7cfe39e4d-01',
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

async function fetchESV(ref: string): Promise<string | null> {
  const key = process.env.ESV_API_KEY
  if (!key) return null
  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`,
    { headers: { Authorization: `Token ${key}` } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.passages?.[0]?.trim() ?? null
}

async function fetchApiBible(ref: string, translation: string): Promise<string | null> {
  const key     = process.env.BIBLE_API_KEY
  const bibleId = BIBLE_API_IDS[translation]
  if (!key || !bibleId) return null
  const res = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(ref)}&limit=1`,
    { headers: { 'api-key': key } }
  )
  if (!res.ok) return null
  const data = await res.json()
  const passages = data?.data?.passages
  if (!passages?.length) return null
  return passages[0].content
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId      = searchParams.get('book')
  const chapter     = searchParams.get('chapter')
  const ref         = searchParams.get('ref')
  const translation = (searchParams.get('translation') ?? 'ESV').toUpperCase()

  if (!bookId || !chapter || !ref) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  // ESV: always fetch fresh, never cache
  if (translation === 'ESV') {
    const text = await fetchESV(ref)
    if (!text) return NextResponse.json({ error: 'Could not fetch ESV text' }, { status: 502 })
    return NextResponse.json({ text, cached: false })
  }

  // All other translations: check Supabase cache first
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
    return NextResponse.json({ text: cached.text, cached: true })
  }

  // Fetch fresh from API.Bible
  const text = await fetchApiBible(ref, translation)
  if (!text) {
    return NextResponse.json({ error: `Could not fetch ${translation} text` }, { status: 502 })
  }

  // Upsert into Supabase cache
  await supabase.from('passages').upsert({
    book_id:     bookId,
    chapter:     parseInt(chapter),
    ref,
    text,
    translation,
    fetched_at:  new Date().toISOString(),
  }, { onConflict: 'book_id,ref,translation' })

  return NextResponse.json({ text, cached: false })
}
