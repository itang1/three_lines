'use client'
import { useRef, useState, useEffect } from 'react'
import { BOOKS_INDEX, type BookMeta } from '@/lib/books-index'

type Props = {
  bookId: string
  bookChapters: Record<string, Set<number>>
  onChange: (bookId: string) => void
  selectRef?: React.RefObject<HTMLButtonElement>
}

function MiniBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="w-full h-0.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-violet-400 dark:bg-violet-500 rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const OT = BOOKS_INDEX.filter(b => b.testament === 'OT')
const NT = BOOKS_INDEX.filter(b => b.testament === 'NT')

export default function BookPicker({ bookId, bookChapters, onChange, selectRef }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const current = BOOKS_INDEX.find(b => b.id === bookId)
  const currentDone = bookChapters[bookId]?.size ?? 0
  const currentTotal = current?.chapterCount ?? 1

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const select = (id: string) => {
    setOpen(false)
    if (id !== bookId) onChange(id)
  }

  const BookRow = ({ b }: { b: BookMeta }) => {
    const done = bookChapters[b.id]?.size ?? 0
    const isActive = b.id === bookId
    return (
      <button
        key={b.id}
        onClick={() => select(b.id)}
        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
          isActive ? 'bg-violet-50 dark:bg-violet-950' : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className={`text-[11px] truncate ${
              isActive
                ? 'font-semibold text-violet-800 dark:text-violet-300'
                : done > 0
                  ? 'font-medium text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-600'
            }`}>
              {b.name}
            </span>
            {done > 0 && (
              <span className={`text-[9px] flex-shrink-0 tabular-nums ${
                isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {done}/{b.chapterCount}
              </span>
            )}
          </div>
          {done > 0 && <MiniBar done={done} total={b.chapterCount} />}
        </div>
      </button>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={selectRef}
        onClick={() => setOpen(v => !v)}
        aria-label={`Current book: ${current?.name ?? bookId}. Click to change.`}
        aria-expanded={open}
        className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-left hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium truncate">{current?.name ?? bookId}</span>
          <span className="text-gray-400 dark:text-gray-500 ml-1 text-[10px] tabular-nums flex-shrink-0">
            {currentDone > 0 ? `${currentDone}/${currentTotal}` : ''}
            {' '}▾
          </span>
        </div>
        <MiniBar done={currentDone} total={currentTotal} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Old Testament</span>
          </div>
          {OT.map(b => <BookRow key={b.id} b={b} />)}
          <div className="px-3 py-1.5 border-t border-b border-gray-100 dark:border-gray-800">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">New Testament</span>
          </div>
          {NT.map(b => <BookRow key={b.id} b={b} />)}
        </div>
      )}
    </div>
  )
}
