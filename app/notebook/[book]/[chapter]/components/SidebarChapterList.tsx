'use client'
import { TRACKS, getBookMeta, type Book } from '@/lib/books-index'
import type { User } from '@supabase/supabase-js'
import type { SearchResult } from '../types'

type Props = {
  searchQuery: string
  searchLoading: boolean
  searchResults: SearchResult[]
  user: User | null
  book: Book
  activeChapter: number
  chaptersWithNotesLive: Set<number>
  passageTexts: Record<string, string>
  translation: string
  showVerseNumbers: boolean
  goToResult: (passageRef: string) => void
  scrollToChapter: (ch: number) => void
}

export default function SidebarChapterList({
  searchQuery, searchLoading, searchResults, user,
  book, activeChapter, chaptersWithNotesLive,
  passageTexts, translation, showVerseNumbers,
  goToResult, scrollToChapter,
}: Props) {
  if (searchQuery.trim()) {
    if (searchLoading) {
      return <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 animate-pulse">Searching…</div>
    }
    if (!user) {
      return (
        <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 italic">
          <a href="/login" className="underline">Sign in</a> to search your notes.
        </div>
      )
    }
    if (searchResults.length === 0) {
      return <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 italic">No notes found.</div>
    }
    return (
      <>
        {searchResults.map(r => {
          const parts = r.passage_ref.split(':')
          const rBook = getBookMeta(parts[0])
          const rTrack = TRACKS.find(t => t.id === r.track_id)
          const q = searchQuery.trim().toLowerCase()
          const ci = r.content.toLowerCase().indexOf(q)
          const start = Math.max(0, ci - 20)
          const snippet = r.content.slice(start, ci + q.length + 60)
          return (
            <button
              key={`${r.passage_ref}|${r.track_id}`}
              onClick={() => goToResult(r.passage_ref)}
              className="w-full text-left px-3 py-2.5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-[10px] font-medium text-gray-700 dark:text-gray-200 mb-0.5">
                {rBook?.name ?? parts[0]} {parts[1]}:{parts.slice(2).join(':')}
              </div>
              {rTrack && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: rTrack.dot }} />
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">{rTrack.label}</span>
                </div>
              )}
              <div className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug line-clamp-2">
                {start > 0 ? '…' : ''}{snippet.trim()}{r.content.length > start + snippet.length ? '…' : ''}
              </div>
            </button>
          )
        })}
      </>
    )
  }

  return (
    <>
      {book.chapters.map(ch => {
        const isActive = activeChapter === ch.ch
        const hasNotes = chaptersWithNotesLive.has(ch.ch)
        const firstChunk = ch.chunks[0]
        const cacheKey = firstChunk
          ? `${firstChunk.esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
          : ''
        const subtitle = firstChunk?.pericope
          || (passageTexts[cacheKey] ?? '')
              .replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 50)

        return (
          <button
            key={ch.ch}
            onClick={() => scrollToChapter(ch.ch)}
            className={`w-full text-left py-2.5 border-b border-gray-50 dark:border-gray-800 transition-colors flex gap-2.5 items-start ${
              isActive
                ? 'bg-violet-100 dark:bg-violet-950 border-l-2 border-l-violet-500 dark:border-l-violet-400 pl-2.5 pr-3'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 pl-3 pr-3 border-l-2 border-l-transparent'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 transition-colors ${
              hasNotes ? 'bg-gray-400 dark:bg-gray-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
            <div className="min-w-0">
              <div className={`text-xs font-medium leading-tight mb-0.5 ${
                isActive ? 'text-violet-900 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Chapter {ch.ch}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug line-clamp-2">
                {subtitle}
              </div>
            </div>
          </button>
        )
      })}
    </>
  )
}
