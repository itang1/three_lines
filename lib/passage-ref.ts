// OSIS book codes used by API.Bible passage IDs.
export const OSIS_CODES: Record<string, string> = {
  Genesis: 'GEN', Exodus: 'EXO', Leviticus: 'LEV', Numbers: 'NUM',
  Deuteronomy: 'DEU', Joshua: 'JOS', Judges: 'JDG', Ruth: 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', Ezra: 'EZR', Nehemiah: 'NEH',
  Esther: 'EST', Job: 'JOB', Psalms: 'PSA', Psalm: 'PSA', Proverbs: 'PRO',
  Ecclesiastes: 'ECC', 'Song of Solomon': 'SNG', Isaiah: 'ISA', Jeremiah: 'JER',
  Lamentations: 'LAM', Ezekiel: 'EZK', Daniel: 'DAN', Hosea: 'HOS',
  Joel: 'JOL', Amos: 'AMO', Obadiah: 'OBA', Jonah: 'JON', Micah: 'MIC',
  Nahum: 'NAH', Habakkuk: 'HAB', Zephaniah: 'ZEP', Haggai: 'HAG',
  Zechariah: 'ZEC', Malachi: 'MAL', Matthew: 'MAT', Mark: 'MRK',
  Luke: 'LUK', John: 'JHN', Acts: 'ACT', Romans: 'ROM',
  '1 Corinthians': '1CO', '2 Corinthians': '2CO', Galatians: 'GAL',
  Ephesians: 'EPH', Philippians: 'PHP', Colossians: 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI',
  '2 Timothy': '2TI', Titus: 'TIT', Philemon: 'PHM', Hebrews: 'HEB',
  James: 'JAS', '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN',
  '2 John': '2JN', '3 John': '3JN', Jude: 'JUD', Revelation: 'REV',
}

// Converts a human passage ref to an API.Bible passage id. Examples:
//   "John 1:1-18"   -> "JHN.1.1-JHN.1.18"   (verse range, single chapter)
//   "John 1:1-2:3"  -> "JHN.1.1-JHN.2.3"    (cross-chapter range)
//   "John 1:1"      -> "JHN.1.1"            (single verse)
//   "Exodus 5"      -> "EXO.5"              (whole chapter)
// Returns null for unknown books or unparseable refs.
export function toApiBiblePassageId(ref: string): string | null {
  // Cross-chapter range: "John 1:1-2:3"
  const crossMatch = ref.match(/^(.+?)\s+(\d+):(\d+)-(\d+):(\d+)$/)
  if (crossMatch) {
    const [, bookName, startCh, startVerse, endCh, endVerse] = crossMatch
    const code = OSIS_CODES[bookName]
    if (!code) return null
    return `${code}.${startCh}.${startVerse}-${code}.${endCh}.${endVerse}`
  }

  // Single chapter: verse or verse range — "John 1:1" / "John 1:1-18"
  const verseMatch = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/)
  if (verseMatch) {
    const [, bookName, chapter, startVerse, endVerse] = verseMatch
    const code = OSIS_CODES[bookName]
    if (!code) return null
    const start = `${code}.${chapter}.${startVerse}`
    return endVerse ? `${start}-${code}.${chapter}.${endVerse}` : start
  }

  // Whole chapter: "Exodus 5"
  const chapterMatch = ref.match(/^(.+?)\s+(\d+)$/)
  if (chapterMatch) {
    const [, bookName, chapter] = chapterMatch
    const code = OSIS_CODES[bookName]
    if (!code) return null
    return `${code}.${chapter}`
  }

  return null
}
