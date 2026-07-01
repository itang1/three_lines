'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

// Single source of truth for the signed-in user. Subscribes once to auth
// changes; replaces the getUser + onAuthStateChange block duplicated across
// Navbar and NotebookClient.
export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    // getSession() reads the cached session (cookie/local storage) instead of
    // round-tripping to the auth server like getUser() does, so the signed-in
    // state resolves immediately instead of flashing "signed out" UI first.
    // onAuthStateChange re-fires with the verified session right after.
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return user
}
