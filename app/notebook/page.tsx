'use client'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { BOOKS, TRACKS, getChapter } from '@/lib/data'
import type { User } from '@supabase/supabase-js'

type Mode = 'study' | 'community'

type CommunityNote = {
  id: string
  user_id: string
  passage_ref: string
  track_id: string
  content: string
  created_at: string
  profiles: { display_name: string }
}

type Reply = {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: { display_name: string }
}

export default function NotebookPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  // Navigation
  const [bookId, setBookId]           = useState('john')
  const [activeChapter, setActiveChapter] = useState(1) // sidebar highlight only

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
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>([])
  const [replies, setReplies]               = useState<Record<string, Reply[]>>({})
  const [openThreads, setOpenThreads]       = useState<Set<string>>(new Set())
  const [replyText, setReplyText]           = useState<Record<string, string>>({})
  const [chaptersWithNotes, setChaptersWithNotes] = useState<Set<number>>(new Set())

  const saveTimers      = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const requestedChunks = useRef<Set<string>>(new Set())
  const chapterRefs     = useRef<Map<number, HTMLElement>>(new Map())
  const scrollContainer = useRef<HTMLDivElement>(null)

  const book = BOOKS.find(b => b.id === bookId)!

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // On book change: reset scroll position and active chapter
  useEffect(() => {
    setActiveChapter(1)
    scrollContainer.current?.scrollTo({ top: 0 })
  }, [bookId])

  // Clear passage cache when book, translation, or verse-number pref changes
  useEffect(() => {
    requestedChunks.current.clear()
    setPassageTexts({})
  }, [bookId, translation, showVerseNumbers])

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
      { rootMargin: '600px 0px' } // start fetching before the section is visible
    )
    chapterRefs.current.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [bookId, fetchChunk])

  // Scroll listener: update active chapter for sidebar highlight
  useEffect(() => {
    const container = scrollContainer.current
    if (!container) return
    const onScroll = () => {
      const containerTop = container.getBoundingClientRect().top
      let current = 1
      chapterRefs.current.forEach((el, chNum) => {
        const top = el.getBoundingClientRect().top - containerTop
        if (top <= 80) current = chNum
      })
      setActiveChapter(current)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [bookId])

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
  }, [bookId])

  useEffect(() => {
    if (!user) return
    supabase.from('notes')
      .select('passage_ref, track_id, content')
      .eq('user_id', user.id)
      .like('passage_ref', `${bookId}:%`)
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, string> = {}
        data.forEach(n => { map[`${n.passage_ref}|${n.track_id}`] = n.content })
        setNotes(prev => ({ ...prev, ...map }))
      })
  }, [user, bookId])

  // Load community notes for the entire book
  useEffect(() => {
    if (mode !== 'community') return
    supabase.from('notes')
      .select('id, user_id, passage_ref, track_id, content, created_at, profiles(display_name)')
      .like('passage_ref', `${bookId}:%`)
      .eq('is_public', true)
      .neq('content', '')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setCommunityNotes(data as CommunityNote[]) })
  }, [mode, bookId])

  const handleNoteChange = (passageRef: string, trackId: string, value: string) => {
    const key = `${passageRef}|${trackId}`
    setNotes(prev => ({ ...prev, [key]: value }))
    if (!user) return
    clearTimeout(saveTimers.current[key])
    saveTimers.current[key] = setTimeout(async () => {
      await supabase.from('notes').upsert({
        user_id: user.id,
        passage_ref: passageRef,
        track_id: trackId,
        content: value,
        is_public: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,passage_ref,track_id' })
    }, 800)
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
    if (data) setReplies(prev => ({ ...prev, [commentId]: data as Reply[] }))
  }

  const toggleThread = (id: string) => {
    setOpenThreads(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id); loadReplies(id) }
      return next
    })
  }

  const postReply = async (parentId: string, passageRef: string) => {
    if (!user) return alert('Sign in to reply.')
    const content = replyText[parentId]?.trim()
    if (!content) return
    await supabase.from('comments').insert({
      user_id: user.id, passage_ref: passageRef,
      track_id: 'thoughts', content, parent_id: parentId,
    })
    setReplyText(prev => ({ ...prev, [parentId]: '' }))
    loadReplies(parentId)
  }

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  const passageKey = (bId: string, ch: number, ref: string) => `${bId}:${ch}:${ref}`

  const filteredCommunityNotes = communityNotes.filter(n => activeTracks.has(n.track_id))

  const scrollToChapter = (chNum: number) => {
    setActiveChapter(chNum)
    chapterRefs.current.get(chNum)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex h-[calc(100vh-48px)]">

      {/* Sidebar */}
      <aside className="w-52 border-r border-gray-100 flex flex-col flex-shrink-0">

        {/* Version selector */}
        <div className="p-3 border-b border-gray-100 flex-shrink-0">
          <select
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-700 outline-none"
            value={translation}
            onChange={e => setTranslation(e.target.value)}
          >
            <option value="ESV">ESV</option>
            <option value="KJV">KJV</option>
            <option value="NIV">NIV</option>
            <option value="CEV">CEV</option>
          </select>
        </div>

        {/* Book picker */}
        <div className="p-3 border-b border-gray-100 flex-shrink-0">
          <select
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-700 outline-none"
            value={bookId}
            onChange={e => setBookId(e.target.value)}
          >
            {BOOKS.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Verse numbers toggle */}
        <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-400">Verse numbers</span>
          <button
            onClick={() => setShowVerseNumbers(v => !v)}
            className={`relative w-7 h-4 rounded-full transition-colors flex-shrink-0 ${
              showVerseNumbers ? 'bg-gray-600' : 'bg-gray-200'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
              showVerseNumbers ? 'translate-x-3' : ''
            }`} />
          </button>
        </div>

        {/* Chapter list — clicks scroll to in-page anchor */}
        <div className="flex-1 overflow-y-auto">
          {book.chapters.map(ch => {
            const isActive   = activeChapter === ch.ch
            const hasNotes   = chaptersWithNotesLive.has(ch.ch)
            const firstChunk = ch.chunks[0]
            const cacheKey   = firstChunk
              ? `${firstChunk.esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
              : ''
            const subtitle   = firstChunk?.pericope
              ?? (passageTexts[cacheKey] ?? '')
                  .replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 50)

            return (
              <button
                key={ch.ch}
                onClick={() => scrollToChapter(ch.ch)}
                className={`w-full text-left py-2.5 border-b border-gray-50 transition-colors flex gap-2.5 items-start ${
                  isActive
                    ? 'bg-violet-100 border-l-2 border-l-violet-500 pl-2.5 pr-3'
                    : 'hover:bg-gray-50 pl-3 pr-3 border-l-2 border-l-transparent'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 transition-colors ${
                  hasNotes ? 'bg-gray-400' : 'bg-gray-200'
                }`} />
                <div className="min-w-0">
                  <div className={`text-xs font-medium leading-tight mb-0.5 ${
                    isActive ? 'text-violet-900' : 'text-gray-600'
                  }`}>
                    Chapter {ch.ch}
                  </div>
                  <div className="text-[10px] text-gray-400 leading-snug line-clamp-2">
                    {subtitle}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main area — continuous scroll */}
      <div ref={scrollContainer} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-5">

          {/* Book heading */}
          <h2 className="text-lg font-serif font-medium text-gray-900 mb-5">{book.name}</h2>

          {/* Mode toggle + track pills */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              {(['study', 'community'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 text-sm transition-colors ${
                    mode === m ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {m === 'study' ? '📖 My notes' : '👥 Community'}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TRACKS.map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleTrack(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors ${
                    activeTracks.has(t.id)
                      ? 'bg-gray-100 border-gray-300 text-gray-800'
                      : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.dot }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* All chapters — continuous */}
          {book.chapters.map(ch => {
            const chapterData = getChapter(bookId, ch.ch)
            if (!chapterData) return null

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
                <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase mb-4 pt-4 border-t border-gray-100">
                  Chapter {ch.ch}
                </h3>

                {chapterData.chunks.map(chunk => {
                  const pKey                = passageKey(bookId, ch.ch, chunk.ref)
                  const cacheKey            = `${chunk.esvRef}|${translation}|${showVerseNumbers ? '1' : '0'}`
                  const text                = passageTexts[cacheKey]
                  const isLoading           = loadingPassages.has(cacheKey)
                  const chunkCommunityNotes = filteredCommunityNotes.filter(n => n.passage_ref === pKey)

                  return (
                    <div key={chunk.ref} className="mb-5">

                      {/* Passage text */}
                      <div className="border border-gray-100 rounded-t-lg p-4 bg-white">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="text-[10px] font-medium tracking-wider text-gray-400">
                            {book.name} {chunk.ref}
                          </span>
                          {chunk.pericope && (
                            <span className="text-[10px] text-gray-400 italic ml-2">{chunk.pericope}</span>
                          )}
                        </div>
                        {isLoading ? (
                          <div className="h-16 flex items-center">
                            <span className="text-xs text-gray-300 animate-pulse">Loading passage...</span>
                          </div>
                        ) : text ? (
                          <p className="text-sm font-serif leading-relaxed text-gray-800 whitespace-pre-line">{text}</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Could not load passage. Check your API key.</p>
                        )}
                      </div>

                      {/* Study mode */}
                      {mode === 'study' && (
                        <div className="border border-t-0 border-gray-100 rounded-b-lg overflow-hidden">
                          {TRACKS.filter(t => activeTracks.has(t.id)).map((t, i) => (
                            <div
                              key={t.id}
                              className={`flex items-stretch ${i > 0 ? 'border-t border-gray-100' : ''}`}
                            >
                              <div className="w-36 flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 border-r border-gray-100 self-stretch">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.dot }} />
                                <span className="text-[10px] font-medium text-gray-400 leading-tight">{t.label}</span>
                              </div>
                              <textarea
                                className="flex-1 text-sm p-2.5 outline-none resize-none bg-white text-gray-800 placeholder-gray-300 min-h-[38px] overflow-hidden"
                                placeholder={t.placeholder}
                                value={notes[`${pKey}|${t.id}`] ?? ''}
                                rows={1}
                                onChange={e => {
                                  autoResize(e.target)
                                  handleNoteChange(pKey, t.id, e.target.value)
                                }}
                              />
                            </div>
                          ))}
                          {!user && (
                            <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-xs text-amber-700">
                              <a href="/login" className="underline">Sign in</a> to save your notes.
                            </div>
                          )}
                        </div>
                      )}

                      {/* Community mode */}
                      {mode === 'community' && (
                        <div className="border border-t-0 border-gray-100 rounded-b-lg overflow-hidden bg-white">
                          {chunkCommunityNotes.length === 0 ? (
                            <div className="px-4 py-4 text-xs text-gray-400 italic">
                              No community notes yet for this passage.
                            </div>
                          ) : chunkCommunityNotes.map(note => {
                            const track       = TRACKS.find(t => t.id === note.track_id)
                            const isOpen      = openThreads.has(note.id)
                            const noteReplies = replies[note.id] ?? []
                            const initials    = note.profiles?.display_name
                              ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

                            return (
                              <div key={note.id} className="border-b border-gray-100 last:border-b-0 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-semibold text-gray-500 flex-shrink-0">
                                    {initials}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">{note.profiles?.display_name}</span>
                                  {track && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: track.dot + '18', color: track.dot }}>
                                      {track.label}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-gray-400 ml-auto">
                                    {new Date(note.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed ml-8 mb-2">{note.content}</p>
                                <button
                                  className="ml-8 text-[11px] text-gray-400 hover:text-gray-600"
                                  onClick={() => toggleThread(note.id)}
                                >
                                  {isOpen
                                    ? 'Hide replies'
                                    : noteReplies.length > 0
                                      ? `${noteReplies.length} repl${noteReplies.length === 1 ? 'y' : 'ies'}`
                                      : 'Reply'}
                                </button>
                                {isOpen && (
                                  <div className="ml-8 mt-3 pl-3 border-l border-gray-100">
                                    {noteReplies.map(r => (
                                      <div key={r.id} className="py-2 border-b border-gray-50 last:border-b-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-[10px] font-medium text-gray-600">{r.profiles?.display_name}</span>
                                          <span className="text-[10px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">{r.content}</p>
                                      </div>
                                    ))}
                                    {user && (
                                      <div className="flex gap-2 pt-2">
                                        <input
                                          className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs outline-none"
                                          placeholder="Write a reply..."
                                          value={replyText[note.id] ?? ''}
                                          onChange={e => setReplyText(prev => ({ ...prev, [note.id]: e.target.value }))}
                                          onKeyDown={e => e.key === 'Enter' && postReply(note.id, pKey)}
                                        />
                                        <button
                                          onClick={() => postReply(note.id, pKey)}
                                          className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-700"
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
