'use client'
import type { TopPassage } from '../types'

type Props = {
  topPassages: TopPassage[]
  topPassagesLoading: boolean
  goToPassage: (passageRef: string) => void
}

// Most-discussed passages leaderboard (Community → Top scope). Rows arrive
// pre-enriched from /api/top-passages, so no client-side book data is needed.
export default function TopPassages({ topPassages, topPassagesLoading, goToPassage }: Props) {
  return (
    <div className="space-y-2">
      {topPassagesLoading ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 animate-pulse py-8">Loading…</div>
      ) : topPassages.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500 italic py-8">No community notes yet.</div>
      ) : topPassages.map(({ passage_ref, notes, lines, displayRef, pericope }, idx) => (
        <button
          key={passage_ref}
          onClick={() => goToPassage(passage_ref)}
          className="w-full text-left flex items-center gap-3 px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
        >
          <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-5 text-right flex-shrink-0">
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {displayRef}
            </div>
            {pericope && (
              <div className="text-xs text-gray-400 dark:text-gray-500">{pericope}</div>
            )}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 text-right">
            <span className="font-medium text-gray-600 dark:text-gray-300">{notes}</span> {notes === 1 ? 'note' : 'notes'}
            <span className="mx-1 opacity-40">·</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{lines}</span> {lines === 1 ? 'line' : 'lines'}
          </span>
        </button>
      ))}
    </div>
  )
}
