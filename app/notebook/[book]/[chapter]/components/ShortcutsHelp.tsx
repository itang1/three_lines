'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// Keyboard shortcuts live in useChapterScroll. This component documents them:
// a "?" trigger button plus a "?" key that opens the same overlay. Desktop only,
// since the shortcuts need a physical keyboard.
const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['j', '→'], label: 'Next chapter' },
  { keys: ['k', '←'], label: 'Previous chapter' },
  { keys: ['/'], label: 'Jump to book selector' },
  { keys: ['t'], label: 'Cycle translation' },
  { keys: ['?'], label: 'Show this help' },
]

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === '?') { e.preventDefault(); setOpen(v => !v) }
      else if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
        className="hidden md:inline-flex items-center justify-center w-6 h-6 rounded border border-gray-200 dark:border-gray-700 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
      >
        ?
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 dark:bg-black/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 w-full max-w-xs"
          >
            <h2 id="shortcuts-title" className="text-base font-serif font-medium text-gray-900 dark:text-gray-100 mb-4">
              Keyboard shortcuts
            </h2>
            <dl className="space-y-2.5">
              {SHORTCUTS.map(s => (
                <div key={s.label} className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">{s.label}</dt>
                  <dd className="flex gap-1">
                    {s.keys.map(k => (
                      <kbd
                        key={k}
                        className="min-w-[1.5rem] text-center px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {k}
                      </kbd>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
