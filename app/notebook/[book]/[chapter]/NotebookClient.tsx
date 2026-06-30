'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BOOKS, TRACKS, getChapter } from '@/lib/data'
import ReportButton from '@/components/ReportButton'
import type { User } from '@supabase/supabase-js'

type Mode = 'study' | 'community'

type CommunityNote = {
  id: string
  passage_ref: string
  track_id: string
  content: string
  updated_at: string
  profiles: { display_name: string }
}

type Reply = {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: { display_name: string }
}

const THEME_DOT = '#0891B2'

export default function NotebookClient() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const urlBook    = typeof params.book    === 'string' ? params.book    : 'john'
  const urlChapter = typeof params.chapter === 'string' ? Math.max(1, parseInt(params.chapter) || 1) : 1

  const [user, setUser] = useState<User | null>(null)

  // Navigation
  const [bookId, setBookId]               = useState(urlBook)
  const [activeChapter, setActiveChapter] = useState(urlChapter)

  // UI
  const [mode, setMode]                         = useState<Mode>('study')
  const [activeTracks, setActiveTracks]         = useState<Set<string>>(new Set(TRACKS.map(t => t.id)))
  const [translation, setTranslation]           = useState<string>('ESV')
  const [showVerseNumbers, setShowVerseNumbers] = useState<boolean>(false)

  // Passage text — keyed by "esvRef|translation|vn"
  const [passageTexts, setPassageTexts]       = useState<Record<string, string>>({})
  const [loadingPassages, setLoadingPassages] = useState<Set<string>>(new Set())

  // Notes
  const [notes, setNotes]                   = useState<Record<string, string>>({})
  const [noteVisibility, setNoteVisibility] = useState<Record<string, boolean>>({})
  const [notesPublicDefault, setNotesPublicDefault] = useState<boolean>(true)
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>([])
  // IDs of the viewer's own notes — used to hide the report button on them
  // without shipping every note's user_id to the browser.
  const [myNoteIds, setMyNoteIds] = useState<Set<string>>(new Set())
  const [replies, setReplies]               = useState<Record<string, Reply[]>>({})
  const [openThreads, setOpenThreads]       = useState<Set<string>>(new Set())
  const [replyText, setReplyText]           = useState<Record<string, string>>({})
  const [chaptersWithNotes, setChaptersWithNotes] = useState<Set<number>>(new Set())

  const saveTimers      = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const requestedChunks = useRef<Set<string>>(new Set())
  const chapterRefs     = useRef<Map<number, HTMLElement>>(new Map())
  const scrollContainer = useRef<HTMLDivElement>(null)
  const bookSelectRef   = useRef<HTMLSelectElement>(null)
  // Chapter to scroll to after the next book-change render cycle
  const pendingScrollChapter = useRef<number | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ passage_ref: string; track_id: string; content: string }>>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState('')
  const exportRef = useRef<HTMLDivElement>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [themeLabel, setThemeLabel] = useState('')
  const [themeInput, setThemeInput] = useState('')
  const [editingTheme, setEditingTheme] = useState(false)

  const [communityScope, setCommunityScope] = useState<'book' | 'all' | 'top'>('book')
  const [allNotes, setAllNotes]             = useState<CommunityNote[]>([])
  const [allNotesOffset, setAllNotesOffset] = useState(0)
  const [allNotesLoading, setAllNotesLoading] = useState(false)
  const [allNotesHasMore, setAllNotesHasMore] = useState(false)
  const [topPassages, setTopPassages] = useState<Array<{ passage_ref: string; notes: number; lines: number }>>([])
  const [topPassagesLoading, setTopPassagesLoading] = useState(false)
  const [filterHasNotes, setFilterHasNotes] = useState(false)

  const book = BOOKS.find(b => b.id === bookId) ?? BOOKS[0]

  // Auth — also loads preferred translation from profile
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles')
          .select('preferred_translation, notes_public_default')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.preferred_translation) setTranslation(profile.preferred_translation)
            if (profile?.notes_public_default != null) setNotesPublicDefault(profile.notes_public_default)
          })
        supabase.from('profiles')
          .select('theme_track_label')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            if ((profile as any)?.theme_track_label) {
              setThemeLabel((profile as any).theme_track_label)
              setThemeInput((profile as any).theme_track_label)
            }
          })
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Handle browser back/forward: sync bookId state with URL params
  useEffect(() => {
    if (urlBook === bookId) return
    // Back/forward navigation changed the book — note which chapter to land on
    pendingScrollChapter.current = urlChapter
    setBookId(urlBook)
  }, [urlBook])

  // On book change: reset scroll. If a back-nav set a pending chapter, scroll there instead.
  useEffect(() => {
    requestedChunks.current.clear()
    setPassageTexts({})

    const target = pendingScrollChapter.current
    if (target !== null) {
      pendingScrollChapter.current = null
      // Allow the new book's chapter refs to register before scrolling
      const id = setTimeout(() => {
        const el = chapterRefs.current.get(target)
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' })
          setActiveChapter(target)
        } else {
          scrollContainer.current?.scrollTo({ top: 0 })
          setActiveChapter(1)
        }
      }, 100)
      return () => clearTimeout(id)
    }

    setActiveChapter(1)
    scrollContainer.current?.scrollTo({ top: 0 })
  }, [bookId])

  // Clear passage cache when translation or verse-number pref changes
  useEffect(() => {
    requestedChunks.current.clear()
    setPassageTexts({})
  }, [translation, showVerseNumbers])

  // Fetch a single chunk's passage text (deduped via requestedChunks ref)
  const fetchChunk = useCallback((chNum: number, esvRef: string) => {
    const key = `${esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
    if (requestedChunks.current.has(key)) return
    requestedChunks.current.add(key)
    setLoadingPassages(prev => new Set(prev).add(key))
    fetch(
      `/api/passage?book=${bookId}&chapter=${chNum}&ref=${encodeURIComponent(esvRef)}&translation=${translation}&vn=${showVerseNumbers}`
    )
      .then(r => r.json())
      .then(data => {
        if (data.text) setPassageTexts(prev => ({ ...prev, [key]: data.text }))
        setLoadingPassages(prev => { const n = new Set(prev); n.delete(key); return n })
      })
      .catch(() => {
        setLoadingPassages(prev => { const n = new Set(prev); n.delete(key); return n })
      })
  }, [bookId, translation, showVerseNumbers])

  // IntersectionObserver: lazy-load passages as chapter sections enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const chNum = parseInt(entry.target.getAttribute('data-chapter') ?? '')
          if (isNaN(chNum)) return
          getChapter(bookId, chNum)?.chunks.forEach(chunk => fetchChunk(chNum, chunk.esvRef))
        })
      },
      { rootMargin: '600px 0px' }
    )
    chapterRefs.current.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [bookId, fetchChunk])

  // Scroll listener: update active chapter + URL (replaceState avoids polluting history)
  useEffect(() => {
    const container = scrollContainer.current
    if (!container) return
    let lastChapter = activeChapter
    const onScroll = () => {
      const containerTop = container.getBoundingClientRect().top
      let current = 1
      chapterRefs.current.forEach((el, chNum) => {
        const top = el.getBoundingClientRect().top - containerTop
        if (top <= 80) current = chNum
      })
      if (current !== lastChapter) {
        lastChapter = current
        setActiveChapter(current)
        window.history.replaceState(null, '', `/notebook/${bookId}/${current}`)
      }
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [bookId])

  // Keep browser tab title in sync with the active chapter as the user scrolls
  useEffect(() => {
    document.title = `${book.name} ${activeChapter} | Three Lines`
  }, [book.name, activeChapter])

  // Load which chapters have notes (progress dots)
  useEffect(() => {
    if (!user) return
    supabase.from('notes')
      .select('passage_ref')
      .eq('user_id', user.id)
      .like('passage_ref', `${bookId}:%`)
      .neq('content', '')
      .then(({ data }) => {
        if (!data) return
        const chNums = new Set<number>()
        data.forEach(n => {
          const ch = parseInt(n.passage_ref.split(':')[1])
          if (!isNaN(ch)) chNums.add(ch)
        })
        setChaptersWithNotes(chNums)
      })
  }, [user, bookId])

  // Live progress: reflect notes typed in the current session before save
  const chaptersWithNotesLive = useMemo(() => {
    const live = new Set(chaptersWithNotes)
    Object.entries(notes).forEach(([key, val]) => {
      if (!val.trim() || !key.startsWith(`${bookId}:`)) return
      const ch = parseInt(key.split(':')[1])
      if (!isNaN(ch)) live.add(ch)
    })
    return live
  }, [chaptersWithNotes, notes, bookId])

  // Clear stale notes when book changes, then load all notes for the new book
  useEffect(() => {
    setNotes({})
    setNoteVisibility({})
  }, [bookId])

  useEffect(() => {
    if (!user) return
    supabase.from('notes')
      .select('passage_ref, track_id, content, is_public')
      .eq('user_id', user.id)
      .like('passage_ref', `${bookId}:%`)
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, string> = {}
        const visMap: Record<string, boolean> = {}
        data.forEach(n => {
          map[`${n.passage_ref}|${n.track_id}`] = n.content
          visMap[n.passage_ref] = n.is_public
        })
        setNotes(prev => ({ ...prev, ...map }))
        setNoteVisibility(prev => ({ ...prev, ...visMap }))
      })
  }, [user, bookId])

  // Track the viewer's own note IDs (own data only — no cross-user exposure)
  useEffect(() => {
    if (!user) { setMyNoteIds(new Set()); return }
    supabase.from('notes')
      .select('id')
      .eq('user_id', user.id)
      .then(({ data }) => { if (data) setMyNoteIds(new Set(data.map(n => n.id))) })
  }, [user])

  // Load community notes for the current book
  useEffect(() => {
    if (mode !== 'community' || communityScope !== 'book') return
    supabase.from('notes')
      .select('id, passage_ref, track_id, content, updated_at, profiles(display_name)')
      .like('passage_ref', `${bookId}:%`)
      .eq('is_public', true)
      .neq('content', '')
      .order('updated_at', { ascending: false })
      .then(({ data }) => { if (data) setCommunityNotes(data as unknown as CommunityNote[]) })
  }, [mode, bookId, communityScope])

  // Load community notes across all books
  useEffect(() => {
    if (mode !== 'community' || communityScope !== 'all') return
    setAllNotes([])
    setAllNotesOffset(0)
    setAllNotesHasMore(false)
    setAllNotesLoading(true)
    supabase.from('notes')
      .select('id, passage_ref, track_id, content, updated_at, profiles(display_name)')
      .eq('is_public', true)
      .neq('content', '')
      .order('updated_at', { ascending: false })
      .range(0, 49)
      .then(({ data }) => {
        const results = (data ?? []) as unknown as CommunityNote[]
        setAllNotes(results)
        setAllNotesHasMore(results.length === 50)
        setAllNotesLoading(false)
      })
  }, [mode, communityScope])

  // Load most-discussed passages (aggregated server-side so user_id stays in the DB)
  useEffect(() => {
    if (mode !== 'community' || communityScope !== 'top') return
    setTopPassages([])
    setTopPassagesLoading(true)
    supabase.rpc('top_passages', { p_limit: 30 })
      .then(({ data }) => {
        const rows = (data ?? []) as Array<{ passage_ref: string; notes: number; lines: number }>
        setTopPassages(rows.map(r => ({
          passage_ref: r.passage_ref,
          notes: Number(r.notes),
          lines: Number(r.lines),
        })))
        setTopPassagesLoading(false)
      })
  }, [mode, communityScope])

  const handleNoteChange = (passageRef: string, trackId: string, value: string) => {
    const key = `${passageRef}|${trackId}`
    setNotes(prev => ({ ...prev, [key]: value }))
    if (!user) return
    const effectivePublic = noteVisibility[passageRef] ?? notesPublicDefault
    setNoteVisibility(prev => prev[passageRef] !== undefined ? prev : { ...prev, [passageRef]: effectivePublic })
    clearTimeout(saveTimers.current[key])
    saveTimers.current[key] = setTimeout(async () => {
      const { error } = await supabase.from('notes').upsert({
        user_id: user.id,
        passage_ref: passageRef,
        track_id: trackId,
        content: value,
        is_public: effectivePublic,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,passage_ref,track_id' })
      if (error) console.error('[three-lines] note save failed:', error)
    }, 800)
  }

  const toggleNoteVisibility = async (passageRef: string) => {
    if (!user) return
    const next = !(noteVisibility[passageRef] ?? notesPublicDefault)
    setNoteVisibility(prev => ({ ...prev, [passageRef]: next }))
    await supabase.from('notes')
      .update({ is_public: next, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('passage_ref', passageRef)
  }

  // Delete every line a user wrote for one passage chunk, then clear it locally
  const deleteChunkNotes = async (passageRef: string) => {
    if (!user) return
    setConfirmDelete(null)
    // Cancel any pending debounced saves for this passage so they don't re-create rows
    Object.keys(saveTimers.current).forEach(key => {
      if (key.startsWith(`${passageRef}|`)) clearTimeout(saveTimers.current[key])
    })
    setNotes(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(key => { if (key.startsWith(`${passageRef}|`)) delete next[key] })
      return next
    })
    setNoteVisibility(prev => {
      const next = { ...prev }
      delete next[passageRef]
      return next
    })
    const { error } = await supabase.from('notes')
      .delete()
      .eq('user_id', user.id)
      .eq('passage_ref', passageRef)
    if (error) console.error('[three-lines] note delete failed:', error)
  }

  const toggleTrack = (id: string) => {
    setActiveTracks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const loadReplies = async (commentId: string) => {
    const { data } = await supabase.from('comments')
      .select('id, user_id, content, created_at, profiles(display_name)')
      .eq('parent_id', commentId)
      .order('created_at', { ascending: true })
    if (data) setReplies(prev => ({ ...prev, [commentId]: data as unknown as Reply[] }))
  }

  const toggleThread = (id: string) => {
    setOpenThreads(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id); loadReplies(id) }
      return next
    })
  }

  const postReply = async (parentId: string, passageRef: string) => {
    const content = replyText[parentId]?.trim()
    if (!content) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ passage_ref: passageRef, track_id: 'thoughts', content, parent_id: parentId }),
    })
    if (!res.ok) return
    setReplyText(prev => ({ ...prev, [parentId]: '' }))
    loadReplies(parentId)
  }

  const loadMoreAllNotes = async () => {
    const next = allNotesOffset + 50
    setAllNotesOffset(next)
    setAllNotesLoading(true)
    const { data } = await supabase.from('notes')
      .select('id, passage_ref, track_id, content, updated_at, profiles(display_name)')
      .eq('is_public', true)
      .neq('content', '')
      .order('updated_at', { ascending: false })
      .range(next, next + 49)
    const results = (data ?? []) as unknown as CommunityNote[]
    setAllNotes(prev => [...prev, ...results])
    setAllNotesHasMore(results.length === 50)
    setAllNotesLoading(false)
  }

  const goToPassage = (noteBookId: string, noteChapter: number) => {
    setCommunityScope('book')
    if (noteBookId === bookId) {
      scrollToChapter(noteChapter)
    } else {
      router.push(`/notebook/${noteBookId}/${noteChapter}`)
    }
  }

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  const passageKey = (bId: string, ch: number, ref: string) => `${bId}:${ch}:${ref}`

  const filteredCommunityNotes = communityNotes.filter(n => activeTracks.has(n.track_id))

  const scrollToChapter = (chNum: number) => {
    setActiveChapter(chNum)
    window.history.replaceState(null, '', `/notebook/${bookId}/${chNum}`)
    chapterRefs.current.get(chNum)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

  // Keyboard shortcuts: j/→ next chapter, k/← prev chapter, / focus book selector, t cycle translation
  useEffect(() => {
    const TRANSLATIONS = ['ESV', 'KJV', 'NIV', 'CEV']
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      switch (e.key) {
        case 'ArrowLeft':
        case 'k': {
          const prev = activeChapter - 1
          if (prev < 1) break
          setActiveChapter(prev)
          window.history.replaceState(null, '', `/notebook/${bookId}/${prev}`)
          chapterRefs.current.get(prev)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          break
        }
        case 'ArrowRight':
        case 'j': {
          const next = activeChapter + 1
          if (next > book.chapters.length) break
          setActiveChapter(next)
          window.history.replaceState(null, '', `/notebook/${bookId}/${next}`)
          chapterRefs.current.get(next)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          break
        }
        case '/':
          e.preventDefault()
          bookSelectRef.current?.focus()
          break
        case 't':
          setTranslation(t => TRANSLATIONS[(TRANSLATIONS.indexOf(t) + 1) % TRANSLATIONS.length])
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeChapter, book.chapters.length, bookId])

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
      const rBook = BOOKS.find(b => b.id === parts[0])
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

  const themeTrack = themeLabel ? {
    id: 'theme',
    label: themeLabel,
    dot: THEME_DOT,
    placeholder: `Trace "${themeLabel}" through this passage.`,
  } : null

  const allActiveTracks = [
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
            {BOOKS.map(b => (
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
              const rBook = BOOKS.find(b => b.id === parts[0])
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
            <div className="space-y-3">
              {allNotesLoading && allNotes.length === 0 ? (
                <div className="text-sm text-gray-400 dark:text-gray-500 animate-pulse py-8">Loading…</div>
              ) : allNotes.filter(n => activeTracks.has(n.track_id)).length === 0 ? (
                <div className="text-sm text-gray-400 dark:text-gray-500 italic py-8">No community notes yet.</div>
              ) : (
                <>
                  {allNotes.filter(n => activeTracks.has(n.track_id)).map(note => {
                    const parts = note.passage_ref.split(':')
                    const noteBookId = parts[0]
                    const noteChapter = parseInt(parts[1]) || 1
                    const noteBook    = BOOKS.find(b => b.id === noteBookId)
                    const track = note.track_id === 'theme'
                      ? { label: themeLabel || 'Theme', dot: THEME_DOT }
                      : TRACKS.find(t => t.id === note.track_id)
                    const initials = note.profiles?.display_name
                      ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
                    return (
                      <div key={note.id} className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {initials}
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{note.profiles?.display_name}</span>
                          {track && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: track.dot + '18', color: track.dot }}>
                              {track.label}
                            </span>
                          )}
                          <button
                            onClick={() => goToPassage(noteBookId, noteChapter)}
                            className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 ml-auto"
                          >
                            {noteBook?.name ?? noteBookId} {parts[1]}:{parts.slice(2).join(':')} →
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8">{note.content}</p>
                        {user && !myNoteIds.has(note.id) && (
                          <div className="ml-8 mt-2">
                            <ReportButton noteId={note.id} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {allNotesHasMore && (
                    <button
                      onClick={loadMoreAllNotes}
                      disabled={allNotesLoading}
                      className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
                    >
                      {allNotesLoading ? 'Loading…' : 'Load more'}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Most Discussed view */}
          {mode === 'community' && communityScope === 'top' && (
            <div className="space-y-2">
              {topPassagesLoading ? (
                <div className="text-sm text-gray-400 dark:text-gray-500 animate-pulse py-8">Loading…</div>
              ) : topPassages.length === 0 ? (
                <div className="text-sm text-gray-400 dark:text-gray-500 italic py-8">No community notes yet.</div>
              ) : topPassages.map(({ passage_ref, notes, lines }, idx) => {
                const parts = passage_ref.split(':')
                const tpBookId = parts[0]
                const tpChapter = parseInt(parts[1]) || 1
                const chunkRef = parts.slice(2).join(':')
                const chunk = getChapter(tpBookId, tpChapter)?.chunks.find(c => c.ref === chunkRef)
                const tpBook = BOOKS.find(b => b.id === tpBookId)
                const displayRef = chunk?.esvRef ?? `${tpBook?.name ?? tpBookId} ${parts.slice(1).join(':')}`
                return (
                  <button
                    key={passage_ref}
                    onClick={() => goToPassage(tpBookId, tpChapter)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
                  >
                    <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-5 text-right flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                        {displayRef}
                      </div>
                      {chunk?.pericope && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">{chunk.pericope}</div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 text-right">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{notes}</span> {notes === 1 ? 'note' : 'notes'}
                      <span className="mx-1 opacity-40">·</span>
                      <span className="font-medium text-gray-600 dark:text-gray-300">{lines}</span> {lines === 1 ? 'line' : 'lines'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* All chapters — continuous */}
          {!(mode === 'community' && communityScope !== 'book') && book.chapters.map(ch => {
            const chapterData = getChapter(bookId, ch.ch)
            if (!chapterData) return null
            if (filterHasNotes && mode === 'community' && !chapterData.chunks.some(chunk =>
              filteredCommunityNotes.some(n => n.passage_ref === passageKey(bookId, ch.ch, chunk.ref))
            )) return null

            return (
              <div
                key={ch.ch}
                id={`chapter-${ch.ch}`}
                data-chapter={ch.ch}
                ref={el => {
                  if (el) chapterRefs.current.set(ch.ch, el)
                  else chapterRefs.current.delete(ch.ch)
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
                        <div className="border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-lg overflow-hidden">
                          {allActiveTracks.map((t, i) => {
                            const noteKey = `${pKey}|${t.id}`
                            return (
                            <div
                              key={t.id}
                              className={`flex items-stretch ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
                            >
                              <div className="w-36 flex-shrink-0 flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 self-stretch gap-1.5">
                                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.dot }} />
                                <span className="text-xs font-medium text-gray-500 leading-tight truncate">{t.label}</span>
                              </div>
                              <textarea
                                aria-label={`${t.label} — ${book.name} ${chunk.ref}`}
                                className="flex-1 text-base p-2.5 outline-none resize-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 min-h-[42px] overflow-hidden"
                                placeholder={t.placeholder}
                                value={notes[noteKey] ?? ''}
                                rows={1}
                                onChange={e => {
                                  autoResize(e.target)
                                  handleNoteChange(pKey, t.id, e.target.value)
                                }}
                              />
                            </div>
                            )
                          })}
                          {user && (
                            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 bg-gray-50/50 dark:bg-gray-800/20">
                              {chunkHasNotes ? (
                                confirmDelete === pKey ? (
                                  <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    Delete these notes?
                                    <button
                                      onClick={() => deleteChunkNotes(pKey)}
                                      className="font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={() => setConfirmDelete(null)}
                                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                      Cancel
                                    </button>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDelete(pKey)}
                                    aria-label={`Delete your notes for ${book.name} ${chunk.ref}`}
                                    className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  >
                                    Delete
                                  </button>
                                )
                              ) : <span />}
                              <button
                                onClick={() => toggleNoteVisibility(pKey)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                  isChunkPublic
                                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                                    : 'bg-white border-gray-200 text-gray-500 dark:bg-transparent dark:border-gray-700 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                                  isChunkPublic ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`} />
                                {isChunkPublic ? 'Shared with community' : 'Share with community'}
                              </button>
                            </div>
                          )}
                          {!user && (
                            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-800/30 text-xs text-amber-700 dark:text-amber-400">
                              <a href="/login" className="underline">Sign in</a> to save your notes.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Community mode */}
                      {mode === 'community' && (
                        <div className="border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-lg overflow-hidden bg-white dark:bg-gray-900">
                          {chunkCommunityNotes.length === 0 ? (
                            <div className="px-4 py-4 text-xs text-gray-400 italic">
                              No community notes yet for this passage.
                            </div>
                          ) : chunkCommunityNotes.map(note => {
                            const track       = note.track_id === 'theme'
                              ? { label: themeLabel || 'Theme', dot: THEME_DOT }
                              : TRACKS.find(t => t.id === note.track_id)
                            const isOpen      = openThreads.has(note.id)
                            const noteReplies = replies[note.id] ?? []
                            const initials    = note.profiles?.display_name
                              ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

                            return (
                              <div key={note.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                                    {initials}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{note.profiles?.display_name}</span>
                                  {track && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: track.dot + '18', color: track.dot }}>
                                      {track.label}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-gray-400 ml-auto">
                                    {new Date(note.updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8 mb-2">{note.content}</p>
                                <div className="ml-8 flex items-center gap-3">
                                  <button
                                    className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    onClick={() => toggleThread(note.id)}
                                  >
                                    {isOpen
                                      ? 'Hide replies'
                                      : noteReplies.length > 0
                                        ? `${noteReplies.length} repl${noteReplies.length === 1 ? 'y' : 'ies'}`
                                        : 'Reply'}
                                  </button>
                                  {user && !myNoteIds.has(note.id) && <ReportButton noteId={note.id} />}
                                </div>
                                {isOpen && (
                                  <div className="ml-8 mt-3 pl-3 border-l border-gray-100 dark:border-gray-800">
                                    {noteReplies.map(r => (
                                      <div key={r.id} className="py-2 border-b border-gray-50 dark:border-gray-800 last:border-b-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{r.profiles?.display_name}</span>
                                          <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">{r.content}</p>
                                      </div>
                                    ))}
                                    {user && (
                                      <div className="flex gap-2 pt-2">
                                        <input
                                          className="flex-1 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                          placeholder="Write a reply..."
                                          value={replyText[note.id] ?? ''}
                                          onChange={e => setReplyText(prev => ({ ...prev, [note.id]: e.target.value }))}
                                          onKeyDown={e => e.key === 'Enter' && postReply(note.id, pKey)}
                                        />
                                        <button
                                          onClick={() => postReply(note.id, pKey)}
                                          className="text-xs px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-700 dark:hover:bg-gray-200"
                                        >
                                          Post
                                        </button>
                                      </div>
                                    )}
                                    {!user && (
                                      <p className="text-xs text-gray-400 pt-2">
                                        <a href="/login" className="underline">Sign in</a> to reply.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
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
