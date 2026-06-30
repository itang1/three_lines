'use client'
import type { Dispatch, SetStateAction } from 'react'
import type { User } from '@supabase/supabase-js'
import { TRACKS } from '@/lib/books-index'
import ReportButton from '@/components/ReportButton'
import { THEME_DOT, type CommunityNote, type Reply } from '../types'

type Props = {
  pKey: string
  chunkCommunityNotes: CommunityNote[]
  themeLabel: string
  user: User | null
  myNoteIds: Set<string>
  openThreads: Set<string>
  replies: Record<string, Reply[]>
  toggleThread: (id: string) => void
  replyText: Record<string, string>
  setReplyText: Dispatch<SetStateAction<Record<string, string>>>
  postReply: (parentId: string, passageRef: string) => void
}

// Community-mode view for one passage chunk: public notes with expandable
// reply threads.
export default function CommunityThread({
  pKey, chunkCommunityNotes, themeLabel, user, myNoteIds,
  openThreads, replies, toggleThread, replyText, setReplyText, postReply,
}: Props) {
  return (
    <div className="border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-lg overflow-hidden bg-white dark:bg-gray-900">
      {chunkCommunityNotes.length === 0 ? (
        <div className="px-4 py-4 text-xs text-gray-400 italic">
          No community notes yet for this passage.
        </div>
      ) : chunkCommunityNotes.map(note => {
        const track       = note.track_id === 'theme'
          ? { label: themeLabel || 'Theme', dot: THEME_DOT }
          : TRACKS.find(t => t.id === note.track_id)
        const isOpen      = openThreads.has(note.id)
        const noteReplies = replies[note.id] ?? []
        const initials    = note.profiles?.display_name
          ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

        return (
          <div key={note.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                {initials}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{note.profiles?.display_name}</span>
              {track && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: track.dot + '18', color: track.dot }}>
                  {track.label}
                </span>
              )}
              <span className="text-[10px] text-gray-400 ml-auto">
                {note.updated_at ? new Date(note.updated_at).toLocaleDateString() : ''}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8 mb-2">{note.content}</p>
            <div className="ml-8 flex items-center gap-3">
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
                {user && (
                  <div className="flex gap-2 pt-2">
                    <input
                      className="flex-1 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Write a reply..."
                      value={replyText[note.id] ?? ''}
                      onChange={e => setReplyText(prev => ({ ...prev, [note.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && postReply(note.id, pKey)}
                    />
                    <button
                      onClick={() => postReply(note.id, pKey)}
                      className="text-xs px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-200"
                    >
                      Post
                    </button>
                  </div>
                )}
                {!user && (
                  <p className="text-xs text-gray-400 pt-2">
                    <a href="/login" className="underline">Sign in</a> to reply.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
