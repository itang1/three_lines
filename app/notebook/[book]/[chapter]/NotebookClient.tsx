'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'
import { BOOKS_INDEX, TRACKS, getBookMeta, type Book } from '@/lib/books-index'
import {
  THEME_DOT, passageKey,
  type Mode, type CommunityScope, type SearchResult, type Track,
} from './types'
import { useChapterScroll } from './hooks/useChapterScroll'
import { usePassages } from './hooks/usePassages'
import { useNotes } from './hooks/useNotes'
import { useCommunity } from './hooks/useCommunity'
import CommunityFeed from './components/CommunityFeed'
import TopPassages from './components/TopPassages'
import StudyLines from './components/StudyLines'
import CommunityThread from './components/CommunityThread'

// The active book's full data is resolved server-side (see page.tsx) and passed
// in as a prop, so the browser never loads the whole-Bible dataset.
export default function NotebookClient({ book }: { book: Book }) {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const bookId = book.id
  const urlChapter = typeof params.chapter === 'string' ? Math.max(1, parseInt(params.chapter) || 1) : 1

  const user = useUser()

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

  // Sidebar / search / export
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  const exportRef = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  // Community view scope
  const [communityScope, setCommunityScope] = useState<CommunityScope>('book')
  const [filterHasNotes, setFilterHasNotes] = useState(false)

  // Reading position, lazy passage loading, notes, and community reads each
  // live in a dedicated hook (see ./hooks).
  const {
    activeChapter, setActiveChapter, scrollToChapter,
    chapterRefs, scrollContainer, bookSelectRef,
  } = useChapterScroll({ book, urlChapter, setTranslation })

  const { passageTexts, loadingPassages } = usePassages({
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
  } = useCommunity({ mode, bookId, communityScope, supabase })

  // Load profile preferences once the user is known
  useEffect(() => {
    if (!user) return
    supabase.from('profiles')
      .select('preferred_translation, notes_public_default, theme_track_label')
      .eq('id', user.id)
      .single()
      .then(({ data: profile }) => {
        if (profile?.preferred_translation) setTranslation(profile.preferred_translation)
        if (profile?.notes_public_default != null) setNotesPublicDefault(profile.notes_public_default)
        if (profile?.theme_track_label) {
          setThemeLabel(profile.theme_track_label)
          setThemeInput(profile.theme_track_label)
        }
      })
  }, [user])

  const toggleTrack = (id: string) => {
    setActiveTracks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const goToPassage = (noteBookId: string, noteChapter: number) => {
    setCommunityScope('book')
    if (noteBookId === bookId) {
      scrollToChapter(noteChapter)
    } else {
      router.push(`/notebook/${noteBookId}/${noteChapter}`)
    }
  }

  const filteredCommunityNotes = communityNotes.filter(n => activeTracks.has(n.track_id))

  const handleBookChange = (newBookId: string) => {
    if (newBookId === bookId) return
    router.push(`/notebook/${newBookId}/1`)
  }

  // Export dropdown: close on click-outside or Escape, and clear any stale message when closed
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

  useEffect(() => {
    clearTimeout(searchTimer.current)
    if (!searchQuery.trim()) { setSearchResults([]); setSearchLoading(false); return }
    if (!user) { setSearchLoading(false); return }
    setSearchLoading(true)
    searchTimer.current = setTimeout(async () => {
      const { data, error } = await supabase.from('notes')
        .select('passage_ref, track_id, content')
        .eq('user_id', user.id)
        .ilike('content', `%${searchQuery.trim()}%`)
        .neq('content', '')
        .order('passage_ref')
        .limit(30)
      if (error) console.error('[three-lines] search query failed:', error)
      setSearchResults(data ?? [])
      setSearchLoading(false)
    }, 300)
  }, [searchQuery, user])

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
    setSearchQuery('')
    setSearchResults([])
    if (rBookId === bookId) {
      scrollToChapter(rChapter)
    } else {
      router.push(`/notebook/${rBookId}/${rChapter}`)
    }
  }

  const exportNotes = async (scope: 'book' | 'all') => {
    if (!user) return
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
      `Three Lines Notes — ${scope === 'book' ? book.name : 'All Books'}`,
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
          <select
            ref={bookSelectRef}
            aria-label="Book"
            className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none"
            value={bookId}
            onChange={e => handleBookChange(e.target.value)}
          >
            {BOOKS_INDEX.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
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
          {searchQuery.trim() ? (
            searchLoading ? (
              <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 animate-pulse">Searching…</div>
            ) : !user ? (
              <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 italic">
                <a href="/login" className="underline">Sign in</a> to search your notes.
              </div>
            ) : searchResults.length === 0 ? (
              <div className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400 italic">No notes found.</div>
            ) : searchResults.map((r, i) => {
              const parts = r.passage_ref.split(':')
              const rBook = getBookMeta(parts[0])
              const rTrack = TRACKS.find(t => t.id === r.track_id)
              const q = searchQuery.trim().toLowerCase()
              const ci = r.content.toLowerCase().indexOf(q)
              const start = Math.max(0, ci - 20)
              const snippet = r.content.slice(start, ci + q.length + 60)
              return (
                <button
                  key={i}
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
            })
          ) : (
          book.chapters.map(ch => {
            const isActive   = activeChapter === ch.ch
            const hasNotes   = chaptersWithNotesLive.has(ch.ch)
            const firstChunk = ch.chunks[0]
            const cacheKey   = firstChunk
              ? `${firstChunk.esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
              : ''
            const subtitle   = firstChunk?.pericope
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
          })
          )}
        </div>

        {/* Export */}
        {user && (
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
        )}
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
              <>
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
                </div>
                {communityScope === 'book' && (
                  <button
                    onClick={() => setFilterHasNotes(v => !v)}
                    aria-pressed={filterHasNotes}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      filterHasNotes
                        ? 'bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100'
                        : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    Only with notes
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-5">

          {/* Track pills */}
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

              {/* User's own custom line */}
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
                    <div key={chunk.ref} className="mb-5">

                      {/* Passage text */}
                      <div className="border border-gray-100 dark:border-gray-800 rounded-t-lg p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-xs font-medium tracking-wider text-gray-400">
                            {book.name} {chunk.ref}
                          </span>
                          {chunk.pericope && (
                            <span className="text-[10px] text-gray-400 italic ml-2">{chunk.pericope}</span>
                          )}
                        </div>
                        {isLoading ? (
                          <div className="h-16 flex items-center">
                            <span className="text-xs text-gray-300 dark:text-gray-600 animate-pulse">Loading passage...</span>
                          </div>
                        ) : text ? (
                          <p className="text-base font-serif leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">{text}</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Could not load passage. Check your API key.</p>
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
