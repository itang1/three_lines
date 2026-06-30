'use client'
import { useState, useEffect, useRef } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import type { SearchResult } from '../types'

// Escape LIKE metacharacters so a query containing % or _ matches literally
// instead of acting as a wildcard.
const escapeLike = (s: string) => s.replace(/[\\%_]/g, m => `\\${m}`)

type Params = {
  user: User | null
  supabase: SupabaseClient<Database>
}

type Result = {
  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: SearchResult[]
  searchLoading: boolean
}

// Debounced full-text-ish search over the signed-in user's own note content.
export function useNoteSearch({ user, supabase }: Params): Result {
  const [searchQuery, setSearchQuery]     = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(searchTimer.current)
    const q = searchQuery.trim()
    if (!q) { setSearchResults([]); setSearchLoading(false); return }
    if (!user) { setSearchLoading(false); return }
    setSearchLoading(true)
    searchTimer.current = setTimeout(async () => {
      const { data, error } = await supabase.from('notes')
        .select('passage_ref, track_id, content')
        .eq('user_id', user.id)
        .ilike('content', `%${escapeLike(q)}%`)
        .neq('content', '')
        .order('passage_ref')
        .limit(30)
      if (error) console.error('[three-lines] search query failed:', error)
      setSearchResults(data ?? [])
      setSearchLoading(false)
    }, 300)
  }, [searchQuery, user])

  return { searchQuery, setSearchQuery, searchResults, searchLoading }
}
