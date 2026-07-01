'use client'
import { useState, useEffect } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

type Params = {
  user: User | null
  supabase: SupabaseClient<Database>
}

// Per-book chapter coverage: bookId -> set of chapter numbers that have notes.
export function useBookProgress({ user, supabase }: Params) {
  const [bookChapters, setBookChapters] = useState<Record<string, Set<number>>>({})

  useEffect(() => {
    if (!user) { setBookChapters({}); return }
    supabase.from('notes')
      .select('passage_ref')
      .eq('user_id', user.id)
      .neq('content', '')
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, Set<number>> = {}
        data.forEach(n => {
          const [bookId, chStr] = n.passage_ref.split(':')
          const ch = parseInt(chStr)
          if (bookId && !isNaN(ch)) {
            if (!map[bookId]) map[bookId] = new Set()
            map[bookId].add(ch)
          }
        })
        setBookChapters(map)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return bookChapters
}
