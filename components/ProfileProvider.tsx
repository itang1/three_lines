'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

export type ProfileData = {
  display_name: string
  preferred_translation: string
  notes_public_default: boolean
  theme_track_label: string | null
  is_admin: boolean
}

type ProfileContextValue = {
  profile: ProfileData | null
  loading: boolean
  // Optimistically patch the cached profile so every consumer updates at once,
  // without a re-fetch. Callers still persist the change to the DB themselves.
  updateProfile: (patch: Partial<ProfileData>) => void
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  loading: true,
  updateProfile: () => {},
})

// Loads the signed-in user's own profile once (via the get_my_profile RPC) and
// shares it, replacing the three separate fetches that Navbar, NotebookClient,
// and ProfileClient each used to make on mount.
export function ProfileProvider({ children }: { children: ReactNode }) {
  const user = useUser()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return }
    const supabase = createClient()
    setLoading(true)
    supabase.rpc('get_my_profile').then(({ data }) => {
      setProfile((data?.[0] as ProfileData | undefined) ?? null)
      setLoading(false)
    })
  }, [user])

  const updateProfile = (patch: Partial<ProfileData>) =>
    setProfile(prev => (prev ? { ...prev, ...patch } : prev))

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext)
}
