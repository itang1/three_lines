'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

const LS_KEY = 'three-lines:bookmarks'

type Params = {
  user: User | null
  bookId: string
  supabase: SupabaseClient<Database>
}

type Result = {
  bookmarks: Set<string>
  bookmarkedChapters: Set<number>
  toggleBookmark: (passageRef: string) => Promise<void>
}

export function useBookmarks({ user, bookId, supabase }: Params): Result {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      supabase.from('bookmarks')
        .select('passage_ref')
        .eq('user_id', user.id)
        .like('passage_ref', `${bookId}:%`)
        .then(({ data }) => {
          if (data) setBookmarks(new Set(data.map(b => b.passage_ref)))
        })
    } else {
      try {
        const raw = localStorage.getItem(LS_KEY)
        if (raw) {
          const all: string[] = JSON.parse(raw)
          setBookmarks(new Set(all.filter(ref => ref.startsWith(`${bookId}:`))))
        } else {
          setBookmarks(new Set())
        }
      } catch {
        setBookmarks(new Set())
      }
    }
  }, [user, bookId])

  const toggleBookmark = useCallback(async (passageRef: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      prev.has(passageRef) ? next.delete(passageRef) : next.add(passageRef)
      return next
    })

    const removing = bookmarks.has(passageRef)

    if (user) {
      if (removing) {
        await supabase.from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('passage_ref', passageRef)
      } else {
        await supabase.from('bookmarks')
          .upsert({ user_id: user.id, passage_ref: passageRef }, { onConflict: 'user_id,passage_ref' })
      }
    } else {
      try {
        const raw = localStorage.getItem(LS_KEY)
        const all: string[] = raw ? JSON.parse(raw) : []
        const updated = removing
          ? all.filter(r => r !== passageRef)
          : [...all, passageRef]
        localStorage.setItem(LS_KEY, JSON.stringify(updated))
      } catch {}
    }
  }, [bookmarks, user, supabase])

  const bookmarkedChapters = useMemo(() => {
    const set = new Set<number>()
    bookmarks.forEach(ref => {
      const ch = parseInt(ref.split(':')[1])
      if (!isNaN(ch)) set.add(ch)
    })
    return set
  }, [bookmarks])

  return { bookmarks, bookmarkedChapters, toggleBookmark }
}
