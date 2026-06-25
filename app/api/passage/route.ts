import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/passage?book=john&chapter=1&ref=John+1:1-18&translation=ESV
// Checks Supabase cache first, then fetches from the appropriate API.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// API.Bible Bible IDs for each translation
// Find more at https://scripture.api.bible/lifechange/bibles
const BIBLE_IDS: Record<string, string> = {
  KJV: 'de4e12af7f28f599-02', // King James Version
}

async function fetchFromESV(ref: string): Promise<string | null> {
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

async function fetchFromApiBible(ref: string, translation: string): Promise<string | null> {
  const key = process.env.BIBLE_API_KEY
  const bibleId = BIBLE_IDS[translation]
  if (!key || !bibleId) return null

  // API.Bible uses a specific passage ID format, e.g. JHN.1.1-JHN.1.18
  // We pass the human-readable ref and let it search
  const res = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(ref)}&limit=1`,
    { headers: { 'api-key': key } }
  )
  if (!res.ok) return null
  const data = await res.json()

  // Extract plain text from response
  const passages = data?.data?.passages
  if (!passages?.length) return null
  return passages[0].content
    .replace(/<[^>]+>/g, '')   // strip HTML tags
    .replace(/\s+/g, ' ')
    .trim()
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId      = searchParams.get('book')
  const chapter     = searchParams.get('chapter')
  const ref         = searchParams.get('ref')
  const translation = searchParams.get('translation') ?? 'ESV'

  if (!bookId || !chapter || !ref) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  // 1. Check cache
  const { data: cached } = await supabase
    .from('passages')
    .select('text')
    .eq('book_id', bookId)
    .eq('ref', ref)
    .eq('translation', translation)
    .single()

  if (cached?.text) {
    return NextResponse.json({ text: cached.text, cached: true })
  }

  // 2. Fetch from appropriate API
  let text: string | null = null

  if (translation === 'ESV') {
    text = await fetchFromESV(ref)
  } else {
    text = await fetchFromApiBible(ref, translation)
  }

  if (!text) {
    return NextResponse.json({ error: `Could not fetch ${translation} text for ${ref}` }, { status: 502 })
  }

  // 3. Cache in Supabase
  await supabase.from('passages').insert({
    book_id: bookId,
    chapter: parseInt(chapter),
    ref,
    text,
    translation,
  })

  return NextResponse.json({ text, cached: false })
}
