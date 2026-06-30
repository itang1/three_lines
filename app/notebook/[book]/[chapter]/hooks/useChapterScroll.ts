'use client'
import { useEffect, useRef, useState, type RefObject } from 'react'
import type { Book } from '@/lib/data'
import { TRANSLATIONS } from '../types'

type Params = {
  bookId: string
  book: Book
  urlBook: string
  urlChapter: number
  setBookId: (id: string) => void
  setTranslation: (fn: (t: string) => string) => void
}

type Result = {
  activeChapter: number
  setActiveChapter: (ch: number) => void
  scrollToChapter: (chNum: number) => void
  chapterRefs: RefObject<Map<number, HTMLElement>>
  scrollContainer: RefObject<HTMLDivElement>
  bookSelectRef: RefObject<HTMLSelectElement>
}

// Owns the continuous-scroll reading position: which chapter is active, the
// scroll/keyboard navigation, and keeping the URL + tab title in sync.
export function useChapterScroll({
  bookId, book, urlBook, urlChapter, setBookId, setTranslation,
}: Params): Result {
  const [activeChapter, setActiveChapter] = useState(urlChapter)

  const chapterRefs     = useRef<Map<number, HTMLElement>>(new Map())
  const scrollContainer = useRef<HTMLDivElement>(null)
  const bookSelectRef   = useRef<HTMLSelectElement>(null)
  // Chapter to scroll to after the next book-change render cycle
  const pendingScrollChapter = useRef<number | null>(null)

  const scrollToChapter = (chNum: number) => {
    setActiveChapter(chNum)
    window.history.replaceState(null, '', `/notebook/${bookId}/${chNum}`)
    chapterRefs.current.get(chNum)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Handle browser back/forward: sync bookId state with URL params
  useEffect(() => {
    if (urlBook === bookId) return
    // Back/forward navigation changed the book — note which chapter to land on
    pendingScrollChapter.current = urlChapter
    setBookId(urlBook)
  }, [urlBook])

  // On book change: reset scroll. If a back-nav set a pending chapter, scroll there instead.
  useEffect(() => {
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

  // Keyboard shortcuts: j/→ next chapter, k/← prev chapter, / focus book selector, t cycle translation
  useEffect(() => {
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

  return { activeChapter, setActiveChapter, scrollToChapter, chapterRefs, scrollContainer, bookSelectRef }
}
