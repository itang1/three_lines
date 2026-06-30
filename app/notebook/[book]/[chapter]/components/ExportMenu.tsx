'use client'
import { useState, useEffect, useRef } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import type { Book } from '@/lib/books-index'
import { buildPlainText, buildMarkdown, downloadFile } from '@/lib/exportNotes'

type Props = {
  user: User
  book: Book
  supabase: SupabaseClient<Database>
}

type Format = 'txt' | 'md'

export default function ExportMenu({ user, book, supabase }: Props) {
  const bookId = book.id
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  const [format, setFormat] = useState<Format>('txt')
  const exportRef = useRef<HTMLDivElement>(null)

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
    const title = `Three Lines Notes: ${scope === 'book' ? book.name : 'All Books'}`
    const slug = scope === 'book'
      ? book.name.toLowerCase().replace(/\s+/g, '-')
      : 'three-lines'
    if (format === 'md') {
      downloadFile(buildMarkdown(title, data), `${slug}-notes.md`, 'text/markdown')
    } else {
      downloadFile(buildPlainText(title, data), `${slug}-notes.txt`, 'text/plain')
    }
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
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-1">Format</span>
            {(['txt', 'md'] as Format[]).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                aria-pressed={format === f}
                className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                  format === f
                    ? 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {f === 'txt' ? 'Plain text' : 'Markdown'}
              </button>
            ))}
          </div>
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
