import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const RATE_LIMIT_PER_HOUR = 20

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { note_id, reason } = await req.json().catch(() => ({}))
  if (!note_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (reason != null && (typeof reason !== 'string' || reason.length > 1000)) {
    return NextResponse.json({ error: 'Invalid reason' }, { status: 400 })
  }

  // Only public notes are visible to others, so only those can be reported.
  const { data: note } = await supabase
    .from('notes')
    .select('id, is_public')
    .eq('id', note_id)
    .single()
  if (!note || !note.is_public) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Rate limit: max RATE_LIMIT_PER_HOUR reports per user per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('reporter_id', user.id)
    .gt('created_at', oneHourAgo)

  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // Upsert so re-reporting refreshes the existing row rather than failing.
  const { error: upsertError } = await supabase.from('reports').upsert({
    note_id,
    reporter_id: user.id,
    reason: (reason ?? '').trim(),
    status: 'pending',
    created_at: new Date().toISOString(),
  }, { onConflict: 'note_id,reporter_id' })

  if (upsertError) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
