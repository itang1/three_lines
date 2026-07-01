'use client'
import { TRACKS, getBookMeta, type Book } from '@/lib/books-index'
import type { User } from '@supabase/supabase-js'
import { passageKey, type SearchResult } from '../types'

type Props = {
  searchQuery: string
  searchLoading: boolean
  searchResults: SearchResult[]
  user: User | null
  book: Book
  bookId: string
  activeChapter: number
  activeChunk: string | null
  chaptersWithNotesLive: Set<number>
  bookmarks: Set<string>
  bookmarkedChapters: Set<number>
  passageTexts: Record<string, string>
  translation: string
  showVerseNumbers: boolean
  goToResult: (passageRef: string) => void
  scrollToChapter: (ch: number) => void
  scrollToPassage: (passageRef: string) => boolean
}

function BookmarkRibbon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export default function SidebarChapterList({
  searchQuery, searchLoading, searchResults, user,
  book, bookId, activeChapter, activeChunk, chaptersWithNotesLive,
  bookmarks, bookmarkedChapters,
  passageTexts, translation, showVerseNumbers,
  goToResult, scrollToChapter, scrollToPassage,
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

  // Bookmarks for this book, sorted by chapter then passage ref
  const bookmarkList = Array.from(bookmarks).sort()

  return (
    <>
      {bookmarkList.length > 0 && (
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5">
            <BookmarkRibbon filled />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Bookmarks
            </span>
          </div>
          {bookmarkList.map(passageRef => {
            const parts = passageRef.split(':')
            const chNum = parts[1]
            const verseRef = parts.slice(2).join(':')
            return (
              <button
                key={passageRef}
                onClick={() => scrollToPassage(passageRef)}
                className="w-full text-left px-3 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center gap-2"
              >
                <BookmarkRibbon filled />
                <span className="text-[10px] text-gray-700 dark:text-gray-300 truncate">
                  Ch {chNum}{verseRef ? ` · ${verseRef}` : ''}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {book.chapters.map(ch => {
        const isActive = activeChapter === ch.ch
        const hasNotes = chaptersWithNotesLive.has(ch.ch)
        const hasBookmark = bookmarkedChapters.has(ch.ch)
        const firstChunk = ch.chunks[0]
        const cacheKey = firstChunk
          ? `${firstChunk.esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
          : ''
        const subtitle = firstChunk?.pericope
          || (passageTexts[cacheKey] ?? '')
              .replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 50)

        return (
          <div key={ch.ch} className="border-b border-gray-50 dark:border-gray-800">
            <button
              onClick={() => scrollToChapter(ch.ch)}
              className={`w-full text-left py-2.5 transition-colors flex gap-2.5 items-start ${
                isActive
                  ? 'bg-violet-100 dark:bg-violet-950 border-l-2 border-l-violet-500 dark:border-l-violet-400 pl-2.5 pr-3'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 pl-3 pr-3 border-l-2 border-l-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 transition-colors ${
                hasNotes ? 'bg-gray-400 dark:bg-gray-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-medium leading-tight mb-0.5 flex items-center gap-1.5 ${
                  isActive ? 'text-violet-900 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Chapter {ch.ch}
                  {hasBookmark && (
                    <span className="text-amber-500 dark:text-amber-400">
                      <BookmarkRibbon filled />
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug line-clamp-2">
                  {subtitle}
                </div>
              </div>
            </button>

            {/* Chunks of the active chapter — jump straight to a section */}
            {isActive && ch.chunks.length > 1 && (
              <div className="pb-1 bg-violet-50/60 dark:bg-violet-950/40">
                {ch.chunks.map(chunk => {
                  const pKey = passageKey(bookId, ch.ch, chunk.ref)
                  const isChunkActive = pKey === activeChunk
                  return (
                    <button
                      key={chunk.ref}
                      onClick={() => scrollToPassage(pKey)}
                      aria-current={isChunkActive || undefined}
                      className={`w-full text-left pl-8 pr-3 py-1.5 flex items-center gap-1.5 transition-colors ${
                        isChunkActive
                          ? 'text-violet-800 dark:text-violet-300 font-medium'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                        isChunkActive ? 'bg-violet-600 dark:bg-violet-400' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                      <span className="text-[11px] leading-snug truncate">
                        {chunk.pericope || chunk.ref}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
