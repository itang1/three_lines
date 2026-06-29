'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useTheme } from '@/components/ThemeProvider'
import type { User } from '@supabase/supabase-js'

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
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setDisplayName(null); return }
    supabase.from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name)
          if (data.display_name === 'Anonymous') {
            setShowNamePrompt(true)
          }
        }
      })
  }, [user])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
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
    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
      {initials}
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

            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" aria-label="Profile">
                  {Avatar}
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
              <Link href="/profile" aria-label="Profile">
                {Avatar}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 dark:bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 w-full max-w-sm">
            <h2 className="text-xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-1">What should we call you?</h2>
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
