'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'
import { useProfile } from '@/components/ProfileProvider'
import { TRACKS, type Book } from '@/lib/books-index'
import {
  THEME_DOT, passageKey,
  type Mode, type CommunityScope, type Track,
} from './types'
import { useChapterScroll } from './hooks/useChapterScroll'
import { usePassages } from './hooks/usePassages'
import { useNotes } from './hooks/useNotes'
import { useCommunity } from './hooks/useCommunity'
import { useNoteSearch } from './hooks/useNoteSearch'
import { useBookmarks } from './hooks/useBookmarks'
import { useBookProgress } from './hooks/useBookProgress'
import CommunityFeed from './components/CommunityFeed'
import TopPassages from './components/TopPassages'
import StudyLines from './components/StudyLines'
import CommunityThread from './components/CommunityThread'
import ShortcutsHelp from './components/ShortcutsHelp'
import ExportMenu from './components/ExportMenu'
import TrackPills from './components/TrackPills'
import SidebarChapterList from './components/SidebarChapterList'
import BookPicker from './components/BookPicker'

// The active book's full data is resolved server-side (see page.tsx) and passed
// in as a prop, so the browser never loads the whole-Bible dataset.
export default function NotebookClient({ book }: { book: Book }) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const bookId = book.id
  const urlChapter = typeof params.chapter === 'string' ? Math.max(1, parseInt(params.chapter) || 1) : 1

  const user = useUser()
  const { profile } = useProfile()

  // UI
  const [mode, setMode]                         = useState<Mode>('study')
  const [activeTracks, setActiveTracks]         = useState<Set<string>>(new Set(TRACKS.map(t => t.id)))
  const [translation, setTranslation]           = useState<string>('ESV')
  const [showVerseNumbers, setShowVerseNumbers] = useState<boolean>(false)

  // Notes preferences + custom "theme" line
  const [notesPublicDefault, setNotesPublicDefault] = useState<boolean>(true)
  const [themeLabel, setThemeLabel] = useState('')
  const [themeInput, setThemeInput] = useState('')
  const [editingTheme, setEditingTheme] = useState(false)

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Community view scope
  const [communityScope, setCommunityScope] = useState<CommunityScope>('book')
  const [filterHasNotes, setFilterHasNotes] = useState(false)

  // A passage to scroll to once the reading column has rendered (set when a
  // community row in another scope is clicked; flushed by the effect below).
  const pendingScrollRef = useRef<string | null>(null)

  // Reply notifications deep-link with #comment-<id>; scrolled/highlighted
  // once, then left alone so later thread activity doesn't re-trigger it.
  const scrolledToCommentRef = useRef(false)
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null)

  // Reading position, lazy passage loading, notes, and community reads each
  // live in a dedicated hook (see ./hooks).
  const {
    activeChapter, setActiveChapter, scrollToChapter,
    chapterRefs, chunkRefs, activeChunk, scrollContainer, bookSelectRef,
  } = useChapterScroll({ book, urlChapter, setTranslation })

  const { passageTexts, loadingPassages, retryChunk } = usePassages({
    book, translation, showVerseNumbers, chapterRefs,
  })

  const {
    notes, noteVisibility, myNoteIds, chaptersWithNotesLive,
    confirmDelete, setConfirmDelete,
    handleNoteChange, toggleNoteVisibility, deleteChunkNotes,
  } = useNotes({ user, bookId, supabase, notesPublicDefault })

  const {
    communityNotes,
    allNotes, allNotesLoading, allNotesHasMore, loadMoreAllNotes,
    topPassages, topPassagesLoading,
    replies, openThreads, toggleThread,
    replyText, setReplyText, postReply,
    replyLikeCounts, likedReplyIds, toggleReplyLike,
  } = useCommunity({ mode, bookId, communityScope, supabase, user })

  const { searchQuery, setSearchQuery, searchResults, searchLoading } = useNoteSearch({ user, supabase })

  const { bookmarks, bookmarkedChapters, toggleBookmark } = useBookmarks({ user, bookId, supabase })

  const bookChapters = useBookProgress({ user, supabase })

  // Seed preferences from the shared profile once it loads.
  useEffect(() => {
    if (!profile) return
    if (profile.preferred_translation) setTranslation(profile.preferred_translation)
    if (profile.notes_public_default != null) setNotesPublicDefault(profile.notes_public_default)
    if (profile.theme_track_label) {
      setThemeLabel(profile.theme_track_label)
      setThemeInput(profile.theme_track_label)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const toggleTrack = (id: string) => {
    setActiveTracks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Scroll to a specific passage chunk by its anchor id, if it is on the page.
  const scrollToPassage = (passageRef: string, behavior: ScrollBehavior = 'smooth') => {
    const el = document.getElementById(`passage-${passageRef}`)
    if (!el) return false
    el.scrollIntoView({ behavior, block: 'start' })
    return true
  }

  // Jump from a community row to the passage it belongs to. Same book: switch to
  // the per-book view and scroll to the exact chunk (deferred via pendingScroll
  // if that view has not rendered yet). Other book: navigate with a passage hash.
  const goToPassage = (passageRef: string) => {
    const parts = passageRef.split(':')
    const noteBookId = parts[0]
    const noteChapter = parseInt(parts[1]) || 1
    if (noteBookId !== bookId) {
      router.push(`/notebook/${noteBookId}/${noteChapter}#passage-${encodeURIComponent(passageRef)}`)
      return
    }
    setCommunityScope('book')
    if (!scrollToPassage(passageRef)) pendingScrollRef.current = passageRef
  }

  // Flush a pending scroll once the per-book reading column has rendered.
  useEffect(() => {
    if (!pendingScrollRef.current) return
    if (scrollToPassage(pendingScrollRef.current)) pendingScrollRef.current = null
  }, [communityScope, mode])

  // Cross-book jumps land with a #passage-<ref> hash; scroll to it once the new
  // book's chapter sections have registered.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#passage-')) return
    const passageRef = decodeURIComponent(hash.slice('#passage-'.length))
    const t = setTimeout(() => scrollToPassage(passageRef, 'instant'), 150)
    return () => clearTimeout(t)
  }, [bookId])

  // Reply-notification deep link: ?mode=community&thread=<noteId>#comment-<id>.
  // Switch into the right view and open the replied-to thread so its replies load.
  useEffect(() => {
    if (searchParams.get('mode') === 'community') {
      setMode('community')
      setCommunityScope('book')
    }
    const threadId = searchParams.get('thread')
    if (threadId && !openThreads.has(threadId)) toggleThread(threadId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Once the target thread's replies have loaded, scroll to and briefly
  // highlight the specific reply named in the #comment-<id> hash.
  useEffect(() => {
    if (scrolledToCommentRef.current) return
    const hash = window.location.hash
    if (!hash.startsWith('#comment-')) return
    const commentId = decodeURIComponent(hash.slice('#comment-'.length))
    const el = document.getElementById(`comment-${commentId}`)
    if (!el) return
    scrolledToCommentRef.current = true
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightedCommentId(commentId)
    setTimeout(() => setHighlightedCommentId(null), 3000)
  }, [replies])

  const filteredCommunityNotes = useMemo(
    () => communityNotes.filter(n => activeTracks.has(n.track_id)),
    [communityNotes, activeTracks]
  )

  const handleBookChange = (newBookId: string) => {
    if (newBookId === bookId) return
    router.push(`/notebook/${newBookId}/1`)
  }

  useEffect(() => {
    setActiveTracks(prev => {
      const next = new Set(prev)
      themeLabel ? next.add('theme') : next.delete('theme')
      return next
    })
  }, [themeLabel])

  const saveTheme = async (label: string) => {
    const trimmed = label.trim()
    setThemeLabel(trimmed)
    setThemeInput(trimmed)
    setEditingTheme(false)
    if (!user) return
    await supabase.from('profiles')
      .update({ theme_track_label: trimmed || null })
      .eq('id', user.id)
  }

  const goToResult = (passageRef: string) => {
    const parts = passageRef.split(':')
    const rBookId = parts[0]
    const rChapter = parseInt(parts[1])
    setSearchQuery('') // clearing the query also clears results (see useNoteSearch)
    if (rBookId === bookId) {
      scrollToChapter(rChapter)
    } else {
      router.push(`/notebook/${rBookId}/${rChapter}`)
    }
  }

  const themeTrack: Track | null = themeLabel ? {
    id: 'theme',
    label: themeLabel,
    dot: THEME_DOT,
    placeholder: `Trace "${themeLabel}" through this passage.`,
  } : null

  const allActiveTracks: Track[] = [
    ...TRACKS.filter(t => activeTracks.has(t.id)),
    ...(themeTrack && activeTracks.has('theme') ? [themeTrack] : []),
  ]

  return (
    <div className="flex h-[calc(100vh-48px)]">

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static on desktop */}
      <aside className={`
        fixed top-12 bottom-0 left-0 z-40 bg-white dark:bg-gray-900
        md:static md:top-auto md:bottom-auto md:z-auto
        w-52 border-r border-gray-100 dark:border-gray-800 flex flex-col flex-shrink-0
        transition-transform duration-200 md:transition-none md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Version selector */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <select
            aria-label="Translation"
            className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none"
            value={translation}
            onChange={e => {
              setTranslation(e.target.value)
              if (user) {
                supabase.from('profiles')
                  .update({ preferred_translation: e.target.value })
                  .eq('id', user.id)
                  .then(() => {})
              }
            }}
          >
            <option value="ESV">ESV</option>
            <option value="KJV">KJV</option>
            <option value="NIV">NIV</option>
            <option value="CEV">CEV</option>
          </select>
        </div>

        {/* Book picker */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <BookPicker
            bookId={bookId}
            bookChapters={bookChapters}
            onChange={handleBookChange}
            selectRef={bookSelectRef}
          />
        </div>

        {/* Verse numbers toggle */}
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-300">Show Verse Numbers</span>
          <button
            onClick={() => setShowVerseNumbers(v => !v)}
            aria-label="Show verse numbers"
            aria-pressed={showVerseNumbers}
            className={`relative w-7 h-4 rounded-full transition-colors flex-shrink-0 ${
              showVerseNumbers ? 'bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
              showVerseNumbers ? 'translate-x-3' : ''
            }`} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <input
            type="search"
            placeholder="Search notes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-gray-400 dark:focus:border-gray-500"
          />
        </div>

        {/* Chapter list / search results */}
        <div className="flex-1 overflow-y-auto">
          <SidebarChapterList
            searchQuery={searchQuery}
            searchLoading={searchLoading}
            searchResults={searchResults}
            user={user}
            book={book}
            bookId={bookId}
            activeChapter={activeChapter}
            activeChunk={activeChunk}
            chaptersWithNotesLive={chaptersWithNotesLive}
            bookmarks={bookmarks}
            bookmarkedChapters={bookmarkedChapters}
            passageTexts={passageTexts}
            translation={translation}
            showVerseNumbers={showVerseNumbers}
            goToResult={goToResult}
            scrollToChapter={scrollToChapter}
            scrollToPassage={scrollToPassage}
          />
        </div>

        {/* Export */}
        {user && <ExportMenu user={user} book={book} supabase={supabase} />}
      </aside>

      {/* Main area — continuous scroll */}
      <div ref={scrollContainer} className="flex-1 overflow-y-auto">

        {/* Sticky chapter heading — keeps the reader oriented in long chapters */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-2xl mx-auto px-3 md:px-6 py-2.5 flex items-center gap-2">
            <button
              className="md:hidden p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle sidebar"
            >☰</button>
            <h2 className="text-base font-serif font-medium text-gray-900 dark:text-gray-100">{book.name}</h2>
            <span className="text-xs text-gray-400 tracking-wider uppercase flex-1">Chapter {activeChapter}</span>
            <ShortcutsHelp />
            <div className="flex">
              <button
                onClick={() => activeChapter > 1 && scrollToChapter(activeChapter - 1)}
                disabled={activeChapter === 1}
                title="Previous chapter (k / ←)"
                className="px-2 py-1 text-base text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
              >‹</button>
              <button
                onClick={() => activeChapter < book.chapters.length && scrollToChapter(activeChapter + 1)}
                disabled={activeChapter === book.chapters.length}
                title="Next chapter (j / →)"
                className="px-2 py-1 text-base text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
              >›</button>
            </div>
          </div>
        </div>

        {/* Sticky controls bar */}
        <div className="sticky top-[44px] z-10 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-2xl mx-auto px-6 py-2.5 flex items-center gap-3 flex-wrap">
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              {(['study', 'community'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 text-sm transition-colors ${
                    mode === m
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {m === 'study' ? '📖 My notes' : '👥 Community'}
                </button>
              ))}
            </div>
            {mode === 'community' && (
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                {(['book', 'all', 'top'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setCommunityScope(s)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      communityScope === s
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    {s === 'book' ? 'This book' : s === 'all' ? 'Feed' : 'Top'}
                  </button>
                ))}
                {communityScope === 'book' && (
                  <button
                    onClick={() => setFilterHasNotes(v => !v)}
                    aria-pressed={filterHasNotes}
                    title="Show only passages that someone has written a note on, and hide the rest"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border-l border-gray-200 dark:border-gray-700 transition-colors ${
                      filterHasNotes
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    With notes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-5">

          {/* Track pills */}
          <TrackPills
            activeTracks={activeTracks}
            toggleTrack={toggleTrack}
            themeLabel={themeLabel}
            themeInput={themeInput}
            setThemeInput={setThemeInput}
            editingTheme={editingTheme}
            setEditingTheme={setEditingTheme}
            saveTheme={saveTheme}
          />

          {/* All-books community feed */}
          {mode === 'community' && communityScope === 'all' && (
            <CommunityFeed
              allNotes={allNotes}
              activeTracks={activeTracks}
              themeLabel={themeLabel}
              user={user}
              myNoteIds={myNoteIds}
              allNotesLoading={allNotesLoading}
              allNotesHasMore={allNotesHasMore}
              loadMoreAllNotes={loadMoreAllNotes}
              goToPassage={goToPassage}
              openThreads={openThreads}
              replies={replies}
              toggleThread={toggleThread}
              replyText={replyText}
              setReplyText={setReplyText}
              postReply={postReply}
            />
          )}

          {/* Most Discussed view */}
          {mode === 'community' && communityScope === 'top' && (
            <TopPassages
              topPassages={topPassages}
              topPassagesLoading={topPassagesLoading}
              goToPassage={goToPassage}
            />
          )}

          {/* All chapters — continuous */}
          {!(mode === 'community' && communityScope !== 'book') && book.chapters.map(ch => {
            const chapterData = ch
            if (filterHasNotes && mode === 'community' && !chapterData.chunks.some(chunk =>
              filteredCommunityNotes.some(n => n.passage_ref === passageKey(bookId, ch.ch, chunk.ref))
            )) return null

            return (
              <div
                key={ch.ch}
                id={`chapter-${ch.ch}`}
                data-chapter={ch.ch}
                ref={el => {
                  if (el) chapterRefs.current?.set(ch.ch, el)
                  else chapterRefs.current?.delete(ch.ch)
                }}
                className="mb-10"
              >
                <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase mb-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  Chapter {ch.ch}
                </h3>

                {chapterData.chunks.filter(chunk => {
                  if (!filterHasNotes || mode !== 'community') return true
                  const pKey = passageKey(bookId, ch.ch, chunk.ref)
                  return filteredCommunityNotes.some(n => n.passage_ref === pKey)
                }).map(chunk => {
                  const pKey                = passageKey(bookId, ch.ch, chunk.ref)
                  const cacheKey            = `${chunk.esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
                  const text                = passageTexts[cacheKey]
                  const isLoading           = loadingPassages.has(cacheKey)
                  const chunkCommunityNotes = filteredCommunityNotes.filter(n => n.passage_ref === pKey)
                  const isChunkPublic = noteVisibility[pKey] ?? notesPublicDefault
                  const chunkHasNotes = Object.entries(notes).some(([k, v]) => k.startsWith(`${pKey}|`) && v.trim())

                  return (
                    <div
                      key={chunk.ref}
                      id={`passage-${pKey}`}
                      ref={el => {
                        if (el) chunkRefs.current?.set(pKey, el)
                        else chunkRefs.current?.delete(pKey)
                      }}
                      className="mb-5 scroll-mt-24"
                    >

                      {/* Passage text */}
                      <div className="border border-gray-100 dark:border-gray-800 rounded-t-lg p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-xs font-medium tracking-wider text-gray-400">
                            {book.name} {chunk.ref}
                          </span>
                          <div className="flex items-center gap-2 ml-2">
                            {chunk.pericope && (
                              <span className="text-[10px] text-gray-400 italic">{chunk.pericope}</span>
                            )}
                            <button
                              onClick={() => toggleBookmark(pKey)}
                              aria-label={bookmarks.has(pKey) ? `Remove bookmark for ${book.name} ${chunk.ref}` : `Bookmark ${book.name} ${chunk.ref}`}
                              title={bookmarks.has(pKey) ? 'Remove bookmark' : 'Bookmark this passage'}
                              className={`flex-shrink-0 transition-colors ${
                                bookmarks.has(pKey)
                                  ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300'
                                  : 'text-gray-200 hover:text-gray-400 dark:text-gray-700 dark:hover:text-gray-500'
                              }`}
                            >
                              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={bookmarks.has(pKey) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {isLoading ? (
                          <div className="h-16 flex items-center">
                            <span className="text-xs text-gray-300 dark:text-gray-600 animate-pulse">Loading passage...</span>
                          </div>
                        ) : text ? (
                          <p className="text-base font-serif leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">{text}</p>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 italic">Could not load passage.</span>
                            <button
                              onClick={() => retryChunk(ch.ch, chunk.esvRef)}
                              className="text-xs text-gray-500 dark:text-gray-400 underline underline-offset-2 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Study mode */}
                      {mode === 'study' && (
                        <StudyLines
                          pKey={pKey}
                          label={`${book.name} ${chunk.ref}`}
                          tracks={allActiveTracks}
                          notes={notes}
                          handleNoteChange={handleNoteChange}
                          user={user}
                          chunkHasNotes={chunkHasNotes}
                          isChunkPublic={isChunkPublic}
                          confirmDelete={confirmDelete}
                          setConfirmDelete={setConfirmDelete}
                          deleteChunkNotes={deleteChunkNotes}
                          toggleNoteVisibility={toggleNoteVisibility}
                        />
                      )}

                      {/* Community mode */}
                      {mode === 'community' && (
                        <CommunityThread
                          pKey={pKey}
                          chunkCommunityNotes={chunkCommunityNotes}
                          themeLabel={themeLabel}
                          user={user}
                          myNoteIds={myNoteIds}
                          openThreads={openThreads}
                          replies={replies}
                          toggleThread={toggleThread}
                          replyText={replyText}
                          setReplyText={setReplyText}
                          postReply={postReply}
                          replyLikeCounts={replyLikeCounts}
                          likedReplyIds={likedReplyIds}
                          toggleReplyLike={toggleReplyLike}
                          highlightedCommentId={highlightedCommentId}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}
