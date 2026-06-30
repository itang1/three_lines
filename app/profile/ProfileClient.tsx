'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Stats = {
  noteCount: number
  lineCount: number
  bookCount: number
  chapterCount: number
}

export default function ProfileClient() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [notesPublicDefault, setNotesPublicDefault] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }

      const [{ data: profile }, { data: notes }] = await Promise.all([
        supabase.from('profiles')
          .select('display_name, notes_public_default')
          .eq('id', user.id)
          .single(),
        supabase.from('notes')
          .select('passage_ref')
          .eq('user_id', user.id)
          .neq('content', ''),
      ])

      if (profile) {
        setDisplayName(profile.display_name)
        setNameInput(profile.display_name)
        setNotesPublicDefault(profile.notes_public_default ?? false)
      }

      if (notes) {
        // One note per chunk (passage_ref); lines are the individual tracks within.
        const passages = new Set(notes.map(n => n.passage_ref))
        const books = new Set(notes.map(n => n.passage_ref.split(':')[0]))
        const chapters = new Set(notes.map(n => n.passage_ref.split(':').slice(0, 2).join(':')))
        setStats({ noteCount: passages.size, lineCount: notes.length, bookCount: books.size, chapterCount: chapters.size })
      }

      setLoading(false)
    })
  }, [])

  const saveName = async () => {
    const name = nameInput.trim()
    if (!name || name === displayName) return
    setNameSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ display_name: name }).eq('id', user.id)
      setDisplayName(name)
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    }
    setNameSaving(false)
  }

  const [applyingToAll, setApplyingToAll] = useState(false)
  const [appliedToAll, setAppliedToAll]   = useState(false)
  const [confirmApplyAll, setConfirmApplyAll] = useState(false)

  const togglePrivacyDefault = async (val: boolean) => {
    setNotesPublicDefault(val)
    setAppliedToAll(false)
    setConfirmApplyAll(false)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ notes_public_default: val }).eq('id', user.id)
    }
  }

  const applyDefaultToAllNotes = async () => {
    setApplyingToAll(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('notes')
        .update({ is_public: notesPublicDefault, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
    }
    setApplyingToAll(false)
    setConfirmApplyAll(false)
    setAppliedToAll(true)
    setTimeout(() => setAppliedToAll(false), 2500)
  }

  const deleteAccount = async () => {
    setDeleting(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) { setError('Not signed in.'); setDeleting(false); return }

    const res = await fetch('/api/account', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong.')
      setDeleting(false)
      return
    }
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return <div className="max-w-xl mx-auto px-6 py-16 text-sm text-gray-400">Loading…</div>
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-10">Profile</h1>

      {/* Display name */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Display name</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          Shown next to your notes in community view.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveName()}
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={saveName}
            disabled={nameSaving || !nameInput.trim() || nameInput.trim() === displayName}
            className="btn-primary disabled:opacity-40"
          >
            {nameSaved ? 'Saved' : nameSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </section>

      {/* Sharing default */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Community sharing</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notesPublicDefault}
            onChange={e => togglePrivacyDefault(e.target.checked)}
            className="w-4 h-4 accent-gray-800 dark:accent-gray-300"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Share new notes with the community by default
          </span>
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          {notesPublicDefault
            ? 'New notes will be shared with the community automatically.'
            : 'New notes will stay private.'}
          {' '}Existing notes are unchanged. Use the Share button on any passage to set it individually.
        </p>
        {stats && stats.noteCount > 0 && (
          <div className="mt-3">
            {appliedToAll ? (
              <span className="text-sm text-green-700 dark:text-green-400">✓ All notes updated</span>
            ) : !confirmApplyAll ? (
              <button
                onClick={() => setConfirmApplyAll(true)}
                className="text-sm text-gray-700 dark:text-gray-300 underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {notesPublicDefault
                  ? 'Also make all my existing notes public'
                  : 'Also make all my existing notes private'}
              </button>
            ) : (
              <div className={`rounded-md border p-3 text-sm ${
                notesPublicDefault
                  ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40'
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800/40 dark:border-gray-700'
              }`}>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {notesPublicDefault
                    ? `This will make all ${stats.noteCount} of your notes visible to the community, including any you have kept private. You can still change individual passages afterward.`
                    : `This will hide all ${stats.noteCount} of your notes from the community. You can still re-share individual passages afterward.`}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={applyDefaultToAllNotes}
                    disabled={applyingToAll}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium text-white disabled:opacity-50 transition-colors ${
                      notesPublicDefault
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white'
                    }`}
                  >
                    {applyingToAll
                      ? 'Applying…'
                      : notesPublicDefault
                        ? `Yes, make all ${stats.noteCount} public`
                        : `Yes, make all ${stats.noteCount} private`}
                  </button>
                  <button
                    onClick={() => setConfirmApplyAll(false)}
                    disabled={applyingToAll}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Reading stats */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Reading stats</h2>
        {stats ? (
          <div className="flex gap-8 text-sm">
            <div>
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100">{stats.noteCount}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stats.noteCount === 1 ? 'note written' : 'notes written'}</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100">{stats.lineCount}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stats.lineCount === 1 ? 'line written' : 'lines written'}</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100">{stats.chapterCount}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">chapters covered</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100">{stats.bookCount}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stats.bookCount === 1 ? 'book' : 'books'}</div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No notes yet.</p>
        )}
      </section>

      {/* Danger zone */}
      <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
        <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Delete account</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Permanently deletes your account and all notes. This cannot be undone.
        </p>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2 rounded-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={deleteAccount}
              disabled={deleting}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Yes, delete everything'}
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
