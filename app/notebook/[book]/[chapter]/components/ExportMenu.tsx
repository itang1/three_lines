'use client'
import { useState, useEffect, useRef } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { TRACKS, getBookMeta, type Book } from '@/lib/books-index'

type Props = {
  user: User
  book: Book
  supabase: SupabaseClient<Database>
}

// Sidebar "Export notes" control: a dropdown offering the current book or all
// books, downloaded as a plain-text file built from the user's saved notes.
export default function ExportMenu({ user, book, supabase }: Props) {
  const bookId = book.id
  const [exportOpen, setExportOpen]       = useState(false)
  const [exporting, setExporting]         = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  const exportRef = useRef<HTMLDivElement>(null)

  // Close on click-outside or Escape, and clear any stale message when closed.
  useEffect(() => {
    if (!exportOpen) { setExportMessage(''); return }
    const onPointerDown = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setExportOpen(false) }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [exportOpen])

  const exportNotes = async (scope: 'book' | 'all') => {
    setExporting(true)
    const base = supabase.from('notes')
      .select('passage_ref, track_id, content')
      .eq('user_id', user.id)
      .neq('content', '')
      .order('passage_ref')
    const { data, error } = await (scope === 'book' ? base.like('passage_ref', `${bookId}:%`) : base)
    setExporting(false)
    if (error) {
      console.error('[three-lines] export query failed:', error)
      setExportMessage('Export failed. Please try again.')
      return
    }
    if (!data || data.length === 0) {
      setExportMessage(scope === 'book'
        ? `No notes yet for ${book.name}.`
        : 'No notes yet in any book.')
      return
    }
    setExportOpen(false)
    const lines: string[] = [
      `Three Lines Notes: ${scope === 'book' ? book.name : 'All Books'}`,
      `Exported ${new Date().toLocaleDateString()}`,
      '',
    ]
    let lastRef = ''
    data.forEach(note => {
      const parts = note.passage_ref.split(':')
      const rBook = getBookMeta(parts[0])
      const track = TRACKS.find(t => t.id === note.track_id)
      if (note.passage_ref !== lastRef) {
        if (lastRef) lines.push('')
        lines.push(`--- ${rBook?.name ?? parts[0]} ${parts[1]}:${parts.slice(2).join(':')} ---`)
        lastRef = note.passage_ref
      }
      lines.push(`[${track?.label ?? note.track_id}]`)
      lines.push(note.content)
    })
    const text = lines.join('\n')
    const filename = scope === 'book'
      ? `${book.name.toLowerCase().replace(/\s+/g, '-')}-notes.txt`
      : 'three-lines-notes.txt'
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div ref={exportRef} className="border-t border-gray-100 dark:border-gray-800 flex-shrink-0 relative">
      <button
        onClick={() => setExportOpen(v => !v)}
        aria-expanded={exportOpen}
        aria-haspopup="menu"
        className="w-full text-left px-3 py-2.5 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        ↓ Export notes
      </button>
      {exportOpen && (
        <div role="menu" className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md">
          <button
            role="menuitem"
            onClick={() => exportNotes('book')}
            disabled={exporting}
            className="w-full text-left px-3 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 disabled:opacity-40"
          >
            {book.name}
          </button>
          <button
            role="menuitem"
            onClick={() => exportNotes('all')}
            disabled={exporting}
            className="w-full text-left px-3 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            All books
          </button>
          {exportMessage && (
            <p role="status" className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
              {exportMessage}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
