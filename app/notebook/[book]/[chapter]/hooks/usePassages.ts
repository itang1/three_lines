'use client'
import { useState, useEffect, useRef, useCallback, type RefObject } from 'react'
import { getChapter } from '@/lib/data'

type Params = {
  bookId: string
  translation: string
  showVerseNumbers: boolean
  chapterRefs: RefObject<Map<number, HTMLElement>>
}

type Result = {
  // passage text keyed by "esvRef|translation|vn"
  passageTexts: Record<string, string>
  loadingPassages: Set<string>
}

// Lazy-loads passage text per chapter chunk as sections scroll into view,
// deduping requests and clearing the cache when the book or rendering prefs change.
export function usePassages({ bookId, translation, showVerseNumbers, chapterRefs }: Params): Result {
  const [passageTexts, setPassageTexts]       = useState<Record<string, string>>({})
  const [loadingPassages, setLoadingPassages] = useState<Set<string>>(new Set())
  const requestedChunks = useRef<Set<string>>(new Set())

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

  // Reset cache on book change, and on translation / verse-number pref changes
  useEffect(() => {
    requestedChunks.current.clear()
    setPassageTexts({})
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
    chapterRefs.current?.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [bookId, fetchChunk])

  return { passageTexts, loadingPassages }
}
