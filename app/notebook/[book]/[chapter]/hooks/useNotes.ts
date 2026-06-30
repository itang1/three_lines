'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

type Params = {
  user: User | null
  bookId: string
  supabase: SupabaseClient<Database>
  notesPublicDefault: boolean
}

type Result = {
  notes: Record<string, string>
  noteVisibility: Record<string, boolean>
  myNoteIds: Set<string>
  chaptersWithNotesLive: Set<number>
  confirmDelete: string | null
  setConfirmDelete: (key: string | null) => void
  handleNoteChange: (passageRef: string, trackId: string, value: string) => void
  toggleNoteVisibility: (passageRef: string) => Promise<void>
  deleteChunkNotes: (passageRef: string) => Promise<void>
}

// Owns the viewer's own study notes: loading them for the active book, the
// debounced autosave, per-passage visibility, deletion, and progress dots.
export function useNotes({ user, bookId, supabase, notesPublicDefault }: Params): Result {
  const [notes, setNotes]                   = useState<Record<string, string>>({})
  const [noteVisibility, setNoteVisibility] = useState<Record<string, boolean>>({})
  const [myNoteIds, setMyNoteIds]           = useState<Set<string>>(new Set())
  const [chaptersWithNotes, setChaptersWithNotes] = useState<Set<number>>(new Set())
  const [confirmDelete, setConfirmDelete]   = useState<string | null>(null)

  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Load which chapters have notes (progress dots)
  useEffect(() => {
    if (!user) return
    supabase.from('notes')
      .select('passage_ref')
      .eq('user_id', user.id)
      .like('passage_ref', `${bookId}:%`)
      .neq('content', '')
      .then(({ data }) => {
        if (!data) return
        const chNums = new Set<number>()
        data.forEach(n => {
          const ch = parseInt(n.passage_ref.split(':')[1])
          if (!isNaN(ch)) chNums.add(ch)
        })
        setChaptersWithNotes(chNums)
      })
  }, [user, bookId])

  // Live progress: reflect notes typed in the current session before save
  const chaptersWithNotesLive = useMemo(() => {
    const live = new Set(chaptersWithNotes)
    Object.entries(notes).forEach(([key, val]) => {
      if (!val.trim() || !key.startsWith(`${bookId}:`)) return
      const ch = parseInt(key.split(':')[1])
      if (!isNaN(ch)) live.add(ch)
    })
    return live
  }, [chaptersWithNotes, notes, bookId])

  // Clear stale notes when book changes, then load all notes for the new book
  useEffect(() => {
    setNotes({})
    setNoteVisibility({})
  }, [bookId])

  useEffect(() => {
    if (!user) return
    supabase.from('notes')
      .select('passage_ref, track_id, content, is_public')
      .eq('user_id', user.id)
      .like('passage_ref', `${bookId}:%`)
      .then(({ data }) => {
        if (!data) return
        const map: Record<string, string> = {}
        const visMap: Record<string, boolean> = {}
        data.forEach(n => {
          map[`${n.passage_ref}|${n.track_id}`] = n.content
          visMap[n.passage_ref] = n.is_public
        })
        setNotes(prev => ({ ...prev, ...map }))
        setNoteVisibility(prev => ({ ...prev, ...visMap }))
      })
  }, [user, bookId])

  // Track the viewer's own note IDs (own data only — no cross-user exposure)
  useEffect(() => {
    if (!user) { setMyNoteIds(new Set()); return }
    supabase.from('notes')
      .select('id')
      .eq('user_id', user.id)
      .then(({ data }) => { if (data) setMyNoteIds(new Set(data.map(n => n.id))) })
  }, [user])

  const handleNoteChange = (passageRef: string, trackId: string, value: string) => {
    const key = `${passageRef}|${trackId}`
    setNotes(prev => ({ ...prev, [key]: value }))
    if (!user) return
    const effectivePublic = noteVisibility[passageRef] ?? notesPublicDefault
    setNoteVisibility(prev => prev[passageRef] !== undefined ? prev : { ...prev, [passageRef]: effectivePublic })
    clearTimeout(saveTimers.current[key])
    saveTimers.current[key] = setTimeout(async () => {
      const { error } = await supabase.from('notes').upsert({
        user_id: user.id,
        passage_ref: passageRef,
        track_id: trackId,
        content: value,
        is_public: effectivePublic,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,passage_ref,track_id' })
      if (error) console.error('[three-lines] note save failed:', error)
    }, 800)
  }

  const toggleNoteVisibility = async (passageRef: string) => {
    if (!user) return
    const next = !(noteVisibility[passageRef] ?? notesPublicDefault)
    setNoteVisibility(prev => ({ ...prev, [passageRef]: next }))
    await supabase.from('notes')
      .update({ is_public: next, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('passage_ref', passageRef)
  }

  // Delete every line a user wrote for one passage chunk, then clear it locally
  const deleteChunkNotes = async (passageRef: string) => {
    if (!user) return
    setConfirmDelete(null)
    // Cancel any pending debounced saves for this passage so they don't re-create rows
    Object.keys(saveTimers.current).forEach(key => {
      if (key.startsWith(`${passageRef}|`)) clearTimeout(saveTimers.current[key])
    })
    setNotes(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(key => { if (key.startsWith(`${passageRef}|`)) delete next[key] })
      return next
    })
    setNoteVisibility(prev => {
      const next = { ...prev }
      delete next[passageRef]
      return next
    })
    const { error } = await supabase.from('notes')
      .delete()
      .eq('user_id', user.id)
      .eq('passage_ref', passageRef)
    if (error) console.error('[three-lines] note delete failed:', error)
  }

  return {
    notes, noteVisibility, myNoteIds, chaptersWithNotesLive,
    confirmDelete, setConfirmDelete,
    handleNoteChange, toggleNoteVisibility, deleteChunkNotes,
  }
}
