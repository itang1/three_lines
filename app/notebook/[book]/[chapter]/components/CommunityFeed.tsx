'use client'
import type { User } from '@supabase/supabase-js'
import { BOOKS, TRACKS } from '@/lib/data'
import ReportButton from '@/components/ReportButton'
import { THEME_DOT, type CommunityNote } from '../types'

type Props = {
  allNotes: CommunityNote[]
  activeTracks: Set<string>
  themeLabel: string
  user: User | null
  myNoteIds: Set<string>
  allNotesLoading: boolean
  allNotesHasMore: boolean
  loadMoreAllNotes: () => void
  goToPassage: (bookId: string, chapter: number) => void
}

// Cross-book community feed (Community → Feed scope).
export default function CommunityFeed({
  allNotes, activeTracks, themeLabel, user, myNoteIds,
  allNotesLoading, allNotesHasMore, loadMoreAllNotes, goToPassage,
}: Props) {
  const visible = allNotes.filter(n => activeTracks.has(n.track_id))

  return (
    <div className="space-y-3">
      {allNotesLoading && allNotes.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 animate-pulse py-8">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 italic py-8">No community notes yet.</div>
      ) : (
        <>
          {visible.map(note => {
            const parts = note.passage_ref.split(':')
            const noteBookId = parts[0]
            const noteChapter = parseInt(parts[1]) || 1
            const noteBook    = BOOKS.find(b => b.id === noteBookId)
            const track = note.track_id === 'theme'
              ? { label: themeLabel || 'Theme', dot: THEME_DOT }
              : TRACKS.find(t => t.id === note.track_id)
            const initials = note.profiles?.display_name
              ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
            return (
              <div key={note.id} className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{note.profiles?.display_name}</span>
                  {track && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: track.dot + '18', color: track.dot }}>
                      {track.label}
                    </span>
                  )}
                  <button
                    onClick={() => goToPassage(noteBookId, noteChapter)}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 ml-auto"
                  >
                    {noteBook?.name ?? noteBookId} {parts[1]}:{parts.slice(2).join(':')} →
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8">{note.content}</p>
                {user && !myNoteIds.has(note.id) && (
                  <div className="ml-8 mt-2">
                    <ReportButton noteId={note.id} />
                  </div>
                )}
              </div>
            )
          })}
          {allNotesHasMore && (
            <button
              onClick={loadMoreAllNotes}
              disabled={allNotesLoading}
              className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {allNotesLoading ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
