import { describe, it, expect } from 'vitest'
import { BOOKS, TRACKS, getBook, getChapter } from './data'

describe('getBook', () => {
  it('finds a book by id', () => {
    expect(getBook('john')?.name).toBe('John')
  })

  it('returns undefined for an unknown id', () => {
    expect(getBook('nope')).toBeUndefined()
  })
})

describe('getChapter', () => {
  it('returns the chapter with its chunks', () => {
    const ch = getChapter('john', 1)
    expect(ch?.ch).toBe(1)
    expect(ch?.chunks.length).toBeGreaterThan(0)
    expect(ch?.chunks[0]).toHaveProperty('esvRef')
  })

  it('returns undefined for a missing chapter or book', () => {
    expect(getChapter('john', 9999)).toBeUndefined()
    expect(getChapter('nope', 1)).toBeUndefined()
  })
})

describe('BOOKS data integrity', () => {
  it('has 66 books', () => {
    expect(BOOKS.length).toBe(66)
  })

  it('every book has unique sequential chapters starting at 1', () => {
    for (const book of BOOKS) {
      const numbers = book.chapters.map(c => c.ch)
      expect(numbers[0]).toBe(1)
      expect(new Set(numbers).size).toBe(numbers.length)
    }
  })

  it('every chunk has a non-empty ref and esvRef', () => {
    for (const book of BOOKS) {
      for (const chapter of book.chapters) {
        for (const chunk of chapter.chunks) {
          expect(chunk.ref).toBeTruthy()
          expect(chunk.esvRef).toBeTruthy()
        }
      }
    }
  })

  it('exposes the six fixed tracks', () => {
    expect(TRACKS.map(t => t.id)).toEqual([
      'event', 'reactions', 'thoughts', 'historical', 'literary', 'comparative',
    ])
  })
})
