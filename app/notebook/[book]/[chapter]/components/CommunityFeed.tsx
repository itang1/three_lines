'use client'
import type { Dispatch, SetStateAction } from 'react'
import type { User } from '@supabase/supabase-js'
import { getBookMeta, TRACKS } from '@/lib/books-index'
import ReportButton from '@/components/ReportButton'
import { THEME_DOT, NOTE_MAX_LENGTH, type CommunityNote, type Reply } from '../types'

type Props = {
  allNotes: CommunityNote[]
  activeTracks: Set<string>
  themeLabel: string
  user: User | null
  myNoteIds: Set<string>
  allNotesLoading: boolean
  allNotesHasMore: boolean
  loadMoreAllNotes: () => void
  goToPassage: (passageRef: string) => void
  openThreads: Set<string>
  replies: Record<string, Reply[]>
  toggleThread: (id: string) => void
  replyText: Record<string, string>
  setReplyText: Dispatch<SetStateAction<Record<string, string>>>
  postReply: (parentId: string, passageRef: string) => void
}

// Cross-book community feed (Community → Feed scope).
export default function CommunityFeed({
  allNotes, activeTracks, themeLabel, user, myNoteIds,
  allNotesLoading, allNotesHasMore, loadMoreAllNotes, goToPassage,
  openThreads, replies, toggleThread, replyText, setReplyText, postReply,
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
            const noteBook    = getBookMeta(noteBookId)
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
                    onClick={() => goToPassage(note.passage_ref)}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 ml-auto"
                  >
                    {noteBook?.name ?? noteBookId} {parts[1]}:{parts.slice(2).join(':')} →
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8">{note.content}</p>
                {(() => {
                  const isOpen = openThreads.has(note.id)
                  const noteReplies = replies[note.id] ?? []
                  return (
                    <>
                      <div className="ml-8 mt-2 flex items-center gap-3">
                        <button
                          className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => toggleThread(note.id)}
                        >
                          {isOpen
                            ? 'Hide replies'
                            : noteReplies.length > 0
                              ? `${noteReplies.length} repl${noteReplies.length === 1 ? 'y' : 'ies'}`
                              : 'Reply'}
                        </button>
                        {user && !myNoteIds.has(note.id) && <ReportButton noteId={note.id} />}
                      </div>
                      {isOpen && (
                        <div className="ml-8 mt-3 pl-3 border-l border-gray-100 dark:border-gray-800">
                          {noteReplies.map(r => (
                            <div key={r.id} className="py-2 border-b border-gray-50 dark:border-gray-800 last:border-b-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{r.profiles?.display_name}</span>
                                <span className="text-[10px] text-gray-400">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">{r.content}</p>
                            </div>
                          ))}
                          {user ? (
                            <div className="flex gap-2 pt-2">
                              <input
                                className="flex-1 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                placeholder="Write a reply..."
                                value={replyText[note.id] ?? ''}
                                maxLength={NOTE_MAX_LENGTH}
                                onChange={e => setReplyText(prev => ({ ...prev, [note.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && postReply(note.id, note.passage_ref)}
                              />
                              <button
                                onClick={() => postReply(note.id, note.passage_ref)}
                                className="text-xs px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-200"
                              >
                                Post
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 pt-2">
                              <a href="/login" className="underline">Sign in</a> to reply.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )
                })()}
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
