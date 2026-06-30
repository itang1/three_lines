'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'
import { useTheme } from '@/components/ThemeProvider'
import { getBookMeta } from '@/lib/books-index'

type InAppNotification = {
  id: string
  passage_ref: string
  read: boolean
  created_at: string | null
  comments: {
    profiles: { display_name: string } | null
  } | null
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Navbar() {
  const user = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const namePromptRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const [notifications, setNotifications] = useState<InAppNotification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (!user) { setDisplayName(null); setIsAdmin(false); setNotifications([]); return }
    supabase.from('profiles')
      .select('display_name, is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name)
          setIsAdmin(!!data.is_admin)
          if (data.display_name === 'Anonymous') {
            setShowNamePrompt(true)
          }
        }
      })
  }, [user])

  useEffect(() => {
    if (!user) return
    supabase
      .from('notifications')
      .select('id, passage_ref, read, created_at, comments(profiles(display_name))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(15)
      .then(({ data }) => { if (data) setNotifications(data as InAppNotification[]) })
  }, [user])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  const openNotifications = () => {
    setNotifOpen(v => !v)
    if (!notifOpen && unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      supabase.from('notifications')
        .update({ read: true })
        .in('id', unreadIds)
        .then(() => {})
    }
  }

  // Name prompt: Escape to dismiss and trap Tab focus inside the dialog
  useEffect(() => {
    if (!showNamePrompt) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowNamePrompt(false); return }
      if (e.key !== 'Tab') return
      const root = namePromptRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, input, [href], [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showNamePrompt])

  const signOut = async () => {
    await supabase.auth.signOut()
    // useUser's auth subscription clears `user`; the profile effect resets the rest
    setDisplayName(null)
  }

  const saveDisplayName = async () => {
    const name = nameInput.trim()
    if (!name || !user) return
    setNameSaving(true)
    await supabase.from('profiles').update({ display_name: name }).eq('id', user.id)
    setDisplayName(name)
    setShowNamePrompt(false)
    setNameSaving(false)
  }

  const initials = displayName && displayName !== 'Anonymous'
    ? displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.user_metadata?.full_name
        ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      ?? user?.email?.[0].toUpperCase()
      ?? '?'

  const Avatar = (
    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
      {initials}
    </div>
  )

  const formatNotifPassage = (passageRef: string) => {
    const parts = passageRef.split(':')
    const book = getBookMeta(parts[0])
    return `${book?.name ?? parts[0]} ${parts[1]}${parts[2] ? ':' + parts[2] : ''}`
  }

  const notifPassageHref = (passageRef: string) => {
    const [bookId, chapter] = passageRef.split(':')
    return `/notebook/${bookId}/${chapter}#passage-${encodeURIComponent(passageRef)}`
  }

  const relativeTime = (iso: string | null) => {
    if (!iso) return ''
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const BellButton = () => (
    <div ref={notifRef} className="relative">
      <button
        onClick={openNotifications}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        className="relative p-1 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none translate-x-1 -translate-y-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {notifOpen && (
        <div className="absolute right-0 top-full mt-1 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[200]">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifOpen(false)}
                className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Close
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="px-3 py-5 text-xs text-gray-400 dark:text-gray-500 italic text-center">
              No notifications yet.
            </div>
          ) : (
            notifications.map(n => {
              const replier = n.comments?.profiles?.display_name ?? 'Someone'
              return (
                <Link
                  key={n.id}
                  href={notifPassageHref(n.passage_ref)}
                  onClick={() => setNotifOpen(false)}
                  className={`block px-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors ${
                    !n.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                      <span className="font-medium">{replier}</span> replied to your note on{' '}
                      <span className="font-medium">{formatNotifPassage(n.passage_ref)}</span>
                    </p>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                    {relativeTime(n.created_at)}
                  </span>
                </Link>
              )
            })
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-6 h-12">
          <Link href="/" className="text-2xl md:text-[35px] font-medium font-serif text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400">
            Three Lines
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/notebook/john/1" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Notebook</Link>
            <Link href="/instructions"    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Instructions</Link>
            <Link href="/about"           className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">About</Link>
            <Link href="/contact"         className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Contact</Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Moderation</Link>
            )}

            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <BellButton />
                <Link href="/profile" aria-label="Profile" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                  {Avatar}
                  {displayName && displayName !== 'Anonymous' && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">{displayName.split(' ')[0]}</span>
                  )}
                </Link>
                <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Sign out</button>
              </div>
            ) : (
              <Link href="/login" className="text-sm px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile: sign in + dark toggle + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="text-gray-500 dark:text-gray-400 p-1"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <Link href="/profile" aria-label="Profile" className="relative">
                {Avatar}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-bold leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link href="/login" className="text-sm px-3 py-1 rounded border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                Sign in
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex flex-col gap-3 z-50">
            <Link href="/notebook/john/1" className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMenuOpen(false)}>Notebook</Link>
            <Link href="/instructions"    className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMenuOpen(false)}>Instructions</Link>
            <Link href="/about"           className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact"         className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMenuOpen(false)}>Contact</Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMenuOpen(false)}>Moderation</Link>
            )}
            {user && (
              <>
                <Link href="/profile" className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-sm text-gray-400 text-left">
                  Sign out
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Display name prompt — shown once on first login when name is still Anonymous */}
      {showNamePrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 dark:bg-black/50 px-4"
          onClick={() => setShowNamePrompt(false)}
        >
          <div
            ref={namePromptRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="name-prompt-title"
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 w-full max-w-sm"
          >
            <h2 id="name-prompt-title" className="text-xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-1">What should we call you?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Your display name appears next to your notes in community view.
            </p>
            <input
              type="text"
              autoFocus
              placeholder="Your name"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveDisplayName()}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
            />
            <div className="flex gap-2">
              <button
                onClick={saveDisplayName}
                disabled={nameSaving || !nameInput.trim()}
                className="btn-primary disabled:opacity-40"
              >
                {nameSaving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setShowNamePrompt(false)}
                className="btn-secondary"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
