'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BOOKS, TRACKS } from '@/lib/data'

type Report = {
  id: string
  reason: string
  created_at: string
  reporter: { display_name: string } | null
  note: {
    id: string
    passage_ref: string
    track_id: string
    content: string
    user_id: string
    profiles: { display_name: string } | null
  } | null
}

// Reports grouped under the note they target.
type Group = {
  note: NonNullable<Report['note']>
  reports: Report[]
}

function passageLabel(ref: string) {
  const [bookId, chapter, ...rest] = ref.split(':')
  const book = BOOKS.find(b => b.id === bookId)
  return `${book?.name ?? bookId} ${chapter}:${rest.join(':')}`
}

function trackLabel(trackId: string) {
  return TRACKS.find(t => t.id === trackId)?.label ?? trackId
}

export default function AdminClient() {
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<'loading' | 'forbidden' | 'ready'>('loading')
  const [groups, setGroups] = useState<Group[]>([])
  const [acting, setActing] = useState<string | null>(null)

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.replace('/login'); return }

    const res = await fetch('/api/admin/reports', {
      headers: { 'Authorization': `Bearer ${session.access_token}` },
    })
    if (res.status === 403) { setState('forbidden'); return }
    if (!res.ok) { setState('ready'); setGroups([]); return }

    const { reports } = await res.json() as { reports: Report[] }
    const byNote = new Map<string, Group>()
    for (const r of reports) {
      if (!r.note) continue
      const existing = byNote.get(r.note.id)
      if (existing) existing.reports.push(r)
      else byNote.set(r.note.id, { note: r.note, reports: [r] })
    }
    setGroups([...byNote.values()])
    setState('ready')
  }

  useEffect(() => { load() }, [])

  const act = async (noteId: string, action: 'remove' | 'dismiss') => {
    setActing(noteId)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.replace('/login'); return }
    const res = await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ action, note_id: noteId }),
    })
    if (res.ok) {
      setGroups(prev => prev.filter(g => g.note.id !== noteId))
    }
    setActing(null)
  }

  if (state === 'loading') {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-sm text-gray-400 animate-pulse">Loading…</div>
  }

  if (state === 'forbidden') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Moderation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">You do not have access to this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-1">Moderation</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Flagged community notes awaiting review.
      </p>

      {groups.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 italic py-8">Nothing to review.</div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ note, reports }) => (
            <div key={note.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{note.profiles?.display_name ?? 'Unknown'}</span>
                <span className="opacity-40">·</span>
                <span>{passageLabel(note.passage_ref)}</span>
                <span className="opacity-40">·</span>
                <span>{trackLabel(note.track_id)}</span>
                <span className="ml-auto text-red-500 font-medium">
                  {reports.length} {reports.length === 1 ? 'report' : 'reports'}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">{note.content}</p>

              <div className="space-y-1 mb-3 border-t border-gray-100 dark:border-gray-800 pt-3">
                {reports.map(r => (
                  <div key={r.id} className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{r.reporter?.display_name ?? 'Anonymous'}</span>
                    {r.reason ? <span>: {r.reason}</span> : <span className="italic opacity-70"> (no reason given)</span>}
                    <span className="opacity-40"> · {new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => act(note.id, 'remove')}
                  disabled={acting === note.id}
                  className="text-xs px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-40"
                >
                  Remove note
                </button>
                <button
                  onClick={() => act(note.id, 'dismiss')}
                  disabled={acting === note.id}
                  className="text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
