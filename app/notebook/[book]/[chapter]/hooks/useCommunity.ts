'use client'
import { useState, useEffect } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import type { Mode, CommunityScope, CommunityNote, Reply, TopPassage } from '../types'

type Params = {
  mode: Mode
  bookId: string
  communityScope: CommunityScope
  supabase: SupabaseClient<Database>
  user: User | null
}

type Result = {
  communityNotes: CommunityNote[]
  allNotes: CommunityNote[]
  allNotesLoading: boolean
  allNotesHasMore: boolean
  loadMoreAllNotes: () => Promise<void>
  topPassages: TopPassage[]
  topPassagesLoading: boolean
  replies: Record<string, Reply[]>
  openThreads: Set<string>
  toggleThread: (id: string) => void
  replyText: Record<string, string>
  setReplyText: React.Dispatch<React.SetStateAction<Record<string, string>>>
  postReply: (parentId: string, passageRef: string) => Promise<void>
  replyLikeCounts: Record<string, number>
  likedReplyIds: Set<string>
  toggleReplyLike: (replyId: string) => Promise<void>
}

// Owns every community read: the per-book public notes, the cross-book feed
// (paginated), the most-discussed aggregation, and comment threads.
export function useCommunity({ mode, bookId, communityScope, supabase, user }: Params): Result {
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>([])
  const [allNotes, setAllNotes]             = useState<CommunityNote[]>([])
  const [allNotesOffset, setAllNotesOffset] = useState(0)
  const [allNotesLoading, setAllNotesLoading] = useState(false)
  const [allNotesHasMore, setAllNotesHasMore] = useState(false)
  const [topPassages, setTopPassages]       = useState<TopPassage[]>([])
  const [topPassagesLoading, setTopPassagesLoading] = useState(false)
  const [replies, setReplies]         = useState<Record<string, Reply[]>>({})
  const [openThreads, setOpenThreads] = useState<Set<string>>(new Set())
  const [replyText, setReplyText]     = useState<Record<string, string>>({})
  const [replyLikeCounts, setReplyLikeCounts] = useState<Record<string, number>>({})
  const [likedReplyIds, setLikedReplyIds]     = useState<Set<string>>(new Set())

  // Load community notes for the current book
  useEffect(() => {
    if (mode !== 'community' || communityScope !== 'book') return
    supabase.from('notes')
      .select('id, passage_ref, track_id, content, updated_at, profiles(display_name)')
      .like('passage_ref', `${bookId}:%`)
      .eq('is_public', true)
      .neq('content', '')
      .order('updated_at', { ascending: false })
      .then(({ data }) => { if (data) setCommunityNotes(data) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, bookId, communityScope])

  // Load community notes across all books
  useEffect(() => {
    if (mode !== 'community' || communityScope !== 'all') return
    setAllNotes([])
    setAllNotesOffset(0)
    setAllNotesHasMore(false)
    setAllNotesLoading(true)
    supabase.from('notes')
      .select('id, passage_ref, track_id, content, updated_at, profiles(display_name)')
      .eq('is_public', true)
      .neq('content', '')
      .order('updated_at', { ascending: false })
      .range(0, 49)
      .then(({ data }) => {
        const results = data ?? []
        setAllNotes(results)
        setAllNotesHasMore(results.length === 50)
        setAllNotesLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, communityScope])

  // Load most-discussed passages. The route aggregates server-side (so user_id
  // stays in the DB) and enriches each row with display info from the
  // server-only pericope data.
  useEffect(() => {
    if (mode !== 'community' || communityScope !== 'top') return
    setTopPassages([])
    setTopPassagesLoading(true)
    fetch('/api/top-passages')
      .then(r => r.json())
      .then(({ rows }) => setTopPassages((rows ?? []) as TopPassage[]))
      .catch(() => setTopPassages([]))
      .finally(() => setTopPassagesLoading(false))
  }, [mode, communityScope])

  const loadReplies = async (commentId: string) => {
    const { data } = await supabase.from('comments')
      .select('id, user_id, content, created_at, profiles(display_name)')
      .eq('parent_id', commentId)
      .order('created_at', { ascending: true })
    if (data) setReplies(prev => ({ ...prev, [commentId]: data }))

    const replyIds = (data ?? []).map(r => r.id)
    if (replyIds.length === 0) return
    const { data: likes } = await supabase.from('comment_likes')
      .select('comment_id, user_id')
      .in('comment_id', replyIds)
    if (!likes) return

    setReplyLikeCounts(prev => {
      const next = { ...prev }
      for (const id of replyIds) next[id] = 0
      for (const like of likes) next[like.comment_id] = (next[like.comment_id] ?? 0) + 1
      return next
    })
    setLikedReplyIds(prev => {
      const next = new Set(prev)
      for (const id of replyIds) next.delete(id)
      if (user) for (const like of likes) if (like.user_id === user.id) next.add(like.comment_id)
      return next
    })
  }

  const toggleReplyLike = async (replyId: string) => {
    if (!user) return
    const isLiked = likedReplyIds.has(replyId)

    setLikedReplyIds(prev => {
      const next = new Set(prev)
      isLiked ? next.delete(replyId) : next.add(replyId)
      return next
    })
    setReplyLikeCounts(prev => ({ ...prev, [replyId]: Math.max(0, (prev[replyId] ?? 0) + (isLiked ? -1 : 1)) }))

    if (isLiked) {
      await supabase.from('comment_likes').delete().eq('comment_id', replyId).eq('user_id', user.id)
    } else {
      await supabase.from('comment_likes')
        .upsert({ comment_id: replyId, user_id: user.id }, { onConflict: 'comment_id,user_id' })
    }
  }

  const toggleThread = (id: string) => {
    setOpenThreads(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id); loadReplies(id) }
      return next
    })
  }

  const postReply = async (parentId: string, passageRef: string) => {
    const content = replyText[parentId]?.trim()
    if (!content) return
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ passage_ref: passageRef, track_id: 'thoughts', content, parent_id: parentId }),
    })
    if (!res.ok) return
    setReplyText(prev => ({ ...prev, [parentId]: '' }))
    loadReplies(parentId)
  }

  const loadMoreAllNotes = async () => {
    const next = allNotesOffset + 50
    setAllNotesOffset(next)
    setAllNotesLoading(true)
    const { data } = await supabase.from('notes')
      .select('id, passage_ref, track_id, content, updated_at, profiles(display_name)')
      .eq('is_public', true)
      .neq('content', '')
      .order('updated_at', { ascending: false })
      .range(next, next + 49)
    const results = data ?? []
    setAllNotes(prev => [...prev, ...results])
    setAllNotesHasMore(results.length === 50)
    setAllNotesLoading(false)
  }

  return {
    communityNotes,
    allNotes, allNotesLoading, allNotesHasMore, loadMoreAllNotes,
    topPassages, topPassagesLoading,
    replies, openThreads, toggleThread,
    replyText, setReplyText, postReply,
    replyLikeCounts, likedReplyIds, toggleReplyLike,
  }
}
