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

// OSIS book codes used by API.Bible passage IDs
const OSIS_CODES: Record<string, string> = {
  Genesis: 'GEN', Exodus: 'EXO', Leviticus: 'LEV', Numbers: 'NUM',
  Deuteronomy: 'DEU', Joshua: 'JOS', Judges: 'JDG', Ruth: 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', Ezra: 'EZR', Nehemiah: 'NEH',
  Esther: 'EST', Job: 'JOB', Psalms: 'PSA', Psalm: 'PSA', Proverbs: 'PRO',
  Ecclesiastes: 'ECC', 'Song of Solomon': 'SNG', Isaiah: 'ISA', Jeremiah: 'JER',
  Lamentations: 'LAM', Ezekiel: 'EZK', Daniel: 'DAN', Hosea: 'HOS',
  Joel: 'JOL', Amos: 'AMO', Obadiah: 'OBA', Jonah: 'JON', Micah: 'MIC',
  Nahum: 'NAH', Habakkuk: 'HAB', Zephaniah: 'ZEP', Haggai: 'HAG',
  Zechariah: 'ZEC', Malachi: 'MAL', Matthew: 'MAT', Mark: 'MRK',
  Luke: 'LUK', John: 'JHN', Acts: 'ACT', Romans: 'ROM',
  '1 Corinthians': '1CO', '2 Corinthians': '2CO', Galatians: 'GAL',
  Ephesians: 'EPH', Philippians: 'PHP', Colossians: 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI',
  '2 Timothy': '2TI', Titus: 'TIT', Philemon: 'PHM', Hebrews: 'HEB',
  James: 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN',
  '2 John': '2JN', '3 John': '3JN', Jude: 'JUD', Revelation: 'REV',
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

// Converts "John 1:1-18" → "JHN.1.1-JHN.1.18" or "Exodus 5" → "EXO.5"
function toApiBiblePassageId(ref: string): string | null {
  const verseMatch = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (verseMatch) {
    const [, bookName, chapter, startVerse, endVerse] = verseMatch
    const code = OSIS_CODES[bookName]
    if (!code) return null
    const start = `${code}.${chapter}.${startVerse}`
    return endVerse ? `${start}-${code}.${chapter}.${endVerse}` : start
  }
  const chapterMatch = ref.match(/^(.+?)\s+(\d+)$/)
  if (chapterMatch) {
    const [, bookName, chapter] = chapterMatch
    const code = OSIS_CODES[bookName]
    if (!code) return null
    return `${code}.${chapter}`
  }
  return null
}

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
    return NextResponse.json({ text, cached: false })
  }

  // Verse-numbers-on: skip cache (Supabase only stores the no-numbers version)
  if (verseNumbers) {
    const text = await fetchApiBible(ref, translation, true)
    if (!text) return NextResponse.json({ error: `Could not fetch ${translation} text` }, { status: 502 })
    return NextResponse.json({ text, cached: false })
  }

  // All other translations, verse numbers off: check Supabase cache first
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

  return NextResponse.json({ text, cached: false })
}
