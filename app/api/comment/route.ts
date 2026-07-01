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

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const { passage_ref, track_id, content, parent_id } = body
  // Validate the type before calling string methods so a non-string content
  // returns a clean 400 rather than throwing a 500.
  if (!passage_ref || !track_id || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  // Cap length so a single comment cannot store/broadcast an unbounded payload.
  // Mirrors NOTE_MAX_LENGTH (5000) and the comments DB check constraint.
  if (content.trim().length > 5000) {
    return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
  }

  // Rate limit: max RATE_LIMIT_PER_HOUR comments per user per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gt('created_at', oneHourAgo)

  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const { data: inserted, error: insertError } = await supabase.from('comments').insert({
    user_id: user.id,
    passage_ref,
    track_id,
    content: content.trim(),
    parent_id: parent_id ?? null,
  }).select('id').single()

  if (insertError) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })

  if (parent_id && inserted) {
    createInAppNotification(parent_id, user.id, passage_ref, inserted.id).catch(console.error)
    notifyReplyAuthor(parent_id, user.id, passage_ref, content.trim()).catch(console.error)
  }

  return NextResponse.json({ ok: true })
}

async function createInAppNotification(
  parentNoteId: string,
  replierId: string,
  passageRef: string,
  commentId: string,
) {
  // parent_id is the ID of a note in the `notes` table
  const { data: note } = await supabase.from('notes')
    .select('user_id')
    .eq('id', parentNoteId)
    .single()

  if (!note || note.user_id === replierId) return

  await supabase.from('notifications').insert({
    user_id: note.user_id,
    comment_id: commentId,
    passage_ref: passageRef,
  })
}

async function notifyReplyAuthor(
  parentId: string,
  replierId: string,
  passageRef: string,
  replyContent: string,
) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.log('Reply notification skipped (no RESEND_API_KEY):', { parentId, replierId })
    return
  }

  const { data: parent } = await supabase
    .from('comments')
    .select('user_id, content')
    .eq('id', parentId)
    .single()

  if (!parent || parent.user_id === replierId) return

  const [{ data: { user: parentUser } }, { data: replierProfile }] = await Promise.all([
    supabase.auth.admin.getUserById(parent.user_id),
    supabase.from('profiles').select('display_name').eq('id', replierId).single(),
  ])

  if (!parentUser?.email) return

  const replierName = replierProfile?.display_name ?? 'Someone'
  // passage_ref is "book:chapter:chunkRef"; the route is /notebook/[book]/[chapter].
  // Append the chapter anchor so the link lands on the right section in long books.
  const [bookId, chapter] = passageRef.split(':')
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://three-lines-sepia.vercel.app'}/notebook/${bookId}/${chapter}#chapter-${chapter}`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Three Lines <onboarding@resend.dev>',
      to: parentUser.email,
      subject: `${replierName} replied to your note`,
      text: `${replierName} replied to your note on ${passageRef}:\n\n"${replyContent}"\n\n${url}`,
    }),
  })
}
