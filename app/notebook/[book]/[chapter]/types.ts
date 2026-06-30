export type Mode = 'study' | 'community'

export type CommunityScope = 'book' | 'all' | 'top'

export type CommunityNote = {
  id: string
  passage_ref: string
  track_id: string
  content: string
  updated_at: string | null
  profiles: { display_name: string }
}

export type Reply = {
  id: string
  user_id: string
  content: string
  created_at: string | null
  profiles: { display_name: string }
}

export type TopPassage = { passage_ref: string; notes: number; lines: number }

export type SearchResult = { passage_ref: string; track_id: string; content: string }

// A renderable note line — the fixed TRACKS plus the user's optional custom line.
export type Track = { id: string; label: string; dot: string; placeholder: string }

export const THEME_DOT = '#0891B2'

export const TRANSLATIONS = ['ESV', 'KJV', 'NIV', 'CEV']

// notes are keyed "<book>:<chapter>:<chunkRef>" and lines "<passageRef>|<trackId>"
export const passageKey = (bookId: string, ch: number, ref: string) => `${bookId}:${ch}:${ref}`
