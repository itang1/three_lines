'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const initials = user?.user_metadata?.full_name
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    ?? user?.email?.[0].toUpperCase()
    ?? '?'

  return (
    <nav className="flex items-center justify-between px-6 h-12 border-b border-gray-100 bg-white sticky top-0 z-50">
      <Link href="/" className="text-[35px] font-medium font-serif text-gray-900 hover:text-gray-600">
        Three Lines
      </Link>

      <div className="flex items-center gap-5">
        <Link href="/notebook"     className="text-sm text-gray-500 hover:text-gray-900">Notebook</Link>
        <Link href="/instructions" className="text-sm text-gray-500 hover:text-gray-900">Instructions</Link>
        <Link href="/about"        className="text-sm text-gray-500 hover:text-gray-900">About</Link>
        <Link href="/contact"      className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
              {initials}
            </div>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-700">
              Sign out
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-sm px-3 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
