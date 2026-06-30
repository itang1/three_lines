import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getBook, getChapter } from '@/lib/data'

// Aggregates the most-discussed passages and enriches each with display info
// (book name, ESV ref, pericope). The enrichment uses lib/data, which is
// server-only, so the full pericope dataset never reaches the browser.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET() {
  const { data, error } = await supabase.rpc('top_passages', { p_limit: 30 })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  type Row = { passage_ref: string; notes: number; lines: number }
  const rows = ((data ?? []) as Row[]).map(r => {
    const parts = r.passage_ref.split(':')
    const bookId = parts[0]
    const chapter = parseInt(parts[1]) || 1
    const chunkRef = parts.slice(2).join(':')
    const chunk = getChapter(bookId, chapter)?.chunks.find(c => c.ref === chunkRef)
    const bookName = getBook(bookId)?.name ?? bookId
    return {
      passage_ref: r.passage_ref,
      bookId,
      chapter,
      notes: Number(r.notes),
      lines: Number(r.lines),
      displayRef: chunk?.esvRef ?? `${bookName} ${parts.slice(1).join(':')}`,
      pericope: chunk?.pericope ?? '',
    }
  })

  return NextResponse.json({ rows })
}
