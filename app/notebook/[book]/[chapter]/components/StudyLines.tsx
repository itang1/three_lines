'use client'
import { useLayoutEffect, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { NOTE_MAX_LENGTH, type Track } from '../types'

type Props = {
  pKey: string
  label: string
  tracks: Track[]
  notes: Record<string, string>
  handleNoteChange: (passageRef: string, trackId: string, value: string) => void
  user: User | null
  chunkHasNotes: boolean
  isChunkPublic: boolean
  confirmDelete: string | null
  setConfirmDelete: (key: string | null) => void
  deleteChunkNotes: (passageRef: string) => void
  toggleNoteVisibility: (passageRef: string) => void
}

// Textarea that grows to fit its content, including content loaded after mount.
// The resize runs in a layout effect keyed on `value`, so a saved note longer
// than one line is shown in full on load, not just after the user types.
function AutoTextarea({
  value, onChange, ...rest
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])
  return <textarea ref={ref} value={value} onChange={onChange} rows={1} {...rest} />
}

// Study-mode note lines for one passage chunk: one textarea per active track,
// plus the delete + share-with-community footer.
export default function StudyLines({
  pKey, label, tracks, notes, handleNoteChange,
  user, chunkHasNotes, isChunkPublic,
  confirmDelete, setConfirmDelete, deleteChunkNotes, toggleNoteVisibility,
}: Props) {
  return (
    <div className="border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-lg overflow-hidden">
      {tracks.map((t, i) => {
        const noteKey = `${pKey}|${t.id}`
        return (
          <div
            key={t.id}
            className={`flex items-start ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
          >
            <div className="w-36 flex-shrink-0 flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 self-stretch gap-1.5">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.dot }} />
              <span className="text-xs font-medium text-gray-500 leading-tight">{t.label}</span>
            </div>
            <AutoTextarea
              aria-label={`${t.label}, ${label}`}
              className="flex-1 text-base p-2.5 outline-none resize-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 min-h-[42px] overflow-hidden"
              placeholder={t.placeholder}
              value={notes[noteKey] ?? ''}
              maxLength={NOTE_MAX_LENGTH}
              onChange={e => handleNoteChange(pKey, t.id, e.target.value)}
            />
          </div>
        )
      })}
      {user && (
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 bg-gray-50/50 dark:bg-gray-800/20">
          {chunkHasNotes ? (
            confirmDelete === pKey ? (
              <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                Delete these notes?
                <button
                  onClick={() => deleteChunkNotes(pKey)}
                  className="font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(pKey)}
                aria-label={`Delete your notes for ${label}`}
                className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            )
          ) : <span />}
          <button
            onClick={() => toggleNoteVisibility(pKey)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isChunkPublic
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                : 'bg-white border-gray-200 text-gray-500 dark:bg-transparent dark:border-gray-700 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
              isChunkPublic ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`} />
            {isChunkPublic ? 'Shared with community' : 'Share with community'}
          </button>
        </div>
      )}
      {!user && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800/30 text-xs text-amber-700 dark:text-amber-400">
          <a href="/login" className="underline">Sign in</a> to save your notes.
        </div>
      )}
    </div>
  )
}
