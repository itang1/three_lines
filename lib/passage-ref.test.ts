import { describe, it, expect } from 'vitest'
import { toApiBiblePassageId } from './passage-ref'

describe('toApiBiblePassageId', () => {
  it('converts a single-chapter verse range', () => {
    expect(toApiBiblePassageId('John 1:1-18')).toBe('JHN.1.1-JHN.1.18')
  })

  it('converts a single verse', () => {
    expect(toApiBiblePassageId('John 3:16')).toBe('JHN.3.16')
  })

  it('converts a whole chapter', () => {
    expect(toApiBiblePassageId('Exodus 5')).toBe('EXO.5')
  })

  it('converts a cross-chapter range', () => {
    expect(toApiBiblePassageId('John 1:1-2:3')).toBe('JHN.1.1-JHN.2.3')
  })

  it('handles multi-word book names', () => {
    expect(toApiBiblePassageId('1 Corinthians 13:4-7')).toBe('1CO.13.4-1CO.13.7')
    expect(toApiBiblePassageId('Song of Solomon 2:1')).toBe('SNG.2.1')
  })

  it('maps Psalm singular to PSA', () => {
    expect(toApiBiblePassageId('Psalm 23')).toBe('PSA.23')
  })

  it('returns null for an unknown book', () => {
    expect(toApiBiblePassageId('Nephi 1:1')).toBeNull()
  })

  it('returns null for an unparseable ref', () => {
    expect(toApiBiblePassageId('not a reference')).toBeNull()
    expect(toApiBiblePassageId('')).toBeNull()
  })
})
