import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Resolves the request to an admin user, or null if not authorized.
async function requireAdmin(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return profile?.is_admin ? user : null
}

export async function GET(req: Request) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('reports')
    .select(`
      id,
      reason,
      created_at,
      reporter:profiles!reports_reporter_id_fkey(display_name),
      note:notes!reports_note_id_fkey(id, passage_ref, track_id, content, user_id, profiles(display_name))
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ reports: data ?? [] })
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action, note_id } = await req.json()
  if (!note_id) return NextResponse.json({ error: 'Missing note_id' }, { status: 400 })

  if (action === 'remove') {
    // Deleting the note cascades to its reports.
    const { error } = await supabase.from('notes').delete().eq('id', note_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'dismiss') {
    // Clear every pending report for this note in one action.
    const { error } = await supabase
      .from('reports')
      .update({ status: 'dismissed' })
      .eq('note_id', note_id)
      .eq('status', 'pending')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
