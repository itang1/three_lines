'use client'
import { TRACKS } from '@/lib/books-index'
import { THEME_DOT } from '../types'

type Props = {
  activeTracks: Set<string>
  toggleTrack: (id: string) => void
  themeLabel: string
  themeInput: string
  setThemeInput: (v: string) => void
  editingTheme: boolean
  setEditingTheme: (v: boolean) => void
  saveTheme: (label: string) => void
}

export default function TrackPills({
  activeTracks, toggleTrack,
  themeLabel, themeInput, setThemeInput,
  editingTheme, setEditingTheme, saveTheme,
}: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap mb-8">
      {TRACKS.map(t => (
        <button
          key={t.id}
          onClick={() => toggleTrack(t.id)}
          aria-pressed={activeTracks.has(t.id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors ${
            activeTracks.has(t.id)
              ? 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'
              : 'border-gray-200 text-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: t.dot }} />
          {t.label}
        </button>
      ))}

      {editingTheme ? (
        <form
          onSubmit={e => { e.preventDefault(); saveTheme(themeInput) }}
          className="flex items-center gap-1.5"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">My line:</span>
          <input
            autoFocus
            type="text"
            value={themeInput}
            onChange={e => setThemeInput(e.target.value)}
            placeholder="name it (e.g. covenant)"
            maxLength={40}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1 outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-40 focus:border-gray-500 dark:focus:border-gray-400"
          />
          <button type="submit" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-1" title="Save">✓</button>
          <button type="button" onClick={() => { setEditingTheme(false); setThemeInput(themeLabel) }} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1" title="Cancel">✕</button>
        </form>
      ) : themeLabel ? (
        <button
          onClick={() => toggleTrack('theme')}
          aria-pressed={activeTracks.has('theme')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors ${
            activeTracks.has('theme')
              ? 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'
              : 'border-gray-200 text-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: THEME_DOT }} />
          {themeLabel}
          <span
            role="button"
            aria-label="Edit theme"
            onClick={e => { e.stopPropagation(); setThemeInput(themeLabel); setEditingTheme(true) }}
            className="ml-0.5 text-[10px] opacity-40 hover:opacity-100 transition-opacity"
          >✎</span>
        </button>
      ) : (
        <button
          onClick={() => { setThemeInput(''); setEditingTheme(true) }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          + create your own line
        </button>
      )}
    </div>
  )
}
