'use client'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Book } from '@/lib/books-index'
import { TRANSLATIONS } from '../types'

type Params = {
  book: Book
  urlChapter: number
  setTranslation: (fn: (t: string) => string) => void
}

type Result = {
  activeChapter: number
  setActiveChapter: (ch: number) => void
  scrollToChapter: (chNum: number) => void
  chapterRefs: RefObject<Map<number, HTMLElement>>
  chunkRefs: RefObject<Map<string, HTMLElement>>
  activeChunk: string | null
  scrollContainer: RefObject<HTMLDivElement>
  bookSelectRef: RefObject<HTMLButtonElement>
}

// Owns the continuous-scroll reading position: which chapter is active, the
// scroll/keyboard navigation, and keeping the URL + tab title in sync. The
// active book comes from the server-rendered route, so book changes arrive as
// a new `book` prop rather than client state.
export function useChapterScroll({ book, urlChapter, setTranslation }: Params): Result {
  const bookId = book.id
  const [activeChapter, setActiveChapter] = useState(urlChapter)
  const [activeChunk, setActiveChunk] = useState<string | null>(null)

  const chapterRefs     = useRef<Map<number, HTMLElement>>(new Map())
  const chunkRefs       = useRef<Map<string, HTMLElement>>(new Map())
  const scrollContainer = useRef<HTMLDivElement>(null)
  const bookSelectRef   = useRef<HTMLButtonElement>(null)
  // Tracks the book we last laid out, to tell first mount from a book change.
  const prevBookId = useRef<string | null>(null)

  const scrollToChapter = (chNum: number) => {
    setActiveChapter(chNum)
    window.history.replaceState(null, '', `/notebook/${bookId}/${chNum}`)
    chapterRefs.current.get(chNum)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // On book change, land on the chapter named by the URL (chapter 1 for forward
  // navigation; the saved chapter for browser back/forward or cross-book jumps).
  // First mount starts at the top.
  useEffect(() => {
    const firstMount = prevBookId.current === null
    prevBookId.current = bookId

    if (firstMount) {
      setActiveChapter(1)
      scrollContainer.current?.scrollTo({ top: 0 })
      return
    }

    const target = urlChapter
    // Allow the new book's chapter refs to register before scrolling
    const id = setTimeout(() => {
      const el = chapterRefs.current.get(target)
      if (el && target > 1) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' })
        setActiveChapter(target)
      } else {
        scrollContainer.current?.scrollTo({ top: 0 })
        setActiveChapter(1)
      }
    }, 100)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Scroll listener: update active chapter + URL (replaceState avoids polluting history),
  // and which chunk within that chapter is active (drives the chunk scrollspy dots).
  useEffect(() => {
    const container = scrollContainer.current
    if (!container) return
    let lastChapter = activeChapter
    let lastChunk = activeChunk
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

      // Scrolled to (or near) the bottom of the page: the last chunk's top can
      // never cross the threshold if there isn't enough room left to scroll it
      // there, so fall back to whichever chunk is last in the chapter.
      const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 4

      const prefix = `${bookId}:${current}:`
      let currentChunk: string | null = null
      let firstChunkInChapter: string | null = null
      let lastChunkInChapter: string | null = null
      chunkRefs.current.forEach((el, key) => {
        if (!key.startsWith(prefix)) return
        if (firstChunkInChapter === null) firstChunkInChapter = key
        lastChunkInChapter = key
        const top = el.getBoundingClientRect().top - containerTop
        if (top <= 80) currentChunk = key
      })
      const resolvedChunk = atBottom ? (lastChunkInChapter ?? firstChunkInChapter) : (currentChunk ?? firstChunkInChapter)
      if (resolvedChunk !== lastChunk) {
        lastChunk = resolvedChunk
        setActiveChunk(resolvedChunk)
      }
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Keep browser tab title in sync with the active chapter as the user scrolls
  useEffect(() => {
    document.title = `${book.name} ${activeChapter} | Three Lines`
  }, [book.name, activeChapter])

  // Keyboard shortcuts: j/→ next chapter, k/← prev chapter, / focus book selector, t cycle translation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Skip when typing, when a control has focus (so pressing a key right
      // after clicking a button doesn't fire a shortcut), or with a modifier.
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return
      if (target.isContentEditable) return
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapter, book.chapters.length, bookId])

  return { activeChapter, setActiveChapter, scrollToChapter, chapterRefs, chunkRefs, activeChunk, scrollContainer, bookSelectRef }
}
